/**
 * Renders resume.html to documents/resume.pdf (Letter, print styles).
 * Run from repo root: npm install && npm run pdf
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import puppeteer from "puppeteer";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const htmlPath = path.join(root, "resume.html");
const outDir = path.join(root, "documents");
const outPath = path.join(outDir, "resume.pdf");

const fileUrl = pathToFileUrl(htmlPath);

function pathToFileUrl(absPath) {
  const p = absPath.replace(/\\/g, "/");
  if (!p.startsWith("/")) {
    return `file://${p}`;
  }
  return `file://${p}`;
}

await fs.promises.mkdir(outDir, { recursive: true });

const browser = await puppeteer.launch({ headless: true });
const page = await browser.newPage();
await page.setViewport({ width: 1200, height: 1600, deviceScaleFactor: 1 });
await page.goto(fileUrl, { waitUntil: "networkidle0", timeout: 60_000 });
await page.pdf({
  path: outPath,
  format: "Letter",
  printBackground: true,
  preferCSSPageSize: true,
  displayHeaderFooter: true,
  headerTemplate: `<div></div>`,
  footerTemplate: `
    <div style="width:100%; font-size:9px; color:#555; padding:0 0.5in 0.08in 0; text-align:right;">
      <span class="pageNumber"></span>
    </div>
  `,
  margin: { top: "0.5in", right: "0.5in", bottom: "0.7in", left: "0.5in" },
});
await browser.close();

console.log("Wrote", outPath);
