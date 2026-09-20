# Platform 2 — Technical Proposal

**From:** Investment World for Development and Technology  
**Date:** August 2026  
**Subject:** How Platform 2 is built — training course (item 1) and learning modules (2–10)  

---

## 1. What we build

A website for dairy company staff.

Three parts:

1. **Training course (item 1)** — materials, examples, exercises, knowledge check (about 45–90 minutes). No agent.
2. **Learning modules (2–10)** — practice data, exercises, agent, test, company upload (about 45–90 minutes each).
3. **Agents** — the same analysis as in a module, without the teaching path, by uploading a company file.

**One training course + nine modules.** Item 1 is the training course only. Modules 2–10 each have a module path **and** an agent.

Demo (Module 2, short version): https://muneernas.github.io/dairy-platform2-prototype/

---

## 2. How the system works

```
User (browser)
    → Platform 2 website (training course, modules, tables, quizzes, file upload)
    → Agent on nexos.ai (reads the data, returns results)
    → Results shown on the same page
```

- The user does **not** work inside nexos. They stay on our site.
- nexos is the engine that runs the agents.
- Practice data is stored in the website. Company data is uploaded by the user (CSV spreadsheet).
- If the agent service is down, the site can still show the training course and module practice path.

---

## 3. What the user sees

**Home**

- Path A: start the **training course** (item 1) or a **learning module** (2–10)  
- Path B: open an agent and upload a file  

**Inside the training course (item 1)**

| Step | What happens |
|------|----------------|
| 1. Objectives | What they should be able to do after the course |
| 2. Course materials | Short lessons and worked examples (hosted in the platform) |
| 3. Exercises | Guided questions; they must answer before moving on |
| 4. Test | Short quiz with a score |

No agent. No company file upload.

**Inside a learning module (2–10)**

| Step | What happens |
|------|----------------|
| 1. Objectives | What they should be able to do after the module |
| 2. Practice data | A made-up dairy company, as a table they can read; plus external signals where relevant |
| 3. Exercises | Questions on that table; they must answer before moving on |
| 4. Run the agent | Agent runs on the practice table and shows results |
| 5. Test | Short quiz with a score |
| 6. Company file | Upload CSV (or download a blank template, or try a demo file), then run the **same** agent on their data |

**Standalone agent**

Same agent as module steps 4 and 6. No teaching path. Upload → run → results.

---

## 4. What we build for every module (2–10)

For each topic we deliver:

| Item | Detail |
|------|--------|
| Module content | Objectives, practice company, 6–8 exercises, 6–8 test questions |
| Practice dataset | Realistic dairy table for that topic |
| CSV template | Columns the company should export from Excel / their system |
| Agent | Built and tested on nexos.ai, then connected to the website |
| Results screen | Tables, short recommendations, and risks they can act on |
| Standalone agent page | Same agent, no module path |

Learner time per full module: **45–90 minutes**. Module 4 (planning + sequencing) may run toward the upper end.

---

## 5. Training course and modules — file in, what the agent does, data out

This section describes item 1 (training course materials) and, for modules 2–10, exactly what goes into each agent, what it does step by step, and what the user sees on screen.

---

### External signals (Module 2 — demand forecast)

Sales history alone does not always explain a spike. **External signals** are a simple calendar file the company maintains — or exports from planning notes — so the forecast agent can say *why* demand moved, not only *what* moved.

#### What goes in the external signals file

| Column | Required | Example |
|--------|----------|---------|
| week | Yes | 5 |
| event_name | Yes | School term start |
| event_type | Yes | See table below |
| expected_impact | No | yogurt_up, milk_stable, cheese_down |
| notes | No | Back-to-school breakfast packs |

**Event types we support in the module and agent:**

| event_type | Meaning | Typical dairy SKUs affected |
|------------|---------|----------------------------|
| `school_term` | School year start or end | Yogurt, small-format milk, labneh (breakfast / lunchbox) |
| `holiday` | Public or local holiday | Shorter retail week; plan lower dispatch some SKUs |
| `ramadan` | Ramadan period or pre-Ramadan stock-up | Shift between retail daytime and evening/horeca; cheese, labneh, UHT |
| `promotion` | Retailer or own-brand promo | Promoted SKU only — often yogurt or milk — for 1–2 weeks |
| `weather` | Heat wave, cold snap | Ice cream, chilled juice, UHT (context-dependent) |
| `other` | Food-service contract, fair, export order | Channel named in notes |

#### Practice module example (simulated company)

Learners see this calendar **alongside** eight weeks of sales in step 2:

| Week | Event | Type | Why it matters |
|------|-------|------|----------------|
| 5 | School term start | school_term | Plain yogurt retail sales jump ~47% vs week 4 |
| 6 | Retail promotion on yogurt 500g | promotion | Promo extends the yogurt lift into a second week |
| 9 | Local holiday weekend | holiday | Retail week is shorter; milk demand eases |

The guided exercise asks: *“Which external signal best explains the Week 5–6 yogurt spike?”* — answer: school term start (Week 5), with promotion in Week 6.

#### What the agent does with external signals

1. Tag each week in the sales file that has a matching calendar row.  
2. Compare SKU movement in tagged weeks vs untagged weeks.  
3. State the link in plain language — e.g. *“Plain yogurt +18% in week 5 aligns with school term start.”*  
4. Adjust next-week forecast commentary (not invent numbers without sales data).  
5. Flag if forecast still depends on an **unconfirmed** promotion or holiday.

#### What the user sees on screen (extra block)

| Block | Example content |
|-------|-----------------|
| **External signals used** | Week 5 — School term start → Plain yogurt 500g; Week 6 — Retail promotion → Plain yogurt 500g |
| **Summary line** | “Yogurt spike driven mainly by school term + promotion; mean-reverting in week 9.” |
| **Recommendation** | “Confirm with sales whether Week 9 still carries promo uplift before locking yogurt volume.” |

If no external signals file is uploaded, the agent still forecasts from sales but recommends: *“Add holidays, school terms, and promotions next time to explain spikes.”*

---

### Training course (Item 1) — Using AI platforms and designing simple agents

**This is a training course**, not a module. No agent. No company file upload. All teaching **materials** live inside the course on the platform.

**Course materials:**

| Material | Detail |
|----------|--------|
| Learning objectives | What the learner can do after the course |
| Short lesson pages | What an agent is; what data to prepare; how to read outputs; when a person must review |
| Worked examples | Simple dairy examples (e.g. reading a small sales table before asking an agent) |
| Guided exercises | Questions with right/wrong feedback |
| Knowledge check | Short test with a score |

**Course covers:** what an agent is, what data to prepare, how to read outputs, when a person should review before acting.

---

### Module 2 — Demand forecast

#### File in

**Required — weekly sales file**

| Column | Required | Example |
|--------|----------|---------|
| week | Yes | 1, 2, … 8 |
| product_name | Yes | Plain yogurt 500g |
| category | Yes | Yogurt, milk, cheese |
| units_sold | Yes | 420 |
| channel | Yes | retail, food_service |

One row per product per week. Eight weeks of history is enough for the demo; production courses may use 12–26 weeks.

**Optional — external signals file (calendar events)**

| Column | Required | Example |
|--------|----------|---------|
| week | Yes | 5 |
| event_name | Yes | School term start |
| event_type | Yes | school_term, holiday, promotion, ramadan, weather, other |
| expected_impact | No | yogurt_up, milk_stable, cheese_down |
| notes | No | Back-to-school demand for single-serve packs |

Typical events a small dairy tracks: **school term start/end**, **public holidays**, **Ramadan** (including pre-Ramadan household stock-up), **retail promotions**, **weather heat waves** (ice cream / chilled drinks), **food-service contract renewals**.

**Example rows in the practice course:**

| week | event_name | event_type | expected_impact |
|------|------------|------------|-----------------|
| 5 | School term start | school_term | yogurt_up |
| 6 | Retail promotion on yogurt 500g | promotion | yogurt_up |
| 9 | Local holiday weekend | holiday | milk_stable |

The practice course shows **both** the sales table and this external signals calendar in step 2 so learners see how events explain spikes before they run the agent.

#### Agent does

1. Read weekly sales by product and channel.  
2. Calculate average weekly volume and how much each product jumps around (volatility).  
3. Read the external signals file (if provided) and tag weeks that had holidays, promotions, school terms, or Ramadan.  
4. Link unusual sales moves to tagged events — e.g. “yogurt +18% in week 5 aligns with school term start”.  
5. Forecast next-week units per product using recent trend plus event adjustments where relevant.  
6. Classify each product as **up**, **down**, or **stable** vs the recent average.  
7. Flag products where wrong production volume would cause **waste** (over-forecast risk) or **stockout** (under-forecast risk).  
8. Write a short plain-language summary a production or sales manager can act on.

#### Out (on screen)

| Block | Content |
|-------|---------|
| Headline | e.g. “Week 9 forecast — 4 products” |
| Summary | One paragraph: overall demand direction and which external signal mattered most |
| External signals used | List of events the agent matched to sales — columns: week, event name, event type, products affected (e.g. “Week 5 — School term start → Plain yogurt +47% vs prior week”) |
| Forecast table | Columns: product, category, last week units, forecast next week, trend (↑/↓/→), confidence note |
| Recommendations | 2–4 actions — e.g. increase yogurt run by one batch; hold cheese steady; confirm promo end date with sales |
| Risks | Waste risk if they over-produce; stockout risk if they under-produce; note if forecast relies on an unconfirmed promotion |
| Follow-up box | Optional question on the same data — e.g. “Which product is most likely to cause waste?” / “What if the yogurt spike was a one-week promotion?” |

---

### Module 3 — Sales and orders

#### File in

| Column | Required | Example |
|--------|----------|---------|
| order_id | Yes | SO-1042 |
| product_name | Yes | Labneh 1kg |
| customer | Yes | City Mart |
| channel | Yes | retail, food_service, export |
| order_date | Yes | 2026-06-12 |
| delivery_date | Yes | 2026-06-18 |
| quantity | Yes | 200 |
| status | Yes | confirmed, pending, cancelled |

#### Agent does

1. Split orders into confirmed vs still pending.  
2. Group demand by product and delivery week.  
3. Flag late confirmations, tight delivery windows, and customers with repeated changes.  
4. Compare order load to what production typically runs (using averages from the file).  
5. Highlight gaps where sales promised volume production has not yet seen.

#### Out

| Block | Content |
|-------|---------|
| Headline | e.g. “Next 7 days — 12 confirmed orders, 4 pending” |
| Summary | Where demand is concentrated and what is still uncertain |
| Order table | By product/customer: quantity, delivery date, status, risk flag |
| Coordination notes | What sales and production should align on before the run |
| Recommendations | 2–4 actions — e.g. chase pending orders by Tuesday; defer low-margin rush order |
| Risks | Plan breaks if pending orders confirm late; customer at risk of short delivery |

---

### Module 4 — Production planning and sequencing

Production **planning** and **sequencing** are one module and one agent. There is no separate sequencing module.

#### File in

**Demand side:** forecast or confirmed orders (product, units, week).

**Capacity and run side:**

| Column | Required | Example |
|--------|----------|---------|
| line | Yes | Yogurt line 1 |
| shift | Yes | day, night |
| available_hours | Yes | 16 |
| product_family | Yes | set_yogurt |
| run_rate_units_per_hour | Yes | 800 |
| milk_litres_available | Yes | 12000 |
| packaging_units_available | Yes | 50000 |
| run_id | Yes | RUN-09 |
| product_name | Yes | Plain yogurt |
| planned_units | Yes | 6000 |
| changeover_minutes | Yes | 45 |
| cleaning_type | Yes | CIP_full, CIP_light, none |

#### Agent does

**Planning**

1. Total demand by product for the planning horizon.  
2. Map products to lines and estimate hours needed per run.  
3. Check milk, packaging, and line hours — flag anything that cannot fit.  
4. Propose a feasible production plan (product, line, shift, planned units).  
5. Mark bottlenecks: line over capacity, milk short, packaging short.

**Sequencing (same agent, same run)**

6. List all planned runs per line from the feasible plan.  
7. Estimate total changeover and cleaning time for the current run order.  
8. Suggest a run sequence that groups similar products (e.g. white before flavoured, milk before yogurt) to cut changeovers.  
9. Calculate time saved vs the original order and note any customer deadline that forces a worse sequence.

#### Out

| Block | Content |
|-------|---------|
| Headline | e.g. “Week 9 plan — feasible; sequence saves ~90 min changeover” |
| Summary | Whether the plan fits, what limits it, and why run order matters |
| Plan table | Product, line, shift, planned units, hours used |
| Sequence table | Suggested run order, product, changeover minutes, cumulative time |
| Bottleneck list | Line, material, or shift that blocks full demand |
| Recommendations | e.g. move cheese to night shift; run plain yogurt before strawberry |
| Risks | Unmet orders if bottleneck ignored; product loss if sequence ignored; missed deadline if reordered wrong |

---

### Module 5 — Inventory

#### File in

| Column | Required | Example |
|--------|----------|---------|
| product_name | Yes | UHT milk 1L |
| location | Yes | cold_store_A, dispatch, packaging_store |
| batch_id | No | B-2026-041 |
| quantity | Yes | 1200 |
| unit | Yes | units, litres, kg |
| stock_type | Yes | finished_goods, raw_milk, packaging |

#### Agent does

1. Sum stock by product and location.  
2. Compare to recent sales velocity (if sales file attached) or static min/max rules in the file.  
3. Flag **low stock**, **excess**, and **slow movers**.  
4. Suggest reorders or internal moves between locations.

#### Out

| Block | Content |
|-------|---------|
| Headline | e.g. “Inventory snapshot — 3 alerts” |
| Summary | Overall stock health |
| Stock table | Product, location, quantity, status (OK / low / excess / slow) |
| Recommendations | Reorder quantities, move stock between locations |
| Risks | Stockout on high-runner; write-off on slow mover; packaging blocking a run |

---

### Module 6 — Shelf life

#### File in

| Column | Required | Example |
|--------|----------|---------|
| batch_id | Yes | B-2026-041 |
| product_name | Yes | Fresh milk 1L |
| production_date | Yes | 2026-06-01 |
| expiry_date | Yes | 2026-06-08 |
| quantity | Yes | 800 |
| location | Yes | cold_store_A |

#### Agent does

1. Calculate **days remaining** per batch.  
2. Sort batches **FEFO** (first expiry, first out).  
3. Flag batches expiring within a set window (e.g. 3–5 days).  
4. Suggest dispatch priority: retail vs food service vs markdown.

#### Out

| Block | Content |
|-------|---------|
| Headline | e.g. “5 batches need action within 5 days” |
| Summary | How much volume is at expiry risk |
| FEFO table | Batch, product, expiry, days left, suggested action |
| Recommendations | Dispatch order, markdown, transfer to food service |
| Risks | Write-off if not rotated; customer complaint if short-dated stock shipped wrong |

---

### Module 7 — Milk procurement / suppliers

#### File in

| Column | Required | Example |
|--------|----------|---------|
| supplier | Yes | Supplier A |
| delivery_date | Yes | 2026-06-10 |
| volume_litres | Yes | 15000 |
| price_per_litre | Yes | 0.42 |
| fat_pct | Yes | 3.5 |
| quality_pass | Yes | yes, no |
| on_time | Yes | yes, no |
| rejection_reason | No | antibiotics, temperature |

#### Agent does

1. Compare suppliers on price, volume, quality pass rate, and on-time delivery.  
2. Flag repeated quality failures or late deliveries.  
3. Show cost vs reliability trade-off — cheapest is not always best for a small dairy.

#### Out

| Block | Content |
|-------|---------|
| Headline | e.g. “Supplier comparison — 3 active suppliers” |
| Summary | Who is reliable vs who is cheap |
| Comparison table | Supplier, avg price, quality %, on-time %, volume share |
| Recommendations | Shift volume, audit supplier, renegotiate |
| Risks | Production stop if unreliable supplier carries too much share |

---

### Module 8 — Predictive maintenance

#### File in

| Column | Required | Example |
|--------|----------|---------|
| asset_name | Yes | Pasteuriser 1 |
| asset_type | Yes | pasteuriser, filler, pump, cold_room, CIP |
| downtime_hours | Yes | 4.5 |
| alarm_count | Yes | 12 |
| last_service_date | Yes | 2026-05-01 |
| notes | No | seal leak reported |

#### Agent does

1. Rank assets by combination of recent downtime, alarms, and time since service.  
2. Group by asset type so the plant manager sees systemic issues (e.g. all fillers).  
3. Suggest inspection order for the next maintenance window.

#### Out

| Block | Content |
|-------|---------|
| Headline | e.g. “Maintenance priority — 4 assets elevated risk” |
| Summary | What to fix first and why |
| Risk table | Asset, risk level, downtime, days since service, suggested check |
| Recommendations | Inspect before weekend run; schedule CIP review |
| Risks | Unplanned stop on pasteuriser or filler; product hold if cold room fails |

---

### Module 9 — Costing and margin

#### File in

| Column | Required | Example |
|--------|----------|---------|
| product_name | Yes | Flavoured yogurt 500g |
| volume | Yes | 10000 |
| selling_price | Yes | 1.20 |
| ingredient_cost | Yes | 0.55 |
| labour_cost | Yes | 0.15 |
| utilities_cost | Yes | 0.08 |
| logistics_cost | Yes | 0.06 |
| customer_or_channel | No | retail, food_service |

#### Agent does

1. Calculate **margin per unit** and **margin %** by product.  
2. Roll up by customer or channel if column present.  
3. Flag products below target margin or negative margin.  
4. Identify main cost drivers (ingredient vs labour vs logistics).

#### Out

| Block | Content |
|-------|---------|
| Headline | e.g. “Margin review — 2 products below target” |
| Summary | Where the plant makes or loses money |
| Margin table | Product, volume, revenue, total cost, margin %, flag |
| Recommendations | Reprice, reformulate, drop SKU, renegotiate ingredient |
| Risks | Hidden loss on high-volume line; customer churn if price raised without notice |

---

### Module 10 — Customer complaints

#### File in

| Column | Required | Example |
|--------|----------|---------|
| complaint_date | Yes | 2026-06-14 |
| complaint_type | Yes | quality, packing, delivery, temperature, expiry |
| product_name | Yes | Labneh 500g |
| batch_id | No | B-2026-038 |
| customer | No | City Mart |
| description | No | Seal broken on delivery |

#### Agent does

1. Count complaints by type and product over the period.  
2. Link repeat complaints to the same **batch** or **production day** where data allows.  
3. Surface trends — e.g. packing complaints spike after a filler change.  
4. Suggest follow-up: batch hold, line check, customer callback list.

#### Out

| Block | Content |
|-------|---------|
| Headline | e.g. “Complaints — 18 this month, 1 batch repeated” |
| Summary | Main issue types and whether they cluster |
| Complaint table | Type, count, top products, linked batches |
| Recommendations | Inspect filler; review cold-chain for temperature complaints |
| Risks | Recall scope if batch link confirmed; reputation if trend ignored |

---

## 6. Files

- Format: **CSV** (Excel can save this).
- Each agent has a **template** (headers only) and a **demo file** (filled example).
- Required columns must be present. Extra columns can be ignored.
- The site checks the file before sending it to the agent and tells the user if a column is missing.
- For demand forecasting, the **external signals file** is optional but improves forecast explanations when uploaded.
- Company files are used for that run. We do not build a company database in this delivery unless separately agreed.

---

## 7. Agents — how they work

The training course (item 1) has **no agent**. This section covers the **nine agents** for modules 2–10.

### 7.1 What an agent is

An agent is a **pre-set AI tool for one dairy job**. It is not a general chatbot.

- The **forecast agent** only forecasts.
- The **inventory agent** only looks at stock.
- The user stays on our website. They do not open nexos.

Each agent is built once on **nexos.ai**, then the website calls it whenever someone runs that topic.

### 7.2 The nine agents

| Agent | Module | Job in one line |
|-------|--------|-----------------|
| Demand forecasting agent | 2 | Next-period volumes by product, adjusted for external signals |
| Sales and orders agent | 3 | Read orders and flag coordination issues |
| Production-planning agent | 4 | Feasible plan **and** run sequence (planning + sequencing) |
| Inventory agent | 5 | Shortages, excess, slow movers |
| Shelf-life agent | 6 | Expiry risk and FEFO dispatch |
| Supplier agent | 7 | Compare milk suppliers |
| Maintenance agent | 8 | Rank equipment failure risk |
| Costing and margin agent | 9 | Profit by product / customer / channel |
| Complaint agent | 10 | Complaint trends linked to batches |

The **same** agent is used in the learning module (on practice data) and on the standalone page (on a company file).

### 7.3 What we set up inside each agent

Every agent has four parts:

| Part | What it is |
|------|------------|
| Job instructions | What the agent must do, what it must not invent, and that a person reviews before acting |
| Dairy context | How a small dairy works for that topic (perishable products, channels, typical constraints) |
| File rules | Which columns it expects; what to do if a row is empty or a number is missing |
| Result layout | Always the same shape: **summary → table → recommendations → risks** |

We test each agent on the practice file and on a messy file (wrong column name, missing week) so the website can show a clear error instead of a wrong answer.

### 7.4 What happens when someone runs an agent

1. User is in a learning module **or** on the standalone agent page.  
2. Data is either the **practice table** or an **uploaded CSV** (plus optional second file for external signals on forecast).  
3. The website checks the columns. If something required is missing, it stops and tells the user.  
4. The website sends the table + the agent’s job to nexos.  
5. The agent returns results in the fixed layout.  
6. The site shows them on screen.  
7. The user can type a **follow-up question** on the **same** data (e.g. “why is yogurt flagged?”).  
8. Nothing is written back into the company’s ERP. The person copies or uses the result in their own process.

### 7.5 What the screen always shows

| Block | Meaning |
|-------|---------|
| Headline | One-line result (e.g. “Week 9 forecast — 4 products”) |
| Short summary | What matters in plain language |
| Result table | Numbers for that topic (forecast, stock alerts, plan, sequence, etc.) |
| Recommendations | 2–4 actions a small dairy can take |
| Risks | What can go wrong if they ignore it |
| Follow-up box | Optional extra question |

For the **forecast agent**, an additional block lists **external signals used** when a calendar file was provided or practice data includes events.

For the **production-planning agent**, an additional **sequence table** shows suggested run order and changeover time saved.

### 7.6 What agents will not do

- They do **not** change production, orders, or stock in the company system.  
- They do **not** replace the manager’s decision.  
- They do **not** invent plant facts that are not in the file.  
- They do **not** train the user on how to use nexos itself.

### 7.7 Each agent — extra detail

**Demand forecasting agent (Module 2)**  
Reads weekly sales by product and channel. Reads optional **external signals** calendar: school terms, holidays, Ramadan, promotions, weather. Links events to sales moves before forecasting. Produces next-period units per product, trend (up / down / stable), volatility band (typical for yogurt), and explicit mention of which signal drove the change.  
Follow-up examples: “Which product is most likely to cause waste?” / “What if the yogurt spike was a promotion?”

**Sales and orders agent (Module 3)**  
Reads confirmed and pending orders by product, customer, channel, delivery date. Produces what is locked vs still open, late or tight deliveries, and where sales and production need to talk.  
Follow-up examples: “Which customer is driving next week’s load?” / “Which pending orders would break the plan if they confirm late?”

**Production-planning agent (Module 4)**  
Reads demand plus line hours, shifts, milk / ingredients / packaging, and run-level data (changeover, cleaning). Produces a feasible plan (or says it is not feasible), where capacity runs out, which material would stop the run, **and** a suggested run sequence to cut changeovers (e.g. white then flavoured, milk then yogurt).  
Follow-up examples: “What if we add a night shift?” / “What if cheese must go first for a customer deadline?” / “How much time do we lose with the current order?”

**Inventory agent (Module 5)**  
Reads quantity by product, location, batch — finished goods, raw milk, packaging. Produces low stock, excess, slow movers, and a simple reorder / move list.  
Follow-up examples: “What is covering less than one week of sales?” / “Where is packaging the bottleneck?”

**Shelf-life agent (Module 6)**  
Reads production date, expiry, remaining days, location. Produces FEFO pick list (oldest usable first), batches close to expiry, and what to dispatch or mark down.  
Follow-up examples: “What expires in the next 5 days?” / “Which batch should go to food service first?”

**Supplier agent (Module 7)**  
Reads supplier, volume, quality (e.g. fat, antibiotics, temperature on arrival), price, on-time. Produces a comparison table and who is cheap vs who is risky.  
Follow-up examples: “If we drop supplier B, can A cover volume?” / “Which quality failures repeated this month?”

**Maintenance agent (Module 8)**  
Reads asset name, downtime, alarms, last service — pasteuriser, filler, pumps, cold rooms, CIP. Produces a risk ranking and what to check first.  
Follow-up examples: “Which asset lost the most hours last month?” / “What should we inspect before the weekend?”

**Costing and margin agent (Module 9)**  
Reads volume, selling price, and costs (ingredients, labour, utilities, logistics, returns). Produces margin by product / customer / channel and which lines lose money.  
Follow-up examples: “Why is flavoured yogurt worse than plain?” / “Which customer is below target margin?”

**Complaint agent (Module 10)**  
Reads date, type, product, batch, customer (quality, packing, delivery, temperature, expiry). Produces volume by type, batches that appear more than once, and a suggested follow-up.  
Follow-up examples: “Are packing complaints tied to one filler day?” / “Which SKU has the most temperature complaints?”

### 7.8 Keys and running cost

API keys and nexos / LLM usage are **not** inside the website build fee. The client provides keys, or usage is passed through at cost. Monthly AI cost depends on how many people **run agents**, not on how many have an account.

---

## 8. Website (technical)

| Item | Choice |
|------|--------|
| Type | Web application (works in a browser on computer or tablet) |
| Front end | React |
| Agents | nexos.ai Gateway |
| Practice data | Built into the site |
| Company data | CSV upload |
| Languages | English first. Arabic if requested as extra work |
| Login | Not in the current demo. Can be added if the project needs named users |
| Hosting | Demo is on GitHub Pages. Live site can stay there or move to the project’s server |

Designed for up to **500–1,000 users**. Cost of the AI calls depends on how many people **run agents** in a month, not on how many have an account.

---

## 9. What is already done

| Item | Status |
|------|--------|
| Website shell (home, training course / module steps, agent entry) | Working in the demo |
| Module 2 path (short version) | Live |
| CSV upload screen (demo) | Live |
| nexos connection | Wired; demo also works without a live key |
| Training course (item 1) and modules 3–10 | To be built at full 45–90 minute depth |
| Module 2 full production version | Rebuilt to the same full depth as the others |

The current demo is a **short walkthrough**, not the full Module 2.

---

## 10. Delivery list

| # | Deliverable |
|---|-------------|
| 1 | Platform 2 website |
| 2 | Training course — item 1 (materials only) |
| 3 | Modules 2–10 (full module + agent + template + demo file) |
| 4 | Nine agents on nexos.ai, connected to the site |
| 5 | Practice datasets for modules 2–10 |
| 6 | CSV templates for modules 2–10 |
| 7 | Course materials for the training course (item 1) |

Not in this technical delivery unless agreed separately: company visits, Arabic, user accounts / admin, linking live to the company’s ERP (upload is file-based).

---

*End of technical proposal*
