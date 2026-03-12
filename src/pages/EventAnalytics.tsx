import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import api from '../services/api';
import { ArrowLeft, Users, Ticket, MessageSquare, BarChart3, Calendar } from 'lucide-react';

interface Analytics {
  total_registrations: number;
  total_attendees: number;
  attendance_rate: number;
  session_analytics: Array<{
    session_id: string;
    session_title: string;
    attendees_count: number;
    avg_watch_time: number;
    poll_participation: number;
    qa_submissions: number;
  }>;
  engagement_metrics: {
    total_poll_votes: number;
    total_questions: number;
    total_chat_messages: number;
    avg_session_rating: number;
  };
  demographics: {
    countries: Record<string, number>;
    industries: Record<string, number>;
    job_titles: Record<string, number>;
  };
}

const EventAnalytics: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [eventTitle, setEventTitle] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [id]);

  const fetchAnalytics = async () => {
    try {
      const [eventRes, analyticsRes] = await Promise.all([
        api.get(`/events/${id}`),
        api.get(`/events/${id}/analytics`),
      ]);

      setEventTitle(eventRes.data.event.title);
      setAnalytics(analyticsRes.data.analytics);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setIsLoading(false);
    }
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
          <h1 className="text-3xl font-bold text-gray-900">Event Analytics</h1>
          <p className="text-gray-600 mt-2">{eventTitle}</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardDescription>Total Registrations</CardDescription>
              <Ticket className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics?.total_registrations || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardDescription>Total Attendees</CardDescription>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics?.total_attendees || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardDescription>Attendance Rate</CardDescription>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics?.attendance_rate?.toFixed(1) || 0}%</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardDescription>Avg Session Rating</CardDescription>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics?.engagement_metrics?.avg_session_rating?.toFixed(1) || 0}/5</div>
            </CardContent>
          </Card>
        </div>

        {/* Engagement Metrics */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Engagement Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <BarChart3 className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Poll Votes</p>
                  <p className="text-xl font-semibold">{analytics?.engagement_metrics?.total_poll_votes || 0}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <MessageSquare className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Q&A Questions</p>
                  <p className="text-xl font-semibold">{analytics?.engagement_metrics?.total_questions || 0}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Chat Messages</p>
                  <p className="text-xl font-semibold">{analytics?.engagement_metrics?.total_chat_messages || 0}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Session Analytics */}
        <Card>
          <CardHeader>
            <CardTitle>Session Performance</CardTitle>
          </CardHeader>
          <CardContent>
            {analytics?.session_analytics?.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No session data available</p>
            ) : (
              <div className="space-y-4">
                {analytics?.session_analytics?.map((session) => (
                  <div key={session.session_id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-900">{session.session_title}</h3>
                      <span className="text-sm text-gray-500">{session.attendees_count} attendees</span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Avg Watch Time:</span>
                        <span className="ml-1 font-medium">{Math.round(session.avg_watch_time)} min</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Poll Participation:</span>
                        <span className="ml-1 font-medium">{session.poll_participation}%</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Q&A Submissions:</span>
                        <span className="ml-1 font-medium">{session.qa_submissions}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EventAnalytics;
