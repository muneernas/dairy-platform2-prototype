export type ModuleStatus = 'pilot' | 'planned'

export type ModuleStepId =
  | 'objectives'
  | 'simulated-data'
  | 'exercise'
  | 'agent-analysis'
  | 'assessment'
  | 'apply-company'

export interface LearningModuleMeta {
  id: string
  number: number
  title: string
  description: string
  status: ModuleStatus
  duration: string
  workshopDuration?: string
  learningObjectives: string[]
}

export interface SimulatedDataRow {
  period: string
  sku: string
  category: string
  unitsSold: number
  channel: string
}

export interface ExerciseStep {
  id: string
  prompt: string
  context?: string
  options: { value: string; label: string; description?: string }[]
  correctValue: string
  feedback: {
    correct: string
    incorrect: string
  }
}

export interface AssessmentQuestion {
  id: string
  prompt: string
  options: { value: string; label: string }[]
  correctValue: string
  ragExplanation: string
  fallbackExplanation?: string
}

export interface AgentInsight {
  headline: string
  summary: string
  forecasts: { sku: string; nextPeriod: string; forecastUnits: number; trend: 'up' | 'down' | 'stable' }[]
  recommendations: string[]
  risks: string[]
}

export interface ApplyDataItem {
  id: string
  required: boolean
  title: string
  description: string
  fileName: string
  demoFileName: string
  demoLabel: string
  demoCsv: string
}

export interface ModuleDetail extends LearningModuleMeta {
  companyProfile: {
    name: string
    type: string
    location: string
    note: string
  }
  simulatedData: SimulatedDataRow[]
  exercises: ExerciseStep[]
  agentInsight: AgentInsight
  assessment: AssessmentQuestion[]
  applyItems: ApplyDataItem[]
}

export const MODULE_STEPS: { id: ModuleStepId; label: string; description: string }[] = [
  {
    id: 'objectives',
    label: 'Learning objectives',
    description: 'What your team will be able to do after this module',
  },
  {
    id: 'simulated-data',
    label: 'Simulated company data',
    description: 'Practice with a realistic dairy SME dataset',
  },
  {
    id: 'exercise',
    label: 'Guided exercise',
    description: 'Apply forecasting concepts to the simulated case',
  },
  {
    id: 'agent-analysis',
    label: 'AI agent analysis',
    description: 'Review AI-assisted forecasts and recommendations',
  },
  {
    id: 'assessment',
    label: 'Knowledge check',
    description: 'Confirm understanding with sector-grounded feedback',
  },
  {
    id: 'apply-company',
    label: 'Apply to your company',
    description: 'Upload your operational files — or use the demo company export — and run the same analysis',
  },
]
