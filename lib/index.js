"use strict";

const chromeLauncher = require('chrome-launcher');
const { Chromeless } = require('chromeless');
const moment         = require('moment');
const clear          = require('clear');

async function getGymPassToken(chrome, email, password) {
  async function run() {
    const chromeless = new Chromeless({ launchChrome: false });
  
    const token = await chromeless
      .goto('https://www.gympass.com')
      .click('a[href="/pessoas/entrar"]')
      .type(email, '#person_email')
      .type(password, '#person_password')
      .click('button[type=submit]')
      .wait('#flash .container-fluid')
      .goto('https://www.gympass.com/token-diario')
      .evaluate(() => {
        return document.querySelector('.daily_token').textContent.trim();
      });
  
    clear();
    
    moment.locale('pt-br');
    console.log(`===================================================`);
    console.log(`Date: ${moment().format('LLLL')}`);
    console.log(`Gympass token: ${token}`);
    console.log(`===================================================`);
  
    await chromeless.end();
  }
  
  return run().catch((e) => {
    console.error('Error get token:\n', e);
  });
}

async function getToken(email, password) {
  const chrome = await chromeLauncher.launch({
    port: 9222,
    chromeFlags: [
      '--disable-gpu',
      '--headless'
    ]
  });

  await getGymPassToken(chrome, email, password);
  chrome.kill();
}

exports.getToken = getToken;