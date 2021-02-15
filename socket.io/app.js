const io = require('socket.io')(8081, {
  maxHttpBufferSize: 1e8,
});

io.on('connection', (socket) => {
  socket.on('join-room', (room) => {
    socket.join(room);
    console.log('user connected to room ' + room);
  });

  socket.on('leave-room', (room) => {
    socket.leave(room);
    console.log('user disconnected from room ' + room);
  });

  socket.on('validasi-buka', (number, kecamatan, kelurahan, list_nib) => {
    io.in('service').emit(
      'validasi-buka',
      number,
      kecamatan,
      kelurahan,
      list_nib
    );
  });

  socket.on('validasi-tutup', (number, kecamatan, kelurahan, list_nib) => {
    io.in('service').emit(
      'validasi-tutup',
      number,
      kecamatan,
      kelurahan,
      list_nib
    );
  });

  socket.on('send-message', (number, message) => {
    io.in('message-sender').emit('send-message', number, message);
  });

  socket.on('send-log', (number, file, message, fileName) => {
    io.in('message-sender').emit('send-log', number, file, message, fileName);
  });
});
