import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { App as CapApp } from '@capacitor/app';
import { Network } from '@capacitor/network';
import { Toast } from '@capacitor/toast';

// Components
import BottomNav from './components/BottomNav';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Members from './pages/Members';
import Businesses from './pages/Businesses';
import BusinessProfile from './pages/BusinessProfile';
import Explore from './pages/Explore';
import Messages from './pages/Messages';
import ChatSession from './pages/ChatSession';
import Profile from './pages/Profile';
import Events from './pages/Events';
import EventDetails from './pages/EventDetails';
import Market from './pages/Market';
import MarketDetails from './pages/MarketDetails';
import Media from './pages/Media';
import MediaDetails from './pages/MediaDetails';
import Notifications from './pages/Notifications';
import PaymentVerification from './pages/PaymentVerification';
import AdminDashboard from './pages/AdminDashboard';

// Auth store
import { useAuthStore } from './store/authStore';

const AppContent = () => {
  const location = useLocation();
  const { user, initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, []);

  // Network monitoring
  useEffect(() => {
    const handler = Network.addListener('networkStatusChange', status => {
      if (!status.connected) {
        Toast.show({
          text: 'No internet connection',
          duration: 'short',
          position: 'bottom'
        });
      }
    });

    return () => {
      handler.then(h => h.remove());
    };
  }, []);

  // Android back button
  useEffect(() => {
    const handler = CapApp.addListener('backButton', ({ canGoBack }) => {
      if (!canGoBack) {
        CapApp.exitApp();
      } else {
        window.history.back();
      }
    });

    return () => {
      handler.then(h => h.remove());
    };
  }, []);

  const hideBottomNav = 
    location.pathname.includes('/messages/chat/') || 
    location.pathname === '/' || 
    location.pathname === '/signup' ||
    location.pathname === '/payment-verification' ||
    location.pathname === '/admin';

  // Protected route wrapper
  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    if (!user) {
      return ;
    }
    return <>{children}</>;
  };

  return (
    
      
        } />
        } />
        } />
        
        } />
        } />
        } />
        } />
        } />
        } />
        } />
        } />
        } />
        } />
        } />
        } />
        } />
        } />
        } />
        } />
        } />
      
      
      {!hideBottomNav && user && }
    
  );
};

function App() {
  return (
    
      
    
  );
}

export default App;