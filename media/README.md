# Launch media

`render_launch.py` builds an editorial montage of **real application screenshots**, with subtle camera movement, Chinese synthesized narration, and Chinese/English captions. It is not a live screen recording or scientific simulation.

## Rebuild

Requirements: Python 3.10+, Pillow, FFmpeg/FFprobe, and macOS `say` with the Tingting voice. No paid API or network call is used.

```sh
python3 -m pip install Pillow
python3 media/render_launch.py --audio-only
python3 media/render_launch.py
```

Inputs are `docs/media/{theory-map,dimension-lab,hyperbook,research-hub,mobile}.jpg` (PNG is also accepted). They must show the corrected release candidate, including scientific status labels and the toy-model notice. Do not substitute concept artwork or old screenshots.

Outputs are ignored by Git under `output/launch/`:

- `NaturalScienceWorld-intro-landscape-1080p.mp4` — 1920×1080, H.264/AAC
- `NaturalScienceWorld-intro-portrait-1080p.mp4` — 1080×1920, H.264/AAC
- `NaturalScienceWorld.zh-CN.srt` and `NaturalScienceWorld.en.srt`
- `cover-landscape.png` and `cover-portrait.png`
- `timeline.json`, `media-provenance.json`, and `SHA256SUMS.txt`

The portrait edit uses a real narrow-viewport screenshot for the map and clearly framed desktop screenshots for other workspaces. No third-party music, stock video, portraits, or voice imitation is included. The source script records the exact narration. All output frames disclose synthesized narration; platform posts must retain that disclosure.

Before publishing, inspect representative frames from both orientations, check audio duration and intelligibility, verify anonymous access to the public repository, and record each platform's actual publication state separately. Rendering a video is not proof that any platform has published it.
