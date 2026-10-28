import os
from PIL import Image

sticker_dir = os.path.join("public", "icons", "stickers")
problematic = []

for fn in os.listdir(sticker_dir):
    if not fn.endswith(".png"):
        continue
    fp = os.path.join(sticker_dir, fn)
    try:
        im = Image.open(fp).convert("RGBA")
        w, h = im.size
        # Check border pixels: top, bottom, left, right
        touch_left = any(im.getpixel((0, y))[3] > 40 for y in range(h))
        touch_right = any(im.getpixel((w - 1, y))[3] > 40 for y in range(h))
        touch_top = any(im.getpixel((x, 0))[3] > 40 for x in range(w))
        touch_bottom = any(im.getpixel((x, h - 1))[3] > 40 for x in range(w))

        if touch_left or touch_right or touch_top or touch_bottom:
            sides = []
            if touch_left: sides.append("LEFT")
            if touch_right: sides.append("RIGHT")
            if touch_top: sides.append("TOP")
            if touch_bottom: sides.append("BOTTOM")
            problematic.append((fn, ", ".join(sides)))
    except Exception as e:
        print(f"Error checking {fn}: {e}")

print(f"Total problematic stickers touching crop borders: {len(problematic)}")
for fn, sides in problematic:
    print(f"- {fn}: touches {sides}")
