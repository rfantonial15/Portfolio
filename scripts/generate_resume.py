"""Generate Randulf Fantonial's resume PDF from portfolio data.

Outputs to public/resume.pdf so the site can serve it directly.
"""
from pathlib import Path

from reportlab.lib.colors import HexColor
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import LETTER
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
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

INK = HexColor("#0f172a")
MUTED = HexColor("#475569")
ACCENT = HexColor("#2563eb")
RULE = HexColor("#cbd5e1")
SOFT = HexColor("#64748b")

styles = getSampleStyleSheet()

name_style = ParagraphStyle(
    "Name", parent=styles["Heading1"],
    fontName="Helvetica-Bold", fontSize=22, leading=26,
    textColor=INK, spaceAfter=2,
)
title_style = ParagraphStyle(
    "Title", parent=styles["Normal"],
    fontName="Helvetica", fontSize=11, leading=14,
    textColor=ACCENT, spaceAfter=4,
)
contact_style = ParagraphStyle(
    "Contact", parent=styles["Normal"],
    fontName="Helvetica", fontSize=9, leading=12,
    textColor=SOFT, spaceAfter=0,
)
section_style = ParagraphStyle(
    "Section", parent=styles["Heading2"],
    fontName="Helvetica-Bold", fontSize=10.5, leading=13,
    textColor=INK, spaceBefore=10, spaceAfter=4,
    textTransform="uppercase",
)
role_style = ParagraphStyle(
    "Role", parent=styles["Normal"],
    fontName="Helvetica-Bold", fontSize=10.5, leading=13,
    textColor=INK,
)
org_style = ParagraphStyle(
    "Org", parent=styles["Normal"],
    fontName="Helvetica-Oblique", fontSize=10, leading=13,
    textColor=MUTED,
)
meta_style = ParagraphStyle(
    "Meta", parent=styles["Normal"],
    fontName="Helvetica", fontSize=9, leading=12,
    textColor=SOFT, alignment=2,  # right
)
body_style = ParagraphStyle(
    "Body", parent=styles["Normal"],
    fontName="Helvetica", fontSize=9.5, leading=13,
    textColor=INK, alignment=TA_LEFT, spaceAfter=2,
)
bullet_style = ParagraphStyle(
    "Bullet", parent=body_style,
    leftIndent=12, bulletIndent=2, spaceAfter=1,
)
small_style = ParagraphStyle(
    "Small", parent=styles["Normal"],
    fontName="Helvetica", fontSize=9, leading=12.5,
    textColor=INK,
)
muted_small = ParagraphStyle(
    "MutedSmall", parent=small_style,
    textColor=MUTED,
)


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


def role_row(left, right):
    t = Table([[left, right]], colWidths=[4.7 * inch, 2.3 * inch])
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
    text = " &nbsp;·&nbsp; ".join(stack)
    return Paragraph(
        f'<font color="#475569"><b>Stack:</b></font> <font color="#0f172a">{text}</font>',
        ParagraphStyle("Stack", parent=small_style, leading=12, spaceBefore=2),
    )


def build():
    doc = BaseDocTemplate(
        str(OUT),
        pagesize=LETTER,
        leftMargin=0.7 * inch,
        rightMargin=0.7 * inch,
        topMargin=0.55 * inch,
        bottomMargin=0.55 * inch,
        title="Randulf Fantonial — Resume",
        author="Randulf Fantonial",
    )
    frame = Frame(
        doc.leftMargin, doc.bottomMargin,
        doc.width, doc.height,
        leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0,
        showBoundary=0,
    )
    doc.addPageTemplates([PageTemplate(id="main", frames=[frame])])

    story = []

    # Header
    story.append(Paragraph("Randulf Fantonial", name_style))
    story.append(Paragraph("Full Stack Developer", title_style))
    contact_left = (
        'fantonial.randulf9@gmail.com &nbsp;·&nbsp; Cagayan de Oro, Philippines'
    )
    contact_right = (
        'linkedin.com/in/randulf-fantonial-304922331 &nbsp;·&nbsp; github.com/randulffantonial'
    )
    contact_tbl = Table(
        [[Paragraph(contact_left, contact_style),
          Paragraph(contact_right, ParagraphStyle("CR", parent=contact_style, alignment=2))]],
        colWidths=[3.5 * inch, 3.5 * inch],
    )
    contact_tbl.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 0),
        ("RIGHTPADDING", (0, 0), (-1, -1), 0),
    ]))
    story.append(contact_tbl)
    story.append(Spacer(1, 6))
    story.append(hr(thickness=0.75, space_before=0, space_after=0))

    # Summary
    story.extend(section("Summary"))
    summary = (
        "Full Stack Developer with 4+ years building production web and mobile apps across "
        "React, React Native, Django, and PostgreSQL. Award-winning capstone founder turned "
        "co-founder, shipping polished UIs and reliable backends with a focus on clean "
        "architecture, sharp UX, and high iteration speed."
    )
    story.append(Paragraph(summary, body_style))

    # Experience
    story.extend(section("Experience"))

    experiences = [
        {
            "role": "Full Stack Developer & Co-Founder",
            "org": "Automated Incident Detection and Assistance (AIDA)",
            "period": "2024 – Present",
            "loc": "Cagayan de Oro, Philippines",
            "bullets": [
                "Owned the web frontend and core backend APIs on a multi-disciplinary capstone team that won Best Capstone Project.",
                "Coordinated with teammates handling AI models and mobile clients to integrate real-time incident detection across platforms.",
                "Continuing the work as a co-founder taking the platform to market — raised ₱100,000 grant and placed in 7+ national competitions.",
            ],
            "stack": ["React", "TypeScript", "Django REST", "PostgreSQL", "React Native"],
        },
        {
            "role": "Full Stack Developer",
            "org": "Barangay Camaman-an — Lupon Digital Transformation",
            "period": "2026",
            "loc": "Cagayan de Oro, Philippines",
            "bullets": [
                "Led the case management platform end-to-end from data model to deployed UI for local dispute resolution.",
                "Modeled a normalized PostgreSQL schema for cases, hearings, and documents with full audit trails.",
                "Hand-rolled role-based access control and audit trails to meet compliance requirements.",
            ],
            "stack": ["React", "TypeScript", "Django REST", "PostgreSQL", "Tailwind CSS"],
        },
        {
            "role": "Freelance Web & Mobile Developer",
            "org": "Independent",
            "period": "2023 – Present",
            "loc": "Remote",
            "bullets": [
                "Shipped multiple web and mobile apps for clients across the Philippines, end-to-end from design to deployment.",
                "Built and maintain custom Telegram automation bots for crypto monitoring, alerts, and webhook integrations.",
            ],
            "stack": ["React Native", "Flutter", "Next.js", "Django", "Firebase", "Supabase", "Python"],
        },
    ]
    for exp in experiences:
        block = [
            role_row(
                Paragraph(exp["role"], role_style),
                Paragraph(exp["period"], meta_style),
            ),
            role_row(
                Paragraph(exp["org"], org_style),
                Paragraph(exp["loc"], meta_style),
            ),
            Spacer(1, 2),
            *bullets(exp["bullets"]),
            stack_line(exp["stack"]),
            Spacer(1, 6),
        ]
        story.append(KeepTogether(block))

    # Selected Projects
    story.extend(section("Selected Projects"))
    projects = [
        {
            "name": "Barangay Lupon Admin & Database",
            "year": "2026",
            "desc": "Case management OS for local dispute resolution with document management, role-based access, and audit trails.",
            "stack": ["React", "TypeScript", "Django REST", "PostgreSQL"],
        },
        {
            "name": "Automated Incident Detection and Assistance",
            "year": "2024 – Present",
            "desc": "AI-powered incident detection across mobile and web with real-time data processing and cloud-backed evidence. Awarded Best Capstone Project.",
            "stack": ["React Native", "React.js", "Django", "PostgreSQL"],
        },
        {
            "name": "Telegram Crypto Bots",
            "year": "2023 – Present",
            "desc": "Real-time notification and command-based Telegram bots for crypto monitoring with webhook integrations.",
            "stack": ["Python", "Telegram Bot API", "Webhooks"],
        },
        {
            "name": "Lawod — Digital Fishing Companion",
            "year": "2023 – 2024",
            "desc": "Mobile marketplace tailored to Filipino fishermen with custom ocean-themed UI designed end-to-end in Figma.",
            "stack": ["Flutter", "Firebase", "Figma"],
        },
    ]
    for p in projects:
        block = [
            role_row(
                Paragraph(f'{p["name"]}', role_style),
                Paragraph(p["year"], meta_style),
            ),
            Paragraph(p["desc"], body_style),
            stack_line(p["stack"]),
            Spacer(1, 5),
        ]
        story.append(KeepTogether(block))

    # Skills
    story.extend(section("Skills"))
    skills = [
        ("Frontend", "React.js, TypeScript, Next.js, Tailwind CSS, Framer Motion"),
        ("Mobile", "React Native, Flutter, Expo"),
        ("Backend", "Django / DRF, Node.js, Express, Python, REST & GraphQL"),
        ("Database", "PostgreSQL, MySQL, MongoDB, Firebase, Supabase"),
        ("Tools", "Git, Docker, Figma, CI/CD, Webhooks, Telegram Bot API"),
        ("AI", "Claude (Anthropic), AI-Assisted Development, Rapid Prototyping"),
    ]
    rows = []
    for label, items in skills:
        rows.append([
            Paragraph(f'<b>{label}</b>', small_style),
            Paragraph(items, small_style),
        ])
    skill_tbl = Table(rows, colWidths=[1.0 * inch, 6.0 * inch])
    skill_tbl.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 0),
        ("RIGHTPADDING", (0, 0), (-1, -1), 0),
        ("TOPPADDING", (0, 0), (-1, -1), 1),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 1),
    ]))
    story.append(skill_tbl)

    # Awards
    story.extend(section("Awards & Recognition"))
    awards = [
        ("PacketHacks x HacktheClimate", "Finalist", "Aug 2025"),
        ("SEA-CICSIC — Southeast Asia Division (China Int'l Innovation Competition)", "1st Place", "Jul 2025"),
        ("Disruptor X — Yearly Pitch Competition", "2nd Runner-Up", "Jun 2025"),
        ("Lambigit 2025 — N. Mindanao Research Innovation Summit", "Overall Best Poster", "Apr 2025"),
        ("Philippine Startup Challenge 9 — Region X", "1st Runner-Up", "Oct 2024"),
        ("Business Idea Development Award 2024", "Champion", "Oct 2024"),
        ("Sparks' Up Student Incubation Program", "₱100,000 Grant", "Sep 2024"),
        ("Tech101 Demo Day Pitching Competition", "Champion", "Jan 2024"),
    ]
    rows = []
    for title, rank, date in awards:
        rows.append([
            Paragraph(title, small_style),
            Paragraph(f'<font color="#2563eb"><b>{rank}</b></font>', small_style),
            Paragraph(date, ParagraphStyle("D", parent=muted_small, alignment=2)),
        ])
    aw_tbl = Table(rows, colWidths=[4.1 * inch, 1.9 * inch, 1.0 * inch])
    aw_tbl.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 0),
        ("RIGHTPADDING", (0, 0), (-1, -1), 0),
        ("TOPPADDING", (0, 0), (-1, -1), 1.5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 1.5),
    ]))
    story.append(aw_tbl)

    # Education
    story.extend(section("Education"))
    edu_block = [
        role_row(
            Paragraph("Bachelor of Science in Information Technology (BSIT)", role_style),
            Paragraph("2021 – 2025", meta_style),
        ),
        role_row(
            Paragraph("University of Science and Technology of Southern Philippines (USTP)", org_style),
            Paragraph("Cagayan de Oro, Philippines", meta_style),
        ),
        Spacer(1, 2),
        Paragraph(
            '<font color="#2563eb"><b>Cum Laude</b></font> &nbsp;·&nbsp; '
            "Capstone: Automated Incident Detection and Assistance (Best Capstone Project)",
            small_style,
        ),
    ]
    story.append(KeepTogether(edu_block))

    OUT.parent.mkdir(parents=True, exist_ok=True)
    doc.build(story)
    print(f"Wrote {OUT}")


if __name__ == "__main__":
    build()
