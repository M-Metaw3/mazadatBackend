const Permission = require('../../models/permissions');
const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/appError');

exports.getAllPermissions = catchAsync(async (req, res, next) => {
  const permissions = await Permission.find();
  res.status(200).json({
    status: 'success',
    results: permissions.length,
    data: {
      permissions
    }
  });
});

exports.getPermission = catchAsync(async (req, res, next) => {
  const permission = await Permission.findById(req.params.id);
  if (!permission) {
    return next(new AppError('No permission found with that ID', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      permission
    }
  });
});

exports.createPermission = catchAsync(async (req, res, next) => {
  const newPermission = await Permission.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      permission: newPermission
    }
  });
});

exports.updatePermission = catchAsync(async (req, res, next) => {
  const permission = await Permission.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!permission) {
    return next(new AppError('No permission found with that ID', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      permission
    }
  });
});

exports.deletePermission = catchAsync(async (req, res, next) => {
  const permission = await Permission.findByIdAndDelete(req.params.id);
  if (!permission) {
    return next(new AppError('No permission found with that ID', 404));
  }
  res.status(204).json({
    status: 'success',
    data: null
  });
});
