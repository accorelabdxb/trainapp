import { api, tagTypes } from "../api";
import { CHALLENGES_BASE_URL } from "../baseQuery";

export interface Challenge {
  id: number;
  challengeId?: number;
  title: string;
  startDate: string;
  endDate: string;
  attachmentUrl: string | null;
  isUserParticipating?: boolean;
}

export interface JoinChallengeResponse {
  success: boolean;
  message?: string;
}

// Challenges API slice
export const challengesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getUpcomingChallenges: builder.query<Challenge[], void>({
      query: () => ({
        url: "/api/v1/challenges/upcoming",
        method: "GET",
        baseUrl: CHALLENGES_BASE_URL,
      }),
      providesTags: [tagTypes.Challenges],
      keepUnusedDataFor: 300,
    }),

    getActiveChallenges: builder.query<Challenge[], void>({
      query: () => ({
        url: "/api/v1/challenges/active",
        method: "GET",
        baseUrl: CHALLENGES_BASE_URL,
      }),
      providesTags: [tagTypes.Challenges],
      keepUnusedDataFor: 300,
    }),

    getMyChallenges: builder.query<Challenge[], void>({
      query: () => ({
        url: "/api/v1/Challenges/users/me/challenges",
        method: "GET",
        baseUrl: CHALLENGES_BASE_URL,
      }),
      providesTags: [tagTypes.Challenges],
      keepUnusedDataFor: 300,
    }),

    getAllChallenges: builder.query<Challenge[], void>({
      query: () => ({
        url: "/api/v1/Challenges",
        method: "GET",
        baseUrl: CHALLENGES_BASE_URL,
      }),
      providesTags: [tagTypes.Challenges],
      keepUnusedDataFor: 300,
    }),

    getChallengeDetails: builder.query<Challenge, string | number>({
      query: (challengeId) => ({
        url: `/api/v1/Challenges/${challengeId}`,
        method: "GET",
        baseUrl: CHALLENGES_BASE_URL,
      }),
      providesTags: (result, error, challengeId) => [
        { type: tagTypes.Challenges, id: challengeId },
      ],
    }),

    joinChallenge: builder.mutation<JoinChallengeResponse, string | number>({
      query: (challengeId) => ({
        url: `/api/v1/Challenges/${challengeId}/join`,
        method: "POST",
        baseUrl: CHALLENGES_BASE_URL,
      }),
      // Optimistic update
      async onQueryStarted(challengeId, { dispatch, queryFulfilled }) {
        // Optimistically update all challenge lists
        const patchResults: any[] = [];

        // Update getAllChallenges
        const allChallengesPatch = dispatch(
          api.util.updateQueryData("getAllChallenges", undefined, (draft) => {
            const challenge = draft.find((c) => c.id === Number(challengeId));
            if (challenge) {
              challenge.isUserParticipating = true;
            }
          })
        );
        patchResults.push(allChallengesPatch);

        // Update getActiveChallenges
        const activeChallengesPatch = dispatch(
          api.util.updateQueryData(
            "getActiveChallenges",
            undefined,
            (draft) => {
              const challenge = draft.find((c) => c.id === Number(challengeId));
              if (challenge) {
                challenge.isUserParticipating = true;
              }
            }
          )
        );
        patchResults.push(activeChallengesPatch);

        // Update getUpcomingChallenges
        const upcomingChallengesPatch = dispatch(
          api.util.updateQueryData(
            "getUpcomingChallenges",
            undefined,
            (draft) => {
              const challenge = draft.find((c) => c.id === Number(challengeId));
              if (challenge) {
                challenge.isUserParticipating = true;
              }
            }
          )
        );
        patchResults.push(upcomingChallengesPatch);

        try {
          await queryFulfilled;
          // Invalidate to refetch fresh data
          dispatch(api.util.invalidateTags([tagTypes.Challenges]));
        } catch {
          // Rollback on error
          patchResults.forEach((patch) => patch.undo());
        }
      },
      invalidatesTags: [tagTypes.Challenges, tagTypes.Dashboard],
    }),
  }),
});

export const {
  useGetUpcomingChallengesQuery,
  useGetActiveChallengesQuery,
  useGetMyChallengesQuery,
  useGetAllChallengesQuery,
  useGetChallengeDetailsQuery,
  useJoinChallengeMutation,
} = challengesApi;
