import { IoIosArrowBack, IoIosArrowForward, IoMdHeart } from "react-icons/io";
import RgUserLayout from "../components/RgUserLayout.tsx";
import { CiFilter } from "react-icons/ci";
import { IoAdd, IoShareSocialSharp } from "react-icons/io5";
import { TbArrowsSort } from "react-icons/tb";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import PostForm from "../components/PostForm.tsx";

interface Post {
    postId: number;
    userId: number;
    userName: string;
    userInitial: string;
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
                        className={`px-4 py-2 rounded-lg shadow-lg pointer-events-auto ${
                            t.variant === "error" ? "bg-red-500" : "bg-green-500"
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
        <RgUserLayout>
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
                                        <div key={post.postId} className="cursor-pointer hover:scale-[102%] transition-all duration-[600ms] w-full h-auto bg-white flex flex-col gap-[16px] p-[10px] shadow-[0px_0px_20px_rgba(0,0,0,0.1)] rounded-[20px] mb-4 break-inside-avoid">
                                            <div className="relative w-full h-auto rounded-[16px] overflow-hidden">
                                                <img src={post.postImg || "/images/Post.webp"} alt="post" className="w-full h-auto max-h-[377px] object-cover z-0" />
                                                <div className="absolute top-0 left-0 w-full h-full bg-[#fefefe]/20 backdrop-blur-[12px] z-10" />
                                                <div className="absolute top-0 left-0 w-full h-full flex items-center z-20">
                                                    <img src={post.postImg || "/images/Post.webp"} alt="post" className="w-full object-cover" />
                                                </div>
                                            </div>

                                            <div className="flex flex-col w-full px-[6px]">
                                                <div className="flex flex-row justify-between items-center">
                                                    {/* Profile and time */}
                                                    <div className="flex flex-row gap-[6px]">
                                                        <div className="w-[25px] h-[25px] bg-[#DA1A32] flex items-center justify-center rounded-full text-white text-[12px]">
                                                            {post.userInitial}
                                                        </div>

                                                        <div className="flex flex-col">
                                                            <div className="font-inter text-[10px] line-clamp-1 max-w-[64px]">
                                                                {post.userName}
                                                            </div>

                                                            <div className="font-inter font-light text-[7px] line-clamp-1 max-w-[64px]">
                                                                {post.timeAgo}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-row items-center gap-2">
                                                        {/* Share button */}
                                                        <button className="cursor-pointer flex flex-row justify-center items-center -translate-y-[2px] w-[20px] h-[20px] rounded-full bg-[#D9D9D9]">
                                                            <IoShareSocialSharp className="w-[14px] h-[14px] text-[#4f4f4f]" />
                                                        </button>

                                                        {/* Like button */}
                                                        <button className="cursor-pointer flex flex-row justify-center -translate-y-[2px]" onClick={(e) => {
                                                            e.stopPropagation();
                                                            handlePostLike(post.postId);
                                                        }}>
                                                            <IoMdHeart className={`w-[25px] h-[25px] ${post.isLiked ? 'text-[#FF5454]' : 'text-[#D9D9D9]'}`} />
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Post title */}
                                                <div className="font-ibarra mt-[16px] line-clamp-3 text-[16px] font-bold leading-tight">
                                                    {post.title}
                                                </div>

                                                {/* Post Description */}
                                                <div className="font-inter mt-[12px] line-clamp-5 text-[10px] font-light text-justify">
                                                    {post.description}
                                                </div>

                                                {/* Hashtags, Course Name and Category */}
                                                <div className="font-inter mt-[16px] line-clamp-4 text-[10px] font-light underline cursor-pointer">
                                                    {post.courseName && <span>#{post.courseName}</span>}
                                                    {post.categoryName && <span>#{post.categoryName}</span>}
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
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>

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

                {ToastContainer}
            </div>
        </RgUserLayout>
    );
};

export default RgUserCoursePost;
