import { JSDOM } from "jsdom";

const baseUrl = new URL("https://adventofcode.com");

export async function aocPuzzleGet(session, { day, year }) {
  console.error(`Getting puzzle ${year}/${day}`);
  const url = new URL(`${year}/day/${day}`, baseUrl);
  const response = await fetch(url, {
    headers: {
      Accept: "text/html",
      "Cache-Control": "no-cache",
      Cookie: `session=${session}`,
    },
  });
  if (!response.ok) {
    throw new Error(`Failed to get puzzle ${year}/${day}: ${response.status}`);
  }
  const html = await response.text();
  const dom = new JSDOM(html);
  const document = dom.window.document;
  const main = document.querySelector("main");
  let problem1, problem2, solution1, solution2;
  for (const child of main.children) {
    if (child.classList.contains("day-desc")) {
      if (!problem1) {
        problem1 = child;
      } else {
        problem2 = child;
      }
      continue;
    }
    if (child.textContent.includes("Your puzzle answer was")) {
      if (problem1) {
        solution1 = child;
      } else if (problem2) {
        solution2 = child;
      }
    }
  }

  return {
    problem1: problem1?.outerHTML,
    problem2: problem2?.outerHTML,
    solution1: solution1?.outerHTML,
    solution2: solution2?.outerHTML,
  };
}

export async function aocInputGet(session, { day, year }) {
  console.error(`Getting input ${year}/${day}`);
  const url = new URL(`${year}/day/${day}/input`, baseUrl);
  const response = await fetch(url, {
    headers: {
      Accept: "text/plain",
      Cookie: `session=${session}`,
    },
  });
  if (!response.ok) {
    throw new Error(`Failed to get input ${year}/${day}: ${response.status}`);
  }
  return await response.text();
}

export async function aocSubmit(session, { day, year, part, answer }) {
  console.error(`Submitting answer ${year}/${day}/${part}: ${answer}`);
  do {
    const url = new URL(`${year}/day/${day}/answer`, baseUrl);
    const body = new URLSearchParams();
    body.append("answer", answer);
    body.append("level", part);
    const response = await fetch(url, {
      body: body.toString(),
      method: "POST",
      headers: {
        Accept: "text/html",
        Cookie: `session=${session}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    if (!response.ok) {
      throw new Error(
        `Failed to submit answer ${year}/${day}/${part}: ${response.status}`,
      );
    }
    const html = await response.text();
    const dom = new JSDOM(html);
    const document = dom.window.document;
    const main = document.querySelector("article");
    const message = main.querySelector("p").textContent;
    console.error(message);
    if (message.includes("You gave an answer too recently")) {
      console.error("Waiting to resubmit in 10 seconds");
      await new Promise((resolve) => setTimeout(resolve, 1000 * 10));
      continue;
    }
    return message.includes("That's the right answer");
  } while (false);
}
