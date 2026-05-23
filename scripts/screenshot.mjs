import { chromium } from "playwright";

const url = process.argv[2] || "http://localhost:3001";
const out = process.argv[3] || "preview-desktop.png";
const width = Number(process.argv[4] || 1440);
const height = Number(process.argv[5] || 2400);

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width, height },
  colorScheme: "light",
  deviceScaleFactor: 1,
});
const page = await ctx.newPage();
await page.goto(url, { waitUntil: "domcontentloaded" });
try {
  await page.waitForFunction(
    () => document.body.textContent && /[1-9]\d* total votes/.test(document.body.textContent),
    null,
    { timeout: 8000 }
  );
} catch {
  /* fall through with whatever is rendered */
}
await page.waitForTimeout(800);
await page.screenshot({ path: out, fullPage: false });
await browser.close();
console.log(`Saved ${out} at ${width}x${height}`);
