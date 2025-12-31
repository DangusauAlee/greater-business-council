import React, { useEffect, useState } from 'react';
import { Heart, MessageSquare, Share2, Image as ImageIcon, Send, X, Copy, Repeat, ArrowRight, Loader2 } from 'lucide-react';
import Header from '../components/Header';
import { BlogPost } from '../types';
import { getFeed } from '../services/mockApi';

const Home = () => {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [postText, setPostText] = useState("");
    const [isPosting, setIsPosting] = useState(false);
    
    // Interaction States
    const [activeCommentPostId, setActiveCommentPostId] = useState<number | null>(null);
    const [sharePostId, setSharePostId] = useState<number | null>(null);
    const [commentText, setCommentText] = useState("");
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    // Mock Comments Data
    const mockComments = [
        { id: 1, user: "Fatima Sani", text: "This is exactly what we needed in the region.", time: "2h ago", avatar: "https://picsum.photos/id/1011/100/100" },
        { id: 2, user: "Yusuf Galadima", text: "Great update! Looking forward to the event.", time: "1h ago", avatar: "https://picsum.photos/id/1012/100/100" },
        { id: 3, user: "Kabir Musa", text: "Are non-members allowed to attend?", time: "30m ago", avatar: "https://picsum.photos/id/1001/100/100" },
    ];

    useEffect(() => {
        getFeed().then(setPosts);
    }, []);

    // Helper for Toast
    const showToast = (msg: string) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(null), 3000);
    };

    // Interaction Handlers
    const toggleLike = (postId: number) => {
        setPosts(currentPosts => currentPosts.map(post => {
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

    const handleCreatePost = () => {
        if (!postText.trim()) return;
        
        setIsPosting(true);

        // Simulate API call
        setTimeout(() => {
            const newPost: BlogPost = {
                id: Date.now(),
                title: "My New Update",
                excerpt: postText,
                image_url: "",
                author_name: "Dr. Abdullahi Musa", // Current User
                created_at: "Just now",
                likes_count: 0,
                comments_count: 0,
                is_liked: false
            };

            setPosts(prev => [newPost, ...prev]);
            setPostText("");
            setIsPosting(false);
            showToast("Your post has been published successfully!");
        }, 1200);
    };

    return (
        <div className="pb-24 bg-gray-100 min-h-screen relative">
            <Header title="Feeds" showSearch={false} />
            
            {/* Create Post Section */}
            <div className="px-4 mt-4">
                <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-200 transition-shadow hover:shadow-md">
                    <div className="flex gap-3">
                         <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary-400 to-primary-600 p-0.5 shrink-0 ring-1 ring-primary-900/10">
                            <img
                                src="https://picsum.photos/id/64/100/100"
                                alt="Profile"
                                className="w-full h-full rounded-full object-cover border-2 border-white"
                            />
                        </div>
                        <div className="flex-1">
                            <textarea
                                placeholder="Share an update with the business community..."
                                className="w-full bg-white border border-gray-100 rounded-2xl p-3 text-sm text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-primary-100 focus:border-primary-400 transition-all outline-none resize-none h-20"
                                value={postText}
                                onChange={(e) => setPostText(e.target.value)}
                            />
                        </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-2 pt-2">
                        <button className="flex items-center gap-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 px-3 py-2 rounded-xl border border-transparent hover:border-primary-100 transition-colors group">
                            <div className="p-1.5 bg-gray-50 border border-gray-100 rounded-lg group-hover:bg-primary-100 group-hover:border-primary-200 transition-colors">
                                <ImageIcon size={18} className="text-gray-500 group-hover:text-primary-600" />
                            </div>
                            <span className="text-xs font-medium">Add Media</span>
                        </button>

                        <div className="flex items-center gap-2">
                             {postText && (
                                <button 
                                    onClick={() => setPostText("")}
                                    className="px-3 py-2 text-xs font-semibold text-gray-500 hover:text-red-500 transition-colors"
                                    disabled={isPosting}
                                >
                                    Cancel
                                </button>
                             )}
                            <button 
                                onClick={handleCreatePost}
                                disabled={!postText.trim() || isPosting}
                                className={`
                                    flex items-center gap-1.5 px-5 py-2 rounded-full text-xs font-bold shadow-sm border border-transparent transition-all
                                    ${postText.trim() && !isPosting
                                        ? 'bg-primary-600 text-white shadow-primary-200 hover:bg-primary-700 active:scale-95' 
                                        : 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200'}
                                `}
                            >
                                {isPosting ? (
                                    <>
                                        <span>Posting</span>
                                        <Loader2 size={14} className="animate-spin" />
                                    </>
                                ) : (
                                    <>
                                        <span>Post</span>
                                        <Send size={14} />
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Feed */}
            <div className="px-4 mt-4 space-y-5">
                {posts.map(post => (
                    <div key={post.id} className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Post Header */}
                        <div className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <img 
                                    src={post.author_name === "Dr. Abdullahi Musa" ? "https://picsum.photos/id/64/100/100" : `https://picsum.photos/seed/${post.id + 10}/100/100`} 
                                    alt={post.author_name} 
                                    className="w-10 h-10 rounded-full object-cover border border-gray-100" 
                                />
                                <div>
                                    <h4 className="font-bold text-sm text-gray-900">{post.author_name}</h4>
                                    <p className="text-[10px] text-gray-400">{post.created_at}</p>
                                </div>
                            </div>
                        </div>

                        {/* Image */}
                        {post.image_url && (
                            <div className="w-full h-48 bg-gray-100 border-y border-gray-100">
                                <img src={post.image_url} alt={post.title} className="w-full h-full object-cover" />
                            </div>
                        )}

                        {/* Content */}
                        <div className="p-4">
                            {post.title && <h3 className="font-bold text-gray-800 text-lg mb-1 leading-tight">{post.title}</h3>}
                            <p className="text-gray-600 text-xs leading-relaxed mb-3 whitespace-pre-line">
                                {post.excerpt}
                            </p>
                            
                            {/* Actions */}
                            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                                <div className="flex items-center gap-4">
                                    {/* Like Button */}
                                    <button 
                                        onClick={() => toggleLike(post.id)}
                                        className={`flex items-center gap-1.5 transition-colors active:scale-110 ${post.is_liked ? 'text-primary-600' : 'text-gray-500 hover:text-red-500'}`}
                                    >
                                        <Heart 
                                            size={18} 
                                            fill={post.is_liked ? "currentColor" : "none"}
                                            className={post.is_liked ? "animate-pulse" : ""}
                                        />
                                        <span className="text-xs font-medium">{post.likes_count}</span>
                                    </button>

                                    {/* Comment Button */}
                                    <button 
                                        onClick={() => setActiveCommentPostId(post.id)}
                                        className="flex items-center gap-1.5 text-gray-500 hover:text-primary-600 transition-colors active:scale-95"
                                    >
                                        <MessageSquare size={18} />
                                        <span className="text-xs font-medium">{post.comments_count}</span>
                                    </button>
                                </div>
                                
                                {/* Share Button */}
                                <button 
                                    onClick={() => setSharePostId(post.id)}
                                    className="text-gray-400 hover:text-gray-600 active:scale-95 transition-transform"
                                >
                                    <Share2 size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Comments Bottom Sheet */}
            {activeCommentPostId !== null && (
                <>
                    <div 
                        className="fixed inset-0 bg-black/30 z-40 backdrop-blur-sm transition-opacity"
                        onClick={() => setActiveCommentPostId(null)}
                    ></div>
                    <div className="fixed bottom-0 left-0 right-0 bg-white z-50 rounded-t-[2rem] shadow-xl border-t border-gray-100 max-h-[80vh] flex flex-col animate-in slide-in-from-bottom duration-300">
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
                        className="fixed inset-0 bg-black/30 z-40 backdrop-blur-sm transition-opacity"
                        onClick={() => setSharePostId(null)}
                    ></div>
                    <div className="fixed bottom-0 left-0 right-0 bg-white z-50 rounded-t-[2rem] shadow-xl border-t border-gray-100 p-6 animate-in slide-in-from-bottom duration-300 pb-safe">
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

export default Home;