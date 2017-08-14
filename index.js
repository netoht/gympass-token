const chromeLauncher = require('chrome-launcher');
const { Chromeless } = require('chromeless');

const email = process.argv.slice(2)[0];
const pass  = process.argv.slice(3)[0];

if (!email || !pass) {
  console.error('Email/pass error');
  process.exit(1);
}

(async function() {
  async function launchChrome() {
    return await chromeLauncher.launch({
      port: 9222,
      chromeFlags: [
        '--disable-gpu',
        '--headless'
      ]
    });
  }
  const chrome = await launchChrome();

  await getGymPassToken(chrome);
  chrome.kill();
})();

async function getGymPassToken(chrome) {
  async function run() {
    const chromeless = new Chromeless({ launchChrome: false })
  
    const token = await chromeless
      .goto('https://www.gympass.com')
      .click('a[href="/pessoas/entrar"]')
      .type(email, '#person_email')
      .type(pass, '#person_password')
      .click('button[type=submit]')
      .wait('#flash .container-fluid')
      .goto('https://www.gympass.com/token-diario')
      .evaluate(() => {
        return document.querySelector('.daily_token').textContent.trim();
      })
  
    console.log(token);
  
    await chromeless.end();
  }
  
  return run().catch((e) => {
    console.error('Error get token:\n', e);
  });
}