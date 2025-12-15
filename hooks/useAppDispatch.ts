import type { AppDispatch } from "@/store";
import { useDispatch } from "react-redux";

// Typed version of useDispatch hook
export const useAppDispatch = () => useDispatch<AppDispatch>();
