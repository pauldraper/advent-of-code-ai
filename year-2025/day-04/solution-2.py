def solve():
    with open('input.txt', 'r') as f:
        grid = [list(line.strip()) for line in f]

    rows = len(grid)
    cols = len(grid[0]) if rows > 0 else 0

    total_removed = 0

    # Keep removing accessible rolls until none remain
    while True:
        # Find all rolls that can be accessed (fewer than 4 adjacent rolls)
        accessible = set()

        for i in range(rows):
            for j in range(cols):
                if grid[i][j] == '@':
                    # Count adjacent rolls
                    adjacent_count = 0
                    for di in [-1, 0, 1]:
                        for dj in [-1, 0, 1]:
                            if di == 0 and dj == 0:
                                continue
                            ni, nj = i + di, j + dj
                            if 0 <= ni < rows and 0 <= nj < cols and grid[ni][nj] == '@':
                                adjacent_count += 1

                    if adjacent_count < 4:
                        accessible.add((i, j))

        # If no accessible rolls, we're done
        if not accessible:
            break

        # Remove all accessible rolls
        for i, j in accessible:
            grid[i][j] = '.'

        total_removed += len(accessible)

    return total_removed

result = solve()
with open('output-2.txt', 'w') as f:
    f.write(str(result))
print(result)
