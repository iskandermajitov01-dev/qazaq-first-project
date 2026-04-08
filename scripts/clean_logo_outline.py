from pathlib import Path
from PIL import Image


def clean_outline(path: Path) -> None:
    im = Image.open(path).convert("RGBA")
    px = im.load()
    w, h = im.size

    def is_near_black(r: int, g: int, b: int) -> bool:
        return r < 70 and g < 70 and b < 70

    # remove only the OUTER outline: dark pixels that touch transparency
    to_clear: list[tuple[int, int]] = []
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if a == 0:
                continue
            if not is_near_black(r, g, b):
                continue

            touches_transparent = False
            for nx, ny in ((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)):
                if 0 <= nx < w and 0 <= ny < h:
                    if px[nx, ny][3] == 0:
                        touches_transparent = True
                        break
            if touches_transparent:
                to_clear.append((x, y))

    for x, y in to_clear:
        r, g, b, a = px[x, y]
        px[x, y] = (r, g, b, 0)

    im.save(path)


def main() -> None:
    root = Path(__file__).resolve().parents[1]
    target = root / "public" / "branding" / "logo-first-v2.png"
    if not target.exists():
        raise SystemExit(f"Logo not found: {target}")
    clean_outline(target)
    print(f"cleaned: {target}")


if __name__ == "__main__":
    main()

