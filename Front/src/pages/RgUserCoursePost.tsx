import { IoIosArrowBack, IoIosArrowForward, IoMdHeart } from "react-icons/io";
import RgUserLayout from "../components/RgUserLayout.tsx";
import { CiFilter } from "react-icons/ci";
import { IoAdd, IoShareSocialSharp } from "react-icons/io5";
import { TbArrowsSort } from "react-icons/tb";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import PostForm from "../components/PostForm.tsx";
import DisplayPost from "../components/DisplayPost.tsx";
import VisitorLayout from "../components/VisitorLayout.tsx";

interface Post {
    postId: number;
    userId: number;
    userName: string;
    userFirstName: string;
    userLastName: string;
    userInitial: string;
    userProfileImg: string;
    type: string;
    title: string;
    description: string;
    postImg: string;
    courseId?: number;
    courseName?: string;
    categoryName?: string;
    createdAt: string;
    timeAgo: string;
    likeCount: number;
    isLiked: boolean;
}

interface Course {
    courseId: number;
    title: string;
    courseImg: string;
    categoryId: number;
    categoryName: string;
}

function useLocalToast() {
    const [toasts, setToasts] = useState<{ id: string; message: string; variant: "success" | "error" }[]>([]);

    const add = useCallback((message: string, variant: "success" | "error" = "success") => {
        const id = Math.random().toString(36).slice(2);
        setToasts(prev => [...prev, { id, message, variant }]);
        setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
    }, []);

    const ToastContainer = (
        <div className="fixed bottom-4 right-4 space-y-2 z-[9999] pointer-events-none">
            <AnimatePresence>
                {toasts.map(t => (
                    <motion.div
                        key={t.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={`px-4 py-2 rounded-lg shadow-lg pointer-events-auto ${t.variant === "error" ? "bg-red-500" : "bg-green-500"
                            } text-white`}
                    >
                        {t.message}
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );

    return { add, ToastContainer };
}

const RgUserCoursePost = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const { add, ToastContainer } = useLocalToast();

    const [course, setCourse] = useState<Course | null>(null);
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [showPostForm, setShowPostForm] = useState(false);
    const [showPostView, setShowPostView] = useState(false);
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);
    const Layout = user?.userId ? RgUserLayout : VisitorLayout;

    useEffect(() => {
        if (!id) return;

        // Fetch course details
        fetch(`/api/courses/${id}`)
            .then(res => res.json())
            .then(data => setCourse(data.course))
            .catch(err => console.error("Error fetching course:", err));

        // Fetch posts for this course
        fetch(`/api/UserPosts?courseId=${id}&filter=all`)
            .then(res => res.json())
            .then((data: Post[]) => {
                console.log("Posts response:", data);
                setPosts(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching posts:", err);
                setLoading(false);
            });
    }, [id]);

    const formatTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (seconds < 60) return `${seconds}s ago`;
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        const days = Math.floor(hours / 24);
        if (days < 30) return `${days}d ago`;
        const months = Math.floor(days / 30);
        if (months < 12) return `${months}mo ago`;
        const years = Math.floor(months / 12);
        return `${years}y ago`;
    };

    const handlePostLikeUpdate = (postId: number, likeCount: number, isLiked: boolean) => {
        setPosts(prevPosts =>
            prevPosts.map(post =>
                post.postId === postId ? { ...post, likeCount, isLiked } : post
            )
        );
        if (selectedPost && selectedPost.postId === postId) {
            setSelectedPost({ ...selectedPost, likeCount, isLiked });
        }
    };

    const handlePostLike = async (postId: number) => {
        if (!user?.userId) {
            add("Please log in to like posts", "error");
            return;
        }

        try {
            const response = await fetch(`/api/UserPosts/${postId}/like`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.userId }),
            });

            if (!response.ok) {
                throw new Error('Failed to toggle like');
            }

            // Refresh posts to get updated like counts
            fetch(`/api/UserPosts?courseId=${id}&filter=all`)
                .then(res => res.json())
                .then((data: Post[]) => setPosts(data))
                .catch(err => console.error("Error refreshing posts:", err));

        } catch (err: any) {
            console.error("Like error:", err);
            add(err.message || "Failed to like post", "error");
        }
    };

    const handlePostSave = async (postData: any, isEdit: boolean) => {
        try {
            if (!user?.userId) {
                add("Please log in to submit a post", "error");
                return;
            }

            let imageUrl = "";

            // Step 1: Upload image if provided
            if (postData.postimage instanceof File) {
                const uploadFormData = new FormData();
                uploadFormData.append('file', postData.postimage);

                const uploadRes = await fetch('/api/Uploads', {
                    method: 'POST',
                    body: uploadFormData,
                });

                if (!uploadRes.ok) {
                    const errorText = await uploadRes.text();
                    throw new Error("Image upload failed: " + (errorText || `${uploadRes.status}`));
                }

                const uploadedData = await uploadRes.json();
                imageUrl = uploadedData.path || uploadedData.url || "";
            }

            // Step 2: Create post with image URL
            const courseIdValue = postData.posttype === "course" && postData.course_id
                ? parseInt(postData.course_id)
                : parseInt(id || '0');

            const postPayload: any = {
                UserId: user.userId,
                Title: postData.title,
                Description: postData.description,
                Type: 'post',
                PostImg: imageUrl,
                CourseId: courseIdValue,
            };

            console.log("Sending post payload:", postPayload);

            const res = await fetch('/api/UserPosts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(postPayload),
            });

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(errorText || `Failed to create post: ${res.status}`);
            }

            add("Post created successfully! It will appear after admin approval.");
            setShowPostForm(false);

            // Refresh posts
            fetch(`/api/UserPosts?courseId=${id}&filter=all`)
                .then(res => res.json())
                .then((data: Post[]) => setPosts(data))
                .catch(err => console.error("Error fetching posts:", err));

        } catch (err) {
            console.error("Error saving post:", err);
            add("Failed to create post: " + (err instanceof Error ? err.message : "Unknown error"), "error");
        }
    };

    return (
        <Layout>
            <div className="max-w-screen overflow-x-hidden">
                {/* Banner */}
                <div
                    className="w-full h-[200px] relative bg-fixed bg-center bg-cover"
                    style={{ backgroundImage: `url('${course?.courseImg || '/images/Recipe.jpeg'}')` }}
                >
                    {/* Overlay */}
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-[#000000]/40 to-[#000000]/0 z-10" />

                    {/* Content */}
                    <div className="absolute top-0 left-0 w-full h-full z-20">
                        <div className="relative w-[1090px] h-full mx-auto flex items-center">
                            <div className="font-ibarra text-[48px] max-w-[500px] leading-tight font-bold text-white">
                                {course?.title || 'Loading...'}
                            </div>

                            <div className="font-inter absolute bottom-[54px] left-[4px] text-[10px] max-w-[500px] leading-tight font-[200] text-white flex items-center gap-[2px]">
                                <button className="cursor-pointer uppercase hover:text-[#DA1A32] transition-all duration-[600ms]"
                                    onClick={() => navigate('/RgUserLearn')}>
                                    Learn
                                </button>
                                <IoIosArrowForward className="text-[#DA1A32] h-[18px]" />
                                <button className="cursor-pointer uppercase hover:text-[#DA1A32] transition-all duration-[600ms]"
                                    onClick={() => navigate(`/RgUserCat/${course?.categoryId}`)}>
                                    {course?.categoryName || 'Category'}
                                </button>
                                <IoIosArrowForward className="text-[#DA1A32] h-[18px]" />
                                <button className="cursor-pointer uppercase hover:text-[#DA1A32] transition-all duration-[600ms]"
                                    onClick={() => navigate(`/RgUserCourse/${id}`)}>
                                    {course?.title || 'Course'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <style>
                    {`
                    .no-scrollbar::-webkit-scrollbar {
                        display: none;
                        }

                    .no-scrollbar {
                        -ms-overflow-style: none;  
                        scrollbar-width: none;  
                        }
                `}
                </style>

                <div className="mt-[24px] items-center text-black flex flex-col w-full mx-auto">
                    {/* Posts */}
                    <div className="items-center text-black flex flex-col w-[1090px] relative">
                        <div className="font-ibarra text-[32px] font-bold flex flex-row items-center gap-[8px]">
                            <div className="w-[16px] h-[1px] bg-[#DA1A32]" />
                            Posts
                            <div className="w-[16px] h-[1px] bg-[#DA1A32]" />
                        </div>

                        <div className="absolute flex flex-row justify-between w-full top-0 left-0">
                            <button className="cursor-pointer" onClick={() => navigate(`/RgUserCourse/${id}`)}>
                                <IoIosArrowBack className="text-[#DA1A32] h-[32px] w-[32px]" />
                            </button>


                        </div>

                        {/* Post Container */}
                        <div className="mt-[22px] w-screen max-h-[522px] overflow-y-scroll no-scrollbar pb-[64px] pt-[10px]">
                            <div className="columns-3 gap-[20px] w-[1090px] mx-auto">
                                {loading ? (
                                    <div className="col-span-3 text-center font-inter text-[14px] text-gray-500 py-[40px]">
                                        Loading posts...
                                    </div>
                                ) : posts.length === 0 ? (
                                    <div className="col-span-3 text-center font-inter text-[14px] text-gray-500 py-[40px]">
                                        No posts yet. Be the first to share your creation!
                                    </div>
                                ) : (
                                    posts.map((post) => (
                                        <button
                                            key={post.postId}
                                            onClick={() => {
                                                setSelectedPost(post);
                                                setShowPostView(true);
                                            }}
                                            className="text-left cursor-pointer hover:scale-[102%] transition-all duration-[600ms] w-full h-auto bg-white flex flex-col gap-[16px] p-[10px] shadow-[0px_0px_20px_rgba(0,0,0,0.1)] rounded-[20px] mb-4 break-inside-avoid">
                                            <div className="relative w-full h-auto rounded-[16px] overflow-hidden bg-gray-200">
                                                <img
                                                    src={post.postImg || "/images/Post.webp"}
                                                    alt={post.title}
                                                    className="w-full h-auto max-h-[377px] object-cover"
                                                    onError={(e) => { e.currentTarget.src = "/images/Post.webp"; }}
                                                />
                                            </div>

                                            <div className="flex flex-col w-full px-[6px]">
                                                <div className="flex flex-row justify-between items-center">
                                                    <div className="flex flex-row gap-[6px]">
                                                        <div className="w-[25px] h-[25px] bg-[#DA1A32] flex items-center justify-center rounded-full text-white text-[12px] overflow-hidden">
                                                            {post.userProfileImg ? (
                                                                <img src={post.userProfileImg} alt="avatar" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none' }} />
                                                            ) : (
                                                                <span>{post.userFirstName?.charAt(0) || 'U'}</span>
                                                            )}
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <div className="font-inter text-[10px] line-clamp-1 max-w-[64px]">
                                                                {post.userName}
                                                            </div>
                                                            <div className="font-inter font-light text-[7px] line-clamp-1 max-w-[64px]">
                                                                {formatTimeAgo(post.createdAt)}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-row items-center gap-2">
                                                        <button className="cursor-pointer flex flex-row justify-center -translate-y-[2px]">
                                                            <IoMdHeart className={`w-[25px] h-[25px] ${post.isLiked ? 'text-[#FF5454]' : 'text-[#D9D9D9]'}`} />
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="font-ibarra mt-[16px] line-clamp-3 text-[16px] font-bold leading-tight">
                                                    {post.title}
                                                </div>

                                                <div className="font-inter mt-[12px] line-clamp-5 text-[10px] font-light text-justify">
                                                    {post.description}
                                                </div>

                                                <div className="font-inter mt-[16px] line-clamp-4 text-[10px] font-light underline cursor-pointer">
                                                    <span className="hover:text-[#DA1A32] transition-all duration-300">#{post.courseName}</span>
                                                    <span className="hover:text-[#DA1A32] transition-all duration-300">#{post.categoryName}</span>
                                                </div>

                                                <div className="flex flex-col mt-[18px]">
                                                    <div className="bg-black w-full h-[1px]" />
                                                    <div className="flex flex-row font-inter text-[10px] font-light gap-[2px] mt-[7px] mb-[4px]">
                                                        <IoMdHeart className="w-[17px] h-[17px] text-[#FF5454]" />
                                                        <div className="translate-y-[2px]">
                                                            {post.likeCount}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </button>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                {user?.userId && (
                    <button className="fixed bottom-[20px] right-[20px] flex items-center justify-between h-[40px] bg-white border border-black rounded-full pr-[4px] pl-[22px] cursor-pointer hover:scale-105 transition-all duration-[600ms]"
                        onClick={() => {
                            if (!user?.userId) {
                                add("Please log in to create a post", "error");
                                return;
                            }
                            setShowPostForm(true);
                        }}>
                        <div className="font-inter text-[16px] font-light text-black">
                            Post
                        </div>
                        <div className="w-[30px] h-[30px] bg-[#DA1A32] flex items-center justify-center rounded-full text-white text-[12px] ml-[20px]">
                            <IoAdd className="text-white w-[32px] h-[32px]" />
                        </div>
                    </button>
                )}

                {showPostForm && (
                    <div className="fixed z-[100]">
                        <PostForm
                            onClose={() => setShowPostForm(false)}
                            onSave={handlePostSave}
                            isEdit={false}
                            postId={null}
                            userId={user?.userId || 0}
                            courseId={course?.courseId || null}
                            posttype="course"
                            from="course"
                        />
                    </div>
                )}

                {/* Post View Modal */}
                {showPostView && selectedPost && (
                    <DisplayPost
                        onClose={() => setShowPostView(false)}
                        post={selectedPost}
                        onLikeUpdate={handlePostLikeUpdate}
                    />
                )}

                {ToastContainer}
            </div>
        </Layout>
    );
};

export default RgUserCoursePost;
