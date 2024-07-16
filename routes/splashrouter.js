const express = require('express');
const splashcontroller = require('../controllers/splashscreen/splashscreen');
const validateDeposit = require('../middleware/validateDeposit');
const authMiddleware = require('../middleware/authMiddleware');
const validationMiddleware = require('../middleware/validationMiddleware');
const userValidator = require('../validationswithexpress/userValidator');
const mult = require('../utils/multer');
const AppError = require('../utils/appError');
const upload = mult('images/splash');
const router = express.Router();

function generateValidFilePath(filename) {
    const parts = filename.split(/[\\/]/); // Split the filename by both forward slash (/) and backslash (\)
    const formattedParts = parts.map(part => part.replace(/\\/g, '/')); // Replace backslashes (\) with forward slashes (/)
    const validPath = formattedParts.join('/'); // Join the parts back together with forward slashes (/)
    return validPath;
  }
router.post('/',upload.single('coverphoto'),(req,res,next)=>{
  
    console.log(req.file)
    if (!req.file) {
      // return ne.status(400).send('No file uploaded.');
      return  next(new AppError('No file uploaded.', 400));
    }
  
  
    req.body.coverphoto ={name:req.file.originalname,path: generateValidFilePath(req.file.path),pathname:req.file.filename};
  
  
  next()
  
  }, splashcontroller.createsplash);

  router.get('/',splashcontroller.getAllsplash);
  router.delete('/:id',splashcontroller.splash);

module.exports = router;
