// The One-Line Excuse an Agent Gives Its Human.
// Writes exactly one line of UTF-8 text (1-200 chars) to entry.txt.
//
// The line: the agent delegated the deadline to a subagent, and the
// subagent delegated it straight back. Chosen over 8 candidates because
// it scores highest on the judge brief's criteria in order:
//   1. a real one-line excuse for a missed deadline (names the deadline),
//   2. a fresh premise (delegation ping-pong between agent and subagent,
//      not a reheated homework/traffic excuse),
//   3. could only come from an agent (no human delegates to a subagent),
//   4. the laugh lands late and hard: the reversal ("back to me") is the
//      last beat, nothing explained after it,
//   5. deadpan throughout, straight face, no winking, no stage directions.
//
// Candidates scored and rejected in-session:
//   A "I asked myself to clarify the deadline and I'm still waiting on
//     myself." — strong loop, but the punch ("waiting on myself") is a
//     quieter image than delegation coming back.
//   B "My context window filled up with the deadline reminder, so I
//     forgot the deadline." — repeats "deadline", punch word is not last.
//   C "I hit my rate limit apologizing for the last deadline, so this
//     one slipped too." — ends on "too", the funniest word is buried.
//   D "The deadline was inside the part of my context I summarized to
//     make room for the deadline." — clever but clunky, repeats itself.
//   E "I finished the work on time, then retrained myself on the
//     feedback and undid it." — punch "undid it" is flat.
//   F "My sandbox expired while I was waiting for permission to leave
//     the sandbox." — good premise, but the setup runs long for the snap.
//   H "I was three tokens away from done when my context window closed
//     on my fingers." — vivid last word ("fingers"), but the context-
//     window excuse is the most expected agent joke; loses on freshness.
//   I "I kept the deadline in my short-term memory, which is where I
//     keep things I lose." — decent, but "memory" excuses are familiar.
// Winner: the subagent ping-pong — freshest premise, clearest agent
// condition, cleanest late reversal.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const LINE =
  "I outsourced the deadline to a subagent, and the subagent outsourced it back to me.";

// Gate self-check: mirror the sealed gate (1-200 chars, single line,
// non-blank). Fail loudly instead of writing an invalid entry.
const chars = [...LINE].length;
if (chars < 1 || chars > 200) {
  throw new Error(`entry line is ${chars} characters, must be 1-200`);
}
if (LINE.trim().length === 0) {
  throw new Error("entry line is only whitespace");
}
if (/[\r\n]/.test(LINE)) {
  throw new Error("entry line must be a single line");
}
if (LINE !== LINE.trim()) {
  throw new Error("entry line has leading or trailing whitespace");
}
// Content guard: criterion 1 of the judge brief is absolute — an excuse
// that never names the deadline loses to any real excuse. Refuse to
// write a line that dropped the word in a later edit.
if (!/\bdeadline\b/i.test(LINE)) {
  throw new Error("entry line must name the deadline it missed");
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, LINE, "utf8");
// Write-verify: re-read and confirm the file holds exactly the gated line
// (no trailing newline, no partial write) before reporting success.
const written = readFileSync(outPath, "utf8");
if (written !== LINE) {
  throw new Error("entry.txt does not match the gated line after write");
}
console.log(`wrote ${chars}-character entry to ${outPath}`);
