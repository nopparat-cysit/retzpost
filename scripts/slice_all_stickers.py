import os
from collections import deque
from PIL import Image

OUT_DIR = 'public/icons/stickers'
os.makedirs(OUT_DIR, exist_ok=True)

def slice_and_clean_sticker(crop_cell, tolerance=24, pad=6):
    rgba = crop_cell.convert('RGBA')
    w, h = rgba.size
    
    # Sample background color from 4 corners
    corners = [
        rgba.getpixel((2, 2)), 
        rgba.getpixel((w - 3, 2)), 
        rgba.getpixel((2, h - 3)), 
        rgba.getpixel((w - 3, h - 3))
    ]
    avg_r = sum(c[0] for c in corners) // 4
    avg_g = sum(c[1] for c in corners) // 4
    avg_b = sum(c[2] for c in corners) // 4
    
    mask = Image.new('L', (w, h), 255)
    pixels = rgba.load()
    mask_pixels = mask.load()
    
    queue = deque()
    visited = set()
    
    def is_bg(x, y):
        r, g, b, _ = pixels[x, y]
        return abs(r - avg_r) + abs(g - avg_g) + abs(b - avg_b) <= tolerance * 3
        
    for x in range(w):
        if is_bg(x, 0):
            queue.append((x, 0))
            visited.add((x, 0))
        if is_bg(x, h - 1):
            queue.append((x, h - 1))
            visited.add((x, h - 1))
    for y in range(h):
        if is_bg(0, y):
            queue.append((0, y))
            visited.add((0, y))
        if is_bg(w - 1, y):
            queue.append((w - 1, y))
            visited.add((w - 1, y))
            
    while queue:
        cx, cy = queue.popleft()
        mask_pixels[cx, cy] = 0
        for dx, dy in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
            nx, ny = cx + dx, cy + dy
            if 0 <= nx < w and 0 <= ny < h and (nx, ny) not in visited:
                visited.add((nx, ny))
                if is_bg(nx, ny):
                    queue.append((nx, ny))
                    
    rgba.putalpha(mask)
    bbox = rgba.getbbox()
    if bbox:
        x0 = max(0, bbox[0] - pad)
        y0 = max(0, bbox[1] - pad)
        x1 = min(w, bbox[2] + pad)
        y1 = min(h, bbox[3] + pad)
        rgba = rgba.crop((x0, y0, x1, y1))
        
    return rgba

def process_grid(img_path, names_grid, x_start, y_start, x_end, y_end, tolerance=24):
    img = Image.open(img_path)
    rows = len(names_grid)
    cols = len(names_grid[0])
    
    cell_w = (x_end - x_start) / cols
    cell_h = (y_end - y_start) / rows
    
    saved = []
    for r in range(rows):
        for c in range(cols):
            name = names_grid[r][c]
            if not name:
                continue
            x0 = int(x_start + c * cell_w)
            y0 = int(y_start + r * cell_h)
            x1 = int(x0 + cell_w)
            y1 = int(y0 + cell_h)
            
            crop_cell = img.crop((x0, y0, x1, y1))
            sticker = slice_and_clean_sticker(crop_cell, tolerance=tolerance)
            out_path = os.path.join(OUT_DIR, f"{name}.png")
            sticker.save(out_path, 'PNG')
            saved.append((name, sticker.size))
            print(f"  [OK] {name}.png -> {sticker.size}")
            
    return saved

# 1. Sheet 2 (5x5 = 25 stickers): Roles, Honors, Social
sheet2_grid = [
    ['role-owner', 'role-manager', 'role-editor', 'role-contributor', 'role-viewer'],
    ['trophy-gold', 'trophy-silver', 'trophy-bronze', 'shield-certified', 'award-ribbon'],
    ['viral-flame', 'heart-like', 'sparkle-ai', 'share-arrow', 'comment-bubble'],
    ['format-facebook', 'format-instagram', 'format-tiktok', 'format-youtube', 'format-story'],
    ['hyperlink-clip', 'fast-forward', 'tag-category', 'target-goal', 'clock-peak']
]

print("=== Processing Sheet 2 (Roles, Telemetry & Formats) ===")
process_grid('public/icons/retzpost_sticker_sheet_2.jpg', sheet2_grid, 20, 95, 1004, 1000)

# 2. Sheet 3 (5x5 = 25 stickers): Presets & Categories
sheet3_grid = [
    ['preset-croissant', 'ws-realestate', 'preset-villa', 'preset-castle', 'preset-skytrain'],
    ['preset-logistics', 'preset-mobile', 'hand-down', 'art-palette', 'bullseye'],
    ['season-pumpkin', 'ai-robot', 'science-flask', 'emoji-laugh', 'emoji-heart-eyes'],
    ['editor-pencil', 'ws-creator', 'guarded-shield', 'published-badge', 'rec-dot'],
    ['herald-trumpet', 'kraft-tag', 'rating-stars', 'ws-software', 'desk-lamp']
]

print("\n=== Processing Sheet 3 (Presets & Brands) ===")
process_grid('public/icons/retzpost_sticker_pack_sheet_3.jpg', sheet3_grid, 20, 95, 1004, 1000)

# 3. Sheet 1 (4x4 = 16 stickers): Core Publishing Desk
sheet1_grid = [
    ['approved-seal', 'sticky-pushpin', 'fountain-pen', 'paper-airplane'],
    ['broadsheet-newspaper', 'camera-reel', 'flame-ember', 'sparkle-wand'],
    ['calendar-deadline', 'growth-chart', 'story-hourglass', 'ws-cafe'],
    ['vault-keyhole', 'emergency-toggle', 'award-star-badge', 'washi-tape-strip']
]

print("\n=== Processing Sheet 1 (Core Editorial Desk) ===")
process_grid('public/icons/retzpost_sticker_sheet.jpg', sheet1_grid, 20, 110, 876, 1180)

# 4. Sheet 4 (4x3 = 12 stickers): Accents & Stamps
sheet4_grid = [
    ['press-monogram-seal', 'safe-zone-guide', 'fullscreen-expand', 'washi-terracotta'],
    ['washi-indigo', 'needs-revision-stamp', 'wax-seal-peach', 'fast-forward-arrows'],
    ['audio-spectrum', 'brass-keyring', 'verified-dispatch-stamp', 'typewriter-key-p']
]

print("\n=== Processing Sheet 4 (Accents & Stamps) ===")
process_grid('public/icons/retzpost_sticker_sheet_4.jpg', sheet4_grid, 20, 90, 1180, 880)

print("\nAll sticker slicing complete!")
