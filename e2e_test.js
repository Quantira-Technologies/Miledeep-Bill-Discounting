import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  
  const logs = [];
  page.on('console', msg => {
    if (msg.type() === 'error' || msg.type() === 'warning') {
      logs.push(`BROWSER_${msg.type().toUpperCase()}: ${msg.text()}`);
    }
  });
  
  page.on('pageerror', error => {
    logs.push(`PAGE_ERROR: ${error.message}`);
  });

  try {
    console.log("Navigating to live site...");
    await page.goto('https://mbd-onboarding.vercel.app', { waitUntil: 'networkidle0', timeout: 15000 });
    
    console.log("Checking if we reached the login screen...");
    const html = await page.content();
    if (html.includes("Connecting to Cloud Database")) {
      console.log("FAIL: Stuck on loading screen");
      process.exit(1);
    }
    
    console.log("Typing credentials...");
    // The username and password inputs are the only two text inputs on the page
    const inputs = await page.$$('input.form-input');
    await inputs[0].type('supplier1');
    await inputs[1].type('password123');
    
    console.log("Clicking Sign In...");
    const submitBtn = await page.$('button[type="submit"]');
    await submitBtn.click();
    
    // Wait for dashboard to load
    await new Promise(r => setTimeout(r, 2000));
    
    console.log("Checking dashboard content...");
    const dashboardHtml = await page.content();
    if (dashboardHtml.includes("Supplier Dashboard") || dashboardHtml.includes("Welcome") || dashboardHtml.includes("New Dispatch")) {
      console.log("SUCCESS: Successfully logged in and reached the dashboard.");
    } else {
      console.log("FAIL: Did not reach dashboard after login.");
      // Could be the alert "Invalid username or password"
      console.log(dashboardHtml.substring(0, 500)); 
    }
    
  } catch (err) {
    console.log("TEST EXCEPTION:", err.message);
  }

  console.log("\n--- BROWSER LOGS ---");
  console.log(logs.join('\n'));

  await browser.close();
})();
