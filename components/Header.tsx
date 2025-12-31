import React from 'react';
import { Bell, Search, Hexagon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
    title?: string;
    showSearch?: boolean;
}

const Header: React.FC<HeaderProps> = ({ title = "GKBC", showSearch = true }) => {
    const navigate = useNavigate();

    return (
        <header className="sticky top-0 z-30 bg-primary-600 px-4 py-3 shadow-md">
            <div className="relative flex items-center justify-between h-10">
                {/* Left Side: Logo & Brand */}
                <div className="flex items-center gap-2 z-10 shrink-0">
                    <div className="text-white">
                        <Hexagon size={24} strokeWidth={2.5} fill="currentColor" className="text-white/20 stroke-white" />
                    </div>
                    <span className="text-lg font-black tracking-tight text-white">GKBC</span>
                </div>

                {/* Center: Title (Absolute centering) */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                    <h1 className="text-lg font-bold text-white tracking-wide whitespace-nowrap">{title}</h1>
                </div>
                
                {/* Right Side: Actions */}
                <div className="flex items-center gap-2 z-10 shrink-0">
                    {showSearch && (
                        <button className="p-2 bg-white/10 rounded-full text-white hover:bg-white/20 active:scale-95 transition-all border border-white/10">
                            <Search size={18} />
                        </button>
                    )}
                    <button 
                        onClick={() => navigate('/notifications')}
                        className="p-2 bg-white/10 rounded-full text-white hover:bg-white/20 relative active:scale-95 transition-all border border-white/10"
                    >
                        <Bell size={18} />
                        <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                    </button>
                    <button 
                        onClick={() => navigate('/profile')}
                        className="w-9 h-9 rounded-full bg-white/10 p-0.5 ring-2 ring-white/20 shadow-sm active:scale-95 transition-all ml-1"
                    >
                        <img 
                            src="https://picsum.photos/id/64/100/100" 
                            alt="Profile" 
                            className="w-full h-full rounded-full object-cover border border-white/50"
                        />
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;