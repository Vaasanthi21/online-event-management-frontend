import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';

import { Building2, Star, Award, Gem, Crown, Mail, ArrowRight, ExternalLink } from 'lucide-react';

interface Sponsor {
  id: string;
  name: string;
  description: string;
  logo_url?: string;
  website_url?: string;
  tier: 'platinum' | 'gold' | 'silver' | 'bronze';
  event_count: number;
}

const Sponsors: React.FC = () => {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSponsors();
  }, []);

  const fetchSponsors = async () => {
    try {
      // Mock data - replace with actual API call
      const mockSponsors: Sponsor[] = [
        {
          id: '1',
          name: 'TechVision Global',
          description: 'Leading technology solutions provider empowering businesses worldwide with innovative software and cloud services.',
          tier: 'platinum',
          event_count: 15,
          website_url: 'https://example.com',
        },
        {
          id: '2',
          name: 'Innovate Labs',
          description: 'Research and development powerhouse driving the future of AI and machine learning technologies.',
          tier: 'platinum',
          event_count: 12,
          website_url: 'https://example.com',
        },
        {
          id: '3',
          name: 'CloudScale Systems',
          description: 'Enterprise cloud infrastructure solutions for scalable and secure business operations.',
          tier: 'gold',
          event_count: 8,
          website_url: 'https://example.com',
        },
        {
          id: '4',
          name: 'DataFlow Analytics',
          description: 'Advanced analytics platform transforming data into actionable business insights.',
          tier: 'gold',
          event_count: 6,
          website_url: 'https://example.com',
        },
        {
          id: '5',
          name: 'SecureNet Solutions',
          description: 'Cybersecurity experts protecting digital assets for businesses of all sizes.',
          tier: 'silver',
          event_count: 5,
          website_url: 'https://example.com',
        },
        {
          id: '6',
          name: 'DevOps Pro',
          description: 'Streamlining development workflows with cutting-edge DevOps tools and practices.',
          tier: 'silver',
          event_count: 4,
          website_url: 'https://example.com',
        },
        {
          id: '7',
          name: 'CodeCraft Academy',
          description: 'Educational platform training the next generation of software developers.',
          tier: 'bronze',
          event_count: 3,
        },
        {
          id: '8',
          name: 'StartupHub',
          description: 'Incubator and accelerator program supporting early-stage technology startups.',
          tier: 'bronze',
          event_count: 2,
        },
      ];
      setSponsors(mockSponsors);
    } catch (error) {
      console.error('Error fetching sponsors:', error);
    } finally {
      setIsLoading(false);
    }
  };

  

  const getTierStyles = (tier: string) => {
    switch (tier) {
      case 'platinum':
        return 'from-slate-300 via-slate-200 to-slate-400 text-slate-900';
      case 'gold':
        return 'from-yellow-400 via-yellow-300 to-amber-500 text-amber-900';
      case 'silver':
        return 'from-slate-400 via-slate-300 to-slate-500 text-slate-900';
      case 'bronze':
        return 'from-amber-600 via-amber-500 to-orange-600 text-amber-950';
      default:
        return 'from-slate-600 to-slate-700 text-white';
    }
  };

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case 'platinum':
        return 'bg-gradient-to-r from-slate-300 to-slate-400 text-slate-900';
      case 'gold':
        return 'bg-gradient-to-r from-yellow-400 to-amber-500 text-amber-900';
      case 'silver':
        return 'bg-gradient-to-r from-slate-400 to-slate-500 text-slate-900';
      case 'bronze':
        return 'bg-gradient-to-r from-amber-600 to-orange-600 text-white';
      default:
        return 'bg-slate-600 text-white';
    }
  };

  const groupedSponsors = {
    platinum: sponsors.filter(s => s.tier === 'platinum'),
    gold: sponsors.filter(s => s.tier === 'gold'),
    silver: sponsors.filter(s => s.tier === 'silver'),
    bronze: sponsors.filter(s => s.tier === 'bronze'),
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
            Our <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent gradient-animate">Sponsors</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto animate-fade-in-up stagger-1">
            Partnering with industry leaders to bring you exceptional events and experiences
          </p>
        </div>
      </div>

      {/* Sponsors by Tier */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 space-y-12">
        {/* Platinum Sponsors */}
        {groupedSponsors.platinum.length > 0 && (
          <div>
            <div className="flex items-center justify-center space-x-2 mb-6">
              <Crown className="h-6 w-6 text-slate-300" />
              <h2 className="text-2xl font-bold text-white">Platinum Sponsors</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {groupedSponsors.platinum.map((sponsor, index) => (
                <Card 
                  key={sponsor.id} 
                  className={`bg-card border-slate-600 overflow-hidden hover:shadow-lg hover:shadow-slate-500/20 transition-all duration-500 hover-lift animate-fade-in-up stagger-${index + 1}`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className={`w-16 h-16 rounded-lg bg-gradient-to-br ${getTierStyles(sponsor.tier)} flex items-center justify-center text-2xl font-bold flex-shrink-0`}>
                        {sponsor.logo_url ? (
                          <img src={sponsor.logo_url} alt={sponsor.name} className="w-full h-full object-cover" />
                        ) : (
                          sponsor.name.charAt(0)
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="text-xl font-semibold text-foreground">{sponsor.name}</h3>
                          <Badge className={getTierBadge(sponsor.tier)}>
                            {sponsor.tier}
                          </Badge>
                        </div>
                        <p className="text-slate-400 text-sm mb-3">{sponsor.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-500">{sponsor.event_count} events sponsored</span>
                          {sponsor.website_url && (
                            <a
                              href={sponsor.website_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-violet-400 hover:text-violet-300 text-sm flex items-center"
                            >
                              Visit Website
                              <ExternalLink className="h-3 w-3 ml-1" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Gold Sponsors */}
        {groupedSponsors.gold.length > 0 && (
          <div>
            <div className="flex items-center justify-center space-x-2 mb-6">
              <Award className="h-6 w-6 text-yellow-400" />
              <h2 className="text-2xl font-bold text-white">Gold Sponsors</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {groupedSponsors.gold.map((sponsor) => (
                <Card key={sponsor.id} className="bg-card border-yellow-500/30 overflow-hidden hover:shadow-lg hover:shadow-yellow-500/20 transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className={`w-14 h-14 rounded-lg bg-gradient-to-br ${getTierStyles(sponsor.tier)} flex items-center justify-center text-xl font-bold flex-shrink-0`}>
                        {sponsor.logo_url ? (
                          <img src={sponsor.logo_url} alt={sponsor.name} className="w-full h-full object-cover" />
                        ) : (
                          sponsor.name.charAt(0)
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="text-lg font-semibold text-foreground">{sponsor.name}</h3>
                          <Badge className={getTierBadge(sponsor.tier)}>
                            {sponsor.tier}
                          </Badge>
                        </div>
                        <p className="text-slate-400 text-sm mb-2">{sponsor.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-500">{sponsor.event_count} events</span>
                          {sponsor.website_url && (
                            <a
                              href={sponsor.website_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-yellow-400 hover:text-yellow-300 text-sm flex items-center"
                            >
                              Visit
                              <ExternalLink className="h-3 w-3 ml-1" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Silver & Bronze Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Silver Sponsors */}
          {groupedSponsors.silver.length > 0 && (
            <div>
              <div className="flex items-center justify-center space-x-2 mb-6">
                <Star className="h-5 w-5 text-slate-400" />
                <h2 className="text-xl font-bold text-white">Silver Sponsors</h2>
              </div>
              <div className="space-y-4">
                {groupedSponsors.silver.map((sponsor) => (
                  <Card key={sponsor.id} className="bg-card border-slate-500/30">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${getTierStyles(sponsor.tier)} flex items-center justify-center text-lg font-bold flex-shrink-0`}>
                          {sponsor.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-foreground truncate">{sponsor.name}</h3>
                          <p className="text-slate-400 text-xs line-clamp-1">{sponsor.description}</p>
                        </div>
                        <Badge className={getTierBadge(sponsor.tier)}>
                          {sponsor.tier}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Bronze Sponsors */}
          {groupedSponsors.bronze.length > 0 && (
            <div>
              <div className="flex items-center justify-center space-x-2 mb-6">
                <Gem className="h-5 w-5 text-amber-600" />
                <h2 className="text-xl font-bold text-white">Bronze Sponsors</h2>
              </div>
              <div className="space-y-4">
                {groupedSponsors.bronze.map((sponsor) => (
                  <Card key={sponsor.id} className="bg-card border-amber-600/30">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${getTierStyles(sponsor.tier)} flex items-center justify-center text-lg font-bold flex-shrink-0`}>
                          {sponsor.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-foreground truncate">{sponsor.name}</h3>
                          <p className="text-slate-400 text-xs line-clamp-1">{sponsor.description}</p>
                        </div>
                        <Badge className={getTierBadge(sponsor.tier)}>
                          {sponsor.tier}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <Card className="bg-gradient-to-r from-violet-900/50 to-cyan-900/50 border-violet-500/30">
          <CardContent className="p-8 text-center">
            <Building2 className="h-12 w-12 text-violet-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Become a Sponsor</h2>
            <p className="text-slate-300 mb-6 max-w-xl mx-auto">
              Partner with us to reach thousands of engaged professionals. Showcase your brand and connect with your target audience.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact">
                <Button variant="outline" className="border-violet-400 text-violet-300 hover:bg-violet-950/50">
                  <Mail className="h-4 w-4 mr-2" />
                  Contact Us
                </Button>
              </Link>
              <Link to="/sponsorship">
                <Button className="bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-700 hover:to-cyan-700">
                  View Sponsorship Packages
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Sponsors;
