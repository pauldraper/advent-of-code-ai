from collections import deque

def solve():
    with open('input.txt', 'r') as f:
        grid = [line.rstrip('\n') for line in f]

    # Find S and E
    start = end = None
    for r in range(len(grid)):
        for c in range(len(grid[r])):
            if grid[r][c] == 'S':
                start = (r, c)
            elif grid[r][c] == 'E':
                end = (r, c)

    # BFS to find distances from start and end without cheating
    def bfs_distances(start_pos):
        dist = {}
        queue = deque([start_pos])
        dist[start_pos] = 0

        while queue:
            r, c = queue.popleft()

            for dr, dc in [(0, 1), (0, -1), (1, 0), (-1, 0)]:
                nr, nc = r + dr, c + dc

                if 0 <= nr < len(grid) and 0 <= nc < len(grid[0]):
                    if (nr, nc) not in dist and grid[nr][nc] != '#':
                        dist[(nr, nc)] = dist[(r, c)] + 1
                        queue.append((nr, nc))

        return dist

    dist_from_start = bfs_distances(start)
    dist_from_end = bfs_distances(end)

    # Normal time without any cheating
    normal_time = dist_from_start[end]

    # Find all possible cheats
    cheats_saved = {}

    # For each position on the track (not a wall)
    for r in range(len(grid)):
        for c in range(len(grid[r])):
            if grid[r][c] == '#':
                continue

            # Try cheating from this position
            # Cheat allows us to go through walls for up to 2 steps

            # Try 1 step cheat
            for dr, dc in [(0, 1), (0, -1), (1, 0), (-1, 0)]:
                nr, nc = r + dr, c + dc
                if 0 <= nr < len(grid) and 0 <= nc < len(grid[0]):
                    # End of cheat after 1 step
                    if (nr, nc) in dist_from_start and grid[nr][nc] != '#':
                        # Time: distance from start to (r,c) + 1 (cheat) + distance from (nr,nc) to end
                        time_with_cheat = dist_from_start[(r, c)] + 1 + dist_from_end[(nr, nc)]
                        if time_with_cheat < normal_time:
                            saved = normal_time - time_with_cheat
                            cheats_saved[(r, c, nr, nc)] = saved

                    # Try 2 step cheat
                    for dr2, dc2 in [(0, 1), (0, -1), (1, 0), (-1, 0)]:
                        nr2, nc2 = nr + dr2, nc + dc2
                        if 0 <= nr2 < len(grid) and 0 <= nc2 < len(grid[0]):
                            if (nr2, nc2) in dist_from_start and grid[nr2][nc2] != '#':
                                # Time: distance from start to (r,c) + 2 (cheat) + distance from (nr2,nc2) to end
                                time_with_cheat = dist_from_start[(r, c)] + 2 + dist_from_end[(nr2, nc2)]
                                if time_with_cheat < normal_time:
                                    saved = normal_time - time_with_cheat
                                    cheats_saved[(r, c, nr2, nc2)] = saved

    # Count cheats that save at least 100 picoseconds
    count = sum(1 for saved in cheats_saved.values() if saved >= 100)

    with open('output-1.txt', 'w') as f:
        f.write(str(count))

    print(count)

if __name__ == '__main__':
    solve()
