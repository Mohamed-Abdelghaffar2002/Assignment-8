import express from "express";
import dbConnection from "./DB/connection.db.js";
import authRouter from "./modules/auth/auth.controller.js";
import userRouter from "./modules/user/user.controller.js";
import noteRouter from "./modules/note/note.controller.js";
const bootstrap = async () => {
  //server connection
  const app = express();
  const port = 3000;
  //DB
  await dbConnection();

  //routing
  app.use(express.json());

  app.use("/users", authRouter);
  app.use("/users", userRouter);
  app.use("/notes", noteRouter);

  app.all("{/*dummy}", (req, res) => {
    return res.status(404).json({ message: "In-valid app routing" });
  });

  return app.listen(port, () =>
    console.log(`Server is running on port ${port}🚀🚀!`)
  );
};

export default bootstrap;
