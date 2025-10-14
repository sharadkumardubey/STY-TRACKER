import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setResults, setLoading } from '@/store/slices/resultsSlice';
import { resultsAPI } from '@/services/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';

export const AdminResults = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const dispatch = useAppDispatch();
  const { results, loading } = useAppSelector((state) => state.results);

  useEffect(() => {
    loadResults();
  }, [selectedDate]);

  const loadResults = async () => {
    try {
      dispatch(setLoading(true));
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      const data = await resultsAPI.getByDate(dateStr);
      dispatch(setResults(data));
    } catch (error) {
      console.error('Failed to load results:', error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Results</h1>

      <div className="grid gap-6 md:grid-cols-[300px_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Select Date</CardTitle>
            <CardDescription>View results for a specific date</CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className="rounded-md border"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Results for {format(selectedDate, 'MMMM dd, yyyy')}</CardTitle>
            <CardDescription>
              {results.length} result{results.length !== 1 ? 's' : ''} found
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Loading...</div>
            ) : results.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No results found for this date
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Topic</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Completed At</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.map((result) => (
                    <TableRow key={result.id}>
                      <TableCell>{result.userName}</TableCell>
                      <TableCell>{result.topicTitle}</TableCell>
                      <TableCell>
                        <span
                          className={`font-semibold ${
                            result.score >= 80
                              ? 'text-green-600'
                              : result.score >= 60
                              ? 'text-yellow-600'
                              : 'text-red-600'
                          }`}
                        >
                          {result.score}%
                        </span>
                      </TableCell>
                      <TableCell>{new Date(result.completedAt).toLocaleTimeString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
