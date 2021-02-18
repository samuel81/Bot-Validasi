const app = require('../app');
const io = require('socket.io-client');

const socket = io('ws://localhost:8081');

socket.on('send-message', (number, message) => {
  app.sendWA(number, message);
});

socket.on('send-log', (number, file, message, fileName) => {
  app.sendLog(number, file, message, fileName);
  app.sendWA(
    number,
    'Silahkan Isi Progress di link berikut\nhttps://forms.gle/9FJmvsMK6Y48cmJo8'
  );
});

socket.on('connect', () => {
  socket.emit('join-room', 'message-sender');
});

socket.on('disconnect', () => {
  socket.open();
});

function emitBukaValidasi(requester_number, kecamatan, kelurahan, list_nib) {
  socket.emit(
    'validasi-buka',
    requester_number,
    kecamatan,
    kelurahan,
    list_nib
  );
}

function emitTutupValidasi(requester_number, kecamatan, kelurahan, list_nib) {
  socket.emit(
    'validasi-tutup',
    requester_number,
    kecamatan,
    kelurahan,
    list_nib
  );
}

/**
 * command      :   =unvalid ${kecamatan} ${kelurahan} ${list_nib}
 * contoh       :   =unvalid CILINCING CILINCING 1,2,3,4,5,6,7,8,9,10
 */
exports.bukaValidasi = (number, message) => {
  let sp = message.split(' ');
  if (sp.length == 3) {
    emitBukaValidasi(
      number,
      sp[0].replace(/_/g, ' ').toUpperCase(),
      sp[1].replace(/_/g, ' ').toUpperCase(),
      sp[2]
    );
    return 'Memproses request... Harap tunggu...';
  } else {
    return 'Request invalid format, correct format: =unvalid {kecamatan} {kelurahan} {list_nib}';
  }
};

/**
 * command      :   =valid ${kecamatan} ${kelurahan} ${list_nib}
 * contoh       :   =valid CILINCING CILINCING 1,2,3,4,5,6,7,8
 */
exports.tutupValidasi = (number, message) => {
  let sp = message.split(' ');
  if (sp.length == 3) {
    emitTutupValidasi(
      number,
      sp[0].replace('_', ' ').toUpperCase(),
      sp[1].replace('_', ' ').toUpperCase(),
      sp[2]
    );
    return 'Memproses request... Harap tunggu...';
  } else {
    return 'Request invalid format, correct format: =valid {kecamatan} {kelurahan} {list_nib}';
  }
};
