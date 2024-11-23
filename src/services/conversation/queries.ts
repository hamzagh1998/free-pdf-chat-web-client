import {
  useMutation,
  UseMutationResult,
  useQuery,
  UseQueryResult,
} from "@tanstack/react-query";

import { createNewConversation, getConversation } from "./api";

import { CreateConversationPayload } from "./types";

export function useGetConversation(id?: string): UseQueryResult<any, Error> {
  return useQuery({
    queryKey: ["getConversation", id],
    queryFn: async ({ queryKey }) => {
      const [, conversationId] = queryKey;
      if (!conversationId) {
        throw new Error("Conversation ID is required");
      }
      try {
        return await getConversation(conversationId);
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    enabled: !!id,
  });
}

export function useCreateConversation(): UseMutationResult<
  void,
  Error,
  CreateConversationPayload,
  unknown
> {
  return useMutation({
    mutationKey: ["createConversation"],
    mutationFn: async (payload: CreateConversationPayload) => {
      try {
        await createNewConversation(payload);
      } catch (error) {
        console.error("Mutation error:", error);
        throw error;
      }
    },
  });
}
