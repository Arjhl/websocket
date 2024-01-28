// get contacts using userid
import { Router } from "express";
import {
  getContacts,
  addContact,
  updateGroup,
  createGroup,
} from "../controllers/contactcontroller";

const router = Router();

router.get("/", getContacts);
router.post("/", createGroup);
router.post("/update", updateGroup);
router.post("/add", addContact);
module.exports = router;
