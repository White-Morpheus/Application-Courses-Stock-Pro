import sharp from "sharp";
import fs from "fs";
import path from "path";

const __dirname = path.dirname(new URL(import.meta.url).pathname);

async function convertIcons() {
  const iconSvgPath = path.join(process.cwd(), "public", "icon.svg");
  const maskableSvgPath = path.join(process.cwd(), "public", "icon-maskable.svg");
  
  const publicDir = path.join(process.cwd(), "public");

  console.log("Starting SVG to PNG icon generation with sharp...");

  try {
    // 1. Generate main 512x512 icon.png
    await sharp(iconSvgPath)
      .resize(512, 512)
      .png()
      .toFile(path.join(publicDir, "icon.png"));
    console.log("✅ Generated public/icon.png (512x512)");

    // 2. Generate Apple Touch Icon 180x180 apple-touch-icon.png
    await sharp(iconSvgPath)
      .resize(180, 180)
      .png()
      .toFile(path.join(publicDir, "apple-touch-icon.png"));
    console.log("✅ Generated public/apple-touch-icon.png (180x180)");

    // 3. Generate icon-192.png
    await sharp(iconSvgPath)
      .resize(192, 192)
      .png()
      .toFile(path.join(publicDir, "icon-192.png"));
    console.log("✅ Generated public/icon-192.png (192x192)");

    // 4. Generate icon-512.png
    await sharp(iconSvgPath)
      .resize(512, 512)
      .png()
      .toFile(path.join(publicDir, "icon-512.png"));
    console.log("✅ Generated public/icon-512.png (512x512)");

    // 5. Generate maskable 512x512 icon-maskable.png
    await sharp(maskableSvgPath)
      .resize(512, 512)
      .png()
      .toFile(path.join(publicDir, "icon-maskable.png"));
    console.log("✅ Generated public/icon-maskable.png (512x512)");

    console.log("🎉 All PNG icons successfully generated!");
  } catch (error) {
    console.error("❌ Error converting icons:", error);
    process.exit(1);
  }
}

convertIcons();
