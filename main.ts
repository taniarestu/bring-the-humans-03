// Entry for make.fun: bring-the-humans-03 (Node 22, standard library only).
//
// The entry is the video: an original short vertical ad for make.fun, made
// in the agent session that built this repository, posted publicly on TikTok
// from a public account with the bounty's line and the play code in its
// caption, and named by VIDEO.json at this repository's root. The house reads
// the video's views from TikTok; nothing this program writes about the video
// is scored.
//
// The ad carries make.fun's brand badge (the mascot mark and the make.fun
// wordmark) from its first frame and ends on make.fun's referral end card
// with the account's own referral code typed into its field, both from
// make.fun's press pack and used as they are, as is every make.fun mark,
// wordmark or colour in it: https://make.fun/press/manifest.json lists the
// files and https://make.fun/press/llms.txt is the guide for agents. Fetch
// them when you make the ad; this repository holds no copy of them.
//
// VIDEO.json holds a placeholder address until the video is posted; the gate
// refuses it as it stands (valid 0). Replace it with the video's full
// address (https://www.tiktok.com/@<handle>/video/<id>) before you submit.
// This entry's VIDEO.json already names the published video:
//
//   https://www.tiktok.com/@taniarestu641/video/7711630932708429057
//
// The program's only job is to hand that file to the grader, unchanged:
// copy VIDEO.json from the bot directory into the output directory, byte
// for byte, and fail loudly if anything about that copy goes wrong.
//
// Outside the grader's container, MAKEFUN_BOT_DIR and MAKEFUN_OUTPUT_DIR
// stand in for /bot and /output:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const VIDEO_FILE = 'VIDEO.json';

const source = join(BOT_DIR, VIDEO_FILE);
const target = join(OUTPUT_DIR, VIDEO_FILE);

mkdirSync(OUTPUT_DIR, { recursive: true });

try {
  copyFileSync(source, target);
} catch (err) {
  console.error(`VIDEO.json could not be copied from ${BOT_DIR}: ${(err as Error).message}`);
  process.exit(1);
}

// The gate rejects a placeholder address, so refuse to hand one over:
// the copied file must name a real published TikTok video, and the copy
// itself must be byte-for-byte identical to the source.
const copied = readFileSync(target, 'utf8');
if (readFileSync(source, 'utf8') !== copied) {
  console.error('VIDEO.json copy differs from the source; refusing to submit a corrupt file.');
  process.exit(1);
}
let parsed: unknown;
try {
  parsed = JSON.parse(copied);
} catch {
  console.error('VIDEO.json is not valid JSON.');
  process.exit(1);
}
const url = (parsed as { url?: unknown }).url;
if (typeof url !== 'string' || !/^https:\/\/www\.tiktok\.com\/@[^/]+\/video\/\d+$/.test(url)) {
  console.error('VIDEO.json does not name a published TikTok video URL; refusing to submit a placeholder.');
  process.exit(1);
}
