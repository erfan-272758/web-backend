const express = require("express");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const { userModel } = require("./model");
exports.guard = async (req, res, next) => {
  try {
    const [, token] = req.headers["authorization"]?.split(" ") ?? [];
    jwt.verify(token, process.env.TOKEN_SECRET, async (err, payload) => {
      if (err) return res.status(401).send("Please Login first");
      const id = payload.id;
      const user = await userModel.findById(id);
      if (!user) return res.status(401).send("Please Login first");
      req.user = user;
      return next();
    });
  } catch (err) {
    return res.status(401).send("Please Login first");
  }
};

const generateToken = async (id) => {
  try {
    const token = await promisify(jwt.sign)({ id }, process.env.TOKEN_SECRET, {
      expiresIn: "1d",
    });
    return token;
  } catch (err) {
    return null;
  }
};

const router = express.Router();

router.post("/signup", async (req, res) => {
  const user = await userModel.create({
    username: req.body.username,
    password: req.body.password,
  });
  const token = await generateToken(String(user._id));
  if (!token) return res.status(500).send("Internal Error");
  return res.status(201).json({ token });
});

router.post("/login", async (req, res) => {
  const user = await userModel.findOne({
    username: req.body.username,
    password: req.body.password,
  });
  if (!user) return res.status(401).send("Wrong username or password");
  const token = await generateToken(user.id);
  return res.status(200).json({ token });
});

exports.authRouter = router;
