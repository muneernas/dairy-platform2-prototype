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

export const DEMO_EVENTS_CSV = `period,event_name,event_type,expected_impact,notes
Week 5,School term start,school_term,yogurt_up,Back-to-school breakfast demand for single-serve packs
Week 6,Retail promotion on yogurt 500g,promotion,yogurt_up,Chain-wide 15% discount
Week 9,Local holiday weekend,holiday,milk_stable,Shorter retail week; horeca steady
Week 11,Ramadan preparation,ramadan,cheese_up,Household stock-up before fasting period
`

/** Near-term committed demand (orders already taken). */
export const DEMO_ORDERS_CSV = `period,sku,channel,order_units,status,customer
Week 11,Plain yogurt 500g,Retail,420,confirmed,City Mart chain
Week 11,Full-fat milk 1L,Retail,900,confirmed,City Mart chain
Week 11,Labneh 400g,Horeca,180,confirmed,Hotel group A
Week 11,White cheese 250g,Retail,110,tentative,Independent stores
Week 12,Plain yogurt 500g,Retail,380,confirmed,City Mart chain
Week 12,Full-fat milk 1L,Retail,850,confirmed,City Mart chain
`

/** Forward promo calendar (uplift planned before the week). */
export const DEMO_PROMO_PLAN_CSV = `period,sku,promo_name,discount_pct,expected_uplift_pct,channel,notes
Week 11,Plain yogurt 500g,Spring twin-pack,10,12,Retail,Planned leaflet promo
Week 12,Full-fat milk 1L,Family weekend deal,5,6,Retail,End-cap only
Week 13,Labneh 400g,Horeca trial pack,15,18,Horeca,Chef sampling week
`

/** Price / discount list (explains promo-driven volume). */
export const DEMO_PRICE_LIST_CSV = `sku,list_price_jod,current_discount_pct,effective_from,channel,notes
Full-fat milk 1L,1.15,0,Week 1,Retail,Standard shelf price
Plain yogurt 500g,0.85,15,Week 6,Retail,Matches Week 6 retail promotion
White cheese 250g,1.40,0,Week 1,Retail,Stable
Labneh 400g,1.60,0,Week 1,Horeca,Contract price
Plain yogurt 500g,0.85,10,Week 11,Retail,Planned twin-pack promo
`

/** Weekly weather / temperature (heat ↔ some fresh SKUs). */
export const DEMO_WEATHER_CSV = `period,avg_temp_c,max_temp_c,heat_wave,notes
Week 5,24,29,no,Mild spring
Week 6,26,32,no,Warming
Week 7,28,35,yes,Heat spike - cold drinks / fresh demand up
Week 8,27,33,no,Still warm
Week 9,22,28,no,Holiday weekend cooler
Week 10,25,31,no,Seasonal normal
`

/** Plant capacity vs what forecast asks for. */
export const DEMO_CAPACITY_CSV = `period,line,sku_or_family,max_units,planned_hours,constraint_notes
Week 11,Yogurt cup line,Yogurt,2800,40,Cup sealer is bottleneck
Week 11,Milk filling,Fresh milk,5200,40,OK headroom
Week 11,Cheese press,Cheese,1400,32,Shared labour with labneh
Week 12,Yogurt cup line,Yogurt,2800,40,Same sealer limit
Week 12,Milk filling,Fresh milk,5200,40,OK headroom
`

/** Finished-goods stock for cover-days context. */
export const DEMO_STOCK_CSV = `as_of_period,sku,units_on_hand,days_of_cover,warehouse,notes
Week 10,Full-fat milk 1L,2100,3.2,Cold store A,Short cover - watch stockout
Week 10,Plain yogurt 500g,980,3.0,Cold store A,High turn; FEFO critical
Week 10,White cheese 250g,2400,16,Aging room,Comfortable buffer
Week 10,Labneh 400g,420,4.1,Cold store B,Horeca orders pending
`

/** Returns / complaints that can dampen demand. */
export const DEMO_RETURNS_CSV = `period,sku,return_units,complaint_type,severity,notes
Week 7,Plain yogurt 500g,45,texture,City Mart,Short batch after heat week
Week 8,Plain yogurt 500g,22,expiry_near,City Mart,FEFO miss on one store
Week 8,Full-fat milk 1L,12,leak,Independent,Packaging seal
Week 9,Labneh 400g,8,taste,Hotel group A,Isolated; not systemic
`

export const FORECAST_APPLY_ITEMS: ApplyDataItem[] = [
  {
    id: 'sales',
    required: true,
    title: 'Weekly sales by SKU',
    description:
      'Required. Export 8–12 weeks of sales or shipments. Columns: period, sku, category, units, channel.',
    fileName: 'company-sales.csv',
    demoFileName: 'demo-jordan-valley-sales.csv',
    demoLabel: 'Jordan Valley Dairy Co. (demo export)',
    demoCsv: DEMO_SALES_CSV,
  },
  {
    id: 'events',
    required: false,
    title: 'External signals calendar',
    description:
      'Optional but recommended. Holidays, school terms, promotions, Ramadan, weather events. Columns: period, event_name, event_type, expected_impact, notes.',
    fileName: 'company-external-signals.csv',
    demoFileName: 'demo-jordan-valley-external-signals.csv',
    demoLabel: 'Jordan Valley Dairy Co. external signals (demo)',
    demoCsv: DEMO_EVENTS_CSV,
  },
  {
    id: 'orders',
    required: false,
    title: 'Open orders / pipeline',
    description:
      'Optional enrichment. Near-term demand already committed. Columns: period, sku, channel, order_units, status, customer.',
    fileName: 'company-open-orders.csv',
    demoFileName: 'demo-jordan-valley-open-orders.csv',
    demoLabel: 'Jordan Valley Dairy Co. open orders (demo)',
    demoCsv: DEMO_ORDERS_CSV,
  },
  {
    id: 'promo_plan',
    required: false,
    title: 'Promo plan (future)',
    description:
      'Optional enrichment. Planned uplifts before the week happens. Columns: period, sku, promo_name, discount_pct, expected_uplift_pct, channel, notes.',
    fileName: 'company-promo-plan.csv',
    demoFileName: 'demo-jordan-valley-promo-plan.csv',
    demoLabel: 'Jordan Valley Dairy Co. promo plan (demo)',
    demoCsv: DEMO_PROMO_PLAN_CSV,
  },
  {
    id: 'price_list',
    required: false,
    title: 'Price / discount list',
    description:
      'Optional enrichment. Explains promo-driven volume. Columns: sku, list_price_jod, current_discount_pct, effective_from, channel, notes.',
    fileName: 'company-price-list.csv',
    demoFileName: 'demo-jordan-valley-price-list.csv',
    demoLabel: 'Jordan Valley Dairy Co. price list (demo)',
    demoCsv: DEMO_PRICE_LIST_CSV,
  },
  {
    id: 'weather',
    required: false,
    title: 'Weather / temperature',
    description:
      'Optional enrichment. Heat waves vs fresh SKUs. Can also use event_type=weather in the signals file. Columns: period, avg_temp_c, max_temp_c, heat_wave, notes.',
    fileName: 'company-weather.csv',
    demoFileName: 'demo-jordan-valley-weather.csv',
    demoLabel: 'Jordan Valley Dairy Co. weather (demo)',
    demoCsv: DEMO_WEATHER_CSV,
  },
  {
    id: 'capacity',
    required: false,
    title: 'Production / capacity constraints',
    description:
      'Optional enrichment. Forecast vs what the plant can make (planning crossover). Columns: period, line, sku_or_family, max_units, planned_hours, constraint_notes.',
    fileName: 'company-capacity.csv',
    demoFileName: 'demo-jordan-valley-capacity.csv',
    demoLabel: 'Jordan Valley Dairy Co. capacity (demo)',
    demoCsv: DEMO_CAPACITY_CSV,
  },
  {
    id: 'stock',
    required: false,
    title: 'Stock on hand',
    description:
      'Optional enrichment. Demand vs days of cover (inventory crossover). Columns: as_of_period, sku, units_on_hand, days_of_cover, warehouse, notes.',
    fileName: 'company-stock-on-hand.csv',
    demoFileName: 'demo-jordan-valley-stock.csv',
    demoLabel: 'Jordan Valley Dairy Co. stock on hand (demo)',
    demoCsv: DEMO_STOCK_CSV,
  },
  {
    id: 'returns',
    required: false,
    title: 'Returns / complaints',
    description:
      'Optional enrichment. Quality-driven demand dips. Columns: period, sku, return_units, complaint_type, channel, notes.',
    fileName: 'company-returns-complaints.csv',
    demoFileName: 'demo-jordan-valley-returns.csv',
    demoLabel: 'Jordan Valley Dairy Co. returns (demo)',
    demoCsv: DEMO_RETURNS_CSV,
  },
]
