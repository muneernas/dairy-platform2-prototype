import type { ApplyDataItem } from '../types/platform2'

export const DEMO_SALES_CSV = `period,sku,category,units,channel
Week 1,Full-fat milk 1L,Fresh milk,3900,Retail
Week 1,Plain yogurt 500g,Yogurt,1650,Retail
Week 1,White cheese 250g,Cheese,880,Retail
Week 1,Labneh 400g,Fermented,640,Horeca
Week 2,Full-fat milk 1L,Fresh milk,4010,Retail
Week 2,Plain yogurt 500g,Yogurt,1710,Retail
Week 2,White cheese 250g,Cheese,900,Retail
Week 2,Labneh 400g,Fermented,670,Horeca
Week 3,Full-fat milk 1L,Fresh milk,4120,Retail
Week 3,Plain yogurt 500g,Yogurt,1840,Retail
Week 3,White cheese 250g,Cheese,920,Retail
Week 3,Labneh 400g,Fermented,690,Horeca
Week 4,Full-fat milk 1L,Fresh milk,4280,Retail
Week 4,Plain yogurt 500g,Yogurt,1980,Retail
Week 4,White cheese 250g,Cheese,950,Retail
Week 4,Labneh 400g,Fermented,710,Horeca
Week 5,Full-fat milk 1L,Fresh milk,4860,Retail
Week 5,Plain yogurt 500g,Yogurt,2510,Retail
Week 5,White cheese 250g,Cheese,1090,Retail
Week 5,Labneh 400g,Fermented,780,Horeca
Week 6,Full-fat milk 1L,Fresh milk,5020,Retail
Week 6,Plain yogurt 500g,Yogurt,2680,Retail
Week 6,White cheese 250g,Cheese,1120,Retail
Week 6,Labneh 400g,Fermented,810,Horeca
Week 7,Full-fat milk 1L,Fresh milk,4710,Retail
Week 7,Plain yogurt 500g,Yogurt,2390,Retail
Week 7,White cheese 250g,Cheese,1070,Retail
Week 7,Labneh 400g,Fermented,790,Horeca
Week 8,Full-fat milk 1L,Fresh milk,4490,Retail
Week 8,Plain yogurt 500g,Yogurt,2210,Retail
Week 8,White cheese 250g,Cheese,1030,Retail
Week 8,Labneh 400g,Fermented,760,Horeca
Week 9,Full-fat milk 1L,Fresh milk,4380,Retail
Week 9,Plain yogurt 500g,Yogurt,2140,Retail
Week 9,White cheese 250g,Cheese,1050,Retail
Week 9,Labneh 400g,Fermented,770,Horeca
Week 10,Full-fat milk 1L,Fresh milk,4520,Retail
Week 10,Plain yogurt 500g,Yogurt,2290,Retail
Week 10,White cheese 250g,Cheese,1080,Retail
Week 10,Labneh 400g,Fermented,800,Horeca
`

export const DEMO_EVENTS_CSV = `period,event
Week 5,School term start — breakfast yogurt lift
Week 6,Retail promotion on yogurt 500g
Week 9,Local holiday weekend
Week 11,Expected Ramadan preparation (next period)
`

export const FORECAST_APPLY_ITEMS: ApplyDataItem[] = [
  {
    id: 'sales',
    required: true,
    title: 'Weekly sales by SKU',
    description:
      'Export 8–12 weeks of sales or shipments from your ERP or spreadsheet. Columns: period, sku, category, units, channel.',
    fileName: 'company-sales.csv',
    demoFileName: 'demo-jordan-valley-sales.csv',
    demoLabel: 'Jordan Valley Dairy Co. (demo export)',
    demoCsv: DEMO_SALES_CSV,
  },
  {
    id: 'events',
    required: false,
    title: 'Calendar events',
    description:
      'Optional. Tag holidays, school terms, promotions, and Ramadan so the agent can explain spikes. Columns: period, event.',
    fileName: 'company-events.csv',
    demoFileName: 'demo-jordan-valley-events.csv',
    demoLabel: 'Jordan Valley Dairy Co. calendar (demo)',
    demoCsv: DEMO_EVENTS_CSV,
  },
]
