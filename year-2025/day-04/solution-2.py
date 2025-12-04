from collections import deque

def parse_map(lines):
    """Parse the map and find start/end positions"""
    maze = []
    start = None
    end = None

    for r, line in enumerate(lines):
        row = []
        for c, char in enumerate(line):
            if char == 'S':
                start = (r, c)
                row.append('.')
            elif char == 'E':
                end = (r, c)
                row.append('.')
            else:
                row.append(char)
        maze.append(row)

    return maze, start, end

def bfs_shortest_path(maze, start, end):
    """Find shortest path distances from start using BFS"""
    distances = {}
    queue = deque([start])
    distances[start] = 0

    while queue:
        r, c = queue.popleft()

        for dr, dc in [(0, 1), (0, -1), (1, 0), (-1, 0)]:
            nr, nc = r + dr, c + dc

            # Check bounds
            if not (0 <= nr < len(maze) and 0 <= nc < len(maze[0])):
                continue

            # Skip walls and visited
            if maze[nr][nc] == '#' or (nr, nc) in distances:
                continue

            distances[(nr, nc)] = distances[(r, c)] + 1
            queue.append((nr, nc))

    return distances

def get_track_positions(maze):
    """Get all positions that are track (not walls)"""
    track = set()
    for r in range(len(maze)):
        for c in range(len(maze[0])):
            if maze[r][c] != '#':
                track.add((r, c))
    return track

def solve():
    with open('input.txt', 'r') as f:
        lines = [line.rstrip('\n') for line in f.readlines()]

    maze, start, end = parse_map(lines)

    # Get distances from start
    dist_from_start = bfs_shortest_path(maze, start, end)

    # Get distances from end
    dist_from_end = bfs_shortest_path(maze, end, start)

    # Normal shortest path without cheating
    normal_time = dist_from_start[end]

    # Get all track positions
    track_positions = list(get_track_positions(maze))

    # Count cheats that save at least 100 picoseconds
    cheats_count = 0

    # For each pair of track positions
    for i, start_pos in enumerate(track_positions):
        start_dist = dist_from_start.get(start_pos, float('inf'))

        for end_pos in track_positions:
            # Calculate Manhattan distance (cheat duration)
            r1, c1 = start_pos
            r2, c2 = end_pos
            cheat_duration = abs(r1 - r2) + abs(c1 - c2)

            # Cheat must be at least 2 steps and at most 20 steps
            if 2 <= cheat_duration <= 20:
                end_dist = dist_from_end.get(end_pos, float('inf'))

                if end_dist != float('inf'):
                    # Total time: time to reach start_pos + cheat_time + time from end_pos to end
                    total_time = start_dist + cheat_duration + end_dist

                    # Check if this saves at least 100 picoseconds
                    saving = normal_time - total_time
                    if saving >= 100:
                        cheats_count += 1

    # Write result
    with open('output-2.txt', 'w') as f:
        f.write(str(cheats_count))

if __name__ == '__main__':
    solve()
