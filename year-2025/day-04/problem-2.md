\--- Part Two ---
-----------------

The programs seem perplexed by your list of cheats. Apparently, the two-picosecond cheating rule was deprecated several milliseconds ago! The latest version of the cheating rule permits a single cheat that instead lasts at most _20 picoseconds_.

Now, in addition to all the cheats that were possible in just two picoseconds, many more cheats are possible. This six-picosecond cheat saves _76 picoseconds_:

    ###############
    #...#...#.....#
    #.#.#.#.#.###.#
    #S#...#.#.#...#
    #1#####.#.#.###
    #2#####.#.#...#
    #3#####.#.###.#
    #456.E#...#...#
    ###.#######.###
    #...###...#...#
    #.#####.#.###.#
    #.#...#.#.#...#
    #.#.#.#.#.#.###
    #...#...#...###
    ###############
    

Because this cheat has the same start and end positions as the one above, it's the _same cheat_, even though the path taken during the cheat is different:

    ###############
    #...#...#.....#
    #.#.#.#.#.###.#
    #S12..#.#.#...#
    ###3###.#.#.###
    ###4###.#.#...#
    ###5###.#.###.#
    ###6.E#...#...#
    ###.#######.###
    #...###...#...#
    #.#####.#.###.#
    #.#...#.#.#...#
    #.#.#.#.#.#.###
    #...#...#...###
    ###############
    

Cheats don't need to use all 20 picoseconds; cheats can last any amount of time up to and including 20 picoseconds (but can still only end when the program is on normal track). Any cheat time not used is lost; it can't be saved for another cheat later.

You'll still need a list of the best cheats, but now there are even more to choose between. Here are the quantities of cheats in this example that save _50 picoseconds or more_:

*   There are 32 cheats that save 50 picoseconds.
*   There are 31 cheats that save 52 picoseconds.
*   There are 29 cheats that save 54 picoseconds.
*   There are 39 cheats that save 56 picoseconds.
*   There are 25 cheats that save 58 picoseconds.
*   There are 23 cheats that save 60 picoseconds.
*   There are 20 cheats that save 62 picoseconds.
*   There are 19 cheats that save 64 picoseconds.
*   There are 12 cheats that save 66 picoseconds.
*   There are 14 cheats that save 68 picoseconds.
*   There are 12 cheats that save 70 picoseconds.
*   There are 22 cheats that save 72 picoseconds.
*   There are 4 cheats that save 74 picoseconds.
*   There are 3 cheats that save 76 picoseconds.

Find the best cheats using the updated cheating rules. _How many cheats would save you at least 100 picoseconds?_