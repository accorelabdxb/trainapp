import { ScalePress, Skeleton } from "@/components/AnimatedComponents";
import { useToast } from "@/context/ToastContext";
import { CircleChevronRight } from "@/lib/icons/CircleChevronRight";
import { attendanceAPI } from "@/utils/api";
import { useRouter } from "expo-router";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface AttendanceSectionProps {
    userProfileExists: boolean;
    onCoinsUpdate: (coins: number) => void;
}

export const AttendanceSection = React.memo(({ userProfileExists, onCoinsUpdate }: AttendanceSectionProps) => {
    const router = useRouter();
    const { showToast } = useToast();
    const [attendance, setAttendance] = useState<Record<string, boolean>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [isCheckingIn, setIsCheckingIn] = useState(false);

    // Memoize days of week to prevent recalculation on every render
    const daysOfWeek = React.useMemo(() =>
        Array.from({ length: 7 }).map((_, i) =>
            moment().startOf("week").add(i, "day")
        ), []
    );

    useEffect(() => {
        if (!userProfileExists) return;

        const fetchAttendance = async () => {
            try {
                setIsLoading(true);

                const startDate = moment().startOf("week").format("YYYY-MM-DD");
                const endDate = moment().endOf("week").format("YYYY-MM-DD");

                const res = await attendanceAPI.getAttendanceSummary(
                    startDate,
                    endDate
                );
                const newCoinsEarned = res?.totalcoinsEarned || 0;
                onCoinsUpdate(newCoinsEarned);

                const mapped: Record<string, boolean> = {};

                const currentWeekDays = Array.from({ length: 7 }).map((_, i) =>
                    moment().startOf("week").add(i, "day").format("YYYY-MM-DD")
                );

                currentWeekDays.forEach((dateStr) => {
                    mapped[dateStr] = false;
                });

                if (res?.history && Array.isArray(res.history)) {
                    res.history.forEach(
                        (entry: { checkInTime: string; Checkinstatus: number }) => {
                            const dateStr = moment
                                .utc(entry.checkInTime)
                                .local()
                                .format("YYYY-MM-DD");

                            // Only mark as true if user actually checked in (status = 1)
                            if (entry.Checkinstatus === 1) {
                                mapped[dateStr] = true;
                            }
                        }
                    );
                }

                setAttendance(mapped);
            } catch (error) {
                console.error("Error fetching attendance:", error);
                showToast("Failed to fetch attendance data", "error");
            } finally {
                setIsLoading(false);
            }
        };

        fetchAttendance();
    }, [userProfileExists, onCoinsUpdate]);

    const handleCheckIn = async (dateStr: string) => {
        const todayStr = moment().format("YYYY-MM-DD");

        // only allow today's check-in
        if (dateStr !== todayStr) return;

        // Check if already checked in today
        if (attendance[todayStr] === true) {
            showToast("Already checked in today!", "info");
            return;
        }

        // Optimistic Update
        setAttendance((prev) => ({
            ...prev,
            [todayStr]: true,
        }));
        showToast("Great job! consistency check for today!", "success");

        try {
            setIsCheckingIn(true);
            await attendanceAPI.checkIn();
        } catch (err) {
            console.error("Error during check-in:", err);
            // Revert optimistic update
            setAttendance((prev) => ({
                ...prev,
                [todayStr]: false,
            }));
            showToast("Failed to check in. Please try again.", "error");
        } finally {
            setIsCheckingIn(false);
        }
    };

    const handleAttendanceSummaryPress = () => {
        router.push("/attendancesummary");
    };

    return (
        <View className="bg-secbg p-4 px-4 mt-8 mx-2 rounded-2xl">
            <View className="flex flex-row items-center justify-between mb-2">
                <Text className="text-white text-lg">
                    Consistency is Your Superpower! 💪
                </Text>
                <CircleChevronRight
                    onPress={handleAttendanceSummaryPress}
                    className="text-white/70"
                    size={18}
                    strokeWidth={1.5}
                />
            </View>

            {/* Loading state for attendance dates */}
            {isLoading ? (
                <View className="flex flex-row justify-between mt-2">
                    {Array.from({ length: 7 }).map((_, i) => (
                        <View key={i} className="flex items-center">
                            <Skeleton width={30} height={10} style={{ marginBottom: 4 }} />
                            <Skeleton width={48} height={48} borderRadius={24} />
                        </View>
                    ))}
                </View>
            ) : (
                <View className="flex flex-row items-center justify-between">
                    {daysOfWeek.map((day) => {
                        const dateStr = day.format("YYYY-MM-DD");
                        const todayStr = moment().format("YYYY-MM-DD");
                        const attended = attendance[dateStr] || false;
                        const isToday = dateStr === todayStr;

                        return (
                            <View
                                key={dateStr}
                                className="flex justify-center items-center mt-2"
                            >
                                <Text className="font-normal text-xs text-white mb-1">
                                    {day.format("ddd")}
                                </Text>
                                <TouchableOpacity
                                    className={`rounded-full w-12 h-12 border border-white/10 flex items-center justify-center ${attended ? "bg-green-600" : "bg-input"
                                        } ${isCheckingIn && isToday ? "opacity-70" : ""}`}
                                    onPress={() => {
                                        if (isToday && !isCheckingIn) {
                                            handleCheckIn(dateStr);
                                        } else if (!isToday) {
                                            // optional feedback for wrong day
                                        }
                                    }}
                                    // Disable if already checking in, or if it's not today
                                    disabled={isCheckingIn && isToday}
                                >
                                    <ScalePress
                                        scaleActive={0.9}
                                        style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}
                                        onPress={() => {
                                            if (isToday && !isCheckingIn) {
                                                handleCheckIn(dateStr);
                                            }
                                        }}
                                        disabled={!isToday}
                                    >
                                        <Text className="text-white/80 font-semibold text-sm">
                                            {day.format("D")}
                                        </Text>
                                    </ScalePress>
                                </TouchableOpacity>
                            </View>
                        );
                    })}
                </View>
            )}
        </View>
    );
});
