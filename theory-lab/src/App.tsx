import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  ArrowLeft,
  Atom,
  BookOpen,
  ChevronRight,
  Database,
  Eye,
  FileText,
  FlaskConical,
  Gauge,
  Globe2,
  HelpCircle,
  Languages,
  Lightbulb,
  Link2,
  ListFilter,
  Network,
  Play,
  RotateCcw,
  Search,
  Settings,
  ShieldCheck,
  Target
} from "lucide-react";
import {
  defaultLocale,
  languageOptions,
  lensLabels,
  statusLabels,
  theories,
  uiText
} from "./data/theoryMap";
import type { LensId, Locale, TheoryNode, TheoryStatus } from "./types";
import theoryRegistry from "../../research-hub/theories/theory-registry.json";

type ModeId = "map" | "lab" | "book" | "research";
type StatusFilter = "all" | TheoryStatus;

const localeStorageKey = "natural-science-world.locale";

type RegistrySource = {
  citation_key: string;
  title: string;
  url: string;
  role: string;
  note: string;
};

// The UI remains a curated subset; aliases explicitly link it to canonical sources.
const registryIds: Record<string, string> = {
  "classical-mechanics": "classical-mechanics",
  "general-relativity": "general-relativity",
  "quantum-mechanics": "quantum-mechanics",
  "quantum-field-theory": "quantum-field-theory",
  thermodynamics: "thermodynamics-statistical-mechanics",
  "lambda-cdm": "lambda-cdm-cosmology",
  "quantum-gravity": "quantum-gravity",
  "observer-information-frame": "observer-information-frame",
  "dimensional-resonance": "dimensional-resonance-hypothesis"
};
const sourceEntries: Array<{ id: string; sources?: RegistrySource[] }> = theoryRegistry.theories;

function sourcesForTheory(id: string): RegistrySource[] {
  return sourceEntries.find((entry) => entry.id === registryIds[id])?.sources ?? [];
}

const sourceRoleLabels: Record<Locale, Record<string, string>> = {
  "zh-CN": { background: "背景知识", "empirical-evidence": "观测证据", "theoretical-background": "理论研究背景" },
  "en-US": { background: "Background", "empirical-evidence": "Empirical evidence", "theoretical-background": "Theoretical background" }
};

const modeIcons = {
  map: Network,
  lab: FlaskConical,
  book: BookOpen,
  research: Database
};

const modeLabels: Record<Locale, Record<ModeId, string>> = {
  "zh-CN": {
    map: "理论图谱",
    lab: "维度实验室",
    book: "超书",
    research: "研究库"
  },
  "en-US": {
    map: "Theory Map",
    lab: "Dimension Lab",
    book: "Hyperbook",
    research: "Research Hub"
  }
};

const workspaceCopy = {
  "zh-CN": {
    brandSubtitle: "自然科学世界",
    filters: "透镜过滤器",
    statusLegend: "状态图例",
    theoryDetail: "理论详情",
    selectedTheory: "当前理论",
    backToMap: "返回理论图谱",
    openChapter: "打开章节",
    enterLab: "进入实验",
    viewResearch: "在研究库中查看",
    allRelations: "维度与规划演示",
    allQuestions: "查看全部问题",
    currentTheory: "当前理论",
    experimentSettings: "实验室设置",
    run: "记录快照",
    pause: "暂停",
    reset: "重置",
    step: "单步",
    status: "状态",
    time: "时间",
    stepSize: "步长",
    pulseCount: "快照数",
    recentRuns: "本次会话快照",
    viewAllRecords: "查看全部记录",
    chapterDirectory: "章节目录",
    collapse: "收起目录",
    claims: "命题",
    evidence: "来源引用",
    previous: "上一节",
    next: "下一节",
    registry: "理论注册表",
    evidenceMatrix: "证据矩阵",
    hypothesisQueue: "假说队列",
    demoHooks: "演示挂钩",
    searchPlaceholder: "搜索理论名称或关键词",
    statusAll: "状态：全部",
    scaleAll: "尺度：全部",
    registerTheory: "注册理论",
    theory: "理论",
    scale: "尺度",
    dimensionModel: "维度模型",
    openIssues: "开放问题",
    falsificationPath: "证伪路径",
    retainedTheory: "保留的理论",
    testableConsequence: "可检验后果",
    relatedDemo: "关联演示",
    establishedGroup: "当前筛选结果",
    speculativeGroup: "猜想 / 推测理论",
    noResults: "没有匹配的理论",
    claimTitle: "命题",
    equationTitle: "关键方程",
    selectedStatus: "已选",
    statusFilterAll: "全部状态"
  },
  "en-US": {
    brandSubtitle: "Natural Science World",
    filters: "Lens filters",
    statusLegend: "Status legend",
    theoryDetail: "Theory detail",
    selectedTheory: "Current theory",
    backToMap: "Back to map",
    openChapter: "Open chapter",
    enterLab: "Enter lab",
    viewResearch: "View in research hub",
    allRelations: "Dimensions and planned demo",
    allQuestions: "View all questions",
    currentTheory: "Current theory",
    experimentSettings: "Lab settings",
    run: "Record snapshot",
    pause: "Pause",
    reset: "Reset",
    step: "Step",
    status: "Status",
    time: "Time",
    stepSize: "Step",
    pulseCount: "Snapshots",
    recentRuns: "Session snapshots",
    viewAllRecords: "View all records",
    chapterDirectory: "Chapter directory",
    collapse: "Collapse",
    claims: "Claims",
    evidence: "References",
    previous: "Previous",
    next: "Next",
    registry: "Theory registry",
    evidenceMatrix: "Evidence matrix",
    hypothesisQueue: "Hypothesis queue",
    demoHooks: "Demo hooks",
    searchPlaceholder: "Search theory or keyword",
    statusAll: "Status: all",
    scaleAll: "Scale: all",
    registerTheory: "Register theory",
    theory: "Theory",
    scale: "Scale",
    dimensionModel: "Dimension model",
    openIssues: "Open questions",
    falsificationPath: "Falsification path",
    retainedTheory: "Retained theories",
    testableConsequence: "Testable consequence",
    relatedDemo: "Related demo",
    establishedGroup: "Current results",
    speculativeGroup: "Speculative theories",
    noResults: "No matching theories",
    claimTitle: "Claim",
    equationTitle: "Key equations",
    selectedStatus: "Selected",
    statusFilterAll: "All statuses"
  }
} satisfies Record<Locale, Record<string, string>>;

const chapterOutline = {
  "zh-CN": [
    { id: "preface", title: "序章" },
    { id: "map", title: "理论图谱" },
    { id: "spacetime", title: "2.2 从牛顿时空到弯曲时空" },
    { id: "fields", title: "2.3 场与粒子" },
    { id: "dimensions", title: "维度" },
    { id: "hypotheses", title: "新假说" },
    { id: "log", title: "研究日志" }
  ],
  "en-US": [
    { id: "preface", title: "Preface" },
    { id: "map", title: "Theory Map" },
    { id: "spacetime", title: "2.2 From Newtonian Space to Curved Spacetime" },
    { id: "fields", title: "2.3 Fields and Particles" },
    { id: "dimensions", title: "Dimensions" },
    { id: "hypotheses", title: "New Hypotheses" },
    { id: "log", title: "Research Log" }
  ]
} satisfies Record<Locale, Array<{ id: string; title: string }>>;

type RunSnapshot = { id: string; time: string; pulse: number; geometry: number; observability: number; pressure: number };

const chapterPreviews = {
  preface: {
    source: "00-preface.md",
    status: "working-model",
    zh: ["序章：让科学知识可以连接与探索", "本项目将 Markdown 章节、交互界面和结构化研究记录组织在一起。目前是持续完善的 Alpha 教育原型。", "章节解释概念；界面帮助浏览；研究库记录证据、开放问题和假说边界。"],
    en: ["Preface: connect and explore scientific knowledge", "This Alpha educational prototype brings Markdown chapters, an interactive interface, and structured research notes together.", "Chapters explain concepts; the interface supports exploration; the registry records evidence, open questions, and hypothesis boundaries."]
  },
  map: {
    source: "01-theory-map.md",
    status: "working-model",
    zh: ["理论图谱：多种组织视角", "图谱按尺度、维度、模型中的对象、动力学和证据组织理论。连线是阅读导航，不表示已经建立的数学推导。", "浏览界面展示 9 个条目；完整 JSON 注册表包含 10 个条目。演示标识是未来实现的入口。"],
    en: ["Theory Map: several organizing lenses", "The map organizes theories by scale, dimension, modeled objects, dynamics, and evidence. Links are reading guides, not mathematical derivations.", "The interface presents 9 entries; the JSON registry contains 10. Demo identifiers name planned implementations."]
  },
  spacetime: {
    source: "03-current-theories.md",
    status: "established",
    zh: ["广义相对论：时空作为动力结构", "广义相对论用时空几何描述引力。应力能量与时空曲率通过场方程关联，自由落体沿测地线运动。", "以下为章节提纲的教学预览。量子引力与奇点问题仍未解决，实验室中的图形不是这些方程的数值解。"],
    en: ["General Relativity: spacetime as dynamic structure", "General relativity describes gravity through spacetime geometry. The field equations relate stress-energy to curvature, and freely falling bodies follow geodesics.", "This is an educational outline preview. Quantum gravity and singularities remain open questions; the lab graphic is not a numerical solution of these equations."]
  },
  fields: {
    source: "03-current-theories.md",
    status: "established",
    zh: ["场与粒子：当前理论基线", "量子场论以场的激发描述粒子，用对称性组织相互作用。标准模型描述电磁、弱和强相互作用。", "本节目前是提纲，尚无对应的场方程求解器；引力不包含在标准模型中。"],
    en: ["Fields and particles: the current baseline", "Quantum field theory describes particles as excitations of fields and organizes interactions through symmetry. The Standard Model covers electromagnetic, weak, and strong interactions.", "This section is an outline, with no corresponding field-equation solver yet. The Standard Model does not include gravity."]
  },
  dimensions: {
    source: "02-dimensions.md",
    status: "working-model",
    zh: ["维度：先说明是哪一种", "空间维数、时空维数、相空间维数和希尔伯特空间维数描述不同的对象，不能互换。", "常规相对论使用三维空间加一维时间。信息坐标与额外物理维度需要分别定义；交互示意中的参数不能作为额外维度的证据。"],
    en: ["Dimensions: name the kind first", "Spatial, spacetime, phase-space, and Hilbert-space dimensions describe different objects and are not interchangeable.", "Ordinary relativity uses three spatial dimensions and one time dimension. Information coordinates and extra physical dimensions require separate definitions; illustrative controls provide no evidence for extra dimensions."]
  },
  hypotheses: {
    source: "04-new-hypotheses.md",
    status: "speculative",
    zh: ["新假说：先记录边界", "项目内的假说种子必须标记为未验证。维度共振目前没有数学形式、可检验预测或实验支持。", "贡献假说时需说明：保留哪些已有理论、引入什么假设、能计算什么后果，以及什么结果会使其失败。"],
    en: ["New hypotheses: record the boundaries", "Project-local hypothesis seeds must be marked unverified. Dimensional resonance currently has no mathematical formalism, testable prediction, or experimental support.", "A proposal should specify which existing results it preserves, its new assumptions, calculable consequences, and conditions that would falsify it."]
  },
  log: {
    source: "99-research-log.md",
    status: "working-model",
    zh: ["研究日志：保留推理过程", "2026-07-08：初始化三轨项目结构，并建立理论状态标签与维度分类。", "日志用于记录尚未形成章节的观察和工作笔记，不代表已经完成的实验或已发表成果。"],
    en: ["Research log: preserve the reasoning trail", "2026-07-08: initialized the three-track structure, theory status labels, and dimension taxonomy.", "The log stores observations and working notes before they become chapters. It does not represent completed experiments or published research."]
  }
} satisfies Record<string, { source: string; status: TheoryStatus; zh: string[]; en: string[] }>;

const relations = [
  ["general-relativity", "quantum-mechanics", "量子引力问题", "quantum gravity question"],
  ["general-relativity", "thermodynamics", "黑洞热力学", "black-hole thermodynamics"],
  ["general-relativity", "quantum-gravity", "研究方向", "research direction"],
  ["quantum-mechanics", "quantum-field-theory", "量子场", "quantum fields"],
  ["general-relativity", "lambda-cdm", "宇宙学建模", "cosmological models"],
  ["quantum-field-theory", "quantum-gravity", "开放问题", "open question"],
  ["observer-information-frame", "thermodynamics", "组织类比", "organizing analogy"],
  ["observer-information-frame", "dimensional-resonance", "未验证关联", "unverified link"],
  ["lambda-cdm", "dimensional-resonance", "未验证关联", "unverified link"],
  ["quantum-gravity", "dimensional-resonance", "未验证关联", "unverified link"]
] as const;

const graphLayout: Record<string, { x: number; y: number }> = {
  "classical-mechanics": { x: 155, y: 135 },
  "general-relativity": { x: 390, y: 155 },
  "quantum-mechanics": { x: 660, y: 170 },
  "quantum-field-theory": { x: 540, y: 330 },
  thermodynamics: { x: 180, y: 380 },
  "lambda-cdm": { x: 780, y: 330 },
  "quantum-gravity": { x: 650, y: 485 },
  "observer-information-frame": { x: 320, y: 520 },
  "dimensional-resonance": { x: 790, y: 550 }
};

const mobileModeLabels: Record<Locale, Record<ModeId, string>> = {
  "zh-CN": {
    map: "图谱",
    lab: "实验",
    book: "超书",
    research: "研究"
  },
  "en-US": {
    map: "Map",
    lab: "Lab",
    book: "Book",
    research: "Research"
  }
};

function readInitialLocale(): Locale {
  if (typeof window === "undefined") {
    return defaultLocale;
  }

  const storedLocale = window.localStorage.getItem(localeStorageKey);
  const supported = languageOptions.some((option) => option.id === storedLocale);
  return supported ? (storedLocale as Locale) : defaultLocale;
}

export function App() {
  const [locale, setLocale] = useState<Locale>(readInitialLocale);
  const [activeMode, setActiveMode] = useState<ModeId>("map");
  const [activeLens, setActiveLens] = useState<LensId>("all");
  const [selectedId, setSelectedId] = useState("general-relativity");
  const [spatialDimensions, setSpatialDimensions] = useState(3);
  const [energyScale, setEnergyScale] = useState(54);
  const [informationCoupling, setInformationCoupling] = useState(37);
  const [pulseCount, setPulseCount] = useState(0);
  const [researchQuery, setResearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [selectedChapter, setSelectedChapter] = useState("spacetime");
  const [runHistory, setRunHistory] = useState<RunSnapshot[]>([]);

  const t = uiText[locale];
  const copy = workspaceCopy[locale];
  const labels = statusLabels[locale];
  const lenses = lensLabels[locale];
  const modes = modeLabels[locale];

  const selectedTheory =
    theories.find((theory) => theory.id === selectedId) ?? theories[0];

  const visibleTheories = useMemo(() => {
    if (activeLens === "all") {
      return theories;
    }
    return theories.filter((theory) => theory.lenses.includes(activeLens));
  }, [activeLens]);

  const model = useMemo(() => {
    const geometryLoad = Math.min(
      100,
      Math.round(spatialDimensions * 9 + energyScale * 0.42 + informationCoupling * 0.18)
    );
    const observability = Math.max(
      6,
      Math.round(92 - Math.abs(spatialDimensions - 3) * 9 - energyScale * 0.22 + informationCoupling * 0.2)
    );
    const hypothesisPressure = Math.min(
      100,
      Math.round(spatialDimensions * 6 + energyScale * 0.34 + informationCoupling * 0.48)
    );

    return {
      geometryLoad,
      observability,
      hypothesisPressure
    };
  }, [energyScale, informationCoupling, spatialDimensions]);

  const filteredResearch = useMemo(() => {
    const query = researchQuery.trim().toLowerCase();
    return theories.filter((theory) => {
      const content = theory.content[locale];
      const matchesQuery =
        query.length === 0 ||
        content.name.toLowerCase().includes(query) ||
        content.summary.toLowerCase().includes(query) ||
        content.openQuestions.some((question) => question.toLowerCase().includes(query));
      const matchesStatus = statusFilter === "all" || theory.status === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [locale, researchQuery, statusFilter]);

  useEffect(() => {
    window.localStorage.setItem(localeStorageKey, locale);
  }, [locale]);

  function handleRunPulse() {
    const nextPulseCount = pulseCount + 1;
    setPulseCount(nextPulseCount);
    setRunHistory((history) => [
      {
        id: `snapshot-${nextPulseCount}`,
        time: new Date().toLocaleTimeString(locale, { hour12: false }),
        pulse: nextPulseCount,
        geometry: model.geometryLoad,
        observability: model.observability,
        pressure: model.hypothesisPressure
      },
      ...history
    ].slice(0, 5));
  }

  function resetModel() {
    setSpatialDimensions(3);
    setEnergyScale(54);
    setInformationCoupling(37);
    setPulseCount(0);
    setRunHistory([]);
  }

  function changeMode(mode: ModeId) {
    if (mode === "book") {
      const chapters: Record<string, string> = {
        "general-relativity": "spacetime",
        "quantum-mechanics": "fields",
        "quantum-field-theory": "fields",
        "observer-information-frame": "hypotheses",
        "dimensional-resonance": "hypotheses"
      };
      setSelectedChapter(chapters[selectedId] ?? "map");
    }
    setActiveMode(mode);
  }

  return (
    <main className="app-shell">
      <Header
        activeMode={activeMode}
        copy={copy}
        locale={locale}
        modes={modes}
        onChangeLocale={setLocale}
        onModeChange={changeMode}
      />

      {activeMode === "map" && (
        <TheoryMapWorkspace
          activeLens={activeLens}
          copy={copy}
          labels={labels}
          lenses={lenses}
          locale={locale}
          onLensChange={setActiveLens}
          onModeChange={changeMode}
          onSelectTheory={setSelectedId}
          selectedTheory={selectedTheory}
          theories={visibleTheories}
          text={t}
        />
      )}

      {activeMode === "lab" && (
        <DimensionLabWorkspace
          copy={copy}
          energyScale={energyScale}
          informationCoupling={informationCoupling}
          labels={labels}
          locale={locale}
          model={model}
          onBackToMap={() => setActiveMode("map")}
          onEnergyChange={setEnergyScale}
          onInformationChange={setInformationCoupling}
          onOpenChapter={() => changeMode("book")}
          onReset={resetModel}
          onRun={handleRunPulse}
          onSpatialChange={setSpatialDimensions}
          pulseCount={pulseCount}
          runHistory={runHistory}
          selectedTheory={selectedTheory}
          spatialDimensions={spatialDimensions}
          text={t}
        />
      )}

      {activeMode === "book" && (
        <HyperbookWorkspace
          chapterId={selectedChapter}
          copy={copy}
          labels={labels}
          locale={locale}
          onBackToMap={() => setActiveMode("map")}
          onChapterChange={setSelectedChapter}
          onEnterLab={() => setActiveMode("lab")}
          onViewResearch={() => setActiveMode("research")}
          selectedTheory={selectedTheory}
          text={t}
        />
      )}

      {activeMode === "research" && (
        <ResearchWorkspace
          copy={copy}
          filteredTheories={filteredResearch}
          labels={labels}
          locale={locale}
          onQueryChange={setResearchQuery}
          onSelectTheory={setSelectedId}
          onStatusFilterChange={setStatusFilter}
          query={researchQuery}
          selectedTheory={selectedTheory}
          statusFilter={statusFilter}
        />
      )}

      <MobileBottomNav
        activeMode={activeMode}
        modes={mobileModeLabels[locale]}
        onModeChange={changeMode}
      />
    </main>
  );
}

function Header({
  activeMode,
  copy,
  locale,
  modes,
  onChangeLocale,
  onModeChange
}: {
  activeMode: ModeId;
  copy: (typeof workspaceCopy)[Locale];
  locale: Locale;
  modes: Record<ModeId, string>;
  onChangeLocale: (locale: Locale) => void;
  onModeChange: (mode: ModeId) => void;
}) {
  return (
    <header className="top-bar">
      <div className="brand-lockup">
        <div className="brand-mark" aria-hidden="true">
          <Network size={21} />
        </div>
        <div>
          <h1>NaturalScienceWorld</h1>
          <p>{copy.brandSubtitle}</p>
        </div>
      </div>

      <nav className="mode-nav" aria-label="Workspace modes">
        {(Object.keys(modes) as ModeId[]).map((mode) => {
          const Icon = modeIcons[mode];
          return (
            <button
              className={activeMode === mode ? "active" : ""}
              key={mode}
              onClick={() => onModeChange(mode)}
              type="button"
            >
              <Icon size={16} />
              {modes[mode]}
            </button>
          );
        })}
      </nav>

      <div className="top-actions">
        <LanguageSwitch locale={locale} onChange={onChangeLocale} />
<span className="alpha-label">Alpha</span>
      </div>
    </header>
  );
}

function LanguageSwitch({
  locale,
  onChange
}: {
  locale: Locale;
  onChange: (locale: Locale) => void;
}) {
  return (
    <div className="language-switch" aria-label={uiText[locale].languageLabel}>
      <Languages size={16} />
      {languageOptions.map((option) => (
        <button
          key={option.id}
          className={locale === option.id ? "active" : ""}
          onClick={() => onChange(option.id)}
          type="button"
          title={option.label}
        >
          {option.shortLabel}
        </button>
      ))}
    </div>
  );
}

function TheoryMapWorkspace({
  activeLens,
  copy,
  labels,
  lenses,
  locale,
  onLensChange,
  onModeChange,
  onSelectTheory,
  selectedTheory,
  theories: visibleTheories,
  text
}: {
  activeLens: LensId;
  copy: (typeof workspaceCopy)[Locale];
  labels: Record<TheoryStatus, string>;
  lenses: Array<{ id: LensId; label: string }>;
  locale: Locale;
  onLensChange: (lens: LensId) => void;
  onModeChange: (mode: ModeId) => void;
  onSelectTheory: (id: string) => void;
  selectedTheory: TheoryNode;
  theories: TheoryNode[];
  text: (typeof uiText)[Locale];
}) {
  return (
    <section className="workspace workspace-map">
      <aside className="side-rail lens-rail" aria-label={copy.filters}>
        <RailHeading icon={<ListFilter size={18} />} title={copy.filters} />
        <h2 className="mobile-workspace-title">{modeLabels[locale].map}</h2>
        <div className="lens-list">
          {lenses.map((lens) => (
            <button
              className={activeLens === lens.id ? "active" : ""}
              key={lens.id}
              onClick={() => onLensChange(lens.id)}
              type="button"
            >
              <LensIcon lens={lens.id} />
              {lens.label}
            </button>
          ))}
        </div>
        <StatusLegend copy={copy} labels={labels} />
      </aside>

      <section className="map-canvas-region" aria-label={text.mapAria}>
        <TheoryGraph
          locale={locale}
          onSelectTheory={onSelectTheory}
          selectedId={selectedTheory.id}
          theories={visibleTheories}
        />
        <p className="map-note">{locale === "zh-CN" ? "阅读导航图 · 连线不是数学推导，虚线表示研究或项目假说关联" : "Reading guide · links are not derivations; dashed links mark research or project hypotheses"}</p>
      </section>

      <TheoryInspector
        copy={copy}
        labels={labels}
        locale={locale}
        onEnterLab={() => onModeChange("lab")}
        onOpenChapter={() => onModeChange("book")}
        onViewResearch={() => onModeChange("research")}
        theory={selectedTheory}
      />
    </section>
  );
}

function TheoryGraph({
  locale,
  onSelectTheory,
  selectedId,
  theories: visibleTheories
}: {
  locale: Locale;
  onSelectTheory: (id: string) => void;
  selectedId: string;
  theories: TheoryNode[];
}) {
  const visibleIds = new Set(visibleTheories.map((theory) => theory.id));
  const positions = new Map(
    visibleTheories.map((theory) => [
      theory.id,
      graphLayout[theory.id] ?? { x: 104 + theory.x * 8.35, y: 590 - theory.y * 5.1 }
    ])
  );

  return (
    <svg className="theory-graph" viewBox="70 40 860 600" role="img" aria-label="Theory graph">
      <defs>
        <filter id="softNodeShadow" x="-40%" y="-40%" width="180%" height="180%">
          <feDropShadow dx="0" dy="10" floodColor="#16362d" floodOpacity="0.12" stdDeviation="10" />
        </filter>
      </defs>
      <rect className="graph-bg" x="0" y="0" width="1000" height="650" rx="8" />
      <g className="edge-layer">
        {relations.map(([from, to, relationZh, relationEn]) => {
          if (!visibleIds.has(from) || !visibleIds.has(to)) {
            return null;
          }
          const start = positions.get(from);
          const end = positions.get(to);
          if (!start || !end) {
            return null;
          }
          const speculative = [from, to].some((id) => visibleTheories.find((theory) => theory.id === id)?.status !== "established");
          return (
            <g key={`${from}-${to}`}>
              <line
                className={speculative ? "graph-edge dashed" : "graph-edge"}
                x1={start.x}
                x2={end.x}
                y1={start.y}
                y2={end.y}
              />
              <text className="edge-label" x={(start.x + end.x) / 2 + 8} y={(start.y + end.y) / 2 - 8}>
                {locale === "zh-CN" ? relationZh : relationEn}
              </text>
            </g>
          );
        })}
      </g>

      <g className="node-layer">
        {visibleTheories.map((theory) => {
          const position = positions.get(theory.id);
          if (!position) {
            return null;
          }
          const content = theory.content[locale];
          const selected = theory.id === selectedId;
          const radius = selected ? 72 : 58;
          return (
            <g
              className="graph-node"
              key={theory.id}
              onClick={() => onSelectTheory(theory.id)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  onSelectTheory(theory.id);
                }
              }}
              role="button"
              tabIndex={0}
              transform={`translate(${position.x} ${position.y})`}
            >
              {selected && (
                <>
                  <circle className="node-orbit outer" r={radius + 24} />
                  <circle className="node-orbit inner" r={radius + 12} />
                  <circle className="orbit-dot" cx={radius + 12} cy="-8" r="5" />
                </>
              )}
              <circle className="node-disc" data-status={theory.status} filter="url(#softNodeShadow)" r={radius} />
              <TheoryGlyph id={theory.id} status={theory.status} />
              <text className="node-title" y={selected ? 37 : 32}>
                {content.name}
              </text>
            </g>
          );
        })}
      </g>
    </svg>
  );
}

function TheoryGlyph({ id, status }: { id: string; status: TheoryStatus }) {
  const common = { className: "node-glyph", "data-status": status };
  if (id.includes("relativity")) {
    return (
      <g {...common}>
        <path d="M-22 4 C-10 -12, 12 -12, 24 4 C12 18, -10 18, -22 4 Z" />
        <path d="M-20 4 C-6 10, 8 10, 24 4" />
        <path d="M-12 -6 C-8 2, -8 10, -12 18" />
        <path d="M8 -8 C3 1, 3 10, 8 18" />
      </g>
    );
  }
  if (id.includes("quantum-mechanics")) {
    return (
      <g {...common}>
        <ellipse cx="0" cy="0" rx="26" ry="9" />
        <ellipse cx="0" cy="0" rx="26" ry="9" transform="rotate(60)" />
        <ellipse cx="0" cy="0" rx="26" ry="9" transform="rotate(120)" />
        <circle cx="0" cy="0" r="4" />
      </g>
    );
  }
  if (id.includes("field")) {
    return (
      <g {...common}>
        <path d="M-25 18 C-12 -18, 12 -18, 25 18" />
        <path d="M-18 10 L18 10" />
        <path d="M-10 -2 L10 -2" />
        <path d="M0 -20 L0 24" />
      </g>
    );
  }
  if (id.includes("thermo")) {
    return (
      <g {...common}>
        <path d="M-6 -25 L-6 8 A15 15 0 1 0 6 8 L6 -25 Z" />
        <path d="M-6 -12 L6 -12" />
      </g>
    );
  }
  if (id.includes("lambda")) {
    return (
      <g {...common}>
        <path d="M-26 0 C-13 -22, 22 -20, 24 0 C21 24, -16 24, -18 3 C-20 -14, 9 -13, 10 1 C10 10, -6 10, -5 0" />
      </g>
    );
  }
  if (id.includes("gravity")) {
    return (
      <g {...common}>
        <path d="M0 -26 C20 -7, 20 17, 0 28 C-20 17, -20 -7, 0 -26 Z" />
        <path d="M-14 -1 C-6 8, 6 8, 14 -1" />
        <circle cx="-9" cy="-4" r="2" />
        <circle cx="9" cy="-4" r="2" />
      </g>
    );
  }
  if (id.includes("observer")) {
    return (
      <g {...common}>
        <circle cx="0" cy="-11" r="10" />
        <path d="M-23 24 C-18 7, 18 7, 23 24" />
        <path d="M-28 -2 C-8 -19, 8 -19, 28 -2" />
      </g>
    );
  }
  return (
    <g {...common}>
      <path d="M-24 0 C-12 -22, 20 -21, 22 -2 C24 20, -15 24, -18 4 C-20 -12, 8 -14, 9 0 C10 12, -8 11, -7 -1" />
    </g>
  );
}

function TheoryInspector({
  copy,
  labels,
  locale,
  onEnterLab,
  onOpenChapter,
  onViewResearch,
  theory
}: {
  copy: (typeof workspaceCopy)[Locale];
  labels: Record<TheoryStatus, string>;
  locale: Locale;
  onEnterLab: () => void;
  onOpenChapter: () => void;
  onViewResearch: () => void;
  theory: TheoryNode;
}) {
  const content = theory.content[locale];
  return (
    <aside className="inspector theory-inspector" aria-label={copy.theoryDetail}>
      <div className="inspector-title-row">
        <span>{copy.theoryDetail}</span>

      </div>
      <div className="theory-heading">
        <h2>{content.name}</h2>
        <StatusBadge label={labels[theory.status]} status={theory.status} />
        <p>{content.summary}</p>
      </div>

      <DetailBlock title={uiText[locale].dimensionsTitle}>
        <div className="tag-row">
          {content.dimensions.map((dimension) => (
            <span key={dimension}>{dimension}</span>
          ))}
        </div>
      </DetailBlock>

      <DetailBlock title={copy.allRelations}>
        <ul className="compact-list">
          {content.dimensions.slice(0, 3).map((dimension) => (
            <li key={dimension}>{dimension}</li>
          ))}
          <li>{theory.demoHook}</li>
        </ul>
      </DetailBlock>

      <DetailBlock title={uiText[locale].openQuestionsTitle}>
        <ol className="question-list">
          {content.openQuestions.map((question) => (
            <li key={question}>{question}</li>
          ))}
        </ol>
      </DetailBlock>

      <div className="inspector-actions">
        <button className="primary-action" onClick={onEnterLab} type="button">
          <FlaskConical size={17} />
          {copy.enterLab}
        </button>
        <button className="secondary-action" onClick={onOpenChapter} type="button">
          <BookOpen size={17} />
          {copy.openChapter}
        </button>
        <button className="link-action" onClick={onViewResearch} type="button">
          <Database size={16} />
          {copy.viewResearch}
          <ChevronRight size={15} />
        </button>
      </div>
    </aside>
  );
}

function DimensionLabWorkspace({
  copy,
  energyScale,
  informationCoupling,
  labels,
  locale,
  model,
  onBackToMap,
  onEnergyChange,
  onInformationChange,
  onOpenChapter,
  onReset,
  onRun,
  onSpatialChange,
  pulseCount,
  runHistory,
  selectedTheory,
  spatialDimensions,
  text
}: {
  copy: (typeof workspaceCopy)[Locale];
  energyScale: number;
  informationCoupling: number;
  labels: Record<TheoryStatus, string>;
  locale: Locale;
  model: { geometryLoad: number; observability: number; hypothesisPressure: number };
  onBackToMap: () => void;
  onEnergyChange: (value: number) => void;
  onInformationChange: (value: number) => void;
  onOpenChapter: () => void;
  onReset: () => void;
  onRun: () => void;
  onSpatialChange: (value: number) => void;
  pulseCount: number;
  runHistory: RunSnapshot[];
  selectedTheory: TheoryNode;
  spatialDimensions: number;
  text: (typeof uiText)[Locale];
}) {
  const content = selectedTheory.content[locale];
  return (
    <section className="workspace workspace-lab">
      <aside className="side-rail selected-rail">
        <RailHeading icon={<Atom size={18} />} title={copy.currentTheory} />
        <div className="selected-theory-card">
          <h2>{content.name}</h2>
          <StatusBadge label={labels[selectedTheory.status]} status={selectedTheory.status} />
        </div>
        <button className="rail-row" onClick={onBackToMap} type="button">
          <ArrowLeft size={16} />
          {copy.backToMap}
        </button>
        <button className="rail-row" onClick={onOpenChapter} type="button">
          <BookOpen size={16} />
          {copy.openChapter}
          <ChevronRight size={15} />
        </button>
      </aside>

      <section className="lab-stage">
        <div className="stage-heading">
          <div>
            <h2>{modeLabels[locale].lab}</h2>
            <p className="science-notice">{locale === "zh-CN" ? "交互示意模型：所有理论共用同一组任意设定的公式和 SVG 图形。参数与分数没有物理单位，不是所选理论的数值求解，也不是实验结果。" : "Illustrative toy: every theory shares the same arbitrary formulas and SVG. Parameters and scores are unitless, not a numerical solution of the selected theory or experimental results."}</p>
          </div>
        </div>
        <ExperimentCanvas
          informationCoupling={informationCoupling}
          model={model}
          pulseCount={pulseCount}
          spatialDimensions={spatialDimensions}
        />
        <div className="transport-panel">
          <div className="transport-actions">
            <button className="primary-action" onClick={onRun} type="button">
              <Play size={18} />
              {copy.run}
            </button>

            <button className="secondary-action" onClick={onReset} type="button">
              <RotateCcw size={17} />
              {copy.reset}
            </button>

          </div>
          <div className="transport-status">
            <span>{copy.pulseCount}: <strong>{pulseCount}</strong></span>
            <span>{locale === "zh-CN" ? "仅保存本次会话最近 5 条" : "Last 5 snapshots in this session"}</span>
          </div>
        </div>
      </section>

      <aside className="inspector lab-inspector">
        <RailHeading icon={<Settings size={18} />} title={copy.experimentSettings} />
        <div className="slider-stack">
          <Slider
            label={text.spatialDimensions}
            max={10}
            min={2}
            value={spatialDimensions}
            onChange={onSpatialChange}
          />
          <Slider
            label={text.energyScale}
            max={100}
            min={0}
            value={energyScale}
            onChange={onEnergyChange}
          />
          <Slider
            label={text.informationCoupling}
            max={100}
            min={0}
            value={informationCoupling}
            onChange={onInformationChange}
          />
        </div>
        <DetailBlock title={text.outputAria}>
          <Metric icon={<Gauge size={20} />} label={text.metrics.geometryLoad} tone="green" value={model.geometryLoad} />
          <Metric icon={<Eye size={20} />} label={text.metrics.observability} tone="blue" value={model.observability} />
          <Metric icon={<Target size={20} />} label={text.metrics.hypothesisPressure} tone="rose" value={model.hypothesisPressure} />
        </DetailBlock>
        <RunHistory copy={copy} history={runHistory} />
      </aside>
    </section>
  );
}

function ExperimentCanvas({
  informationCoupling,
  model,
  pulseCount,
  spatialDimensions
}: {
  informationCoupling: number;
  model: { geometryLoad: number; observability: number; hypothesisPressure: number };
  pulseCount: number;
  spatialDimensions: number;
}) {
  const warp = Math.max(26, Math.min(110, model.geometryLoad));
  const pulse = 96 + (pulseCount % 48);
  const glow = Math.max(0.16, informationCoupling / 160);
  const gridLines = Array.from({ length: 18 }, (_, index) => index);

  return (
    <svg className="experiment-canvas" viewBox="0 0 920 560" role="img" aria-label="Dimension experiment canvas">
      <defs>
        <radialGradient id="fieldGlow" cx="54%" cy="54%" r="44%">
          <stop offset="0%" stopColor="#0a7f4e" stopOpacity={glow} />
          <stop offset="60%" stopColor="#0a7f4e" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect className="experiment-bg" x="0" y="0" width="920" height="560" rx="8" />
      <ellipse className="field-glow" cx="468" cy="288" rx="300" ry="190" />
      <rect x="0" y="0" width="920" height="560" fill="url(#fieldGlow)" rx="8" />
      <g className="space-grid">
        {gridLines.map((line) => {
          const offset = 90 + line * 42;
          return (
            <path
              d={`M${offset} 98 C${offset - warp * 0.25} 210, ${offset - warp * 0.42} 330, ${offset} 462`}
              key={`v-${line}`}
            />
          );
        })}
        {gridLines.slice(0, 12).map((line) => {
          const offset = 112 + line * 32;
          return (
            <path
              d={`M92 ${offset} C290 ${offset + warp * 0.14}, 510 ${offset + warp * 0.32}, 820 ${offset - warp * 0.02}`}
              key={`h-${line}`}
            />
          );
        })}
      </g>
      <ellipse className="gravity-well" cx="462" cy="304" rx={120 + spatialDimensions * 7} ry={52 + spatialDimensions * 4} />
      <circle className="pulse-ring" cx="596" cy="252" r={pulse} />
      <circle className="pulse-point" cx="596" cy="252" r="15" />
      <g className="axis-corner">
        <path d="M82 462 L82 390" />
        <path d="M82 462 L160 462" />
        <path d="M82 462 L130 420" />
        <text x="70" y="387">t</text>
        <text x="166" y="468">x</text>
        <text x="136" y="418">y</text>
      </g>
    </svg>
  );
}

function HyperbookWorkspace({
  chapterId, copy, labels, locale, onBackToMap, onChapterChange,
  onEnterLab, onViewResearch, selectedTheory, text
}: {
  chapterId: string;
  copy: (typeof workspaceCopy)[Locale];
  labels: Record<TheoryStatus, string>;
  locale: Locale;
  onBackToMap: () => void;
  onChapterChange: (id: string) => void;
  onEnterLab: () => void;
  onViewResearch: () => void;
  selectedTheory: TheoryNode;
  text: (typeof uiText)[Locale];
}) {
  const content = selectedTheory.content[locale];
  const preview = chapterPreviews[chapterId as keyof typeof chapterPreviews] ?? chapterPreviews.preface;
  const [title, ...paragraphs] = locale === "zh-CN" ? preview.zh : preview.en;
  const chapters = chapterOutline[locale];
  const chapterIndex = chapters.findIndex((chapter) => chapter.id === chapterId);

  return (
    <section className="workspace workspace-book">
      <aside className="side-rail chapter-rail">
        <RailHeading icon={<BookOpen size={18} />} title={copy.chapterDirectory} />
        <div className="chapter-list">
          {chapters.map((chapter) => (
            <button className={chapter.id === chapterId ? "active" : ""} key={chapter.id}
              onClick={() => onChapterChange(chapter.id)} type="button">
              {chapter.title}<ChevronRight size={15} />
            </button>
          ))}
        </div>
      </aside>
      <article className="reader-pane">
        <div className="breadcrumb">{locale === "zh-CN" ? "超书 / 章节提纲预览" : "Hyperbook / chapter outline preview"}</div>
        <h2>{title}</h2>
        <StatusBadge label={labels[preview.status]} status={preview.status} />
        {paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        {chapterId === "spacetime" && (
          <>
            <MathBlock title={copy.equationTitle} equations={[
              "G_mu nu + Lambda g_mu nu = (8 pi G / c^4) T_mu nu",
              "d²x^mu/dtau² + Gamma^mu_ab (dx^a/dtau)(dx^b/dtau) = 0"
            ]} />
            <p><a href="https://ligo.org/detections/gw150914/" target="_blank" rel="noreferrer">{locale === "zh-CN" ? "观测实例：LIGO 的 GW150914 引力波探测" : "Observational example: LIGO's GW150914 detection"}</a></p>
          </>
        )}
        {chapterId === "fields" && <p><a href="https://home.cern/science/physics/standard-model/" target="_blank" rel="noreferrer">{locale === "zh-CN" ? "来源：CERN 标准模型介绍" : "Source: CERN's Standard Model overview"}</a></p>}
        <p className="science-notice">{locale === "zh-CN" ? "本页是教学提纲，完整推导与更多章节内容仍待贡献。" : "This is an educational outline; full derivations and expanded chapters remain contribution work."}</p>
        <a className="link-action" href={`https://github.com/eust-w/NaturalScienceWorld/blob/main/hyperbook/chapters/${preview.source}`} target="_blank" rel="noreferrer">
          <FileText size={16} />{locale === "zh-CN" ? "阅读 Markdown 源文件" : "Read the Markdown source"}
        </a>
        <div className="reader-footer">
          <button className="link-action" disabled={chapterIndex <= 0} onClick={() => onChapterChange(chapters[chapterIndex - 1].id)} type="button"><ArrowLeft size={15} />{copy.previous}</button>
          <span>{chapterIndex + 1} / {chapters.length}</span>
          <button className="link-action" disabled={chapterIndex >= chapters.length - 1} onClick={() => onChapterChange(chapters[chapterIndex + 1].id)} type="button">{copy.next}<ChevronRight size={15} /></button>
        </div>
      </article>
      <aside className="inspector book-inspector">
        <RailHeading icon={<Atom size={18} />} title={locale === "zh-CN" ? "保留的浏览选择" : "Retained browsing selection"} />
        <div className="theory-heading compact"><h2>{content.name}</h2><StatusBadge label={labels[selectedTheory.status]} status={selectedTheory.status} /></div>
        <DetailBlock title={text.dimensionsTitle}><p>{content.dimensions.join(" · ")}</p></DetailBlock>
        <DetailBlock title={text.openQuestionsTitle}><ul className="compact-list">{content.openQuestions.map((question) => <li key={question}>{question}</li>)}</ul></DetailBlock>
        <div className="inspector-actions">
          <button className="secondary-action" onClick={onBackToMap} type="button"><Network size={17} />{copy.backToMap}</button>
          <button className="primary-action" onClick={onEnterLab} type="button"><FlaskConical size={17} />{copy.enterLab}</button>
          <button className="link-action" onClick={onViewResearch} type="button"><Database size={16} />{copy.viewResearch}</button>
        </div>
      </aside>
    </section>
  );
}

function ResearchWorkspace({
  copy,
  filteredTheories,
  labels,
  locale,
  onQueryChange,
  onSelectTheory,
  onStatusFilterChange,
  query,
  selectedTheory,
  statusFilter
}: {
  copy: (typeof workspaceCopy)[Locale];
  filteredTheories: TheoryNode[];
  labels: Record<TheoryStatus, string>;
  locale: Locale;
  onQueryChange: (query: string) => void;
  onSelectTheory: (id: string) => void;
  onStatusFilterChange: (status: StatusFilter) => void;
  query: string;
  selectedTheory: TheoryNode;
  statusFilter: StatusFilter;
}) {
  const selectedContent = selectedTheory.content[locale];
  const selectedSources = sourcesForTheory(selectedTheory.id);
  return (
    <section className="workspace workspace-research">
      <aside className="side-rail research-rail">
        <button className="research-nav active" type="button">
          <Database size={18} />
          {copy.registry}
        </button>
        <p className="rail-note">{locale === "zh-CN" ? "只读 Alpha · 通过仓库文件与 Pull Request 贡献条目。" : "Read-only Alpha · contribute entries through repository files and pull requests."}</p>
      </aside>

      <section className="registry-pane">
        <div className="registry-heading">
          <h2>{copy.registry}</h2>

        </div>
        <div className="registry-filters">
          <label className="search-box">
            <Search size={17} />
            <input
              onChange={(event) => onQueryChange(event.target.value)}
              placeholder={copy.searchPlaceholder}
              value={query}
            />
          </label>
          <select onChange={(event) => onStatusFilterChange(event.target.value as StatusFilter)} value={statusFilter}>
            <option value="all">{copy.statusFilterAll}</option>
            {(Object.keys(labels) as TheoryStatus[]).map((status) => (
              <option key={status} value={status}>
                {labels[status]}
              </option>
            ))}
          </select>
          <button className="secondary-action compact-action" onClick={() => { onQueryChange(""); onStatusFilterChange("all"); }} type="button">
            <RotateCcw size={16} />{copy.reset}
          </button>
        </div>

        <div className="registry-table" role="table">
          <div className="registry-row header" role="row">
            <span>{copy.theory}</span>
            <span>{copy.status}</span>
            <span>{copy.scale}</span>
            <span>{copy.dimensionModel}</span>
            <span>{copy.evidence}</span>
            <span>{copy.openIssues}</span>
          </div>
          <div className="registry-group">{copy.establishedGroup}</div>
          {filteredTheories.length === 0 && <div className="empty-state">{copy.noResults}</div>}
          {filteredTheories.map((theory) => {
            const content = theory.content[locale];
            const selected = selectedTheory.id === theory.id;
            return (
              <button
                className={selected ? "registry-row data selected" : "registry-row data"}
                key={theory.id}
                onClick={() => onSelectTheory(theory.id)}
                role="row"
                type="button"
              >
                <span>{content.name}</span>
                <span>
                  <StatusBadge label={labels[theory.status]} status={theory.status} />
                </span>
                <span>{scaleLabel(theory.scale, locale)}</span>
                <span>{content.dimensions[0]}</span>
                <span>
                  {sourcesForTheory(theory.id).length} {locale === "zh-CN" ? "条引用" : "sources"}
                </span>
                <span>{content.openQuestions.length}</span>
              </button>
            );
          })}
        </div>
      </section>

      <aside className="inspector research-inspector">
        <div className="theory-heading">
          <h2>{selectedContent.name}</h2>
          <StatusBadge label={labels[selectedTheory.status]} status={selectedTheory.status} />
          <p>{selectedContent.summary}</p>
        </div>
        <DetailBlock icon={<Lightbulb size={19} />} title={copy.openIssues}>
          <ul className="compact-list">{selectedContent.openQuestions.map((question) => <li key={question}>{question}</li>)}</ul>
        </DetailBlock>
        <DetailBlock icon={<FileText size={19} />} title={locale === "zh-CN" ? "已关联来源" : "Linked sources"}>
          {selectedSources.length === 0 ? (
            <p>{locale === "zh-CN" ? "此项目条目暂无支持来源，不应视为已验证结论。" : "This project entry has no supporting sources and must not be treated as a validated result."}</p>
          ) : (
            <ul className="source-list">
              {selectedSources.map((source) => (
                <li key={source.citation_key}>
                  <a href={source.url} target="_blank" rel="noreferrer">{source.title}</a>
                  <span className="source-role">{sourceRoleLabels[locale][source.role] ?? source.role}</span>
                  <p>{source.note}</p>
                </li>
              ))}
            </ul>
          )}
        </DetailBlock>
        <DetailBlock icon={<ShieldCheck size={19} />} title={locale === "zh-CN" ? "证据边界" : "Evidence boundary"}>
          <p>{locale === "zh-CN" ? "引用支持各自标明的背景知识、具体观测或理论研究，不验证本项目的工作模型、猜想或示意分数。状态标签是定性分类，不是定量置信度；本项目未完成独立复现实验。" : "References support their stated background, specific observations, or theoretical research. They do not validate project-local models, hypotheses, or illustrative scores. Status labels are qualitative, not numerical confidence; independent replication is not implemented here."}</p>
        </DetailBlock>
        {(selectedTheory.status === "speculative" || selectedTheory.status === "working-model") && (
          <DetailBlock icon={<Target size={19} />} title={copy.falsificationPath}>
            <p>{locale === "zh-CN" ? "这是项目内的探索条目，目前尚无形式化模型、经过论证的可检验预测或已完成的证伪路径。" : "This is a project-local exploratory entry. No formal model, justified testable predictions, or completed falsification path is available yet."}</p>
          </DetailBlock>
        )}
        <DetailBlock icon={<Link2 size={19} />} title={copy.relatedDemo}>
          <code>{selectedTheory.demoHook}</code>
          <p>{locale === "zh-CN" ? "规划演示标识，尚未实现专用求解器。" : "Planned demo identifier; no dedicated solver is implemented yet."}</p>
        </DetailBlock>
      </aside>
    </section>
  );
}

function MobileBottomNav({
  activeMode,
  modes,
  onModeChange
}: {
  activeMode: ModeId;
  modes: Record<ModeId, string>;
  onModeChange: (mode: ModeId) => void;
}) {
  return (
    <nav className="mobile-bottom-nav" aria-label="Mobile navigation">
      {(Object.keys(modes) as ModeId[]).map((mode) => {
        const Icon = modeIcons[mode];
        return (
          <button
            className={activeMode === mode ? "active" : ""}
            key={mode}
            onClick={() => onModeChange(mode)}
            type="button"
          >
            <Icon size={22} />
            <span className="mobile-label-full">{modes[mode]}</span>
          </button>
        );
      })}
    </nav>
  );
}

function RailHeading({ icon, title }: { icon: ReactNode; title: string }) {
  return (
    <div className="rail-heading">
      {icon}
      <h2>{title}</h2>
    </div>
  );
}

function LensIcon({ lens }: { lens: LensId }) {
  if (lens === "all") return <Network size={18} />;
  if (lens === "spacetime") return <Globe2 size={18} />;
  if (lens === "quantum") return <Atom size={18} />;
  if (lens === "information") return <Database size={18} />;
  if (lens === "cosmology") return <Eye size={18} />;
  return <HelpCircle size={18} />;
}

function StatusLegend({
  copy,
  labels
}: {
  copy: (typeof workspaceCopy)[Locale];
  labels: Record<TheoryStatus, string>;
}) {
  return (
    <div className="status-legend">
      <h3>{copy.statusLegend}</h3>
      {(Object.keys(labels) as TheoryStatus[]).map((status) => (
        <div className="status-row" key={status}>
          <span className="status-dot" data-status={status} />
          <span>{labels[status]}</span>
        </div>
      ))}
    </div>
  );
}

function StatusBadge({ label, status }: { label: string; status: TheoryStatus }) {
  return (
    <span className="status-badge" data-status={status}>
      <span className="status-dot" data-status={status} />
      {label}
    </span>
  );
}

function DetailBlock({
  children,
  icon,
  title
}: {
  children: ReactNode;
  icon?: ReactNode;
  title: string;
}) {
  return (
    <section className="detail-block">
      <h3>
        {icon}
        {title}
      </h3>
      {children}
    </section>
  );
}


function Slider({
  label,
  value,
  min,
  max,
  onChange
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="slider-control">
      <span>
        {label}
        <strong>{value}</strong>
      </span>
      <input
        max={max}
        min={min}
        onChange={(event) => onChange(Number(event.target.value))}
        type="range"
        value={value}
      />
    </label>
  );
}

function Metric({
  icon,
  label,
  tone,
  value
}: {
  icon: ReactNode;
  label: string;
  tone: "green" | "blue" | "rose";
  value: number;
}) {
  return (
    <div className="metric-row" data-tone={tone}>
      <div className="metric-icon">{icon}</div>
      <span>{label}</span>
      <strong>{value}/100</strong>
      <div className="sparkline" aria-hidden="true">
        <span style={{ width: `${Math.min(value, 100)}%` }} />
      </div>
    </div>
  );
}

function RunHistory({
  copy,
  history
}: {
  copy: (typeof workspaceCopy)[Locale];
  history: RunSnapshot[];
}) {
  return (
    <section className="run-history">
      <h3>{copy.recentRuns}</h3>
      {history.length === 0 && <p className="empty-state">{copy.run} → {copy.recentRuns}</p>}
      <div className="history-table">
        {history.map((run) => (
          <div className="history-row" key={run.id}>
            <span>{run.time}</span>
            <span>{run.pulse}</span>
            <span>{run.geometry}/100</span>
            <span>{run.observability}/100</span>

          </div>
        ))}
      </div>

    </section>
  );
}


function MathBlock({ equations, title }: { equations: string[]; title: string }) {
  return (
    <section className="math-block">
      <span>{title}</span>
      {equations.map((equation) => (
        <code key={equation}>{equation}</code>
      ))}
    </section>
  );
}


function scaleLabel(scale: number, locale: Locale) {
  if (scale < 25) return locale === "zh-CN" ? "微观" : "Micro";
  if (scale < 45) return locale === "zh-CN" ? "粒子" : "Particle";
  if (scale < 70) return locale === "zh-CN" ? "宏观" : "Macro";
  if (scale < 88) return locale === "zh-CN" ? "天体" : "Stellar";
  return locale === "zh-CN" ? "宇宙学" : "Cosmic";
}
