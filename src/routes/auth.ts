import express from "express";
const {signupHandler,loginHandler} = require('../controllers/authcontroller')

const router = express.Router();

router.post('/signup',signupHandler);
router.post('/login',loginHandler);

module.exports = router