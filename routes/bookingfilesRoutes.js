// routes/bookingRoutes.js

const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingfiles/bookingController');
const { checkWalletBalance, validateBookingData } = require('../middleware/bookingMiddleware');
const mult = require('../utils/multer');
const AppError = require('../utils/appError');
const upload = mult('images/billingimage');
function generateValidFilePath(filename) {
    const parts = filename.split(/[\\/]/); // Split the filename by both forward slash (/) and backslash (\)
    const formattedParts = parts.map(part => part.replace(/\\/g, '/')); // Replace backslashes (\) with forward slashes (/)
    const validPath = formattedParts.join('/'); // Join the parts back together with forward slashes (/)
    return validPath;
  }
router.post('/book',upload.single('billImage'),(req,res,next)=>{
    if (req.body.billingmethod == 'wallet') {
        return next();
      }
    if (!req.file) {
      // return ne.status(400).send('No file uploaded.');
      return  next(new AppError('No file uploaded.', 400));
    }
  
  
    req.body.billImage ={name:req.file.originalname,path: generateValidFilePath(req.file.path),pathname:req.file.filename};
  
  
  next()
  
  }, validateBookingData, checkWalletBalance, bookingController.bookFile);
router.get('/bookings', bookingController.getAllBookings);
router.patch('/bookings/:id/approve', bookingController.approveBooking);
router.patch('/bookings/:id/reject', bookingController.rejectBooking);

module.exports = router;
