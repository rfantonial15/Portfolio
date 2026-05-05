"""Generate Randulf Fantonial's one-page resume PDF.

Layout:
  - Compact header with name, role, and an icon row (email, location, UTC+8,
    LinkedIn, GitHub) - the LinkedIn / GitHub badges are clickable links.
  - Experience (outcomes-first bullets)
  - Selected Projects (single-line outcomes)
  - Skills (one consolidated block)
  - Education (no graduation year)

Embeds Segoe UI for full Unicode support so symbols like the Philippine peso
render correctly.
"""
from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw

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
    Image as RLImage,
    KeepTogether,
    PageTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "rfantonialResume.pdf"
ICON_DIR = ROOT / "scripts" / "_resume_icons"

# ---------------------------------------------------------------------------
# Fonts
# ---------------------------------------------------------------------------
WIN_FONTS = Path("C:/Windows/Fonts")
FONT_REGULAR = "Body"
FONT_BOLD = "Body-Bold"
FONT_ITALIC = "Body-Italic"
PESO = "₱"

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
    FONT_REGULAR = "Helvetica"
    FONT_BOLD = "Helvetica-Bold"
    FONT_ITALIC = "Helvetica-Oblique"
    PESO = "PHP "


# ---------------------------------------------------------------------------
# Palette
# ---------------------------------------------------------------------------
INK = HexColor("#0f172a")
MUTED = HexColor("#475569")
ACCENT = HexColor("#2563eb")
RULE = HexColor("#cbd5e1")
SOFT = HexColor("#64748b")
LINKEDIN_BLUE = "#0A66C2"
GITHUB_DARK = "#181717"


# ---------------------------------------------------------------------------
# Icon generation
# ---------------------------------------------------------------------------
def render_icons() -> dict[str, Path]:
    """Render small PNG icons used in the contact row. Re-rendered on every
    build so the script stays self-contained."""
    ICON_DIR.mkdir(parents=True, exist_ok=True)
    size = 64                       # render at 2x for crispness; placed at 32
    fg = (71, 85, 105, 255)         # MUTED
    icons: dict[str, Path] = {}

    # ---- envelope (mail) ----
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    box = [8, 16, size - 8, size - 16]
    d.rounded_rectangle(box, radius=4, outline=fg, width=4)
    # flap
    d.polygon([(8, 16), (size // 2, size // 2), (size - 8, 16)], outline=fg)
    d.line([(8, 16), (size // 2, size // 2)], fill=fg, width=4)
    d.line([(size - 8, 16), (size // 2, size // 2)], fill=fg, width=4)
    p = ICON_DIR / "mail.png"
    img.save(p)
    icons["mail"] = p

    # ---- map pin (location) ----
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    # teardrop: circle on top, triangle pointing down
    cx, cy, r = size // 2, 22, 14
    d.ellipse([cx - r, cy - r, cx + r, cy + r], outline=fg, width=4)
    d.polygon([(cx - 8, cy + 10), (cx + 8, cy + 10), (cx, size - 6)], fill=fg)
    # inner dot
    d.ellipse([cx - 5, cy - 5, cx + 5, cy + 5], fill=fg)
    p = ICON_DIR / "pin.png"
    img.save(p)
    icons["pin"] = p

    # ---- clock (timezone) ----
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    cx, cy, r = size // 2, size // 2, 24
    d.ellipse([cx - r, cy - r, cx + r, cy + r], outline=fg, width=4)
    # hands at 10:10
    d.line([(cx, cy), (cx, cy - 14)], fill=fg, width=4)
    d.line([(cx, cy), (cx + 12, cy + 4)], fill=fg, width=4)
    p = ICON_DIR / "clock.png"
    img.save(p)
    icons["clock"] = p

    # ---- LinkedIn (rounded blue square + "in") ----
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    d.rounded_rectangle([2, 2, size - 2, size - 2], radius=10,
                        fill=LINKEDIN_BLUE)
    # i dot
    d.ellipse([14, 14, 22, 22], fill="white")
    # i stem
    d.rectangle([14, 26, 22, 50], fill="white")
    # n
    d.rectangle([28, 26, 36, 50], fill="white")          # left stem
    d.rectangle([46, 36, 54, 50], fill="white")          # right stem
    d.rectangle([28, 26, 54, 32], fill="white")          # top bar
    p = ICON_DIR / "linkedin.png"
    img.save(p)
    icons["linkedin"] = p

    # ---- GitHub (dark circle + simplified silhouette) ----
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    d.ellipse([0, 0, size, size], fill=GITHUB_DARK)
    # cat-like ears (two triangles up top)
    d.polygon([(14, 18), (24, 8), (24, 22)], fill="white")
    d.polygon([(50, 18), (40, 8), (40, 22)], fill="white")
    # body
    d.ellipse([14, 18, 50, 50], fill="white")
    # eyes
    d.ellipse([22, 28, 28, 34], fill=GITHUB_DARK)
    d.ellipse([36, 28, 42, 34], fill=GITHUB_DARK)
    # tail / leg hint
    d.rectangle([26, 46, 38, 56], fill="white")
    p = ICON_DIR / "github.png"
    img.save(p)
    icons["github"] = p

    return icons


ICONS = render_icons()


# ---------------------------------------------------------------------------
# Styles
# ---------------------------------------------------------------------------
styles = getSampleStyleSheet()

name_style = ParagraphStyle(
    "Name", parent=styles["Heading1"],
    fontName=FONT_BOLD, fontSize=22, leading=26,
    textColor=INK, spaceAfter=2, letterSpace=-0.4,
)
title_style = ParagraphStyle(
    "Title", parent=styles["Normal"],
    fontName=FONT_REGULAR, fontSize=10.5, leading=13,
    textColor=ACCENT, spaceAfter=4,
)
section_style = ParagraphStyle(
    "Section", parent=styles["Heading2"],
    fontName=FONT_BOLD, fontSize=9.5, leading=11,
    textColor=INK, spaceBefore=7, spaceAfter=2,
    letterSpace=1.4,
)
role_style = ParagraphStyle(
    "Role", parent=styles["Normal"],
    fontName=FONT_BOLD, fontSize=10, leading=12.5,
    textColor=INK,
)
org_style = ParagraphStyle(
    "Org", parent=styles["Normal"],
    fontName=FONT_ITALIC, fontSize=9, leading=11.5,
    textColor=MUTED,
)
meta_style = ParagraphStyle(
    "Meta", parent=styles["Normal"],
    fontName=FONT_REGULAR, fontSize=8.5, leading=11.5,
    textColor=SOFT, alignment=2,  # right
)
body_style = ParagraphStyle(
    "Body", parent=styles["Normal"],
    fontName=FONT_REGULAR, fontSize=9, leading=12,
    textColor=INK, alignment=TA_LEFT, spaceAfter=0,
)
bullet_style = ParagraphStyle(
    "Bullet", parent=body_style,
    leftIndent=11, bulletIndent=2, spaceAfter=0.5, leading=12,
)
small_style = ParagraphStyle(
    "Small", parent=styles["Normal"],
    fontName=FONT_REGULAR, fontSize=8.75, leading=11.75,
    textColor=INK,
)
contact_link = ParagraphStyle(
    "ContactLink", parent=styles["Normal"],
    fontName=FONT_REGULAR, fontSize=8.75, leading=11,
    textColor=MUTED,
)


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------
def hr(color=RULE, thickness=0.5, space_before=1, space_after=3):
    t = Table([[""]], colWidths=[7.4 * inch], rowHeights=[0.01])
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


def two_col(left, right, lw=5.0, rw=2.4):
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


def icon_image(name: str, size: int = 11) -> RLImage:
    img = RLImage(str(ICONS[name]), width=size, height=size)
    img.hAlign = "LEFT"
    return img


def contact_cell(icon: str, text: str, href: str | None = None):
    """Return a [icon, text-paragraph] table row used in the contact strip."""
    if href:
        body = Paragraph(
            f'<link href="{href}" color="#475569">{text}</link>',
            contact_link,
        )
    else:
        body = Paragraph(text, contact_link)
    inner = Table(
        [[icon_image(icon, size=11), body]],
        colWidths=[14, None],
    )
    inner.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("LEFTPADDING", (0, 0), (-1, -1), 0),
        ("RIGHTPADDING", (0, 0), (-1, -1), 4),
        ("TOPPADDING", (0, 0), (-1, -1), 0),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
    ]))
    return inner


# ---------------------------------------------------------------------------
# Build
# ---------------------------------------------------------------------------
def build():
    doc = BaseDocTemplate(
        str(OUT),
        pagesize=LETTER,
        leftMargin=0.55 * inch,
        rightMargin=0.55 * inch,
        topMargin=0.4 * inch,
        bottomMargin=0.4 * inch,
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
    story.append(Paragraph(
        "Full Stack Developer  &middot;  Co-Founder, AIDA",
        title_style,
    ))

    # Contact row: 5 inline icon+label cells in a single table. LinkedIn /
    # GitHub use a friendly handle as the visible text so nothing wraps.
    contact_row = Table(
        [[
            contact_cell("mail", "fantonial.randulf9@gmail.com",
                         "mailto:fantonial.randulf9@gmail.com"),
            contact_cell("pin", "Cagayan de Oro, PH"),
            contact_cell("clock", "UTC+8"),
            contact_cell("linkedin", "Randulf Fantonial",
                         "https://www.linkedin.com/in/randulf-fantonial-304922331"),
            contact_cell("github", "@rfantonial15",
                         "https://github.com/rfantonial15"),
        ]],
        colWidths=[2.05 * inch, 1.35 * inch, 0.7 * inch, 1.65 * inch, 1.25 * inch],
    )
    contact_row.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("LEFTPADDING", (0, 0), (-1, -1), 0),
        ("RIGHTPADDING", (0, 0), (-1, -1), 0),
        ("TOPPADDING", (0, 0), (-1, -1), 0),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
    ]))
    story.append(contact_row)
    story.append(Spacer(1, 6))
    story.append(hr(thickness=0.75, space_before=0, space_after=0))

    # ---------------- Experience ----------------
    story.extend(section("Experience"))

    experiences = [
        {
            "role": "Co-Founder & Full Stack Developer",
            "org": "Automated Incident Detection and Assistance (AIDA)",
            "period": "2024 - Present",
            "loc": "Cagayan de Oro, Philippines",
            "bullets": [
                f"Co-founded an AI incident-response platform — took 1st Place at SEA-CICSIC 2025 (Southeast Asia), placed in 7+ regional/international competitions, and secured {PESO}100,000 in non-dilutive grant funding.",
                "Drove the product from research demo to a deployable platform now being taken to market, leading the web frontend and core APIs across web and React Native.",
                "Aligned a multi-disciplinary AI / mobile / web team behind a single real-time detection pipeline, unblocking faster iteration on every surface.",
            ],
        },
        {
            "role": "Lead Full Stack Developer",
            "org": "Barangay Camaman-an — Lupon Digital Transformation",
            "period": "2026",
            "loc": "Cagayan de Oro, Philippines",
            "bullets": [
                "Launched a deployed case-management platform now used by Barangay officials for daily dispute resolution — intake, hearings, documents, and analytics in one system.",
                "Replaced paper logs with a real-time analytics dashboard surfacing caseload, deadlines, and resolution rates, and hardened compliance with full audit trails and role-based access.",
            ],
        },
        {
            "role": "Freelance Web & Mobile Developer",
            "org": "Independent",
            "period": "2023 - Present",
            "loc": "",
            "bullets": [
                "Shipped production web and mobile apps end-to-end for clients across the Philippines on fixed-scope timelines, owning everything from data model to deployment.",
                "Operate personal Python trading bots on Hyperliquid and Polymarket (LLM-assisted, 2025 - Present) to stay sharp on real-time systems and risk-aware automation under live market pressure.",
            ],
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
            Spacer(1, 1),
            *bullets(exp["bullets"]),
            Spacer(1, 4),
        ]
        story.append(KeepTogether(block))

    # ---------------- Selected Projects ----------------
    story.extend(section("Selected Projects"))
    projects = [
        {
            "name": "Automated Incident Detection and Assistance (AIDA)",
            "year": "2024 - Present",
            "desc": "Award-winning AI incident-response platform spanning web admin and React Native mobile clients. Best Capstone Project; 1st Place at SEA-CICSIC 2025 (Southeast Asia); "
                    f"{PESO}100,000 incubation grant.",
        },
        {
            "name": "Barangay Lupon Admin & Database",
            "year": "2026",
            "desc": "Deployed case-management platform now used by Barangay Camaman-an officials for daily dispute resolution, document workflows, and reporting.",
        },
        {
            "name": "Polymarket 5-Min Bot - BTC, ETH, SOL",
            "year": "2025 - Present",
            "desc": "Open-source Python bot that participates in Polymarket 5-minute crypto markets with an LLM-assisted strategy, risk module, and offline backtester.",
        },
        {
            "name": "Hyperliquid Auto-Trading Bot",
            "year": "2025 - Present",
            "desc": "Personal auto-execution bot for Hyperliquid with risk controls, kill-switch, and a live Telegram feed for fills, PnL, and overrides.",
        },
        {
            "name": "Lawod - Digital Fishing Companion",
            "year": "2023 - 2024",
            "desc": "Mobile marketplace for Filipino fishermen with a custom ocean-themed UI designed end-to-end in Figma.",
        },
    ]
    for p in projects:
        block = [
            two_col(
                Paragraph(p["name"], role_style),
                Paragraph(p["year"], meta_style),
            ),
            Paragraph(p["desc"], body_style),
            Spacer(1, 3),
        ]
        story.append(KeepTogether(block))

    # ---------------- Skills (single consolidated block) ----------------
    story.extend(section("Skills"))
    skills_blocks = [
        ("Languages & Frameworks",
         "TypeScript, Python, React.js, Next.js, React Native, Flutter, Django / DRF, Node.js, Express"),
        ("Data & Infrastructure",
         "PostgreSQL, MySQL, MongoDB, Firebase, Supabase, Docker, CI/CD"),
        ("UI & Design",
         "Tailwind CSS, Framer Motion, Figma"),
        ("APIs & Integrations",
         "REST, GraphQL, WebSockets, Webhooks, Telegram Bot API, Hyperliquid API, Polymarket API"),
        ("AI Tooling",
         "Claude (Anthropic), AI-assisted development, rapid prototyping"),
    ]
    rows = []
    for label, items in skills_blocks:
        rows.append([
            Paragraph(f'<font name="{FONT_BOLD}">{label}</font>', small_style),
            Paragraph(items, small_style),
        ])
    skill_tbl = Table(rows, colWidths=[1.7 * inch, 5.7 * inch])
    skill_tbl.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 0),
        ("RIGHTPADDING", (0, 0), (-1, -1), 0),
        ("TOPPADDING", (0, 0), (-1, -1), 1),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 1),
    ]))
    story.append(skill_tbl)

    # ---------------- Education ----------------
    story.extend(section("Education"))
    edu_block = [
        two_col(
            Paragraph("Bachelor of Science in Information Technology (BSIT)", role_style),
            Paragraph(
                f'<font color="#2563eb" name="{FONT_BOLD}">Cum Laude</font>',
                meta_style,
            ),
        ),
        two_col(
            Paragraph(
                "University of Science and Technology of Southern Philippines (USTP)",
                org_style,
            ),
            Paragraph("Cagayan de Oro, Philippines", meta_style),
        ),
        Spacer(1, 2),
        Paragraph(
            "Capstone: Automated Incident Detection and Assistance &mdash; "
            "awarded Best Capstone Project; later took 1st Place at SEA-CICSIC 2025 "
            f"(Southeast Asia division) and earned a {PESO}100,000 incubation grant.",
            small_style,
        ),
    ]
    story.append(KeepTogether(edu_block))

    OUT.parent.mkdir(parents=True, exist_ok=True)
    doc.build(story)
    print(f"Wrote {OUT}")


if __name__ == "__main__":
    build()
