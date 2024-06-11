const checkPermission = () => {
    return async (req, res, next) => {
      const userId = req.user.id;  // Assuming user ID is available in req.user
      const user = await User.findById(userId).populate('permissions');
  
      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }
  
      const hasPermission = user.permissions.some(permission => 
        permission.method === req.method && permission.endpoint === req.originalUrl
      );
  
      if (!hasPermission) {
        return res.status(403).json({ message: 'Access denied' });
      }
  
      next();
    };
  };
  
  module.exports = { checkPermission };
  