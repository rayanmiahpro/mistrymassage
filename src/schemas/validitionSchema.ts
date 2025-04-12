import { z } from "zod";

export const validationSchema = z.object({
  varificationCode: z.string().length(6, "Varification code must be 6 digits"),
});
