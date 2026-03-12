export interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  role: 'attendee' | 'organizer' | 'speaker' | 'admin';
  created_at: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  timezone: string;
  banner_image?: string;
  organizer_id: string;
  status: 'draft' | 'published' | 'ongoing' | 'completed' | 'cancelled';
  is_public: boolean;
  max_attendees?: number;
  location_type: 'virtual' | 'hybrid' | 'in_person';
  meeting_link?: string;
  address?: string;
  created_at: string;
  updated_at: string;
  branding?: EventBranding;
}

export interface EventBranding {
  primary_color?: string;
  secondary_color?: string;
  logo_url?: string;
  favicon_url?: string;
  custom_css?: string;
}

export interface TicketType {
  id: string;
  event_id: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
  quantity_available: number;
  quantity_sold: number;
  sale_start_date?: string;
  sale_end_date?: string;
  is_active: boolean;
  created_at: string;
}

export interface Registration {
  id: string;
  event_id: string;
  user_id: string;
  ticket_type_id: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'refunded';
  payment_status: 'pending' | 'completed' | 'failed' | 'refunded';
  payment_amount: number;
  payment_currency: string;
  registration_date: string;
  checked_in: boolean;
  checked_in_at?: string;
  qr_code?: string;
  created_at: string;
  event?: Event;
  ticket_type?: TicketType;
  user?: User;
}

export interface Session {
  id: string;
  event_id: string;
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  session_type: 'keynote' | 'workshop' | 'panel' | 'networking' | 'breakout' | 'qa';
  speaker_ids: string[];
  max_attendees?: number;
  meeting_link?: string;
  recording_url?: string;
  is_recorded: boolean;
  created_at: string;
  speakers?: Speaker[];
}

export interface Speaker {
  id: string;
  event_id: string;
  user_id?: string;
  name: string;
  email: string;
  bio?: string;
  title?: string;
  company?: string;
  avatar_url?: string;
  social_links?: {
    twitter?: string;
    linkedin?: string;
    website?: string;
  };
  created_at: string;
}

export interface Announcement {
  id: string;
  event_id: string;
  title: string;
  content: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  sent_at: string;
  sent_by: string;
  created_at: string;
}

export interface Poll {
  id: string;
  event_id: string;
  session_id?: string;
  question: string;
  options: PollOption[];
  is_active: boolean;
  created_by: string;
  created_at: string;
  ends_at?: string;
}

export interface PollOption {
  id: string;
  poll_id: string;
  text: string;
  vote_count: number;
}

export interface PollVote {
  id: string;
  poll_id: string;
  option_id: string;
  user_id: string;
  created_at: string;
}

export interface Question {
  id: string;
  event_id: string;
  session_id?: string;
  user_id: string;
  content: string;
  is_anonymous: boolean;
  is_answered: boolean;
  upvotes: number;
  created_at: string;
  user?: User;
}

export interface ChatMessage {
  id: string;
  event_id: string;
  session_id?: string;
  user_id: string;
  content: string;
  created_at: string;
  user?: User;
}

export interface BreakoutRoom {
  id: string;
  event_id: string;
  session_id?: string;
  name: string;
  topic?: string;
  max_participants: number;
  meeting_link: string;
  moderator_id?: string;
  created_at: string;
}

export interface BreakoutParticipant {
  id: string;
  room_id: string;
  user_id: string;
  joined_at: string;
  left_at?: string;
}

export interface Feedback {
  id: string;
  event_id: string;
  session_id?: string;
  user_id: string;
  overall_rating: number;
  content_rating: number;
  speaker_rating: number;
  organization_rating: number;
  comments?: string;
  would_recommend: boolean;
  created_at: string;
}

export interface Sponsor {
  id: string;
  event_id: string;
  name: string;
  description?: string;
  logo_url?: string;
  website_url?: string;
  tier: 'platinum' | 'gold' | 'silver' | 'bronze';
  booth_enabled: boolean;
  booth_content?: {
    banner_url?: string;
    documents?: string[];
    video_url?: string;
  };
  created_at: string;
}

export interface NetworkingProfile {
  id: string;
  user_id: string;
  event_id: string;
  bio?: string;
  interests: string[];
  looking_for: string[];
  is_visible: boolean;
  created_at: string;
  user?: User;
}

export interface NetworkingMatch {
  id: string;
  event_id: string;
  user1_id: string;
  user2_id: string;
  match_score: number;
  status: 'pending' | 'accepted' | 'declined';
  created_at: string;
  user1?: User;
  user2?: User;
}

export interface Recording {
  id: string;
  event_id: string;
  session_id?: string;
  title: string;
  description?: string;
  video_url: string;
  thumbnail_url?: string;
  duration?: number;
  is_public: boolean;
  view_count: number;
  created_at: string;
  session?: Session;
}

export interface Analytics {
  event_id: string;
  total_registrations: number;
  total_attendees: number;
  attendance_rate: number;
  session_analytics: SessionAnalytics[];
  engagement_metrics: EngagementMetrics;
  demographics: Demographics;
}

export interface SessionAnalytics {
  session_id: string;
  session_title: string;
  attendees_count: number;
  avg_watch_time: number;
  poll_participation: number;
  qa_submissions: number;
}

export interface EngagementMetrics {
  total_poll_votes: number;
  total_questions: number;
  total_chat_messages: number;
  avg_session_rating: number;
}

export interface Demographics {
  countries: Record<string, number>;
  industries: Record<string, number>;
  job_titles: Record<string, number>;
}

export interface Bookmark {
  id: string;
  user_id: string;
  session_id: string;
  created_at: string;
  session?: Session;
}
