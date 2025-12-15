import { challengesApi } from "@/store/slices/challengesApi";
import { communityApi } from "@/store/slices/communityApi";
import { useEffect } from "react";
import { useAppDispatch } from "./useAppDispatch";

/**
 * Hook to prefetch data for adjacent tabs when a tab becomes focused
 * This improves perceived performance by loading data before users navigate
 */
export function usePrefetchOnFocus() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Prefetch adjacent tab data when component mounts
    // This happens in the background and doesn't block the UI

    // Prefetch social posts
    const postsPromise = dispatch(
      communityApi.endpoints.getAllPosts.initiate(undefined, {
        forceRefetch: false,
      })
    );

    // Prefetch challenges
    const allChallengesPromise = dispatch(
      challengesApi.endpoints.getAllChallenges.initiate(undefined, {
        forceRefetch: false,
      })
    );
    const activeChallengesPromise = dispatch(
      challengesApi.endpoints.getActiveChallenges.initiate(undefined, {
        forceRefetch: false,
      })
    );
    const upcomingChallengesPromise = dispatch(
      challengesApi.endpoints.getUpcomingChallenges.initiate(undefined, {
        forceRefetch: false,
      })
    );
    const myChallengesPromise = dispatch(
      challengesApi.endpoints.getMyChallenges.initiate(undefined, {
        forceRefetch: false,
      })
    );

    return () => {
      // Cleanup: abort prefetch requests if component unmounts
      postsPromise.abort();
      allChallengesPromise.abort();
      activeChallengesPromise.abort();
      upcomingChallengesPromise.abort();
      myChallengesPromise.abort();
    };
  }, [dispatch]);
}

/**
 * Hook to prefetch specific data
 */
export function usePrefetch<T>(
  endpoint: any,
  arg: T,
  options?: { forceRefetch?: boolean }
) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const promise = dispatch(
      endpoint.initiate(arg, { forceRefetch: options?.forceRefetch ?? false })
    );

    return () => {
      promise.abort();
    };
  }, [dispatch, endpoint, arg, options?.forceRefetch]);
}
