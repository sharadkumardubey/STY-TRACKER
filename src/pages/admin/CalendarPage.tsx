import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ProgressCalendar } from '@/components/ProgressCalendar';
import { calendarAPI, DailyProgress } from '@/services/api';
import { format } from 'date-fns';

export const AdminCalendar = () => {
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [progressData, setProgressData] = useState<DailyProgress[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentMonth] = useState(new Date());

  useEffect(() => {
    loadProgressData();
  }, [currentMonth]);

  const loadProgressData = async () => {
    try {
      setLoading(true);
      const year = currentMonth.getFullYear();
      const month = currentMonth.getMonth();
      const data = await calendarAPI.getMonthProgress(year, month);
      setProgressData(data);
    } catch (error) {
      console.error('Failed to load progress data:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectedDayData = progressData.filter(p => p.date === selectedDate);

  return (
    <div className="space-y-4 sm:space-y-6">
      <h1 className="text-2xl sm:text-3xl font-bold">Progress Calendar</h1>

      <Card>
        <CardHeader>
          <CardTitle>User Progress Tracking</CardTitle>
          <CardDescription>
            View daily completion progress for all users. Colors indicate completion percentage.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : (
            <ProgressCalendar
              progressData={progressData}
              selectedDate={selectedDate}
              onDateSelect={setSelectedDate}
            />
          )}
        </CardContent>
      </Card>

      {selectedDayData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Details for {format(new Date(selectedDate), 'MMMM dd, yyyy')}</CardTitle>
            <CardDescription>User progress breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {selectedDayData.map((data) => (
                <div
                  key={data.userId}
                  className="flex items-center justify-between p-3 sm:p-4 border rounded-lg"
                >
                  <div className="flex-1">
                    <p className="font-medium text-sm sm:text-base">{data.userName}</p>
                    <p className="text-xs sm:text-sm text-gray-500">
                      {data.completedTopics} of {data.totalTopics} topics completed
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-24 sm:w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          data.completionPercentage === 100
                            ? 'bg-green-500'
                            : data.completionPercentage >= 75
                            ? 'bg-lime-500'
                            : data.completionPercentage >= 50
                            ? 'bg-yellow-500'
                            : data.completionPercentage >= 25
                            ? 'bg-orange-500'
                            : 'bg-red-500'
                        }`}
                        style={{ width: `${data.completionPercentage}%` }}
                      />
                    </div>
                    <span className="text-sm sm:text-base font-semibold w-12 text-right">
                      {data.completionPercentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
