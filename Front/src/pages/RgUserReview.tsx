import { IoIosArrowBack, IoIosSearch } from "react-icons/io";
import RgUserLayout from "../components/RgUserLayout.tsx";
import { CiFilter } from "react-icons/ci";
import { TbArrowsSort } from "react-icons/tb";
import { FaStar } from "react-icons/fa";
import React, { useState, useEffect } from "react";
import { IoAdd } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import ReviewForm from "../components/ReviewForm.tsx";

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

const RgUserReview = () => {
    const navigate = useNavigate();
    const [active, setActive] = useState("Website Reviews");
    const [reviews, setReviews] = useState<Review[]>([]);
    const [filteredReviews, setFilteredReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [isReviewEdit, setIsReviewEdit] = useState(false);
    const [reviewId, setReviewId] = useState<number | null>(null);
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const [userId] = useState(user?.userId || 1);
    const [courseId] = useState<number | null>(null);
    const [reviewtype] = useState<string>("website");
    const [courses, setCourses] = useState<any[]>([]);

    const tabs = ["Website Reviews", "My Reviews"];

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

    // Fetch reviews from database
    useEffect(() => {
        const fetchReviews = async () => {
            try {
                setLoading(true);
                const res = await fetch('/api/UserFeedbacks');
                if (!res.ok) throw new Error("Failed to fetch reviews");
                
                const data = await res.json();
                
                // Format the reviews data
                const reviewsData = data
                    .filter((item: any) => item.type === "review" || item.type === "website")
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
            } catch (err) {
                console.error("Error fetching reviews:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, []);

    // Fetch courses for course selection
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const res = await fetch('/api/courses');
                if (res.ok) {
                    const data = await res.json();
                    setCourses(data);
                }
            } catch (err) {
                console.error("Error fetching courses:", err);
            }
        };
        
        fetchCourses();
    }, []);

    // Filter reviews based on active tab and search
    useEffect(() => {
        let filtered = reviews;

        // Filter by tab
        if (active === "Website Reviews") {
            filtered = reviews.filter(review => review.type === "website");
        } else if (active === "My Reviews") {
            filtered = reviews.filter(review => review.userId === user?.userId);
        }

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(review => 
                review.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                review.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                review.userName.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredReviews(filtered);
    }, [active, reviews, searchTerm, user?.userId]);

    // Calculate rating statistics
    const calculateStats = () => {
        if (filteredReviews.length === 0) {
            return {
                totalReviews: 0,
                averageRating: 0,
                ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
            };
        }

        const ratingDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        let totalRating = 0;

        filteredReviews.forEach(review => {
            totalRating += review.rating;
            ratingDistribution[review.rating as keyof typeof ratingDistribution]++;
        });

        const averageRating = totalRating / filteredReviews.length;

        return {
            totalReviews: filteredReviews.length,
            averageRating: Number(averageRating.toFixed(1)),
            ratingDistribution
        };
    };

    const stats = calculateStats();

    const getRatingPercentage = (rating: number) => {
        if (stats.totalReviews === 0) return 0;
        return (stats.ratingDistribution[rating as keyof typeof stats.ratingDistribution] / stats.totalReviews) * 100;
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
            const res = await fetch('/api/UserFeedbacks');
            if (res.ok) {
                const data = await res.json();
                const reviewsData = data
                    .filter((item: any) => item.type === "review" || item.type === "website")
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
            }
            
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

    return (
        <RgUserLayout>
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
                        from="review"
                    />
                </div>
            )}

            <div className="max-w-screen overflow-x-hidden">
                <div className="items-center text-black flex flex-col w-[1090px] mt-[50px] relative mx-auto">
                    <div className="w-full flex flex-col items-center">
                        <p className="font-ibarra font-bold text-black text-[36px]">
                            Website <span className="text-[#DA1A32]">Reviews</span>
                        </p>
                    </div>

                    <div className="absolute flex flex-row justify-between w-full top-0 left-0">
                        <button onClick={() => navigate(-1)} className="cursor-pointer">
                            <IoIosArrowBack className="text-[#DA1A32] h-[32px] w-[32px]" />
                        </button>
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

                {/* Reviews */}
                <div className="mt-[24px] items-center text-black flex flex-col w-[1090px] mx-auto">
                    <div className="flex flex-row justify-center  mb-[36px]">
                        <div className="w-[295px] flex flex-col items-center">
                            {/* Review */}
                            <div className="font-inter text-[#484848] text-[14px] font-light">
                                {stats.totalReviews} {stats.totalReviews === 1 ? 'review' : 'reviews'}
                            </div>

                            <div className="font-ibarra text-[64px] h-[64px] flex flex-row items-center my-[2px]">
                                {stats.averageRating}
                            </div>

                            <div className="flex gap-[4px]">
                                {[...Array(5)].map((_, index) => {
                                    const fillPercentage = Math.min(Math.max(stats.averageRating - index, 0), 1) * 100;

                                    return (
                                        <div
                                            key={index}
                                            className="relative"
                                            style={{ width: `18px`, height: `18px` }}
                                        >
                                            <FaStar
                                                className="absolute top-0 left-0 text-gray-300"
                                                size="18px"
                                            />
                                            <div
                                                className="absolute top-0 left-0 overflow-hidden"
                                                style={{ width: `${fillPercentage}%`, height: "100%" }}
                                            >
                                                <FaStar
                                                    className="text-[#DA1A32]"
                                                    size="18px"
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="w-[295px] flex flex-col gap-[4px]">
                            {[5, 4, 3, 2, 1].map(rating => (
                                <div key={rating} className="flex flex-row gap-[6px]">
                                    <div className="text-black font-inter text-[12px] font-medium">
                                        {rating}
                                    </div>
                                    <div className="w-full bg-[#FFDBDB] rounded-full h-[6px] overflow-hidden my-auto">
                                        <div
                                            className="bg-[#DA1A32] h-[6px] transition-all duration-500 rounded-full"
                                            style={{ width: `${getRatingPercentage(rating)}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                    </div>

                    <div className="relative flex flex-row font-ibarra text-[22px] font-medium mb-[36px] gap-[16px] rounded-full bg-[#F8F5F0] p-2">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActive(tab)}
                                className="relative px-8 py-1 rounded-full transition-all duration-300"
                            >
                                <span
                                    className={`relative z-10 transition-colors duration-300 ${active === tab ? "text-[#DA1A32]" : "text-black"
                                        }`}
                                >
                                    {tab}
                                </span>

                                {/* Animated rounded highlight */}

                                <span className={`absolute inset-0 border border-[#DA1A32] rounded-full transition-all duration-[300ms] bg-white ${active === tab ? "opacity-100" : "opacity-0"}`} />

                            </button>
                        ))}
                    </div>

                    <div className="font-ibarra text-[24px] font-bold flex flex-row items-center gap-[8px] justify-between w-full">
                        <div className="flex items-center justify-between h-[48px] bg-white border border-black rounded-full pr-[4px] pl-[22px]">
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="font-inter w-[160px] bg-transparent outline-none text-black text-[16px] font-light"
                            />
                            <div className="w-[38px] h-[38px] bg-[#DA1A32] flex items-center justify-center rounded-full text-white text-[12px] cursor-pointer ml-[20px]">
                                <IoIosSearch className="text-white w-[24px] h-[24px] " />
                            </div>
                        </div>

                        <div className="flex flex-row gap-[10px]">
                            <button className="flex items-center justify-between h-[48px] bg-white border border-black rounded-full pr-[4px] pl-[22px] cursor-pointer hover:scale-105 transition-all duration-[600ms]">
                                <div className="font-inter text-[16px] font-light">
                                    Filter
                                </div>
                                <div className="w-[38px] h-[38px] bg-[#DA1A32] flex items-center justify-center rounded-full text-white text-[12px] ml-[20px]">
                                    <CiFilter className="text-white w-[20px] h-[20px]" />
                                </div>
                            </button>

                            <button className="flex items-center justify-between h-[48px] bg-white border border-black rounded-full pr-[4px] pl-[22px] cursor-pointer hover:scale-105 transition-all duration-[600ms]">
                                <div className="font-inter text-[16px] font-light">
                                    Sort
                                </div>
                                <div className="w-[38px] h-[38px] bg-[#DA1A32] flex items-center justify-center rounded-full text-white text-[12px] ml-[20px]">
                                    <TbArrowsSort className="text-white w-[18px] h-[18px] " />
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* Review Container */}
                    <div className="mt-[22px] w-screen max-h-[522px] overflow-y-scroll no-scrollbar pb-[64px] pt-[10px]">
                        <div className="grid grid-cols-3 gap-[20px] w-[1090px] mx-auto">
                            {loading ? (
                                <div className="col-span-3 text-center py-8">Loading reviews...</div>
                            ) : filteredReviews.length === 0 ? (
                                <div className="col-span-3 text-center py-8">
                                    {searchTerm ? 'No reviews found matching your search' : 'No reviews yet. Be the first to review!'}
                                </div>
                            ) : (
                                filteredReviews.map((review) => (
                                    <div key={review.id} className="w-[350px] h-[153px] bg-white flex flex-col p-[10px] shadow-[0px_0px_20px_rgba(0,0,0,0.1)] rounded-[20px]">
                                        <div className="flex flex-row justify-between items-center">
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

                                        <div className="font-ibarra mt-[16px] line-clamp-1 text-[16px] font-bold leading-tight">
                                            {review.title}
                                        </div>

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
                                    </div>
                                ))
                            )}
                        </div>
                    </div>


                    <button 
                        onClick={() => setShowReviewForm(true)}
                        className="fixed bottom-[20px] right-[20px] flex items-center justify-between h-[40px] bg-white border border-black rounded-full pr-[4px] pl-[22px] cursor-pointer hover:scale-105 transition-all duration-[600ms]">
                        <div className="font-inter text-[16px] font-light text-black">
                            Review
                        </div>
                        <div className="w-[30px] h-[30px] bg-[#DA1A32] flex items-center justify-center rounded-full text-white text-[12px] ml-[20px]">
                            <IoAdd className="text-white w-[32px] h-[32px]" />
                        </div>
                    </button>
                </div>
            </div>
        </RgUserLayout>
    );
};

export default RgUserReview;

