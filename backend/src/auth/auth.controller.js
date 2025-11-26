const { loginUser } = require('./auth.service');

async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Email & password are required" });

    const result = await loginUser(email, password);

    return res.status(200).json({
      message: "Login successful",
      user: result.user,
      token: result.token
    });

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return res.status(401).json({ message: err.message || "Login failed" });
  }
}

async function logout(req, res) {
  // JWT logout = frontend deletes token
  return res.status(200).json({ message: "Logout successful" });
}

module.exports = {
  login,
  logout
};
