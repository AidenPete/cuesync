import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const sizes = [192, 512];

const svg = `
<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" rx="112" fill="#062318"/>
  <circle cx="256" cy="256" r="168" fill="#0b4a33"/>
  <circle cx="256" cy="256" r="148" fill="#1a6b4a" stroke="#34d399" stroke-width="10"/>
  <circle cx="256" cy="256" r="52" fill="#ffffff"/>
  <text x="256" y="282" font-size="120" font-weight="700" text-anchor="middle" fill="#062318" font-family="Arial, sans-serif">8</text>
</svg>`;

async function generateIcons() {
  const iconsDir = path.join(process.cwd(), "public", "icons");
  await mkdir(iconsDir, { recursive: true });
  await writeFile(path.join(iconsDir, "icon.svg"), svg.trim());

  for (const size of sizes) {
    await sharp(Buffer.from(svg))
      .resize(size, size)
      .png()
      .toFile(path.join(iconsDir, `icon-${size}.png`));
  }

  console.log("PWA icons generated in public/icons/");
}

generateIcons().catch((error) => {
  console.error(error);
  process.exit(1);
});
