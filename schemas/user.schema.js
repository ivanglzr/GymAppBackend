import { z } from "zod";

const exerciseSchema = z.array(
  z.object({
    name: z.string(),
    sets: z.array(
      z.object({
        weight: Number,
        reps: Number,
      })
    ),
  })
);

const trainingsSchema = z.array(
  z.object({
    duration: z.number(),
    exercises: exerciseSchema,
  })
);

const userSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  age: z.number(),
  weight: z.number(),
  height: z.number(),
  trainings: trainingsSchema,
});

export function validateUser(user) {
  return userSchema.safeParse(user);
}

export function validateTraining(training) {
  return trainingsSchema.safeParse(training);
}
