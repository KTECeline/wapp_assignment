import { IoIosSearch, IoMdHeart } from "react-icons/io";
import RgUserLayout from "../components/RgUserLayout.tsx";
import { CiFilter } from "react-icons/ci";
import { TbArrowsSort } from "react-icons/tb";
import React, { useState, useEffect } from "react";
import VisitorLayout from "../components/VisitorLayout.tsx";
import { IoAdd, IoShareSocialSharp } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import { getUserPosts, getLikedPosts, togglePostLike } from "../api/client.js";
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
    const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showPostForm, setShowPostForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [showSortModal, setShowSortModal] = useState(false);
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);

    // Filter states
    const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
    const [selectedCourses, setSelectedCourses] = useState<string[]>([]);

    // Sort state
    const [sortBy, setSortBy] = useState<string>("default");

    const tabs = ["Discover Posts", "Liked Posts", "My Posts"];

    useEffect(() => {
        fetchPosts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [active, user?.userId]);

    const fetchPosts = async () => {
        try {
            setLoading(true);
            setError(null);
            let data;

            if (active === "Discover Posts") {
                // For discover posts, don't pass userId to get all posts
                data = await getUserPosts();
            } else if (active === "Liked Posts" && user?.userId) {
                data = await getLikedPosts(user.userId);
            } else if (active === "My Posts" && user?.userId) {
                // For my posts, pass the userId to get only this user's posts
                data = await getUserPosts(user.userId);
            } else {
                data = [];
            }

            console.log("Fetched posts:", data);
            setPosts(data);
            setFilteredPosts(data);
        } catch (err) {
            console.error("Error fetching posts:", err);
            setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    // Handle search
    const handleSearch = (value: string) => {
        setSearchTerm(value);
        applyFiltersAndSort(posts, value);
    };

    // Get unique post types and courses
    const getUniqueTypes = () => {
        const types = new Set(posts.map(post => post.type).filter(type => type));
        return Array.from(types);
    };

    const getUniqueCourses = () => {
        const courses = new Set(posts.map(post => post.courseName).filter(course => course));
        return Array.from(courses);
    };

    // Apply filters and sort
    const applyFiltersAndSort = (sourcePosts: Post[], search: string = searchTerm) => {
        let result = [...sourcePosts];

        // Apply search filter
        if (search.trim() !== "") {
            result = result.filter(post =>
                post.title.toLowerCase().includes(search.toLowerCase()) ||
                post.description.toLowerCase().includes(search.toLowerCase()) ||
                post.courseName.toLowerCase().includes(search.toLowerCase()) ||
                post.categoryName.toLowerCase().includes(search.toLowerCase())
            );
        }

        // Apply type filter
        if (selectedTypes.length > 0) {
            result = result.filter(post => selectedTypes.includes(post.type));
        }

        // Apply course filter
        if (selectedCourses.length > 0) {
            result = result.filter(post => selectedCourses.includes(post.courseName));
        }

        // Apply sorting
        switch (sortBy) {
            case "titleAsc":
                result.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case "titleDesc":
                result.sort((a, b) => b.title.localeCompare(a.title));
                break;
            case "newest":
                result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                break;
            case "oldest":
                result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
                break;
            case "likesHigh":
                result.sort((a, b) => b.likeCount - a.likeCount);
                break;
            case "likesLow":
                result.sort((a, b) => a.likeCount - b.likeCount);
                break;
            default:
                // Keep original order
                break;
        }

        setFilteredPosts(result);
    };

    // Apply filters and sort whenever any filter changes or posts are updated
    useEffect(() => {
        applyFiltersAndSort(posts);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedTypes, selectedCourses, sortBy, posts]);

    // Handle filter clear
    const handleClearFilters = () => {
        setSelectedTypes([]);
        setSelectedCourses([]);
        setSortBy("default");
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
            const courseId = postData.posttype === "course" && postData.course_id 
                ? parseInt(postData.course_id) 
                : null;

            const postPayload: any = {
                UserId: user.userId,
                Title: postData.title,
                Description: postData.description,
                Type: postData.posttype,
                PostImg: imageUrl,
            };

            // Only include CourseId if it's a course post
            if (courseId !== null) {
                postPayload.CourseId = courseId;
            }

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
                                value={searchTerm}
                                onChange={(e) => handleSearch(e.target.value)}
                                className="font-inter w-[160px] bg-transparent outline-none text-black text-[16px] font-light"
                            />
                            <div className="w-[38px] h-[38px] bg-[#DA1A32] flex items-center justify-center rounded-full text-white text-[12px] cursor-pointer ml-[20px]">
                                <IoIosSearch className="text-white w-[24px] h-[24px] " />
                            </div>
                        </div>

                        <div className="flex flex-row gap-[10px]">
                            <button 
                                onClick={() => setShowFilterModal(true)}
                                className="flex items-center justify-between h-[48px] bg-white border border-black rounded-full pr-[4px] pl-[22px] cursor-pointer hover:scale-105 transition-all duration-[600ms]">
                                <div className="font-inter text-[16px] font-light">Filter</div>
                                <div className="w-[38px] h-[38px] bg-[#DA1A32] flex items-center justify-center rounded-full text-white text-[12px] ml-[20px]">
                                    <CiFilter className="text-white w-[20px] h-[20px]" />
                                </div>
                            </button>
                            <button 
                                onClick={() => setShowSortModal(true)}
                                className="flex items-center justify-between h-[48px] bg-white border border-black rounded-full pr-[4px] pl-[22px] cursor-pointer hover:scale-105 transition-all duration-[600ms]">
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
                        {!loading && !error && filteredPosts.length === 0 && (
                            <div className="flex justify-center items-center h-full">
                                <div className="font-ibarra text-[20px]">No posts found</div>
                            </div>
                        )}
                        {!loading && !error && filteredPosts.length > 0 && (
                            <div className="columns-3 gap-[20px] w-[1090px] mx-auto">
                                {filteredPosts.map((post) => (
                                    <div 
                                        key={post.postId} 
                                        onClick={() => setSelectedPost(post)}
                                        className="cursor-pointer hover:scale-[102%] transition-all duration-[600ms] w-full h-auto bg-white flex flex-col gap-[16px] p-[10px] shadow-[0px_0px_20px_rgba(0,0,0,0.1)] rounded-[20px] mb-4 break-inside-avoid">
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
                                                <span>#{post.courseName}</span> <span>#{post.categoryName}</span>
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

                {/* Filter Modal */}
                {showFilterModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-2xl w-[400px] max-h-[600px] overflow-y-auto p-6 shadow-2xl">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="font-ibarra text-[24px] font-bold text-black">Filters</h2>
                                <button 
                                    onClick={() => setShowFilterModal(false)}
                                    className="text-gray-500 hover:text-black transition-all"
                                >
                                    <RxCross2 size={24} />
                                </button>
                            </div>

                            {/* Type Filter */}
                            <div className="mb-6">
                                <h3 className="font-ibarra text-[16px] font-bold text-black mb-3">Post Type</h3>
                                <div className="flex flex-col gap-2">
                                    {getUniqueTypes().map((type) => (
                                        <label key={type} className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={selectedTypes.includes(type)}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setSelectedTypes([...selectedTypes, type]);
                                                    } else {
                                                        setSelectedTypes(selectedTypes.filter(t => t !== type));
                                                    }
                                                }}
                                                className="w-4 h-4 accent-[#DA1A32]"
                                            />
                                            <span className="font-inter text-[14px] text-gray-700">{type}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Course Filter */}
                            <div className="mb-6">
                                <h3 className="font-ibarra text-[16px] font-bold text-black mb-3">Course</h3>
                                <div className="flex flex-col gap-2">
                                    {getUniqueCourses().map((course) => (
                                        <label key={course} className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={selectedCourses.includes(course)}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setSelectedCourses([...selectedCourses, course]);
                                                    } else {
                                                        setSelectedCourses(selectedCourses.filter(c => c !== course));
                                                    }
                                                }}
                                                className="w-4 h-4 accent-[#DA1A32]"
                                            />
                                            <span className="font-inter text-[14px] text-gray-700">{course}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Filter Actions */}
                            <div className="flex gap-3 pt-4 border-t">
                                <button
                                    onClick={handleClearFilters}
                                    className="flex-1 px-4 py-2 bg-gray-200 text-black rounded-full font-inter text-[14px] hover:bg-gray-300 transition-all"
                                >
                                    Clear All
                                </button>
                                <button
                                    onClick={() => setShowFilterModal(false)}
                                    className="flex-1 px-4 py-2 bg-[#DA1A32] text-white rounded-full font-inter text-[14px] hover:bg-[#b91728] transition-all"
                                >
                                    Apply
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Sort Modal */}
                {showSortModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-2xl w-[400px] max-h-[400px] overflow-y-auto p-6 shadow-2xl">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="font-ibarra text-[24px] font-bold text-black">Sort By</h2>
                                <button 
                                    onClick={() => setShowSortModal(false)}
                                    className="text-gray-500 hover:text-black transition-all"
                                >
                                    <RxCross2 size={24} />
                                </button>
                            </div>

                            <div className="flex flex-col gap-3">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="sort"
                                        checked={sortBy === "default"}
                                        onChange={() => setSortBy("default")}
                                        className="w-4 h-4 accent-[#DA1A32]"
                                    />
                                    <span className="font-inter text-[14px] text-gray-700">Default</span>
                                </label>

                                <div className="border-t pt-3 mt-2">
                                    <h3 className="font-inter text-[12px] font-bold text-gray-600 mb-2">Title</h3>
                                    <label className="flex items-center gap-2 cursor-pointer mb-2">
                                        <input
                                            type="radio"
                                            name="sort"
                                            checked={sortBy === "titleAsc"}
                                            onChange={() => setSortBy("titleAsc")}
                                            className="w-4 h-4 accent-[#DA1A32]"
                                        />
                                        <span className="font-inter text-[14px] text-gray-700">A to Z</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="sort"
                                            checked={sortBy === "titleDesc"}
                                            onChange={() => setSortBy("titleDesc")}
                                            className="w-4 h-4 accent-[#DA1A32]"
                                        />
                                        <span className="font-inter text-[14px] text-gray-700">Z to A</span>
                                    </label>
                                </div>

                                <div className="border-t pt-3 mt-2">
                                    <h3 className="font-inter text-[12px] font-bold text-gray-600 mb-2">Date Posted</h3>
                                    <label className="flex items-center gap-2 cursor-pointer mb-2">
                                        <input
                                            type="radio"
                                            name="sort"
                                            checked={sortBy === "newest"}
                                            onChange={() => setSortBy("newest")}
                                            className="w-4 h-4 accent-[#DA1A32]"
                                        />
                                        <span className="font-inter text-[14px] text-gray-700">Newest First</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="sort"
                                            checked={sortBy === "oldest"}
                                            onChange={() => setSortBy("oldest")}
                                            className="w-4 h-4 accent-[#DA1A32]"
                                        />
                                        <span className="font-inter text-[14px] text-gray-700">Oldest First</span>
                                    </label>
                                </div>

                                <div className="border-t pt-3 mt-2">
                                    <h3 className="font-inter text-[12px] font-bold text-gray-600 mb-2">Likes</h3>
                                    <label className="flex items-center gap-2 cursor-pointer mb-2">
                                        <input
                                            type="radio"
                                            name="sort"
                                            checked={sortBy === "likesHigh"}
                                            onChange={() => setSortBy("likesHigh")}
                                            className="w-4 h-4 accent-[#DA1A32]"
                                        />
                                        <span className="font-inter text-[14px] text-gray-700">Most Liked</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="sort"
                                            checked={sortBy === "likesLow"}
                                            onChange={() => setSortBy("likesLow")}
                                            className="w-4 h-4 accent-[#DA1A32]"
                                        />
                                        <span className="font-inter text-[14px] text-gray-700">Least Liked</span>
                                    </label>
                                </div>
                            </div>

                            {/* Sort Actions */}
                            <div className="flex gap-3 pt-4 border-t mt-4">
                                <button
                                    onClick={() => setSortBy("default")}
                                    className="flex-1 px-4 py-2 bg-gray-200 text-black rounded-full font-inter text-[14px] hover:bg-gray-300 transition-all"
                                >
                                    Reset
                                </button>
                                <button
                                    onClick={() => setShowSortModal(false)}
                                    className="flex-1 px-4 py-2 bg-[#DA1A32] text-white rounded-full font-inter text-[14px] hover:bg-[#b91728] transition-all"
                                >
                                    Apply
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Post Zoom Modal */}
                {selectedPost && (
                    <div 
                        className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
                        onClick={() => setSelectedPost(null)}
                    >
                        <div 
                            className="bg-white rounded-[24px] max-w-[600px] w-full max-h-[90vh] overflow-y-auto shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Close Button */}
                            <div className="sticky top-0 flex justify-between items-center p-6 border-b bg-white rounded-t-[24px]">
                                <h2 className="font-ibarra text-[24px] font-bold text-black">Post Details</h2>
                                <button 
                                    onClick={() => setSelectedPost(null)}
                                    className="text-gray-500 hover:text-black transition-all"
                                >
                                    <RxCross2 size={28} />
                                </button>
                            </div>

                            {/* Post Content */}
                            <div className="p-6 flex flex-col gap-6">
                                {/* Post Image */}
                                <img 
                                    src={selectedPost.postImg || "/images/Post.webp"} 
                                    alt="post" 
                                    className="w-full h-[400px] object-cover rounded-[16px]"
                                />

                                {/* User Info */}
                                <div className="flex flex-row gap-4 items-start">
                                    <div className="w-[50px] h-[50px] bg-[#DA1A32] flex items-center justify-center rounded-full text-white text-[18px] font-bold flex-shrink-0">
                                        {getUserInitial(selectedPost.userFirstName, selectedPost.userLastName)}
                                    </div>
                                    <div className="flex flex-col flex-1">
                                        <div className="font-ibarra text-[16px] font-bold text-black">
                                            {selectedPost.userFirstName} {selectedPost.userLastName}
                                        </div>
                                        <div className="font-inter text-[12px] text-gray-600">
                                            @{selectedPost.userName}
                                        </div>
                                        <div className="font-inter text-[11px] text-gray-500 mt-1">
                                            {formatTimeAgo(selectedPost.createdAt)}
                                        </div>
                                    </div>
                                </div>

                                {/* Post Title */}
                                <div>
                                    <h3 className="font-ibarra text-[22px] font-bold text-black leading-tight">
                                        {selectedPost.title}
                                    </h3>
                                </div>

                                {/* Post Description */}
                                <div className="font-inter text-[14px] text-gray-800 leading-relaxed text-justify">
                                    {selectedPost.description}
                                </div>

                                {/* Hashtags */}
                                <div className="font-inter text-[13px] text-gray-600 flex flex-wrap gap-3">
                                    <span className="text-[#DA1A32] font-semibold cursor-pointer hover:underline">
                                        #{selectedPost.courseName}
                                    </span>
                                    <span className="text-[#DA1A32] font-semibold cursor-pointer hover:underline">
                                        #{selectedPost.categoryName}
                                    </span>
                                </div>

                                {/* Divider */}
                                <div className="bg-gray-300 w-full h-[1px]" />

                                {/* Like Count */}
                                <div className="flex flex-row items-center gap-3 font-inter text-[14px]">
                                    <IoMdHeart className="w-[24px] h-[24px] text-[#FF5454]" />
                                    <span className="font-semibold text-black">{selectedPost.likeCount}</span>
                                    <span className="text-gray-600">people liked this</span>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-row gap-3 pt-4">
                                    {user?.userId && (
                                        <button 
                                            onClick={() => {
                                                handleLike(selectedPost.postId);
                                                setPosts(prevPosts => 
                                                    prevPosts.map(post => 
                                                        post.postId === selectedPost.postId 
                                                            ? { ...post, isLiked: !post.isLiked, likeCount: post.isLiked ? post.likeCount - 1 : post.likeCount + 1 }
                                                            : post
                                                    )
                                                );
                                                setFilteredPosts(prevPosts => 
                                                    prevPosts.map(post => 
                                                        post.postId === selectedPost.postId 
                                                            ? { ...post, isLiked: !post.isLiked, likeCount: post.isLiked ? post.likeCount - 1 : post.likeCount + 1 }
                                                            : post
                                                    )
                                                );
                                                setSelectedPost(prev => prev ? { ...prev, isLiked: !prev.isLiked, likeCount: prev.isLiked ? prev.likeCount - 1 : prev.likeCount + 1 } : null);
                                            }}
                                            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#FFE5E5] text-[#DA1A32] rounded-full font-inter font-semibold text-[14px] hover:bg-[#FFCCCC] transition-all"
                                        >
                                            <IoMdHeart className={`w-[20px] h-[20px] ${selectedPost.isLiked ? "text-[#FF5454]" : "text-[#DA1A32]"}`} />
                                            {selectedPost.isLiked ? "Liked" : "Like"}
                                        </button>
                                    )}
                                    {!user?.userId && (
                                        <button 
                                            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-200 text-gray-600 rounded-full font-inter font-semibold text-[14px] cursor-not-allowed"
                                        >
                                            <IoMdHeart className="w-[20px] h-[20px]" />
                                            Like
                                        </button>
                                    )}
                                    <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#E8E8E8] text-[#4f4f4f] rounded-full font-inter font-semibold text-[14px] hover:bg-[#D9D9D9] transition-all">
                                        <IoShareSocialSharp className="w-[18px] h-[18px]" />
                                        Share
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default RgUserPost;
