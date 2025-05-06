// src\usecase\auth\dto\updPassword.usecase.dto.ts
import { UpdPasswordAuthResolverDto } from "@happykiller/sunny-apis";

export interface UpdPasswordAuthUsecaseDto extends UpdPasswordAuthResolverDto {
  user_id: string;
}
