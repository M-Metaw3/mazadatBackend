const Admin = require('../../models/Admin');  // Adjust the path as needed
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const AppError = require('../../utils/appError');  // Adjust the path as needed
const catchAsync = require('../../utils/catchAsync');  // Adjust the path as needed

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

const createSendToken = (admin, statusCode, res) => {
  const token = signToken(admin._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);

  // Remove password from output
  admin.passwordHash = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      admin
    }
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const { username, email, password } = req.body;

  const existingAdmin = await Admin.findOne({ $or: [{ email }, { username }] });

  if (existingAdmin) {
    return next(new AppError('Admin already exists', 400));
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const newAdmin = new Admin({ username, email, passwordHash });
  await newAdmin.save();

  createSendToken(newAdmin, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }

  const admin = await Admin.findOne({ email }).select('+passwordHash');

  if (!admin || !(await bcrypt.compare(password, admin.passwordHash))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  createSendToken(admin, 200, res);
});
