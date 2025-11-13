import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import RgUserLayout from "../components/RgUserLayout.tsx";
import { FaStar } from "react-icons/fa";
import { IoAdd } from "react-icons/io5";

interface Review {
    feedbackId: number;
    userId: number;
    userName: string;
    userInitial: string;
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
    const [course, setCourse] = useState<Course | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

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
                    feedbackId: review.feedbackId,
                    userId: review.userId,
                    userName: review.userName || "Anonymous",
                    userInitial: (review.userName || "A").charAt(0).toUpperCase(),
                    rating: review.rating,
                    title: review.title,
                    description: review.description,
                    createdAt: review.createdAt,
                    timeAgo: getTimeAgo(review.createdAt)
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
                                <button className="cursor-pointer uppercase hover:text-[#DA1A32] transition-all duration-[600ms]">
                                    Learn
                                </button>
                                <IoIosArrowForward className="text-[#DA1A32] h-[18px]" />
                                <button className="cursor-pointer uppercase hover:text-[#DA1A32] transition-all duration-[600ms]">
                                    {course?.categoryName || 'Category'}
                                </button>
                                <IoIosArrowForward className="text-[#DA1A32] h-[18px]" />
                                <button className="cursor-pointer uppercase hover:text-[#DA1A32] transition-all duration-[600ms]">
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
                        <div className="mt-[22px] w-full">
                            <input
                                type="text"
                                placeholder="Search review..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full h-[40px] px-[20px] rounded-full border border-[#D9D9D9] text-[14px] font-inter focus:outline-none focus:border-[#DA1A32]"
                            />
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
                                        <div key={review.feedbackId} className="w-[350px] h-[153px] bg-white flex flex-col p-[10px] shadow-[0px_0px_20px_rgba(0,0,0,0.1)] rounded-[20px]">
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
                    </div>
                </div>

                <button className="fixed bottom-[20px] right-[20px] flex items-center justify-between h-[40px] bg-white border border-black rounded-full pr-[4px] pl-[22px] cursor-pointer hover:scale-105 transition-all duration-[600ms]">
                    <div className="font-inter text-[16px] font-light text-black">
                        Review
                    </div>
                    <div className="w-[30px] h-[30px] bg-[#DA1A32] flex items-center justify-center rounded-full text-white text-[12px] ml-[20px]">
                        <IoAdd className="text-white w-[32px] h-[32px]" />
                    </div>
                </button>
            </div>
        </RgUserLayout>
    );
};

export default RgUserCourseReview;
