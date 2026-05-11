import sharp from "sharp";
import { existsSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const candidates = [
  join(root, "assets", "KMG logo.png"),
  join(root, "KMG logo.png"),
];
const input = candidates.find((p) => existsSync(p));
if (!input) {
  console.error(
    "No source logo found. Put the file at one of:\n",
    candidates.map((p) => `  - ${p}`).join("\n"),
  );
  process.exit(1);
}
const output = join(root, "assets", "kmg-logo.png");

const { data, info } = await sharp(input)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

if (info.channels !== 4) {
  throw new Error(`Expected RGBA, got ${info.channels} channels`);
}

const { width, height } = info;
for (let i = 0; i < data.length; i += 4) {
  const r = data[i];
  const g = data[i + 1];
  const b = data[i + 2];
  if (r > 235 && g > 235 && b > 235) {
    data[i + 3] = 0;
  }
}

await sharp(data, { raw: { width, height, channels: 4 } })
  .png()
  .toFile(output);

console.log(`Wrote transparent PNG: ${output}`);
