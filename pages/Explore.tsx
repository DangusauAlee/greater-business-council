import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import { Calendar, Newspaper, ShoppingBag, Video, ChevronLeft, MapPin, Clock, Briefcase, Plus, Search, DollarSign, Filter } from 'lucide-react';
import { Event, Classified, Job } from '../types';
import { getEvents, getClassifieds, getJobs } from '../services/mockApi';
import { useNavigate } from 'react-router-dom';

const Explore = () => {
    // View State: 'explore' is the main dashboard, 'jobs' is the sub-page
    const [view, setView] = useState<'explore' | 'jobs'>('explore');
    const navigate = useNavigate();
    
    // Data States
    const [events, setEvents] = useState<Event[]>([]);
    const [classifieds, setClassifieds] = useState<Classified[]>([]);
    const [jobs, setJobs] = useState<Job[]>([]);

    // Job Board States
    const [jobTab, setJobTab] = useState<'all' | 'my' | 'new'>('all');
    const [jobSearch, setJobSearch] = useState("");

    useEffect(() => {
        getEvents().then(setEvents);
        getClassifieds().then(setClassifieds);
        getJobs().then(setJobs);
    }, []);

    const QuickAction = ({ icon: Icon, label, color, onClick }: { icon: any, label: string, color: string, onClick?: () => void }) => (
        <button onClick={onClick} className="flex flex-col items-center gap-2 group">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${color} shadow-sm border border-primary-900/10 group-active:scale-95 transition-transform`}>
                <Icon size={24} className="text-white" />
            </div>
            <span className="text-[10px] font-semibold text-gray-600">{label}</span>
        </button>
    );

    // --- EMPLOYMENT BOARD VIEW ---
    if (view === 'jobs') {
        const filteredJobs = jobs.filter(job => {
            if (jobTab === 'my' && !job.is_owner) return false;
            if (jobSearch) {
                const term = jobSearch.toLowerCase();
                return job.title.toLowerCase().includes(term) || job.company.toLowerCase().includes(term);
            }
            return true;
        });

        return (
            <div className="pb-24 bg-gray-50 min-h-screen">
                {/* Custom Sub-page Header */}
                <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md px-4 py-3 flex items-center gap-3 shadow-sm border-b border-primary-900/10">
                    <button 
                        onClick={() => setView('explore')}
                        className="p-2 bg-white border border-primary-900/10 rounded-full text-gray-600 hover:bg-gray-50 active:scale-95 transition-all"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <h1 className="text-lg font-bold text-gray-800">Employment Board</h1>
                </div>

                {/* Search & Filter Bar */}
                <div className="sticky top-[60px] z-20 bg-gray-50 px-4 pt-4 pb-2 backdrop-blur-sm">
                    {jobTab !== 'new' && (
                        <div className="relative mb-3">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search size={18} className="text-gray-400" />
                            </div>
                            <input
                                type="text"
                                className="block w-full pl-10 pr-3 py-3 border border-primary-900/10 rounded-2xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary-200 focus:border-primary-400 sm:text-sm transition-all shadow-sm"
                                placeholder="Search jobs, companies..."
                                value={jobSearch}
                                onChange={(e) => setJobSearch(e.target.value)}
                            />
                        </div>
                    )}

                    {/* Navigation Tabs */}
                    <div className="flex p-1 bg-white rounded-xl border border-primary-900/10 shadow-sm mb-2">
                        <button
                            onClick={() => setJobTab('all')}
                            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                                jobTab === 'all' 
                                    ? 'bg-primary-50 text-primary-600 shadow-sm border border-primary-900/10' 
                                    : 'text-gray-500 hover:text-gray-700 border border-transparent'
                            }`}
                        >
                            Find Jobs
                        </button>
                        <button
                            onClick={() => setJobTab('my')}
                            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                                jobTab === 'my' 
                                    ? 'bg-primary-50 text-primary-600 shadow-sm border border-primary-900/10' 
                                    : 'text-gray-500 hover:text-gray-700 border border-transparent'
                            }`}
                        >
                            My Listings
                        </button>
                        <button
                            onClick={() => setJobTab('new')}
                            className={`flex-none px-3 py-2 flex items-center gap-1 text-xs font-semibold rounded-lg transition-all ${
                                jobTab === 'new' 
                                    ? 'bg-primary-600 text-white shadow-sm border border-primary-900/10' 
                                    : 'text-primary-600 bg-primary-50 hover:bg-primary-100 border border-primary-900/10'
                            }`}
                        >
                            <Plus size={14} />
                            Post Job
                        </button>
                    </div>
                </div>

                <div className="px-4 mt-2">
                    {jobTab === 'new' ? (
                        // Post Job Form
                        <div className="bg-white rounded-3xl p-5 shadow-sm border border-primary-900/10 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <div className="text-center mb-6">
                                <div className="w-12 h-12 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-2 text-primary-600 ring-1 ring-primary-900/10">
                                    <Briefcase size={24} />
                                </div>
                                <h3 className="font-bold text-gray-800">Post a Job</h3>
                                <p className="text-xs text-gray-400">Find the best talent in Kano</p>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Job Title</label>
                                    <input type="text" className="w-full bg-white border border-primary-900/10 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary-100 focus:border-primary-400 outline-none" placeholder="e.g. Sales Manager" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Company</label>
                                    <input type="text" className="w-full bg-white border border-primary-900/10 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary-100 focus:border-primary-400 outline-none" placeholder="Your Company Name" />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">Type</label>
                                        <select className="w-full bg-white border border-primary-900/10 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary-100 focus:border-primary-400 outline-none text-gray-600">
                                            <option>Full-time</option>
                                            <option>Part-time</option>
                                            <option>Contract</option>
                                            <option>Remote</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">Salary Range</label>
                                        <input type="text" className="w-full bg-white border border-primary-900/10 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary-100 focus:border-primary-400 outline-none" placeholder="e.g. 150k-200k" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
                                    <textarea className="w-full bg-white border border-primary-900/10 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary-100 focus:border-primary-400 outline-none h-32 resize-none" placeholder="Job requirements and details..."></textarea>
                                </div>
                                <button className="w-full bg-primary-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-primary-200 active:scale-[0.98] transition-all border border-primary-900/10">
                                    Publish Listing
                                </button>
                            </div>
                        </div>
                    ) : (
                        // Job List
                        <div className="space-y-3">
                            {filteredJobs.map(job => (
                                <div key={job.id} className="bg-white p-4 rounded-2xl shadow-sm border border-primary-900/10 hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-gray-50 border border-primary-900/10 p-0.5 shrink-0">
                                                <img src={job.logo_url} alt={job.company} className="w-full h-full object-cover rounded-md" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-sm text-gray-800 leading-tight">{job.title}</h3>
                                                <p className="text-xs text-gray-500">{job.company}</p>
                                            </div>
                                        </div>
                                        <span className="bg-primary-50 text-primary-700 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide border border-primary-900/10">
                                            {job.type}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-4 mt-3 mb-4">
                                        <div className="flex items-center gap-1.5 text-gray-400">
                                            <MapPin size={14} />
                                            <span className="text-xs">{job.location}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-gray-400">
                                            <DollarSign size={14} />
                                            <span className="text-xs">{job.salary_range}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-gray-400">
                                            <Clock size={14} />
                                            <span className="text-xs">{job.posted_at}</span>
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <button className="flex-1 bg-primary-600 text-white text-xs font-bold py-2 rounded-xl shadow-sm shadow-primary-200 border border-primary-900/10 active:scale-95 transition-transform">
                                            {job.is_owner ? 'Manage Listing' : 'Apply Now'}
                                        </button>
                                        {!job.is_owner && (
                                            <button className="px-3 bg-gray-50 text-gray-500 rounded-xl border border-primary-900/10 hover:bg-gray-100 transition-colors">
                                                <Briefcase size={16} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {filteredJobs.length === 0 && (
                                <div className="text-center py-10">
                                    <p className="text-gray-400 text-sm">No jobs found.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // --- MAIN EXPLORE VIEW ---
    return (
        <div className="pb-24 bg-gray-50 min-h-screen">
            <Header title="Explore GKBC" showSearch={false} />

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-4 gap-2 px-4 py-6 bg-white rounded-b-[2rem] shadow-sm border-b border-primary-900/10 mb-6">
                <QuickAction icon={Briefcase} label="Jobs" color="bg-blue-600" onClick={() => setView('jobs')} />
                <QuickAction icon={Calendar} label="Events" color="bg-orange-500" onClick={() => navigate('/events')} />
                <QuickAction icon={ShoppingBag} label="Market" color="bg-emerald-500" onClick={() => navigate('/market')} />
                <QuickAction icon={Video} label="Media" color="bg-purple-500" onClick={() => navigate('/media')} />
            </div>

            {/* Upcoming Events Section */}
            <div className="px-4 mb-6">
                <div className="flex justify-between items-center mb-3">
                    <h2 className="text-lg font-bold text-gray-800">Upcoming Events</h2>
                    <span 
                        onClick={() => navigate('/events')} 
                        className="text-xs text-primary-600 font-medium cursor-pointer"
                    >
                        View All
                    </span>
                </div>
                
                <div className="flex overflow-x-auto gap-4 no-scrollbar pb-2">
                    {events.map(event => (
                        <div 
                            key={event.id} 
                            onClick={() => navigate(`/event/${event.id}`)}
                            className="min-w-[260px] bg-white rounded-2xl p-3 shadow-sm border border-primary-900/10 cursor-pointer hover:shadow-md transition-all active:scale-[0.98]"
                        >
                            <div className="h-32 rounded-xl bg-gray-200 mb-3 relative overflow-hidden">
                                <img src={event.image_url} alt={event.title} className="w-full h-full object-cover" />
                                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur rounded-lg px-2 py-1 text-xs font-bold text-primary-700 border border-primary-900/10">
                                    Nov 12
                                </div>
                            </div>
                            <h3 className="font-bold text-gray-800 text-sm mb-1">{event.title}</h3>
                            <div className="flex items-center gap-2 mb-1">
                                <Clock size={12} className="text-gray-400" />
                                <span className="text-[10px] text-gray-500">{event.start_time}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin size={12} className="text-gray-400" />
                                <span className="text-[10px] text-gray-500">{event.location}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Classifieds Section */}
            <div className="px-4">
                 <div className="flex justify-between items-center mb-3">
                    <h2 className="text-lg font-bold text-gray-800">Marketplace</h2>
                    <span 
                        className="text-xs text-primary-600 font-medium cursor-pointer" 
                        onClick={() => navigate('/market')}
                    >
                        View All
                    </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    {classifieds.map(item => (
                        <div key={item.id} onClick={() => navigate(`/market/${item.id}`)} className="bg-white p-2 rounded-2xl shadow-sm border border-primary-900/10 active:scale-[0.98] transition-transform">
                            <div className="h-28 rounded-xl bg-gray-100 mb-2 overflow-hidden border border-primary-900/10">
                                <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                            </div>
                            <h4 className="font-bold text-xs text-gray-800 line-clamp-1">{item.title}</h4>
                            <p className="text-primary-600 font-bold text-sm">{item.price}</p>
                            <span className="text-[10px] text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded mt-1 inline-block border border-primary-900/10">
                                {item.category}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Explore;