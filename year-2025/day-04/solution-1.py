#!/usr/bin/env python3

# Read the grid from input
with open('input.txt', 'r') as f:
    grid = [line.strip() for line in f.readlines()]

# Filter out empty lines
grid = [line for line in grid if line]

rows = len(grid)
cols = len(grid[0]) if rows > 0 else 0

# Count accessible rolls of paper
count = 0

# For each cell that contains a '@'
for r in range(rows):
    for c in range(cols):
        if grid[r][c] == '@':
            # Count neighbors that are '@'
            neighbor_count = 0
            # Check all 8 adjacent cells
            for dr in [-1, 0, 1]:
                for dc in [-1, 0, 1]:
                    if dr == 0 and dc == 0:  # Skip the cell itself
                        continue
                    nr, nc = r + dr, c + dc
                    if 0 <= nr < rows and 0 <= nc < cols:
                        if grid[nr][nc] == '@':
                            neighbor_count += 1

            # Can be accessed if fewer than 4 neighbors
            if neighbor_count < 4:
                count += 1

# Write result
with open('output-1.txt', 'w') as f:
    f.write(str(count))

print(count)
