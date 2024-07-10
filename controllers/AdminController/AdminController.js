const Admin = require('../../models/Admin');
const Permission = require('../../models/permissions');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const AppError = require('../../utils/appError');
const catchAsync = require('../../utils/catchAsync');

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

const createSendToken = (admin, statusCode, res) => {
  const token = signToken(admin);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);

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

exports.getAllAdmins = catchAsync(async (req, res, next) => {
  const admins = await Admin.find().populate('permissions');
  res.status(200).json({
    status: 'success',
    results: admins.length,
    data: {
      admins
    }
  });
});

exports.getAdminById = catchAsync(async (req, res, next) => {
  const admin = await Admin.findById(req.params.id).populate('permissions');

  if (!admin) {
    return next(new AppError('No admin found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      admin
    }
  });
});

exports.createAdmin = catchAsync(async (req, res, next) => {
  const { username, email, password } = req.body;

  const existingAdmin = await Admin.findOne({ $or: [{ email }, { username }] });

  if (existingAdmin) {
    return next(new AppError('Admin already exists', 400));
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const newAdmin = new Admin({ username, email, passwordHash });
  await newAdmin.save();

  res.status(201).json({
    status: 'success',
    data: {
      admin: newAdmin
    }
  });
});

exports.updateAdmin = catchAsync(async (req, res, next) => {
  const admin = await Admin.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!admin) {
    return next(new AppError('No admin found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      admin
    }
  });
});

exports.deleteAdmin = catchAsync(async (req, res, next) => {
  const admin = await Admin.findByIdAndDelete(req.params.id);

  if (!admin) {
    return next(new AppError('No admin found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});

exports.addPermissionToAdmin = catchAsync(async (req, res, next) => {
  const { permissionIds } = req.body;
console.log(permissionIds)
  const admin = await Admin.findById(req.params.id);
  if (!admin) {
    return next(new AppError('No admin found with that ID', 404));
  }

  const permissions = await Permission.find({ _id: { $in: permissionIds } });
  if (!permissions) {
    return next(new AppError('No permission found with that ID', 404));
  }

  admin.permissions.push(...permissions);
  await admin.save();

  res.status(200).json({
    status: 'success',
    data: {
      admin
    }
  });
});

exports.removePermissionFromAdmin = catchAsync(async (req, res, next) => {
  const { permissionId } = req.params;

  const admin = await Admin.findById(req.params.id);
  if (!admin) {
    return next(new AppError('No admin found with that ID', 404));
  }

  admin.permissions.pull(permissionId);
  await admin.save();

  res.status(200).json({
    status: 'success',
    data: {
      admin
    }
  });
});
