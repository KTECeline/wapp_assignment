import { FaStar } from "react-icons/fa";
import { IoMdArrowBack, IoMdArrowForward, IoMdHeart } from "react-icons/io";
import RgUserLayout from "../components/RgUserLayout.tsx";
import { IoAdd } from "react-icons/io5";
import PostForm from "../components/PostForm.tsx";
import ReviewForm from "../components/ReviewForm.tsx";
import { useState, useEffect } from "react";
import DisplayPost from "../components/DisplayPost.tsx";
import DisplayReview from "../components/DisplayReview.tsx";
import { getUserCourses, getUserPosts, getCoursesWithStats } from "../api/client.js";
import { useNavigate } from "react-router-dom";

interface Course {
    courseId: number;
    title: string;
    description: string;
    rating: number;
    courseImg: string;
    cookingTimeMin: number;
    servings: number;
    video: string;
    levelId: number;
    levelName: string;
    bookmark: boolean;
    quizStatus: string;
    quizProgress: number;
}

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

interface Review {
    id: number;
    userId: number;
    userName: string;
    userInitial: string;
    type: string;
    courseId: number;
    courseTitle: string;
    rating: number;
    title: string;
    description: string;
    createdAt: string;
    timeAgo: string;
}

interface Announcement {
    id: number;
    title: string;
    body: string;
    annImg: string;
    visible: boolean;
}

const RgUserHome = () => {
    const navigate = useNavigate();

    // Local state for UI control
    const [showPostForm, setShowPostForm] = useState(false);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [isPostEdit, setIsPostEdit] = useState(false);
    const [isReviewEdit, setIsReviewEdit] = useState(false);
    const [postId, setPostId] = useState<number | null>(null);
    const [reviewId, setReviewId] = useState<number | null>(null);
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const [userId] = useState(user?.userId || 1);
    const [courseId] = useState<number | null>(null);
    const [posttype] = useState<string>("normal");
    const [reviewtype] = useState<string>("website");
    const [showPostView, setShowPostView] = useState(false);
    const [showReviewView, setShowReviewView] = useState(false);
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);
    const [selectedReview, setSelectedReview] = useState<Review | null>(null);

    // Data state for courses, posts, reviews, and announcements
    const [courses, setCourses] = useState<Course[]>([]);
    const [posts, setPosts] = useState<Post[]>([]);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [topPicks, setTopPicks] = useState<any[]>([]);
    const [currentAnnouncementIndex, setCurrentAnnouncementIndex] = useState(0);
    const [coursesLoading, setCoursesLoading] = useState(true);
    const [postsLoading, setPostsLoading] = useState(true);
    const [reviewsLoading, setReviewsLoading] = useState(true);
    const [announcementsLoading, setAnnouncementsLoading] = useState(true);
    const [topPicksLoading, setTopPicksLoading] = useState(true);
    const [coursesError, setCoursesError] = useState<string | null>(null);
    const [postsError, setPostsError] = useState<string | null>(null);
    const [reviewsError, setReviewsError] = useState<string | null>(null);

    // Fetch courses on component mount
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                setCoursesLoading(true);
                const user = JSON.parse(localStorage.getItem('user') || '{}');

                if (user?.userId) {
                    const data = await getUserCourses(user.userId);
                    setCourses(data.slice(0, 4));
                    setCoursesError(null);
                } else {
                    setCourses([]);
                }
            } catch (err) {
                console.error("Error fetching courses:", err);
                setCoursesError(err instanceof Error ? err.message : "Failed to fetch courses");
                setCourses([]);
            } finally {
                setCoursesLoading(false);
            }
        };

        fetchCourses();
    }, []);

    // Fetch posts on component mount
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setPostsLoading(true);

                // Fetch all posts (not just user's posts) for the home page discover section
                const data = await getUserPosts();
                setPosts(data.slice(0, 3));
                setPostsError(null);
            } catch (err) {
                console.error("Error fetching posts:", err);
                setPostsError(err instanceof Error ? err.message : "Failed to fetch posts");
                setPosts([]);
            } finally {
                setPostsLoading(false);
            }
        };

        fetchPosts();
    }, []);

    // Fetch reviews on component mount
    useEffect(() => {
        fetchReviewsData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Fetch announcements on component mount
    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                setAnnouncementsLoading(true);
                const res = await fetch('/api/Announcements');
                if (!res.ok) throw new Error("Failed to fetch announcements");

                const data = await res.json();
                // Filter only visible announcements
                const visibleAnnouncements = data.filter((ann: Announcement) => ann.visible);
                setAnnouncements(visibleAnnouncements);
            } catch (err) {
                console.error("Error fetching announcements:", err);
                setAnnouncements([]);
            } finally {
                setAnnouncementsLoading(false);
            }
        };

        fetchAnnouncements();
    }, []);

    // Fetch top picks (courses with most enrollments) on component mount
    useEffect(() => {
        const fetchTopPicks = async () => {
            try {
                setTopPicksLoading(true);
                const data = await getCoursesWithStats();

                // Sort by total enrollments (descending) and get top 4
                const sorted = data
                    .sort((a: any, b: any) => (b.totalEnrollments || 0) - (a.totalEnrollments || 0))
                    .slice(0, 4)
                    .map((item: any) => ({
                        ...item.course,
                        totalEnrollments: item.totalEnrollments
                    }));

                setTopPicks(sorted);
            } catch (err) {
                console.error("Error fetching top picks:", err);
                setTopPicks([]);
            } finally {
                setTopPicksLoading(false);
            }
        };

        fetchTopPicks();
    }, []);

    // Navigation functions for announcement carousel
    const handlePrevAnnouncement = () => {
        setCurrentAnnouncementIndex((prev) =>
            prev === 0 ? announcements.length - 1 : prev - 1
        );
    };

    const handleNextAnnouncement = () => {
        setCurrentAnnouncementIndex((prev) =>
            prev === announcements.length - 1 ? 0 : prev + 1
        );
    };

    // Helper function to calculate time ago
    const getTimeAgo = (date: Date): string => {
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 60) return `${diffMins} ${diffMins === 1 ? 'min' : 'mins'} ago`;
        if (diffHours < 24) return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
        return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
    };

    const handlePostSave = async (postData: any, isEdit: boolean) => {
        try {
            const user = JSON.parse(localStorage.getItem('user') || '{}');

            if (!user?.userId) {
                alert("Please login to submit a post");
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
            handleClosePostModal();

            // Refetch posts
            const data = await getUserPosts();
            setPosts(data.slice(0, 3));

            alert("Post created successfully!");
        } catch (err) {
            console.error("Error saving post:", err);
            alert("Failed to create post: " + (err instanceof Error ? err.message : "Unknown error"));
        }
    };

    const handleClosePostModal = () => {
        setShowPostForm(false);
        setIsPostEdit(false);
        setPostId(null);
    };

    const handleReviewSave = async (review: any, isEdit: boolean) => {
        try {
            const user = JSON.parse(localStorage.getItem('user') || '{}');

            if (!user?.userId) {
                alert("Please login to submit a review");
                return;
            }

            let courseIdToUse = review.course_id;

            // For website reviews, we need to get a valid courseId
            if (review.reviewtype === 'website') {
                // Try to use the first course from the user's courses
                if (courses.length > 0) {
                    courseIdToUse = courses[0].courseId;
                } else {
                    // Fallback: fetch the first available course
                    try {
                        const coursesRes = await fetch('/api/courses');
                        const coursesData = await coursesRes.json();
                        if (coursesData.length > 0) {
                            courseIdToUse = coursesData[0].courseId;
                        } else {
                            alert("No courses available. Cannot submit website review.");
                            return;
                        }
                    } catch (err) {
                        console.error("Error fetching courses:", err);
                        alert("Failed to submit review. Please try again.");
                        return;
                    }
                }
            } else {
                // For course reviews, validate that a course was selected
                if (!courseIdToUse) {
                    alert("Please select a course");
                    return;
                }
            }

            // Prepare form data
            const formData = new FormData();
            formData.append('userId', user.userId.toString());
            formData.append('courseId', courseIdToUse.toString());
            formData.append('type', review.reviewtype === 'course' ? 'review' : 'website');
            formData.append('rating', review.rating.toString());
            formData.append('title', review.title);
            formData.append('description', review.description);

            // Submit review
            const response = await fetch('/api/UserFeedbacks', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Failed to submit review');
            }

            // Success - refresh reviews list
            await fetchReviewsData();

            handleCloseReviewModal();
            alert('Review submitted successfully!');
        } catch (error) {
            console.error('Error submitting review:', error);
            alert('Failed to submit review: ' + (error instanceof Error ? error.message : 'Unknown error'));
        }
    };

    const handleCloseReviewModal = () => {
        setShowReviewForm(false);
        setIsReviewEdit(false);
        setReviewId(null);
    };

    const handlePostLikeUpdate = (postId: number, likeCount: number, isLiked: boolean) => {
        // Update the post in the posts array
        setPosts(prevPosts =>
            prevPosts.map(post =>
                post.postId === postId
                    ? { ...post, likeCount, isLiked }
                    : post
            )
        );
    };

    // Extract review fetching logic for reuse
    const fetchReviewsData = async () => {
        try {
            setReviewsLoading(true);
            const res = await fetch('/api/UserFeedbacks');
            if (!res.ok) throw new Error("Failed to fetch reviews");

            const data = await res.json();

            // Filter for reviews only, sort by highest rating then most recent, and format the data
            const reviewsData = data
                .filter((item: any) => (item.type === "review" || item.type === "website") && !item.deletedAt)
                .sort((a: any, b: any) => {
                    // First sort by rating (highest first)
                    if (b.rating !== a.rating) {
                        return b.rating - a.rating;
                    }
                    // If ratings are equal, sort by date (most recent first)
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                })
                .slice(0, 6) // Take only top 6 reviews
                .map((item: any) => {
                    const userInitial = item.userName ? item.userName.charAt(0).toUpperCase() : 'U';
                    const timeAgo = getTimeAgo(new Date(item.createdAt));

                    return {
                        id: item.id,
                        userId: item.userId,
                        userName: item.userName || 'Anonymous',
                        userInitial,
                        type: item.type,
                        courseId: item.courseId,
                        courseTitle: item.courseTitle || 'Website Review',
                        rating: item.rating,
                        title: item.title,
                        description: item.description,
                        createdAt: item.createdAt,
                        timeAgo
                    };
                });

            setReviews(reviewsData);
            setReviewsError(null);
        } catch (err) {
            console.error("Error fetching reviews:", err);
            setReviewsError(err instanceof Error ? err.message : "Failed to fetch reviews");
            setReviews([]);
        } finally {
            setReviewsLoading(false);
        }
    };

    function formatCookingTime(minutes: number) {
        if (minutes < 60) return `${minutes} mins`;
        const h = Math.floor(minutes / 60);
        const m = minutes % 60;
        return m === 0 ? `${h}h` : `${h}h ${m}m`;
    }

    return (
        <RgUserLayout>
            {showPostForm && (
                <div className="fixed z-[100]">
                    <PostForm
                        onClose={handleClosePostModal}
                        onSave={handlePostSave}
                        isEdit={isPostEdit}
                        postId={postId}
                        userId={userId}
                        courseId={courseId}
                        posttype={posttype}
                        from="home"
                    />
                </div>
            )}

            {showReviewForm && (
                <div className="fixed z-[100]">
                    <ReviewForm
                        onClose={handleCloseReviewModal}
                        onSave={handleReviewSave}
                        isEdit={isReviewEdit}
                        reviewId={reviewId}
                        userId={userId}
                        courseId={courseId}
                        reviewtype={reviewtype}
                        from="home"
                    />
                </div>
            )}

            {showPostView && <DisplayPost onClose={() => setShowPostView(false)} post={selectedPost} onLikeUpdate={handlePostLikeUpdate} />}
            {showReviewView && <DisplayReview onClose={() => setShowReviewView(false)} review={selectedReview || undefined} />}

            {/* Announcement */}
            <div className="w-full h-[400px] relative">
                {announcementsLoading ? (
                    <div className="w-full h-[400px] flex items-center justify-center bg-gray-100">
                        <div className="text-gray-500">Loading announcements...</div>
                    </div>
                ) : announcements.length === 0 ? (
                    <div className="w-full h-[400px] flex items-center justify-center bg-gray-100">
                        <div className="text-gray-500">No announcements available</div>
                    </div>
                ) : (
                    <>
                        <img
                            src={announcements[currentAnnouncementIndex].annImg || "/images/Announcement.png"}
                            alt="announcement"
                            className="w-full h-[400px] object-cover z-0"
                        />
                        <div className="absolute top-0 left-0 w-full h-[400px] bg-[#fefefe]/20 backdrop-blur-[12px] z-10" />
                        <div className="absolute top-0 left-0 w-full h-[400px] z-20">
                            <div className="relative w-[1100px] h-[400px] mx-auto">
                                <img
                                    src={announcements[currentAnnouncementIndex].annImg || "/images/Announcement.png"}
                                    alt="announcement"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute top-[100px] left-[122px] text-white">
                                    <div className="text-[40px] max-w-[500px] leading-tight font-medium">
                                        {announcements[currentAnnouncementIndex].title}
                                    </div>
                                    <div className="text-[14px] max-w-[390px] leading-tight font-[200] pt-[18px]">
                                        {announcements[currentAnnouncementIndex].body}
                                    </div>
                                </div>

                                <div className="absolute bottom-[20px] left-0 w-full flex justify-center">
                                    <div className="flex flex-row gap-[12px]">
                                        <button
                                            onClick={handlePrevAnnouncement}
                                            className="cursor-pointer flex items-center justify-center rounded-full w-[35px] h-[35px] backdrop-blur-sm border-[1px] border-white border-white transition-all duration-[600ms] hover:shadow-[0px_0px_20px_-1px_rgba(255,255,255,0.6)]">
                                            <IoMdArrowBack className="text-white w-[30px] h-[30px]" />
                                        </button>
                                        <button
                                            onClick={handleNextAnnouncement}
                                            className="cursor-pointer flex items-center justify-center rounded-full w-[35px] h-[35px] backdrop-blur-sm border-[1px] border-white border-white transition-all duration-[600ms] hover:shadow-[0px_0px_20px_-1px_rgba(255,255,255,0.6)]">
                                            <IoMdArrowForward className="text-white w-[30px] h-[30px]" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* My Collection */}
            <div className="mt-[36px] items-center text-black flex flex-col w-full">
                <div className="font-ibarra text-[24px] font-bold flex flex-row items-center gap-[8px]">
                    <div className="w-[16px] h-[1px] bg-[#DA1A32]" />
                    My Collection
                    <div className="w-[16px] h-[1px] bg-[#DA1A32]" />
                </div>

                {/* My Collection Container */}
                <div className="mt-[32px] flex flex-row gap-[14px] max-w-screen">
                    {coursesLoading ? (
                        <div className="text-center py-8">Loading courses...</div>
                    ) : coursesError ? (
                        <div className="text-center py-8 text-red-500">Error loading courses</div>
                    ) : courses.length === 0 ? (
                        <div className="text-center py-8">No courses found</div>
                    ) : (
                        courses.map((course) => (
                            <div key={course.courseId} className="max-h-[297px] w-[262px] group cursor-pointer"
                                onClick={() => navigate(`/RgUserCourse/${course.courseId}`)}>
                                <img src={course.courseImg} alt={course.title} className="w-full h-[177px] object-cover" />

                                {/* Review */}
                                <div className="flex flex-row mt-[16px] items-center">
                                    <div className="flex gap-[4px]">
                                        {[...Array(5)].map((_, index) => {
                                            const fillPercentage = Math.min(Math.max(course.rating - index, 0), 1) * 100;
                                            return (
                                                <div key={index} className="relative" style={{ width: "18px", height: "18px" }}>
                                                    <FaStar className="absolute top-0 left-0 text-gray-300" size="18px" />
                                                    <div className="absolute top-0 left-0 overflow-hidden" style={{ width: `${fillPercentage}%`, height: "100%" }}>
                                                        <FaStar className="text-[#DA1A32]" size="18px" />
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <div className="font-inter ml-[8px] text-[#484848] text-[12px]">{Number(course.rating).toFixed(1)} {course.rating === 1 ? "rating" : "ratings"}</div>
                                </div>

                                {/* Title */}
                                <div className="font-ibarra text-[18px] font-bold mt-[12px] line-clamp-2 group-hover:text-[#DA1A32] transition-all duration-300">
                                    {course.title}
                                </div>

                                {/* Details */}
                                <div className="flex gap-[14px] mt-[14px]">
                                    <div className="flex items-center">
                                        <img src="/images/Time.png" alt="time" className="w-[12px] h-[12px] object-cover" />
                                        <div className="font-inter ml-[4px] text-[#484848] text-[11px] font-light">{formatCookingTime(course.cookingTimeMin)}</div>
                                    </div>

                                    <div className="h-[16px] w-[1.1px] bg-black" />

                                    <div className="flex items-center">
                                        <img src="/images/Profile.png" alt="servings" className="w-[11px] h-[11px] object-cover" />
                                        <div className="font-inter ml-[4px] text-[#484848] text-[11px] font-light">{course.servings}</div>
                                        <div className="font-inter ml-[1px] text-[#484848] text-[11px] font-light">servings</div>
                                    </div>

                                    <div className="h-[16px] w-[1.1px] bg-black" />

                                    <div className="flex items-center">
                                        <img src="/images/Level.png" alt="level" className="w-[14px] h-[14px] object-cover" />
                                        <div className="font-inter ml-[6px] text-[#484848] text-[11px] font-light">{course.levelName}</div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <button
                    onClick={() => navigate('/RgUserCol')}
                    className="font-inter mt-[48px] cursor-pointer mx-auto bg-white px-[22px] py-[2px] border-[1px] border-black rounded-full font-light hover:scale-105 transition-all duration-[600ms]">
                    View More
                </button>
            </div>

            {/* Top Picks - Keeping as is */}
            <div className="mt-[62px] items-center text-black flex flex-col w-full bg-[#F8F5F0] pt-[36px] pb-[62px]">
                <div className="font-ibarra text-[24px] font-bold flex flex-row items-center gap-[8px]">
                    <div className="w-[16px] h-[1px] bg-[#DA1A32]" />
                    Top Picks
                    <div className="w-[16px] h-[1px] bg-[#DA1A32]" />
                </div>

                {/* Top Picks Container */}
                <div className="mt-[32px] flex flex-row gap-[14px] max-w-screen"> 
                    {topPicksLoading ? (
                        <div className="text-center py-8">Loading top picks...</div>
                    ) : topPicks.length === 0 ? (
                        <div className="text-center py-8">No top picks available</div>
                    ) : (
                        topPicks.map((course: any) => (
                            <div key={course.courseId} className="max-h-[297px] w-[262px] group cursor-pointer"
                                onClick={() => navigate(`/RgUserCourse/${course.courseId}`)}>
                                <img src={course.courseImg} alt={course.title} className="w-full h-[177px] object-cover" />

                                {/* Review */}
                                <div className="flex flex-row mt-[16px] items-center">
                                    <div className="flex gap-[4px]">
                                        {[...Array(5)].map((_, index) => {
                                            const fillPercentage = Math.min(Math.max(course.rating - index, 0), 1) * 100;
                                            return (
                                                <div key={index} className="relative" style={{ width: "18px", height: "18px" }}>
                                                    <FaStar className="absolute top-0 left-0 text-gray-300" size="18px" />
                                                    <div className="absolute top-0 left-0 overflow-hidden" style={{ width: `${fillPercentage}%`, height: "100%" }}>
                                                        <FaStar className="text-[#DA1A32]" size="18px" />
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <div className="font-inter ml-[8px] text-[#484848] text-[12px]">{Number(course.rating).toFixed(1)} {course.rating === 1 ? "rating" : "ratings"}</div>
                                </div>

                                {/* Title */}
                                <div className="font-ibarra text-[18px] font-bold mt-[12px] line-clamp-2 group-hover:text-[#DA1A32] transition-all duration-300">
                                    {course.title}
                                </div>

                                {/* Details */}
                                <div className="flex gap-[14px] mt-[14px]">
                                    <div className="flex items-center">
                                        <img src="/images/Time.png" alt="time" className="w-[12px] h-[12px] object-cover" />
                                        <div className="font-inter ml-[4px] text-[#484848] text-[11px] font-light">{formatCookingTime(course.cookingTimeMin)}</div>
                                    </div>

                                    <div className="h-[16px] w-[1.1px] bg-black" />

                                    <div className="flex items-center">
                                        <img src="/images/Profile.png" alt="servings" className="w-[11px] h-[11px] object-cover" />
                                        <div className="font-inter ml-[4px] text-[#484848] text-[11px] font-light">{course.servings}</div>
                                        <div className="font-inter ml-[1px] text-[#484848] text-[11px] font-light">servings</div>
                                    </div>

                                    <div className="h-[16px] w-[1.1px] bg-black" />

                                    <div className="flex items-center">
                                        <img src="/images/Level.png" alt="level" className="w-[14px] h-[14px] object-cover" />
                                        <div className="font-inter ml-[6px] text-[#484848] text-[11px] font-light">{course.level?.title}</div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <button
                    onClick={() => navigate('/RgUserLearn')}
                    className="font-inter mt-[48px] cursor-pointer mx-auto bg-white px-[22px] py-[2px] border-[1px] border-black rounded-full font-light hover:scale-105 transition-all duration-[600ms]">
                    View More
                </button>
            </div>

            {/* Posts */}
            <div className="mt-[36px] items-center text-black flex flex-col w-full relative">
                <div className="font-ibarra text-[24px] font-bold flex flex-row items-center gap-[8px]">
                    <div className="w-[16px] h-[1px] bg-[#DA1A32]" />
                    Posts
                    <div className="w-[16px] h-[1px] bg-[#DA1A32]" />
                </div>

                <button onClick={() => setShowPostForm(true)}
                    className="flex items-center justify-between h-[40px] bg-white border border-black rounded-full pr-[4px] pl-[22px] cursor-pointer hover:scale-105 transition-all duration-[600ms] absolute top-0 right-[223px]">
                    <div className="font-inter text-[16px] font-light text-black">
                        Post
                    </div>
                    <div className="w-[30px] h-[30px] bg-[#DA1A32] flex items-center justify-center rounded-full text-white text-[12px] ml-[20px]">
                        <IoAdd className="text-white w-[32px] h-[32px]" />
                    </div>
                </button>

                {/* Post Container */}
                <div className="mt-[32px] flex flex-row gap-[20px] max-w-screen">
                    {postsLoading ? (
                        <div className="text-center py-8">Loading posts...</div>
                    ) : postsError ? (
                        <div className="text-center py-8 text-red-500">Error loading posts</div>
                    ) : posts.length === 0 ? (
                        <div className="text-center py-8">No posts found</div>
                    ) : (
                        posts.map((post) => (
                            <button
                                key={post.postId}
                                onClick={() => {
                                    setSelectedPost(post);
                                    setShowPostView(true);
                                }}
                                className="text-left cursor-pointer hover:scale-[105%] transition-all duration-[600ms] w-[350px] h-[323px] bg-white flex flex-row gap-[16px] p-[10px] shadow-[0px_0px_20px_rgba(0,0,0,0.1)] rounded-[20px] flex-shrink-0">
                                <div className="relative w-[170px] h-full rounded-[16px] overflow-hidden bg-gray-200">
                                    <img
                                        src={post.postImg || "/images/Post.webp"}
                                        alt={post.title}
                                        className="w-full h-full object-cover"
                                        onError={(e) => { e.currentTarget.src = "/images/Post.webp"; }}
                                    />
                                </div>

                                <div className="flex flex-col w-[142px] justify-between">
                                    <div>
                                        <div className="flex flex-row justify-between items-center">
                                            <div className="flex flex-row gap-[6px]">
                                                <div className="w-[25px] h-[25px] bg-[#DA1A32] flex items-center justify-center rounded-full text-white text-[12px]">
                                                    {post.userFirstName?.charAt(0) || 'U'}
                                                </div>
                                                <div className="flex flex-col">
                                                    <div className="font-inter text-[10px] line-clamp-1 max-w-[64px]">
                                                        {post.userFirstName} {post.userLastName}
                                                    </div>
                                                    <div className="font-inter font-light text-[7px] line-clamp-1 max-w-[64px]">
                                                        {new Date(post.createdAt).toLocaleDateString()}
                                                    </div>
                                                </div>
                                            </div>
                                            <button className="cursor-pointer">
                                                <IoMdHeart className={`w-[20px] h-[20px] ${post.isLiked ? 'text-[#FF5454]' : 'text-[#D9D9D9]'}`} />
                                            </button>
                                        </div>

                                        <div className="font-ibarra mt-[16px] line-clamp-3 text-[16px] font-bold leading-tight">
                                            {post.title}
                                        </div>

                                        <div className="font-inter mt-[12px] line-clamp-5 text-[10px] font-light text-justify">
                                            {post.description}
                                        </div>

                                        <div className="font-inter mt-[26px] line-clamp-4 text-[10px] font-light underline cursor-pointer">
                                            <span className="hover:text-[#DA1A32] transition-all duration-300">#{post.courseName}</span>
                                            <span className="hover:text-[#DA1A32] transition-all duration-300">#{post.categoryName}</span>
                                        </div>
                                    </div>

                                    <div className="flex flex-col">
                                        <div className="bg-black w-full h-[1px]" />
                                        <div className="flex flex-row font-inter text-[10px] font-light gap-[2px] mt-[5px] mb-[3px]">
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

                <button
                    onClick={() => navigate('/RgUserPost')}
                    className="font-inter mt-[48px] cursor-pointer mx-auto bg-white px-[22px] py-[2px] border-[1px] border-black rounded-full font-light hover:scale-105 transition-all duration-[600ms]">
                    View More
                </button>
            </div>

            {/* Reviews - Keeping as is */}
            <div className="mt-[62px] items-center text-black flex flex-col w-full bg-[#F8F5F0] pt-[36px] pb-[62px] relative">
                <div className="font-ibarra text-[24px] font-bold flex flex-row items-center gap-[8px]">
                    <div className="w-[16px] h-[1px] bg-[#DA1A32]" />
                    Reviews
                    <div className="w-[16px] h-[1px] bg-[#DA1A32]" />
                </div>

                <button onClick={() => setShowReviewForm(true)}
                    className="flex items-center justify-between h-[40px] bg-white border border-black rounded-full pr-[4px] pl-[22px] cursor-pointer hover:scale-105 transition-all duration-[600ms] absolute top-[34px] right-[223px]">
                    <div className="font-inter text-[16px] font-light text-black">
                        Review
                    </div>
                    <div className="w-[30px] h-[30px] bg-[#DA1A32] flex items-center justify-center rounded-full text-white text-[12px] ml-[20px]">
                        <IoAdd className="text-white w-[32px] h-[32px]" />
                    </div>
                </button>

                {/* Review Container */}
                <div className="mt-[32px] flex flex-row gap-[20px]">
                    {reviewsLoading ? (
                        <div className="text-center py-8">Loading reviews...</div>
                    ) : reviewsError ? (
                        <div className="text-center py-8 text-red-500">Error loading reviews</div>
                    ) : reviews.length === 0 ? (
                        <div className="text-center py-8">No reviews yet. Be the first to review!</div>
                    ) : (
                        reviews.slice(0, 3).map((review) => (
                            <button
                                key={review.id}
                                onClick={() => {
                                    setSelectedReview(review);
                                    setShowReviewView(true);
                                }}
                                className="w-[350px] h-[153px] bg-white flex flex-col p-[10px] shadow-[0px_0px_20px_rgba(0,0,0,0.1)] rounded-[20px] flex-shrink-0 cursor-pointer hover:scale-[105%] transition-all duration-[600ms] text-left"
                            >
                                <div className="flex flex-row justify-between items-center">
                                    {/* Profile and time */}
                                    <div className="flex flex-row gap-[6px]">
                                        <div className="w-[25px] h-[25px] bg-[#DA1A32] flex items-center justify-center rounded-full text-white text-[12px]">
                                            {review.userInitial}
                                        </div>

                                        <div className="flex flex-col">
                                            <div className="font-inter text-[10px] line-clamp-1 max-w-[64px]">
                                                {review.userName}
                                            </div>

                                            <div className="font-inter font-light text-[7px] line-clamp-1 max-w-[64px]">
                                                {review.timeAgo}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Review title */}
                                <div className="font-ibarra mt-[16px] line-clamp-1 text-[16px] font-bold leading-tight">
                                    {review.title}
                                </div>

                                {/* Review Description */}
                                <div className="font-inter mt-[10px] line-clamp-2 text-[10px] font-light text-justify mb-[8px]">
                                    {review.description}
                                </div>

                                <div className="flex gap-[4px]">
                                    {[...Array(5)].map((_, index) => {
                                        const fillPercentage = Math.min(Math.max(review.rating - index, 0), 1) * 100;

                                        return (
                                            <div
                                                key={index}
                                                className="relative"
                                                style={{ width: `14px`, height: `14px` }}
                                            >
                                                <FaStar
                                                    className="absolute top-0 left-0 text-gray-300"
                                                    size="14px"
                                                />
                                                <div
                                                    className="absolute top-0 left-0 overflow-hidden"
                                                    style={{ width: `${fillPercentage}%`, height: "100%" }}
                                                >
                                                    <FaStar
                                                        className="text-[#DA1A32]"
                                                        size="14px"
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </button>
                        ))
                    )}
                </div>

                <button
                    onClick={() => navigate('/RgUserReview')}
                    className="font-inter mt-[48px] cursor-pointer mx-auto bg-white px-[22px] py-[2px] border border-black rounded-full font-light hover:scale-105 transition-all duration-[600ms]">
                    View More
                </button>
            </div>
        </RgUserLayout>
    );
};

export default RgUserHome;
