const express = require('express');
const {
createCategory,deleteCategory,getAllCategory,getCategory,updateCategory
} = require('../controllers/category/Categorycontroller');
const authMiddleware = require('../middleware/authMiddleware');
const validationMiddleware = require('../middleware/validationMiddleware');
const userValidator = require('../validationswithexpress/userValidator');
const mult = require('../utils/multer');
const AppError = require('../utils/appError');
const upload = mult('images/category');
const router = express.Router();

function generateValidFilePath(filename) {
    const parts = filename.split(/[\\/]/); // Split the filename by both forward slash (/) and backslash (\)
    const formattedParts = parts.map(part => part.replace(/\\/g, '/')); // Replace backslashes (\) with forward slashes (/)
    const validPath = formattedParts.join('/'); // Join the parts back together with forward slashes (/)
    return validPath;
  }

router.get('/',getAllCategory );
router.get('/:id', getCategory);
router.post('/', upload.single('cover'),(req,res,next)=>{
  
  console.log(req.file)
  if (!req.file) {
    // return ne.status(400).send('No file uploaded.');
    return  next(new AppError('No file uploaded.', 400));
  }
  req.body.cover ={name:req.file.originalname,path: generateValidFilePath(req.file.path),pathname:req.file.filename};




next()

}, createCategory);



router.put('/:id', upload.single('cover') , (req,res,next)=>{
  
    if (req.file) {
      // return ne.status(400).send('No file uploaded.');
      req.body.cover ={name:req.file.originalname,path: generateValidFilePath(req.file.path),pathname:req.file.filename};

    }
  
  

  
  
  next()
  
  },updateCategory);
router.delete('/:id', deleteCategory);

module.exports = router;
