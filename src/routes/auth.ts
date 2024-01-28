import express from "express";
const {
  signupHandler,
  loginHandler,
  logoutHandler,
} = require("../controllers/authcontroller");

const router = express.Router();

router.post("/signup", signupHandler);
router.post("/login", loginHandler);
router.post("/logout", logoutHandler);

module.exports = router;
