import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import api from '../services/api';
import { ArrowLeft, Users, MessageCircle, Sparkles, Search, Send } from 'lucide-react';

interface Attendee {
  id: string;
  full_name: string;
  title: string;
  company: string;
  interests: string[];
  bio: string;
  isConnected: boolean;
}

interface ChatRoom {
  id: string;
  name: string;
  description: string;
  attendee_count: number;
  category: string;
}

const Networking: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'attendees' | 'rooms' | 'matches'>('attendees');
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [matches, setMatches] = useState<Attendee[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [roomMessages, setRoomMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    fetchNetworkingData();
  }, [id]);

  const fetchNetworkingData = async () => {
    try {
      const [attendeesRes, roomsRes, matchesRes] = await Promise.all([
        api.get(`/events/${id}/attendees`),
        api.get(`/events/${id}/chat-rooms`),
        api.get(`/events/${id}/networking-matches`),
      ]);

      setAttendees(attendeesRes.data.attendees || []);
      setChatRooms(roomsRes.data.rooms || []);
      setMatches(matchesRes.data.matches || []);
    } catch (error) {
      console.error('Error fetching networking data:', error);
    }
  };

  const handleConnect = async (attendeeId: string) => {
    try {
      await api.post(`/events/${id}/connections`, { attendee_id: attendeeId });
      fetchNetworkingData();
    } catch (error) {
      console.error('Error connecting:', error);
    }
  };

  const joinRoom = async (roomId: string) => {
    setSelectedRoom(roomId);
    try {
      const response = await api.get(`/events/${id}/chat-rooms/${roomId}/messages`);
      setRoomMessages(response.data.messages || []);
    } catch (error) {
      console.error('Error fetching room messages:', error);
    }
  };

  const sendRoomMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedRoom) return;

    try {
      await api.post(`/events/${id}/chat-rooms/${selectedRoom}/messages`, { content: newMessage });
      setNewMessage('');
      joinRoom(selectedRoom);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const filteredAttendees = attendees.filter(a => 
    a.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => navigate(`/events/${id}`)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">Networking Lounge</h1>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="flex space-x-1 bg-white rounded-lg p-1 mb-6 shadow-sm">
          {[
            { id: 'attendees', icon: Users, label: 'Attendees' },
            { id: 'rooms', icon: MessageCircle, label: 'Chat Rooms' },
            { id: 'matches', icon: Sparkles, label: 'AI Matches' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium flex items-center justify-center space-x-2 transition-colors ${
                activeTab === tab.id 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Attendees Tab */}
        {activeTab === 'attendees' && (
          <div>
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Search attendees by name, company, or title..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAttendees.map((attendee) => (
                <Card key={attendee.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold">
                        {attendee.full_name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{attendee.full_name}</h3>
                        <p className="text-sm text-gray-500">{attendee.title} at {attendee.company}</p>
                        {attendee.interests && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {attendee.interests.map((interest, idx) => (
                              <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                {interest}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-3 line-clamp-2">{attendee.bio}</p>
                    <Button
                      variant={attendee.isConnected ? "outline" : "default"}
                      size="sm"
                      className="w-full mt-3"
                      onClick={() => handleConnect(attendee.id)}
                      disabled={attendee.isConnected}
                    >
                      {attendee.isConnected ? 'Connected' : 'Connect'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Chat Rooms Tab */}
        {activeTab === 'rooms' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-4">
              <h2 className="font-semibold text-lg">Available Rooms</h2>
              {chatRooms.map((room) => (
                <Card 
                  key={room.id} 
                  className={`cursor-pointer transition-colors ${selectedRoom === room.id ? 'border-blue-500 bg-blue-50' : ''}`}
                  onClick={() => joinRoom(room.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{room.name}</h3>
                        <p className="text-sm text-gray-500">{room.description}</p>
                      </div>
                      <span className="text-sm text-gray-400">{room.attendee_count} online</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="lg:col-span-2">
              {selectedRoom ? (
                <Card className="h-[500px] flex flex-col">
                  <CardHeader>
                    <CardTitle>
                      {chatRooms.find(r => r.id === selectedRoom)?.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 overflow-y-auto space-y-3">
                    {roomMessages.map((msg) => (
                      <div key={msg.id} className="flex space-x-2">
                        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                          {msg.user?.full_name?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">{msg.user?.full_name}</p>
                          <p className="text-sm">{msg.content}</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                  <div className="p-4 border-t">
                    <form onSubmit={sendRoomMessage} className="flex space-x-2">
                      <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1"
                      />
                      <Button type="submit" size="icon">
                        <Send className="h-4 w-4" />
                      </Button>
                    </form>
                  </div>
                </Card>
              ) : (
                <Card className="h-[500px] flex items-center justify-center">
                  <CardContent className="text-center">
                    <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Select a room to start chatting</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* AI Matches Tab */}
        {activeTab === 'matches' && (
          <div>
            <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-100">
              <div className="flex items-center space-x-2 mb-2">
                <Sparkles className="h-5 w-5 text-purple-600" />
                <h2 className="font-semibold text-purple-900">AI-Powered Networking</h2>
              </div>
              <p className="text-sm text-purple-700">
                Based on your profile and interests, we've matched you with these attendees who share similar professional backgrounds and interests.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {matches.map((match) => (
                <Card key={match.id} className="border-purple-200">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white font-bold">
                        {match.full_name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{match.full_name}</h3>
                        <p className="text-sm text-gray-500">{match.title} at {match.company}</p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <p className="text-xs text-purple-600 font-medium">Shared Interests:</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {match.interests?.map((interest, idx) => (
                          <span key={idx} className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                            {interest}
                          </span>
                        ))}
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-3 border-purple-300 text-purple-700 hover:bg-purple-50"
                      onClick={() => handleConnect(match.id)}
                    >
                      Connect
                    </Button>
                  </CardContent>
                </Card>
              ))}
              {matches.length === 0 && (
                <Card className="col-span-full">
                  <CardContent className="py-12 text-center">
                    <Sparkles className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Complete your profile to get AI-powered matches</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Networking;
