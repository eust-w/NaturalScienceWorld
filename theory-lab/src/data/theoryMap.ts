import type { LensId, Locale, TheoryNode, TheoryStatus } from "../types";

export const defaultLocale: Locale = "zh-CN";

export const languageOptions: Array<{ id: Locale; label: string; shortLabel: string }> = [
  { id: "zh-CN", label: "中文", shortLabel: "中" },
  { id: "en-US", label: "English", shortLabel: "EN" }
];

export const uiText: Record<
  Locale,
  {
    appSubtitle: string;
    tracksLabel: string;
    theoryLensTitle: string;
    lensAria: string;
    statusAria: string;
    mapTitle: string;
    nodesLabel: string;
    mapAria: string;
    detailAria: string;
    consoleAria: string;
    consoleTitle: string;
    outputAria: string;
    spatialDimensions: string;
    energyScale: string;
    informationCoupling: string;
    runPulse: string;
    resetModel: string;
    dimensionsTitle: string;
    openQuestionsTitle: string;
    demoHookTitle: string;
    microAxis: string;
    cosmicAxis: string;
    settledAxis: string;
    openAxis: string;
    languageLabel: string;
    metrics: {
      geometryLoad: string;
      observability: string;
      hypothesisPressure: string;
    };
  }
> = {
  "zh-CN": {
    appSubtitle: "理论实验室",
    tracksLabel: "项目轨道",
    theoryLensTitle: "理论视角",
    lensAria: "理论视角筛选",
    statusAria: "理论状态标签",
    mapTitle: "宇宙理论图谱",
    nodesLabel: "个节点",
    mapAria: "按尺度和证据组织的理论图谱",
    detailAria: "已选理论",
    consoleAria: "维度控制台",
    consoleTitle: "维度控制台",
    outputAria: "无量纲示意分数",
    spatialDimensions: "示意空间维数",
    energyScale: "能标示意参数（无单位）",
    informationCoupling: "信息耦合示意参数",
    runPulse: "运行脉冲",
    resetModel: "重置模型",
    dimensionsTitle: "维度",
    openQuestionsTitle: "开放问题",
    demoHookTitle: "规划演示标识",
    microAxis: "微观",
    cosmicAxis: "宇宙",
    settledAxis: "稳固",
    openAxis: "开放",
    languageLabel: "语言",
    metrics: {
      geometryLoad: "几何示意",
      observability: "可见度示意",
      hypothesisPressure: "耦合示意"
    }
  },
  "en-US": {
    appSubtitle: "Theory Lab",
    tracksLabel: "Project tracks",
    theoryLensTitle: "Theory lenses",
    lensAria: "Theory lens filters",
    statusAria: "Theory status labels",
    mapTitle: "Universe Theory Map",
    nodesLabel: "nodes",
    mapAria: "Theory map by scale and evidence",
    detailAria: "Selected theory",
    consoleAria: "Dimension console",
    consoleTitle: "Dimension console",
    outputAria: "Unitless illustrative scores",
    spatialDimensions: "Illustrative spatial dimensions",
    energyScale: "Illustrative energy parameter (unitless)",
    informationCoupling: "Illustrative information coupling",
    runPulse: "Run pulse",
    resetModel: "Reset model",
    dimensionsTitle: "Dimensions",
    openQuestionsTitle: "Open questions",
    demoHookTitle: "Planned demo identifier",
    microAxis: "micro",
    cosmicAxis: "cosmic",
    settledAxis: "settled",
    openAxis: "open",
    languageLabel: "Language",
    metrics: {
      geometryLoad: "Geometry score",
      observability: "Visibility score",
      hypothesisPressure: "Coupling score"
    }
  }
};

export const statusLabels: Record<Locale, Record<TheoryStatus, string>> = {
  "zh-CN": {
    established: "已建立",
    "active-research": "活跃研究",
    "working-model": "工作模型",
    speculative: "猜想"
  },
  "en-US": {
    established: "Established",
    "active-research": "Active research",
    "working-model": "Working model",
    speculative: "Speculative"
  }
};

export const lensLabels: Record<Locale, Array<{ id: LensId; label: string }>> = {
  "zh-CN": [
    { id: "all", label: "全部" },
    { id: "spacetime", label: "时空" },
    { id: "quantum", label: "量子" },
    { id: "information", label: "信息" },
    { id: "cosmology", label: "宇宙学" },
    { id: "hypothesis", label: "新假说" }
  ],
  "en-US": [
    { id: "all", label: "All" },
    { id: "spacetime", label: "Spacetime" },
    { id: "quantum", label: "Quantum" },
    { id: "information", label: "Information" },
    { id: "cosmology", label: "Cosmology" },
    { id: "hypothesis", label: "Hypotheses" }
  ]
};

export const theories: TheoryNode[] = [
  {
    id: "classical-mechanics",
    status: "established",
    lenses: ["all", "spacetime"],
    scale: 55,
    x: 44,
    y: 78,
    demoHook: "phase-space-orbit",
    content: {
      "zh-CN": {
        name: "经典力学",
        family: "运动",
        summary: "以位置、动量和确定性演化描述宏观运动，是可视化动力系统的起点。",
        dimensions: ["三维空间 + 时间", "相空间"],
        openQuestions: ["混沌敏感性", "量子与相对论边界"]
      },
      "en-US": {
        name: "Classical Mechanics",
        family: "motion",
        summary: "Models macroscopic motion through position, momentum, and deterministic evolution.",
        dimensions: ["3D space + time", "phase space"],
        openQuestions: ["chaotic sensitivity", "quantum and relativistic limits"]
      }
    }
  },
  {
    id: "general-relativity",
    status: "established",
    lenses: ["all", "spacetime", "cosmology"],
    scale: 82,
    x: 72,
    y: 76,
    demoHook: "curvature-geodesic",
    content: {
      "zh-CN": {
        name: "广义相对论",
        family: "几何",
        summary: "把引力表达为时空曲率，适合连接黑洞、引力波和宇宙膨胀。",
        dimensions: ["四维时空", "度规张量"],
        openQuestions: ["奇点", "量子引力", "暗能量解释"]
      },
      "en-US": {
        name: "General Relativity",
        family: "geometry",
        summary: "Describes gravity as spacetime curvature, linking black holes, gravitational waves, and expansion.",
        dimensions: ["4D spacetime", "metric tensor"],
        openQuestions: ["singularities", "quantum gravity", "dark energy interpretation"]
      }
    }
  },
  {
    id: "quantum-mechanics",
    status: "established",
    lenses: ["all", "quantum", "information"],
    scale: 23,
    x: 25,
    y: 82,
    demoHook: "measurement-basis-sweep",
    content: {
      "zh-CN": {
        name: "量子力学",
        family: "状态",
        summary: "用态、算符和概率描述微观系统，为测量与信息问题提供核心边界。",
        dimensions: ["希尔伯特空间", "测量基"],
        openQuestions: ["测量解释", "经典涌现", "与引力的耦合"]
      },
      "en-US": {
        name: "Quantum Mechanics",
        family: "state",
        summary: "Describes microscopic systems with states, operators, and probabilistic measurement outcomes.",
        dimensions: ["Hilbert space", "measurement basis"],
        openQuestions: ["measurement interpretation", "classical emergence", "coupling to gravity"]
      }
    }
  },
  {
    id: "quantum-field-theory",
    status: "established",
    lenses: ["all", "quantum"],
    scale: 18,
    x: 18,
    y: 72,
    demoHook: "field-mode-oscillator",
    content: {
      "zh-CN": {
        name: "量子场论",
        family: "场",
        summary: "把粒子理解为场的激发，将对称性、相互作用和真空结构放入同一框架。",
        dimensions: ["时空上的场", "福克空间"],
        openQuestions: ["非微扰区域", "真空能", "引力"]
      },
      "en-US": {
        name: "Quantum Field Theory",
        family: "fields",
        summary: "Models particles as field excitations and organizes interactions through symmetry.",
        dimensions: ["fields over spacetime", "Fock space"],
        openQuestions: ["non-perturbative regimes", "vacuum energy", "gravity"]
      }
    }
  },
  {
    id: "thermodynamics",
    status: "established",
    lenses: ["all", "information"],
    scale: 52,
    x: 50,
    y: 70,
    demoHook: "entropy-coarse-graining",
    content: {
      "zh-CN": {
        name: "热力学与统计力学",
        family: "熵",
        summary: "用熵、热、功和统计集合连接微观自由度与宏观规律。",
        dimensions: ["宏观变量", "微观状态集合"],
        openQuestions: ["时间箭头", "非平衡复杂性", "引力熵"]
      },
      "en-US": {
        name: "Thermodynamics",
        family: "entropy",
        summary: "Connects microscopic degrees of freedom to macroscopic regularities through entropy and ensembles.",
        dimensions: ["macro variables", "microstate ensemble"],
        openQuestions: ["arrow of time", "nonequilibrium complexity", "gravitational entropy"]
      }
    }
  },
  {
    id: "lambda-cdm",
    status: "established",
    lenses: ["all", "cosmology", "spacetime"],
    scale: 96,
    x: 90,
    y: 62,
    demoHook: "expansion-parameter-sweep",
    content: {
      "zh-CN": {
        name: "Lambda-CDM 宇宙学",
        family: "宇宙",
        summary: "当前大尺度宇宙学基线，组织暗物质、暗能量、膨胀和结构形成。",
        dimensions: ["大尺度时空", "宇宙学参数"],
        openQuestions: ["暗物质身份", "暗能量性质", "早期宇宙张力"]
      },
      "en-US": {
        name: "Lambda-CDM",
        family: "cosmos",
        summary: "The baseline large-scale cosmology for dark matter, dark energy, expansion, and structure formation.",
        dimensions: ["large-scale spacetime", "cosmological parameters"],
        openQuestions: ["dark matter identity", "dark energy nature", "early-universe tensions"]
      }
    }
  },
  {
    id: "quantum-gravity",
    status: "active-research",
    lenses: ["all", "quantum", "spacetime", "cosmology"],
    scale: 8,
    x: 11,
    y: 40,
    demoHook: "planck-scale-regime-map",
    content: {
      "zh-CN": {
        name: "量子引力",
        family: "统一",
        summary: "试图统一量子理论和动态时空，是高风险高价值的理论交汇区。",
        dimensions: ["普朗克尺度", "涌现时空候选"],
        openQuestions: ["实验可达性", "时空涌现", "奇点消解"]
      },
      "en-US": {
        name: "Quantum Gravity",
        family: "unification",
        summary: "Attempts to reconcile quantum theory with dynamical spacetime geometry.",
        dimensions: ["Planck regime", "emergent spacetime candidates"],
        openQuestions: ["empirical access", "spacetime emergence", "singularity resolution"]
      }
    }
  },
  {
    id: "observer-information-frame",
    status: "working-model",
    lenses: ["all", "information", "hypothesis"],
    scale: 60,
    x: 60,
    y: 45,
    demoHook: "observer-access-meter",
    content: {
      "zh-CN": {
        name: "观察者信息框架",
        family: "观察者",
        summary: "项目内的工作模型，用可达信息、压缩和更新来比较不同理论。",
        dimensions: ["信息坐标", "观察者状态"],
        openQuestions: ["形式化定义", "与熵的关系", "观察者依赖"]
      },
      "en-US": {
        name: "Observer Information Frame",
        family: "observer",
        summary: "A project-local working model for comparing theories through accessible information and update rules.",
        dimensions: ["information coordinates", "observer state"],
        openQuestions: ["formal definition", "relation to entropy", "observer dependence"]
      }
    }
  },
  {
    id: "dimensional-resonance",
    status: "speculative",
    lenses: ["all", "hypothesis", "information"],
    scale: 70,
    x: 76,
    y: 24,
    demoHook: "dimension-coupling-toy-model",
    content: {
      "zh-CN": {
        name: "维度共振假说",
        family: "假说",
        summary: "新假说种子：不同维度类型可能通过共享不变量或压缩模式产生跨尺度耦合。",
        dimensions: ["物理维度", "状态维度", "信息维度"],
        openQuestions: ["数学形式", "可检验后果", "如何区别于类比"]
      },
      "en-US": {
        name: "Dimensional Resonance",
        family: "hypothesis",
        summary: "A speculative seed: dimension types may couple through shared invariants or compression patterns.",
        dimensions: ["physical dimensions", "state dimensions", "information dimensions"],
        openQuestions: ["mathematical form", "testable consequence", "distinction from analogy"]
      }
    }
  }
];
