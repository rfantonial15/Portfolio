"""Clean up Coffeenoy emulator captures and re-canvas them so they sit on
the same slate frame as the other project screenshots.

Each source PNG is an Android Studio emulator capture: a dark device frame
with the app screen inside, floating on the emulator's dark gray background.
We:

  1. Trim away the emulator background (~RGB 45,47,49) on every side so the
     device fills its own frame edge-to-edge.
  2. Drop a thin row off the very bottom-right where the emulator's "1:1"
     zoom badge often appears.
  3. Re-canvas onto the same 1600x1000 slate sheet + soft drop shadow used
     for AIDA / Lawod mobile mocks for visual parity across the gallery.
"""
from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageChops, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
ASSETS = ROOT / "src" / "assets"

CANVAS_W, CANVAS_H = 1600, 1000
SLATE = (241, 245, 249)
EMULATOR_BG = (45, 47, 49)
SHADOW_RGBA = (15, 23, 42, 35)
PAD_X, PAD_Y = 64, 64

FILES = [
    "Coffeenoy.png",
    "CoffeenoyLogin.png",
    "CoffeenoyMaps.png",
    "CoffeenoyStep1.png",
]


def trim_emulator_bg(img: Image.Image, tol: int = 18) -> Image.Image:
    rgb = img.convert("RGB")
    bg = Image.new("RGB", rgb.size, EMULATOR_BG)
    diff = ImageChops.difference(rgb, bg)
    mask = diff.convert("L").point(lambda v: 255 if v > tol else 0)
    bbox = mask.getbbox()
    return rgb.crop(bbox) if bbox else rgb


def extract_from_slate(img: Image.Image, tol: int = 30) -> Image.Image:
    """Pull the device back out of an already-canvased slate image.

    `tol` is set high enough that the soft shadow halo we composited around
    the device is excluded from the bbox — only the device frame itself.
    """
    bg = Image.new("RGB", img.size, SLATE)
    diff = ImageChops.difference(img, bg)
    mask = diff.convert("L").point(lambda v: 255 if v > tol else 0)
    bbox = mask.getbbox()
    return img.crop(bbox) if bbox else img


def mask_right_overlays(img: Image.Image, strip_ratio: float = 0.08) -> Image.Image:
    """Overpaint the Android Studio emulator scaling icons (volume / "1:1" /
    fullscreen) that sit on the right edge of the device frame.

    Strategy: sample the device frame color from the LEFT edge (which is
    always clean), then within the rightmost N% of the image replace any
    pixel brighter than the frame color with that frame color. Dark frame
    pixels and rounded-corner pixels are untouched.
    """
    w, h = img.size
    # Sample the frame color from a clean stretch on the left at mid-height.
    samples = [img.getpixel((x, h // 2)) for x in range(2, 8)]
    samples += [img.getpixel((x, h // 3)) for x in range(2, 8)]
    samples += [img.getpixel((x, 2 * h // 3)) for x in range(2, 8)]
    avg_r = sum(p[0] for p in samples) // len(samples)
    avg_g = sum(p[1] for p in samples) // len(samples)
    avg_b = sum(p[2] for p in samples) // len(samples)
    frame = (avg_r, avg_g, avg_b)

    strip_w = max(20, int(w * strip_ratio))
    pixels = img.load()
    threshold = (avg_r + avg_g + avg_b) / 3 + 25
    for x in range(w - strip_w, w):
        for y in range(h):
            r, g, b = pixels[x, y]
            if (r + g + b) / 3 > threshold:
                pixels[x, y] = frame
    return img


def render(content: Image.Image) -> Image.Image:
    canvas = Image.new("RGBA", (CANVAS_W, CANVAS_H), SLATE + (255,))
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
    # If the file is already on slate canvas (a previous pass), pull the
    # device back out before doing anything else.
    if img.size == (CANVAS_W, CANVAS_H):
        device = extract_from_slate(img)
    else:
        device = trim_emulator_bg(img)

    cleaned = mask_right_overlays(device)
    out = render(cleaned)
    out.save(path, "PNG", optimize=True)
    print(f"  ok {path.name:<22} {img.size} -> device {device.size}")


def main() -> None:
    print(f"Cleaning {len(FILES)} Coffeenoy screenshots")
    for name in FILES:
        process(ASSETS / name)


if __name__ == "__main__":
    main()
