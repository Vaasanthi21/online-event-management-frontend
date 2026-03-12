import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';

import { Mic2, Search, Twitter, Linkedin, Globe, ArrowRight, Mail } from 'lucide-react';

interface Speaker {
  id: string;
  name: string;
  title: string;
  company: string;
  bio: string;
  avatar_url?: string;
  social_links?: {
    twitter?: string;
    linkedin?: string;
    website?: string;
  };
  event_count: number;
}

const Speakers: React.FC = () => {
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [filteredSpeakers, setFilteredSpeakers] = useState<Speaker[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSpeakers();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = speakers.filter(
        (speaker) =>
          speaker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          speaker.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
          speaker.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredSpeakers(filtered);
    } else {
      setFilteredSpeakers(speakers);
    }
  }, [searchQuery, speakers]);

  const fetchSpeakers = async () => {
    try {
      // For now, using mock data - replace with actual API call
      const mockSpeakers: Speaker[] = [
        {
          id: '1',
          name: 'Dr. Sarah Chen',
          title: 'Chief Technology Officer',
          company: 'TechVision Inc.',
          bio: 'Dr. Chen is a leading expert in AI and machine learning with over 15 years of experience in the tech industry.',
          event_count: 12,
          social_links: {
            twitter: 'https://twitter.com',
            linkedin: 'https://linkedin.com',
          },
        },
        {
          id: '2',
          name: 'Marcus Johnson',
          title: 'Founder & CEO',
          company: 'Innovate Labs',
          bio: 'Marcus is a serial entrepreneur who has founded three successful startups in the event tech space.',
          event_count: 8,
          social_links: {
            twitter: 'https://twitter.com',
            website: 'https://example.com',
          },
        },
        {
          id: '3',
          name: 'Elena Rodriguez',
          title: 'Head of Marketing',
          company: 'Global Events Co.',
          bio: 'Elena specializes in digital marketing strategies for virtual and hybrid events.',
          event_count: 15,
          social_links: {
            linkedin: 'https://linkedin.com',
          },
        },
        {
          id: '4',
          name: 'James Wilson',
          title: 'Product Director',
          company: 'StreamLine Media',
          bio: 'James has been at the forefront of live streaming technology for the past decade.',
          event_count: 6,
          social_links: {
            twitter: 'https://twitter.com',
            linkedin: 'https://linkedin.com',
            website: 'https://example.com',
          },
        },
        {
          id: '5',
          name: 'Aisha Patel',
          title: 'Community Manager',
          company: 'Connectify',
          bio: 'Aisha is passionate about building engaged communities around virtual events.',
          event_count: 20,
          social_links: {
            twitter: 'https://twitter.com',
          },
        },
        {
          id: '6',
          name: 'David Kim',
          title: 'Senior Engineer',
          company: 'Tech Giants',
          bio: 'David leads the engineering team responsible for scaling virtual event platforms.',
          event_count: 4,
          social_links: {
            linkedin: 'https://linkedin.com',
            website: 'https://example.com',
          },
        },
      ];
      setSpeakers(mockSpeakers);
      setFilteredSpeakers(mockSpeakers);
    } catch (error) {
      console.error('Error fetching speakers:', error);
    } finally {
      setIsLoading(false);
    }
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
      {/* Header */}
      <div className="relative overflow-hidden py-16">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-900/50 via-slate-900 to-cyan-900/50" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 animate-fade-in-up">
            Our <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent gradient-animate">Speakers</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto animate-fade-in-up stagger-1">
            Learn from industry experts and thought leaders who share their knowledge and insights
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-md mx-auto relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 h-5 w-5" />
          <Input
            type="text"
            placeholder="Search speakers by name, company, or title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
          />
        </div>
      </div>

      {/* Speakers Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {filteredSpeakers.length === 0 ? (
          <div className="text-center py-12">
            <Mic2 className="h-16 w-16 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 text-lg">No speakers found matching your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSpeakers.map((speaker, index) => (
              <Card 
                key={speaker.id} 
                className={`bg-card border-border overflow-hidden group hover:shadow-lg hover:shadow-violet-500/10 transition-all duration-500 hover-lift animate-fade-in-up stagger-${(index % 6) + 1}`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0 group-hover:scale-110 transition-transform duration-300 animate-float">
                      {speaker.avatar_url ? (
                        <img
                          src={speaker.avatar_url}
                          alt={speaker.name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        speaker.name.charAt(0)
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-foreground truncate">
                        {speaker.name}
                      </h3>
                      <p className="text-violet-400 text-sm">{speaker.title}</p>
                      <p className="text-slate-400 text-sm">{speaker.company}</p>
                    </div>
                  </div>

                  <p className="mt-4 text-slate-400 text-sm line-clamp-3">
                    {speaker.bio}
                  </p>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex space-x-2">
                      {speaker.social_links?.twitter && (
                        <a
                          href={speaker.social_links.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:bg-slate-700 transition-colors"
                        >
                          <Twitter className="h-4 w-4" />
                        </a>
                      )}
                      {speaker.social_links?.linkedin && (
                        <a
                          href={speaker.social_links.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-blue-400 hover:bg-slate-700 transition-colors"
                        >
                          <Linkedin className="h-4 w-4" />
                        </a>
                      )}
                      {speaker.social_links?.website && (
                        <a
                          href={speaker.social_links.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-violet-400 hover:bg-slate-700 transition-colors"
                        >
                          <Globe className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                    <span className="text-sm text-slate-500">
                      {speaker.event_count} events
                    </span>
                  </div>

                  <Link to={`/speakers/${speaker.id}`}>
                    <Button className="w-full mt-4 bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-700 hover:to-cyan-700">
                      View Profile
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <Card className="bg-gradient-to-r from-violet-900/50 to-cyan-900/50 border-violet-500/30">
          <CardContent className="p-8 text-center">
            <Mic2 className="h-12 w-12 text-violet-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Want to Become a Speaker?</h2>
            <p className="text-slate-300 mb-6 max-w-xl mx-auto">
              Share your expertise with our community. Join our network of speakers and help others learn and grow.
            </p>
            <Link to="/contact">
              <Button variant="outline" className="border-violet-400 text-violet-300 hover:bg-violet-950/50">
                <Mail className="h-4 w-4 mr-2" />
                Apply to Speak
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Speakers;
