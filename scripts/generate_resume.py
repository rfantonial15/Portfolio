"""Generate Randulf Fantonial's resume PDF from portfolio data.

Outputs to public/resume.pdf so the site can serve it directly.

Embeds Segoe UI (Windows system font) for full Unicode coverage so symbols
like the Philippine peso (P) render correctly. Falls back to Helvetica with
a "PHP" textual replacement if Segoe is unavailable.
"""
from __future__ import annotations

from pathlib import Path

from reportlab.lib.colors import HexColor
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import LETTER
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    KeepTogether,
    PageTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)

OUT = Path(__file__).resolve().parent.parent / "public" / "resume.pdf"

# ---------------------------------------------------------------------------
# Fonts — embed Segoe UI for proper Unicode (peso, em-dashes, middots).
# ---------------------------------------------------------------------------
WIN_FONTS = Path("C:/Windows/Fonts")
FONT_REGULAR = "Body"
FONT_BOLD = "Body-Bold"
FONT_ITALIC = "Body-Italic"
PESO = "₱"  # ₱

try:
    pdfmetrics.registerFont(TTFont(FONT_REGULAR, str(WIN_FONTS / "segoeui.ttf")))
    pdfmetrics.registerFont(TTFont(FONT_BOLD, str(WIN_FONTS / "segoeuib.ttf")))
    pdfmetrics.registerFont(TTFont(FONT_ITALIC, str(WIN_FONTS / "segoeuii.ttf")))
    pdfmetrics.registerFontFamily(
        FONT_REGULAR,
        normal=FONT_REGULAR,
        bold=FONT_BOLD,
        italic=FONT_ITALIC,
        boldItalic=FONT_BOLD,
    )
except Exception:
    # Fall back to Helvetica; replace ₱ with "PHP " so the glyph still reads.
    FONT_REGULAR = "Helvetica"
    FONT_BOLD = "Helvetica-Bold"
    FONT_ITALIC = "Helvetica-Oblique"
    PESO = "PHP "


# ---------------------------------------------------------------------------
# Color palette
# ---------------------------------------------------------------------------
INK = HexColor("#0f172a")
MUTED = HexColor("#475569")
ACCENT = HexColor("#2563eb")
RULE = HexColor("#cbd5e1")
SOFT = HexColor("#64748b")
CHIP_BG = HexColor("#eef2f7")

styles = getSampleStyleSheet()

name_style = ParagraphStyle(
    "Name", parent=styles["Heading1"],
    fontName=FONT_BOLD, fontSize=24, leading=28,
    textColor=INK, spaceAfter=2, letterSpace=-0.4,
)
title_style = ParagraphStyle(
    "Title", parent=styles["Normal"],
    fontName=FONT_REGULAR, fontSize=11.5, leading=14,
    textColor=ACCENT, spaceAfter=6,
)
contact_style = ParagraphStyle(
    "Contact", parent=styles["Normal"],
    fontName=FONT_REGULAR, fontSize=9, leading=13,
    textColor=SOFT, spaceAfter=0,
)
section_style = ParagraphStyle(
    "Section", parent=styles["Heading2"],
    fontName=FONT_BOLD, fontSize=10, leading=12,
    textColor=INK, spaceBefore=12, spaceAfter=4,
    letterSpace=1.4,
)
role_style = ParagraphStyle(
    "Role", parent=styles["Normal"],
    fontName=FONT_BOLD, fontSize=10.5, leading=13.5,
    textColor=INK,
)
org_style = ParagraphStyle(
    "Org", parent=styles["Normal"],
    fontName=FONT_ITALIC, fontSize=9.5, leading=12.5,
    textColor=MUTED,
)
meta_style = ParagraphStyle(
    "Meta", parent=styles["Normal"],
    fontName=FONT_REGULAR, fontSize=9, leading=12,
    textColor=SOFT, alignment=2,  # right
)
body_style = ParagraphStyle(
    "Body", parent=styles["Normal"],
    fontName=FONT_REGULAR, fontSize=9.5, leading=14,
    textColor=INK, alignment=TA_LEFT, spaceAfter=2,
)
bullet_style = ParagraphStyle(
    "Bullet", parent=body_style,
    leftIndent=12, bulletIndent=2, spaceAfter=1.5, leading=13.5,
)
small_style = ParagraphStyle(
    "Small", parent=styles["Normal"],
    fontName=FONT_REGULAR, fontSize=9, leading=12.5,
    textColor=INK,
)
muted_small = ParagraphStyle(
    "MutedSmall", parent=small_style,
    textColor=MUTED,
)


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------
def hr(color=RULE, thickness=0.5, space_before=2, space_after=4):
    t = Table([[""]], colWidths=[7.0 * inch], rowHeights=[0.01])
    t.setStyle(TableStyle([
        ("LINEBELOW", (0, 0), (-1, -1), thickness, color),
        ("LEFTPADDING", (0, 0), (-1, -1), 0),
        ("RIGHTPADDING", (0, 0), (-1, -1), 0),
        ("TOPPADDING", (0, 0), (-1, -1), space_before),
        ("BOTTOMPADDING", (0, 0), (-1, -1), space_after),
    ]))
    return t


def section(title):
    return [Paragraph(title.upper(), section_style), hr()]


def two_col(left, right, lw=4.7, rw=2.3):
    t = Table([[left, right]], colWidths=[lw * inch, rw * inch])
    t.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 0),
        ("RIGHTPADDING", (0, 0), (-1, -1), 0),
        ("TOPPADDING", (0, 0), (-1, -1), 0),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
    ]))
    return t


def bullets(items):
    return [Paragraph(f"&bull;&nbsp;&nbsp;{x}", bullet_style) for x in items]


def stack_line(stack):
    text = " &nbsp;&middot;&nbsp; ".join(stack)
    return Paragraph(
        f'<font color="#475569" name="{FONT_BOLD}">Stack</font> &nbsp; '
        f'<font color="#0f172a">{text}</font>',
        ParagraphStyle("Stack", parent=small_style, leading=12, spaceBefore=2),
    )


# ---------------------------------------------------------------------------
# Build
# ---------------------------------------------------------------------------
def build():
    doc = BaseDocTemplate(
        str(OUT),
        pagesize=LETTER,
        leftMargin=0.7 * inch,
        rightMargin=0.7 * inch,
        topMargin=0.55 * inch,
        bottomMargin=0.55 * inch,
        title="Randulf Fantonial - Resume",
        author="Randulf Fantonial",
        subject="Full Stack Developer Resume",
    )
    frame = Frame(
        doc.leftMargin, doc.bottomMargin,
        doc.width, doc.height,
        leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0,
        showBoundary=0,
    )
    doc.addPageTemplates([PageTemplate(id="main", frames=[frame])])

    story = []

    # ---------------- Header ----------------
    story.append(Paragraph("Randulf Fantonial", name_style))
    story.append(Paragraph("Full Stack Developer  &middot;  Co-Founder, AIDA", title_style))

    contact_left = (
        'fantonial.randulf9@gmail.com &nbsp;&middot;&nbsp; '
        'Cagayan de Oro, Philippines'
    )
    contact_right = (
        'linkedin.com/in/randulf-fantonial-304922331 '
        '&nbsp;&middot;&nbsp; github.com/rfantonial15'
    )
    contact_tbl = Table(
        [[Paragraph(contact_left, contact_style),
          Paragraph(contact_right, ParagraphStyle("CR", parent=contact_style, alignment=2))]],
        colWidths=[3.4 * inch, 3.6 * inch],
    )
    contact_tbl.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 0),
        ("RIGHTPADDING", (0, 0), (-1, -1), 0),
    ]))
    story.append(contact_tbl)
    story.append(Spacer(1, 6))
    story.append(hr(thickness=0.75, space_before=0, space_after=0))

    # ---------------- Summary ----------------
    story.extend(section("Summary"))
    summary = (
        "Full Stack Developer with 4+ years building production web and mobile "
        "products end-to-end across React, React Native, Django, and PostgreSQL. "
        "Co-founder of an award-winning AI incident-response platform "
        f"({PESO}100,000 grant, 1st place in Southeast Asia at SEA-CICSIC 2025) "
        "and lead engineer on a deployed government case-management system. "
        "I care about clean architecture, sharp UX details, and shipping work "
        "that holds up under daily use."
    )
    story.append(Paragraph(summary, body_style))

    # ---------------- Experience ----------------
    story.extend(section("Experience"))

    experiences = [
        {
            "role": "Co-Founder & Full Stack Developer",
            "org": "Automated Incident Detection and Assistance (AIDA)",
            "period": "2024 - Present",
            "loc": "Cagayan de Oro, Philippines",
            "bullets": [
                "Co-founded a real-time AI incident-response platform spun out of an award-winning college capstone; now taking the product to market.",
                "Lead the web frontend and core backend APIs, partnering with the AI and mobile teams to ship a unified detection pipeline across web and React Native.",
                f"Secured {PESO}100,000 in non-dilutive grant funding and placed in 7+ regional and international competitions, including 1st Place at SEA-CICSIC 2025 (Southeast Asia division).",
            ],
            "stack": ["React", "TypeScript", "Django REST", "PostgreSQL", "React Native"],
        },
        {
            "role": "Lead Full Stack Developer",
            "org": "Barangay Camaman-an - Lupon Digital Transformation",
            "period": "2026",
            "loc": "Cagayan de Oro, Philippines",
            "bullets": [
                "Designed and shipped a deployed case-management platform end-to-end - data model, API, admin UI, and analytics dashboard - for local dispute resolution.",
                "Modeled a normalized PostgreSQL schema for cases, hearings, and documents with full audit trails to meet government compliance requirements.",
                "Built role-based access control, document workflows, and an analytics layer that surfaces caseload, deadlines, and resolution rates.",
            ],
            "stack": ["React", "TypeScript", "Django REST", "PostgreSQL", "Tailwind CSS"],
        },
        {
            "role": "Freelance Web & Mobile Developer",
            "org": "Independent",
            "period": "2023 - Present",
            "loc": "Remote",
            "bullets": [
                "Shipped multiple production web and mobile apps for clients across the Philippines, owning everything from data model to deployment.",
                "Build and operate personal Python trading bots - an automated Hyperliquid execution bot with Telegram-driven monitoring, and a Polymarket 5-minute strategy bot with LLM-assisted signals and a backtester.",
            ],
            "stack": ["React Native", "Flutter", "Next.js", "Django", "Firebase", "Supabase", "Python"],
        },
    ]
    for exp in experiences:
        block = [
            two_col(
                Paragraph(exp["role"], role_style),
                Paragraph(exp["period"], meta_style),
            ),
            two_col(
                Paragraph(exp["org"], org_style),
                Paragraph(exp["loc"], meta_style),
            ),
            Spacer(1, 3),
            *bullets(exp["bullets"]),
            stack_line(exp["stack"]),
            Spacer(1, 8),
        ]
        story.append(KeepTogether(block))

    # ---------------- Selected Projects ----------------
    story.extend(section("Selected Projects"))
    projects = [
        {
            "name": "Automated Incident Detection and Assistance (AIDA)",
            "year": "2024 - Present",
            "desc": "AI-powered incident detection and citizen-reporting platform spanning web admin and React Native mobile clients, with real-time data processing and cloud-backed evidence. Awarded Best Capstone Project; now a venture-backed startup.",
            "stack": ["React Native", "React.js", "Django", "PostgreSQL"],
        },
        {
            "name": "Barangay Lupon Admin & Database",
            "year": "2026",
            "desc": "Case-management OS for local dispute resolution - intake, hearings, documents, and analytics - with role-based access and audit trails for compliance.",
            "stack": ["React", "TypeScript", "Django REST", "PostgreSQL"],
        },
        {
            "name": "Polymarket 5-Min Bot - BTC, ETH, SOL",
            "year": "2025 - Present",
            "desc": "Python trading bot for Polymarket 5-minute crypto markets: live websocket feed, LLM-assisted strategy with risk rules, and a backtester for offline validation. Open source on GitHub.",
            "stack": ["Python", "Polymarket API", "WebSockets", "Local LLM"],
        },
        {
            "name": "Hyperliquid Auto-Trading Bot",
            "year": "2025 - Present",
            "desc": "Personal Python bot that auto-executes orders on Hyperliquid based on strategy rules, with a live Telegram feed for fills, PnL, and kill-switch controls.",
            "stack": ["Python", "Hyperliquid API", "Telegram Bot API"],
        },
        {
            "name": "Lawod - Digital Fishing Companion",
            "year": "2023 - 2024",
            "desc": "Mobile marketplace for Filipino fishermen with a custom ocean-themed UI designed end-to-end in Figma.",
            "stack": ["Flutter", "Firebase", "Figma"],
        },
    ]
    for p in projects:
        block = [
            two_col(
                Paragraph(p["name"], role_style),
                Paragraph(p["year"], meta_style),
            ),
            Paragraph(p["desc"], body_style),
            stack_line(p["stack"]),
            Spacer(1, 6),
        ]
        story.append(KeepTogether(block))

    # ---------------- Skills ----------------
    story.extend(section("Skills"))
    skills = [
        ("Frontend", "React.js, TypeScript, Next.js, Tailwind CSS, Framer Motion"),
        ("Mobile", "React Native, Flutter, Expo"),
        ("Backend", "Django / DRF, Node.js, Express, Python, REST & GraphQL"),
        ("Database", "PostgreSQL, MySQL, MongoDB, Firebase, Supabase"),
        ("Tooling", "Git, Docker, CI/CD, Figma, Webhooks, Telegram Bot API"),
        ("AI", "Claude (Anthropic), AI-assisted development, rapid prototyping"),
    ]
    rows = []
    for label, items in skills:
        rows.append([
            Paragraph(f'<font name="{FONT_BOLD}">{label}</font>', small_style),
            Paragraph(items, small_style),
        ])
    skill_tbl = Table(rows, colWidths=[1.0 * inch, 6.0 * inch])
    skill_tbl.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 0),
        ("RIGHTPADDING", (0, 0), (-1, -1), 0),
        ("TOPPADDING", (0, 0), (-1, -1), 1.5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 1.5),
    ]))
    story.append(skill_tbl)

    # ---------------- Awards ----------------
    story.extend(section("Awards & Recognition"))
    awards = [
        ("PacketHacks x HacktheClimate", "Finalist", "Aug 2025"),
        ("SEA-CICSIC - Southeast Asia Division (China Int'l Innovation Competition)",
         "1st Place", "Jul 2025"),
        ("Disruptor X - Yearly Pitch Competition", "2nd Runner-Up", "Jun 2025"),
        ("Lambigit 2025 - N. Mindanao Research Innovation Summit",
         "Overall Best Poster", "Apr 2025"),
        ("Philippine Startup Challenge 9 - Region X", "1st Runner-Up", "Oct 2024"),
        ("Business Idea Development Award 2024", "Champion", "Oct 2024"),
        ("Sparks' Up Student Incubation Program", f"{PESO}100,000 Grant", "Sep 2024"),
        ("Tech101 Demo Day Pitching Competition", "Champion", "Jan 2024"),
    ]
    rows = []
    for title, rank, date in awards:
        rows.append([
            Paragraph(title, small_style),
            Paragraph(
                f'<font color="#2563eb" name="{FONT_BOLD}">{rank}</font>', small_style
            ),
            Paragraph(date, ParagraphStyle("D", parent=muted_small, alignment=2)),
        ])
    aw_tbl = Table(rows, colWidths=[4.1 * inch, 1.9 * inch, 1.0 * inch])
    aw_tbl.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 0),
        ("RIGHTPADDING", (0, 0), (-1, -1), 0),
        ("TOPPADDING", (0, 0), (-1, -1), 2),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 2),
    ]))
    story.append(aw_tbl)

    # ---------------- Education ----------------
    story.extend(section("Education"))
    edu_block = [
        two_col(
            Paragraph("Bachelor of Science in Information Technology (BSIT)", role_style),
            Paragraph("2021 - 2025", meta_style),
        ),
        two_col(
            Paragraph(
                "University of Science and Technology of Southern Philippines (USTP)",
                org_style,
            ),
            Paragraph("Cagayan de Oro, Philippines", meta_style),
        ),
        Spacer(1, 3),
        Paragraph(
            f'<font color="#2563eb" name="{FONT_BOLD}">Cum Laude</font> '
            "&nbsp;&middot;&nbsp; Capstone: Automated Incident Detection and "
            "Assistance &mdash; awarded Best Capstone Project",
            small_style,
        ),
    ]
    story.append(KeepTogether(edu_block))

    OUT.parent.mkdir(parents=True, exist_ok=True)
    doc.build(story)
    print(f"Wrote {OUT}")


if __name__ == "__main__":
    build()
