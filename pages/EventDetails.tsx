import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, Clock, Users, Share2, Ticket } from 'lucide-react';
import { Event } from '../types';
import { getEvent } from '../services/mockApi';

const EventDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState<Event | null>(null);
    const [isRegistered, setIsRegistered] = useState(false);

    useEffect(() => {
        if (id) {
            getEvent(parseInt(id)).then(e => {
                if (e) setEvent(e);
            });
        }
    }, [id]);

    if (!event) return <div className="min-h-screen flex items-center justify-center text-gray-500">Loading...</div>;

    return (
        <div className="bg-gray-50 min-h-screen pb-24 relative">
            {/* Hero Image */}
            <div className="h-64 w-full relative">
                <img src={event.image_url} alt={event.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <button 
                    onClick={() => navigate(-1)}
                    className="absolute top-4 left-4 p-2 bg-white/20 backdrop-blur-md border border-white/30 rounded-full text-white hover:bg-white/30 transition-all"
                >
                    <ArrowLeft size={20} />
                </button>
                <button className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-md border border-white/30 rounded-full text-white hover:bg-white/30 transition-all">
                    <Share2 size={20} />
                </button>
            </div>

            {/* Content Container */}
            <div className="px-4 -mt-8 relative z-10">
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-primary-900/10">
                    <span className="inline-block px-3 py-1 bg-primary-50 text-primary-700 text-[10px] font-bold uppercase tracking-wider rounded-full mb-3 border border-primary-100">
                        Upcoming Event
                    </span>
                    <h1 className="text-xl font-bold text-gray-900 leading-tight mb-4">{event.title}</h1>
                    
                    <div className="space-y-4 mb-6">
                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500 shrink-0 border border-orange-100">
                                <Calendar size={20} />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-medium">Date & Time</p>
                                <p className="text-sm font-bold text-gray-800">{event.start_time}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                             <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 shrink-0 border border-blue-100">
                                <MapPin size={20} />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-medium">Location</p>
                                <p className="text-sm font-bold text-gray-800">{event.location}</p>
                            </div>
                        </div>

                         <div className="flex items-start gap-3">
                             <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-green-500 shrink-0 border border-green-100">
                                <Users size={20} />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-medium">Attendees</p>
                                <p className="text-sm font-bold text-gray-800">{event.attendees_count} Registered</p>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-primary-900/10 pt-6">
                        <h3 className="font-bold text-gray-900 mb-2">About Event</h3>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            {event.description}
                        </p>
                    </div>

                    <div className="mt-6 flex items-center gap-2">
                         <div className="flex -space-x-2">
                            {[1, 2, 3].map(i => (
                                <img key={i} src={`https://picsum.photos/id/${100 + i}/100/100`} className="w-8 h-8 rounded-full border-2 border-white" alt="" />
                            ))}
                        </div>
                        <span className="text-xs text-gray-500 ml-2">+ {event.attendees_count - 3} others going</span>
                    </div>
                </div>
            </div>

            {/* Bottom Action Bar */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-primary-900/10 p-4 pb-safe z-30">
                <button 
                    onClick={() => setIsRegistered(!isRegistered)}
                    className={`
                        w-full py-3.5 rounded-xl font-bold text-sm shadow-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98]
                        ${isRegistered 
                            ? 'bg-green-50 text-green-600 border border-green-200 shadow-none' 
                            : 'bg-primary-600 text-white shadow-primary-200'}
                    `}
                >
                    {isRegistered ? (
                        <>
                            <span>You are Registered</span>
                            <Ticket size={18} />
                        </>
                    ) : (
                        'Register for Event'
                    )}
                </button>
            </div>
        </div>
    );
};

export default EventDetails;