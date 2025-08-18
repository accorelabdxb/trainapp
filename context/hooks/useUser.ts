import { useCallback } from "react";
import { useAppContext } from "../AppContext";

export const useUser = () => {
  const { state, dispatch } = useAppContext();

  const updatePoints = useCallback(
    (newPoints: number) => {
      dispatch({ type: "UPDATE_POINTS", payload: newPoints });
    },
    [dispatch]
  );

  const redeemPoints = useCallback(
    (pointsToRedeem: number) => {
      if (state.user && state.user.points >= pointsToRedeem) {
        const newPoints = state.user.points - pointsToRedeem;
        dispatch({ type: "UPDATE_POINTS", payload: newPoints });
        return true;
      }
      return false;
    },
    [state.user, dispatch]
  );

  const addPoints = useCallback(
    (pointsToAdd: number) => {
      if (state.user) {
        const newPoints = state.user.points + pointsToAdd;
        dispatch({ type: "UPDATE_POINTS", payload: newPoints });
      }
    },
    [state.user, dispatch]
  );

  return {
    user: state.user,
    updatePoints,
    redeemPoints,
    addPoints,
  };
};
