import { IoIosArrowBack, IoIosSearch, IoMdHeart } from "react-icons/io";
import RgUserLayout from "../components/RgUserLayout.tsx";
import { CiFilter } from "react-icons/ci";
import { TbArrowsSort } from "react-icons/tb";
import { FaStar } from "react-icons/fa";
import React, { useState, useEffect } from "react";
import VisitorLayout from "../components/VisitorLayout.tsx";
import { IoAdd, IoShareSocialSharp } from "react-icons/io5";
import { getUserPosts, getLikedPosts, togglePostLike, createUserPost } from "../api/client.js";
import PostForm from "../components/PostForm.tsx";

interface Post {
    postId: number;
    userId: number;
    userName: string;
    userFirstName: string;
    userLastName: string;
    type: string;
    courseId: number;
    courseName: string;
    categoryName: string;
    title: string;
    description: string;
    postImg: string;
    createdAt: string;
    likeCount: number;
    isLiked: boolean;
}

const RgUserPost = () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const Layout = user?.userId ? RgUserLayout : VisitorLayout;

    const [active, setActive] = useState("Discover Posts");
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showPostForm, setShowPostForm] = useState(false);

    const tabs = ["Discover Posts", "Liked Posts", "My Posts"];

    useEffect(() => {
        fetchPosts();
    }, [active, user?.userId]);

    const fetchPosts = async () => {
        try {
            setLoading(true);
            setError(null);
            let data;

            if (active === "Discover Posts") {
                data = await getUserPosts(user?.userId);
            } else if (active === "Liked Posts" && user?.userId) {
                data = await getLikedPosts(user.userId);
            } else if (active === "My Posts" && user?.userId) {
                data = await getUserPosts(user.userId);
            } else {
                data = [];
            }

            setPosts(data);
        } catch (err) {
            console.error("Error fetching posts:", err);
            setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    const handleLike = async (postId: number) => {
        if (!user?.userId) return;

        try {
            const result = await togglePostLike(postId, user.userId);
            setPosts(prevPosts => 
                prevPosts.map(post => 
                    post.postId === postId 
                        ? { ...post, likeCount: result.likeCount, isLiked: result.isLiked }
                        : post
                )
            );
        } catch (err) {
            console.error("Error toggling like:", err);
        }
    };

    const handleSavePost = async (postData: any, isEdit: boolean) => {
        try {
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
            const postPayload = {
                userId: user.userId,
                title: postData.title,
                description: postData.description,
                type: postData.posttype,
                courseId: postData.posttype === "course" ? (postData.course_id || null) : null,
                postImg: imageUrl,
            };

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

            // Refresh the posts list
            setShowPostForm(false);
            await fetchPosts();
            alert("Post created successfully!");
        } catch (err) {
            console.error("Error saving post:", err);
            alert("Failed to create post: " + (err instanceof Error ? err.message : "Unknown error"));
        }
    };

    const formatTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (seconds < 60) return `${seconds} seconds ago`;
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes} minutes ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours} hours ago`;
        const days = Math.floor(hours / 24);
        if (days < 30) return `${days} days ago`;
        const months = Math.floor(days / 30);
        if (months < 12) return `${months} months ago`;
        const years = Math.floor(months / 12);
        return `${years} years ago`;
    };

    const getUserInitial = (firstName: string, lastName: string) => {
        if (firstName) return firstName.charAt(0).toUpperCase();
        if (lastName) return lastName.charAt(0).toUpperCase();
        return "?";
    };

    return (
        <Layout>
            <div className="max-w-screen overflow-x-hidden">
                <div className="w-full flex flex-col items-center">
                    <p className="font-ibarra font-bold text-black text-[36px] pt-[50px]">
                        Discover <span className="text-[#DA1A32]">Posts</span>
                    </p>
                </div>

                <div className="mt-[24px] items-center text-black flex flex-col w-[1090px] mx-auto">
                    {user?.userId && (
                        <div className="relative flex flex-row font-ibarra text-[22px] font-medium mb-[36px] gap-[16px] rounded-full bg-[#F8F5F0] p-2">
                            {tabs.map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActive(tab)}
                                    className="relative px-8 py-1 rounded-full transition-all duration-300"
                                >
                                    <span className={`relative z-10 transition-colors duration-300 ${active === tab ? "text-[#DA1A32]" : "text-black"}`}>
                                        {tab}
                                    </span>
                                    <span className={`absolute inset-0 border border-[#DA1A32] rounded-full transition-all duration-[300ms] bg-white ${active === tab ? "opacity-100" : "opacity-0"}`} />
                                </button>
                            ))}
                        </div>
                    )}

                    <div className="font-ibarra text-[24px] font-bold flex flex-row items-center gap-[8px] justify-between w-full">
                        <div className="flex items-center justify-between h-[48px] bg-white border border-black rounded-full pr-[4px] pl-[22px]">
                            <input
                                type="text"
                                placeholder="Search..."
                                className="font-inter w-[160px] bg-transparent outline-none text-black text-[16px] font-light"
                            />
                            <div className="w-[38px] h-[38px] bg-[#DA1A32] flex items-center justify-center rounded-full text-white text-[12px] cursor-pointer ml-[20px]">
                                <IoIosSearch className="text-white w-[24px] h-[24px] " />
                            </div>
                        </div>

                        <div className="flex flex-row gap-[10px]">
                            <button className="flex items-center justify-between h-[48px] bg-white border border-black rounded-full pr-[4px] pl-[22px] cursor-pointer hover:scale-105 transition-all duration-[600ms]">
                                <div className="font-inter text-[16px] font-light">Filter</div>
                                <div className="w-[38px] h-[38px] bg-[#DA1A32] flex items-center justify-center rounded-full text-white text-[12px] ml-[20px]">
                                    <CiFilter className="text-white w-[20px] h-[20px]" />
                                </div>
                            </button>
                            <button className="flex items-center justify-between h-[48px] bg-white border border-black rounded-full pr-[4px] pl-[22px] cursor-pointer hover:scale-105 transition-all duration-[600ms]">
                                <div className="font-inter text-[16px] font-light">Sort</div>
                                <div className="w-[38px] h-[38px] bg-[#DA1A32] flex items-center justify-center rounded-full text-white text-[12px] ml-[20px]">
                                    <TbArrowsSort className="text-white w-[18px] h-[18px] " />
                                </div>
                            </button>
                        </div>
                    </div>

                    <div className="mt-[22px] w-screen h-[522px] overflow-y-scroll pb-[64px] pt-[10px]">
                        {loading && (
                            <div className="flex justify-center items-center h-full">
                                <div className="font-ibarra text-[20px]">Loading posts...</div>
                            </div>
                        )}
                        {error && (
                            <div className="flex justify-center items-center h-full">
                                <div className="font-ibarra text-[20px] text-red-600">Error: {error}</div>
                            </div>
                        )}
                        {!loading && !error && posts.length === 0 && (
                            <div className="flex justify-center items-center h-full">
                                <div className="font-ibarra text-[20px]">No posts found</div>
                            </div>
                        )}
                        {!loading && !error && posts.length > 0 && (
                            <div className="columns-3 gap-[20px] w-[1090px] mx-auto">
                                {posts.map((post) => (
                                    <div key={post.postId} className="cursor-pointer hover:scale-[102%] transition-all duration-[600ms] w-full h-auto bg-white flex flex-col gap-[16px] p-[10px] shadow-[0px_0px_20px_rgba(0,0,0,0.1)] rounded-[20px] mb-4 break-inside-avoid">
                                        <img src={post.postImg || "/images/Post.webp"} alt="post" className="w-[332px] h-auto max-h-[377px] object-cover rounded-[16px] " />
                                        <div className="flex flex-col w-full px-[6px]">
                                            <div className="flex flex-row justify-between items-center">
                                                <div className="flex flex-row gap-[6px]">
                                                    <div className="w-[25px] h-[25px] bg-[#DA1A32] flex items-center justify-center rounded-full text-white text-[12px]">
                                                        {getUserInitial(post.userFirstName, post.userLastName)}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <div className="font-inter text-[10px] line-clamp-1 max-w-[64px]">
                                                            {post.userFirstName} {post.userLastName}
                                                        </div>
                                                        <div className="font-inter font-light text-[7px] line-clamp-1 max-w-[64px] ">
                                                            {formatTimeAgo(post.createdAt)}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex flex-row items-center gap-2">
                                                    <button className="cursor-pointer flex flex-row justify-center items-center -translate-y-[2px] w-[20px] h-[20px] rounded-full bg-[#D9D9D9]">
                                                        <IoShareSocialSharp className="w-[14px] h-[14px] text-[#4f4f4f]" />
                                                    </button>
                                                    {user?.userId && (
                                                        <button 
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleLike(post.postId);
                                                            }}
                                                            className="cursor-pointer flex flex-row justify-center -translate-y-[2px]"
                                                        >
                                                            <IoMdHeart className={`w-[25px] h-[25px] ${post.isLiked ? "text-[#FF5454]" : "text-[#D9D9D9]"}`} />
                                                        </button>
                                                    )}
                                                    {!user?.userId && (
                                                        <div className="cursor-pointer flex flex-row justify-center -translate-y-[2px]">
                                                            <IoMdHeart className="w-[25px] h-[25px] text-[#D9D9D9]" />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="font-ibarra mt-[16px] line-clamp-3 text-[16px] font-bold leading-tight">
                                                {post.title}
                                            </div>
                                            <div className="font-inter mt-[12px] line-clamp-5 text-[10px] font-light text-justify">
                                                {post.description}
                                            </div>
                                            <div className="font-inter mt-[16px] line-clamp-4 text-[10px] font-light underline cursor-pointer">
                                                <a>#{post.courseName}</a> <a>#{post.categoryName}</a>
                                            </div>
                                            <div className="flex flex-col mt-[18px]">
                                                <div className="bg-black w-full h-[1px]" />
                                                <div className="flex flex-row font-inter text-[10px] font-light gap-[2px] mt-[7px] mb-[4px]">
                                                    <IoMdHeart className="w-[17px] h-[17px] text-[#FF5454]" />
                                                    <div className="translate-y-[2px]">{post.likeCount}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {user?.userId && (
                        <button 
                            onClick={() => setShowPostForm(true)}
                            className="fixed bottom-[20px] right-[20px] flex items-center justify-between h-[40px] bg-white border border-black rounded-full pr-[4px] pl-[22px] cursor-pointer hover:scale-105 transition-all duration-[600ms]"
                        >
                            <div className="font-inter text-[16px] font-light text-black">Post</div>
                            <div className="w-[30px] h-[30px] bg-[#DA1A32] flex items-center justify-center rounded-full text-white text-[12px] ml-[20px]">
                                <IoAdd className="text-white w-[32px] h-[32px]" />
                            </div>
                        </button>
                    )}
                </div>
                {showPostForm && user?.userId && (
                    <PostForm 
                        onClose={() => setShowPostForm(false)}
                        onSave={handleSavePost}
                        userId={user.userId}
                        from="home"
                    />
                )}
            </div>
        </Layout>
    );
};

export default RgUserPost;
