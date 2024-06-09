const express = require('express');
const morgan = require('morgan');

const passport = require('passport');
const session = require('express-session');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorcontroller/errorController');
const bodyParser = require('body-parser');
const cors = require('cors')
const http = require('http');
const socketIo = require('socket.io');
const app = express();
const server = http.createServer(app);
const handleMulterErrors = require('./controllers/errorcontroller/multerErrors');
const { googleCallback, generateJWT } = require('./controllers/authcontroller/authcontroller');
const CategoryRoute = require('./routes/CategoryRoute');
const ItemsRoute = require('./routes/ItemsRoute');
const authRoute = require('./routes/authrouter');
const DepositRoute = require('./routes/depositesroute');
const subcategory = require('./routes/subercategoryRoute');
const appfeatures = require('./routes/appfeatures');
const splashroute = require('./routes/splashrouter');
const bidingroute = require('./routes/bidroute');
const getwinners = require('./routes/winnerroute');
const notificationsroute = require('./routes/notificationsroute');
const testrout = require('./routes/testrouting');
const bookingfiles = require('./routes/bookingfilesRoutes');
const paymentRoutes = require('./routes/paymentRoutes');






const path = require('path');




// 1) MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
// app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());
// app.use(express.static(`${__dirname}/public`));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use((req, res, next) => {

  req.requestTime = new Date().toISOString();

  next();
});

app.get('/', (req, res) => {
  res.send('Welcome to the Online Auction System API MAZADAT');
});


app.use('/api/v1/categories', CategoryRoute);
app.use('/api/v1/notifications', notificationsroute);
app.use('/api/v1/test', testrout);
app.use('/api/v1/payfiles', bookingfiles);



app.use('/api/v1/mylots', getwinners);

app.use('/api/v1/bid', bidingroute);

app.use('/api/v1/splash', splashroute);

app.use('/api/v1/appfeatures', appfeatures);
app.use('/api/v1/payments', paymentRoutes);
app.use('/api/v1/subcategory', subcategory);
app.use('/api/v1/deposite', DepositRoute);
app.use('/api/v1/items', ItemsRoute);
app.use('/api/v1/auth', authRoute);



app.use(express.static(path.join(__dirname, './build')));
app.get('/*', async(req, res) => {
  await res.sendFile(path.resolve('./build/index.html'))
  
});

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// app.use(handleMulterErrors);
app.use(globalErrorHandler);
module.exports = server;