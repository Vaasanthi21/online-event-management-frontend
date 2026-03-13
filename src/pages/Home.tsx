import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Calendar, Users, MessageSquare, BarChart3, Zap, Globe, Video, Mic2, Network, Building2, Star, ArrowRight } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
interface Event {
  id: string;
  title: string;
  description: string;
  start_date: string;
  status: string;
  location_type: string;
  organizer: {
    full_name: string;
  };
}

const Home: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    fetchEvents();
  }, []);
  

  const fetchEvents = async () => {
    try {
      const response = await api.get('/events');
      setEvents(response.data.events || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleJoinAttendee = () => {
    if (user) {
      navigate('/my-registrations');
    } else {
      navigate('/register/attendee');
    }
  };

  const handleHostEvents = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/register/organizer');
    }
  };

  const features = [
    {
      icon: Calendar,
      title: 'Event Management',
      description: 'Create and manage virtual, hybrid, or in-person events with ease.',
    },
    {
      icon: Users,
      title: 'Attendee Engagement',
      description: 'Interactive features including polls, Q&A, and networking.',
    },
    {
      icon: MessageSquare,
      title: 'Real-time Communication',
      description: 'Live chat, announcements, and breakout sessions.',
    },
    {
      icon: BarChart3,
      title: 'Analytics & Insights',
      description: 'Comprehensive analytics to measure event success.',
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Optimized for speed and real-time interactions.',
    },
    {
      icon: Globe,
      title: 'Global Reach',
      description: 'Host events for attendees from around the world.',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <section className="relative overflow-hidden py-20">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-900 via-purple-900 to-slate-900">
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }} />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
          Dashboard
        </h1>
      </div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white animate-fade-in-up">
            Welcome to{' '}
            <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent gradient-animate">
              Convene
            </span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-gray-300 animate-fade-in-up stagger-1">
            The all-in-one platform for organizing, managing, and delivering exceptional virtual experiences.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in-up stagger-2">
            <Link to="/events">
              <Button size="lg" className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white border-0 hover-lift animate-pulse-glow">
                Browse Events
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="border-cyan-400 text-cyan-300 hover:bg-cyan-950/50 hover:text-white"
              onClick={handleJoinAttendee}
            >
              Join as Attendee
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-violet-400 text-violet-300 hover:bg-violet-950/50 hover:text-white"
              onClick={handleHostEvents}
            >
              Host Events
            </Button>
          </div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Everything You Need for Successful Events
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              From registration to analytics, our platform provides all the tools you need.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className={`hover:shadow-lg hover:shadow-violet-500/10 transition-all bg-card border-border hover-lift animate-fade-in-up stagger-${index + 1}`}
              >
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-br from-violet-500/20 to-purple-500/20 rounded-lg flex items-center justify-center mb-4 animate-float" style={{ animationDelay: `${index * 0.2}s` }}>
                    <feature.icon className="w-6 h-6 text-violet-400" />
                  </div>
                  <CardTitle className="text-card-foreground">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section className="py-20 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Explore Events & Features
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Browse events and access all platform features directly
            </p>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          ) : events.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">No events available yet</p>
                <Link to="/dashboard">
                  <Button>Create Your First Event</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {events.map((event) => (
                <Card key={event.id} className="overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold">{event.title}</h3>
                        <p className="text-white/80 text-sm mt-1">
                          by {event.organizer?.full_name || 'Unknown'}
                        </p>
                      </div>
                      <span className="px-2 py-1 bg-white/20 rounded text-xs">
                        {event.status}
                      </span>
                    </div>
                    <p className="text-white/90 text-sm mt-2">
                      {new Date(event.start_date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                  
                  <CardContent className="p-4">
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {event.description}
                    </p>
                    
                    {/* Feature Links */}
                    <div className="grid grid-cols-2 gap-2">
                      <Link to={`/events/${event.id}`}>
                        <Button variant="outline" size="sm" className="w-full justify-start">
                          <Calendar className="h-4 w-4 mr-2" />
                          View Event
                        </Button>
                      </Link>
                      <Link to={`/events/${event.id}/speakers`}>
                        <Button variant="outline" size="sm" className="w-full justify-start">
                          <Mic2 className="h-4 w-4 mr-2" />
                          Speakers
                        </Button>
                      </Link>
                      <Link to={`/events/${event.id}/networking`}>
                        <Button variant="outline" size="sm" className="w-full justify-start">
                          <Network className="h-4 w-4 mr-2" />
                          Networking
                        </Button>
                      </Link>
                      <Link to={`/events/${event.id}/recordings`}>
                        <Button variant="outline" size="sm" className="w-full justify-start">
                          <Video className="h-4 w-4 mr-2" />
                          Recordings
                        </Button>
                      </Link>
                      <Link to={`/events/${event.id}/sponsors`}>
                        <Button variant="outline" size="sm" className="w-full justify-start">
                          <Building2 className="h-4 w-4 mr-2" />
                          Sponsors
                        </Button>
                      </Link>
                      <Link to={`/events/${event.id}/feedback`}>
                        <Button variant="outline" size="sm" className="w-full justify-start">
                          <Star className="h-4 w-4 mr-2" />
                          Feedback
                        </Button>
                      </Link>
                    </div>

                    <div className="mt-4 pt-4 border-t flex justify-between">
                      <Link to={`/events/${event.id}/analytics`}>
                        <Button variant="ghost" size="sm">
                          <BarChart3 className="h-4 w-4 mr-1" />
                          Analytics
                        </Button>
                      </Link>
                      <Link to={`/events/${event.id}/live`}>
                        <Button size="sm" className="bg-red-600 hover:bg-red-700">
                          <Zap className="h-4 w-4 mr-1" />
                          Join Live
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="text-center mt-8">
            <Link to="/events">
              <Button variant="outline" size="lg">
                View All Events
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Ready to Host Your Next Event?
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Join thousands of event organizers who trust our platform to deliver exceptional experiences. 
                Start for free and scale as you grow.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/register">
                  <Button size="lg">Create Free Account</Button>
                </Link>
                <Link to="/events">
                  <Button size="lg" variant="outline">Explore Events</Button>
                </Link>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl p-8">
              <div className="space-y-4">
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">1,234 attendees registered</p>
                      <p className="text-sm text-gray-500">Tech Summit 2026</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <MessageSquare className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">89% engagement rate</p>
                      <p className="text-sm text-gray-500">Marketing Workshop</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <BarChart3 className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium">4.8 average rating</p>
                      <p className="text-sm text-gray-500">Product Launch</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">Convene</h3>
              <p className="text-gray-400">
                The complete platform for virtual and hybrid events.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/events" className="hover:text-white">Browse Events</Link></li>
                <li><Link to="/dashboard" className="hover:text-white">Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Privacy</a></li>
                <li><a href="#" className="hover:text-white">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2026 Convene. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
