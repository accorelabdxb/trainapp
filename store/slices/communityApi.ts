import { api, tagTypes } from "../api";
import { COMMUNITY_BASE_URL } from "../baseQuery";

export interface ServerPost {
  id: number;
  userId: number;
  content: string;
  fileFullpath: string;
  fileType: string;
  fileName: string;
  imageUploadedAt?: string;
  createdAt?: string;
  timeAgo?: string;
  creatorName?: string;
  reactionsSummary?: { heart: number; like: number; fire: number };
  userReaction?: "heart" | "like" | "fire" | null;
}

export interface CreatePostRequest {
  content: string;
  file: { uri: string; name: string; type: string };
}

export interface CreatePostResponse {
  success: boolean;
  post?: ServerPost;
}

export interface ReactionResponse {
  success: boolean;
  reactionsSummary?: { heart: number; like: number; fire: number };
  userReaction?: "heart" | "like" | "fire" | null;
}

// Community API slice
export const communityApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAllPosts: builder.query<ServerPost[], void>({
      query: () => ({
        url: "/api/v1/Community/posts",
        method: "GET",
        baseUrl: COMMUNITY_BASE_URL,
      }),
      providesTags: [tagTypes.Posts],
      keepUnusedDataFor: 60,
    }),

    getPostById: builder.query<ServerPost, number | string>({
      query: (postId) => ({
        url: `/api/v1/Community/posts/${postId}`,
        method: "GET",
        baseUrl: COMMUNITY_BASE_URL,
      }),
      providesTags: (result, error, postId) => [
        { type: tagTypes.Posts, id: postId },
      ],
    }),

    createPost: builder.mutation<CreatePostResponse, CreatePostRequest>({
      query: ({ content, file }) => {
        const formData = new FormData();
        formData.append("content", content);
        formData.append("file", {
          uri: file.uri,
          name: file.name,
          type: file.type,
        } as any);

        return {
          url: "/api/v1/Community/posts",
          method: "POST",
          body: formData,
          baseUrl: COMMUNITY_BASE_URL,
          // Don't set Content-Type header, let fetch handle it for FormData
        };
      },
      invalidatesTags: [tagTypes.Posts],
    }),

    addOrUpdateReaction: builder.mutation<
      ReactionResponse,
      { postId: number; reactionType: number }
    >({
      query: ({ postId, reactionType }) => ({
        url: `/api/v1/Community/posts/${postId}/react`,
        method: "POST",
        body: { reactionType },
        baseUrl: COMMUNITY_BASE_URL,
      }),
      // Optimistic update
      async onQueryStarted(
        { postId, reactionType },
        { dispatch, queryFulfilled }
      ) {
        // Optimistically update the cache
        const patchResult = dispatch(
          api.util.updateQueryData("getAllPosts", undefined, (draft) => {
            const post = draft.find((p) => p.id === postId);
            if (post) {
              const reactionMap: Record<number, "heart" | "like" | "fire"> = {
                1: "heart",
                2: "like",
                3: "fire",
              };
              const reactionName = reactionMap[reactionType];
              const currentReaction = post.userReaction;

              // Update reaction summary
              if (!post.reactionsSummary) {
                post.reactionsSummary = { heart: 0, like: 0, fire: 0 };
              }

              // Remove old reaction count
              if (currentReaction) {
                post.reactionsSummary[currentReaction] = Math.max(
                  0,
                  post.reactionsSummary[currentReaction] - 1
                );
              }

              // Add new reaction if different
              if (currentReaction !== reactionName) {
                post.userReaction = reactionName;
                post.reactionsSummary[reactionName] =
                  (post.reactionsSummary[reactionName] || 0) + 1;
              } else {
                // Toggle off if same reaction
                post.userReaction = null;
              }
            }
          })
        );

        try {
          await queryFulfilled;
        } catch {
          // Rollback on error
          patchResult.undo();
        }
      },
      invalidatesTags: (result, error, { postId }) => [
        { type: tagTypes.Posts, id: postId },
        tagTypes.Posts,
      ],
    }),

    removeReaction: builder.mutation<ReactionResponse, number>({
      query: (postId) => ({
        url: `/api/v1/Community/posts/${postId}/react`,
        method: "DELETE",
        baseUrl: COMMUNITY_BASE_URL,
      }),
      // Optimistic update
      async onQueryStarted(postId, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          api.util.updateQueryData("getAllPosts", undefined, (draft) => {
            const post = draft.find((p) => p.id === postId);
            if (post && post.userReaction && post.reactionsSummary) {
              post.reactionsSummary[post.userReaction] = Math.max(
                0,
                post.reactionsSummary[post.userReaction] - 1
              );
              post.userReaction = null;
            }
          })
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: (result, error, postId) => [
        { type: tagTypes.Posts, id: postId },
        tagTypes.Posts,
      ],
    }),
  }),
});

export const {
  useGetAllPostsQuery,
  useGetPostByIdQuery,
  useCreatePostMutation,
  useAddOrUpdateReactionMutation,
  useRemoveReactionMutation,
} = communityApi;
