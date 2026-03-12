import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import api from '../services/api';
import { ArrowLeft, Plus, Mic2, Trash2 } from 'lucide-react';

interface Speaker {
  id: string;
  full_name: string;
  email: string;
  bio: string;
  title: string;
  company: string;
  avatar_url: string;
  linkedin_url: string;
  twitter_url: string;
  session_count: number;
}

const SpeakerManagement: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    bio: '',
    title: '',
    company: '',
    linkedin_url: '',
    twitter_url: '',
  });

  useEffect(() => {
    fetchSpeakers();
  }, [id]);

  const fetchSpeakers = async () => {
    try {
      const response = await api.get(`/events/${id}/speakers`);
      setSpeakers(response.data.speakers || []);
    } catch (error) {
      console.error('Error fetching speakers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post(`/events/${id}/speakers`, formData);
      setFormData({
        full_name: '',
        email: '',
        bio: '',
        title: '',
        company: '',
        linkedin_url: '',
        twitter_url: '',
      });
      setShowForm(false);
      fetchSpeakers();
    } catch (error) {
      console.error('Error adding speaker:', error);
    }
  };

  const handleDelete = async (speakerId: string) => {
    if (!confirm('Are you sure you want to remove this speaker?')) return;
    try {
      await api.delete(`/events/${id}/speakers/${speakerId}`);
      fetchSpeakers();
    } catch (error) {
      console.error('Error deleting speaker:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
        <Button variant="ghost" className="mb-6" onClick={() => navigate(`/events/${id}`)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Event
        </Button>

        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Speaker Management</h1>
            <p className="text-gray-600 mt-1">Manage speakers and their sessions</p>
          </div>
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Speaker
          </Button>
        </div>

        {showForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Add New Speaker</CardTitle>
              <CardDescription>Enter speaker details below</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="full_name">Full Name *</Label>
                    <Input id="full_name" name="full_name" value={formData.full_name} onChange={handleChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="title">Job Title</Label>
                    <Input id="title" name="title" value={formData.title} onChange={handleChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company">Company</Label>
                    <Input id="company" name="company" value={formData.company} onChange={handleChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="linkedin_url">LinkedIn URL</Label>
                    <Input id="linkedin_url" name="linkedin_url" value={formData.linkedin_url} onChange={handleChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="twitter_url">Twitter URL</Label>
                    <Input id="twitter_url" name="twitter_url" value={formData.twitter_url} onChange={handleChange} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Brief biography of the speaker"
                  />
                </div>
                <div className="flex space-x-2">
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700">Add Speaker</Button>
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {speakers.length === 0 ? (
            <Card className="col-span-full">
              <CardContent className="py-12 text-center">
                <Mic2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">No speakers added yet</p>
                <Button onClick={() => setShowForm(true)}>Add Your First Speaker</Button>
              </CardContent>
            </Card>
          ) : (
            speakers.map((speaker) => (
              <Card key={speaker.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xl font-bold">
                        {speaker.full_name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{speaker.full_name}</h3>
                        <p className="text-blue-600 text-sm">{speaker.title}</p>
                        <p className="text-gray-500 text-sm">{speaker.company}</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleDelete(speaker.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <p className="text-gray-600 text-sm mt-4 line-clamp-3">{speaker.bio}</p>

                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Sessions</span>
                      <span className="font-semibold">{speaker.session_count || 0}</span>
                    </div>
                    <div className="flex items-center space-x-2 mt-3">
                      {speaker.linkedin_url && (
                        <a href={speaker.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">
                          LinkedIn
                        </a>
                      )}
                      {speaker.twitter_url && (
                        <a href={speaker.twitter_url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline text-sm">
                          Twitter
                        </a>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SpeakerManagement;
