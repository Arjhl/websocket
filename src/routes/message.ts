// get messages using message id
import { Router } from "express";
import { getMessgaes, updateMessage } from "../controllers/messageController";

const router = Router();

router.get("/", getMessgaes);
router.post("/", updateMessage);

module.exports = router;
