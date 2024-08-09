import { z } from "zod";

import { exerciseEquipments, muscularGroups } from "../config.js";

export const createExerciseSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  equipment: z.enum(exerciseEquipments),
  muscle: z.enum(muscularGroups),
});

export function validateExerciseSchema(exercise) {
  return createExerciseSchema.safeParse(exercise);
}

export function validatePartialExerciseSchema(exercise) {
  return createExerciseSchema.partial().safeParse(exercise);
}
