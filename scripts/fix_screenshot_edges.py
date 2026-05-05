"""Re-canvas every project screenshot onto an identical 1600x1000 frame so
they read as a consistent set, and strip leftover OS/browser chrome bars
from full-bleed browser captures (the Lupon series).

Mobile/web mockups (isolated subject on a light bg) -> just re-extract the
subject bbox and re-center on the canonical canvas.

Browser captures (Lupon-*) -> additionally walk in from the top & bottom
removing rows that are >=70% near-black (window/tab chrome) or fully near
the canvas color (stray padding) before re-canvasing.
"""
from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageChops, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
ASSETS = ROOT / "src" / "assets"

CANVAS_W, CANVAS_H = 1600, 1000
BG = (241, 245, 249)
SHADOW_RGBA = (15, 23, 42, 35)
PAD_X, PAD_Y = 64, 64

BROWSER_PREFIXES = ("Lupon-",)


def extract_subject(img: Image.Image, tol: int = 12) -> Image.Image:
    bg = Image.new("RGB", img.size, BG)
    diff = ImageChops.difference(img, bg)
    mask = diff.convert("L").point(lambda v: 255 if v > tol else 0)
    bbox = mask.getbbox()
    return img.crop(bbox) if bbox else img


def row_signature(img: Image.Image, y: int) -> tuple[float, float]:
    row = list(img.crop((0, y, img.width, y + 1)).getdata())
    n = len(row)
    dark = sum(1 for (r, g, b) in row if (r + g + b) / 3 < 60)
    near_bg = sum(
        1 for (r, g, b) in row
        if abs(r - BG[0]) <= 6 and abs(g - BG[1]) <= 6 and abs(b - BG[2]) <= 6
    )
    return dark / n, near_bg / n


def trim_chrome(img: Image.Image, scan_px: int = 35) -> Image.Image:
    """Cut OS/browser chrome strips from the top/bottom of a full-bleed capture.

    Window/title bars are always within ~30px of the edge. We only scan that
    band, and a row only counts as "chrome" when it is overwhelmingly dark
    (>=80% of pixels near-black). The scan is sticky-from-the-edge: if the
    chrome bar is e.g. rows 9..15, we crop to row 16 (we trim past the last
    contiguous run of dark rows that touches the edge of the scan window).
    """
    w, h = img.size

    def deepest_dark_run(rows_iter, edge: int) -> int:
        """Return the row furthest from `edge` that belongs to a near-edge
        chrome band. Allow lots of slack BEFORE the band (soft padding from
        bbox extraction is normal), but stop quickly once the band ends."""
        last_dark = None
        slack_after = 0
        for y in rows_iter:
            dark_pct, _ = row_signature(img, y)
            if dark_pct >= 0.80:
                last_dark = y
                slack_after = 0
            elif last_dark is not None:
                slack_after += 1
                if slack_after > 3:
                    break
        return last_dark if last_dark is not None else edge

    top_dark = deepest_dark_run(range(scan_px), edge=-1)
    top_cut = top_dark + 1 if top_dark >= 0 else 0

    bot_dark = deepest_dark_run(range(h - 1, h - 1 - scan_px, -1), edge=h)
    bot_cut = bot_dark if bot_dark < h else h

    if top_cut >= bot_cut:
        return img
    return img.crop((0, top_cut, w, bot_cut))


def render(content: Image.Image) -> Image.Image:
    canvas = Image.new("RGBA", (CANVAS_W, CANVAS_H), BG + (255,))
    inner_w, inner_h = CANVAS_W - 2 * PAD_X, CANVAS_H - 2 * PAD_Y
    scale = min(inner_w / content.width, inner_h / content.height)
    sized = content.resize(
        (max(1, int(content.width * scale)), max(1, int(content.height * scale))),
        Image.LANCZOS,
    )

    shadow_layer = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    shadow_box = Image.new("RGBA", (sized.width + 24, sized.height + 24), SHADOW_RGBA)
    shadow_layer.paste(
        shadow_box,
        ((CANVAS_W - shadow_box.width) // 2, (CANVAS_H - shadow_box.height) // 2 + 8),
    )
    shadow_layer = shadow_layer.filter(ImageFilter.GaussianBlur(18))
    canvas = Image.alpha_composite(canvas, shadow_layer)

    canvas.paste(
        sized.convert("RGBA"),
        ((CANVAS_W - sized.width) // 2, (CANVAS_H - sized.height) // 2),
    )
    return canvas.convert("RGB")


def process(path: Path) -> None:
    img = Image.open(path).convert("RGB")
    subject = extract_subject(img)

    is_browser = path.stem.startswith(BROWSER_PREFIXES)
    if is_browser:
        cleaned = trim_chrome(subject)
    else:
        cleaned = subject

    out = render(cleaned)
    out.save(path, "PNG", optimize=True)
    tag = "browser" if is_browser else "subject"
    print(f"  ok {path.name:<28} [{tag}] {subject.size} -> {cleaned.size}")


def main() -> None:
    files = sorted(p for p in ASSETS.glob("*.png")
                   if p.stem.startswith(("AIDA-", "Lawod-", "Lupon-")))
    print(f"Re-cleaning {len(files)} screenshots")
    for p in files:
        process(p)


if __name__ == "__main__":
    main()
