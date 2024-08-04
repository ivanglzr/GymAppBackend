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

export const trainingSchema = z.object({
  duration: z.number(),
  date: z.string().optional(),
  exercises: exerciseSchema,
});

export function validateTraining(training) {
  return trainingSchema.safeParse(training);
}

export function validatePartialTraining(training) {
  return trainingSchema.partial().safeParse(training);
}
