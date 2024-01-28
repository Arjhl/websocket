import { Router } from "express";
import { getUser, getUserUsingEmail } from "../controllers/usercontroller";
//get user

const router = Router();

router.get("/", getUser);
router.get("/email", getUserUsingEmail);

module.exports = router;
