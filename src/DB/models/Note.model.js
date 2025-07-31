import { Schema, model } from "mongoose";

const NoteSchema = new Schema(
  {
    noteTitle: {
      type: String,
      required: true,
      validate: {
        validator: function (value) {
          return value !== value.toUpperCase();
        },
        message: "Title must not be in upper case.",
      },
    },
    noteContent: {
      type: String,
      required: true,
    },
    userID: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const NoteModel = model("Note", NoteSchema);

export default NoteModel;
