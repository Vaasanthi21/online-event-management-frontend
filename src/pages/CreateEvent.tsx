import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import api from '../services/api';
import { ArrowLeft, X, ImageIcon, CheckCircle } from 'lucide-react';

const CreateEvent: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [bannerImage, setBannerImage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    start_date: '',
    end_date: '',
    location_type: 'virtual',
    meeting_link: '',
    address: '',
    max_attendees: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        setError('Please upload an image file');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerImage(reader.result as string);
        setError('');
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setBannerImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate banner image is required
    if (!bannerImage) {
      setError('Please upload a banner image for your event');
      return;
    }

    setIsLoading(true);

    try {
      const eventData = {
        ...formData,
        max_attendees: formData.max_attendees ? parseInt(formData.max_attendees) : undefined,
        banner_image: bannerImage,
      };

      await api.post('/events', eventData);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create event');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate('/dashboard')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Create New Event</CardTitle>
            <CardDescription>
              Fill in the details below to create your event
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              {error && (
                <div className="p-3 text-sm text-red-500 bg-red-50 rounded-lg border border-red-200">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label className="flex items-center">
                  Event Banner Image
                  <span className="ml-2 text-red-500">*</span>
                  <span className="ml-2 text-xs text-slate-500 font-normal">(Required)</span>
                </Label>
                <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-all duration-300 ${bannerImage ? 'border-green-500 bg-green-500/5' : 'border-violet-500/50 hover:border-violet-400 hover:bg-violet-500/5'}`}>
                  {bannerImage ? (
                    <div className="relative animate-scale-in">
                      <img
                        src={bannerImage}
                        alt="Event banner preview"
                        className="w-full h-48 object-cover rounded-lg shadow-lg"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-lg" />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-all hover:scale-110 shadow-lg"
                      >
                        <X className="h-4 w-4" />
                      </button>
                      <div className="absolute bottom-2 left-2 flex items-center text-green-400 text-sm">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Image uploaded
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="cursor-pointer group"
                    >
                      <div className="w-20 h-20 mx-auto bg-gradient-to-br from-violet-500/20 to-cyan-500/20 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform animate-pulse-glow">
                        <ImageIcon className="h-10 w-10 text-violet-400" />
                      </div>
                      <p className="mt-2 text-sm text-slate-300 font-medium">
                        Click to upload event thumbnail
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        PNG, JPG, GIF up to 5MB
                      </p>
                      <p className="text-xs text-violet-400 mt-2">
                        This image will be displayed as your event banner
                      </p>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Event Title *</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter event title"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your event"
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start_date">Start Date & Time *</Label>
                  <Input
                    id="start_date"
                    name="start_date"
                    type="datetime-local"
                    value={formData.start_date}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="end_date">End Date & Time *</Label>
                  <Input
                    id="end_date"
                    name="end_date"
                    type="datetime-local"
                    value={formData.end_date}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location_type">Location Type *</Label>
                <select
                  id="location_type"
                  name="location_type"
                  value={formData.location_type}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="virtual">Virtual</option>
                  <option value="hybrid">Hybrid</option>
                  <option value="in_person">In Person</option>
                </select>
              </div>

              {formData.location_type !== 'in_person' && (
                <div className="space-y-2">
                  <Label htmlFor="meeting_link">Meeting Link</Label>
                  <Input
                    id="meeting_link"
                    name="meeting_link"
                    value={formData.meeting_link}
                    onChange={handleChange}
                    placeholder="https://zoom.us/j/... or https://meet.google.com/..."
                  />
                </div>
              )}

              {formData.location_type !== 'virtual' && (
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter venue address"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="max_attendees">Maximum Attendees (optional)</Label>
                <Input
                  id="max_attendees"
                  name="max_attendees"
                  type="number"
                  value={formData.max_attendees}
                  onChange={handleChange}
                  placeholder="Leave empty for unlimited"
                  min="1"
                />
              </div>
            </CardContent>

            <CardFooter className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/dashboard')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                disabled={isLoading}
              >
                {isLoading ? 'Creating...' : 'Create Event'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default CreateEvent;
