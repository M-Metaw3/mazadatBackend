// const express = require('express');
// // const userController = require('./../controllers/userController');
// const {registerUser, loginUser} = require('./../controllers/authcontroller/authcontroller');

// const router = express.Router();

// router.post('/signup', registerUser);
// router.post('/login', loginUser);
// module.exports = router;











const express = require('express');
const {
  registerUser,
  approveUser,
  verifyOTP,
  getallusers,
  loginUser,
  forgotPassword,
  resetPassword,
  changePassword,
  logoutUser,
  updateProfile,getuser,blockUser,getme
} = require('../controllers/authcontroller/authcontroller');
const authMiddleware = require('../middleware/authMiddleware');
const validationMiddleware = require('../middleware/validationMiddleware');
const userValidator = require('../validationswithexpress/userValidator');
const mult = require('../utils/multer');
const AppError = require('../utils/appError');
const upload = mult('images/profileimages')
const router = express.Router();

function generateValidFilePath(filename) {
    const parts = filename.split(/[\\/]/); // Split the filename by both forward slash (/) and backslash (\)
    const formattedParts = parts.map(part => part.replace(/\\/g, '/')); // Replace backslashes (\) with forward slashes (/)
    const validPath = formattedParts.join('/'); // Join the parts back together with forward slashes (/)
    return validPath;
  }



  router.get('/getme/:id',authMiddleware ,getme);

router.get('/get',getallusers);
router.get('/:id',getuser);

router.post('/register',upload.fields([
  
  { name: 'idbackImage', maxCount: 1 },
  { name: 'idImage', maxCount: 1 },
  ])
  ,(req,res,next)=>{
  
  console.log(req.files)
  if (!req.files && req.files.idbackImage && req.files.idbackImage.length > 0) {
    // return ne.status(400).send('No file uploaded.');
    return  next(new AppError('No file uploaded. idImage', 400));
  }

  if (!req.files && req.files.idImage && req.files.idImage.length > 0) {
    // return ne.status(400).send('No file uploaded.');
    return  next(new AppError('No file uploaded. idImage', 400));
  }
  req.body.idImage ={name:req.files.idImage[0].originalname,path: generateValidFilePath(req.files.idImage[0].path),pathname:req.files.idImage[0].filename};

  req.body.idbackImage ={name:req.files.idbackImage[0].originalname,path: generateValidFilePath(req.files.idbackImage[0].path),pathname:req.files.idbackImage[0].filename};
next()

}, userValidator.register, validationMiddleware, registerUser);
















router.post('/verify-otp', verifyOTP);
router.post('/login', userValidator.login, validationMiddleware, loginUser);
router.post('/forgot-password', userValidator.forgotPassword, validationMiddleware, forgotPassword);
router.post('/reset-password', userValidator.resetPassword, validationMiddleware, resetPassword);
router.post('/change-password', authMiddleware, userValidator.changePassword, validationMiddleware, changePassword);
router.put('/update-profile/:userId', upload.fields([
  { name: 'profileImage', maxCount: 1 },
  { name: 'idImage', maxCount: 1 }
]), (req, res, next) => {
  console.log(req.files);

  if (req.files && req.files.idImage && req.files.idImage.length > 0) {
    req.body.idImage = {
      name: req.files.idImage[0].originalname,
      path: generateValidFilePath(req.files.idImage[0].path),
      pathname: req.files.idImage[0].filename
    };
  }

  if (req.files && req.files.idbackImage && req.files.idbackImage.length > 0) {
    req.body.idbackImage = {
      name: req.files.idbackImage[0].originalname,
      path: generateValidFilePath(req.files.idbackImage[0].path),
      pathname: req.files.idbackImage[0].filename
    };
  }

  next();
}, userValidator.updateProfile, validationMiddleware, updateProfile);








router.patch('/:userId/block', blockUser);



router.post('/logout', authMiddleware, logoutUser);
router.patch('/:userId/approve', approveUser);

module.exports = router;
