"""Normalize all project screenshots to a consistent look.

Each output is a 1600x1000 (16:10) PNG with a soft slate background that
matches the site's `--muted` token. Mobile mockups (tall phone frames) are
centered with even padding; web/browser captures fill horizontally and are
vertically centered. Edges are trimmed first so each piece of content
occupies the same proportional area regardless of the source export.
"""
from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path

from PIL import Image, ImageChops, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
ASSETS = ROOT / "src" / "assets"

CANVAS_W, CANVAS_H = 1600, 1000
BG = (241, 245, 249)             # slate-100 — matches `--muted` in light mode
SHADOW_RGBA = (15, 23, 42, 35)   # very soft drop shadow
PAD_MOBILE = 0.06                # 6% padding around tall phone mocks
PAD_WEB = 0.04                   # 4% padding around web/browser mocks


@dataclass
class Spec:
    filename: str
    kind: str  # 'mobile' | 'web' | 'browser'


SPECS: list[Spec] = [
    # AIDA — phone mocks centered on light bg
    Spec("AIDA-Mob-Alert.png", "mobile"),
    Spec("AIDA-Mob-Dashboard.png", "mobile"),
    Spec("AIDA-Mob-Report.png", "mobile"),
    Spec("AIDA-Mob-SOS.png", "mobile"),
    # AIDA web mock
    Spec("AIDA-Web-Dashboard.png", "web"),
    # Lawod — phone mocks
    Spec("Lawod-Intro.png", "mobile"),
    Spec("Lawod-Login.png", "mobile"),
    Spec("Lawod-Market.png", "mobile"),
    # Lupon — full-page browser captures (no surrounding background)
    Spec("Lupon-Dashboard.jpg", "browser"),
    Spec("Lupon-CaseRecord.jpg", "browser"),
    Spec("Lupon-FreqRecord.jpg", "browser"),
    Spec("Lupon-InputCase.jpg", "browser"),
    Spec("Lupon-Analytics1.jpg", "browser"),
    Spec("Lupon-Analytics2.jpg", "browser"),
]


def trim_to_content(img: Image.Image, bg_rgb: tuple[int, int, int], tol: int = 8) -> Image.Image:
    """Crop away the uniform background of source mockups."""
    rgb = img.convert("RGB")
    bg = Image.new("RGB", rgb.size, bg_rgb)
    diff = ImageChops.difference(rgb, bg)
    # widen the diff slightly so anti-aliased edges are kept inside the bbox
    mask = diff.convert("L").point(lambda v: 255 if v > tol else 0)
    bbox = mask.getbbox()
    if not bbox:
        return img
    return img.crop(bbox)


def fit_inside(img: Image.Image, max_w: int, max_h: int) -> Image.Image:
    w, h = img.size
    scale = min(max_w / w, max_h / h)
    new_size = (max(1, int(w * scale)), max(1, int(h * scale)))
    return img.resize(new_size, Image.LANCZOS)


def render_card(content: Image.Image, kind: str) -> Image.Image:
    canvas = Image.new("RGB", (CANVAS_W, CANVAS_H), BG)

    pad = PAD_MOBILE if kind == "mobile" else PAD_WEB
    inner_w = int(CANVAS_W * (1 - 2 * pad))
    inner_h = int(CANVAS_H * (1 - 2 * pad))

    if kind == "browser":
        # Fill width; preserve aspect; let it be vertically centered
        scale = inner_w / content.width
        new_w = inner_w
        new_h = int(content.height * scale)
        if new_h > inner_h:
            scale = inner_h / content.height
            new_w = int(content.width * scale)
            new_h = inner_h
        sized = content.resize((new_w, new_h), Image.LANCZOS)
    else:
        sized = fit_inside(content, inner_w, inner_h)

    # Soft shadow underneath the content
    shadow_layer = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    shadow_box = Image.new("RGBA", (sized.width + 24, sized.height + 24), SHADOW_RGBA)
    sx = (CANVAS_W - shadow_box.width) // 2
    sy = (CANVAS_H - shadow_box.height) // 2 + 8
    shadow_layer.paste(shadow_box, (sx, sy))
    shadow_layer = shadow_layer.filter(ImageFilter.GaussianBlur(18))

    composed = Image.alpha_composite(canvas.convert("RGBA"), shadow_layer)

    ox = (CANVAS_W - sized.width) // 2
    oy = (CANVAS_H - sized.height) // 2
    composed.paste(sized.convert("RGBA"), (ox, oy), sized.convert("RGBA")
                   if sized.mode == "RGBA" else None)

    return composed.convert("RGB")


def process(spec: Spec) -> None:
    src = ASSETS / spec.filename
    img = Image.open(src)

    if spec.kind in ("mobile", "web"):
        # Source has a uniform light background; trim it tight first.
        bg_rgb = (249, 250, 251)
        trimmed = trim_to_content(img, bg_rgb, tol=10)
    else:
        # Browser capture — already tight.
        trimmed = img.convert("RGB")

    out = render_card(trimmed.convert("RGB"), spec.kind)

    # Always emit .png so transparent edges stay clean and lossless.
    out_path = ASSETS / (Path(spec.filename).stem + ".png")
    out.save(out_path, "PNG", optimize=True)
    if out_path != src:
        src.unlink()
    print(f"  ok {spec.filename:<28} -> {out_path.name}  ({out.width}x{out.height})")


def main() -> None:
    print(f"Normalizing {len(SPECS)} screenshots -> {CANVAS_W}x{CANVAS_H}")
    for spec in SPECS:
        process(spec)


if __name__ == "__main__":
    main()
