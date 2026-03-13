import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Event, Registration } from '../types';
import api from '../services/api';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Calendar, Users, Plus, Ticket, Edit, BarChart3, MessageSquare } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [myEvents, setMyEvents] = useState<Event[]>([]);
  const [myRegistrations, setMyRegistrations] = useState<Registration[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [eventsRes, registrationsRes] = await Promise.all([
        api.get('/events/my-events'),
        api.get('/registrations/my-registrations'),
      ]);

      // 👇 Debugging line to inspect API response
      console.log("My Registrations API Response:", registrationsRes.data);

      setMyEvents(eventsRes.data.events);
      // Adjust in case backend returns data differently
      setMyRegistrations(registrationsRes.data.registrations || registrationsRes.data || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-900 via-purple-900 to-slate-900" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
            Dashboard
          </h1>
          <p className="text-xl text-gray-300">
            Manage your events and registrations in one place.
          </p>
        </div>
      </section>

      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">Welcome, {user?.full_name}</span>
            <Link to="/events/create">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Event
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">My Events</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{myEvents.length}</div>
              <p className="text-xs text-muted-foreground">
                Events you're organizing
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Registrations</CardTitle>
              <Ticket className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{myRegistrations.length}</div>
              <p className="text-xs text-muted-foreground">
                Events you're attending
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Attendees</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {myEvents.reduce((acc, event) => acc + (event.max_attendees || 0), 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                Across all your events
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h2 className="text-lg font-semibold mb-4">My Events</h2>
            {myEvents.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center">
                  <p className="text-gray-500 mb-4">You haven't created any events yet.</p>
                  <Link to="/events/create">
                    <Button>Create Your First Event</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {myEvents.map((event) => (
                  <Card key={event.id}>
                    <CardHeader>
                      <CardTitle className="text-lg">{event.title}</CardTitle>
                      <CardDescription>
                        {new Date(event.start_date).toLocaleDateString()} - {event.status}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 line-clamp-2">{event.description}</p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <Link to={`/events/${event.id}`}>
                          <Button variant="outline" size="sm">View</Button>
                        </Link>
                        <Link to={`/events/${event.id}/edit`}>
                          <Button variant="outline" size="sm">
                            <Edit className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                        </Link>
                        <Link to={`/events/${event.id}/analytics`}>
                          <Button variant="outline" size="sm">
                            <BarChart3 className="h-3 w-3 mr-1" />
                            Analytics
                          </Button>
                        </Link>
                        <Link to={`/events/${event.id}/feedback`}>
                          <Button variant="outline" size="sm">
                            <MessageSquare className="h-3 w-3 mr-1" />
                            Feedback
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-4">My Registrations</h2>
            {myRegistrations.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center">
                  <p className="text-gray-500 mb-4">You haven't registered for any events yet.</p>
                  <Link to="/events">
                    <Button>Browse Events</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {myRegistrations.map((registration) => (
                  <Card key={registration.id}>
                    <CardHeader>
                      <CardTitle className="text-lg">{registration.event?.title}</CardTitle>
                      <CardDescription>
                        {new Date(registration.event?.start_date || '').toLocaleDateString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600">
                        Ticket: {registration.ticket_type?.name} | Status: {registration.status}
                      </p>
                      <div className="mt-4">
                        <Link to={`/events/${registration.event_id}`}>
                          <Button variant="outline" size="sm">View Event</Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
