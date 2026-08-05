import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .max(255)
    .pipe(z.email("ელფოსტა არასწორია")),
  password: z.string().min(1, "პაროლი აუცილებელია"),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "მიმდინარე პაროლი აუცილებელია"),
    newPassword: z
      .string()
      .min(10, "ახალი პაროლი უნდა იყოს მინიმუმ 10 სიმბოლო")
      .max(128, "პაროლი ძალიან გრძელია"),
    confirmPassword: z.string().min(1, "გაიმეორეთ ახალი პაროლი"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "პაროლები არ ემთხვევა",
    path: ["confirmPassword"],
  })
  .refine((data) => data.newPassword !== data.currentPassword, {
    message: "ახალი პაროლი უნდა განსხვავდებოდეს მიმდინარესგან",
    path: ["newPassword"],
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
