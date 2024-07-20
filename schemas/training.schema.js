import { z } from "zod";

export const exerciseSchema = z.array(
  z.object({
    name: z.string(),
    sets: z.array(
      z.object({
        weight: z.number(),
        reps: z.number(),
      })
    ),
  })
);

export const trainingsSchema = z.object({
  duration: z.number(),
  exercises: exerciseSchema,
});

export function validateTraining(training) {
  return trainingsSchema.safeParse(training);
}

export function validatePartialTraining(training) {
  return trainingsSchema.partial().safeParse(training);
}
