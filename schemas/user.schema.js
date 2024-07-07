import { z } from "zod";

const exerciseSchema = z.array(
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

const trainingsSchema = z.object({
  duration: z.number(),
  exercises: exerciseSchema,
});

const userSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
  age: z.number(),
  weight: z.number(),
  height: z.number(),
  trainings: z.array(trainingsSchema),
});

const loginFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const changeUserDataSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  age: z.number().optional(),
  weight: z.number().optional(),
  height: z.number().optional(),
});

export function validateUser(user) {
  return userSchema.safeParse(user);
}

export function validatePartialUser(user) {
  return userSchema.partial().safeParse(user);
}

export function validateTraining(training) {
  return trainingsSchema.safeParse(training);
}

export function validateLoginForm(loginForm) {
  return loginFormSchema.safeParse(loginForm);
}

export function validateChangeUserData(userData) {
  return changeUserDataSchema.safeParse(userData);
}
