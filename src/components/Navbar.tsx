import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/button';
import { Calendar, LogOut, Menu, Ticket, Mic2, Building2 } from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-card border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-foreground">Convene</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Link to="/events">
              <Button variant="ghost" className="text-foreground hover:text-foreground hover:bg-secondary">
                Browse Events
              </Button>
            </Link>
            <Link to="/speakers">
              <Button variant="ghost" className="text-foreground hover:text-foreground hover:bg-secondary">
                <Mic2 className="h-4 w-4 mr-2" />
                Speakers
              </Button>
            </Link>
            <Link to="/sponsors">
              <Button variant="ghost" className="text-foreground hover:text-foreground hover:bg-secondary">
                <Building2 className="h-4 w-4 mr-2" />
                Sponsors
              </Button>
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link to="/my-registrations">
                  <Button variant="ghost" className="text-foreground hover:text-foreground hover:bg-secondary">
                    <Ticket className="h-4 w-4 mr-2" />
                    My Registrations
                  </Button>
                </Link>
                <Link to="/dashboard">
                  <Button variant="ghost" className="text-foreground hover:text-foreground hover:bg-secondary">
                    Dashboard
                  </Button>
                </Link>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">{user?.full_name}</span>
                  <Button variant="outline" size="sm" onClick={handleLogout} className="border-border">
                    <LogOut className="h-4 w-4 mr-1" />
                    Logout
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" className="text-foreground hover:text-foreground hover:bg-secondary">
                    Sign In
                  </Button>
                </Link>
                <Link to="/register/attendee">
                  <Button className="bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-700 hover:to-cyan-700">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col space-y-2">
              <Link to="/events" onClick={() => setIsMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start text-foreground">
                  Browse Events
                </Button>
              </Link>
              <Link to="/speakers" onClick={() => setIsMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start text-foreground">
                  <Mic2 className="h-4 w-4 mr-2" />
                  Speakers
                </Button>
              </Link>
              <Link to="/sponsors" onClick={() => setIsMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start text-foreground">
                  <Building2 className="h-4 w-4 mr-2" />
                  Sponsors
                </Button>
              </Link>
              
              {isAuthenticated ? (
                <>
                  <Link to="/my-registrations" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start text-foreground">
                      <Ticket className="h-4 w-4 mr-2" />
                      My Registrations
                    </Button>
                  </Link>
                  <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start text-foreground">
                      Dashboard
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    className="w-full justify-start border-border"
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start text-foreground">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/register/attendee" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full bg-gradient-to-r from-violet-600 to-cyan-600">
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
