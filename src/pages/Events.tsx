import React, { useEffect, useState } from 'react';
import { Event } from '../types';
import api from '../services/api';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Calendar, MapPin, Users, Search, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Events: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = events.filter(
        (event) =>
          event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredEvents(filtered);
    } else {
      setFilteredEvents(events);
    }
  }, [searchQuery, events]);

  const fetchEvents = async () => {
    try {
      const response = await api.get('/events');
      setEvents(response.data.events);
      setFilteredEvents(response.data.events);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (eventId: string) => {
    if (!user) {
      alert('Please log in to register');
      return;
    }

    try {
      await api.post('/registrations', { event_id: eventId });
      alert('Successfully registered!');
    } catch (err: any) {
      console.error('Error registering:', err);
      alert(err.response?.data?.message || 'Failed to register');
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
      {/* Gradient Hero Section */}
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-900 via-purple-900 to-slate-900" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
            Browse Events
          </h1>
          <p className="text-xl text-gray-300">
            Discover upcoming events and join the ones you love.
          </p>
        </div>
      </section>

      {/* Search Bar */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <h2 className="text-2xl font-bold text-gray-900">Discover Events</h2>
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Event Cards */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredEvents.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No events found.</p>
            {searchQuery && (
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => setSearchQuery('')}
              >
                Clear Search
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event, index) => (
              <Card 
                key={event.id} 
                className={`flex flex-col overflow-hidden group hover:shadow-xl hover:shadow-violet-500/20 transition-all duration-500 hover-lift animate-fade-in-up stagger-${(index % 6) + 1}`}
              >
                <div className="h-48 relative overflow-hidden">
                  {event.banner_image ? (
                    <img
                      src={event.banner_image}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500">
                      <div className="absolute inset-0 bg-black/10" />
                    </div>
                  )}
                  <div className="absolute top-3 left-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      event.status === 'published' ? 'bg-green-500 text-white' :
                      event.status === 'ongoing' ? 'bg-blue-500 text-white' :
                      event.status === 'completed' ? 'bg-gray-500 text-white' :
                      event.status === 'cancelled' ? 'bg-red-500 text-white' :
                      'bg-yellow-500 text-white'
                    }`}>
                      {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                    </span>
                  </div>
                  {event.location_type === 'virtual' && (
                    <div className="absolute top-3 right-3">
                      <span className="px-2 py-1 bg-black/50 backdrop-blur-sm text-white rounded-full text-xs font-medium flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        Virtual
                      </span>
                    </div>
                  )}
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl line-clamp-1 group-hover:text-blue-600 transition-colors">
                    {event.title}
                  </CardTitle>
                  <CardDescription className="flex items-center mt-2 text-gray-600">
                    <Calendar className="w-4 h-4 mr-2 text-blue-500" />
                    {new Date(event.start_date).toLocaleDateString('en-US', {
                      weekday: 'short',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </CardDescription>
                  <CardDescription className="flex items-center mt-1 text-gray-500">
                    <Clock className="w-4 h-4 mr-2 text-purple-500" />
                    {new Date(event.start_date).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow pt-0">
                  <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                    {event.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-500">
                      {event.max_attendees && (
                        <span className="flex items-center bg-gray-100 px-2 py-1 rounded-full">
                          <Users className="w-3 h-3 mr-1" />
                          {event.max_attendees} max
                        </span>
                      )}
                    </div>
                  </div>
                  <Button
                    onClick={() => handleRegister(event.id)}
                    className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white mt-4"
                  >
                    Register
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Events;
