import NoteModel from "../../DB/models/Note.model.js";
import jwt from "jsonwebtoken";
import UserModel from "../../DB/models/User.model.js";
import { ObjectId } from "mongoose";

export const noteCreate = async (req, res) => {
  try {
    const { noteTitle, noteContent } = req.body;
    const { token } = req.headers;
    const decodedToken = jwt.verify(token, "userToken");
    const userID = decodedToken.id;
    const userExists = await UserModel.findById(userID);
    if (!userExists) {
      return res.status(404).json({ message: "User not found" });
    }
    const note = await NoteModel.create({ noteTitle, noteContent, userID });
    return res.status(201).json({
      message: "Note created successfully.",
      note: { title: note.noteTitle, content: note.noteContent },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export const noteUpdate = async (req, res) => {
  try {
    const { noteID } = req.params;
    const { noteTitle, noteContent } = req.body;
    const { token } = req.headers;
    const decodedToken = jwt.verify(token, "userToken");
    const userID = decodedToken.id;
    const noteExists = await NoteModel.findById(noteID);
    if (!noteExists) {
      return res.status(404).json({ message: "Note not found" });
    }
    if (noteExists.userID.toString() !== userID) {
      return res.status(401).json({ message: "You are not the owner." });
    }
    const note = await NoteModel.findByIdAndUpdate(
      noteID,
      { noteTitle, noteContent },
      { new: true }
    );
    return res.status(200).json({
      message: "Note updated successfully.",
      note,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export const noteReplace = async (req, res) => {
  try {
    const { noteID } = req.params;
    const { noteTitle, noteContent } = req.body;
    const { token } = req.headers;
    const decodedToken = jwt.verify(token, "userToken");
    const userID = decodedToken.id;
    const noteExists = await NoteModel.findById(noteID);
    if (!noteExists) {
      return res.status(404).json({ message: "Note not found" });
    }
    if (noteExists.userID.toString() !== userID) {
      return res.status(401).json({ message: "You are not the owner." });
    }
    const note = await NoteModel.replaceOne(
      { _id: noteID },
      { noteTitle, noteContent, userID },
      { new: true }
    );
    return res.status(200).json({
      message: "Note replaced successfully.",
      note: {
        title: noteTitle,
        content: noteContent,
        userID: noteExists.userID,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export const updateAllNotesTitle = async (req, res) => {
  try {
    const { noteTitle } = req.body;
    const { token } = req.headers;
    const decodedToken = jwt.verify(token, "userToken");
    const userID = decodedToken.id;
    const noteExists = await NoteModel.find({ userID });
    if (!noteExists) {
      return res.status(404).json({ message: "Note not found" });
    }
    const note = await NoteModel.updateMany({ userID }, { noteTitle });
    return res.status(200).json({
      message: "All notes updated successfully.",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export const noteDelete = async (req, res) => {
  try {
    const { noteID } = req.params;
    const { token } = req.headers;
    const decodedToken = jwt.verify(token, "userToken");
    const userID = decodedToken.id;

    const noteExists = await NoteModel.findById(noteID);
    if (!noteExists) {
      return res.status(404).json({ message: "Note not found" });
    }
    if (noteExists.userID.toString() !== userID) {
      return res.status(401).json({ message: "You are not the owner." });
    }
    const note = await NoteModel.findByIdAndDelete(noteID);
    return res.status(200).json({
      message: "Note deleted successfully.",
      note,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export const paginateSort = async (req, res) => {
  try {
    const { token } = req.headers;
    const decodedToken = jwt.verify(token, "userToken");
    const userID = decodedToken.id;
    const userExists = await UserModel.findById(userID);
    if (!userExists) {
      return res.status(404).json({ message: "User not found" });
    }
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;
    const notes = await NoteModel.find({ userID })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
    return res.status(200).json({ notes });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const noteDataById = async (req, res) => {
  try {
    const { noteID } = req.params;
    const { token } = req.headers;
    const decodedToken = jwt.verify(token, "userToken");
    const userID = decodedToken.id;
    const noteExists = await NoteModel.findById(noteID);
    if (!noteExists) {
      return res.status(404).json({ message: "Note not found" });
    }
    if (noteExists.userID.toString() !== userID) {
      return res.status(401).json({ message: "You are not the owner." });
    }
    return res.status(200).json({ noteExists });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const noteByContent = async (req, res) => {
  try {
    const { noteContent } = req.query;
    const { token } = req.headers;
    const decodedToken = jwt.verify(token, "userToken");
    const userID = decodedToken.id;
    const userExists = await UserModel.find({ userID });
    if (!userExists) {
      return res.status(404).json({ message: "User not found" });
    }
    const noteExists = await NoteModel.find({ userID, noteContent });
    if (!noteExists) {
      return res.status(404).json({ message: "Note not found" });
    }
    return res.status(200).json({ noteExists });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const notesWithUser = async (req, res) => {
  try {
    const { token } = req.headers;
    const decodedToken = jwt.verify(token, "userToken");
    const userID = decodedToken.id;
    const userExists = await UserModel.find({ userID });
    if (!userExists) {
      return res.status(404).json({ message: "User not found" });
    }
    const notes = await NoteModel.find({ userID })
      .select({ noteTitle: 1, noteContent: 1, createdAt: 1 })
      .populate({ path: "userID", select: { userEmail: 1, _id: 0 } });
    return res.status(200).json({ notes });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const notesAggregate = async (req, res) => {
  try {
    const { token } = req.headers;
    const { noteTitle } = req.query;
    const decodedToken = jwt.verify(token, "userToken");
    const userID = decodedToken.id;
    const userExists = await UserModel.find({ userID });
    if (!userExists) {
      return res.status(404).json({ message: "User not found" });
    }
    const notes = await NoteModel.find({ userID })
    .select({ noteTitle: 1, noteContent: 1, createdAt: 1 })
    .populate({ path: "userID", select: { userEmail: 1, userName: 1, _id: 0 } });
    return res.status(200).json({ notes });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteUserNotes = async (req, res) => {
  try {
    const { token } = req.headers;
    const decodedToken = jwt.verify(token, "userToken");
    const userID = decodedToken.id;
    const userExists = await UserModel.find({ userID });
    if (!userExists) {
      return res.status(404).json({ message: "User not found" });
    }
    const notes = await NoteModel.deleteMany({ userID });
    if (notes.deletedCount == 0) {
      return res.status(404).json({ message: "Notes not found" });
    }
    return res.status(200).json({ message: "Notes deleted successfully." });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

