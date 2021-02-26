const fs = require('fs');
const { Client, MessageMedia } = require('whatsapp-web.js');

const SESSION_FILE_PATH = './session.json';
let sessionCfg;
if (fs.existsSync(SESSION_FILE_PATH)) {
  sessionCfg = require(SESSION_FILE_PATH);
}

const client = new Client({
  puppeteer: { headless: false },
  session: sessionCfg,
});
client.initialize();

client.on('qr', (qr) => {
  console.log('QR RECEIVED', qr);
});

client.on('authenticated', (session) => {
  console.log('AUTHENTICATED', session);
  sessionCfg = session;
  fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), function (err) {
    if (err) {
      console.error(err);
    }
  });
});

client.on('auth_failure', (msg) => {
  console.error('AUTHENTICATION FAILURE', msg);
});

client.on('ready', () => {
  for (let i = 0; i < number_whitelist.length; i++) {
    sendChat(
      number_whitelist[i],
      'Bot Validasi telah online!\n\nDaftar Command:\n1. =valid {kecamatan} {kelurahan} {list_nib}\n2. =unvalid {kecamatan} {kelurahan} {list_nib}'
    );
  }
});

const validator = require('./module/validator');
let number_whitelist = [
  '6287884399186',
  '6281214560717',
  '6285721577449',
  '6285221689667',
  '6289607786272',
  '6281586983386',
  '6281321504174',
  '6281324617311',
  '6285721413639',
  '628998291451',
  '6281809536473',
  '628811448138',
  '6289667241241',
  '6289506306694',
  '6285322260139',
  '6281211968621',
  '6282181044624',
];

client.on('message', async (msg) => {
  let sender_number = getNumber(msg.from);
  if (number_whitelist.includes(sender_number)) {
    if (msg.body.startsWith('=valid ')) {
      msg.reply(
        validator.tutupValidasi(sender_number, msg.body.replace('=valid ', ''))
      );
    } else if (msg.body.startsWith('=unvalid ')) {
      msg.reply(
        validator.bukaValidasi(sender_number, msg.body.replace('=unvalid ', ''))
      );
    } else if(msg.body === '=report') {
      msg.reply(validator.requestReport());
    }
  }
});

function sendFile(number, file, message) {
  client.sendMessage(
    number.startsWith('62')
      ? `${number}@c.us`
      : number.startsWith('0')
        ? '62' + number.slice(1, number.length) + '@c.us'
        : '62' + number + '@c.us',
    file
  );
  sendChat(number, message);
}

function sendChat(number, message) {
  client.sendMessage(
    number.startsWith('62')
      ? `${number}@c.us`
      : number.startsWith('0')
        ? '62' + number.slice(1, number.length) + '@c.us'
        : '62' + number + '@c.us',
    message
  );
}

exports.sendWA = (number, message) => {
  sendChat(number, message);
};

exports.sendLog = (number, file, message, fileName) => {
  const attachment = new MessageMedia('text/plain', file, fileName + '.txt');
  sendFile(number, attachment, message);
};

client.on('disconnected', (reason) => {
  console.log('Client was logged out', reason);
});

function getNumber(sender_number) {
  return sender_number.slice(0, sender_number.indexOf('@'));
}
