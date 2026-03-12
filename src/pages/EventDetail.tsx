import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  Calendar, Clock, MapPin, Users, ArrowLeft, Bookmark, BookmarkCheck, 
  Play, Video, MessageSquare, BarChart3, Edit, Mic2, CheckCircle, Bell
} from 'lucide-react';

interface Speaker {
  id: string;
  full_name: string;
  bio: string;
  avatar_url: string;
  title: string;
  company: string;
}

interface Session {
  id: string;
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  session_type: string;
  speaker: Speaker;
  is_bookmarked: boolean;
}

interface Event {
  id: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  location_type: string;
  meeting_link: string;
  address: string;
  max_attendees: number;
  status: string;
  banner_image?: string;
  organizer: {
    full_name: string;
  };
}

const EventDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [event, setEvent] = useState<Event | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isRegistering, setIsRegistering] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [registrationError, setRegistrationError] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'schedule' | 'speakers'>('overview');

  useEffect(() => {
    fetchEventData();
  }, [id]);

  const fetchEventData = async () => {
    try {
      const [eventRes, sessionsRes, registrationRes] = await Promise.all([
        api.get(`/events/${id}`),
        api.get(`/events/${id}/sessions`),
        api.get('/registrations/my-registrations'),
      ]);

      setEvent(eventRes.data.event);
      setSessions(sessionsRes.data.sessions || []);
      
      const registered = registrationRes.data.registrations?.some(
        (r: any) => r.event_id === id
      );
      setIsRegistered(registered);
    } catch (error) {
      console.error('Error fetching event:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleBookmark = async (sessionId: string) => {
    try {
      const session = sessions.find(s => s.id === sessionId);
      if (session?.is_bookmarked) {
        await api.delete(`/events/${id}/sessions/${sessionId}/bookmark`);
      } else {
        await api.post(`/events/${id}/sessions/${sessionId}/bookmark`);
      }
      setSessions(sessions.map(s => 
        s.id === sessionId ? { ...s, is_bookmarked: !s.is_bookmarked } : s
      ));
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    }
  };

  const handleRegister = async () => {
    setIsRegistering(true);
    setRegistrationError('');
    try {
      await api.post('/registrations', { event_id: id, ticket_type_id: null });
      setIsRegistered(true);
      setRegistrationSuccess(true);
      // Show success notification
      setTimeout(() => setRegistrationSuccess(false), 5000);
    } catch (err: any) {
      console.error('Error registering:', err);
      setRegistrationError(err.response?.data?.message || 'Failed to register for this event');
    } finally {
      setIsRegistering(false);
    }
  };

  const isEventLive = () => {
    if (!event) return false;
    const now = new Date();
    const start = new Date(event.start_date);
    const end = new Date(event.end_date);
    return now >= start && now <= end && event.status === 'ongoing';
  };

  const isOrganizer = () => {
    return event?.organizer?.full_name === user?.full_name;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Event not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Event Banner */}
      <div className="relative h-64 md:h-96 bg-gradient-to-r from-blue-600 to-purple-600">
        {event.banner_image ? (
          <img 
            src={event.banner_image} 
            alt={event.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <div className="max-w-6xl mx-auto">
            <Button 
              variant="ghost" 
              className="mb-4 text-white hover:text-white hover:bg-white/20"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <Badge className="mb-2 bg-white/20 text-white border-0">
              {event.status.toUpperCase()}
            </Badge>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{event.title}</h1>
            <p className="text-white/80">Organized by {event.organizer.full_name}</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Registration Success Notification */}
        {registrationSuccess && (
          <div className="mb-6 p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/50 rounded-lg flex items-center space-x-3 animate-in fade-in slide-in-from-top-2">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-green-400">Registration Successful!</h3>
              <p className="text-green-300 text-sm">You have been registered for this event. Check your email for confirmation.</p>
            </div>
          </div>
        )}

        {/* Registration Error */}
        {registrationError && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400">
            {registrationError}
          </div>
        )}

        {/* Action Bar */}
        <div className="flex flex-wrap gap-3 mb-6">
          {isEventLive() && isRegistered && (
            <Link to={`/events/${id}/live`}>
              <Button className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 animate-pulse">
                <Play className="h-4 w-4 mr-2" />
                Join Live Event
              </Button>
            </Link>
          )}
          
          {!isRegistered ? (
            <Button 
              onClick={handleRegister} 
              disabled={isRegistering}
              className="bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-700 hover:to-cyan-700"
            >
              {isRegistering ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Registering...
                </>
              ) : (
                <>
                  <Bell className="h-4 w-4 mr-2" />
                  Register Now
                </>
              )}
            </Button>
          ) : (
            <div className="flex items-center space-x-2 bg-green-500/20 text-green-400 px-4 py-2 rounded-lg border border-green-500/50">
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">Registered</span>
            </div>
          )}

          {isOrganizer() && (
            <>
              <Link to={`/events/${id}/edit`}>
                <Button variant="outline">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Event
                </Button>
              </Link>
              <Link to={`/events/${id}/analytics`}>
                <Button variant="outline">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Analytics
                </Button>
              </Link>
              <Link to={`/events/${id}/feedback`}>
                <Button variant="outline">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Feedback
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-white rounded-lg p-1 mb-6 shadow-sm">
          {['overview', 'schedule', 'speakers'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium capitalize transition-colors ${
                activeTab === tab 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {activeTab === 'overview' && (
              <Card>
                <CardHeader>
                  <CardTitle>About This Event</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 whitespace-pre-wrap">{event.description}</p>
                  
                  <div className="mt-6 space-y-4">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="h-5 w-5 mr-3 text-blue-600" />
                      <div>
                        <p className="font-medium">Date & Time</p>
                        <p className="text-sm">
                          {new Date(event.start_date).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                        <p className="text-sm">
                          {new Date(event.start_date).toLocaleTimeString()} - {new Date(event.end_date).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-5 w-5 mr-3 text-blue-600" />
                      <div>
                        <p className="font-medium">Location</p>
                        <p className="text-sm capitalize">{event.location_type.replace('_', ' ')}</p>
                        {event.meeting_link && (
                          <a href={event.meeting_link} className="text-sm text-blue-600 hover:underline">
                            Join Link
                          </a>
                        )}
                        {event.address && <p className="text-sm">{event.address}</p>}
                      </div>
                    </div>

                    <div className="flex items-center text-gray-600">
                      <Users className="h-5 w-5 mr-3 text-blue-600" />
                      <div>
                        <p className="font-medium">Capacity</p>
                        <p className="text-sm">
                          {event.max_attendees ? `${event.max_attendees} attendees max` : 'Unlimited'}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'schedule' && (
              <div className="space-y-4">
                {sessions.length === 0 ? (
                  <Card>
                    <CardContent className="py-8 text-center">
                      <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No sessions scheduled yet</p>
                    </CardContent>
                  </Card>
                ) : (
                  sessions.map((session) => (
                    <Card key={session.id} className="relative">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <Badge variant="outline">{session.session_type}</Badge>
                              <span className="text-sm text-gray-500">
                                {new Date(session.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                                {new Date(session.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <h3 className="text-lg font-semibold mb-2">{session.title}</h3>
                            <p className="text-gray-600 text-sm mb-3">{session.description}</p>
                            {session.speaker && (
                              <div className="flex items-center space-x-2">
                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                  <Mic2 className="h-4 w-4 text-blue-600" />
                                </div>
                                <div>
                                  <p className="text-sm font-medium">{session.speaker.full_name}</p>
                                  <p className="text-xs text-gray-500">{session.speaker.title} at {session.speaker.company}</p>
                                </div>
                              </div>
                            )}
                          </div>
                          {isRegistered && (
                            <button
                              onClick={() => toggleBookmark(session.id)}
                              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                              {session.is_bookmarked ? (
                                <BookmarkCheck className="h-5 w-5 text-blue-600" />
                              ) : (
                                <Bookmark className="h-5 w-5 text-gray-400" />
                              )}
                            </button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            )}

            {activeTab === 'speakers' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[...new Map(sessions.filter(s => s.speaker).map(s => [s.speaker.id, s.speaker])).values()].map((speaker: Speaker) => (
                  <Card key={speaker.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xl font-bold">
                          {speaker.full_name.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{speaker.full_name}</h3>
                          <p className="text-blue-600 text-sm">{speaker.title}</p>
                          <p className="text-gray-500 text-sm">{speaker.company}</p>
                          <p className="text-gray-600 text-sm mt-2 line-clamp-3">{speaker.bio}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {sessions.filter(s => s.speaker).length === 0 && (
                  <Card className="col-span-2">
                    <CardContent className="py-8 text-center">
                      <Mic2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No speakers added yet</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {isRegistered && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Your Schedule</CardTitle>
                </CardHeader>
                <CardContent>
                  {sessions.filter(s => s.is_bookmarked).length === 0 ? (
                    <p className="text-sm text-gray-500">Bookmark sessions to build your personal schedule</p>
                  ) : (
                    <div className="space-y-3">
                      {sessions.filter(s => s.is_bookmarked).map(session => (
                        <div key={session.id} className="flex items-start space-x-2 text-sm">
                          <Clock className="h-4 w-4 text-blue-600 mt-0.5" />
                          <div>
                            <p className="font-medium">{session.title}</p>
                            <p className="text-gray-500">
                              {new Date(session.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Resources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Link to={`/events/${id}/recordings`}>
                    <Button variant="ghost" className="w-full justify-start">
                      <Video className="h-4 w-4 mr-2" />
                      Session Recordings
                    </Button>
                  </Link>
                  <Link to={`/events/${id}/networking`}>
                    <Button variant="ghost" className="w-full justify-start">
                      <Users className="h-4 w-4 mr-2" />
                      Networking
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
