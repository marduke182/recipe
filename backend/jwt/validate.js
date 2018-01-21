const User = require('../models/user');

module.exports = async (decode, request) => {
  request.log(['authentication', 'jwt', 'info'], 'payload received', decode);
  // usually this would be a database call:
  const user = await User.findById(decode.id);
  request.log(['authentication', 'jwt', 'info'], `user found ${user._id}`);

  if (!user) {
    return {
      valid : false,
    };
  }
  return {
    valid: true,
    credentials: user.toObject(),
  };
};