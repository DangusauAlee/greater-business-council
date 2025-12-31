import React, { useState, useEffect } from 'react';
import { 
    Settings, LogOut, ChevronRight, User, Bell, Shield, HelpCircle, ArrowLeft, 
    Heart, MessageSquare, Share2, MessageCircle, UserPlus, Check, Trash2,
    Camera, Mail, Phone as PhoneIcon, Lock, Eye, EyeOff, FileText, Smartphone,
    X, Copy, Repeat, ArrowRight
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import BusinessCard from '../components/cards/BusinessCard';
import { BlogPost, Business } from '../types';
import { getUserPosts, getUserBusinesses, getMemberProfile } from '../services/mockApi';

type ViewState = 'profile' | 'settings' | 'edit_profile' | 'notifications' | 'privacy' | 'support';

const Profile = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [view, setView] = useState<ViewState>('profile');
    const [activeTab, setActiveTab] = useState<'posts' | 'listings'>('posts');
    const [userPosts, setUserPosts] = useState<BlogPost[]>([]);
    const [userBusinesses, setUserBusinesses] = useState<Business[]>([]);
    const [profileUser, setProfileUser] = useState<any>(null);
    const [requestSent, setRequestSent] = useState(false);

    // Interaction States
    const [activeCommentPostId, setActiveCommentPostId] = useState<number | null>(null);
    const [sharePostId, setSharePostId] = useState<number | null>(null);
    const [commentText, setCommentText] = useState("");
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    // Edit Form State
    const [editForm, setEditForm] = useState({
        name: '',
        email: '',
        phone: '',
        bio: '',
        avatar: ''
    });

    // Mock Comments Data
    const mockComments = [
        { id: 1, user: "Fatima Sani", text: "This is exactly what we needed in the region.", time: "2h ago", avatar: "https://picsum.photos/id/1011/100/100" },
        { id: 2, user: "Yusuf Galadima", text: "Great update! Looking forward to the event.", time: "1h ago", avatar: "https://picsum.photos/id/1012/100/100" },
        { id: 3, user: "Kabir Musa", text: "Are non-members allowed to attend?", time: "30m ago", avatar: "https://picsum.photos/id/1001/100/100" },
    ];

    // Default "Me" User
    const meUser = {
        id: 0,
        name: "Dr. Abdullahi Musa",
        email: "a.musa@example.com",
        phone: "+234 800 123 4567",
        role: "Member",
        bio: "CEO at Tofa Textiles | Passionate about industrial growth in Northern Nigeria. 20+ years experience in manufacturing and supply chain.",
        avatar: "https://picsum.photos/id/1005/200/200",
        is_friend: true, 
        stats: {
            friends: 342,
            posts: 56,
            businesses: 2
        }
    };

    useEffect(() => {
        const loadProfile = async () => {
            if (id) {
                const member = await getMemberProfile(parseInt(id));
                if (member) {
                    setProfileUser(member);
                    if (member.is_friend) {
                        getUserPosts().then(setUserPosts);
                        getUserBusinesses().then(setUserBusinesses);
                    }
                }
            } else {
                setProfileUser(meUser);
                setEditForm({
                    name: meUser.name,
                    email: meUser.email,
                    phone: meUser.phone,
                    bio: meUser.bio,
                    avatar: meUser.avatar
                });
                getUserPosts().then(setUserPosts);
                getUserBusinesses().then(setUserBusinesses);
            }
        };

        loadProfile();
    }, [id]);

    // Helper for Toast
    const showToast = (msg: string) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(null), 3000);
    };

    // Interaction Handlers
    const toggleLike = (postId: number) => {
        setUserPosts(currentPosts => currentPosts.map(post => {
            if (post.id === postId) {
                const isLiked = !post.is_liked;
                return {
                    ...post,
                    is_liked: isLiked,
                    likes_count: isLiked ? post.likes_count + 1 : post.likes_count - 1
                };
            }
            return post;
        }));
    };

    const handleShareAction = (action: 'repost' | 'copy') => {
        setSharePostId(null);
        if (action === 'repost') {
            showToast("Post reposted to your timeline!");
        } else {
            showToast("Link copied to clipboard!");
        }
    };

    const handleSendComment = () => {
        if (!commentText.trim()) return;
        showToast("Comment posted!");
        setCommentText("");
    };

    const handleDeletePost = (postId: number) => {
        if (window.confirm("Are you sure you want to delete this post?")) {
            setUserPosts(prev => prev.filter(p => p.id !== postId));
        }
    };

    const handleDeleteBusiness = (businessId: number) => {
        if (window.confirm("Are you sure you want to delete this business listing? This action cannot be undone.")) {
            setUserBusinesses(prev => prev.filter(b => b.id !== businessId));
        }
    };

    const handleSaveProfile = () => {
        setProfileUser((prev: any) => ({
            ...prev,
            name: editForm.name,
            email: editForm.email,
            phone: editForm.phone,
            bio: editForm.bio,
            avatar: editForm.avatar
        }));
        setView('settings');
        showToast("Profile updated successfully!");
    };

    // Helper components
    const MenuItem = ({ icon: Icon, label, color = "text-gray-600", onClick }: { icon: any, label: string, color?: string, onClick?: () => void }) => (
        <button onClick={onClick} className="w-full flex items-center justify-between p-4 hover:bg-gray-50 active:bg-gray-100 transition-colors">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center border border-primary-900/10">
                    <Icon size={18} className={color} />
                </div>
                <span className="text-sm font-medium text-gray-700">{label}</span>
            </div>
            <ChevronRight size={16} className="text-gray-300" />
        </button>
    );

    const ToggleItem = ({ label, description, defaultChecked = false }: { label: string, description?: string, defaultChecked?: boolean }) => {
        const [checked, setChecked] = useState(defaultChecked);
        return (
            <div className="flex items-center justify-between py-4 border-b border-primary-900/5 last:border-0">
                <div className="pr-4">
                    <h4 className="text-sm font-medium text-gray-800">{label}</h4>
                    {description && <p className="text-xs text-gray-500 mt-0.5">{description}</p>}
                </div>
                <button 
                    onClick={() => setChecked(!checked)}
                    className={`w-11 h-6 rounded-full transition-colors relative ${checked ? 'bg-primary-600' : 'bg-gray-300'}`}
                >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-sm ${checked ? 'left-6' : 'left-1'}`}></div>
                </button>
            </div>
        );
    };

    if (!profileUser) return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-500">Loading...</div>;

    const isMe = !id; 
    const showActivity = isMe || profileUser.is_friend;

    // --- RENDER SUB-PAGES ---

    if (view === 'settings') {
        return (
            <div className="bg-gray-50 min-h-screen animate-in slide-in-from-right duration-300 relative">
                <div className="sticky top-0 bg-white z-30 px-4 py-3 flex items-center gap-3 shadow-sm border-b border-primary-900/10">
                    <button 
                        onClick={() => setView('profile')}
                        className="p-2 bg-white border border-primary-900/10 rounded-full text-gray-600 hover:bg-gray-50 active:scale-95 transition-all"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-lg font-bold text-gray-800">Settings</h1>
                </div>

                <div className="px-4 mt-6">
                    <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-primary-900/10">
                        <MenuItem icon={User} label="Edit Profile" onClick={() => setView('edit_profile')} />
                        <MenuItem icon={Bell} label="Notifications" onClick={() => setView('notifications')} />
                        <MenuItem icon={Shield} label="Privacy & Security" onClick={() => setView('privacy')} />
                        <MenuItem icon={HelpCircle} label="Help & Support" onClick={() => setView('support')} />
                        <div className="h-px bg-primary-900/10"></div>
                        <MenuItem icon={LogOut} label="Log Out" color="text-red-500" />
                    </div>
                </div>
                <p className="text-center text-[10px] text-gray-400 mt-8">GKBC Mobile App v1.0.0</p>
                {/* Toast Notification */}
                {toastMessage && (
                    <div className="fixed top-24 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-full text-xs font-bold shadow-2xl backdrop-blur z-[60] animate-in fade-in zoom-in duration-200 flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        {toastMessage}
                    </div>
                )}
            </div>
        );
    }

    if (view === 'edit_profile') {
        return (
            <div className="bg-gray-50 min-h-screen animate-in slide-in-from-right duration-300">
                <div className="sticky top-0 bg-white z-30 px-4 py-3 flex items-center justify-between shadow-sm border-b border-primary-900/10">
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={() => setView('settings')}
                            className="p-2 bg-white border border-primary-900/10 rounded-full text-gray-600 hover:bg-gray-50 active:scale-95 transition-all"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <h1 className="text-lg font-bold text-gray-800">Edit Profile</h1>
                    </div>
                    <button 
                        onClick={handleSaveProfile}
                        className="text-primary-600 font-bold text-sm px-2"
                    >
                        Save
                    </button>
                </div>

                <div className="px-4 py-6">
                    {/* Avatar Upload */}
                    <div className="flex justify-center mb-8">
                        <div className="relative">
                            <div className="w-28 h-28 rounded-full p-1 bg-white shadow-sm border border-primary-900/10">
                                <img 
                                    src={editForm.avatar} 
                                    alt="Profile" 
                                    className="w-full h-full rounded-full object-cover border-2 border-white"
                                />
                            </div>
                            <button className="absolute bottom-1 right-1 p-2 bg-primary-600 text-white rounded-full border-2 border-white shadow-md active:scale-95 transition-transform">
                                <Camera size={16} />
                            </button>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Full Name</label>
                            <div className="relative">
                                <User size={18} className="absolute left-3 top-3 text-gray-400" />
                                <input 
                                    type="text" 
                                    value={editForm.name}
                                    onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                                    className="w-full bg-white border border-primary-900/10 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-primary-100 focus:border-primary-400 outline-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Bio</label>
                            <div className="relative">
                                <textarea 
                                    value={editForm.bio}
                                    onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                                    className="w-full bg-white border border-primary-900/10 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary-100 focus:border-primary-400 outline-none h-24 resize-none leading-relaxed"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Email Address</label>
                            <div className="relative">
                                <Mail size={18} className="absolute left-3 top-3 text-gray-400" />
                                <input 
                                    type="email" 
                                    value={editForm.email}
                                    onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                                    className="w-full bg-white border border-primary-900/10 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-primary-100 focus:border-primary-400 outline-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Phone Number</label>
                            <div className="relative">
                                <PhoneIcon size={18} className="absolute left-3 top-3 text-gray-400" />
                                <input 
                                    type="tel" 
                                    value={editForm.phone}
                                    onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                                    className="w-full bg-white border border-primary-900/10 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-primary-100 focus:border-primary-400 outline-none"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (view === 'notifications') {
        return (
            <div className="bg-gray-50 min-h-screen animate-in slide-in-from-right duration-300">
                <div className="sticky top-0 bg-white z-30 px-4 py-3 flex items-center gap-3 shadow-sm border-b border-primary-900/10">
                    <button 
                        onClick={() => setView('settings')}
                        className="p-2 bg-white border border-primary-900/10 rounded-full text-gray-600 hover:bg-gray-50 active:scale-95 transition-all"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-lg font-bold text-gray-800">Notifications</h1>
                </div>

                <div className="px-4 mt-6">
                    <div className="bg-white rounded-3xl p-5 shadow-sm border border-primary-900/10">
                        <ToggleItem label="Push Notifications" description="Receive push notifications on this device" defaultChecked={true} />
                        <ToggleItem label="Email Alerts" description="Get summaries and important updates via email" defaultChecked={true} />
                        <ToggleItem label="SMS Notifications" description="Receive urgent security alerts via SMS" defaultChecked={false} />
                        <div className="h-px bg-primary-900/10 my-2"></div>
                        <ToggleItem label="New Followers" defaultChecked={true} />
                        <ToggleItem label="Post Likes & Comments" defaultChecked={true} />
                        <ToggleItem label="Business Inquiries" defaultChecked={true} />
                        <ToggleItem label="Event Reminders" defaultChecked={true} />
                    </div>
                </div>
            </div>
        );
    }

    if (view === 'privacy') {
        return (
            <div className="bg-gray-50 min-h-screen animate-in slide-in-from-right duration-300">
                <div className="sticky top-0 bg-white z-30 px-4 py-3 flex items-center gap-3 shadow-sm border-b border-primary-900/10">
                    <button 
                        onClick={() => setView('settings')}
                        className="p-2 bg-white border border-primary-900/10 rounded-full text-gray-600 hover:bg-gray-50 active:scale-95 transition-all"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-lg font-bold text-gray-800">Privacy & Security</h1>
                </div>

                <div className="px-4 mt-6 space-y-6">
                    <div className="bg-white rounded-3xl p-5 shadow-sm border border-primary-900/10">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Account Security</h3>
                        <button className="w-full flex items-center justify-between py-3 border-b border-primary-900/5">
                            <span className="text-sm font-medium text-gray-800">Change Password</span>
                            <ChevronRight size={16} className="text-gray-300" />
                        </button>
                        <div className="py-3">
                             <ToggleItem label="Two-Factor Authentication" description="Secure your account with 2FA" defaultChecked={false} />
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl p-5 shadow-sm border border-primary-900/10">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Privacy</h3>
                        <ToggleItem label="Private Profile" description="Only approved friends can see your posts" defaultChecked={false} />
                        <ToggleItem label="Show Online Status" defaultChecked={true} />
                        <button className="w-full flex items-center justify-between py-3 border-t border-primary-900/5 mt-2">
                            <span className="text-sm font-medium text-gray-800">Blocked Users</span>
                            <ChevronRight size={16} className="text-gray-300" />
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (view === 'support') {
         return (
            <div className="bg-gray-50 min-h-screen animate-in slide-in-from-right duration-300">
                <div className="sticky top-0 bg-white z-30 px-4 py-3 flex items-center gap-3 shadow-sm border-b border-primary-900/10">
                    <button 
                        onClick={() => setView('settings')}
                        className="p-2 bg-white border border-primary-900/10 rounded-full text-gray-600 hover:bg-gray-50 active:scale-95 transition-all"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-lg font-bold text-gray-800">Help & Support</h1>
                </div>

                <div className="px-4 mt-6">
                    <div className="bg-white rounded-3xl p-5 shadow-sm border border-primary-900/10 mb-6">
                        <h3 className="font-bold text-gray-800 mb-4">Frequently Asked Questions</h3>
                        <div className="space-y-4">
                            {[
                                "How do I verify my business?",
                                "How do I change my subscription plan?",
                                "Who can see my profile?",
                                "How to contact other members?"
                            ].map((q, i) => (
                                <div key={i} className="border-b border-primary-900/5 last:border-0 pb-4 last:pb-0">
                                    <div className="flex justify-between items-center text-sm font-medium text-gray-700">
                                        {q}
                                        <ChevronRight size={16} className="text-gray-300" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <button className="w-full bg-primary-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-primary-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                        <MessageCircle size={18} />
                        Contact Support Team
                    </button>

                    <div className="mt-8 text-center space-y-2">
                        <p className="text-xs text-gray-400">Support Email: support@greaterkano.com</p>
                        <p className="text-xs text-gray-400">Helpline: +234 800 GKBC HELP</p>
                    </div>
                </div>
            </div>
        );
    }

    // --- MAIN PROFILE VIEW ---
    return (
        <div className="bg-gray-50 min-h-screen pb-24 relative">
            {/* Header Profile Section */}
            <div className={`bg-white rounded-b-[2.5rem] shadow-sm pt-safe overflow-hidden relative border-b border-primary-900/10 ${!showActivity ? 'pb-8' : ''}`}>
                <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-primary-600 to-primary-800"></div>
                
                <div className="flex justify-between px-4 pt-4 relative z-10">
                    <button 
                        onClick={() => navigate(-1)}
                        className="p-2 text-white/90 hover:text-white bg-white/10 backdrop-blur-md rounded-full border border-white/20"
                    >
                        <ArrowLeft size={22} />
                    </button>
                    {isMe ? (
                        <button 
                            onClick={() => setView('settings')}
                            className="p-2 text-white/90 hover:text-white bg-white/10 backdrop-blur-md rounded-full border border-white/20"
                        >
                            <Settings size={22} />
                        </button>
                    ) : (
                         <div className="w-10"></div> // Spacer
                    )}
                </div>
                
                <div className="flex flex-col items-center px-6 pb-8 relative z-10 -mt-2">
                    <div className="w-28 h-28 rounded-full p-1 bg-white shadow-lg mb-3 border border-primary-900/10">
                        <img 
                            src={profileUser.avatar} 
                            alt={profileUser.name} 
                            className="w-full h-full rounded-full object-cover border-4 border-white ring-1 ring-primary-900/10"
                        />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800 leading-tight text-center">{profileUser.name}</h2>
                    <p className="text-xs font-semibold text-primary-600 mb-2">{profileUser.role}</p>
                    
                    {/* Bio */}
                    <p className="text-sm text-gray-500 text-center leading-relaxed max-w-xs mb-6">
                        {profileUser.bio}
                    </p>

                    {/* Action Button for Non-Me Users */}
                    {!isMe && (
                        <div className="mb-6 w-full max-w-xs">
                            {profileUser.is_friend ? (
                                <button 
                                    onClick={() => navigate('/messages')}
                                    className="w-full py-2.5 bg-primary-600 text-white rounded-xl font-semibold shadow-lg shadow-primary-200 flex items-center justify-center gap-2 active:scale-95 transition-all"
                                >
                                    <MessageCircle size={18} />
                                    <span>Send Message</span>
                                </button>
                            ) : (
                                <button 
                                    onClick={() => setRequestSent(true)}
                                    disabled={requestSent}
                                    className={`
                                        w-full py-2.5 rounded-xl font-semibold flex items-center justify-center gap-2 active:scale-95 transition-all
                                        ${requestSent 
                                            ? 'bg-green-50 text-green-600 border border-green-200' 
                                            : 'bg-white border border-primary-900/10 text-primary-600 hover:bg-primary-50'}
                                    `}
                                >
                                    {requestSent ? (
                                        <>
                                            <Check size={18} />
                                            <span>Request Sent</span>
                                        </>
                                    ) : (
                                        <>
                                            <UserPlus size={18} />
                                            <span>Connect</span>
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    )}

                    {/* Stats */}
                    <div className="flex divide-x divide-primary-900/10 w-full max-w-sm bg-white border border-primary-900/10 rounded-2xl py-3 shadow-sm">
                        <div className="flex-1 flex flex-col items-center">
                            <span className="font-bold text-lg text-gray-800">{profileUser.stats.friends}</span>
                            <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Friends</span>
                        </div>
                        <div className="flex-1 flex flex-col items-center">
                            <span className="font-bold text-lg text-gray-800">{profileUser.stats.posts}</span>
                            <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Posts</span>
                        </div>
                        <div className="flex-1 flex flex-col items-center">
                            <span className="font-bold text-lg text-gray-800">{profileUser.stats.businesses}</span>
                            <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Business</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Profile Activity Section - Only visible if Me or Friend */}
            {showActivity ? (
                <div className="mt-4 animate-in slide-in-from-bottom duration-500">
                    <div className="flex items-center px-4 border-b border-primary-900/10 bg-white sticky top-0 z-20">
                        <button 
                            onClick={() => setActiveTab('posts')}
                            className={`flex-1 py-3 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'posts' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                        >
                            Posts
                        </button>
                        <button 
                            onClick={() => setActiveTab('listings')}
                            className={`flex-1 py-3 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'listings' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                        >
                            Listings
                        </button>
                    </div>

                    <div className="px-4 py-4 space-y-4">
                        {activeTab === 'posts' ? (
                            userPosts.length > 0 ? (
                                userPosts.map(post => (
                                    <div key={post.id} className="bg-white rounded-2xl p-4 shadow-sm border border-primary-900/10 relative">
                                        {isMe && (
                                            <button 
                                                onClick={() => handleDeletePost(post.id)}
                                                className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition-colors p-1"
                                                title="Delete Post"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        )}
                                        <div className="flex items-center gap-3 mb-3">
                                            <img src={profileUser.avatar} alt={profileUser.name} className="w-8 h-8 rounded-full border border-primary-900/10" />
                                            <div>
                                                <h4 className="text-sm font-bold text-gray-900">{profileUser.name}</h4>
                                                <p className="text-[10px] text-gray-400">{post.created_at}</p>
                                            </div>
                                        </div>
                                        <h3 className="font-bold text-gray-800 text-sm mb-1">{post.title}</h3>
                                        <p className="text-xs text-gray-600 leading-relaxed mb-3">{post.excerpt}</p>
                                        {post.image_url && (
                                            <div className="w-full h-32 bg-gray-100 rounded-xl mb-3 overflow-hidden border border-primary-900/10">
                                                <img src={post.image_url} alt="" className="w-full h-full object-cover" />
                                            </div>
                                        )}
                                        <div className="flex items-center gap-4 pt-2 border-t border-primary-900/10">
                                            <button 
                                                onClick={() => toggleLike(post.id)}
                                                className={`flex items-center gap-1 text-xs transition-colors active:scale-110 ${post.is_liked ? 'text-primary-600' : 'text-gray-400 hover:text-red-500'}`}
                                            >
                                                <Heart 
                                                    size={16} 
                                                    fill={post.is_liked ? "currentColor" : "none"}
                                                    className={post.is_liked ? "animate-pulse" : ""}
                                                />
                                                <span>{post.likes_count}</span>
                                            </button>
                                            <button 
                                                onClick={() => setActiveCommentPostId(post.id)}
                                                className="flex items-center gap-1 text-gray-400 hover:text-primary-600 text-xs transition-colors"
                                            >
                                                <MessageSquare size={16} />
                                                <span>{post.comments_count}</span>
                                            </button>
                                            <button 
                                                onClick={() => setSharePostId(post.id)}
                                                className="ml-auto text-gray-400 hover:text-gray-600 active:scale-95 transition-transform"
                                            >
                                                <Share2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8 text-gray-400 text-sm">No recent activity</div>
                            )
                        ) : (
                            userBusinesses.length > 0 ? (
                                userBusinesses.map(biz => (
                                    <BusinessCard 
                                        key={biz.id} 
                                        business={biz} 
                                        onDelete={isMe ? () => handleDeleteBusiness(biz.id) : undefined}
                                    />
                                ))
                            ) : (
                                <div className="text-center py-8 text-gray-400 text-sm">No businesses listed</div>
                            )
                        )}
                    </div>
                </div>
            ) : (
                // Restricted View Message
                <div className="flex flex-col items-center justify-center py-12 px-6 text-center animate-in fade-in duration-500">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 border border-primary-900/10">
                        <Shield size={24} className="text-gray-400" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-1">Private Profile</h3>
                    <p className="text-xs text-gray-500 max-w-xs">
                        Connect with <strong>{profileUser.name}</strong> to see their posts, business listings, and recent activity.
                    </p>
                </div>
            )}

            {/* Comments Bottom Sheet */}
            {activeCommentPostId !== null && (
                <>
                    <div 
                        className="fixed inset-0 bg-black/30 z-50 backdrop-blur-sm transition-opacity"
                        onClick={() => setActiveCommentPostId(null)}
                    ></div>
                    <div className="fixed bottom-0 left-0 right-0 bg-white z-[60] rounded-t-[2rem] shadow-xl border-t border-gray-100 max-h-[80vh] flex flex-col animate-in slide-in-from-bottom duration-300">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                            <h3 className="font-bold text-gray-800">Comments</h3>
                            <button 
                                onClick={() => setActiveCommentPostId(null)}
                                className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>
                        
                        <div className="overflow-y-auto p-4 space-y-4 flex-1">
                            {mockComments.map(comment => (
                                <div key={comment.id} className="flex gap-3">
                                    <img src={comment.avatar} alt={comment.user} className="w-8 h-8 rounded-full border border-gray-100 shrink-0" />
                                    <div className="flex-1 bg-gray-50 rounded-2xl rounded-tl-none p-3 border border-gray-100">
                                        <div className="flex justify-between items-baseline mb-1">
                                            <span className="text-xs font-bold text-gray-900">{comment.user}</span>
                                            <span className="text-[10px] text-gray-400">{comment.time}</span>
                                        </div>
                                        <p className="text-xs text-gray-600 leading-relaxed">{comment.text}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="p-4 border-t border-gray-100 bg-white pb-safe">
                            <div className="flex gap-2 items-center bg-gray-50 p-1.5 pr-2 rounded-full border border-gray-200 focus-within:ring-2 focus-within:ring-primary-100 focus-within:border-primary-400 transition-all">
                                <img 
                                    src="https://picsum.photos/id/64/100/100" 
                                    className="w-8 h-8 rounded-full border border-white"
                                    alt="My Avatar"
                                />
                                <input 
                                    type="text" 
                                    placeholder="Add a comment..."
                                    className="flex-1 bg-transparent border-none focus:ring-0 text-sm placeholder-gray-400 text-gray-800"
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
                                    autoFocus
                                />
                                <button 
                                    onClick={handleSendComment}
                                    disabled={!commentText.trim()}
                                    className={`
                                        p-2 rounded-full transition-all 
                                        ${commentText.trim() ? 'bg-primary-600 text-white shadow-sm' : 'bg-gray-200 text-gray-400'}
                                    `}
                                >
                                    <ArrowRight size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Share Bottom Sheet */}
            {sharePostId !== null && (
                <>
                    <div 
                        className="fixed inset-0 bg-black/30 z-50 backdrop-blur-sm transition-opacity"
                        onClick={() => setSharePostId(null)}
                    ></div>
                    <div className="fixed bottom-0 left-0 right-0 bg-white z-[60] rounded-t-[2rem] shadow-xl border-t border-gray-100 p-6 animate-in slide-in-from-bottom duration-300 pb-safe">
                        <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto mb-6"></div>
                        <h3 className="font-bold text-gray-800 mb-4 text-center">Share this post</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <button 
                                onClick={() => handleShareAction('repost')}
                                className="flex flex-col items-center justify-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:bg-primary-50 hover:border-primary-200 transition-all group"
                            >
                                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100 group-hover:scale-110 transition-transform">
                                    <Repeat size={24} className="text-gray-600 group-hover:text-primary-600" />
                                </div>
                                <span className="text-xs font-bold text-gray-700">Repost</span>
                            </button>
                            
                            <button 
                                onClick={() => handleShareAction('copy')}
                                className="flex flex-col items-center justify-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:bg-primary-50 hover:border-primary-200 transition-all group"
                            >
                                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100 group-hover:scale-110 transition-transform">
                                    <Copy size={24} className="text-gray-600 group-hover:text-primary-600" />
                                </div>
                                <span className="text-xs font-bold text-gray-700">Copy Link</span>
                            </button>
                        </div>
                        <button 
                            onClick={() => setSharePostId(null)}
                            className="w-full mt-6 py-3 text-sm font-semibold text-gray-500 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </>
            )}

            {/* Toast Notification */}
            {toastMessage && (
                <div className="fixed top-24 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-full text-xs font-bold shadow-2xl backdrop-blur z-[60] animate-in fade-in zoom-in duration-200 flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    {toastMessage}
                </div>
            )}
        </div>
    );
};

export default Profile;