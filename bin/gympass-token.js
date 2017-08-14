#!/usr/bin/env node
 
const clear = require('clear');

let paths = process.argv[1].split('/');

const command  = paths[paths.length-1];
const email    = process.argv.slice(2)[0];
const password = process.argv.slice(3)[0];

if (!email || !password) {
  console.error(`Email/password error.\nTry: ${command} <email> <password>`);
  process.exit(1);
}

clear();

console.log(`Waiting for token...`);

require('../lib/index.js')
  .getToken(email, password);