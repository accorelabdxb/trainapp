import { api, tagTypes } from "../api";
import { CHALLENGES_BASE_URL } from "../baseQuery";

export interface RewardPartner {
  name: string;
  address: string;
  contact: string;
  logo: string;
}

export interface Challenge {
  id: number;
  challengeId?: number;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  attachmentUrl: string | null;
  prizeDetails?: string;
  rules?: string;
  rewardPartnerLogo?: string | null;
  rewardPartner?: RewardPartner;
  isUserParticipating?: boolean;
  isJoined?: boolean;
  maxParticipants?: number;
  currentParticipants?: number;
}

export interface JoinChallengeResponse {
  success: boolean;
  message?: string;
}

// Challenges API slice
export const challengesApi = api.injectEndpoints({
  overrideExisting: true,
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
