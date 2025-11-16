import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { IoIosArrowBack, IoIosSearch } from "react-icons/io";
import RgUserLayout from "../components/RgUserLayout.tsx";
import { FaStar } from "react-icons/fa";
import { IoAdd } from "react-icons/io5";
import ReviewForm from "../components/ReviewForm.tsx";
import DisplayReview from "../components/DisplayReview.tsx";
import { AnimatePresence, motion } from "framer-motion";
import VisitorLayout from "../components/VisitorLayout.tsx";

interface Review {
    id: number;
    feedbackId: number;
    userId: number;
    userName: string;
    userInitial: string;
    userProfileImg: string;
    type: string;
    courseId: number;
    courseTitle: string;
    rating: number;
    title: string;
    description: string;
    createdAt: string;
    timeAgo: string;
}

interface Course {
    courseId: number;
    title: string;
    courseImg: string;
    categoryName: string;
}

const RgUserCourseReview = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const [course, setCourse] = useState<Course | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [isReviewEdit, setIsReviewEdit] = useState(false);
    const [reviewId, setReviewId] = useState<number | null>(null);
    const [showReviewView, setShowReviewView] = useState(false);
    const [selectedReview, setSelectedReview] = useState<Review | null>(null);
    const [toasts, setToasts] = useState<{ id: string; message: string; variant: "success" | "error" }[]>([]);
    const Layout = user?.userId ? RgUserLayout : VisitorLayout;

    const addToast = (message: string, variant: "success" | "error" = "success") => {
        const id = Math.random().toString(36).slice(2);
        setToasts(prev => [...prev, { id, message, variant }]);
        setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
    };

    const getTimeAgo = (date: string) => {
        const now = new Date();
        const past = new Date(date);
        const diffMs = now.getTime() - past.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 60) return `${diffMins} mins ago`;
        if (diffHours < 24) return `${diffHours} hours ago`;
        return `${diffDays} days ago`;
    };

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const response = await fetch(`/api/Courses/${id}`);
                const data = await response.json();
                setCourse(data);
            } catch (error) {
                console.error("Error fetching course:", error);
            }
        };

        if (id) {
            fetchCourse();
        }
    }, [id]);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                setLoading(true);
                console.log("Fetching reviews for course ID:", id);
                const response = await fetch(`/api/UserFeedbacks/course/${id}/reviews`);
                const data = await response.json();
                console.log("Received reviews data:", data);

                const reviewsData = data.map((review: any) => ({
                    id: review.id || review.feedbackId,
                    feedbackId: review.feedbackId,
                    userId: review.userId,
                    userName: review.userName || "Anonymous",
                    userInitial: review.userInitial || (review.userName || "A").charAt(0).toUpperCase(),
                    userProfileImg: review.userProfileImg || '',
                    type: review.type || "review",
                    courseId: review.courseId,
                    courseTitle: review.courseTitle || "Unknown Course",
                    rating: review.rating,
                    title: review.title,
                    description: review.description,
                    createdAt: review.createdAt,
                    timeAgo: review.timeAgo || getTimeAgo(review.createdAt)
                }));

                console.log("Mapped reviews data:", reviewsData);
                setReviews(reviewsData);
            } catch (error) {
                console.error("Error fetching reviews:", error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchReviews();
        }
    }, [id]);

    const filteredReviews = reviews.filter(review =>
        review.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.userName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    console.log("Reviews state:", reviews);
    console.log("Filtered reviews:", filteredReviews);
    console.log("Loading state:", loading);

    const calculateStats = () => {
        const totalReviews = filteredReviews.length;
        const totalRating = filteredReviews.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = totalReviews > 0 ? (totalRating / totalReviews).toFixed(1) : 0;

        const ratingDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        filteredReviews.forEach(review => {
            const rating = Math.round(review.rating);
            if (rating >= 1 && rating <= 5) {
                ratingDistribution[rating as keyof typeof ratingDistribution]++;
            }
        });

        return {
            totalReviews,
            averageRating: parseFloat(averageRating as string),
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
            if (!user?.userId) {
                addToast("Please log in to submit a review", "error");
                return;
            }

            if (!id) {
                addToast("Course not found", "error");
                return;
            }

            // Prepare form data
            const formData = new FormData();
            formData.append('userId', user.userId.toString());
            formData.append('courseId', id);
            formData.append('type', 'review');
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

            // Refresh reviews
            const reviewsResponse = await fetch(`/api/UserFeedbacks/course/${id}/reviews`);
            const data = await reviewsResponse.json();

            const reviewsData = data.map((review: any) => ({
                feedbackId: review.feedbackId,
                userId: review.userId,
                userName: review.userName || "Anonymous",
                userInitial: (review.userName || "A").charAt(0).toUpperCase(),
                userProfileImg: review.userProfileImg || '',
                rating: review.rating,
                title: review.title,
                description: review.description,
                createdAt: review.createdAt,
                timeAgo: getTimeAgo(review.createdAt)
            }));

            setReviews(reviewsData);
            handleCloseReviewModal();
            addToast('Review submitted successfully!');
        } catch (error) {
            console.error('Error submitting review:', error);
            addToast('Failed to submit review: ' + (error instanceof Error ? error.message : 'Unknown error'), "error");
        }
    };

    const handleCloseReviewModal = () => {
        setShowReviewForm(false);
        setIsReviewEdit(false);
        setReviewId(null);
    };

    return (
        <Layout>
            {showReviewForm && (
                <div className="fixed z-[100]">
                    <ReviewForm
                        onClose={handleCloseReviewModal}
                        onSave={handleReviewSave}
                        isEdit={isReviewEdit}
                        reviewId={reviewId}
                        userId={user?.userId || 0}
                        courseId={parseInt(id || '0')}
                        reviewtype="course"
                        from="course"
                    />
                </div>
            )}

            {/* Toast Container */}
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

            <div className="max-w-screen overflow-x-hidden">


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
                    {/* Reviews */}
                    <div className="items-center text-black flex flex-col w-[1090px] relative">
                        <div className="font-ibarra text-[32px] font-bold flex flex-row items-center gap-[8px]">
                            <div className="w-[16px] h-[1px] bg-[#DA1A32]" />
                            Reviews
                            <div className="w-[16px] h-[1px] bg-[#DA1A32]" />
                        </div>

                        <div className="absolute flex flex-row justify-between w-full top-0 left-0">
                            <button onClick={() => navigate(-1)} className="cursor-pointer">
                                <IoIosArrowBack className="text-[#DA1A32] h-[32px] w-[32px]" />
                            </button>
                        </div>

                        <div className="flex flex-row justify-center mt-[22px] mb-[16px]">
                            <div className="w-[295px] flex flex-col items-center">
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

                        {/* Search Input */}
                        <div className="font-ibarra text-[24px] font-bold flex flex-row items-center gap-[8px] w-full">
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
                        </div>

                        {/* Course Title Label */}
                        <div className="mt-[16px] w-full font-ibarra text-[20px] font-semibold text-[#DA1A32]">
                            {course?.title ? `Reviews for "${course.title}"` : 'Course Reviews'}
                        </div>

                        {/* Review Container */}
                        <div className="mt-[22px] w-screen max-h-[380px] overflow-y-scroll no-scrollbar pb-[64px] pt-[10px]">
                            <div className="grid grid-cols-3 gap-[20px] w-[1090px] mx-auto">
                                {loading ? (
                                    <div className="col-span-3 text-center font-inter text-[14px] text-gray-500 py-[40px]">
                                        Loading reviews...
                                    </div>
                                ) : filteredReviews.length === 0 ? (
                                    <div className="col-span-3 text-center font-inter text-[14px] text-gray-500 py-[40px]">
                                        No reviews found for this course.
                                    </div>
                                ) : (
                                    filteredReviews.map((review) => (
                                        <button
                                            key={review.feedbackId}
                                            onClick={() => {
                                                setSelectedReview(review);
                                                setShowReviewView(true);
                                            }}
                                            className="w-[350px] h-[153px] bg-white flex flex-col p-[10px] shadow-[0px_0px_20px_rgba(0,0,0,0.1)] rounded-[20px] cursor-pointer hover:scale-[105%] transition-all duration-[600ms] text-left">
                                            <div className="flex flex-row justify-between items-center">
                                                <div className="flex flex-row gap-[6px]">
                                                    <div className="w-[25px] h-[25px] bg-[#DA1A32] flex items-center justify-center rounded-full text-white text-[12px] overflow-hidden">
                                                        {review.userProfileImg ? (
                                                            <img src={review.userProfileImg} alt="avatar" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none' }} />
                                                        ) : (
                                                            <span>{review.userInitial}</span>
                                                        )}
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
                                        </button>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Review View Modal */}
                {showReviewView && selectedReview && (
                    <DisplayReview
                        onClose={() => setShowReviewView(false)}
                        review={selectedReview}
                    />
                )}

                {user?.userId && (
                    <button
                        onClick={() => {
                            setShowReviewForm(true);
                        }}
                        className="fixed bottom-[20px] right-[20px] flex items-center justify-between h-[40px] bg-white border border-black rounded-full pr-[4px] pl-[22px] cursor-pointer hover:scale-105 transition-all duration-[600ms]"
                    >
                        <div className="font-inter text-[16px] font-light text-black">
                            Review
                        </div>
                        <div className="w-[30px] h-[30px] bg-[#DA1A32] flex items-center justify-center rounded-full text-white text-[12px] ml-[20px]">
                            <IoAdd className="text-white w-[32px] h-[32px]" />
                        </div>
                    </button>
                )}

            </div>
        </Layout>
    );
};

export default RgUserCourseReview;
