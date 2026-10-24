from PIL import Image, ImageDraw

def slice_and_clean_sticker(crop_cell, tolerance=25):
    # Convert to RGBA
    rgba = crop_cell.convert('RGBA')
    w, h = rgba.size
    
    # Sample background color from the 4 corners
    corners = [rgba.getpixel((2, 2)), rgba.getpixel((w - 3, 2)), rgba.getpixel((2, h - 3)), rgba.getpixel((w - 3, h - 3))]
    avg_r = sum(c[0] for c in corners) // 4
    avg_g = sum(c[1] for c in corners) // 4
    avg_b = sum(c[2] for c in corners) // 4
    
    # We create a mask image: 255 for sticker, 0 for background
    # A pixel is background if close to (avg_r, avg_g, avg_b)
    # Using ImageDraw.floodfill on a mask
    mask = Image.new('L', (w, h), 255)
    
    # Fast pure-python flood fill using a set or queue
    pixels = rgba.load()
    mask_pixels = mask.load()
    
    from collections import deque
    queue = deque()
    visited = set()
    
    def is_bg(x, y):
        r, g, b, _ = pixels[x, y]
        # Euclidean distance or Manhattan distance
        return abs(r - avg_r) + abs(g - avg_g) + abs(b - avg_b) <= tolerance * 3
        
    # Seed all borders
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
                    
    # Apply mask to alpha channel
    rgba.putalpha(mask)
    
    # Auto-crop to content bounding box
    bbox = rgba.getbbox()
    if bbox:
        pad = 6
        x0 = max(0, bbox[0] - pad)
        y0 = max(0, bbox[1] - pad)
        x1 = min(w, bbox[2] + pad)
        y1 = min(h, bbox[3] + pad)
        rgba = rgba.crop((x0, y0, x1, y1))
        
    return rgba

src_img = Image.open('public/icons/retzpost_sticker_sheet_2.jpg')
cell_w = (1004 - 20) / 5
cell_h = (1000 - 95) / 5

crop_cell = src_img.crop((int(20), int(95), int(20 + cell_w), int(95 + cell_h)))
clean_sticker = slice_and_clean_sticker(crop_cell, tolerance=24)
clean_sticker.save('public/icons/stickers/test_owner_crown.png', 'PNG')
print(f"Success! Output size: {clean_sticker.size}")
