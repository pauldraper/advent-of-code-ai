import { query } from "@anthropic-ai/claude-agent-sdk";
import { mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import TurndownService from "turndown";
import { aocInputGet, aocPuzzleGet, aocSubmit } from "./aoc.js";
import {
  answerPath,
  attemptsPath,
  inputPath,
  outputPath,
  problemPath,
} from "./common.js";
import { join } from "node:path";
import { getSessionToken } from "./config.js";

export async function solve({ day, year, midnight }) {
  if (midnight) {
    const now = Temporal.Now.instant();
    const midnight = Temporal.Now.zonedDateTimeISO("America/New_York")
      .add({ days: 1 })
      .startOfDay()
      .toInstant();
    const wait = now.until(midnight).add({ seconds: 2 });
    console.error(`Waiting ${wait.total("seconds").toFixed(0)}s`);
    await new Promise((resolve) =>
      setTimeout(resolve, wait.total("milliseconds")),
    );
  }

  const session = await getSessionToken();

  let problem1, problem2, solution1, solution2;
  const refresh = async () => {
    for (const child of await readdir(".")) {
      await rm(child, { force: true, recursive: true });
    }

    const [puzzle, input] = await Promise.all([
      aocPuzzleGet(session, { day, year }),
      aocInputGet(session, { day, year }),
    ]);

    const turndownService = new TurndownService();
    problem1 = turndownService.turndown(puzzle.problem1);
    solution1 = puzzle.solution1 && turndownService.turndown(puzzle.solution1);
    problem2 = puzzle.problem2 && turndownService.turndown(puzzle.problem2);
    solution2 = puzzle.solution2 && turndownService.turndown(puzzle.solution2);

    await Promise.all([
      writeFile(inputPath(), input),
      writeFile(problemPath(1), problem1),
      solution1
        ? writeFile(answerPath(1), solution1)
        : rm(answerPath(1), { force: true }),
      problem2
        ? writeFile(problemPath(2), problem2)
        : rm(problemPath(2), { force: true }),
      solution2
        ? writeFile(answerPath(2), solution2)
        : rm(answerPath(2), { force: true }),
    ]);

    console.error("Wrote files");
  };

  await refresh();

  if (!solution1) {
    await solvePart(year, day, 1, { problem1, problem2, solution1, session });
    await refresh();
  }
  if (!problem2) {
    throw new Error("No part 2");
  }
  if (!solution2) {
    await solvePart(year, day, 2, { problem1, problem2, solution1, session });
    await refresh();
  }

  console.error("Completed");
}

async function solvePart(
  year,
  day,
  part,
  { problem1, problem2, solution1, session },
) {
  console.error(`Solving day ${day} part ${part}`);

  await mkdir(attemptsPath(part), { recursive: true });
  let attempts = [];
  for (const attempt of await readdir(attemptsPath(part))) {
    attempts.push(await readFile(join(attemptsPath(part), attempt), "utf8"));
  }

  let sessionId;

  const prompt =
    part === 1
      ? `
      You will be given the problem statement for a programming puzzle.
      The problem statement will include example input and output.

      Your task is to write a program to solve the puzzle.
      The program should be written in Python and use pypy3.
      It should read input from ./${inputPath(part)}.tmp and write output to
      ./${outputPath(part)}.

      Use the example input and output from the problem statement to verify the
      program's correctness.

      The input for the final answer is ./${inputPath()}. When the program is
      complete, copy that to ./${inputPath(part)}.tmp and write the final answer to
      ./${outputPath(part)}.

      Don't write extra tests, unless you get an incorrect answer.
      Time is limited. Solve as quickly as possible. Don't clean up files or take other
      unnecessary steps. Don't perform any git operations.
      The problem will not require a program taking longer than 15 seconds to run.

      ${attempts.length ? `Previous incorrect answers:\n${attempts.join("\n")}` : ""}

      Here is the problem statement:
      <problem id="1">
      ${problem1}
      </problem>
    `
      : `
      You will be given the problem statement for a programming puzzle.
      The problem statement will include example input and output.

      Your task is to write a program to solve the puzzle.
      The program should be written in Python and use pypy3.
      It should read input from ./${inputPath(part)}.tmp and write answer to
      ./${outputPath(part)}.

      Use the example input and output from the problem statement to verify the
      program's correctness.

      The input for the final answer is ./${inputPath()}. When the program is
      complete, copy that to ./${inputPath(part)}.tmp and write the final output to
      ./${outputPath(part)}.

      Don't write extra tests, unless you get an incorrect answer.
      Time is limited. Solve as quickly as possible. Don't clean up files or take other
      unnecessary steps. Don't perform any git operations.
      The problem will not require a program taking longer than 15 seconds to run.

      ${attempts.length ? `Previous incorrect answers:\n${attempts.join("\n")}` : ""}

      Here is the problem statement for the already solved part 1:
      <problem id="1">
      ${problem1}
      </problem>

      That has the answer:
      <answer id="1">
      ${solution1}
      </answer>

      Here is the problem statement for the unsolved part 2:
      <problem id="2">
      ${problem2}
      </problem>
    `;

  let response = query({
    prompt,
    options: {
      disallowedTools: ["WebSearch"],
      model: "claude-haiku-4-5",
      permissionMode: "bypassPermissions",
      resume: sessionId,
    },
  });

  for (let i = 0; i < 3; i++) {
    for await (const message of response) {
      switch (message.type) {
        case "assistant":
        case "user":
          for (const content of message.message.content) {
            console.error("  " + JSON.stringify(content));
          }
          break;
        case "system":
          sessionId = message.session_id;
      }
    }

    let output = await readFile(outputPath(part), "utf8");
    output = output.trim();

    if (await aocSubmit(session, { day, year, part, answer: output })) {
      return;
    }

    await writeFile(join(attemptsPath(part), `${Date.now()}.txt`), output);

    response = query({
      prompt: `${output} is incorrect. Please try again.`,
      options: {
        disallowedTools: ["WebSearch"],
        model: "claude-haiku-4-5",
        permissionMode: "bypassPermissions",
        resume: sessionId,
      },
    });
  }

  throw new Error(`Too many attempts for part ${part}`);
}
