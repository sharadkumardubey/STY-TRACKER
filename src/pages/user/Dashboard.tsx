import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setTopics, setUserProgress, updateTopicProgress } from '@/store/slices/topicsSlice';
import { topicsAPI } from '@/services/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Circle } from 'lucide-react';
import { TopicItem } from '@/store/slices/topicsSlice';

export const UserDashboard = () => {
  const [selectedTopic, setSelectedTopic] = useState<TopicItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { topics, userProgress } = useAppSelector((state) => state.topics);

  useEffect(() => {
    if (user) {
      loadTopics();
      loadProgress();
    }
  }, [user]);

  const loadTopics = async () => {
    if (!user) return;
    try {
      const data = await topicsAPI.getByUserId(user.id);
      dispatch(setTopics(data));
    } catch (error) {
      console.error('Failed to load topics:', error);
    }
  };

  const loadProgress = async () => {
    if (!user) return;
    try {
      const data = await topicsAPI.getUserProgress(user.id);
      dispatch(setUserProgress(data));
    } catch (error) {
      console.error('Failed to load progress:', error);
    }
  };

  const isTopicCompleted = (topicId: string, topicItemId: string) => {
    return userProgress.some(
      (p) => p.topicId === topicId && p.topicItemId === topicItemId && p.completed
    );
  };

  const handleTopicClick = (topicItem: TopicItem, topicId: string) => {
    setSelectedTopic({ ...topicItem, topicId } as any);
    setIsDialogOpen(true);
  };

  const handleMarkComplete = async () => {
    if (!selectedTopic || !user) return;

    try {
      const progress = {
        topicId: (selectedTopic as any).topicId,
        topicItemId: selectedTopic.id,
        completed: true,
        completedAt: new Date().toISOString(),
      };

      await topicsAPI.updateProgress(progress);
      dispatch(updateTopicProgress(progress));
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Failed to update progress:', error);
      alert('Failed to mark as complete');
    }
  };

  const allTopicItems = topics.flatMap((topic) =>
    topic.topics.map((item) => ({
      ...item,
      topicId: topic.id,
    }))
  );

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">My Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Topics</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{allTopicItems.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">
              {userProgress.filter((p) => p.completed).length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Remaining</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-orange-600">
              {allTopicItems.length - userProgress.filter((p) => p.completed).length}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>My Topics</CardTitle>
          <CardDescription>Click on a topic to view details</CardDescription>
        </CardHeader>
        <CardContent>
          {allTopicItems.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No topics assigned yet
            </div>
          ) : (
            <div className="space-y-2">
              {allTopicItems.map((item) => {
                const completed = isTopicCompleted(item.topicId, item.id);
                return (
                  <button
                    key={`${item.topicId}-${item.id}`}
                    onClick={() => handleTopicClick(item, item.topicId)}
                    className="w-full flex items-center gap-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors text-left"
                  >
                    {completed ? (
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                    ) : (
                      <Circle className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <p className="font-medium">{item.title}</p>
                      <p className="text-sm text-gray-500">{item.url}</p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded text-xs font-medium ${
                        completed
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {completed ? 'Completed' : 'Pending'}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedTopic?.title}</DialogTitle>
            <DialogDescription>Topic Details</DialogDescription>
          </DialogHeader>
          {selectedTopic && (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">URL</p>
                <a
                  href={selectedTopic.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {selectedTopic.url}
                </a>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Status</p>
                <p className="font-medium">
                  {isTopicCompleted((selectedTopic as any).topicId, selectedTopic.id)
                    ? 'Completed ✓'
                    : 'Not Completed'}
                </p>
              </div>
              {!isTopicCompleted((selectedTopic as any).topicId, selectedTopic.id) && (
                <div className="pt-4">
                  <p className="text-sm text-gray-500 mb-3">
                    Mark this topic as completed when you finish the assignment
                  </p>
                  <Button onClick={handleMarkComplete} className="w-full">
                    Mark as Completed
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
