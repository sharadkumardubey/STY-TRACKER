import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setUsers } from '@/store/slices/usersSlice';
import { addTopic } from '@/store/slices/topicsSlice';
import { usersAPI, topicsAPI } from '@/services/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, X } from 'lucide-react';

interface TopicField {
  id: string;
  title: string;
  url: string;
}

export const AdminTopics = () => {
  const [selectedUserId, setSelectedUserId] = useState('');
  const [topicFields, setTopicFields] = useState<TopicField[]>([
    { id: '1', title: '', url: '' },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useAppDispatch();
  const { users } = useAppSelector((state) => state.users);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await usersAPI.getAll();
      dispatch(setUsers(data));
    } catch (error) {
      console.error('Failed to load users:', error);
    }
  };

  const addTopicField = () => {
    setTopicFields([
      ...topicFields,
      { id: Date.now().toString(), title: '', url: '' },
    ]);
  };

  const removeTopicField = (id: string) => {
    if (topicFields.length > 1) {
      setTopicFields(topicFields.filter((field) => field.id !== id));
    }
  };

  const updateTopicField = (id: string, field: 'title' | 'url', value: string) => {
    setTopicFields(
      topicFields.map((topic) =>
        topic.id === id ? { ...topic, [field]: value } : topic
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedUserId) {
      alert('Please select a user');
      return;
    }

    const validTopics = topicFields.filter((t) => t.title && t.url);
    if (validTopics.length === 0) {
      alert('Please add at least one topic with title and URL');
      return;
    }

    try {
      setIsSubmitting(true);
      const newTopic = await topicsAPI.create({
        userId: selectedUserId,
        topics: validTopics.map((t) => ({
          id: t.id,
          title: t.title,
          url: t.url,
        })),
      });

      dispatch(addTopic(newTopic));

      // Reset form
      setSelectedUserId('');
      setTopicFields([{ id: Date.now().toString(), title: '', url: '' }]);
      alert('Topics added successfully!');
    } catch (error) {
      console.error('Failed to create topics:', error);
      alert('Failed to add topics');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Add Topics</h1>

      <Card>
        <CardHeader>
          <CardTitle>Create New Topics</CardTitle>
          <CardDescription>
            Add learning topics with URLs for users. URLs can contain MCQ or coding questions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="user">Select User</Label>
              <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a user" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name} ({user.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>Topics</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addTopicField}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Topic
                </Button>
              </div>

              {topicFields.map((field, index) => (
                <Card key={field.id} className="p-4">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1 space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor={`title-${field.id}`}>
                          Topic {index + 1} - Title
                        </Label>
                        <Input
                          id={`title-${field.id}`}
                          type="text"
                          placeholder="e.g., React Basics"
                          value={field.title}
                          onChange={(e) =>
                            updateTopicField(field.id, 'title', e.target.value)
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`url-${field.id}`}>
                          Topic {index + 1} - URL
                        </Label>
                        <Input
                          id={`url-${field.id}`}
                          type="url"
                          placeholder="https://example.com/quiz"
                          value={field.url}
                          onChange={(e) =>
                            updateTopicField(field.id, 'url', e.target.value)
                          }
                          required
                        />
                      </div>
                    </div>
                    {topicFields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeTopicField(field.id)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? 'Adding Topics...' : 'Submit Topics'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
