const factory = require('../utils/apiFactory');
const i = require('../models/item');
const Bid = require('../models/Bid');


// const createMulterUpload = (io) => {
//     io.on('connection', (socket) => {
//         console.log('Client connected');
//         socket.on('bid', async (a) => {
//   socket.join(a.sender)
//   console.log(a)
//   const deposite = await new Bid({
//     item: a.sender,
//     userId: a.user,
//     amount: a.message
//   })
// await deposite.save()
// const items = await i.findById(deposite.item);
// items.startPrice += deposite.amount;
// await items.save()
// console.log('deposite',items)
//   io.to(a.sender).emit('bidocuures', items)

// })

// socket.on('getitem', async (idofitem) => {
//   console.log('idofitem',idofitem)
//   try {
// socket.join(idofitem)
//     const items = await i.findById(idofitem);
//     console.log('Items:', items);

//   //   const changeStream = i.watch();
//   //    changeStream.on('change', (change) => {
//   //   console.log('Change:', change);
//   //   socket.emit('itemChange', change); // Emit the change to connected clients
//   // });
//     socket.emit('items', items)
//   } catch (error) {
//     console.error('Error getting items:', error);
//     return { error: 'Failed to retrieve items' };
//   }
// });


//         socket.on('disconnect', () => {
//           console.log('Client disconnected');
//         });
//       })
// };

const createMulterUpload = (io) => {
io.on('connection', (socket) => {
  console.log('Client connected');
  socket.on('joinroom', async (data) => {
    console.log(data)
    socket.join(data.roomid);

  })
  socket.on('messages', async (a) => {
    io.to(a.roomid).emit('receive', a.msgId);

  })

  })};

module.exports = createMulterUpload;
