// components/Calendar.tsx
import moment from "moment";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";

interface CalendarDay {
  date: number | null; // null for empty cells
  dateString: string | null;
  attended: boolean;
  isCurrentMonth: boolean;
}

interface MonthData {
  month: string;
  year: number;
  days: CalendarDay[];
}

interface CalendarProps {
  startDate: string;
  endDate: string;
  attendanceData: Record<string, boolean>; // ADD THIS LINE
  isLoading?: boolean; // ADD THIS LINE
}

const Calendar = ({
  startDate,
  endDate,
  attendanceData,
  isLoading,
}: CalendarProps) => {
  const generateMonthsData = (): MonthData[] => {
    const months: MonthData[] = [];

    let start = moment(startDate).startOf("month");
    let end = moment(endDate).endOf("month");

    let current = start.clone();

    while (current.isSameOrBefore(end, "month")) {
      const monthName = current.format("MMMM");
      const year = current.year();
      const daysInMonth = current.daysInMonth();
      const firstDayOfWeek = current.clone().startOf("month").weekday();

      const days: CalendarDay[] = [];

   
      for (
        let e = 0;
        e < (firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1);
        e++
      ) {
        days.push({
          date: null,
          dateString: null,
          attended: false,
          isCurrentMonth: false,
        });
      }

      // Add real days of the month
      for (let d = 1; d <= daysInMonth; d++) {
        const currentDay = current.clone().date(d);
        const dateString = currentDay.format("YYYY-MM-DD");

        // ADD THIS LINE INSTEAD:
        const attended = attendanceData[dateString] || false;

        days.push({
          date: d,
          dateString,
          attended,
          isCurrentMonth: true,
        });
      }

      // Ensure total days is multiple of 7
      while (days.length % 7 !== 0) {
        days.push({
          date: null,
          dateString: null,
          attended: false,
          isCurrentMonth: false,
        });
      }

      months.push({ month: monthName, year, days });

      current.add(1, "month");
    }

    return months;
  };

  const monthsData = generateMonthsData().reverse();

  const renderDay = (day: CalendarDay) => {
    if (!day.isCurrentMonth) {
      return (
        <View className="w-12 h-12 m-1 rounded-full flex items-center justify-center">
          <Text className="text-gray-600 text-sm"> </Text>
        </View>
      );
    }

    return (
      <View className="w-12 h-12 m-1">
        <TouchableOpacity
          className={`
            rounded-full w-12 h-12 flex items-center justify-center
            ${day.attended ? "bg-green-600" : "bg-input"}
          `}
        >
          <Text className="text-sm font-semibold text-white/80">
            {day.date}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderWeekDays = () => {
    const weekDays = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
    return (
      <View className="flex-row justify-around mb-4 px-2">
        {weekDays.map((day, index) => (
          <View key={index} className="w-12 items-center">
            <Text className="text-white text-sm font-semibold">{day}</Text>
          </View>
        ))}
      </View>
    );
  };
  if (isLoading) {
    return (
      <View className="flex items-center justify-center py-20">
        <ActivityIndicator size="large" color="#ffffff" />
        <Text className="text-white mt-4">Loading attendance data...</Text>
      </View>
    );
  }
  return (
    <View>
      {monthsData.map((item, idx) => {
        const weeks = [];
        for (let i = 0; i < item.days.length; i += 7) {
          weeks.push(item.days.slice(i, i + 7));
        }

        return (
          <View key={idx} className="mx-4 mb-8">
            <View className="bg-[#181818] p-6 rounded-2xl">
              <Text className="text-white text-2xl font-bold mb-4">
                {item.month} {item.year}
              </Text>
              {renderWeekDays()}
              <View className="mt-2">
                {weeks.map((week, weekIndex) => (
                  <View
                    key={weekIndex}
                    className="flex-row justify-around mb-2"
                  >
                    {week.map((day, dayIndex) => (
                      <View key={dayIndex}>{renderDay(day)}</View>
                    ))}
                  </View>
                ))}
              </View>
            </View>
          </View>
        );
      })}
    </View>
  );
};

export default Calendar;
