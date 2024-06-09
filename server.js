const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { createNotificationNamespace, setupNotificationInterval } = require('./sockets/notifications');
process.on('uncaughtException', err => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});
const socketIo = require('socket.io');

dotenv.config({ path: './.env' });
const app = require('./app');
const io = socketIo(app,    {cors: {
  // origin: 'http://109.106.244.229',
  // origin: 'http://localhost:3000',  // Allow only this origin
    // Allow only this origin
  
}});

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
require('./sockets/socket')(io);
const notificationNamespace = createNotificationNamespace(io);
setupNotificationInterval(notificationNamespace);
mongoose
  .connect(DB, {
    // useUnifiedTopology: true ,
    // useNewUrlParser: true,
    // useCreateIndex: true,
    // useFindAndModify: false
  })
  .then(() => console.log('DB connection successful!')).catch(err => {
    console.log(err);
  });

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

process.on('unhandledRejection', err => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});