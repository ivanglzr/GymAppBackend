import mongoose from "mongoose";

const UserModel = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  age: Number,
  weight: Number,
  height: Number,
  trainings: [
    {
      date: { type: Date, default: Date.now },
      duration: Number,
      exercises: [
        {
          name: { type: String, required: true },
          sets: [
            {
              weight: Number,
              reps: Number,
            },
          ],
        },
      ],
    },
  ],
});

export default mongoose.model("User", UserModel);
