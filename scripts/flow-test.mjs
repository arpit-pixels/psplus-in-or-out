import { chromium } from "playwright";

const url = process.argv[2] || "http://localhost:3000";

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 1280, height: 900 },
  colorScheme: "light",
});
const page = await ctx.newPage();

const log = (m) => console.log(`[flow] ${m}`);
page.on("console", (msg) => log(`[browser console:${msg.type()}] ${msg.text()}`));
page.on("pageerror", (err) => log(`[PAGEERROR] ${err.message}`));

await page.goto(url, { waitUntil: "domcontentloaded" });
log("Waiting for counts to load...");
try {
  await page.waitForFunction(
    () => document.body.textContent && /[1-9]\d* total votes/.test(document.body.textContent),
    null,
    { timeout: 10000 }
  );
  log("Counts loaded.");
} catch {
  log("Counts didn't load within 10s. Page state:");
  log(await page.locator("text=/\\d+ total votes/").first().textContent() || "no votes text");
  log("Screenshotting current state to debug-noload.png");
  await page.screenshot({ path: "debug-noload.png", fullPage: false });
  await browser.close();
  process.exit(1);
}

const totalBefore = await page.locator("text=/\\d+ total votes/").first().textContent();
log(`Loaded. ${totalBefore?.trim()}`);

const cancelBtn = page.locator('button:has-text("I\'M CANCELING")');
if (!(await cancelBtn.isVisible())) {
  log("VOTE BUTTONS NOT VISIBLE — already voted in this browser context (shouldn't happen on fresh Playwright run). Aborting.");
  await browser.close();
  process.exit(1);
}

log("Clicking I'M CANCELING...");
await cancelBtn.click();
await page.waitForTimeout(2000);

const voted = await page.locator('text=/You.{0,3}re OUT/i').first().isVisible();
log(`Post-vote panel showing 'You're OUT': ${voted}`);

const totalAfter = await page.locator("text=/\\d+ total votes/").first().textContent();
log(`After vote: ${totalAfter?.trim()}`);

const shareBtn = page.locator('button:has-text("SHARE")');
log(`Share button visible: ${await shareBtn.isVisible()}`);

log("Refreshing to verify localStorage gate persists...");
await page.reload({ waitUntil: "domcontentloaded" });
await page.waitForTimeout(2000);
const stillVoted = await page.locator('text=/You.{0,3}re OUT/i').first().isVisible();
log(`After reload, still voted: ${stillVoted}`);

log("Clicking Change my vote (DELETE flow)...");
const changeBtn = page.locator('button:has-text("Change my vote")');
await changeBtn.click();
await page.waitForTimeout(2000);
const backToVoting = await cancelBtn.isVisible();
log(`Vote buttons back: ${backToVoting}`);

const totalFinal = await page.locator("text=/\\d+ total votes/").first().textContent();
log(`Final: ${totalFinal?.trim()}`);

await page.screenshot({ path: "flow-final.png", fullPage: false });
log("Saved flow-final.png");

await browser.close();
