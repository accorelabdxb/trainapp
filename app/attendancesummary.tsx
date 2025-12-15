import Calendar from "@/components/common/Calender";
import { useGetAttendanceSummaryQuery } from "@/store/slices/attendanceApi";
import { useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import moment from "moment";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

const attendancesummary = () => {
  const router = useRouter();
  const endDate = moment().endOf("month").format("YYYY-MM-DD");
  const startDate = moment()
    .subtract(2, "months")
    .startOf("month")
    .format("YYYY-MM-DD");

  const { data: response, isLoading } = useGetAttendanceSummaryQuery({
    startDate,
    endDate,
  });

  const attendanceData: Record<string, boolean> = {};

  if (response?.history && Array.isArray(response.history)) {
    response.history.forEach(
      (entry: { checkInTime: string; Checkinstatus: number }) => {
        const dateStr = moment
          .utc(entry.checkInTime)
          .local()
          .format("YYYY-MM-DD");
        attendanceData[dateStr] = entry.Checkinstatus === 1;
      }
    );
  }

  const handleGoBack = () => {
    router.push("/(tabs)/dashboard");
  };

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
