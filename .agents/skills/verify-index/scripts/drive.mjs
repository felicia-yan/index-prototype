import { spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { createServer } from 'node:net';
import { setTimeout as sleep } from 'node:timers/promises';

const root = new URL('../../../..', import.meta.url).pathname;
const out = process.env.VERIFY_OUT || '/tmp/index-verify';
const port = Number(process.env.VERIFY_PORT || await new Promise((resolve, reject) => {
  const probe = createServer();
  probe.listen(0, '127.0.0.1', () => {
    const chosen = probe.address().port;
    probe.close(() => resolve(chosen));
  });
  probe.on('error', reject);
}));
const base = `http://127.0.0.1:${port}/`;
mkdirSync(out, { recursive: true });

const pwPath = process.env.PLAYWRIGHT_PATH
  || '/Users/Diego/duna-realization-engine/node_modules/playwright/index.js';
const pw = await import(pwPath);
const chromium = pw.chromium || pw.default.chromium;

const server = spawn('python3', ['-m', 'http.server', String(port), '--bind', '127.0.0.1'], {
  cwd: root, stdio: ['ignore', 'pipe', 'pipe'],
});
let serverLog = '';
server.stdout.on('data', d => { serverLog += d; });
server.stderr.on('data', d => { serverLog += d; });

const errors = [];
function fail(msg) { errors.push(msg); }

async function waitReady() {
  for (let i = 0; i < 40; i++) {
    try {
      const res = await fetch(base);
      if (res.ok) return;
    } catch {}
    await sleep(100);
  }
  throw new Error('server did not start\n' + serverLog);
}

async function bodyText(page) {
  return page.locator('body').innerText();
}
async function must(page, needle) {
  const text = await bodyText(page);
  if (!text.includes(needle)) fail(`missing ${JSON.stringify(needle)}\n---\n${text.slice(0, 1800)}`);
}
async function mustNot(page, needle) {
  const text = await bodyText(page);
  if (text.toLowerCase().includes(needle.toLowerCase())) fail(`unexpected ${JSON.stringify(needle)}`);
}
async function audit(page) {
  const found = await page.evaluate(() => window.__audit());
  if (found.length) fail('audit\n' + found.join('\n'));
}
async function shot(page, name) {
  await page.screenshot({ path: `${out}/${name}.png`, fullPage: true });
}
async function fresh(page) {
  await page.goto(base, { waitUntil: 'domcontentloaded' });
  await page.getByRole('button', { name: 'Continue with Google' }).click();
  await page.getByRole('heading', { name: 'Needs you' }).waitFor();
  await audit(page);
}

let browser;
try {
  await waitReady();
  browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  const consoleErrors = [];
  page.on('pageerror', err => consoleErrors.push(String(err)));
  page.on('console', msg => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });

  await page.goto(base, { waitUntil: 'domcontentloaded' });
  await must(page, "The fact that isn't in the files.");
  await shot(page, '01-login');
  await page.locator('#email').fill('not-an-email');
  await page.getByRole('button', { name: 'Continue with email' }).click();
  await must(page, 'Enter a work email.');
  await page.locator('#email').fill('you@company.com');
  await page.getByRole('button', { name: 'Continue with email' }).click();
  await must(page, 'Needs you');
  await shot(page, '02-home');

  await page.getByRole('button', { name: 'Confirm', exact: true }).click();
  await must(page, 'You confirmed this.');
  await must(page, '60-second cache');
  await page.getByRole('button', { name: 'Index home' }).click();
  const needs = await page.locator('#needs').innerText();
  if (needs.includes('final decision')) fail('confirmed card still in Needs you');
  await must(page, '60-second cache');
  await audit(page);

  await fresh(page);
  await page.getByRole('button', { name: 'Not me', exact: true }).click();
  await must(page, "David's card");
  await page.getByRole('button', { name: 'Confirm', exact: true }).click();
  await must(page, 'David confirmed this.');
  await page.getByRole('button', { name: 'Index home' }).click();
  const needsAfter = await page.locator('#needs').innerText();
  if (needsAfter.includes('final decision')) fail('passed card still needs you');
  await audit(page);

  await fresh(page);
  await page.locator('#q').fill('Is history sync on in incognito?');
  await page.getByRole('button', { name: 'Ask', exact: true }).click();
  await must(page, 'Nobody wrote down who decided.');
  await shot(page, '03-incog-card');
  await page.getByRole('button', { name: 'Incognito PRD (out of date)' }).click();
  await must(page, 'on by default');
  await page.getByRole('button', { name: 'Close evidence' }).click();
  await page.getByRole('button', { name: 'Send card to Alice' }).click();
  await must(page, "Alice's card");
  await shot(page, '04-alice-card');
  await page.getByRole('button', { name: 'Confirm', exact: true }).click();
  await must(page, 'Alice confirmed this.');
  await page.getByRole('button', { name: 'Incognito PRD', exact: true }).click();
  await must(page, 'never contact sync servers');
  await mustNot(page, 'on by default');
  await page.keyboard.press('Escape');
  await page.locator('#q').fill('Is history sync on in incognito?');
  await page.getByRole('button', { name: 'Ask', exact: true }).click();
  await must(page, "Alice confirmed this, so Index didn't ask again.");
  await mustNot(page, 'Send card to Alice');
  await page.getByRole('button', { name: 'Privacy review notes' }).click();
  await must(page, 'visit timing');
  await page.getByRole('button', { name: 'Close evidence' }).click();
  await audit(page);
  await shot(page, '05-remembered');

  await fresh(page);
  await page.locator('#q').fill("What's the stopping rule for the onboarding checklist?");
  await page.getByRole('button', { name: 'Ask', exact: true }).click();
  await page.getByRole('button', { name: 'Send card to Jen' }).click();
  if (await page.getByRole('button', { name: 'Confirm', exact: true }).isEnabled()) fail('empty draft was confirmable');
  await page.getByRole('button', { name: 'Correct', exact: true }).click();
  await page.locator('#correction').fill('   ');
  await page.getByRole('button', { name: 'Save correction' }).click();
  await must(page, 'Write the correction first.');
  const correction = 'Stop if the checklist is behind by 2 points at week two. ' + 'This rule is long enough to wrap on a phone and still has to stay on the card. '.repeat(3);
  await page.locator('#correction').fill(correction);
  await page.getByRole('button', { name: 'Save correction' }).click();
  await must(page, 'behind by 2 points');
  await must(page, 'Jen confirmed this.');
  await shot(page, '06-correction');
  await audit(page);

  await fresh(page);
  await page.locator('#q').fill('What did we decide about the permissions architecture?');
  await page.getByRole('button', { name: 'Ask', exact: true }).click();
  await must(page, 'still says the decision is pending');
  await shot(page, '07-from-files');
  await page.getByRole('button', { name: 'Ask David to update RFC-041' }).click();
  await page.getByRole('button', { name: 'Send card to David' }).click();
  await must(page, "David's card");
  await page.getByRole('button', { name: 'Confirm', exact: true }).click();
  await page.locator('#q').fill('What did we decide about the permissions architecture?');
  await page.getByRole('button', { name: 'Ask', exact: true }).click();
  await must(page, 'RFC-041 matches that decision');
  await mustNot(page, 'Ask David to update RFC-041');
  await page.getByRole('button', { name: 'RFC-041', exact: true }).click();
  await must(page, 'Status: Accepted on Oct 23');
  await page.getByRole('button', { name: 'Close evidence' }).click();
  await audit(page);

  await fresh(page);
  await page.locator('#q').fill('When are background tabs discarded?');
  await page.getByRole('button', { name: 'Ask', exact: true }).click();
  await must(page, '48 open tabs');
  await must(page, 'Ask Tom to update the readme');
  await audit(page);

  await fresh(page);
  await page.locator('#q').fill('   ');
  await page.getByRole('button', { name: 'Ask', exact: true }).click();
  await must(page, 'Write a question first.');
  await page.locator('#q').fill('Who owns the snack budget?');
  await page.getByRole('button', { name: 'Ask', exact: true }).click();
  await must(page, 'Nothing in the allowed sources answers this.');
  await page.locator('#who').selectOption('sam');
  await page.getByRole('button', { name: 'Ask them' }).click();
  await must(page, "Sam's card");
  await page.getByRole('button', { name: 'Send card to Sam' }).click();
  if (await page.getByRole('button', { name: 'Confirm', exact: true }).isEnabled()) fail('blank card was confirmable');
  await audit(page);

  await fresh(page);
  await page.getByRole('button', { name: 'Settings', exact: true }).click();
  await shot(page, '08-settings');
  await page.getByRole('button', { name: 'Preview Legacy scope export' }).click();
  await must(page, "Index can't open this");
  await page.getByRole('button', { name: 'Close evidence' }).click();
  await page.getByRole('checkbox', { name: 'Downloads' }).check();
  await page.getByRole('button', { name: 'Preview Legacy scope export' }).click();
  await must(page, '142 existing scopes');
  await page.getByRole('button', { name: 'Close evidence' }).click();
  await page.getByRole('checkbox', { name: 'Downloads' }).uncheck();
  await page.getByRole('button', { name: 'Preview Legacy scope export' }).click();
  await must(page, "Index can't open this");
  await page.keyboard.press('Escape');
  await page.getByRole('radio', { name: "Don't ask people" }).check();
  await page.locator('#q').fill('Is history sync on in incognito?');
  await page.getByRole('button', { name: 'Ask', exact: true }).click();
  await must(page, 'Asking people is off.');
  await mustNot(page, 'Send card to Alice');
  await audit(page);

  await fresh(page);
  await page.getByRole('button', { name: 'Settings', exact: true }).click();
  await page.getByRole('checkbox', { name: 'Show cards that need you on the bell' }).uncheck();
  await page.getByRole('button', { name: 'Cards that need you' }).click();
  await must(page, 'Card alerts are off.');
  await page.keyboard.press('Escape');
  const countHidden = await page.locator('#bell-count').isHidden();
  if (!countHidden) fail('bell count still showing');
  await page.getByRole('button', { name: 'Index home' }).click();
  await must(page, 'What was the final decision');
  await audit(page);

  await fresh(page);
  await page.getByRole('button', { name: 'Dismiss the checklist overlap' }).click();
  await page.getByRole('button', { name: 'Undo the checklist overlap' }).click();
  await page.getByRole('button', { name: 'Ask David about the checklist' }).click();
  await page.getByRole('button', { name: 'Send card to David' }).click();
  await page.getByRole('button', { name: 'Confirm', exact: true }).click();
  await page.getByRole('button', { name: 'Index home' }).click();
  await must(page, 'Settled.');
  await page.getByRole('button', { name: 'Watch Enterprise SSO' }).click();
  const nearby = await page.locator('#nearby').innerText();
  if (nearby.includes('Enterprise SSO')) fail('watched stream still nearby');
  await must(page, 'Enterprise SSO');
  await page.locator('#streams').getByRole('button', { name: 'Enterprise SSO' }).click();
  await page.getByRole('button', { name: 'Stop watching', exact: true }).click();
  await page.getByRole('button', { name: 'Index home' }).click();
  const nearbyAgain = await page.locator('#nearby').innerText();
  if (!nearbyAgain.includes('Enterprise SSO')) fail('stream did not return to nearby');
  await page.getByRole('button', { name: 'New workstream' }).click();
  await page.getByRole('button', { name: 'Create workstream' }).click();
  await must(page, 'Name the workstream first.');
  await page.locator('#ws-name').fill('Snack budget');
  await page.locator('#ws-desc').fill('Who pays for the team snacks.');
  await page.getByRole('button', { name: 'Create workstream' }).click();
  await must(page, 'Snack budget');
  await must(page, 'Nothing is filed here yet.');
  await audit(page);

  await fresh(page);
  await page.keyboard.press('/');
  const focused = await page.evaluate(() => document.activeElement?.id);
  if (focused !== 'q') fail('slash did not focus ask, got ' + focused);
  await page.getByRole('link', { name: 'Help' }).click();
  await must(page, 'Type a question in the bar');
  await page.getByRole('button', { name: 'Cards', exact: true }).click();
  await must(page, 'A card is one question');
  await page.getByRole('button', { name: 'Evidence', exact: true }).click();
  await must(page, 'not a folder');
  await page.getByRole('link', { name: 'Privacy' }).click();
  await must(page, 'fictional');
  await page.getByRole('link', { name: 'Terms' }).click();
  await must(page, 'clickable demo');
  await page.getByRole('link', { name: 'Security' }).click();
  await must(page, 'no file is uploaded');
  const ping = await bodyText(page);
  if (/\bping\b/i.test(ping)) fail('the word ping is on the page');
  await audit(page);

  await page.setViewportSize({ width: 390, height: 844 });
  await fresh(page);
  await shot(page, '09-mobile-home');
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  if (overflow > 1) fail('mobile overflow ' + overflow);
  await page.getByRole('button', { name: 'Confirm', exact: true }).click();
  await shot(page, '10-mobile-card');
  const overflowCard = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  if (overflowCard > 1) fail('mobile card overflow ' + overflowCard);
  await audit(page);

  if (consoleErrors.length) fail('console\n' + consoleErrors.join('\n'));
} finally {
  await browser?.close().catch(() => {});
  server.kill('SIGTERM');
}

if (errors.length) {
  console.error(errors.join('\n\n'));
  console.error(`\n${errors.length} failure(s). shots in ${out}`);
  process.exit(1);
}
console.log(`drive ok. shots in ${out}`);
