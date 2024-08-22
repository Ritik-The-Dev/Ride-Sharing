// Utility function to set token in a cookie
const setTokenCookie = (res, token) => {
  const cookieOptions = {
    httpOnly: true, // Prevents JavaScript access to the cookie
    secure: process.env.NODE_ENV === "production", // Send only over HTTPS in production
    sameSite: "strict", // Prevents CSRF attacks
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ), // cookie expiration
  };
  res.cookie("token", token, cookieOptions);
};

module.exports = { setTokenCookie };
