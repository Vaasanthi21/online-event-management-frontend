import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import api from '../services/api';
import { ArrowLeft, Building2, MessageSquare, ExternalLink, Video, FileText, Gift } from 'lucide-react';

interface Sponsor {
  id: string;
  company_name: string;
  logo_url: string;
  description: string;
  website_url: string;
  tier: string;
  booth_number: string;
  resources: Array<{
    title: string;
    type: string;
    url: string;
  }>;
  representatives: Array<{
    name: string;
    title: string;
    email: string;
  }>;
  isLive: boolean;
}

const SponsorBooths: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [selectedSponsor, setSelectedSponsor] = useState<Sponsor | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSponsors();
  }, [id]);

  const fetchSponsors = async () => {
    try {
      const response = await api.get(`/events/${id}/sponsors`);
      setSponsors(response.data.sponsors || []);
    } catch (error) {
      console.error('Error fetching sponsors:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier.toLowerCase()) {
      case 'platinum': return 'bg-gray-100 border-gray-300';
      case 'gold': return 'bg-yellow-50 border-yellow-200';
      case 'silver': return 'bg-gray-50 border-gray-200';
      case 'bronze': return 'bg-orange-50 border-orange-200';
      default: return 'bg-white border-gray-200';
    }
  };

  const getTierBadge = (tier: string) => {
    switch (tier.toLowerCase()) {
      case 'platinum': return 'bg-gray-800 text-white';
      case 'gold': return 'bg-yellow-500 text-white';
      case 'silver': return 'bg-gray-400 text-white';
      case 'bronze': return 'bg-orange-500 text-white';
      default: return 'bg-blue-500 text-white';
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
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => navigate(`/events/${id}`)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Event
          </Button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Exhibitor Hall</h1>
          <p className="text-gray-600 mt-2">Visit our sponsors and explore their virtual booths</p>
        </div>

        {selectedSponsor ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
                        {selectedSponsor.logo_url ? (
                          <img src={selectedSponsor.logo_url} alt={selectedSponsor.company_name} className="w-full h-full object-cover rounded-lg" />
                        ) : (
                          selectedSponsor.company_name.charAt(0)
                        )}
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold">{selectedSponsor.company_name}</h2>
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mt-1 ${getTierBadge(selectedSponsor.tier)}`}>
                          {selectedSponsor.tier} Sponsor
                        </span>
                        {selectedSponsor.isLive && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 ml-2">
                            <span className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></span>
                            Live Now
                          </span>
                        )}
                      </div>
                    </div>
                    <Button variant="outline" onClick={() => setSelectedSponsor(null)}>
                      Back to Booths
                    </Button>
                  </div>

                  <p className="text-gray-600 mb-6">{selectedSponsor.description}</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {selectedSponsor.website_url && (
                      <a href={selectedSponsor.website_url} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" className="w-full">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Visit Website
                        </Button>
                      </a>
                    )}
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Chat with Representative
                    </Button>
                  </div>

                  {selectedSponsor.resources && selectedSponsor.resources.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-lg mb-4">Resources</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedSponsor.resources.map((resource, idx) => (
                          <a 
                            key={idx} 
                            href={resource.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            {resource.type === 'video' ? (
                              <Video className="h-8 w-8 text-red-500 mr-3" />
                            ) : resource.type === 'document' ? (
                              <FileText className="h-8 w-8 text-blue-500 mr-3" />
                            ) : (
                              <Gift className="h-8 w-8 text-purple-500 mr-3" />
                            )}
                            <div>
                              <p className="font-medium">{resource.title}</p>
                              <p className="text-sm text-gray-500 capitalize">{resource.type}</p>
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Representatives</CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedSponsor.representatives?.map((rep, idx) => (
                    <div key={idx} className="flex items-center space-x-3 mb-4 last:mb-0">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold">
                        {rep.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium">{rep.name}</p>
                        <p className="text-sm text-gray-500">{rep.title}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sponsors.length === 0 ? (
              <Card className="col-span-full">
                <CardContent className="py-12 text-center">
                  <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No sponsors yet</p>
                  <p className="text-sm text-gray-400 mt-2">
                    Sponsor booths will appear here
                  </p>
                </CardContent>
              </Card>
            ) : (
              sponsors.map((sponsor) => (
                <Card 
                  key={sponsor.id}
                  className={`cursor-pointer transition-all hover:shadow-lg border-2 ${getTierColor(sponsor.tier)}`}
                  onClick={() => setSelectedSponsor(sponsor)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xl font-bold">
                        {sponsor.logo_url ? (
                          <img src={sponsor.logo_url} alt={sponsor.company_name} className="w-full h-full object-cover rounded-lg" />
                        ) : (
                          sponsor.company_name.charAt(0)
                        )}
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTierBadge(sponsor.tier)}`}>
                        {sponsor.tier}
                      </span>
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{sponsor.company_name}</h3>
                    <p className="text-gray-600 text-sm line-clamp-2 mb-4">{sponsor.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Booth {sponsor.booth_number}</span>
                      {sponsor.isLive && (
                        <span className="flex items-center text-xs text-green-600">
                          <span className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></span>
                          Live
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default SponsorBooths;
