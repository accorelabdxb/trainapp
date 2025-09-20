import { useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import {
  FlatList,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import moment from "moment";
import Calendar from "@/components/common/Calender";
import { useEffect, useState } from "react";
import { attendanceAPI } from "@/utils/api";

const attendancesummary = () => {
  const [attendanceData, setAttendanceData] = useState<Record<string, boolean>>(
    {}
  );
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const handleGoBack = () => {
    router.push("/dashboard");
  };


  const endDate = moment().endOf("month").format("YYYY-MM-DD"); 
  const startDate = moment()
    .subtract(2, "months")
    .startOf("month")
    .format("YYYY-MM-DD"); // 2 months before
  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        setIsLoading(true);

        const response = await attendanceAPI.getAttendanceSummary(
          startDate,
          endDate
        );

        const attendanceMap: Record<string, boolean> = {};

        if (response?.history && Array.isArray(response.history)) {
          response.history.forEach(
            (entry: { checkInTime: string; Checkinstatus: number }) => {
              const dateStr = moment
                .utc(entry.checkInTime)
                .local()
                .format("YYYY-MM-DD");
              attendanceMap[dateStr] = entry.Checkinstatus === 1;
            }
          );
        }

        setAttendanceData(attendanceMap);
      } catch (error) {
        console.error("Error fetching attendance:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAttendanceData();
  }, [startDate, endDate]);

  return (
    <View className="flex-1 bg-black">
      <View className="pt-[60px] pb-[14px] px-4 flex flex-row items-center justify-between">
        <TouchableOpacity
          onPress={handleGoBack}
          className="w-11 h-11 bg-white rounded-full border-2 border-black flex justify-center items-center"
          activeOpacity={0.7}
        >
          <ChevronLeft size={24} color="#000" />
        </TouchableOpacity>

        <Text
          className="text-white font-bold text-lg leading-6 capitalize text-center flex-1"
          numberOfLines={1}
        >
          Attendance
        </Text>

        <View className="w-[44px]" />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 20, paddingBottom: 40 }}
      >
        <Calendar
          startDate={startDate}
          endDate={endDate}
          attendanceData={attendanceData}
          isLoading={isLoading}
        />
      </ScrollView>
    </View>
  );
};

export default attendancesummary;
