import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import api from '../services/api';
import { ArrowLeft, Star, MessageSquare, ThumbsUp, ThumbsDown } from 'lucide-react';

interface Feedback {
  id: string;
  overall_rating: number;
  content_rating: number;
  speaker_rating: number;
  organization_rating: number;
  comments: string;
  would_recommend: boolean;
  user: {
    full_name: string;
  };
  created_at: string;
}

const EventFeedback: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [eventTitle, setEventTitle] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    avgOverall: 0,
    avgContent: 0,
    avgSpeaker: 0,
    avgOrganization: 0,
    wouldRecommend: 0,
  });

  useEffect(() => {
    fetchFeedback();
  }, [id]);

  const fetchFeedback = async () => {
    try {
      const [eventRes, feedbackRes] = await Promise.all([
        api.get(`/events/${id}`),
        api.get(`/events/${id}/feedback`),
      ]);

      setEventTitle(eventRes.data.event.title);
      const feedbackData = feedbackRes.data.feedback || [];
      setFeedback(feedbackData);

      if (feedbackData.length > 0) {
        setStats({
          total: feedbackData.length,
          avgOverall: feedbackData.reduce((acc: number, f: Feedback) => acc + f.overall_rating, 0) / feedbackData.length,
          avgContent: feedbackData.reduce((acc: number, f: Feedback) => acc + f.content_rating, 0) / feedbackData.length,
          avgSpeaker: feedbackData.reduce((acc: number, f: Feedback) => acc + f.speaker_rating, 0) / feedbackData.length,
          avgOrganization: feedbackData.reduce((acc: number, f: Feedback) => acc + f.organization_rating, 0) / feedbackData.length,
          wouldRecommend: (feedbackData.filter((f: Feedback) => f.would_recommend).length / feedbackData.length) * 100,
        });
      }
    } catch (error) {
      console.error('Error fetching feedback:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
          />
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Button variant="ghost" className="mb-6" onClick={() => navigate('/dashboard')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Event Feedback</h1>
          <p className="text-gray-600 mt-2">{eventTitle}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Responses</CardDescription>
              <CardTitle className="text-3xl">{stats.total}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Avg Overall</CardDescription>
              <CardTitle className="text-3xl">{stats.avgOverall.toFixed(1)}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Content</CardDescription>
              <CardTitle className="text-3xl">{stats.avgContent.toFixed(1)}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Speaker</CardDescription>
              <CardTitle className="text-3xl">{stats.avgSpeaker.toFixed(1)}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Would Recommend</CardDescription>
              <CardTitle className="text-3xl">{stats.wouldRecommend.toFixed(0)}%</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Feedback List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Individual Responses</h2>
          {feedback.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No feedback received yet</p>
              </CardContent>
            </Card>
          ) : (
            feedback.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">{item.user?.full_name || 'Anonymous'}</p>
                      <p className="text-sm text-gray-500">{new Date(item.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {item.would_recommend ? (
                        <ThumbsUp className="h-5 w-5 text-green-500" />
                      ) : (
                        <ThumbsDown className="h-5 w-5 text-red-500" />
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    <div>
                      <p className="text-sm text-gray-500">Overall</p>
                      {renderStars(item.overall_rating)}
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Content</p>
                      {renderStars(item.content_rating)}
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Speaker</p>
                      {renderStars(item.speaker_rating)}
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Organization</p>
                      {renderStars(item.organization_rating)}
                    </div>
                  </div>

                  {item.comments && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">{item.comments}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default EventFeedback;
