const httpStatus = require('http-status');
const catchAsync = require('../../utils/catchAsync');
const authService = require('../../services/auth/auth.service');
const userService = require('../../services/user/user.service');
const tokenService = require('../../services/auth/token.service');
const { parseDeviceInfo } = require('../../helpers/function.helper');
const { findOneAndUpdateDoc } = require('../../helpers/mongoose.helper');
const { MONGOOSE_MODELS } = require('../../helpers/mongoose.model.helper');
const ApiError = require('../../utils/ApiError');

const register = catchAsync(async (req, res) => {
  const { first_name, email, password, confirm_password } = req.body;

  // Match password and confirm password
  if (password != confirm_password) throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid credentials.');

  let user = await userService.getFilterUser({ email });

  if (user) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email is already taken.');
  }

  if (password != confirm_password) throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid credentials.');

  // Create User
  user = await userService.createUser(req.body);

  // set profile details
  await findOneAndUpdateDoc(
    MONGOOSE_MODELS.USER_PROFILE,
    {
      user: user._id,
      first_name,
    },
    {
      user: user._id,
      first_name,
    },
    {
      upsert: true,
      new: true,
    }
  );

  res.status(httpStatus.CREATED).json({
    success: true,
    message: 'User register successfully',
    data: { user },
  });
});

const login = catchAsync(async (req, res) => {
  const { email, password, device_info } = req.body;
  try {
    const user = await authService.loginUserWithEmailAndPassword(email, password);

    // generate tokens
    const tokens = await tokenService.generateAuthTokens(user);

    if (device_info) {
      // generate device info
      const device_info = parseDeviceInfo(device_info);

      // save device info
      await tokenService.saveDeviceInfo(
        {
          _id: tokens.refresh._id,
        },
        { device_info }
      );
    }

    return res.status(httpStatus.OK).json({
      success: true,
      data: { tokens },
      message: 'User login successfully',
    });
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message || 'Something went wrong');
  }
});

const logout = catchAsync(async (req, res) => {
  try {
    await authService.logout(req.body.refreshToken);

    return res.status(httpStatus.OK).json({
      success: true,
      message: 'User logged out successfully',
    });
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message || 'Something went wrong');
  }
});

const refreshTokens = catchAsync(async (req, res) => {
  try {
    const tokens = await authService.refreshAuth(req.body.refreshToken);
    return res.status(httpStatus.OK).json({ data: { ...tokens } });
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message || 'Something went wrong');
  }
});

const forgotPassword = catchAsync(async (req, res) => {
  const resetPasswordToken = await tokenService.generateResetPasswordToken(req.body.email);
  await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const resetPassword = catchAsync(async (req, res) => {
  await authService.resetPassword(req.query.token, req.body.password);
  res.status(httpStatus.NO_CONTENT).send();
});

const sendVerificationEmail = catchAsync(async (req, res) => {
  const verifyEmailToken = await tokenService.generateVerifyEmailToken(req.user);
  await emailService.sendVerificationEmail(req.user.email, verifyEmailToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const verifyEmail = catchAsync(async (req, res) => {
  await authService.verifyEmail(req.query.token);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  sendVerificationEmail,
  verifyEmail,
};
