import React from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import BottomNav from './components/BottomNav';
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Members from './pages/Members';
import Businesses from './pages/Businesses';
import Explore from './pages/Explore';
import Messages from './pages/Messages';
import Profile from './pages/Profile';
import BusinessProfile from './pages/BusinessProfile';
import EventDetails from './pages/EventDetails';
import Events from './pages/Events';
import Notifications from './pages/Notifications';
import Market from './pages/Market';
import MarketDetails from './pages/MarketDetails';
import Media from './pages/Media';
import MediaDetails from './pages/MediaDetails';
import ChatSession from './pages/ChatSession';

const AppContent = () => {
    const location = useLocation();
    
    // Hide bottom nav in chat session and login/signup pages
    const hideBottomNav = location.pathname.includes('/messages/chat/') || location.pathname === '/' || location.pathname === '/signup';

    return (
        <div className="antialiased text-gray-900 bg-gray-50 min-h-screen font-sans selection:bg-primary-100">
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/home" element={<Home />} />
                <Route path="/members" element={<Members />} />
                <Route path="/businesses" element={<Businesses />} />
                <Route path="/business/:id" element={<BusinessProfile />} />
                <Route path="/explore" element={<Explore />} />
                <Route path="/events" element={<Events />} />
                <Route path="/event/:id" element={<EventDetails />} />
                <Route path="/market" element={<Market />} />
                <Route path="/market/:id" element={<MarketDetails />} />
                <Route path="/media" element={<Media />} />
                <Route path="/media/:id" element={<MediaDetails />} />
                <Route path="/messages" element={<Messages />} />
                <Route path="/messages/chat/:userId" element={<ChatSession />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/profile/:id" element={<Profile />} />
                <Route path="/notifications" element={<Notifications />} />
            </Routes>
            {!hideBottomNav && <BottomNav />}
        </div>
    );
};

function App() {
  return (
    <Router>
        <AppContent />
    </Router>
  );
}

export default App;