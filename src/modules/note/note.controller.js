import * as noteService from "./note.service.js";
import { Router } from "express";
const router = Router();

router.post("/", noteService.noteCreate);
router.patch("/all", noteService.updateAllNotesTitle);
router.get("/paginate-sort", noteService.paginateSort);
router.get("/note-by-content", noteService.noteByContent);
router.get("/notes-with-user", noteService.notesWithUser);
router.get("/aggregate", noteService.notesAggregate);
router.put("/replace/:noteID", noteService.noteReplace);
router.get("/:noteID", noteService.noteDataById);
router.patch("/:noteID", noteService.noteUpdate);
router.delete("/", noteService.deleteUserNotes);
router.delete("/:noteID", noteService.noteDelete);
export default router;
