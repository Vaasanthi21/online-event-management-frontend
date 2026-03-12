import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import RegisterAttendee from './pages/RegisterAttendee';
import RegisterOrganizer from './pages/RegisterOrganizer';
import MyRegistrations from './pages/MyRegistrations';
import Speakers from './pages/Speakers';
import Sponsors from './pages/Sponsors';
import Dashboard from './pages/Dashboard';
import Events from './pages/Events';
import CreateEvent from './pages/CreateEvent';
import EditEvent from './pages/EditEvent';
import EventFeedback from './pages/EventFeedback';
import EventAnalytics from './pages/EventAnalytics';
import EventDetail from './pages/EventDetail';
import LiveEvent from './pages/LiveEvent';
import SpeakerManagement from './pages/SpeakerManagement';
import Networking from './pages/Networking';
import Recordings from './pages/Recordings';
import SponsorBooths from './pages/SponsorBooths';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const AppLayout: React.FC<{ children: React.ReactNode; showNavbar?: boolean }> = ({ 
  children, 
  showNavbar = true 
}) => {
  return (
    <div className="min-h-screen bg-background">
      {showNavbar && <Navbar />}
      {children}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route 
            path="/" 
            element={
              <AppLayout>
                <Home />
              </AppLayout>
            } 
          />
          <Route 
            path="/login" 
            element={
              <AppLayout showNavbar={false}>
                <Login />
              </AppLayout>
            } 
          />
          <Route 
            path="/register" 
            element={
              <AppLayout showNavbar={false}>
                <Register />
              </AppLayout>
            } 
          />
          <Route 
            path="/register/attendee" 
            element={
              <AppLayout showNavbar={false}>
                <RegisterAttendee />
              </AppLayout>
            } 
          />
          <Route 
            path="/register/organizer" 
            element={
              <AppLayout showNavbar={false}>
                <RegisterOrganizer />
              </AppLayout>
            } 
          />
          <Route 
            path="/events" 
            element={
              <AppLayout>
                <Events />
              </AppLayout>
            } 
          />
          <Route 
            path="/speakers" 
            element={
              <AppLayout>
                <Speakers />
              </AppLayout>
            } 
          />
          <Route 
            path="/sponsors" 
            element={
              <AppLayout>
                <Sponsors />
              </AppLayout>
            } 
          />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <AppLayout>
                  <Dashboard />
                </AppLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/my-registrations"
            element={
              <PrivateRoute>
                <AppLayout>
                  <MyRegistrations />
                </AppLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/events/create"
            element={
              <PrivateRoute>
                <AppLayout>
                  <CreateEvent />
                </AppLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/events/:id/edit"
            element={
              <PrivateRoute>
                <AppLayout>
                  <EditEvent />
                </AppLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/events/:id/feedback"
            element={
              <PrivateRoute>
                <AppLayout>
                  <EventFeedback />
                </AppLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/events/:id/analytics"
            element={
              <PrivateRoute>
                <AppLayout>
                  <EventAnalytics />
                </AppLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/events/:id"
            element={
              <AppLayout>
                <EventDetail />
              </AppLayout>
            }
          />
          <Route
            path="/events/:id/live"
            element={
              <PrivateRoute>
                <LiveEvent />
              </PrivateRoute>
            }
          />
          <Route
            path="/events/:id/speakers"
            element={
              <PrivateRoute>
                <AppLayout>
                  <SpeakerManagement />
                </AppLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/events/:id/networking"
            element={
              <PrivateRoute>
                <AppLayout>
                  <Networking />
                </AppLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/events/:id/recordings"
            element={
              <PrivateRoute>
                <AppLayout>
                  <Recordings />
                </AppLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/events/:id/sponsors"
            element={
              <AppLayout>
                <SponsorBooths />
              </AppLayout>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
