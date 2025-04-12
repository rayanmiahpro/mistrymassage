import { z } from "zod";

export const massageSchema = z.object({
    content: z.string().min(10, "Please enter a message at least 10 characters").max(300, "Message must be less than 300 characters")
    
    
})