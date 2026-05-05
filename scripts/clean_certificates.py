"""Trim the dark PDF-viewer background from certificate PNGs and re-canvas
them onto a clean white sheet with soft drop shadow.

Source files come straight out of a dark-themed PDF preview: the actual
certificate sits centered on a uniform (~37,37,37) gray. This script:

  1. Crops away that dark padding so the certificate fills the frame.
  2. Pads with a couple of pixels of white so the document edge isn't flush.
  3. Adds a subtle slate background + soft shadow so it presents like a
     framed document — matching the look of project screenshots.

Output dimensions follow each certificate's own aspect ratio (rather than
forcing 16:10) so the document never looks squashed or cropped.
"""
from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageChops, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
CERT_DIR = ROOT / "src" / "assets" / "Certificate"

VIEWER_BG = (37, 37, 37)
SHEET_BG = (241, 245, 249)         # slate-100 — same canvas as screenshots
SHADOW_RGBA = (15, 23, 42, 45)
PAD_RATIO = 0.05                   # canvas margin around the certificate
TARGET_W = 1600                    # uniform render width for crisp display


def trim_viewer_bg(img: Image.Image, tol: int = 14) -> Image.Image:
    rgb = img.convert("RGB")
    bg = Image.new("RGB", rgb.size, VIEWER_BG)
    diff = ImageChops.difference(rgb, bg)
    mask = diff.convert("L").point(lambda v: 255 if v > tol else 0)
    bbox = mask.getbbox()
    return rgb.crop(bbox) if bbox else rgb


def render(certificate: Image.Image) -> Image.Image:
    aspect = certificate.height / certificate.width
    target_h = int(TARGET_W * aspect)

    # 5% canvas margin on every side, then drop in the certificate.
    pad_x = int(TARGET_W * PAD_RATIO)
    pad_y = int(target_h * PAD_RATIO)
    canvas_w = TARGET_W
    canvas_h = target_h + 2 * pad_y - pad_y  # vertical padding only top/bottom equal
    canvas_h = target_h
    inner_w = canvas_w - 2 * pad_x
    inner_h = canvas_h - 2 * pad_y

    scale = min(inner_w / certificate.width, inner_h / certificate.height)
    sized = certificate.resize(
        (max(1, int(certificate.width * scale)), max(1, int(certificate.height * scale))),
        Image.LANCZOS,
    )

    canvas = Image.new("RGBA", (canvas_w, canvas_h), SHEET_BG + (255,))

    shadow_layer = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    shadow_box = Image.new("RGBA", (sized.width + 30, sized.height + 30), SHADOW_RGBA)
    shadow_layer.paste(
        shadow_box,
        ((canvas_w - shadow_box.width) // 2, (canvas_h - shadow_box.height) // 2 + 10),
    )
    shadow_layer = shadow_layer.filter(ImageFilter.GaussianBlur(22))
    canvas = Image.alpha_composite(canvas, shadow_layer)

    canvas.paste(
        sized.convert("RGBA"),
        ((canvas_w - sized.width) // 2, (canvas_h - sized.height) // 2),
    )
    return canvas.convert("RGB")


def process(path: Path) -> None:
    img = Image.open(path)
    trimmed = trim_viewer_bg(img)
    out = render(trimmed)
    out.save(path, "PNG", optimize=True)
    print(f"  ok {path.name:<28} {img.size} -> trimmed {trimmed.size} -> {out.size}")


def main() -> None:
    files = sorted(p for p in CERT_DIR.glob("*.png"))
    print(f"Cleaning {len(files)} certificates")
    for p in files:
        process(p)


if __name__ == "__main__":
    main()
