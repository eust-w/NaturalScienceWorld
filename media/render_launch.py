#!/usr/bin/env python3
"""Build a bilingual launch film from verified UI screenshots, never concept art.

Requires Python 3.10+, Pillow, FFmpeg/FFprobe and macOS say with Tingting.
No network API, third-party music, or scientific simulation is used.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import math
import subprocess
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont, ImageOps

ROOT = Path(__file__).resolve().parents[1]
FPS = 30
SCENES = [
    ("把科学知识连接起来", "一个可以探索的自然科学超书", "theory-map", [
        ("学到相对论、量子力学和宇宙学时，", "Relativity, quantum mechanics, cosmology..."),
        ("你有没有想把它们放到同一张地图上？", "What if they shared one map?")]),
    ("NaturalScienceWorld", "阅读 × 可视化 × 研究资料", "theory-map", [
        ("这是自然科学世界，一个早期的交互超书项目。", "NaturalScienceWorld is an early interactive hyperbook."),
        ("它把阅读、可视化演示和研究资料整理连接起来。", "It connects reading, visual demonstrations, and research notes.")]),
    ("先看证据，再谈理论", "已建立 · 活跃研究 · 工作模型 · 推测", "theory-map", [
        ("在理论图谱里，切换视角，查看理论摘要和开放问题。", "Explore theory summaries and open questions."),
        ("已建立理论、活跃研究、工作模型与推测，", "Established science, active research, working models, and speculation"),
        ("使用不同的状态标签。", "remain visibly distinct through status labels.")]),
    ("拖动参数，观察图形", "玩具可视化 ≠ 物理验证", "dimension-lab", [
        ("维度实验室可以调整参数，观察图形变化。", "Adjust parameters and observe changes in the Dimension Lab."),
        ("这是帮助理解界面的玩具模型，", "This is an illustrative toy visualization,"),
        ("并不是物理求解器，也不能验证新理论。", "not a physics solver or evidence for a new theory.")]),
    ("从章节预览，到可靠来源", "Markdown 正文 · 参考资料 · 持续校对", "hyperbook", [
        ("超书提供章节预览，正文与参考资料保存在仓库中。", "Chapter previews connect to prose and references in the repository."),
        ("内容仍在逐步完善，也欢迎补充可靠来源。", "The content is still developing. Reliable sources are welcome.")]),
    ("保留问题，也保留证据边界", "理论条目 · 证据线索 · 开放问题", "research-hub", [
        ("研究库整理理论条目、证据线索和待解决的问题。", "The registry organizes theories, evidence leads, and open questions."),
        ("项目自己的假说始终标为推测，", "Project hypotheses remain explicitly speculative,"),
        ("不会被当作科学发现。", "and are not presented as scientific discoveries.")]),
    ("一起把它做得更可靠", "github.com/eust-w/NaturalScienceWorld", "theory-map", [
        ("如果你喜欢科学可视化，欢迎一起校对内容、补充引用，", "Help review content and add sources,"),
        ("或实现一个可复现的演示。", "or build a reproducible demonstration."),
        ("这是阿尔法版本，本片使用真实界面截图和合成配音。", "Alpha release. Real UI screenshots; synthesized narration.")]),
]


def run(args):
    subprocess.run([str(a) for a in args], check=True, stdout=subprocess.DEVNULL)


def duration(path):
    return float(subprocess.check_output([
        "ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(path)
    ], text=True).strip())


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def timestamp(seconds):
    m = round(seconds * 1000)
    return f"{m // 3600000:02}:{m // 60000 % 60:02}:{m // 1000 % 60:02},{m % 1000:03}"


def wrap(draw, text, font, width):
    words, sep = (text.split(), " ") if text.isascii() else (list(text), "")
    lines, line = [], ""
    for word in words:
        proposed = line + (sep if line else "") + word
        if line and draw.textlength(proposed, font=font) > width:
            lines.append(line)
            line = word
        else:
            line = proposed
    return lines + ([line] if line else [])


def screen_path(folder, stem):
    for suffix in (".jpg", ".png", ".jpeg"):
        path = folder / (stem + suffix)
        if path.is_file():
            return path
    raise FileNotFoundError(f"Missing verified screenshot: {folder / stem}")


def build_audio(args, build):
    cues, lengths, elapsed = [], [], 0.0
    for index, (_, _, _, text_cues) in enumerate(SCENES):
        files, local_time = [], 0.0
        for number, (zh, en) in enumerate(text_cues):
            target = build / f"voice-{index}-{number}.aiff"
            cache = target.with_suffix(".json")
            identity = {"text": zh, "voice": args.voice, "rate": args.rate}
            if not target.exists() or not cache.exists() or json.loads(cache.read_text()) != identity:
                run(["say", "-v", args.voice, "-r", args.rate, "-o", target, zh])
                cache.write_text(json.dumps(identity, ensure_ascii=False), encoding="utf-8")
            seconds = duration(target)
            cues.append({"scene": index, "start": elapsed + local_time,
                         "end": elapsed + local_time + seconds, "zh": zh, "en": en})
            files.append(target)
            local_time += seconds
        concat = build / f"voice-{index}.txt"
        concat.write_text("\n".join(f"file '{p.name}'" for p in files) + "\n")
        run(["ffmpeg", "-y", "-v", "error", "-f", "concat", "-safe", "0", "-i", concat,
             "-af", "apad=pad_dur=0.6,loudnorm=I=-16:TP=-1.5:LRA=11", "-ar", "48000",
             "-ac", "2", build / f"voice-{index}.wav"])
        seconds = math.ceil((local_time + 0.6) * FPS) / FPS
        lengths.append(seconds)
        elapsed += seconds
    return lengths, cues


def render(args, orientation, lengths, cues):
    out, build = args.output, args.output / "render"
    portrait = orientation == "portrait"
    width, height = (1080, 1920) if portrait else (1920, 1080)
    margin = 64 if portrait else 72
    font = lambda size: ImageFont.truetype(str(args.font), size)
    bg, ink, muted, accent = "#0b211b", "#f5f8f4", "#a9bfb6", "#73dab2"
    mx, my, mw, mh = (64, 455, 952, 1000) if portrait else (72, 238, 1776, 650)
    scene_start, clips = 0.0, []
    for index, (title, detail, stem, _) in enumerate(SCENES):
        seconds, frames = lengths[index], round(lengths[index] * FPS)
        plate = Image.new("RGB", (width, height), bg)
        draw = ImageDraw.Draw(plate)
        draw.rectangle((margin, 46, margin + 6, 76), fill=accent)
        draw.text((margin + 24, 44), "NATURAL SCIENCE WORLD", font=font(25), fill=accent)
        label = "ALPHA / 0.1"
        draw.text((width-margin-draw.textlength(label, font=font(22)), 47), label, font=font(22), fill=muted)
        draw.line((margin, 99, width-margin, 99), fill="#24483a", width=2)
        title_size = 58 if portrait and index == 1 else 64
        titles = wrap(draw, title, font(title_size), width-margin*2)
        ty = 134 if portrait else 119
        for n, text in enumerate(titles):
            draw.text((margin, ty+n*(title_size+24)), text, font=font(title_size), fill=ink)
        dy = ty + len(titles)*(title_size+24) + (18 if portrait else -3)
        for n, text in enumerate(wrap(draw, detail, font(30 if portrait else 27), width-margin*2)):
            draw.text((margin, dy+n*44), text, font=font(30 if portrait else 27), fill=accent if index==3 else muted)
        if portrait:
            draw.text((margin, 391), "AN INTERACTIVE SCIENCE HYPERBOOK", font=font(21), fill=accent)
        # Narrow capture keeps the map readable in the vertical edit.
        if portrait and index in (0, 1, 2, 6):
            stem = "mobile"
        source = Image.open(screen_path(args.screens, stem)).convert("RGB")
        screen = Image.new("RGB", (mw, mh), "#f5f8f5")
        if portrait and stem != "mobile":
            fitted = ImageOps.contain(source, (mw, mh-220))
            screen.paste(fitted, ((mw-fitted.width)//2, 28))
            note = ImageDraw.Draw(screen)
            annotations = {
                "dimension-lab": ["调整界面参数", "观察示意图变化", "不用于物理验证"],
                "hyperbook": ["只读章节预览", "仓库保留正文与引用", "欢迎科学内容校对"],
                "research-hub": ["明确标注理论状态", "保留尚未解决的问题", "项目假说明示为推测"],
            }
            start_y = max(485, fitted.height + 65)
            for n, text in enumerate(annotations.get(stem, []) if fitted.height < 600 else []):
                note.text((38, start_y+n*88), f"0{n+1}", font=font(26), fill="#006d43")
                note.text((112, start_y-7+n*88), text, font=font(38), fill="#0b211b")
            note.text((35, mh-170), "桌面工作区 / Desktop workspace", font=font(27), fill="#31664f")
            for n, text in enumerate(wrap(note, detail, font(36), mw-70)):
                note.text((35, mh-112+n*50), text, font=font(36), fill="#0b211b")
        else:
            fitted = ImageOps.contain(source, (mw, mh))
            screen.paste(fitted, ((mw-fitted.width)//2, (mh-fitted.height)//2))
        screenshot = build / f"screen-{orientation}-{index}.png"
        screen.save(screenshot)
        draw.rectangle((mx-2, my-2, mx+mw+2, my+mh+2), outline="#56836d", width=2)
        draw.text((margin, height-85 if portrait else height-35),
                  f"{index+1:02} / 07  真实界面截图 · 合成配音", font=font(21 if portrait else 18), fill=muted)
        footer = "EDUCATIONAL PROTOTYPE"
        draw.text((width-margin-draw.textlength(footer, font=font(18)), height-42 if portrait else height-35),
                  footer, font=font(18), fill=muted)
        plate_path = build / f"plate-{orientation}-{index}.png"
        plate.save(plate_path)
        if index == 0:
            cover = plate.copy()
            cover.paste(screen, (mx, my))
            cover.save(out / f"cover-{orientation}.png")
        inputs = ["ffmpeg", "-y", "-v", "error", "-loop", "1", "-framerate", FPS, "-i", plate_path,
                  "-loop", "1", "-framerate", FPS, "-i", screenshot]
        filters = [
            f"[1:v]scale={mw*2}:{mh*2},zoompan=z='1+0.008*on/{frames}':x='iw/2-iw/zoom/2':y='ih/2-ih/zoom/2':d=1:s={mw}x{mh}:fps={FPS}[screen]",
            f"[0:v][screen]overlay={mx}:{my}[media]"]
        current, next_input = "media", 2
        for number, cue in enumerate(c for c in cues if c["scene"] == index):
            ch = 292 if portrait else 124
            caption = Image.new("RGBA", (width, ch), (0, 0, 0, 0))
            painter, y = ImageDraw.Draw(caption), 0
            for language, size, color in (("zh", 40 if portrait else 35, ink), ("en", 27 if portrait else 24, muted)):
                for text in wrap(painter, cue[language], font(size), width-margin*2):
                    x = (width-painter.textlength(text, font=font(size)))/2
                    painter.text((x, y), text, font=font(size), fill=color)
                    y += size+13
                y += 7
            if y > ch:
                raise RuntimeError(f"Caption overflow in {orientation} scene {index}")
            path = build / f"caption-{orientation}-{index}-{number}.png"
            caption.save(path)
            inputs += ["-loop", "1", "-framerate", FPS, "-i", path]
            label = f"caption{number}"
            start, end = cue["start"]-scene_start, cue["end"]-scene_start
            filters.append(f"[{current}][{next_input}:v]overlay=0:{1510 if portrait else 918}:enable='between(t,{start:.4f},{end:.4f})'[{label}]")
            current, next_input = label, next_input+1
        inputs += ["-i", build / f"voice-{index}.wav"]
        filters.append(f"[{current}]fade=t=in:st=0:d=0.18,fade=t=out:st={seconds-.18:.4f}:d=0.18,format=yuv420p[video]")
        clip = build / f"{orientation}-{index}.mp4"
        run(inputs + ["-filter_complex", ";".join(filters), "-map", "[video]", "-map", f"{next_input}:a",
                      "-af", "apad", "-t", f"{seconds:.6f}", "-r", FPS, "-c:v", "libx264", "-preset", "veryfast",
                      "-crf", "19", "-threads", "3", "-c:a", "aac", "-b:a", "192k", "-ar", "48000", clip])
        clips.append(clip)
        scene_start += seconds
        print(f"{orientation}: scene {index+1}/7 complete", flush=True)
    concat = build / f"{orientation}.txt"
    concat.write_text("\n".join(f"file '{p.name}'" for p in clips)+"\n")
    target = out / f"NaturalScienceWorld-intro-{orientation}-1080p.mp4"
    run(["ffmpeg", "-y", "-v", "error", "-f", "concat", "-safe", "0", "-i", concat,
         "-c", "copy", "-movflags", "+faststart", target])
    return {"file": target.name, "duration_seconds": duration(target), "width": width, "height": height,
            "sha256": digest(target), "bytes": target.stat().st_size}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--screens", type=Path, default=ROOT / "docs/media")
    parser.add_argument("--output", type=Path, default=ROOT / "output/launch")
    parser.add_argument("--font", type=Path, default=Path("/System/Library/Fonts/Hiragino Sans GB.ttc"))
    parser.add_argument("--voice", default="Tingting")
    parser.add_argument("--rate", type=int, default=175)
    parser.add_argument("--audio-only", action="store_true")
    args = parser.parse_args()
    args.output, args.screens = args.output.resolve(), args.screens.resolve()
    build = args.output / "render"
    build.mkdir(parents=True, exist_ok=True)
    lengths, cues = build_audio(args, build)
    for language, filename in (("zh", "NaturalScienceWorld.zh-CN.srt"), ("en", "NaturalScienceWorld.en.srt")):
        (args.output / filename).write_text("\n\n".join(
            f"{i+1}\n{timestamp(c['start'])} --> {timestamp(c['end'])}\n{c[language]}"
            for i, c in enumerate(cues))+"\n", encoding="utf-8")
    (args.output / "timeline.json").write_text(json.dumps({"scenes": SCENES, "durations": lengths, "cues": cues}, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Narration timeline: {sum(lengths):.2f}s", flush=True)
    if args.audio_only:
        return
    if not 65 <= sum(lengths) <= 90:
        raise ValueError("Narration outside intended 65–90 seconds; adjust --rate and review.")
    screenshots = {stem: screen_path(args.screens, stem) for stem in ("theory-map", "dimension-lab", "hyperbook", "research-hub", "mobile")}
    with ThreadPoolExecutor(max_workers=2) as executor:
        results = list(executor.map(lambda o: render(args, o, lengths, cues), ("landscape", "portrait")))
    provenance = {
        "project": "NaturalScienceWorld", "release": "v0.1.0-alpha.1", "created_on": "2026-10-28",
        "visual_source": "Real release-candidate UI screenshots, editorial montage with subtle pan/zoom.",
        "screenshots": {stem: {"file": str(p.relative_to(ROOT)) if p.is_relative_to(ROOT) else p.name, "sha256": digest(p)} for stem, p in screenshots.items()},
        "synthetic_narration": {"engine": "macOS say", "voice": args.voice, "rate": args.rate},
        "music": "none", "captions": "Chinese and English, burned in and SRT",
        "limitations": ["Educational Alpha", "Toy visualization, not physics solver", "Project hypotheses remain speculative", "Screenshot montage, not live screen recording"],
        "videos": results,
    }
    (args.output / "media-provenance.json").write_text(json.dumps(provenance, ensure_ascii=False, indent=2), encoding="utf-8")
    media_names = ["NaturalScienceWorld-intro-landscape-1080p.mp4", "NaturalScienceWorld-intro-portrait-1080p.mp4",
                   "NaturalScienceWorld.zh-CN.srt", "NaturalScienceWorld.en.srt", "cover-landscape.png",
                   "cover-portrait.png", "timeline.json", "media-provenance.json"]
    outputs = sorted(args.output / name for name in media_names)
    (args.output / "SHA256SUMS.txt").write_text("\n".join(f"{digest(p)}  {p.name}" for p in outputs)+"\n")
    for result in results:
        print(json.dumps(result), flush=True)


if __name__ == "__main__":
    main()
