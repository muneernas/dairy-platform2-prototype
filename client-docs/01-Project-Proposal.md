# Platform 2 — Capacity Building Delivery Proposal

**To:** [Mother Company Name]  
**From:** Investment World for Development and Technology  
**Date:** August 2026  
**Subject:** SmartGreenEcos Platform 2 — capacity building for dairy SMEs  

---

## 1. Purpose of this document

This is what we will build for **Platform 2**: a capacity-building site for people working in dairy companies.

It includes **one training course** and **nine learning modules**. **Modules 2 to 10** each have a matching **agent** the company can also use on its own data. **Item 1** is a **training course** only (using AI platforms) — we do not build a separate agent for it. Step-by-step **course materials** live inside that training course.

---

## 2. What we are building

There are two ways to use the platform.

**A. Training course (item 1) and learning modules (2–10)**  
Someone new to AI starts with the **training course** (materials, examples, exercises, test). For operational topics they go through a **module**: objectives, practice company, questions, run the agent, short test, then try the same agent on a file they upload. Section 3 spells this out.

**B. Agents**  
If they already have their numbers in a spreadsheet, they can skip the module path. They open the agent, upload the file, and run the analysis. It is the same agent as in modules 2–10.

---

## 3. What the platform will cover

### 3.1 Training course — Item 1 (materials inside the course)

**Item 1 is a training course**, not a module with an agent. All teaching material for “how to use AI platforms and design simple agents” sits **inside** this course — short lessons, examples, guided exercises, and a knowledge check. There is no agent to run and no company file to upload for item 1.

**Course materials include:**

| Material | What it is |
|----------|------------|
| Learning objectives | What the learner should be able to do after the course |
| Short lesson content | What an agent is, what data to prepare, how to read outputs |
| Worked examples | Simple dairy-task examples (e.g. reading a small table before asking an agent) |
| Guided exercises | Questions with feedback — answer before moving on |
| Knowledge check | Short test with a score at the end |

Typical learner time for this training course: about **45–90 minutes**.

### 3.2 What is inside each learning module (2–10)

Every module from **2 to 10** follows the same steps. The topic, the practice table, the questions, and the agent change.

**1. Learning objectives**  
A few lines on what they should be able to do afterwards — for example, read sales by product, make sense of a forecast, and use it so they waste less or run out less often.

**2. Practice company data**  
They get a full example from a made-up dairy plant, as a table they can open. For demand forecasting that is eight weeks of weekly sales by product: name, category, units, and whether it went to shops or food service. They also see an **external signals calendar** — holidays, school terms, promotions, Ramadan, and similar events — so they can link spikes in sales to real-world causes. Other modules use the same idea with different tables — orders, stock, shelf life, suppliers, breakdowns, costs, complaints. We show a few headline numbers first (how many weeks, how many products, which one jumps around the most) so they know what to look for before they open the whole table.

**3. Guided exercises**  
Questions about that table, one at a time. They pick an answer and we tell them why it is right or wrong for a small dairy. For forecasting, at least one question asks which **external signal** explains a demand spike. They have to answer before they move on.

**4. Run the agent**  
They run the agent on the practice data. For forecasting they see next week’s volumes by product, whether demand is up or down, which external signals the agent used, what we suggest, and what could go wrong. They can ask a follow-up question if they want.

**5. Short test**  
A few more questions, one at a time, to check they understood the idea. They get feedback after each one and a score at the end.

**6. Use it on the company’s own files**  
They attach the kind of export they would pull from their own system (CSV). For forecasting, weekly sales by product is **required**; an **external signals file** (calendar of holidays, promotions, school terms, Ramadan, etc.) is **optional but recommended**. They can upload their file, download a blank template, or try a demo export if they have nothing ready. Then they run the **same** agent on that file and see results for that company — not the practice table from step 2.

A full module takes about **45–90 minutes**. The online demo is a shorter version of the same path.

#### External signals in Module 2 (demand forecasting)

**External signals** are events outside the sales spreadsheet that explain why demand jumps or drops — things the plant already knows but does not always write into the sales export. For a Jordan dairy SME, typical signals include:

| Signal type | What it is | Example effect on demand |
|-------------|------------|---------------------------|
| **School term** | Start or end of school year | Yogurt and single-serve milk rise when families restock breakfast packs |
| **Public holiday** | National or local holiday weekend | Shorter retail week; horeca may stay steady |
| **Ramadan** | Fasting period and pre-Ramadan stock-up | Shift from daytime retail to evening/horeca; labneh and cheese patterns change |
| **Retail promotion** | Chain discount or display deal | Sharp lift on promoted SKU (often yogurt) for 1–2 weeks |
| **Weather** | Heat wave or cold snap | Ice cream, chilled drinks, or UHT milk move differently |
| **Food-service contract** | Catering or hotel contract renewal | Horeca channel volume step-change |

In **Module 2**, learners see two tables in step 2:

1. **Weekly sales by product** (eight weeks, four SKUs, retail + food service)  
2. **External signals calendar** — e.g. Week 5 *school term start*, Week 6 *yogurt promotion*, Week 9 *local holiday*

They answer an exercise linking the **Week 5–6 yogurt spike** to those calendar rows before they run the agent.

When they **run the agent** (step 4) or **upload company files** (step 6), the forecast output includes an **“External signals used”** block — which event was matched to which product move — not only a number forecast.

**File in (company upload):** sales CSV is **required**; external signals CSV is **optional but recommended**. Columns: `week`, `event_name`, `event_type` (school_term, holiday, promotion, ramadan, weather, other), plus optional `expected_impact` and `notes`. A blank template and demo file are provided.

### 3.3 Delivery list — one training course + nine modules

| No. | Name | Type |
|-----|------|------|
| 1 | Using AI platforms and designing simple agents | **Training course** (materials only — no agent) |
| 2 | Demand forecasting with an AI forecasting agent | Module + agent |
| 3 | Sales and order analysis with an AI sales agent | Module + agent |
| 4 | Production planning and sequencing with an AI production-planning agent | Module + agent |
| 5 | Inventory monitoring with an AI inventory agent | Module + agent |
| 6 | Shelf-life management with an AI shelf-life agent | Module + agent |
| 7 | Milk procurement with an AI supplier agent | Module + agent |
| 8 | Predictive maintenance with an AI maintenance agent | Module + agent |
| 9 | Profitability and costing with an AI margin agent | Module + agent |
| 10 | Customer complaint analysis with an AI complaint agent | Module + agent |

**Note on Module 4:** Production **sequencing** (run order, changeovers, cleaning time) is part of this module — not a separate item. The same agent builds a feasible plan **and** suggests the best run sequence on each line.

Better forecasts and stock decisions also cut waste. That is how green practice shows up here — inside the day-to-day work, not as a separate tool.

### 3.4 What you can already try

**Module 2 — Demand forecasting** is live, with the full path above:

- Objectives, eight-week sales table, external signals calendar, exercises, agent, test, and file upload  
- The forecasting agent on its own, for people who already have a file  
- Demo: https://muneernas.github.io/dairy-platform2-prototype/

The other modules will follow this same shape. Item 1 stays a **training course** without its own agent. All **ten items** are in this delivery.

---

## 4. Summary

| Topic | What we will deliver |
|-------|----------------------|
| Purpose | Help dairy SMEs get better at using AI in everyday work |
| How it works | One training course (item 1) + learning modules (2–10) with agents on company files |
| Inside the training course | Materials, examples, exercises, knowledge check |
| Inside a module | Objectives, practice table, external signals (where relevant), questions, agent, test, then upload their own data |
| Scope | Training course (1) + modules 2–10; agents for modules 2–10 |
| Already working | Demand forecasting (Module 2) |

---

*End of proposal*
