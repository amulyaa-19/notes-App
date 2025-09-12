import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import {
  getNotes,
  createNote,
  getNoteById,
  updateNote,
  deleteNote,
} from "../controllers/notesController.js";

const router = express.Router();

router.use(protect);

router.route("/").get(getNotes).post(createNote);

router.route("/:id").get(getNoteById).put(updateNote).delete(deleteNote);

export default router;
