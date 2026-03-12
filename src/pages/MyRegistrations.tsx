import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import api from '../services/api';
import { Calendar, MapPin, Clock, CheckCircle, AlertCircle, ArrowRight, Ticket } from 'lucide-react';

interface Event {
  id: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  location_type: string;
  meeting_link?: string;
  address?: string;
  banner_image?: string;
  status: string;
}

interface Registration {
  id: string;
  event_id: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  payment_status: string;
  registration_date: string;
  event: Event;
}

const MyRegistrations: React.FC = () => {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      const response = await api.get('/registrations/my-registrations');
      setRegistrations(response.data.registrations || []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load registrations');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return (
          <Badge className="bg-green-500/20 text-green-400 border-green-500/50">
            <CheckCircle className="h-3 w-3 mr-1" />
            Confirmed
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/50">
            <AlertCircle className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      case 'cancelled':
        return (
          <Badge className="bg-red-500/20 text-red-400 border-red-500/50">
            Cancelled
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const isUpcoming = (startDate: string) => {
    return new Date(startDate) > new Date();
  };

  const isLive = (startDate: string, endDate: string) => {
    const now = new Date();
    return now >= new Date(startDate) && now <= new Date(endDate);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">My Registrations</h1>
          <p className="text-muted-foreground">
            View and manage your event registrations
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400">
            {error}
          </div>
        )}

        {registrations.length === 0 ? (
          <Card className="bg-card border-border">
            <CardContent className="py-12 text-center">
              <Ticket className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No Registrations Yet</h3>
              <p className="text-muted-foreground mb-6">
                You haven't registered for any events. Browse available events and register now!
              </p>
              <Link to="/events">
                <Button className="bg-gradient-to-r from-violet-600 to-cyan-600">
                  Browse Events
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Upcoming Events */}
            {registrations.some(r => isUpcoming(r.event.start_date) && r.status !== 'cancelled') && (
              <>
                <h2 className="text-xl font-semibold text-foreground mb-4">Upcoming Events</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {registrations
                    .filter(r => isUpcoming(r.event.start_date) && r.status !== 'cancelled')
                    .map(registration => (
                      <Card key={registration.id} className="bg-card border-border overflow-hidden group hover:shadow-lg hover:shadow-violet-500/10 transition-all">
                        <div className="h-40 relative overflow-hidden">
                          {registration.event.banner_image ? (
                            <img
                              src={registration.event.banner_image}
                              alt={registration.event.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-violet-600 to-cyan-600" />
                          )}
                          <div className="absolute top-3 right-3">
                            {getStatusBadge(registration.status)}
                          </div>
                          {isLive(registration.event.start_date, registration.event.end_date) && (
                            <div className="absolute top-3 left-3">
                              <Badge className="bg-red-500 text-white animate-pulse">
                                LIVE NOW
                              </Badge>
                            </div>
                          )}
                        </div>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg text-foreground line-clamp-1">
                            {registration.event.title}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="space-y-2 text-sm text-muted-foreground mb-4">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-2 text-violet-400" />
                              {new Date(registration.event.start_date).toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              })}
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-2 text-cyan-400" />
                              {new Date(registration.event.start_date).toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </div>
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-2 text-purple-400" />
                              {registration.event.location_type === 'virtual' ? 'Virtual Event' : registration.event.location_type}
                            </div>
                          </div>
                          <Link to={`/events/${registration.event_id}`}>
                            <Button className="w-full bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-700 hover:to-cyan-700">
                              View Event Details
                              <ArrowRight className="h-4 w-4 ml-2" />
                            </Button>
                          </Link>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </>
            )}

            {/* Past Events */}
            {registrations.some(r => !isUpcoming(r.event.start_date) && r.status !== 'cancelled') && (
              <>
                <h2 className="text-xl font-semibold text-foreground mb-4 mt-8">Past Events</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {registrations
                    .filter(r => !isUpcoming(r.event.start_date) && r.status !== 'cancelled')
                    .map(registration => (
                      <Card key={registration.id} className="bg-card border-border overflow-hidden opacity-75">
                        <div className="h-40 relative overflow-hidden">
                          {registration.event.banner_image ? (
                            <img
                              src={registration.event.banner_image}
                              alt={registration.event.title}
                              className="w-full h-full object-cover grayscale"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-gray-600 to-gray-700" />
                          )}
                          <div className="absolute top-3 right-3">
                            {getStatusBadge(registration.status)}
                          </div>
                        </div>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg text-foreground line-clamp-1">
                            {registration.event.title}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="space-y-2 text-sm text-muted-foreground mb-4">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-2 text-violet-400" />
                              {new Date(registration.event.start_date).toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              })}
                            </div>
                          </div>
                          <Link to={`/events/${registration.event_id}/recordings`}>
                            <Button variant="outline" className="w-full border-border hover:bg-secondary">
                              View Recordings
                            </Button>
                          </Link>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyRegistrations;
