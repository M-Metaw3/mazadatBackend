const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const User = require('../models/User');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
// const authMiddleware = async (req, res, next) => {
//   if (!req.header('Authorization')) {
//     return res.status(401).json({ message: 'No token provided' });
//   }
//   const token = req.header('Authorization').replace('Bearer ', '');

//   console.log(token)
//   if (!token) {
//     return res.status(401).json({ message: 'No token provided' });
//   }

//   try {
  
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     console.log(decoded)

//     const user = await User.findById(decoded.id);
//     if (!user) {
//         return next(new AppError('Invalid token', 401));
 
//     }

//     req.user = user;
//     next();
//   } catch (error) {
//   return  res.status(401).json({ message: 'Unauthorized' });
//   }
// };

// module.exports = authMiddleware;


const authMiddleware = catchAsync(async (req, res, next) => {
  // 1) Getting token and check of it's there

  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401)
    );
  }

  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        'The user belonging to this token does no longer exist.',
        401
      )
    );
  }

  req.user = currentUser;

next();
})
module.exports = authMiddleware;
