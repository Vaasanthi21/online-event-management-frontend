import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { User, Mail, Lock, CheckCircle, ArrowRight, Ticket } from 'lucide-react';

const RegisterAttendee: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      await register(email, password, fullName, 'attendee');
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to register');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-cyan-950 via-slate-900 to-violet-950">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/20 to-violet-600/20" />
        <div className="relative text-white max-w-md">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-violet-500 rounded-xl flex items-center justify-center">
              <Ticket className="h-7 w-7 text-white" />
            </div>
            <span className="text-3xl font-bold">Convene</span>
          </div>
          <h2 className="text-4xl font-bold mb-6">Discover Amazing Events</h2>
          <p className="text-xl text-cyan-100 mb-8">
            Register for exciting events, connect with like-minded people, and expand your horizons.
          </p>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-6 w-6 text-cyan-400" />
              <span>Browse and register for events</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-6 w-6 text-cyan-400" />
              <span>Network with other attendees</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-6 w-6 text-cyan-400" />
              <span>Access recordings and resources</span>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-white/10">
            <p className="text-sm text-cyan-200">
              Want to create events instead?{' '}
              <Link to="/register/organizer" className="text-cyan-400 hover:text-cyan-300 font-semibold hover:underline">
                Register as Organizer
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <Card className="w-full max-w-md shadow-2xl border-0 bg-slate-900/80 backdrop-blur-sm">
          <CardHeader className="space-y-1 text-center">
            <div className="lg:hidden flex items-center justify-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-violet-500 rounded-lg flex items-center justify-center">
                <Ticket className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">Convene</span>
            </div>
            <div className="inline-flex items-center justify-center space-x-2 px-3 py-1 bg-cyan-500/20 rounded-full mb-2">
              <User className="h-4 w-4 text-cyan-400" />
              <span className="text-sm text-cyan-300 font-medium">Attendee Account</span>
            </div>
            <CardTitle className="text-3xl font-bold text-white">Create an account</CardTitle>
            <CardDescription className="text-slate-400">
              Join events and connect with others
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <div className="p-3 text-sm text-red-400 bg-red-950/50 rounded-lg border border-red-800">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-slate-300">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="John Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="pl-10 h-11 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-300">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-11 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-300">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Create a strong password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 h-11 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-slate-300">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 h-11 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                    required
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button 
                type="submit" 
                className="w-full h-11 bg-gradient-to-r from-cyan-600 to-violet-600 hover:from-cyan-700 hover:to-violet-700 text-white font-semibold border-0"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating account...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    Create Attendee Account
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </span>
                )}
              </Button>
              <p className="text-sm text-center text-slate-400">
                Already have an account?{' '}
                <Link to="/login" className="text-cyan-400 hover:text-cyan-300 font-semibold hover:underline">
                  Sign in
                </Link>
              </p>
              <p className="text-sm text-center text-slate-500 lg:hidden">
                Want to create events?{' '}
                <Link to="/register/organizer" className="text-violet-400 hover:text-violet-300 font-semibold hover:underline">
                  Register as Organizer
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default RegisterAttendee;
