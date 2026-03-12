import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import api from '../services/api';
import { ArrowLeft, Play, Clock, Download, Search, Video, Mic2 } from 'lucide-react';

interface Recording {
  id: string;
  session_id: string;
  session_title: string;
  speaker_name: string;
  duration: number;
  thumbnail_url: string;
  video_url: string;
  created_at: string;
  view_count: number;
}

const Recordings: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecording, setSelectedRecording] = useState<Recording | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchRecordings();
  }, [id]);

  const fetchRecordings = async () => {
    try {
      const response = await api.get(`/events/${id}/recordings`);
      setRecordings(response.data.recordings || []);
    } catch (error) {
      console.error('Error fetching recordings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const filteredRecordings = recordings.filter(r =>
    r.session_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.speaker_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <h1 className="text-3xl font-bold text-gray-900">Session Recordings</h1>
          <p className="text-gray-600 mt-2">Watch or download sessions on-demand</p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search recordings by session or speaker..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Video Player */}
        {selectedRecording && (
          <Card className="mb-6">
            <CardContent className="p-0">
              <div className="aspect-video bg-black flex items-center justify-center">
                {selectedRecording.video_url ? (
                  <video
                    controls
                    className="w-full h-full"
                    poster={selectedRecording.thumbnail_url}
                  >
                    <source src={selectedRecording.video_url} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <div className="text-center text-white">
                    <Video className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p>Video playback not available</p>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h2 className="text-xl font-semibold">{selectedRecording.session_title}</h2>
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                  <span className="flex items-center">
                    <Mic2 className="h-4 w-4 mr-1" />
                    {selectedRecording.speaker_name}
                  </span>
                  <span className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {formatDuration(selectedRecording.duration)}
                  </span>
                  <span>{selectedRecording.view_count} views</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recordings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecordings.length === 0 ? (
            <Card className="col-span-full">
              <CardContent className="py-12 text-center">
                <Video className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No recordings available yet</p>
                <p className="text-sm text-gray-400 mt-2">
                  Recordings will appear here after the event concludes
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredRecordings.map((recording) => (
              <Card 
                key={recording.id} 
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  selectedRecording?.id === recording.id ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => setSelectedRecording(recording)}
              >
                <div className="relative aspect-video bg-gray-900 rounded-t-lg overflow-hidden">
                  {recording.thumbnail_url ? (
                    <img 
                      src={recording.thumbnail_url} 
                      alt={recording.session_title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Video className="h-12 w-12 text-gray-600" />
                    </div>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 opacity-0 hover:opacity-100 transition-opacity">
                    <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center">
                      <Play className="h-8 w-8 text-blue-600 ml-1" />
                    </div>
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    {formatDuration(recording.duration)}
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold line-clamp-2">{recording.session_title}</h3>
                  <p className="text-sm text-gray-500 mt-1">{recording.speaker_name}</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs text-gray-400">{recording.view_count} views</span>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default Recordings;
