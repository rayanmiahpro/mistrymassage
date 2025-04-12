import { Massage } from "@/models/User";

export interface ApiResponce {
  success: boolean;
  message: string;
  isMassageAllowed?: boolean;
  Massages?: Massage[];
}
