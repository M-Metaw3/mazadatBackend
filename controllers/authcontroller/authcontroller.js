const passport = require('passport');
const uservalidation = require('../../validations/Uservalidation/uservalidation');
const joifunctions = require('../../validations/mainjoivalidations');
const { promisify } = require('util');

const crypto = require('crypto');
// const { promisify } = require('util');

const User = require('../../models/User');
const AppError = require('../../utils/appError');
const catchAsync = require('../../utils/catchAsync');


const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET )
};




const createSendToken = (user, statusCode, res) => {

  console.log(user)
  const token = signToken(user._id);
  const cookieOptions = {
    // expires: new Date(
    //   Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    // ),
    httpOnly: true
  };
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
};



// exports.signup = catchAsync(async (req, res, next) => {
//   console.log(`Method: ${req.method}, API: ${req.originalUrl}`);
// console.log(req.body)
// const newUser = await User.create({
//   name: req.body.name,
//   // companyname: req.body.companyname,
//   // specialist: req.body.specialist,
//   // address: req.body.address,
//   // IDnum: req.body.IDnum,
//   email: req.body.email,
//   phone: req.body.phone,
//   // photo: req.body.photo,
//   // identitycard: req.body.identitycard,
//   password: req.body.password,
//   // passwordConfirm: req.body.passwordConfirm
// });

//   createSendToken(newUser, 201, res);
// });

// exports.login = catchAsync(async (req, res, next) => {
//   const { email, password } = req.body;

//   // 1) Check if email and password exist
//   if (!email || !password) {
//     return next(new AppError('Please provide email and password!', 400));
//   }
//   // 2) Check if user exists && password is correct
//   const user = await User.findOne({ email }).select('+password');

//   if (!user || !(await user.correctPassword(password, user.password))) {
//     return next(new AppError('Incorrect email or password', 401));
//   }

//   // 3) If everything ok, send token to client
//   createSendToken(user, 200, res);
// });






// exports.protect = catchAsync(async (req, res, next) => {
//   // 1) Getting token and check of it's there
//   let token;
//   if (
//     req.headers.authorization &&
//     req.headers.authorization.startsWith('Bearer')
//   ) {
//     token = req.headers.authorization.split(' ')[1];
//   } else if (req.cookies.jwt) {
//     token = req.cookies.jwt;
//   }

//   if (!token) {
//     return next(
//       new AppError('You are not logged in! Please log in to get access.', 401)
//     );
//   }

//   // 2) Verification token
//   const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

//   // 3) Check if user still exists
//   const currentUser = await User.findById(decoded.id);
//   if (!currentUser) {
//     return next(
//       new AppError(
//         'The user belonging to this token does no longer exist.',
//         401
//       )
//     );
//   }

//   // 4) Check if user changed password after the token was issued
//   // if (currentUser.changedPasswordAfter(decoded.iat)) {
//   //   return next(
//   //     new AppError('User recently changed password! Please log in again.', 401)
//   //   );
//   // }

//   // GRANT ACCESS TO PROTECTED ROUTE
//   req.user = currentUser;
//   res.locals.user = currentUser;
//   next();
// });

// module.exports = { signup,login };















const OTP = require('../../models/otp');
const { generateOTP, sendOTP } = require('../../utils/otpUtils');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const factory = require('../../utils/apiFactory');
const getallusers = factory.getAll(User);
 const getuser= factory.getOne(User);

const registerUser = async (req, res ,next) => {
  try {
    const { name, email, birthdate, phoneNumber, password ,idImage,idNumber,companyname,adress,specialist} = req.body;
console.log(idNumber)

    const existingUser = await User.findOne({ $or: [{ email }, { phoneNumber }] });
console.log('existingUser',existingUser)

    if (existingUser) {
      return next(new AppError('User already exists', 400))
   
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, birthdate, phoneNumber, passwordHash,idImage,idNumber,companyname,adress,specialist });
    await newUser.save();
    console.log(newUser)

    // const otpCode = generateOTP();
    const newOTP = new OTP({ userId: newUser._id, otpCode:'123456', expiresAt: Date.now() + 1000 * 60 * 1000 });
    await newOTP.save();

    // sendOTP(phoneNumber, '123456');

    res.status(201).json({status:"success",data:{ message: 'User registered successfully. Please verify your phone number.',data:newUser._id }});
  } catch (error) {
    console.log(error)
  return next(new AppError(`Server error ${error}`, 500));
  }
};

const verifyOTP = async (req, res,next) => {
  try {
    const { userId, otpCode } = req.body;
console.log(userId,otpCode)
    const otpRecord = await OTP.findOne({ userId, otpCode });
    if (!otpRecord || otpRecord.expiresAt < Date.now()) {
      return next(new AppError('Invalid or expired OTP', 400));
    }

    await User.findByIdAndUpdate(userId, { verified: true });
    await OTP.deleteMany({ userId });

   return res.status(200).json({status:"success",data:{ message: 'Phone number verified successfully'} });
  } catch (error) {
    next(new AppError('Server error on otp verificatios', 500));
  }
};

const loginUser = async (req, res,next) => {
  try {
    const { email, password ,phoneNumber } = req.body;
    let query;
    if (email) {
        query = { email: email };
    } else if (phoneNumber) {
        query = { phoneNumber: phoneNumber };
    } else {
        return res.status(400).json({ error: 'Email or phone number must be provided' });
    }
    console.log(query)
    const user = await User.findOne(query);
    if (!user) {
      return next(new AppError('Invalid credentials', 400));
   
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return next(new AppError('Invalid credentials', 400));
 
    }

    if (!user.verified) {
      return next(new AppError('Please verify your phone number first', 400));
    }
    if (user.blocked) {
      return next(new AppError('you are blocked', 400));
    }
user.passwordHash=undefined;
return createSendToken(user, 200, res);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

const forgotPassword = async (req, res,next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return next(new AppError('User not found', 400));
   
    }

    // const otpCode = generateOTP();
    const newOTP = new OTP({ userId: user._id, otpCode:'123456', expiresAt: Date.now() + 10 * 60 * 1000 });
    await newOTP.save();

    sendOTP(user.phoneNumber, '123456');

   return res.status(200).json({status:"success",data:{ message: 'OTP sent to your phone number',data:user._id }});;
  } catch (error) {
    return next(new AppError('Server error', 500));
  }
};

const resetPassword = async (req, res,next) => {
  try {
    const { userId, otpCode, newPassword } = req.body;

    const otpRecord = await OTP.findOne({ userId, otpCode });
    console.log(otpRecord)
    if (!otpRecord || otpRecord.expiresAt < Date.now()) {
      return next(new AppError('Invalid or expired OTP', 400));
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(userId, { passwordHash });
    await OTP.deleteMany({ userId });

   return res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
  return  res.status(500).json({ message: 'Server error', error });
  }
};

const changePassword = async (req, res) => {
  try {
    const { userId } = req.user;
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return next(new AppError('User not found', 400));
    }

    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isMatch) {
      return next(new AppError('Invalid current password', 400));
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(userId, { passwordHash });

   return res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
   return res.status(500).json({ message: 'Server error', error });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, birthdate, phoneNumber, idNumber ,profileImage,specialist,companyname,address,idImage} = req.body;
    // const profileImage = req.files.profileImage ? req.files.profileImage[0].path : null;
    // const idImage = req.files && req.files.idImage ? req.files.idImage[0].path : null;

    const updates = { name, birthdate, phoneNumber, idNumber,specialist, companyname,address};
    if (profileImage) updates.profileImage = profileImage;
    if (idImage) updates.idImage = idImage;

    await User.findByIdAndUpdate(userId, updates, { new: true });

 return   res.status(200).json({ message: 'Profile updated successfully' });
  } catch (error) {
   return res.status(500).json({ message: 'Server error', error });
  }
};


const blockUser = async (req, res) => {
  const { userId } = req.params;
  const { status } = req.body;

  const user = await User.findByIdAndUpdate(userId, { blocked: status }, { new: true });

  res.json({status:"success",data:user})};
module.exports = {
  getallusers,
  registerUser,
  verifyOTP,
  loginUser,
  forgotPassword,
  resetPassword,
  changePassword,
  updateProfile,getuser,blockUser
};
