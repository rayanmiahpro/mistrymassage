import { z } from "zod";

export const loginSchema = z.object({
    identifer: z.string(),
    password: z.string()
})