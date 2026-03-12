import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import api from '../services/api';
import { 
  Send, Users, MessageSquare, BarChart2, HelpCircle, 
  Radio, Bell, ChevronLeft, ChevronRight, ThumbsUp 
} from 'lucide-react';

interface Announcement {
  id: string;
  message: string;
  type: string;
  created_at: string;
}

interface Poll {
  id: string;
  question: string;
  options: string[];
  votes: number[];
  hasVoted: boolean;
}

interface Question {
  id: string;
  content: string;
  user: { full_name: string };
  upvotes: number;
  is_answered: boolean;
  created_at: string;
}

interface ChatMessage {
  id: string;
  content: string;
  user: { full_name: string };
  created_at: string;
}

const LiveEvent: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  const [activeTab, setActiveTab] = useState<'chat' | 'polls' | 'qa'>('chat');
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [polls, setPolls] = useState<Poll[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [newQuestion, setNewQuestion] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    fetchLiveData();
    const interval = setInterval(fetchLiveData, 5000);
    return () => clearInterval(interval);
  }, [id]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const fetchLiveData = async () => {
    try {
      const [announcementsRes, pollsRes, questionsRes, chatRes] = await Promise.all([
        api.get(`/events/${id}/announcements`),
        api.get(`/events/${id}/polls`),
        api.get(`/events/${id}/questions`),
        api.get(`/events/${id}/chat?limit=50`),
      ]);

      setAnnouncements(announcementsRes.data.announcements || []);
      setPolls(pollsRes.data.polls || []);
      setQuestions(questionsRes.data.questions || []);
      setChatMessages(chatRes.data.messages || []);
    } catch (error) {
      console.error('Error fetching live data:', error);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      await api.post(`/events/${id}/chat`, { content: newMessage });
      setNewMessage('');
      fetchLiveData();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const submitQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;

    try {
      await api.post(`/events/${id}/questions`, { content: newQuestion });
      setNewQuestion('');
      fetchLiveData();
    } catch (error) {
      console.error('Error submitting question:', error);
    }
  };

  const votePoll = async (pollId: string, optionIndex: number) => {
    try {
      await api.post(`/events/${id}/polls/${pollId}/vote`, { option_index: optionIndex });
      fetchLiveData();
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  const upvoteQuestion = async (questionId: string) => {
    try {
      await api.post(`/events/${id}/questions/${questionId}/upvote`);
      fetchLiveData();
    } catch (error) {
      console.error('Error upvoting:', error);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={() => navigate(`/events/${id}`)}>
            <ChevronLeft className="h-4 w-4 mr-1" />
            Exit
          </Button>
          <div className="flex items-center space-x-2">
            <Radio className="h-5 w-5 text-red-500 animate-pulse" />
            <span className="text-white font-semibold">LIVE</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-700 text-white">
            <Users className="h-3 w-3 mr-1" />
            1,234 attendees
          </span>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Video/Main Area */}
        <div className="flex-1 bg-black flex items-center justify-center">
          <div className="text-center text-white">
            <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Radio className="h-16 w-16" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Live Session in Progress</h2>
            <p className="text-gray-400">Main stage presentation</p>
          </div>
        </div>

        {/* Sidebar */}
        {isSidebarOpen && (
          <div className="w-96 bg-gray-800 border-l border-gray-700 flex flex-col">
            {/* Announcements */}
            {announcements.length > 0 && (
              <div className="p-3 bg-yellow-900/30 border-b border-yellow-800">
                <div className="flex items-center space-x-2 mb-2">
                  <Bell className="h-4 w-4 text-yellow-500" />
                  <span className="text-yellow-500 text-sm font-medium">Announcement</span>
                </div>
                <p className="text-sm text-yellow-100">{announcements[0]?.message}</p>
              </div>
            )}

            {/* Tabs */}
            <div className="flex border-b border-gray-700">
              {[
                { id: 'chat', icon: MessageSquare, label: 'Chat' },
                { id: 'polls', icon: BarChart2, label: 'Polls' },
                { id: 'qa', icon: HelpCircle, label: 'Q&A' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 py-3 px-4 text-sm font-medium flex items-center justify-center space-x-2 transition-colors ${
                    activeTab === tab.id 
                      ? 'bg-gray-700 text-white border-b-2 border-blue-500' 
                      : 'text-gray-400 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto">
              {activeTab === 'chat' && (
                <div className="flex flex-col h-full">
                  <div className="flex-1 p-4 space-y-3 overflow-y-auto">
                    {chatMessages.map((msg) => (
                      <div key={msg.id} className="flex space-x-2">
                        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                          {msg.user?.full_name?.charAt(0) || 'U'}
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-gray-400">{msg.user?.full_name}</p>
                          <p className="text-sm text-white">{msg.content}</p>
                        </div>
                      </div>
                    ))}
                    <div ref={chatEndRef} />
                  </div>
                  <form onSubmit={sendMessage} className="p-3 border-t border-gray-700">
                    <div className="flex space-x-2">
                      <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 bg-gray-700 border-gray-600 text-white"
                      />
                      <Button type="submit" size="icon" className="bg-blue-600 hover:bg-blue-700">
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </form>
                </div>
              )}

              {activeTab === 'polls' && (
                <div className="p-4 space-y-4">
                  {polls.length === 0 ? (
                    <p className="text-gray-400 text-center py-8">No active polls</p>
                  ) : (
                    polls.map((poll) => (
                      <Card key={poll.id} className="bg-gray-700 border-gray-600">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm text-white">{poll.question}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            {poll.options.map((option, idx) => {
                              const totalVotes = poll.votes?.reduce((a, b) => a + b, 0) || 0;
                              const percentage = totalVotes > 0 ? ((poll.votes?.[idx] || 0) / totalVotes) * 100 : 0;
                              
                              return (
                                <button
                                  key={idx}
                                  onClick={() => !poll.hasVoted && votePoll(poll.id, idx)}
                                  disabled={poll.hasVoted}
                                  className="w-full relative"
                                >
                                  <div 
                                    className="absolute inset-0 bg-blue-600/30 rounded"
                                    style={{ width: `${percentage}%` }}
                                  />
                                  <div className="relative p-2 text-left text-sm text-white border border-gray-600 rounded hover:bg-gray-600 transition-colors">
                                    {option} ({Math.round(percentage)}%)
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                          {poll.hasVoted && (
                            <p className="text-xs text-green-400 mt-2">You voted!</p>
                          )}
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              )}

              {activeTab === 'qa' && (
                <div className="flex flex-col h-full">
                  <div className="flex-1 p-4 space-y-3 overflow-y-auto">
                    {questions.length === 0 ? (
                      <p className="text-gray-400 text-center py-8">No questions yet</p>
                    ) : (
                      questions
                        .sort((a, b) => b.upvotes - a.upvotes)
                        .map((q) => (
                          <Card key={q.id} className={`bg-gray-700 border-gray-600 ${q.is_answered ? 'opacity-60' : ''}`}>
                            <CardContent className="p-3">
                              <p className="text-sm text-white mb-2">{q.content}</p>
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-400">{q.user?.full_name}</span>
                                <div className="flex items-center space-x-2">
                                  <button
                                    onClick={() => upvoteQuestion(q.id)}
                                    className="flex items-center space-x-1 text-gray-400 hover:text-blue-400"
                                  >
                                    <ThumbsUp className="h-3 w-3" />
                                    <span className="text-xs">{q.upvotes}</span>
                                  </button>
                                  {q.is_answered && (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-600 text-white">Answered</span>
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))
                    )}
                  </div>
                  <form onSubmit={submitQuestion} className="p-3 border-t border-gray-700">
                    <div className="flex space-x-2">
                      <Input
                        value={newQuestion}
                        onChange={(e) => setNewQuestion(e.target.value)}
                        placeholder="Ask a question..."
                        className="flex-1 bg-gray-700 border-gray-600 text-white"
                      />
                      <Button type="submit" size="icon" className="bg-blue-600 hover:bg-blue-700">
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveEvent;
