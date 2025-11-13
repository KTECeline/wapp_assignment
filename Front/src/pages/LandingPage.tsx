import { FaStar } from "react-icons/fa";
import { IoMdHeart } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import VisitorLayout from "../components/VisitorLayout.tsx";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Review {
    id: number;
    userName: string;
    userInitial: string;
    rating: number;
    title: string;
    description: string;
    timeAgo: string;
}

const RgUserHome = () => {
    const [categories, setCategories] = useState<any[]>([]);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [reviewsLoading, setReviewsLoading] = useState(true);

    useEffect(() => {
        fetch('/api/categories')
            .then(res => res.json())
            .then(data => {
                // Take only first 3 items
                setCategories(data.slice(0, 3));
            })
            .catch(err => console.error("Error fetching categories:", err));
    }, []);

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

    // Fetch reviews on component mount
    useEffect(() => {
        const fetchReviews = async () => {
            try {
                setReviewsLoading(true);
                const res = await fetch('/api/UserFeedbacks');
                if (!res.ok) throw new Error("Failed to fetch reviews");
                
                const data = await res.json();
                
                // Filter for reviews and website feedback, sort by rating (desc) then by date (desc)
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
                    .slice(0, 3) // Take only top 3
                    .map((item: any) => {
                        const userInitial = item.userName ? item.userName.charAt(0).toUpperCase() : 'U';
                        const timeAgo = getTimeAgo(new Date(item.createdAt));
                        
                        return {
                            id: item.id,
                            userName: item.userName || 'Anonymous',
                            userInitial,
                            rating: item.rating,
                            title: item.title,
                            description: item.description,
                            timeAgo
                        };
                    });
                
                setReviews(reviewsData);
            } catch (err) {
                console.error("Error fetching reviews:", err);
                setReviews([]);
            } finally {
                setReviewsLoading(false);
            }
        };

        fetchReviews();
    }, []);


    const navigate = useNavigate();

    const [active, setActive] = useState<string | null>(null);
    const [showPopup, setShowPopup] = useState(false);

    return (
        <VisitorLayout>
            <style>
                {`
                        .scrol::-webkit-scrollbar {
                            width: 5px;
                            height: 5px;
                        }
                        .scrol::-webkit-scrollbar-track {
                            background: rgba(188, 188, 188, 0.2);
                            border-radius: 10px;
                            cursor: pointer;
                        }
                        .scrol::-webkit-scrollbar-thumb {
                            background: rgba(0, 0, 0, 0.2);
                            border-radius: 10px;
                            transition: background 0.3s ease-in-out;
                            cursor: grab;
                        }
                        .scrol::-webkit-scrollbar-thumb:active {
                            cursor: grabbing;
                        }
                    `}
            </style>

            {/* HeroSection */}
            <div className="w-full h-[500px] relative">
                <img src="/images/Announcement2.jpg" alt="announcement" className="w-full h-[500px] object-cover z-0" />
                <div className="absolute top-0 left-0 w-full h-[500px] bg-[#fefefe]/20 backdrop-blur-[12px] z-10" />
                <div className="absolute top-0 left-0 w-full h-[500px] z-20">
                    <div className="relative w-[1100px] h-[500px] mx-auto">
                        <img src="/images/Announcement2.jpg" alt="announcement" className="w-full h-full object-cover" />
                        <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-br from-[#000000]/50 to-[#000000]/10" />
                        <div className="absolute top-[120px] left-0 w-full text-white pl-[122px]">
                            <div className="text-[40px] max-w-[500px] leading-tight font-medium drop-shadow-[0px_2px_5px_rgba(0,0,0,0.55)]">
                                Discover the Art of Pastry, Anytime, Anywhere
                            </div>
                            <div className="text-[14px] max-w-[390px] leading-tight font-[200] pt-[18px] drop-shadow-[0px_2px_5px_rgba(0,0,0,0.55)]">
                                Learn to bake like a pro with expert pastry chefs guiding you through fun, step-by-step online lessons for bakery-quality treats at home.
                            </div>

                            <div className="mt-[24px] w-[340.6px] gap-[12px] flex flex-row justify-between">
                                <Link to="/Register"
                                    className="w-[62%] h-[44px] hover:scale-105 flex justify-center items-center rounded-full transition-all duration-[600ms] bg-[#DA1A32] text-white"
                                >
                                    Start Now
                                </Link>

                                <Link to="/Login"
                                    className="w-[36%] h-[44px] relative group cursor-pointer rounded-full mx-[2px] flex justify-center items-center text-white font-inter border-white border hover:scale-105 transition-all duration-[600ms]"
                                >
                                    Login
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Discover Courses */}
            <div className="mt-[36px] items-center text-black flex flex-col w-full">
                <div className="font-ibarra text-[32px] font-bold flex flex-row items-center gap-[8px]">
                    <div className="w-[16px] h-[1px] bg-[#DA1A32]" />
                    Discover Our Courses
                    <div className="w-[16px] h-[1px] bg-[#DA1A32]" />
                </div>

                <div className="mt-[8px] font-inter text-[14px] flex flex-row items-center font-light max-w-[540px] text-center">
                    Explore our most popular recipe categories, from soft breads to delicate pastries and classic cookies. Choose your favorite and start baking today.
                </div>

                <div className="mt-[38px] text-black flex flex-row justify-between w-[1090px] mx-auto">
                    <div className="w-full">
                        {/* Category container */}
                        <div className="grid grid-cols-3 gap-x-[20px] gap-y-[44px]">
                            {categories.map(category => (
                                <div
                                    key={category.categoryId}
                                    className="w-[350px] flex flex-col items-center group cursor-pointer"
                                    onClick={() => navigate(`/RgUserCat/${category.categoryId}`)}
                                >
                                    <img
                                        src={category.catImg}
                                        alt={category.title}
                                        className="w-full h-[237px] object-cover"
                                    />
                                    <div className="font-ibarra font-bold text-black text-[20px] mt-[16px] group-hover:text-[#DA1A32] transition-all duration-300">
                                        {category.title}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <button className="font-inter mt-[38px] cursor-pointer mx-auto bg-white px-[22px] py-[2px] border-[1px] border-black rounded-full font-light hover:scale-105 transition-all duration-[600ms]"
                    onClick={() => navigate(`/RgUserLearn`)}
                >
                    View More
                </button>
            </div>

            {/* Discover Posts */}
            <div className="mt-[62px] bg-[#F8F5F0] pt-[36px] items-center text-black flex flex-col w-full pb-[62px] relative">
                <div className="font-ibarra text-[32px] font-bold flex flex-row items-center gap-[8px]">
                    <div className="w-[16px] h-[1px] bg-[#DA1A32]" />
                    Join Our Community
                    <div className="w-[16px] h-[1px] bg-[#DA1A32]" />
                </div>

                <div className="mt-[8px] font-inter text-[14px] flex flex-row items-center font-light max-w-[540px] text-center">
                    Share your creations, exchange tips, and connect with fellow baking enthusiasts worldwide. De Pastry Lab is more than learning, it’s about growing together.
                </div>

                {/* Post Container */}
                <div className="mt-[38px] flex flex-row gap-[20px] max-w-screen">

                    {/* Post Card */}
                    <div className="cursor-pointer hover:scale-[105%] transition-all duration-[600ms] w-[350px] h-[323px] bg-white flex flex-row gap-[16px] p-[10px] shadow-[0px_0px_20px_rgba(0,0,0,0.1)] rounded-[20px]">
                        <div className="relative w-[170px] h-full rounded-[16px] overflow-hidden">
                            <img src="/images/Post.webp" alt="post" className="w-full h-full object-cover z-0" />
                            <div className="absolute top-0 left-0 w-full h-full bg-[#fefefe]/20 backdrop-blur-[12px] z-10" />
                            <div className="absolute top-0 left-0 w-full h-full flex items-center z-20">
                                <img src="/images/Post.webp" alt="post" className="w-full object-cover" />
                            </div>
                        </div>

                        <div className="flex flex-col w-[142px] justify-between">
                            <div>
                                <div className="flex flex-row justify-between items-center">
                                    {/* Profile and time */}
                                    <div className="flex flex-row gap-[6px]">
                                        <div className="w-[25px] h-[25px] bg-[#DA1A32] flex items-center justify-center rounded-full text-white text-[12px]">
                                            A
                                        </div>

                                        <div className="flex flex-col">
                                            <div className="font-inter text-[10px] line-clamp-1 max-w-[64px]">
                                                Amy Wong
                                            </div>

                                            <div className="font-inter font-light text-[7px] line-clamp-1 max-w-[64px] ">
                                                17 hours ago
                                            </div>
                                        </div>
                                    </div>

                                    {/* Like button */}
                                    <button className="cursor-pointer">
                                        <IoMdHeart className="w-[20px] h-[20px] text-[#D9D9D9]" />
                                    </button>
                                </div>

                                {/* Post title */}
                                <div className="font-ibarra mt-[16px] line-clamp-3 text-[16px] font-bold leading-tight">
                                    My Freshly Baked Brownies
                                </div>

                                {/* Post Description */}
                                <div className="font-inter mt-[12px] line-clamp-5 text-[10px] font-light text-justify">
                                    WOW — the chocolate flavor is next-level! Can’t wait to share them with the family tonight. 🥰
                                </div>

                                {/* Hashtage, Course Name and Category */}
                                <div className="font-inter mt-[26px] line-clamp-4 text-[10px] font-light underline cursor-pointer">
                                    <span>#Small-Batch Brownies</span>
                                    <span>#Cakes</span>
                                </div>
                            </div>

                            <div className="flex flex-col">
                                <div className="bg-black w-full h-[1px]" />
                                <div className="flex flex-row font-inter text-[10px] font-light gap-[2px] mt-[5px] mb-[3px]">
                                    <IoMdHeart className="w-[17px] h-[17px] text-[#FF5454]" />
                                    <div className="translate-y-[2px]">
                                        100
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Post Card */}
                    <div className="cursor-pointer hover:scale-[105%] transition-all duration-[600ms] w-[350px] h-[323px] bg-white flex flex-row gap-[16px] p-[10px] shadow-[0px_0px_20px_rgba(0,0,0,0.1)] rounded-[20px]">
                        <div className="relative w-[170px] h-full rounded-[16px] overflow-hidden">
                            <img src="/images/Post.webp" alt="post" className="w-full h-full object-cover z-0" />
                            <div className="absolute top-0 left-0 w-full h-full bg-[#fefefe]/20 backdrop-blur-[12px] z-10" />
                            <div className="absolute top-0 left-0 w-full h-full flex items-center z-20">
                                <img src="/images/Post.webp" alt="post" className="w-full object-cover" />
                            </div>
                        </div>

                        <div className="flex flex-col w-[142px] justify-between">
                            <div>
                                <div className="flex flex-row justify-between items-center">
                                    {/* Profile and time */}
                                    <div className="flex flex-row gap-[6px]">
                                        <div className="w-[25px] h-[25px] bg-[#DA1A32] flex items-center justify-center rounded-full text-white text-[12px]">
                                            A
                                        </div>

                                        <div className="flex flex-col">
                                            <div className="font-inter text-[10px] line-clamp-1 max-w-[64px]">
                                                Amy Wong
                                            </div>

                                            <div className="font-inter font-light text-[7px] line-clamp-1 max-w-[64px] ">
                                                17 hours ago
                                            </div>
                                        </div>
                                    </div>

                                    {/* Like button */}
                                    <button className="cursor-pointer">
                                        <IoMdHeart className="w-[20px] h-[20px] text-[#D9D9D9]" />
                                    </button>
                                </div>

                                {/* Post title */}
                                <div className="font-ibarra mt-[16px] line-clamp-3 text-[16px] font-bold leading-tight">
                                    My Freshly Baked Brownies
                                </div>

                                {/* Post Description */}
                                <div className="font-inter mt-[12px] line-clamp-5 text-[10px] font-light text-justify">
                                    WOW — the chocolate flavor is next-level! Can’t wait to share them with the family tonight. 🥰
                                </div>

                                {/* Hashtage, Course Name and Category */}
                                <div className="font-inter mt-[26px] line-clamp-4 text-[10px] font-light underline cursor-pointer">
                                    <span>#Small-Batch Brownies</span>
                                    <span>#Cakes</span>
                                </div>
                            </div>

                            <div className="flex flex-col">
                                <div className="bg-black w-full h-[1px]" />
                                <div className="flex flex-row font-inter text-[10px] font-light gap-[2px] mt-[5px] mb-[3px]">
                                    <IoMdHeart className="w-[17px] h-[17px] text-[#FF5454]" />
                                    <div className="translate-y-[2px]">
                                        100
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Post Card */}
                    <div className="cursor-pointer hover:scale-[105%] transition-all duration-[600ms] w-[350px] h-[323px] bg-white flex flex-row gap-[16px] p-[10px] shadow-[0px_0px_20px_rgba(0,0,0,0.1)] rounded-[20px]">
                        <div className="relative w-[170px] h-full rounded-[16px] overflow-hidden">
                            <img src="/images/Post.webp" alt="post" className="w-full h-full object-cover z-0" />
                            <div className="absolute top-0 left-0 w-full h-full bg-[#fefefe]/20 backdrop-blur-[12px] z-10" />
                            <div className="absolute top-0 left-0 w-full h-full flex items-center z-20">
                                <img src="/images/Post.webp" alt="post" className="w-full object-cover" />
                            </div>
                        </div>

                        <div className="flex flex-col w-[142px] justify-between">
                            <div>
                                <div className="flex flex-row justify-between items-center">
                                    {/* Profile and time */}
                                    <div className="flex flex-row gap-[6px]">
                                        <div className="w-[25px] h-[25px] bg-[#DA1A32] flex items-center justify-center rounded-full text-white text-[12px]">
                                            A
                                        </div>

                                        <div className="flex flex-col">
                                            <div className="font-inter text-[10px] line-clamp-1 max-w-[64px]">
                                                Amy Wong
                                            </div>

                                            <div className="font-inter font-light text-[7px] line-clamp-1 max-w-[64px] ">
                                                17 hours ago
                                            </div>
                                        </div>
                                    </div>

                                    {/* Like button */}
                                    <button className="cursor-pointer">
                                        <IoMdHeart className="w-[20px] h-[20px] text-[#D9D9D9]" />
                                    </button>
                                </div>

                                {/* Post title */}
                                <div className="font-ibarra mt-[16px] line-clamp-3 text-[16px] font-bold leading-tight">
                                    My Freshly Baked Brownies
                                </div>

                                {/* Post Description */}
                                <div className="font-inter mt-[12px] line-clamp-5 text-[10px] font-light text-justify">
                                    WOW — the chocolate flavor is next-level! Can’t wait to share them with the family tonight. 🥰
                                </div>

                                {/* Hashtage, Course Name and Category */}
                                <div className="font-inter mt-[26px] line-clamp-4 text-[10px] font-light underline cursor-pointer">
                                    <span>#Small-Batch Brownies</span>
                                    <span>#Cakes</span>
                                </div>
                            </div>

                            <div className="flex flex-col">
                                <div className="bg-black w-full h-[1px]" />
                                <div className="flex flex-row font-inter text-[10px] font-light gap-[2px] mt-[5px] mb-[3px]">
                                    <IoMdHeart className="w-[17px] h-[17px] text-[#FF5454]" />
                                    <div className="translate-y-[2px]">
                                        100
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <button className="font-inter mt-[48px] cursor-pointer mx-auto bg-white px-[22px] py-[2px] border-[1px] border-black rounded-full font-light hover:scale-105 transition-all duration-[600ms]">
                    View More
                </button>
            </div>

            {/* About Us */}
            <div className="mt-[36px] items-center text-black flex flex-col w-full">
                <div className="font-ibarra text-[32px] font-bold flex flex-row items-center gap-[8px]">
                    <div className="w-[16px] h-[1px] bg-[#DA1A32]" />
                    Our Journey
                    <div className="w-[16px] h-[1px] bg-[#DA1A32]" />
                </div>

                <div className="mt-[38px] text-black flex flex-row justify-between w-[1090px] mx-auto">
                    <div className="w-[500px]">
                        <div className="flex flex-col">
                            <p className="font-ibarra font-bold text-black text-[36px]">
                                About <span className="text-[#DA1A32]">Us</span>
                            </p>

                            <p className="mt-[6px] text-[14px] font-inter font-light text-justify">
                                At De Pastry Lab, we believe that the art of baking should be accessible to everyone. Whether you’re a complete beginner discovering the joy of baking for the first time or an aspiring pastry chef aiming to perfect your craft. Our platform was created with one mission in mind: To inspire and empower learners to explore the world of pastries, cakes, and desserts through hands-on, high-quality online learning.
                            </p>

                            <p className="mt-[32px] font-ibarra font-bold text-black text-[28px]">
                                Our Mission
                            </p>

                            <p className="mt-[6px] text-[14px] font-inter font-light text-justify">
                                Our mission is to make pastry education engaging, practical, and inclusive. We aim to bridge the gap between professional techniques and home-baking creativity by offering easy-to-follow lessons, expert guidance, and a supportive learning community.
                            </p>


                            <p className="mt-[32px] font-ibarra font-bold text-black text-[28px]">
                                Our Vision
                            </p>
                            <p className="mt-[6px] text-[14px] font-inter font-light text-justify">
                                We envision a world where anyone with a whisk and a little curiosity can create pastries that bring people together. De Pastry Lab strives to be the leading e-learning hub for pastry education, nurturing creativity, confidence, and lifelong passion for baking.
                            </p>
                        </div>
                    </div>

                    <div className="w-[500px]">
                        <div className="w-full h-[540px] relative overflow-hidden rounded-[30px]">
                            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-black/10 to-black/0" ></div>

                            <video
                                id="De Pastry Lab"
                                className="w-full h-full object-cover"
                                autoPlay
                                muted
                                loop
                                src="/videos/Register.mp4"
                            >
                            </video>
                        </div>
                    </div>
                </div>
            </div>

            {/* What we offer */}
            <div className="mt-[80px] w-full flex flex-col items-center text-black px-4">
                {/* Section Title */}
                <div className="font-ibarra text-[32px] font-bold flex items-center gap-[8px]">
                    <div className="w-[30px] h-[2px] bg-[#DA1A32]" />
                    What We Offer
                    <div className="w-[30px] h-[2px] bg-[#DA1A32]" />
                </div>

                {/* Cards Container */}
                <div className="grid grid-cols-4 gap-[20px] mt-[38px] max-w-[1200px] w-full">

                    {/* Card */}
                    <div className="bg-[#F8F5F0] rounded-2xl shadow-sm p-6 flex flex-col items-center text-center">
                        <h3 className="font-ibarra font-bold text-[18px] text-[#DA1A32] mb-2">Interactive Courses</h3>
                        <p className="font-inter text-[13px] text-gray-600">
                            Step-by-step lessons designed by passionate pastry experts.
                        </p>
                    </div>

                    {/* Card */}
                    <div className="bg-[#F8F5F0] rounded-2xl shadow-sm p-6 flex flex-col items-center text-center">
                        <h3 className="font-ibarra font-bold text-[18px] text-[#DA1A32] mb-2">Learn Anytime, Anywhere</h3>
                        <p className="font-inter text-[13px] text-gray-600">
                            Access courses on your own schedule, perfect for hobbyists and busy professionals.
                        </p>
                    </div>

                    {/* Card */}
                    <div className="bg-[#F8F5F0] rounded-2xl shadow-sm p-6 flex flex-col items-center text-center">
                        <h3 className="font-ibarra font-bold text-[18px] text-[#DA1A32] mb-2">Practical Skills</h3>
                        <p className="font-inter text-[13px] text-gray-600">
                            Learn techniques you can apply instantly, from basic pastries to advanced desserts.
                        </p>
                    </div>

                    {/* Card */}
                    <div className="bg-[#F8F5F0] rounded-2xl shadow-sm p-6 flex flex-col items-center text-center">
                        <h3 className="font-ibarra font-bold text-[18px] text-[#DA1A32] mb-2">Community & Sharing</h3>
                        <p className="font-inter text-[13px] text-gray-600">
                            A place to connect, share your creations, and celebrate progress together.
                        </p>
                    </div>
                </div>
            </div>


            {/* Reviews */}
            <div className="mt-[62px] items-center text-black flex flex-col w-full bg-[#F8F5F0] pt-[36px] pb-[62px] relative">
                <div className="font-ibarra text-[32px] font-bold flex flex-row items-center gap-[8px]">
                    <div className="w-[16px] h-[1px] bg-[#DA1A32]" />
                    What our Student Say?
                    <div className="w-[16px] h-[1px] bg-[#DA1A32]" />
                </div>

                {/* Review Container */}
                <div className="mt-[38px] flex flex-row gap-[20px] max-w-screen">


                {reviewsLoading ? (
                    <div className="text-center py-8">Loading reviews...</div>
                ) : reviews.length === 0 ? (
                    <div className="text-center py-8">No reviews yet</div>
                ) : (
                    reviews.map((review) => (
                        <div key={review.id} className="w-[350px] h-[153px] bg-white flex flex-col p-[10px] shadow-[0px_0px_20px_rgba(0,0,0,0.1)] rounded-[20px] flex-shrink-0">
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

                                        <div className="font-inter font-light text-[7px] line-clamp-1 max-w-[64px] ">
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
                                            {/* Gray star background */}
                                            <FaStar
                                                className="absolute top-0 left-0 text-gray-300"
                                                size="14px"
                                            />
                                            {/* Red filled star */}
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

                <button className="font-inter mt-[48px] cursor-pointer mx-auto bg-white px-[22px] py-[2px] border border-black rounded-full font-light hover:scale-105 transition-all duration-[600ms]">
                    View More
                </button>
            </div>

            {/* Call to Action Section */}
            <div className="mt-[48px] pb-[62px] w-full bg-white flex flex-col items-center text-black px-6">

                {/* Decorative Divider */}
                <div className="flex items-center justify-center gap-[8px] mb-[12px]">
                    <div className="w-[30px] h-[2px] bg-[#DA1A32]" />
                    <span className="font-ibarra text-[14px] text-[#DA1A32] uppercase tracking-widest">
                        Join Us Now
                    </span>
                    <div className="w-[30px] h-[2px] bg-[#DA1A32]" />
                </div>

                {/* Headline */}
                <h2 className="font-ibarra text-[32px] font-bold text-center mb-4">
                    Ready to Start Your Baking Journey?
                </h2>

                {/* Subtext */}
                <p className="font-inter text-[15px] text-gray-600 text-center max-w-[600px] mb-8">
                    Join De Pastry Lab today and learn step-by-step from expert pastry chefs.
                    Whether you're baking for fun or chasing your dream, we’ve got the right course for you.
                </p>

                {/* Buttons */}
                <div className="flex flex-row gap-[18px] mt-4">
                    {/* Main CTA */}
                    <a
                        href="/Register"
                        className="py-2 px-10 bg-[#DA1A32] text-white rounded-full font-medium hover:scale-105 transition-all duration-[600ms]"
                    >
                        Start Now
                    </a>

                    {/* Secondary CTA */}
                    <button
                        onClick={() => { setActive("Contact Us"); setShowPopup(true); }}
                        className="py-2 px-10 border border-[#DA1A32] text-[#DA1A32] rounded-full font-medium hover:scale-105  transition-all duration-[600ms]"
                    >
                        Need Help?
                    </button>
                </div>

                <div className="mt-[48px] text-black flex flex-row justify-between w-[1090px] mx-auto">
                    <div className="w-full">
                        {/* Category container */}
                        <div className="grid grid-cols-3 gap-x-[20px] gap-y-[44px]">
                            {/* Category Card */}
                            <div className="w-[350px] flex flex-col items-center group cursor-pointer">
                                <img src="/images/L1.jpg" alt="Bread" className="w-full h-[237px] object-cover" />
                            </div>

                            {/* Category Card */}
                            <div className="w-[350px] flex flex-col items-center group cursor-pointer">
                                <img src="/images/L3.jpg" alt="Pastry" className="w-full h-[237px] object-cover" />
                            </div>

                            {/* Category Card */}
                            <div className="w-[350px] flex flex-col items-center group cursor-pointer">
                                <img src="/images/L2.jpg" alt="Cookie" className="w-full h-[237px] object-cover" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <footer className="mt-[80px] bg-[#F8F5F0] py-[60px] px-[80px] text-black">
                <div className="grid grid-cols-4 gap-[40px] max-w-[1200px] mx-auto">
                    {/* Brand */}
                    <div className="w-[300px]">
                        <h3 className="font-ibarra text-[20px] font-bold mb-3 text-[#DA1A32]">De Pastry Lab</h3>
                        <p className="font-inter text-[13px] text-gray-600 leading-relaxed max-w-[250px] text-justify">
                            Empowering everyone to discover the joy of baking, from simple pastries
                            to elegant desserts. Learn, practice, and connect with a community that shares your passion.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="ml-24">
                        <h4 className="font-ibarra font-bold text-[16px] mb-3">Quick Links</h4>
                        <ul className="space-y-2 text-[13px] text-gray-600">
                            <li><a href="/" className="hover:text-[#DA1A32]">Home</a></li>
                            <li><a href="/RgUserLearn" className="hover:text-[#DA1A32]">Learn</a></li>
                            <li><a href="/RgUserPost" className="hover:text-[#DA1A32]">Posts</a></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div className="ml-16">
                        <h4 className="font-ibarra font-bold text-[16px] mb-3">Get Support</h4>
                        <ul className="space-y-2 text-[13px] text-gray-600">
                            <li><button onClick={() => { setActive("About Us"); setShowPopup(true); }} className="hover:text-[#DA1A32]">About Us</button></li>
                            <li><button onClick={() => { setActive("Contact Us"); setShowPopup(true); }} className="hover:text-[#DA1A32]">Contact Us</button></li>
                            <li><button onClick={() => { setActive("Terms and Conditions"); setShowPopup(true); }} className="hover:text-[#DA1A32]">Terms and Conditions</button></li>
                            <li><button onClick={() => { setActive("FAQ"); setShowPopup(true); }} className="hover:text-[#DA1A32]">FAQs</button></li>
                        </ul>

                    </div>

                    {/* Social */}
                    <div className="ml-6">
                        <h4 className="font-ibarra font-bold text-[16px] mb-3">Stay Connected</h4>
                        <p className="text-[13px] text-gray-600 mb-3">
                            Join our baking community for the latest updates, new courses, and tips!
                        </p>
                    </div>
                </div>

                {/* Bottom Line */}
                <div className="mt-10 border-t border-gray-300 pt-4 text-center text-[12px] text-gray-500">
                    © {new Date().getFullYear()} De Pastry Lab. All rights reserved.
                </div>
            </footer>

            <AnimatePresence>
                {showPopup && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
                    >
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-3xl w-full relative overflow-y-scroll scrol max-h-[90vh]">
                                {/* Close button */}
                                <button
                                    onClick={() => setShowPopup(false)}
                                    className="absolute top-4 right-4 text-gray-600 hover:text-[#DA1A32] text-xl font-bold"
                                >
                                    ×
                                </button>

                                {/* Dynamic content */}
                                {active === "About Us" && (
                                    <div className="flex flex-col">
                                        <p className="font-ibarra font-bold text-black text-[36px]">
                                            About <span className="text-[#DA1A32]">Us</span>
                                        </p>

                                        <p className="mt-[6px] text-[14px] font-inter font-light text-justify">
                                            At De Pastry Lab, we believe that the art of baking should be accessible to everyone. Whether you’re a complete beginner discovering the joy of baking for the first time or an aspiring pastry chef aiming to perfect your craft. Our platform was created with one mission in mind: To inspire and empower learners to explore the world of pastries, cakes, and desserts through hands-on, high-quality online learning.
                                        </p>

                                        <p className="mt-[32px] font-ibarra font-bold text-black text-[28px]">
                                            Our Mission
                                        </p>

                                        <p className="mt-[6px] text-[14px] font-inter font-light text-justify">
                                            Our mission is to make pastry education engaging, practical, and inclusive. We aim to bridge the gap between professional techniques and home-baking creativity by offering easy-to-follow lessons, expert guidance, and a supportive learning community.
                                        </p>

                                        <p className="mt-[32px] font-ibarra font-bold text-black text-[28px]">
                                            What We Offer
                                        </p>

                                        <div className="mt-[6px] text-[14px] font-inter font-light flex flex-col gap-[16px]">
                                            <li className="flex flex-row gap-[12px]">
                                                <div className="w-[12px] h-[2px] bg-[#DA1A32] mt-[8px]" />
                                                <span className="flex flex-col">
                                                    <span className="font-bold mb-[2px]">Interactive Courses:
                                                    </span>
                                                    Step-by-step lessons designed by passionate pastry experts.
                                                </span>
                                            </li>

                                            <li className="flex flex-row gap-[12px]">
                                                <div className="w-[12px] h-[2px] bg-[#DA1A32] mt-[8px]" />
                                                <span className="flex flex-col">
                                                    <span className="font-bold mb-[2px]">Learn Anytime, Anywhere:
                                                    </span>
                                                    Access courses on your own schedule, perfect for hobbyists and busy professionals.
                                                </span>
                                            </li>

                                            <li className="flex flex-row gap-[12px]">
                                                <div className="w-[12px] h-[2px] bg-[#DA1A32] mt-[8px]" />
                                                <span className="flex flex-col">
                                                    <span className="font-bold mb-[2px]">Practical Skills:
                                                    </span>
                                                    Learn techniques you can apply instantly, from basic pastries to advanced desserts.
                                                </span>
                                            </li>

                                            <li className="flex flex-row gap-[12px]">
                                                <div className="w-[12px] h-[2px] bg-[#DA1A32] mt-[8px]" />
                                                <span className="flex flex-col">
                                                    <span className="font-bold mb-[2px]">Community & Sharing:
                                                    </span>
                                                    A place to connect, share your creations, and celebrate progress together.
                                                </span>
                                            </li>
                                        </div>

                                        <p className="mt-[32px] font-ibarra font-bold text-black text-[28px]">
                                            Our Vision
                                        </p>
                                        <p className="mt-[6px] text-[14px] font-inter font-light text-justify">
                                            We envision a world where anyone with a whisk and a little curiosity can create pastries that bring people together. De Pastry Lab strives to be the leading e-learning hub for pastry education, nurturing creativity, confidence, and lifelong passion for baking.
                                        </p>
                                    </div>
                                )}

                                {active === "Contact Us" && (
                                    <div className="flex flex-col min-h-[518px]">
                                        <p className="font-ibarra font-bold text-black text-[36px]">
                                            Contact <span className="text-[#DA1A32]">Us</span>
                                        </p>

                                        <p className="mt-[6px] text-[14px] font-inter font-light text-justify">
                                            We’d love to hear from you! At De Pastry Lab, we value your feedback, questions, and ideas.
                                            Whether you’re reaching out for support, partnership opportunities, or simply to share your
                                            baking journey, our team is here to help and connect with you.
                                        </p>

                                        <p className="mt-[32px] font-ibarra font-bold text-black text-[28px]">
                                            Get in Touch
                                        </p>

                                        <div className="mt-[6px] text-[14px] font-inter font-light flex flex-col gap-[16px]">
                                            <li className="flex flex-row gap-[12px]">
                                                <div className="w-[12px] h-[2px] bg-[#DA1A32] mt-[8px]" />
                                                <span className="flex flex-col max-w-[530px]">
                                                    <span className="font-bold mb-[2px]">Email Support:</span>
                                                    <span className="text-justify">
                                                        Reach out anytime at <span className="text-[#DA1A32] font-medium mx-[3px]">support@depastrylab.com</span> for course help, account inquiries, or technical assistance.
                                                    </span>
                                                </span>
                                            </li>

                                            <li className="flex flex-row gap-[12px]">
                                                <div className="w-[12px] h-[2px] bg-[#DA1A32] mt-[8px]" />
                                                <span className="flex flex-col">
                                                    <span className="font-bold mb-[2px]">Community Engagement:</span>
                                                    <span className="text-justify">
                                                        Share your pastry creations or join discussions on our forums and social channels.
                                                    </span>
                                                </span>
                                            </li>
                                        </div>

                                        <p className="mt-[32px] font-ibarra font-bold text-black text-[28px]">
                                            Follow Us
                                        </p>
                                        <p className="mt-[6px] text-[14px] font-inter font-light text-justify">
                                            Stay inspired and connected! Follow us on social media for the latest recipes,
                                            baking tips, and updates from the De Pastry Lab community.
                                        </p>
                                    </div>
                                )}

                                {active === "Terms and Conditions" && (
                                    <div className="flex flex-col">
                                        <p className="font-ibarra font-bold text-black text-[36px]">
                                            Terms & <span className="text-[#DA1A32]">Conditions</span>
                                        </p>

                                        <p className="mt-[6px] text-[14px] font-inter font-light text-justify">
                                            Welcome to De Pastry Lab! By accessing or using our platform, you agree to follow the terms and conditions outlined below. These terms are designed to ensure a safe, fair, and enjoyable learning experience for all our users. Please read them carefully before using our services.
                                        </p>

                                        <p className="mt-[32px] font-ibarra font-bold text-black text-[28px]">
                                            User Responsibilities
                                        </p>
                                        <div className="mt-[6px] text-[14px] font-inter font-light flex flex-col gap-[16px]">
                                            <li className="flex flex-row gap-[12px]">
                                                <div className="w-[12px] h-[2px] bg-[#DA1A32] mt-[8px]" />
                                                <span className="flex flex-col">
                                                    <span className="font-bold mb-[2px]">Account Security:</span>
                                                    You are responsible for keeping your login details secure and for all activities under your account.
                                                </span>
                                            </li>

                                            <li className="flex flex-row gap-[12px]">
                                                <div className="w-[12px] h-[2px] bg-[#DA1A32] mt-[8px]" />
                                                <span className="flex flex-col">
                                                    <span className="font-bold mb-[2px]">Respectful Use:</span>
                                                    Use the platform responsibly. Do not share harmful, offensive, or inappropriate content.
                                                </span>
                                            </li>

                                            <li className="flex flex-row gap-[12px]">
                                                <div className="w-[12px] h-[2px] bg-[#DA1A32] mt-[8px]" />
                                                <span className="flex flex-col">
                                                    <span className="font-bold mb-[2px]">Personal Use Only:</span>
                                                    All courses and resources are for your personal learning. Redistribution or resale is not permitted.
                                                </span>
                                            </li>
                                        </div>

                                        <p className="mt-[32px] font-ibarra font-bold text-black text-[28px]">
                                            Intellectual Property
                                        </p>
                                        <p className="mt-[6px] text-[14px] font-inter font-light text-justify">
                                            All course content, including videos, text, images, and resources, are the property of De Pastry Lab or its instructors. You may not copy, modify, distribute, or use the content for commercial purposes without permission.
                                        </p>


                                        <p className="mt-[32px] font-ibarra font-bold text-black text-[28px]">
                                            Limitation of Liability
                                        </p>
                                        <p className="mt-[6px] text-[14px] font-inter font-light text-justify">
                                            De Pastry Lab is not responsible for any issues, losses, or damages resulting from the use of our platform. While we aim to provide accurate and helpful content, baking results may vary based on individual skills, equipment, and environment.
                                        </p>

                                        <p className="mt-[32px] font-ibarra font-bold text-black text-[28px]">
                                            Changes to Terms
                                        </p>
                                        <p className="mt-[6px] text-[14px] font-inter font-light text-justify">
                                            We may update these Terms & Conditions from time to time to reflect changes in our services or policies. Users will be notified of significant updates, and continued use of our platform constitutes acceptance of the revised terms.
                                        </p>

                                        <p className="mt-[32px] text-[14px] font-inter font-light text-justify">
                                            Thank you for being part of De Pastry Lab. By using our platform, you help us build a respectful and inspiring space for pastry lovers everywhere!
                                        </p>
                                    </div>
                                )}

                                {active === "FAQ" && (
                                    <div className="flex flex-col">
                                        {/* Title */}
                                        <p className="font-ibarra font-bold text-black text-[36px]">
                                            Frequently Asked <span className="text-[#DA1A32]">Questions</span>
                                        </p>

                                        {/* Intro */}
                                        <p className="mt-[6px] text-[14px] font-inter font-light text-justify">
                                            Have questions about how De Pastry Lab works? Here are some quick answers
                                            to help you get started on your baking journey.
                                        </p>

                                        {/* FAQ List */}
                                        <div className="mt-[32px] flex flex-col gap-[24px] text-[14px] font-inter font-light">

                                            <div>
                                                <p className="font-bold text-[16px] text-black">
                                                    1. Is De Pastry Lab really free to use?
                                                </p>
                                                <p className="mt-[4px] text-gray-700 text-justify">
                                                    Yes! All our baking courses, practice quizzes, and community access are completely free.
                                                    You can learn, practice, and grow your skills without any hidden fees.
                                                </p>
                                            </div>

                                            <div>
                                                <p className="font-bold text-[16px] text-black">
                                                    2. How do the courses work?
                                                </p>
                                                <p className="mt-[4px] text-gray-700 text-justify">
                                                    Each course is divided into short, easy-to-follow lessons. You can learn at your own pace,
                                                    take notes, and test your knowledge with practice quizzes before attempting the final exam.
                                                </p>
                                            </div>

                                            <div>
                                                <p className="font-bold text-[16px] text-black">
                                                    3. What happens if I fail a quiz or final exam?
                                                </p>
                                                <p className="mt-[4px] text-gray-700 text-justify">
                                                    No worries! You can retry practice quizzes as many times as you like.
                                                    For the final exam, you’ll need to pass to officially complete the course,
                                                    sbut you can reattempt it anytime until you succeed.
                                                </p>
                                            </div>

                                            <div>
                                                <p className="font-bold text-[16px] text-black">
                                                    4. Do I get a certificate or achievement after finishing a course?
                                                </p>
                                                <p className="mt-[4px] text-gray-700 text-justify">
                                                    Yes! Once you pass the final exam, you’ll unlock a course completion badge and achievement.
                                                    These showcase your progress and can be proudly displayed in your profile.
                                                </p>
                                            </div>

                                            <div>
                                                <p className="font-bold text-[16px] text-black">
                                                    5. What’s the community section for?
                                                </p>
                                                <p className="mt-[4px] text-gray-700 text-justify">
                                                    The community is where learners share their creations, ask for feedback, and connect with other pastry lovers.
                                                    It’s a great place to learn tips, stay inspired, and grow together.
                                                </p>
                                            </div>

                                            <div>
                                                <p className="font-bold text-[16px] text-black">
                                                    6. Do I need to register before accessing the courses?
                                                </p>
                                                <p className="mt-[4px] text-gray-700 text-justify">
                                                    Yes, registration is required to save your progress, track achievements,
                                                    and participate in the community. It only takes a minute to sign up — and it’s free!
                                                </p>
                                            </div>
                                        </div>

                                        {/* Closing line */}
                                        <p className="mt-[36px] text-[14px] text-gray-600 text-justify">
                                            Still need help? Visit our <span className="text-[#DA1A32] font-medium">Get Help page</span>, our team is always here to guide you every step of the way.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </VisitorLayout>
    );
};

export default RgUserHome;
