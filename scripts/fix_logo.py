"""Trim whitespace from logo.png and make the background transparent.

The original logo has a large white border around the RF mark, which makes it
look tiny inside the navbar's 36x36 box. This script:
  1. Detects and crops the surrounding white border.
  2. Pads to a perfect square so the logo isn't squashed.
  3. Replaces near-white pixels with transparency for clean light/dark display.
"""
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "public" / "logo.png"


def to_transparent(img: Image.Image) -> Image.Image:
    """Recover a clean RF mark + blue dot on a fully transparent background.

    Treats every original pixel as a composite over white, then re-derives the
    mark's true alpha from its darkness. This preserves anti-aliased edges
    instead of jagged 1-bit silhouettes.
    """
    img = img.convert("RGBA")
    pixels = img.load()
    w, h = img.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = pixels[x, y]
            # Un-premultiply alpha back over white background.
            if a == 0:
                bg_r = bg_g = bg_b = 255
            else:
                blend = a / 255
                bg_r = int(r * blend + 255 * (1 - blend))
                bg_g = int(g * blend + 255 * (1 - blend))
                bg_b = int(b * blend + 255 * (1 - blend))

            is_blue = bg_b > 140 and bg_b > bg_r + 40 and bg_b > bg_g + 40
            if is_blue:
                pixels[x, y] = (37, 99, 235, 255)
                continue

            # Darkness drives alpha; pixels lighter than ~85% white drop out.
            brightness = (bg_r + bg_g + bg_b) / 3
            if brightness >= 220:
                pixels[x, y] = (0, 0, 0, 0)
            else:
                new_a = max(0, min(255, int(255 * (1 - brightness / 220))))
                pixels[x, y] = (15, 23, 42, new_a)
    return img


def crop_to_content(img: Image.Image) -> Image.Image:
    bbox = img.getbbox()
    if bbox:
        return img.crop(bbox)
    return img


def pad_to_square(img: Image.Image, padding_ratio: float = 0.06) -> Image.Image:
    w, h = img.size
    side = max(w, h)
    pad = int(side * padding_ratio)
    side += pad * 2
    new = Image.new("RGBA", (side, side), (0, 0, 0, 0))
    new.paste(img, ((side - w) // 2, (side - h) // 2), img)
    return new


def main():
    img = Image.open(SRC)
    img = to_transparent(img)
    img = crop_to_content(img)
    img = pad_to_square(img, padding_ratio=0.04)
    img.save(SRC, "PNG", optimize=True)
    print(f"Updated {SRC} -> {img.size}")


if __name__ == "__main__":
    main()
