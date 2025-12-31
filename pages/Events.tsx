import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Plus, Calendar, MapPin, Clock, Upload, AlignLeft, Users } from 'lucide-react';
import { Event } from '../types';
import { getEvents } from '../services/mockApi';

const Events = () => {
    const navigate = useNavigate();
    const [events, setEvents] = useState<Event[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        getEvents().then(data => {
            // Sort by date logic (using a mock year for parsing since data lacks year)
            // In a real app, dates would be ISO strings
            const sorted = [...data].sort((a, b) => {
                const dateA = new Date(`${a.start_time} ${new Date().getFullYear()}`).getTime();
                const dateB = new Date(`${b.start_time} ${new Date().getFullYear()}`).getTime();
                return dateA - dateB;
            });
            setEvents(sorted);
        });
    }, []);

    const filteredEvents = events.filter(event => 
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isCreating) {
        return (
            <div className="pb-24 bg-gray-50 min-h-screen">
                <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md px-4 py-3 flex items-center gap-3 shadow-sm border-b border-primary-900/10">
                    <button 
                        onClick={() => setIsCreating(false)}
                        className="p-2 bg-white border border-primary-900/10 rounded-full text-gray-600 hover:bg-gray-50 active:scale-95 transition-all"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-lg font-bold text-gray-800">Create Event</h1>
                </div>

                <div className="px-4 mt-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <div className="bg-white rounded-3xl p-5 shadow-sm border border-primary-900/10">
                        <div className="text-center mb-6">
                            <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-2 text-orange-600 ring-1 ring-orange-100">
                                <Calendar size={24} />
                            </div>
                            <h3 className="font-bold text-gray-800">New Event Details</h3>
                            <p className="text-xs text-gray-400">Share your event with the community.</p>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Event Title</label>
                                <input type="text" className="w-full bg-white border border-primary-900/10 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary-100 focus:border-primary-400 outline-none" placeholder="e.g. Annual Tech Summit" />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Date</label>
                                    <input type="date" className="w-full bg-white border border-primary-900/10 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary-100 focus:border-primary-400 outline-none text-gray-600" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Time</label>
                                    <input type="time" className="w-full bg-white border border-primary-900/10 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary-100 focus:border-primary-400 outline-none text-gray-600" />
                                </div>
                            </div>

                             <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Location</label>
                                <div className="relative">
                                    <input type="text" className="w-full bg-white border border-primary-900/10 rounded-xl pl-9 pr-3 py-2.5 text-sm focus:ring-2 focus:ring-primary-100 focus:border-primary-400 outline-none" placeholder="Venue Address or Link" />
                                    <MapPin size={16} className="absolute left-3 top-3 text-gray-400" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
                                <div className="relative">
                                    <textarea className="w-full bg-white border border-primary-900/10 rounded-xl pl-9 pr-3 py-2.5 text-sm focus:ring-2 focus:ring-primary-100 focus:border-primary-400 outline-none h-32 resize-none" placeholder="What is this event about?"></textarea>
                                    <AlignLeft size={16} className="absolute left-3 top-3 text-gray-400" />
                                </div>
                            </div>

                            <div className="border-2 border-dashed border-primary-900/20 rounded-xl p-6 flex flex-col items-center justify-center text-gray-400 hover:bg-gray-50 hover:border-primary-200 transition-colors cursor-pointer">
                                <Upload size={24} className="mb-2" />
                                <span className="text-xs font-medium">Upload Cover Image</span>
                            </div>

                            <button className="w-full bg-primary-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-primary-200 active:scale-[0.98] transition-all border border-primary-900/10">
                                Publish Event
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="pb-24 bg-gray-50 min-h-screen">
             {/* Header */}
            <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md px-4 py-3 flex items-center justify-between shadow-sm border-b border-primary-900/10">
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => navigate(-1)}
                        className="p-2 bg-white border border-primary-900/10 rounded-full text-gray-600 hover:bg-gray-50 active:scale-95 transition-all"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-lg font-bold text-gray-800">All Events</h1>
                </div>
                <button 
                    onClick={() => setIsCreating(true)}
                    className="px-3 py-2 bg-primary-600 text-white rounded-full text-xs font-bold shadow-md shadow-primary-200 flex items-center gap-1 active:scale-95 transition-all"
                >
                    <Plus size={16} />
                    Create
                </button>
            </div>

            {/* Search Bar */}
            <div className="sticky top-[60px] z-20 bg-gray-50 px-4 pt-4 pb-2 backdrop-blur-sm">
                <div className="relative mb-3">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search size={18} className="text-gray-400" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-10 pr-3 py-3 border border-primary-900/10 rounded-2xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary-200 focus:border-primary-400 sm:text-sm transition-all shadow-sm"
                        placeholder="Search events by title, location..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Events List */}
            <div className="px-4 mt-2 space-y-4">
                {filteredEvents.map(event => (
                    <div 
                        key={event.id}
                        onClick={() => navigate(`/event/${event.id}`)}
                        className="bg-white rounded-2xl p-3 shadow-sm border border-primary-900/10 flex gap-4 cursor-pointer hover:shadow-md transition-all active:scale-[0.99]"
                    >
                        {/* Date Box / Image */}
                        <div className="w-24 h-24 rounded-xl bg-gray-200 shrink-0 relative overflow-hidden">
                             <img src={event.image_url} alt={event.title} className="w-full h-full object-cover" />
                             <div className="absolute top-0 left-0 bg-white/90 backdrop-blur rounded-br-lg px-2 py-1 text-center border-r border-b border-primary-900/10">
                                 <span className="block text-[10px] text-primary-600 font-bold uppercase">{event.start_time.split(' ')[0]}</span>
                                 <span className="block text-lg font-bold text-gray-800 leading-none">{event.start_time.split(' ')[1].replace(',', '')}</span>
                             </div>
                        </div>

                        <div className="flex-1 py-1 flex flex-col justify-between">
                            <div>
                                <h3 className="font-bold text-gray-800 text-sm mb-1 line-clamp-2">{event.title}</h3>
                                <div className="flex items-center gap-2 mb-1">
                                    <Clock size={12} className="text-gray-400" />
                                    <span className="text-[10px] text-gray-500">{event.start_time}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin size={12} className="text-gray-400" />
                                    <span className="text-[10px] text-gray-500 line-clamp-1">{event.location}</span>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-2 mt-2">
                                <div className="flex -space-x-1.5">
                                    <div className="w-5 h-5 rounded-full bg-gray-200 border border-white"></div>
                                    <div className="w-5 h-5 rounded-full bg-gray-300 border border-white"></div>
                                    <div className="w-5 h-5 rounded-full bg-gray-400 border border-white flex items-center justify-center text-[6px] text-white font-bold">
                                        +{event.attendees_count > 99 ? '99' : event.attendees_count}
                                    </div>
                                </div>
                                <span className="text-[10px] text-primary-600 font-bold">Attending</span>
                            </div>
                        </div>
                    </div>
                ))}

                {filteredEvents.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                            <Calendar size={24} className="text-gray-400" />
                        </div>
                        <h3 className="text-gray-900 font-bold text-sm">No events found</h3>
                        <p className="text-gray-500 text-xs mt-1">Try changing your search terms</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Events;