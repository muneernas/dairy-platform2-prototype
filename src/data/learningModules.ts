import type { LearningModuleMeta, ModuleDetail } from '../types/platform2'
import { FORECAST_APPLY_ITEMS } from './demoCompanyData'

/** Ten training courses - aligned with Platform 2 proposal, Aug 2026 */
export const LEARNING_MODULES: LearningModuleMeta[] = [
  {
    id: 'ai-platforms',
    number: 1,
    title: 'Using AI platforms and designing simple agents',
    description:
      'Introduces SMEs to AI platforms for designing simple agents linked to business tasks - preparing data, defining instructions, testing outputs, and integrating recommendations into daily decisions.',
    status: 'planned',
    duration: '45–90 minutes',
    learningObjectives: [
      'Understand how AI agents support dairy operational decisions',
      'Prepare a small operational dataset for agent use',
      'Define agent instructions grounded in business context',
      'Test and validate agent outputs before operational use',
    ],
  },
  {
    id: 'demand-forecast',
    number: 2,
    title: 'Demand forecasting with an AI forecasting agent',
    description:
      'Trains companies to use historical sales, customer orders, seasonality, and external signals to estimate future demand by product category or SKU - reducing waste, preventing stockouts, and improving production planning.',
    status: 'pilot',
    duration: 'About 10 minutes',
    fullDuration: '45–90 minutes',
    learningObjectives: [
      'Read historical sales patterns by SKU and channel',
      'Identify seasonality and demand spikes relevant to dairy products',
      'Interpret AI-assisted demand forecasts for production planning',
      'Connect forecast outputs to waste reduction and stockout prevention',
    ],
  },
  {
    id: 'sales-orders',
    number: 3,
    title: 'Sales and order analysis with an AI sales agent',
    description:
      'Focuses on analysing confirmed and pending orders by product, customer, channel, and delivery date - identifying demand signals, customer patterns, and coordination needs between sales, production, and logistics.',
    status: 'planned',
    duration: '45–90 minutes',
    learningObjectives: [],
  },
  {
    id: 'production-planning',
    number: 4,
    title: 'Production planning and sequencing with an AI production-planning agent',
    description:
      'Shows how forecasted and confirmed demand becomes a feasible production plan and run sequence - line capacity, materials, changeovers, and cleaning on milk, yoghurt, and cheese lines.',
    status: 'planned',
    duration: '45–90 minutes',
    learningObjectives: [],
  },
  {
    id: 'inventory',
    number: 5,
    title: 'Inventory monitoring with an AI inventory agent',
    description:
      'Helps SMEs track finished goods, raw materials, packaging, and semi-finished products across batches and locations - detecting shortages, excess stock, slow-moving items, and operational constraints.',
    status: 'planned',
    duration: '45–90 minutes',
    learningObjectives: [],
  },
  {
    id: 'shelf-life',
    number: 6,
    title: 'Shelf-life management with an AI shelf-life agent',
    description:
      'Focuses on expiry dates, remaining shelf life, batch age, and product usability - supporting FEFO dispatching, loss reduction, and stock rotation decisions.',
    status: 'planned',
    duration: '45–90 minutes',
    learningObjectives: [],
  },
  {
    id: 'procurement',
    number: 7,
    title: 'Milk procurement with an AI supplier agent',
    description:
      'Trains companies to use AI for raw milk procurement and purchasing of ingredients, cultures, packaging, and other inputs - combining supplier prices, lead times, quality, and reliability.',
    status: 'planned',
    duration: '45–90 minutes',
    learningObjectives: [],
  },
  {
    id: 'predictive-maintenance',
    number: 8,
    title: 'Predictive maintenance with an AI maintenance agent',
    description:
      'Introduces maintenance data, downtime records, alarms, and asset information to identify equipment at risk of failure - relevant for pasteurisers, fillers, pumps, refrigeration, compressors, and CIP assets.',
    status: 'planned',
    duration: '45–90 minutes',
    learningObjectives: [],
  },
  {
    id: 'costing-margin',
    number: 9,
    title: 'Profitability and costing with an AI margin agent',
    description:
      'Shows how to calculate product, customer, or channel profitability by combining prices, costs, logistics, utilities, returns, and production data.',
    status: 'planned',
    duration: '45–90 minutes',
    learningObjectives: [],
  },
  {
    id: 'complaints',
    number: 10,
    title: 'Customer complaint analysis with an AI complaint agent',
    description:
      'Trains companies to organise and analyse complaints related to quality, packaging, delivery conditions, temperature abuse, and expiry - linking data to batches and corrective action.',
    status: 'planned',
    duration: '45–90 minutes',
    learningObjectives: [],
  },
]

export const DEMAND_FORECAST_MODULE: ModuleDetail = {
  id: 'demand-forecast',
  number: 2,
  title: 'Demand forecasting with an AI forecasting agent',
  description:
    'Trains companies to use historical sales, customer orders, seasonality, and external signals to estimate future demand by product category or SKU.',
  status: 'pilot',
  duration: 'About 10 minutes',
  fullDuration: '45–90 minutes',
  learningObjectives: [
    'Read historical sales patterns by SKU and channel',
    'Identify seasonality and demand spikes relevant to dairy products',
    'Interpret AI-assisted demand forecasts for production planning',
    'Connect forecast outputs to waste reduction and stockout prevention',
  ],
  companyProfile: {
    name: 'Al-Balqa Fresh Dairy (simulated)',
    type: 'Small dairy SME - fresh products',
    location: 'Jordan - retail + horeca channels',
    note: 'This is a simulated company dataset for training. Your own data would follow the same structure.',
  },
  simulatedData: [
    { period: 'Week 1', sku: 'Full-fat milk 1L', category: 'Fresh milk', unitsSold: 4200, channel: 'Retail' },
    { period: 'Week 1', sku: 'Plain yogurt 500g', category: 'Yogurt', unitsSold: 1800, channel: 'Retail' },
    { period: 'Week 1', sku: 'White cheese 250g', category: 'Cheese', unitsSold: 960, channel: 'Retail' },
    { period: 'Week 1', sku: 'Labneh 400g', category: 'Fermented', unitsSold: 720, channel: 'Horeca' },
    { period: 'Week 2', sku: 'Full-fat milk 1L', category: 'Fresh milk', unitsSold: 4350, channel: 'Retail' },
    { period: 'Week 2', sku: 'Plain yogurt 500g', category: 'Yogurt', unitsSold: 1920, channel: 'Retail' },
    { period: 'Week 2', sku: 'White cheese 250g', category: 'Cheese', unitsSold: 980, channel: 'Retail' },
    { period: 'Week 2', sku: 'Labneh 400g', category: 'Fermented', unitsSold: 760, channel: 'Horeca' },
    { period: 'Week 3', sku: 'Full-fat milk 1L', category: 'Fresh milk', unitsSold: 4480, channel: 'Retail' },
    { period: 'Week 3', sku: 'Plain yogurt 500g', category: 'Yogurt', unitsSold: 2100, channel: 'Retail' },
    { period: 'Week 3', sku: 'White cheese 250g', category: 'Cheese', unitsSold: 1010, channel: 'Retail' },
    { period: 'Week 3', sku: 'Labneh 400g', category: 'Fermented', unitsSold: 810, channel: 'Horeca' },
    { period: 'Week 4', sku: 'Full-fat milk 1L', category: 'Fresh milk', unitsSold: 4620, channel: 'Retail' },
    { period: 'Week 4', sku: 'Plain yogurt 500g', category: 'Yogurt', unitsSold: 2280, channel: 'Retail' },
    { period: 'Week 4', sku: 'White cheese 250g', category: 'Cheese', unitsSold: 1040, channel: 'Retail' },
    { period: 'Week 4', sku: 'Labneh 400g', category: 'Fermented', unitsSold: 840, channel: 'Horeca' },
    { period: 'Week 5', sku: 'Full-fat milk 1L', category: 'Fresh milk', unitsSold: 5100, channel: 'Retail' },
    { period: 'Week 5', sku: 'Plain yogurt 500g', category: 'Yogurt', unitsSold: 2650, channel: 'Retail' },
    { period: 'Week 5', sku: 'White cheese 250g', category: 'Cheese', unitsSold: 1180, channel: 'Retail' },
    { period: 'Week 5', sku: 'Labneh 400g', category: 'Fermented', unitsSold: 920, channel: 'Horeca' },
    { period: 'Week 6', sku: 'Full-fat milk 1L', category: 'Fresh milk', unitsSold: 5250, channel: 'Retail' },
    { period: 'Week 6', sku: 'Plain yogurt 500g', category: 'Yogurt', unitsSold: 2780, channel: 'Retail' },
    { period: 'Week 6', sku: 'White cheese 250g', category: 'Cheese', unitsSold: 1210, channel: 'Retail' },
    { period: 'Week 6', sku: 'Labneh 400g', category: 'Fermented', unitsSold: 940, channel: 'Horeca' },
    { period: 'Week 7', sku: 'Full-fat milk 1L', category: 'Fresh milk', unitsSold: 4980, channel: 'Retail' },
    { period: 'Week 7', sku: 'Plain yogurt 500g', category: 'Yogurt', unitsSold: 2520, channel: 'Retail' },
    { period: 'Week 7', sku: 'White cheese 250g', category: 'Cheese', unitsSold: 1150, channel: 'Retail' },
    { period: 'Week 7', sku: 'Labneh 400g', category: 'Fermented', unitsSold: 900, channel: 'Horeca' },
    { period: 'Week 8', sku: 'Full-fat milk 1L', category: 'Fresh milk', unitsSold: 4720, channel: 'Retail' },
    { period: 'Week 8', sku: 'Plain yogurt 500g', category: 'Yogurt', unitsSold: 2340, channel: 'Retail' },
    { period: 'Week 8', sku: 'White cheese 250g', category: 'Cheese', unitsSold: 1090, channel: 'Retail' },
    { period: 'Week 8', sku: 'Labneh 400g', category: 'Fermented', unitsSold: 870, channel: 'Horeca' },
  ],
  externalSignals: [
    {
      period: 'Week 5',
      eventName: 'School term start',
      eventType: 'school_term',
      expectedImpact: 'yogurt_up',
      notes: 'Back-to-school breakfast demand - explains yogurt spike',
    },
    {
      period: 'Week 6',
      eventName: 'Retail promotion on yogurt 500g',
      eventType: 'promotion',
      expectedImpact: 'yogurt_up',
      notes: 'Chain-wide 15% discount extends the lift',
    },
    {
      period: 'Week 9',
      eventName: 'Local holiday weekend',
      eventType: 'holiday',
      expectedImpact: 'milk_stable',
      notes: 'Shorter retail week; plan production accordingly',
    },
  ],
  exercises: [
    {
      id: 'ex1',
      prompt: 'Weeks 5–6 show a clear spike for plain yogurt. Which external signal best explains it?',
      context:
        'Compare the sales table with the external signals calendar - Week 5 has school term start; Week 6 has a retail promotion.',
      options: [
        { value: 'a', label: 'School term start (Week 5)', description: 'External signal - breakfast yogurt lift' },
        { value: 'b', label: 'Packaging machine failure', description: 'Would reduce output, not lift sales' },
        { value: 'c', label: 'Cold-room temperature drift', description: 'Affects quality, not recorded sales lift' },
        { value: 'd', label: 'Random data error only', description: 'Pattern aligns with tagged calendar events' },
      ],
      correctValue: 'a',
      feedback: {
        correct:
          'Correct. Seasonal and calendar effects (school term, holidays, Ramadan preparation) are common demand drivers for fresh yogurt in retail. Forecasting agents should tag these events in the training context.',
        incorrect:
          'Look again at weeks 5–6: yogurt rises sharply while milk rises moderately. A operational fault would not create a selective SKU spike across two consecutive weeks.',
      },
    },
    {
      id: 'ex2',
      prompt: 'For Week 9 production planning, which SKU needs the most cautious uplift based on the trend?',
      options: [
        { value: 'milk', label: 'Full-fat milk 1L', description: 'Peaked in week 6, easing since' },
        { value: 'yogurt', label: 'Plain yogurt 500g', description: 'Highest volatility after the spike' },
        { value: 'cheese', label: 'White cheese 250g', description: 'Steady gradual growth' },
        { value: 'labneh', label: 'Labneh 400g', description: 'Stable horeca channel' },
      ],
      correctValue: 'yogurt',
      feedback: {
        correct:
          'Correct. Yogurt shows the highest volatility. Production should use a forecast band (min / expected / max) rather than a single point estimate to avoid overproduction waste after the spike.',
        incorrect:
          'Milk and cheese show smoother trends. Yogurt has the steepest rise and partial correction - the riskiest forecast error for a perishable SKU.',
      },
    },
    {
      id: 'ex3',
      prompt: 'How should the SME use the AI forecast in daily decisions?',
      options: [
        { value: 'auto', label: 'Apply the forecast automatically with no review', description: 'Fully hands-off' },
        { value: 'review', label: 'Review forecast with sales and production before locking the plan', description: 'Human + AI loop' },
        { value: 'ignore', label: 'Ignore forecast when capacity is tight', description: 'Revert to guesswork' },
        { value: 'annual', label: 'Update forecasts once per year only', description: 'Too infrequent for fresh dairy' },
      ],
      correctValue: 'review',
      feedback: {
        correct:
          'Correct. Capacity building means integrating AI recommendations into existing decision routines - not removing human judgment, especially for perishable products.',
        incorrect:
          'Platform 2 aims to strengthen company capability. The forecast should inform a cross-functional review (sales signals + production constraints), not run unattended or be discarded.',
      },
    },
  ],
  agentInsight: {
    headline: 'Week 9 demand forecast - AI agent output',
    summary:
      'Based on 8 weeks of simulated sales plus external signals, the agent links the Week 5–6 yogurt spike to school term start and a retail promotion. Week 9 forecast mean-reverts yogurt from the peak while milk eases after the holiday weekend tagged in Week 9.',
    externalSignalsUsed: [
      {
        period: 'Week 5',
        eventName: 'School term start',
        eventType: 'school_term',
        linkedSkus: 'Plain yogurt 500g (+47% vs week 4)',
      },
      {
        period: 'Week 6',
        eventName: 'Retail promotion on yogurt 500g',
        eventType: 'promotion',
        linkedSkus: 'Plain yogurt 500g (promo extends lift)',
      },
      {
        period: 'Week 9',
        eventName: 'Local holiday weekend',
        eventType: 'holiday',
        linkedSkus: 'Full-fat milk 1L (shorter retail week)',
      },
    ],
    forecasts: [
      { sku: 'Full-fat milk 1L', nextPeriod: 'Week 9', forecastUnits: 4580, trend: 'down' },
      { sku: 'Plain yogurt 500g', nextPeriod: 'Week 9', forecastUnits: 2410, trend: 'down' },
      { sku: 'White cheese 250g', nextPeriod: 'Week 9', forecastUnits: 1120, trend: 'up' },
      { sku: 'Labneh 400g', nextPeriod: 'Week 9', forecastUnits: 885, trend: 'stable' },
    ],
    recommendations: [
      'Yogurt spike is explained by school term + promotion - confirm with sales whether Week 9 still carries promo uplift.',
      'Plan yogurt production with a ±8% tolerance band to limit spoilage if the post-spike correction is faster than expected.',
      'Hold a short demand review before locking Week 9 - external signals calendar should be updated each month.',
    ],
    risks: [
      'Overproduction risk: yogurt (high perishability)',
      'Stockout risk: milk if correction is over-estimated and retail orders rebound',
    ],
  },
  assessment: [
    {
      id: 'q1',
      prompt: 'Why is SKU-level forecasting particularly important for dairy SMEs?',
      options: [
        { value: 'a', label: 'All SKUs share identical shelf life and demand patterns' },
        { value: 'b', label: 'Perishability and channel mix differ by product' },
        { value: 'c', label: 'Forecasting is only useful for industrial powder plants' },
        { value: 'd', label: 'SKU detail is required only for export markets' },
      ],
      correctValue: 'b',
      ragExplanation:
        'Dairy operations guidance: fresh SKUs differ in shelf life, demand volatility, and channel (retail vs horeca). Category-level forecasts alone often cause line changeover waste or stockouts at SKU level.',
    },
    {
      id: 'q2',
      prompt: 'What is the role of practice data in Platform 2 training courses?',
      options: [
        { value: 'a', label: 'Replace all company data permanently' },
        { value: 'b', label: 'Practice AI-assisted decisions before using real operational data' },
        { value: 'c', label: 'Eliminate the need for production planning' },
        { value: 'd', label: 'Serve only as marketing material' },
      ],
      correctValue: 'b',
      ragExplanation:
        'Capacity building methodology: learners first work with simulated datasets to understand agent outputs and decision workflows, then apply the same approach to their own company data.',
    },
    {
      id: 'q3',
      prompt: 'Which external signal file columns help the forecast agent explain a demand spike?',
      options: [
        { value: 'a', label: 'period, event_name, event_type' },
        { value: 'b', label: 'employee_id, shift_code' },
        { value: 'c', label: 'invoice_colour, paper_size' },
        { value: 'd', label: 'forklift_serial_number only' },
      ],
      correctValue: 'a',
      ragExplanation:
        'External signals files tag calendar events (school terms, holidays, promotions, Ramadan) by week so the agent can link spikes in sales to real-world causes - not just statistical noise.',
    },
    {
      id: 'q4',
      prompt: 'Which signal should be combined with historical sales for a stronger forecast?',
      options: [
        { value: 'a', label: 'Confirmed and pending customer orders' },
        { value: 'b', label: 'Office stationery spend' },
        { value: 'c', label: 'Number of forklift paint colours' },
        { value: 'd', label: 'Unrelated weather data from another country' },
      ],
      correctValue: 'a',
      ragExplanation:
        'Sales and order analysis for dairy SMEs: combining historical sales with confirmed/pending orders by delivery date improves short-horizon forecast accuracy and coordinates sales, production, and logistics.',
    },
  ],
  applyItems: FORECAST_APPLY_ITEMS,
}

const MODULE_DETAILS: Record<string, ModuleDetail> = {
  'demand-forecast': DEMAND_FORECAST_MODULE,
}

export function getLearningModule(id: string): LearningModuleMeta | undefined {
  return LEARNING_MODULES.find((m) => m.id === id)
}

export function getModuleDetail(id: string): ModuleDetail | undefined {
  return MODULE_DETAILS[id]
}
