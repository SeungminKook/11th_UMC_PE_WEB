import { apiClient } from "../api-client";
import { authApi } from "../auth-api";
import type { ApiResponse } from "../models";

export interface Rating {
  ratingId: number;
  movieId: number;
  score: number;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface RatingInput {
  score: number;
  comment: string;
}

export function getMemberRatings(memberId: number) {
  return apiClient.get(`members/${memberId}/ratings`).json<Rating[]>();
}

export async function createRating(body: RatingInput & { movieId: number }) {
  const response = await authApi.post("ratings", { json: body }).json<ApiResponse<Rating>>();
  return response.result;
}

export async function updateRating(ratingId: number, body: RatingInput) {
  const response = await authApi.patch(`ratings/${ratingId}`, { json: body })
    .json<ApiResponse<Rating>>();
  return response.result;
}

export function deleteRating(ratingId: number) {
  return authApi.delete(`ratings/${ratingId}`).json<ApiResponse<null>>();
}
