import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();

  page.on('console', msg => {
    if (msg.type() === 'error' || msg.type() === 'warning') {
      console.log('BROWSER_CONSOLE:', msg.text());
    }
  });

  page.on('pageerror', error => {
    console.log('PAGE_ERROR:', error.message);
  });

  try {
    await page.goto('https://mbd-onboarding.vercel.app', { waitUntil: 'networkidle0', timeout: 15000 });
    console.log("Page loaded successfully.");
    const content = await page.content();
    if (content.includes("Connecting to Cloud Database")) {
      console.log("UI_STATE: Stuck on loading screen");
    } else {
      console.log("UI_STATE: Passed loading screen");
    }
  } catch (err) {
    console.log("Navigation Error:", err.message);
  }

  await browser.close();
})();
