from docx import Document
from docx.shared import Pt, Cm, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml.ns import qn, nsdecls
from docx.oxml import parse_xml

doc = Document()

for section in doc.sections:
    section.page_width = Cm(21.0)
    section.page_height = Cm(29.7)
    section.top_margin = Cm(1.2)
    section.bottom_margin = Cm(1.0)
    section.left_margin = Cm(1.4)
    section.right_margin = Cm(1.4)

NAVY = RGBColor(0x0F, 0x3A, 0x47)
TEAL = RGBColor(0x1F, 0x6B, 0x5C)
BODY = RGBColor(0x2C, 0x2C, 0x2C)
MUTED = RGBColor(0x5A, 0x5A, 0x5A)
WHITE = RGBColor(0xFF, 0xFF, 0xFF)
SOFT = RGBColor(0xD5, 0xE8, 0xE2)


def set_run_font(run, size=9, bold=False, color=BODY, italic=False):
    run.font.name = 'Calibri'
    run._element.rPr.rFonts.set(qn('w:eastAsia'), 'Calibri')
    run.font.size = Pt(size)
    run.bold = bold
    run.italic = italic
    run.font.color.rgb = color


def shade_cell(cell, hex_color):
    tcPr = cell._tc.get_or_add_tcPr()
    tcPr.append(parse_xml(f'<w:shd {nsdecls("w")} w:fill="{hex_color}"/>'))


def set_cell_borders(cell, color='C5D5CF'):
    tcPr = cell._tc.get_or_add_tcPr()
    tcPr.append(parse_xml(
        f'''<w:tcBorders {nsdecls("w")}>
            <w:top w:val="single" w:sz="4" w:space="0" w:color="{color}"/>
            <w:left w:val="single" w:sz="4" w:space="0" w:color="{color}"/>
            <w:bottom w:val="single" w:sz="4" w:space="0" w:color="{color}"/>
            <w:right w:val="single" w:sz="4" w:space="0" w:color="{color}"/>
        </w:tcBorders>'''
    ))


def write_cell(cell, text, bold=False, size=8.5, color=BODY, fill=None, center=False):
    cell.text = ''
    p = cell.paragraphs[0]
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER if center else WD_ALIGN_PARAGRAPH.LEFT
    p.paragraph_format.space_before = Pt(1.5)
    p.paragraph_format.space_after = Pt(1.5)
    run = p.add_run(text)
    set_run_font(run, size=size, bold=bold, color=color)
    if fill:
        shade_cell(cell, fill)
    set_cell_borders(cell)


def add_section_title(text):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(7)
    p.paragraph_format.space_after = Pt(3)
    run = p.add_run(text)
    set_run_font(run, size=10.5, bold=True, color=NAVY)
    pPr = p._p.get_or_add_pPr()
    pPr.append(parse_xml(
        f'''<w:pBdr {nsdecls("w")}>
            <w:bottom w:val="single" w:sz="8" w:space="2" w:color="1F6B5C"/>
        </w:pBdr>'''
    ))


def add_line(text, size=8.5, bold=False, color=BODY, before=0, after=2, italic=False):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(before)
    p.paragraph_format.space_after = Pt(after)
    run = p.add_run(text)
    set_run_font(run, size=size, bold=bold, color=color, italic=italic)


# Banner
banner = doc.add_table(rows=1, cols=1)
bc = banner.cell(0, 0)
bc.text = ''
p1 = bc.paragraphs[0]
r1 = p1.add_run('INVESTMENT WORLD FOR DEVELOPMENT AND TECHNOLOGY')
set_run_font(r1, size=8, bold=True, color=WHITE)
p2 = bc.add_paragraph()
r2 = p2.add_run('Payment Terms')
set_run_font(r2, size=16, bold=True, color=WHITE)
p3 = bc.add_paragraph()
r3 = p3.add_run('Platform 2 — Capacity Building  ·  August 2026  ·  Currency: JOD')
set_run_font(r3, size=8, color=SOFT)
shade_cell(bc, '0F3A47')
set_cell_borders(bc, '0F3A47')
for p in bc.paragraphs:
    p.paragraph_format.space_before = Pt(1)
    p.paragraph_format.space_after = Pt(1)
bc.paragraphs[0].paragraph_format.space_before = Pt(6)
bc.paragraphs[-1].paragraph_format.space_after = Pt(6)

# 1 Rate
add_section_title('1. Hourly rate')
t1 = doc.add_table(rows=1, cols=2)
write_cell(t1.cell(0, 0), 'Rate', bold=True, size=8.5, color=NAVY, fill='F4F7F6')
write_cell(t1.cell(0, 1), '20 JOD / hour', bold=True, size=8.5, color=TEAL, fill='F4F7F6')
for row in t1.rows:
    row.cells[0].width = Cm(7.5)
    row.cells[1].width = Cm(10.5)

# 2 Unit
add_section_title('2. Unit of delivery')
add_line(
    'Pricing is per delivery item (training course 1 + modules 2–10), not per dairy product. '
    'Item 1 is a training course only (materials, no agent). Modules 2–10 are a full learning path plus an operational agent on nexos.ai. '
    'Module 4 covers production planning and sequencing in one module. '
    'Each module / the training course is built for about 45–90 minutes of self-paced learner time.',
    size=8, color=MUTED, after=3,
)
ut = doc.add_table(rows=3, cols=3)
write_cell(ut.cell(0, 0), 'Item', bold=True, size=8, color=WHITE, fill='0F3A47', center=True)
write_cell(ut.cell(0, 1), 'Estimated hours', bold=True, size=8, color=WHITE, fill='0F3A47', center=True)
write_cell(ut.cell(0, 2), 'Price', bold=True, size=8, color=WHITE, fill='0F3A47', center=True)
unit_rows = [
    ('Training course 1 (materials only)', '20 hours', '400 JOD'),
    ('Each module 2–10 (module + agent)', '35 hours', '700 JOD'),
]
for i, (a, b, c) in enumerate(unit_rows, 1):
    fill = 'F4F7F6' if i % 2 else 'FFFFFF'
    write_cell(ut.cell(i, 0), a, bold=True, size=8, color=NAVY, fill=fill)
    write_cell(ut.cell(i, 1), b, size=8, color=BODY, fill=fill, center=True)
    write_cell(ut.cell(i, 2), c, bold=True, size=8, color=BODY, fill=fill, center=True)
for row in ut.rows:
    row.cells[0].width = Cm(7.5)
    row.cells[1].width = Cm(4.5)
    row.cells[2].width = Cm(6.0)

# 3 Project price
add_section_title('3. Platform 2 full delivery — project price')
add_line(
    'Fixed price for the training course plus nine modules as described in the Platform 2 proposal.',
    size=8, color=MUTED, after=3,
)
pt = doc.add_table(rows=5, cols=2)
write_cell(pt.cell(0, 0), 'Piece', bold=True, size=8, color=WHITE, fill='0F3A47', center=True)
write_cell(pt.cell(0, 1), 'Price', bold=True, size=8, color=WHITE, fill='0F3A47', center=True)
pkg_rows = [
    ('Training course 1 + modules 2–7', '4,600 JOD'),
    ('Modules 8–9 (5% discount on each)', '2,000 JOD'),
    ('Module 10', 'Included free'),
    ('Project price', '6,600 JOD'),
]
for i, (a, b) in enumerate(pkg_rows, 1):
    fill = 'E7F0ED' if i == 4 else ('F4F7F6' if i % 2 else 'FFFFFF')
    write_cell(pt.cell(i, 0), a, bold=True, size=8, color=NAVY, fill=fill)
    write_cell(
        pt.cell(i, 1), b,
        bold=True, size=8.5 if i == 4 else 8,
        color=TEAL if i == 4 else BODY,
        fill=fill, center=True,
    )
for row in pt.rows:
    row.cells[0].width = Cm(9.0)
    row.cells[1].width = Cm(9.0)

st = doc.add_table(rows=3, cols=2)
write_cell(st.cell(0, 0), 'Total estimated development time', bold=True, size=8, color=NAVY, fill='F4F7F6')
write_cell(st.cell(0, 1), '335 hours', bold=True, size=8, color=BODY, fill='F4F7F6', center=True)
write_cell(st.cell(1, 0), 'Includes', bold=True, size=8, color=NAVY, fill='FFFFFF')
write_cell(st.cell(1, 1), 'Module 10 at no charge; 5% reduction on modules 8–9; sequencing merged into Module 4', size=8, color=BODY, fill='FFFFFF')
write_cell(st.cell(2, 0), 'Prototype', bold=True, size=8, color=NAVY, fill='F4F7F6')
write_cell(st.cell(2, 1), 'Demand forecasting demo already delivered — free of charge', size=8, color=BODY, fill='F4F7F6')

# 4 Payment
add_section_title('4. Payment schedule')
ps = doc.add_table(rows=3, cols=3)
write_cell(ps.cell(0, 0), 'Milestone', bold=True, size=8, color=WHITE, fill='0F3A47', center=True)
write_cell(ps.cell(0, 1), 'When', bold=True, size=8, color=WHITE, fill='0F3A47', center=True)
write_cell(ps.cell(0, 2), 'Amount', bold=True, size=8, color=WHITE, fill='0F3A47', center=True)
write_cell(ps.cell(1, 0), 'Deposit', bold=True, size=8.5, color=NAVY, fill='F4F7F6')
write_cell(ps.cell(1, 1), 'On agreement / start of work', size=8.5, color=BODY, fill='F4F7F6')
write_cell(ps.cell(1, 2), '50% — 3,300 JOD', bold=True, size=9, color=TEAL, fill='F4F7F6', center=True)
write_cell(ps.cell(2, 0), 'Delivery', bold=True, size=8.5, color=NAVY, fill='FFFFFF')
write_cell(ps.cell(2, 1), 'When the training course and all nine modules are ready for review', size=8.5, color=BODY, fill='FFFFFF')
write_cell(ps.cell(2, 2), '50% — 3,300 JOD', bold=True, size=9, color=TEAL, fill='FFFFFF', center=True)

# 5 API costs
add_section_title('5. Estimated API & platform costs')
add_line(
    'Not included in the project price. The client provides API keys, or usage is passed through at cost.',
    size=8, color=MUTED, after=2,
)
add_line(
    'The platform may eventually serve up to 500–1,000 registered users across the programme. '
    'LLM cost depends on active users in a given month, not on how many people have an account.',
    size=8, color=BODY, after=2,
)
add_line(
    'Active user: someone who runs the training course, a module, or an agent that month (practice data, follow-up questions, or a company file upload). '
    'Someone who only has access and does not use the agents that month is not counted. '
    'Figures below are indicative; actual spend depends on model choice and CSV size.',
    size=8, color=BODY, after=3,
)
api = doc.add_table(rows=5, cols=3)
write_cell(api.cell(0, 0), 'Item', bold=True, size=8, color=WHITE, fill='0F3A47', center=True)
write_cell(api.cell(0, 1), 'Active users that month', bold=True, size=8, color=WHITE, fill='0F3A47', center=True)
write_cell(api.cell(0, 2), 'Estimated cost', bold=True, size=8, color=WHITE, fill='0F3A47', center=True)
api_rows = [
    ('nexos.ai platform subscription', 'Not per user', '~20 EUR / month'),
    ('LLM API — live platform (light use)', '~25 – 100', '~25 – 100 JOD / month'),
    ('LLM API — live platform (moderate use)', '~100 – 300', '~100 – 300 JOD / month'),
    ('LLM API — live platform (heavy or peak use)', '~300 – 500+', '~300 – 600 JOD / month'),
]
for i, (a, b, c) in enumerate(api_rows, 1):
    fill = 'F4F7F6' if i % 2 else 'FFFFFF'
    write_cell(api.cell(i, 0), a, bold=False, size=8, color=BODY, fill=fill)
    write_cell(api.cell(i, 1), b, size=8, color=BODY, fill=fill, center=True)
    write_cell(api.cell(i, 2), c, bold=True, size=8, color=BODY, fill=fill, center=True)
for row in api.rows:
    row.cells[0].width = Cm(7.2)
    row.cells[1].width = Cm(4.8)
    row.cells[2].width = Cm(6.0)

# 6 Commercial notes
add_section_title('6. Commercial notes')
add_line(
    'Two rounds of revisions per item (training course or module) are included. Further changes are billed at 20 JOD / hour.',
    size=8, color=BODY, after=2,
)
add_line(
    'This project price applies to the full ten-item delivery commissioned together.',
    size=8, color=BODY, after=2,
)

fp = doc.add_paragraph()
fp.alignment = WD_ALIGN_PARAGRAPH.CENTER
fp.paragraph_format.space_before = Pt(4)
fr = fp.add_run('Investment World for Development and Technology  ·  Platform 2 Payment Terms')
set_run_font(fr, size=7.5, color=MUTED, italic=True)

out = r'C:\Users\muneer\dairy-simulation-prototype\client-docs\Investment_World_Payment_Terms_v2.docx'
doc.save(out)
print(out)
