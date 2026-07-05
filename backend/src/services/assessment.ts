interface ChecklistAnswers {
  businessPlan: boolean;
  pitchDeck: boolean;
  financialModel: boolean;
  legal: boolean;
  capTable: boolean;
  dueDiligence: boolean;
  compliance: boolean;
  revenueMetrics: boolean;
}

interface DiagnosticAnswers {
  // 8 sections (values should be scores out of 10)
  strategy: number;
  finance: number;
  marketing: number;
  hr: number;
  tech: number;
  legal: number;
  ops: number;
  sales: number;
}

export function calculateReadinessChecklistScore(answers: Partial<ChecklistAnswers>) {
  const items = [
    'businessPlan',
    'pitchDeck',
    'financialModel',
    'legal',
    'capTable',
    'dueDiligence',
    'compliance',
    'revenueMetrics',
  ] as const;

  let completedCount = 0;
  const weakAreas: string[] = [];
  const recommendations: string[] = [];

  const defaultRecommendations: Record<string, string> = {
    businessPlan: 'Draft a comprehensive 3-5 year business plan clarifying your vision and operational milestones.',
    pitchDeck: 'Create a compelling pitch deck focusing on problem, solution, market size, and unit economics.',
    financialModel: 'Develop a fully dynamic 3 statement financial model showing historicals and future projections.',
    legal: 'Structure proper company incorporation, co-founder agreements, and intellectual property assignments.',
    capTable: 'Establish a clean equity capitalization table tracking all shares, SAFEs, and employee option pools.',
    dueDiligence: 'Prepare a virtual data room with tidy legal, financial, and product documentation.',
    compliance: 'Obtain required business licenses, GST registration, tax compliance certificates, and industry audits.',
    revenueMetrics: 'Define and track key growth metrics such as MRR/ARR, LTV, CAC, Churn, and Gross Margin.',
  };

  const nameMapping: Record<string, string> = {
    businessPlan: 'Business Plan',
    pitchDeck: 'Pitch Deck',
    financialModel: 'Financial Model',
    legal: 'Legal Structure',
    capTable: 'Cap Table Verification',
    dueDiligence: 'Due Diligence Readiness',
    compliance: 'Regulatory Compliance',
    revenueMetrics: 'Revenue Metrics',
  };

  items.forEach((item) => {
    if (answers[item] === true) {
      completedCount++;
    } else {
      weakAreas.push(nameMapping[item]);
      recommendations.push(defaultRecommendations[item]);
    }
  });

  const scorePercentage = (completedCount / items.length) * 100;

  return {
    readinessPercentage: scorePercentage,
    weakAreas,
    recommendedActions: recommendations,
  };
}

export function calculateDiagnosticEngineScores(answers: Partial<DiagnosticAnswers>) {
  // Normalize sections to be 0-100 scores
  const strategy = (answers.strategy ?? 0) * 10;
  const finance = (answers.finance ?? 0) * 10;
  const marketing = (answers.marketing ?? 0) * 10;
  const hr = (answers.hr ?? 0) * 10;
  const tech = (answers.tech ?? 0) * 10;
  const legal = (answers.legal ?? 0) * 10;
  const ops = (answers.ops ?? 0) * 10;
  const sales = (answers.sales ?? 0) * 10;

  // 1. Overall Score: Average of all 8 sections
  const overallScore = (strategy + finance + marketing + hr + tech + legal + ops + sales) / 8;

  // 2. Risk Score: High values mean high risk. Risk is high when Legal, Compliance/Ops, and Finance are weak.
  const riskScore = 100 - (legal + finance + ops) / 3;

  // 3. Growth Score: Average of Sales, Marketing, and Strategy
  const growthScore = (sales + marketing + strategy) / 3;

  // 4. Investment Score: Focuses on Finance, Tech readiness, and Strategy structure
  const investmentScore = (finance * 0.4) + (tech * 0.3) + (strategy * 0.3);

  // Dynamic recommendations based on low-scoring sections
  const sectionScores = [
    { name: 'Strategy', score: strategy, tip: 'Refine your core value proposition and set clear 12-month OKRs.' },
    { name: 'Finance', score: finance, tip: 'Optimize working capital management and perform budget vs. actual audits monthly.' },
    { name: 'Marketing', score: marketing, tip: 'Experiment with customer acquisition channels to decrease CAC.' },
    { name: 'HR', score: hr, tip: 'Establish talent acquisition pipelines and define employee stock option plans (ESOP).' },
    { name: 'Tech', score: tech, tip: 'Strengthen software architecture scalability and implement automated unit testing.' },
    { name: 'Legal', score: legal, tip: 'Audit co-founder shares, IP rights assignments, and regulatory compliance.' },
    { name: 'Ops', score: ops, tip: 'Standardize standard operating procedures (SOPs) and automate repetitive workflows.' },
    { name: 'Sales', score: sales, tip: 'Set up sales pipelines with CRM tools and train team on sales closures.' },
  ];

  const recommendations = sectionScores
    .filter((sec) => sec.score < 70)
    .map((sec) => ({
      section: sec.name,
      score: sec.score,
      recommendation: `Action Item for ${sec.name}: Your score is ${sec.score}%. ${sec.tip}`,
    }));

  return {
    overallScore,
    riskScore,
    growthScore,
    investmentScore,
    sectionScores: {
      strategy,
      finance,
      marketing,
      hr,
      tech,
      legal,
      ops,
      sales,
    },
    recommendations,
  };
}
