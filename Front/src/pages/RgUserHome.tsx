import { FaStar } from "react-icons/fa";
import { IoMdArrowBack, IoMdArrowForward, IoMdHeart } from "react-icons/io";
import RgUserLayout from "../components/RgUserLayout.tsx";
import { IoAdd } from "react-icons/io5";
import PostForm from "../components/PostForm.tsx";
import ReviewForm from "../components/ReviewForm.tsx";
import { useState } from "react";
import DisplayPost from "../components/DisplayPost.tsx";
import DisplayReview from "../components/DisplayReview.tsx";

const RgUserHome = () => {
    // Local state just for UI control (mocked for now)
    const [showPostForm, setShowPostForm] = useState(false);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [isPostEdit, setIsPostEdit] = useState(false);
    const [isReviewEdit, setIsReviewEdit] = useState(false);
    const [postId, setPostId] = useState<number | null>(null);
    const [reviewId, setReviewId] = useState<number | null>(null);
    const [userId] = useState(1); // 🔹 Placeholder user ID
    const [courseId] = useState<number | null>(null);
    const [posttype] = useState<string>("normal");
    const [reviewtype] = useState<string>("website");

    // Dummy placeholder handler for now
    const handlePostSave = (post: any, isEdit: boolean) => {
        console.log("✅ Mock Save:", post, "isEdit:", isEdit);
        // 🔹 Later: integrate with backend or global state here
    };

    const handleClosePostModal = () => {
        setShowPostForm(false);
        setIsPostEdit(false);
        setPostId(null);
    };

    // Dummy placeholder handler for now
    const handleReviewSave = (post: any, isEdit: boolean) => {
        console.log("✅ Mock Save:", post, "isEdit:", isEdit);
        // 🔹 Later: integrate with backend or global state here
    };

    const handleCloseReviewModal = () => {
        setShowReviewForm(false);
        setIsReviewEdit(false);
        setReviewId(null);
    };

    const [showPostView, setShowPostView] = useState(false);

    const [showReviewView, setShowReviewView] = useState(false);

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

            {showPostView && <DisplayPost onClose={() => setShowPostView(false)} />}

            {showReviewView && <DisplayReview onClose={() => setShowReviewView(false)} />}

            {/* Announcement */}
            <div className="w-full h-[400px] relative">
                <img src="/images/Announcement.png" alt="announcement" className="w-full h-[400px] object-cover z-0" />
                <div className="absolute top-0 left-0 w-full h-[400px] bg-[#fefefe]/20 backdrop-blur-[12px] z-10" />
                <div className="absolute top-0 left-0 w-full h-[400px] z-20">
                    <div className="relative w-[1100px] h-[400px] mx-auto">
                        <img src="/images/Announcement.png" alt="announcement" className="w-full h-full object-cover" />
                        <div className="absolute top-[100px] left-[122px] text-white">
                            <div className="text-[40px] max-w-[500px] leading-tight font-medium">
                                Crispy Edges, Chewy Centers
                            </div>
                            <div className="text-[14px] max-w-[390px] leading-tight font-[200] pt-[18px]">
                                Ready to create cookies everyone loves? Join our beginner-friendly course to learn the techniques and tips behind chewy, gooey, bakery-quality chocolate chip cookies
                            </div>
                        </div>

                        <div className="absolute bottom-[20px] left-0 w-full flex justify-center">
                            <div className="flex flex-row gap-[12px]">
                                <button className="cursor-pointer flex items-center justify-center rounded-full w-[35px] h-[35px] backdrop-blur-sm border-[1px] border-white border-white transition-all duration-[600ms] hover:shadow-[0px_0px_20px_-1px_rgba(255,255,255,0.6)]">
                                    <IoMdArrowBack className="text-white w-[30px] h-[30px]" />
                                </button>
                                <button className="cursor-pointer flex items-center justify-center rounded-full w-[35px] h-[35px] backdrop-blur-sm border-[1px] border-white border-white transition-all duration-[600ms] hover:shadow-[0px_0px_20px_-1px_rgba(255,255,255,0.6)]">
                                    <IoMdArrowForward className="text-white w-[30px] h-[30px]" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
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

                    {/* Recipe Card */}
                    <div className="max-h-[297px] w-[262px] group cursor-pointer">
                        <img src="/images/Recipe.jpeg" alt="recipe" className="w-full h-[177px] object-cover" />

                        {/* Review */}
                        <div className="flex flex-row mt-[16px] items-center">
                            <div className="flex gap-[4px]">
                                {[...Array(5)].map((_, index) => {
                                    // Fill in the ratings replace the 5
                                    const fillPercentage = Math.min(Math.max(5 - index, 0), 1) * 100;

                                    return (
                                        <div
                                            key={index}
                                            className="relative"
                                            style={{ width: `18px`, height: `18px` }}
                                        >
                                            {/* Gray star background */}
                                            <FaStar
                                                className="absolute top-0 left-0 text-gray-300"
                                                size="18px"
                                            />
                                            {/* Red filled star */}
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

                            <div className="font-inter ml-[8px] text-[#484848] text-[12px]">
                                3 reviews
                            </div>
                        </div>

                        {/* Title */}
                        <div className="font-ibarra text-[18px] font-bold mt-[12px] line-clamp-2 group-hover:text-[#DA1A32] transition-all duration-300">
                            Small-Batch Brownies
                        </div>

                        {/* Details */}
                        <div className="flex gap-[14px] mt-[14px]">
                            <div className="flex items-center">
                                <img src="/images/Time.png" alt="recipe" className="w-[12px] h-[12px] object-cover" />
                                <div className="font-inter ml-[4px] text-[#484848] text-[11px] font-light">
                                    30
                                </div>
                                <div className="font-inter ml-[1px] text-[#484848] text-[11px] font-light">
                                    min
                                </div>
                            </div>

                            <div className="h-[16px] w-[1.1px] bg-black" />

                            <div className="flex items-center">
                                <img src="/images/Profile.png" alt="recipe" className="w-[11px] h-[11px] object-cover" />
                                <div className="font-inter ml-[4px] text-[#484848] text-[11px] font-light">
                                    8
                                </div>
                                <div className="font-inter ml-[1px] text-[#484848] text-[11px] font-light">
                                    servings
                                </div>
                            </div>

                            <div className="h-[16px] w-[1.1px] bg-black" />

                            <div className="flex items-center">
                                <img src="/images/Level.png" alt="recipe" className="w-[14px] h-[14px] object-cover" />
                                <div className="font-inter ml-[6px] text-[#484848] text-[11px] font-light">
                                    Beginner
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Recipe Card */}
                    <div className="max-h-[297px] w-[262px] group cursor-pointer">
                        <img src="/images/Recipe.jpeg" alt="recipe" className="w-full h-[177px] object-cover" />

                        {/* Review */}
                        <div className="flex flex-row mt-[16px] items-center">
                            <div className="flex gap-[4px]">
                                {[...Array(5)].map((_, index) => {
                                    // Fill in the ratings replace the 5
                                    const fillPercentage = Math.min(Math.max(5 - index, 0), 1) * 100;

                                    return (
                                        <div
                                            key={index}
                                            className="relative"
                                            style={{ width: `18px`, height: `18px` }}
                                        >
                                            {/* Gray star background */}
                                            <FaStar
                                                className="absolute top-0 left-0 text-gray-300"
                                                size="18px"
                                            />
                                            {/* Red filled star */}
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

                            <div className="font-inter ml-[8px] text-[#484848] text-[12px]">
                                3 reviews
                            </div>
                        </div>

                        {/* Title */}
                        <div className="font-ibarra text-[18px] font-bold mt-[12px] line-clamp-2 group-hover:text-[#DA1A32] transition-all duration-300">
                            Small-Batch Brownies
                        </div>

                        {/* Details */}
                        <div className="flex gap-[14px] mt-[14px]">
                            <div className="flex items-center">
                                <img src="/images/Time.png" alt="recipe" className="w-[12px] h-[12px] object-cover" />
                                <div className="font-inter ml-[4px] text-[#484848] text-[11px] font-light">
                                    30
                                </div>
                                <div className="font-inter ml-[1px] text-[#484848] text-[11px] font-light">
                                    min
                                </div>
                            </div>

                            <div className="h-[16px] w-[1.1px] bg-black" />

                            <div className="flex items-center">
                                <img src="/images/Profile.png" alt="recipe" className="w-[11px] h-[11px] object-cover" />
                                <div className="font-inter ml-[4px] text-[#484848] text-[11px] font-light">
                                    8
                                </div>
                                <div className="font-inter ml-[1px] text-[#484848] text-[11px] font-light">
                                    servings
                                </div>
                            </div>

                            <div className="h-[16px] w-[1.1px] bg-black" />

                            <div className="flex items-center">
                                <img src="/images/Level.png" alt="recipe" className="w-[14px] h-[14px] object-cover" />
                                <div className="font-inter ml-[6px] text-[#484848] text-[11px] font-light">
                                    Beginner
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Recipe Card */}
                    <div className="max-h-[297px] w-[262px] group cursor-pointer">
                        <img src="/images/Recipe.jpeg" alt="recipe" className="w-full h-[177px] object-cover" />

                        {/* Review */}
                        <div className="flex flex-row mt-[16px] items-center">
                            <div className="flex gap-[4px]">
                                {[...Array(5)].map((_, index) => {
                                    // Fill in the ratings replace the 5
                                    const fillPercentage = Math.min(Math.max(5 - index, 0), 1) * 100;

                                    return (
                                        <div
                                            key={index}
                                            className="relative"
                                            style={{ width: `18px`, height: `18px` }}
                                        >
                                            {/* Gray star background */}
                                            <FaStar
                                                className="absolute top-0 left-0 text-gray-300"
                                                size="18px"
                                            />
                                            {/* Red filled star */}
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

                            <div className="font-inter ml-[8px] text-[#484848] text-[12px]">
                                3 reviews
                            </div>
                        </div>

                        {/* Title */}
                        <div className="font-ibarra text-[18px] font-bold mt-[12px] line-clamp-2 group-hover:text-[#DA1A32] transition-all duration-300">
                            Small-Batch Brownies
                        </div>

                        {/* Details */}
                        <div className="flex gap-[14px] mt-[14px]">
                            <div className="flex items-center">
                                <img src="/images/Time.png" alt="recipe" className="w-[12px] h-[12px] object-cover" />
                                <div className="font-inter ml-[4px] text-[#484848] text-[11px] font-light">
                                    30
                                </div>
                                <div className="font-inter ml-[1px] text-[#484848] text-[11px] font-light">
                                    min
                                </div>
                            </div>

                            <div className="h-[16px] w-[1.1px] bg-black" />

                            <div className="flex items-center">
                                <img src="/images/Profile.png" alt="recipe" className="w-[11px] h-[11px] object-cover" />
                                <div className="font-inter ml-[4px] text-[#484848] text-[11px] font-light">
                                    8
                                </div>
                                <div className="font-inter ml-[1px] text-[#484848] text-[11px] font-light">
                                    servings
                                </div>
                            </div>

                            <div className="h-[16px] w-[1.1px] bg-black" />

                            <div className="flex items-center">
                                <img src="/images/Level.png" alt="recipe" className="w-[14px] h-[14px] object-cover" />
                                <div className="font-inter ml-[6px] text-[#484848] text-[11px] font-light">
                                    Beginner
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Recipe Card */}
                    <div className="max-h-[297px] w-[262px] group cursor-pointer">
                        <img src="/images/Recipe.jpeg" alt="recipe" className="w-full h-[177px] object-cover" />

                        {/* Review */}
                        <div className="flex flex-row mt-[16px] items-center">
                            <div className="flex gap-[4px]">
                                {[...Array(5)].map((_, index) => {
                                    // Fill in the ratings replace the 5
                                    const fillPercentage = Math.min(Math.max(5 - index, 0), 1) * 100;

                                    return (
                                        <div
                                            key={index}
                                            className="relative"
                                            style={{ width: `18px`, height: `18px` }}
                                        >
                                            {/* Gray star background */}
                                            <FaStar
                                                className="absolute top-0 left-0 text-gray-300"
                                                size="18px"
                                            />
                                            {/* Red filled star */}
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

                            <div className="font-inter ml-[8px] text-[#484848] text-[12px]">
                                3 reviews
                            </div>
                        </div>

                        {/* Title */}
                        <div className="font-ibarra text-[18px] font-bold mt-[12px] line-clamp-2 group-hover:text-[#DA1A32] transition-all duration-300">
                            Small-Batch Brownies
                        </div>

                        {/* Details */}
                        <div className="flex gap-[14px] mt-[14px]">
                            <div className="flex items-center">
                                <img src="/images/Time.png" alt="recipe" className="w-[12px] h-[12px] object-cover" />
                                <div className="font-inter ml-[4px] text-[#484848] text-[11px] font-light">
                                    30
                                </div>
                                <div className="font-inter ml-[1px] text-[#484848] text-[11px] font-light">
                                    min
                                </div>
                            </div>

                            <div className="h-[16px] w-[1.1px] bg-black" />

                            <div className="flex items-center">
                                <img src="/images/Profile.png" alt="recipe" className="w-[11px] h-[11px] object-cover" />
                                <div className="font-inter ml-[4px] text-[#484848] text-[11px] font-light">
                                    8
                                </div>
                                <div className="font-inter ml-[1px] text-[#484848] text-[11px] font-light">
                                    servings
                                </div>
                            </div>

                            <div className="h-[16px] w-[1.1px] bg-black" />

                            <div className="flex items-center">
                                <img src="/images/Level.png" alt="recipe" className="w-[14px] h-[14px] object-cover" />
                                <div className="font-inter ml-[6px] text-[#484848] text-[11px] font-light">
                                    Beginner
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                <button className="font-inter mt-[48px] cursor-pointer mx-auto bg-white px-[22px] py-[2px] border-[1px] border-black rounded-full font-light hover:scale-105 transition-all duration-[600ms]">
                    View More
                </button>
            </div>

            {/* Top Picks */}
            <div className="mt-[62px] items-center text-black flex flex-col w-full bg-[#F8F5F0] pt-[36px] pb-[62px]">
                <div className="font-ibarra text-[24px] font-bold flex flex-row items-center gap-[8px]">
                    <div className="w-[16px] h-[1px] bg-[#DA1A32]" />
                    Top Picks
                    <div className="w-[16px] h-[1px] bg-[#DA1A32]" />
                </div>

                {/* Top Picks Container */}
                <div className="mt-[32px] flex flex-row gap-[14px] max-w-screen">

                    {/* Recipe Card */}
                    <div className="max-h-[297px] w-[262px] group cursor-pointer">
                        <img src="/images/Recipe.jpeg" alt="recipe" className="w-full h-[177px] object-cover" />

                        {/* Review */}
                        <div className="flex flex-row mt-[16px] items-center">
                            <div className="flex gap-[4px]">
                                {[...Array(5)].map((_, index) => {
                                    // Fill in the ratings replace the 5
                                    const fillPercentage = Math.min(Math.max(5 - index, 0), 1) * 100;

                                    return (
                                        <div
                                            key={index}
                                            className="relative"
                                            style={{ width: `18px`, height: `18px` }}
                                        >
                                            {/* Gray star background */}
                                            <FaStar
                                                className="absolute top-0 left-0 text-gray-300"
                                                size="18px"
                                            />
                                            {/* Red filled star */}
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

                            <div className="font-inter ml-[8px] text-[#484848] text-[12px]">
                                3 reviews
                            </div>
                        </div>

                        {/* Title */}
                        <div className="font-ibarra text-[18px] font-bold mt-[12px] line-clamp-2 group-hover:text-[#DA1A32] transition-all duration-300">
                            Small-Batch Brownies
                        </div>

                        {/* Details */}
                        <div className="flex gap-[14px] mt-[14px]">
                            <div className="flex items-center">
                                <img src="/images/Time.png" alt="recipe" className="w-[12px] h-[12px] object-cover" />
                                <div className="font-inter ml-[4px] text-[#484848] text-[11px] font-light">
                                    30
                                </div>
                                <div className="font-inter ml-[1px] text-[#484848] text-[11px] font-light">
                                    min
                                </div>
                            </div>

                            <div className="h-[16px] w-[1.1px] bg-black" />

                            <div className="flex items-center">
                                <img src="/images/Profile.png" alt="recipe" className="w-[11px] h-[11px] object-cover" />
                                <div className="font-inter ml-[4px] text-[#484848] text-[11px] font-light">
                                    8
                                </div>
                                <div className="font-inter ml-[1px] text-[#484848] text-[11px] font-light">
                                    servings
                                </div>
                            </div>

                            <div className="h-[16px] w-[1.1px] bg-black" />

                            <div className="flex items-center">
                                <img src="/images/Level.png" alt="recipe" className="w-[14px] h-[14px] object-cover" />
                                <div className="font-inter ml-[6px] text-[#484848] text-[11px] font-light">
                                    Beginner
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Recipe Card */}
                    <div className="max-h-[297px] w-[262px] group cursor-pointer">
                        <img src="/images/Recipe.jpeg" alt="recipe" className="w-full h-[177px] object-cover" />

                        {/* Review */}
                        <div className="flex flex-row mt-[16px] items-center">
                            <div className="flex gap-[4px]">
                                {[...Array(5)].map((_, index) => {
                                    // Fill in the ratings replace the 5
                                    const fillPercentage = Math.min(Math.max(5 - index, 0), 1) * 100;

                                    return (
                                        <div
                                            key={index}
                                            className="relative"
                                            style={{ width: `18px`, height: `18px` }}
                                        >
                                            {/* Gray star background */}
                                            <FaStar
                                                className="absolute top-0 left-0 text-gray-300"
                                                size="18px"
                                            />
                                            {/* Red filled star */}
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

                            <div className="font-inter ml-[8px] text-[#484848] text-[12px]">
                                3 reviews
                            </div>
                        </div>

                        {/* Title */}
                        <div className="font-ibarra text-[18px] font-bold mt-[12px] line-clamp-2 group-hover:text-[#DA1A32] transition-all duration-300">
                            Small-Batch Brownies
                        </div>

                        {/* Details */}
                        <div className="flex gap-[14px] mt-[14px]">
                            <div className="flex items-center">
                                <img src="/images/Time.png" alt="recipe" className="w-[12px] h-[12px] object-cover" />
                                <div className="font-inter ml-[4px] text-[#484848] text-[11px] font-light">
                                    30
                                </div>
                                <div className="font-inter ml-[1px] text-[#484848] text-[11px] font-light">
                                    min
                                </div>
                            </div>

                            <div className="h-[16px] w-[1.1px] bg-black" />

                            <div className="flex items-center">
                                <img src="/images/Profile.png" alt="recipe" className="w-[11px] h-[11px] object-cover" />
                                <div className="font-inter ml-[4px] text-[#484848] text-[11px] font-light">
                                    8
                                </div>
                                <div className="font-inter ml-[1px] text-[#484848] text-[11px] font-light">
                                    servings
                                </div>
                            </div>

                            <div className="h-[16px] w-[1.1px] bg-black" />

                            <div className="flex items-center">
                                <img src="/images/Level.png" alt="recipe" className="w-[14px] h-[14px] object-cover" />
                                <div className="font-inter ml-[6px] text-[#484848] text-[11px] font-light">
                                    Beginner
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Recipe Card */}
                    <div className="max-h-[297px] w-[262px] group cursor-pointer">
                        <img src="/images/Recipe.jpeg" alt="recipe" className="w-full h-[177px] object-cover" />

                        {/* Review */}
                        <div className="flex flex-row mt-[16px] items-center">
                            <div className="flex gap-[4px]">
                                {[...Array(5)].map((_, index) => {
                                    // Fill in the ratings replace the 5
                                    const fillPercentage = Math.min(Math.max(5 - index, 0), 1) * 100;

                                    return (
                                        <div
                                            key={index}
                                            className="relative"
                                            style={{ width: `18px`, height: `18px` }}
                                        >
                                            {/* Gray star background */}
                                            <FaStar
                                                className="absolute top-0 left-0 text-gray-300"
                                                size="18px"
                                            />
                                            {/* Red filled star */}
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

                            <div className="font-inter ml-[8px] text-[#484848] text-[12px]">
                                3 reviews
                            </div>
                        </div>

                        {/* Title */}
                        <div className="font-ibarra text-[18px] font-bold mt-[12px] line-clamp-2 group-hover:text-[#DA1A32] transition-all duration-300">
                            Small-Batch Brownies
                        </div>

                        {/* Details */}
                        <div className="flex gap-[14px] mt-[14px]">
                            <div className="flex items-center">
                                <img src="/images/Time.png" alt="recipe" className="w-[12px] h-[12px] object-cover" />
                                <div className="font-inter ml-[4px] text-[#484848] text-[11px] font-light">
                                    30
                                </div>
                                <div className="font-inter ml-[1px] text-[#484848] text-[11px] font-light">
                                    min
                                </div>
                            </div>

                            <div className="h-[16px] w-[1.1px] bg-black" />

                            <div className="flex items-center">
                                <img src="/images/Profile.png" alt="recipe" className="w-[11px] h-[11px] object-cover" />
                                <div className="font-inter ml-[4px] text-[#484848] text-[11px] font-light">
                                    8
                                </div>
                                <div className="font-inter ml-[1px] text-[#484848] text-[11px] font-light">
                                    servings
                                </div>
                            </div>

                            <div className="h-[16px] w-[1.1px] bg-black" />

                            <div className="flex items-center">
                                <img src="/images/Level.png" alt="recipe" className="w-[14px] h-[14px] object-cover" />
                                <div className="font-inter ml-[6px] text-[#484848] text-[11px] font-light">
                                    Beginner
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Recipe Card */}
                    <div className="max-h-[297px] w-[262px] group cursor-pointer">
                        <img src="/images/Recipe.jpeg" alt="recipe" className="w-full h-[177px] object-cover" />

                        {/* Review */}
                        <div className="flex flex-row mt-[16px] items-center">
                            <div className="flex gap-[4px]">
                                {[...Array(5)].map((_, index) => {
                                    // Fill in the ratings replace the 5
                                    const fillPercentage = Math.min(Math.max(5 - index, 0), 1) * 100;

                                    return (
                                        <div
                                            key={index}
                                            className="relative"
                                            style={{ width: `18px`, height: `18px` }}
                                        >
                                            {/* Gray star background */}
                                            <FaStar
                                                className="absolute top-0 left-0 text-gray-300"
                                                size="18px"
                                            />
                                            {/* Red filled star */}
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

                            <div className="font-inter ml-[8px] text-[#484848] text-[12px]">
                                3 reviews
                            </div>
                        </div>

                        {/* Title */}
                        <div className="font-ibarra text-[18px] font-bold mt-[12px] line-clamp-2 group-hover:text-[#DA1A32] transition-all duration-300">
                            Small-Batch Brownies
                        </div>

                        {/* Details */}
                        <div className="flex gap-[14px] mt-[14px]">
                            <div className="flex items-center">
                                <img src="/images/Time.png" alt="recipe" className="w-[12px] h-[12px] object-cover" />
                                <div className="font-inter ml-[4px] text-[#484848] text-[11px] font-light">
                                    30
                                </div>
                                <div className="font-inter ml-[1px] text-[#484848] text-[11px] font-light">
                                    min
                                </div>
                            </div>

                            <div className="h-[16px] w-[1.1px] bg-black" />

                            <div className="flex items-center">
                                <img src="/images/Profile.png" alt="recipe" className="w-[11px] h-[11px] object-cover" />
                                <div className="font-inter ml-[4px] text-[#484848] text-[11px] font-light">
                                    8
                                </div>
                                <div className="font-inter ml-[1px] text-[#484848] text-[11px] font-light">
                                    servings
                                </div>
                            </div>

                            <div className="h-[16px] w-[1.1px] bg-black" />

                            <div className="flex items-center">
                                <img src="/images/Level.png" alt="recipe" className="w-[14px] h-[14px] object-cover" />
                                <div className="font-inter ml-[6px] text-[#484848] text-[11px] font-light">
                                    Beginner
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                <button className="font-inter mt-[48px] cursor-pointer mx-auto bg-white px-[22px] py-[2px] border-[1px] border-black rounded-full font-light hover:scale-105 transition-all duration-[600ms]">
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

                    {/* Post Card */}
                    <button onClick={() => setShowPostView(true)}
                        className="text-left cursor-pointer hover:scale-[105%] transition-all duration-[600ms] w-[350px] h-[323px] bg-white flex flex-row gap-[16px] p-[10px] shadow-[0px_0px_20px_rgba(0,0,0,0.1)] rounded-[20px]">
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
                                    <a className="hover:text-[#DA1A32] transition-all duration-300">#Small-Batch Brownies</a>
                                    <a className="hover:text-[#DA1A32] transition-all duration-300">#Cakes</a>
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
                    </button>

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
                                    <a>#Small-Batch Brownies</a>
                                    <a>#Cakes</a>
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
                                    <a>#Small-Batch Brownies</a>
                                    <a>#Cakes</a>
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

            {/* Reviews */}
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
                <div className="mt-[32px] flex flex-row gap-[20px] max-w-screen">

                    {/* Review Card */}
                    <button onClick={() => setShowReviewView(true)} className="text-left w-[350px] h-[153px] bg-white flex flex-col p-[10px] shadow-[0px_0px_20px_rgba(0,0,0,0.1)] rounded-[20px]">
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
                        </div>

                        {/* Review title */}
                        <div className="font-ibarra mt-[16px] line-clamp-1 text-[16px] font-bold leading-tight">
                            One of the best brownies ever!!!
                        </div>

                        {/* Review Description */}
                        <div className="font-inter mt-[10px] line-clamp-2 text-[10px] font-light text-justify mb-[8px]">
                            WOW — the chocolate flavor is next-level! Can’t wait to share them with the family tonight. 🥰
                        </div>

                        <div className="flex gap-[4px]">
                            {[...Array(5)].map((_, index) => {
                                // Fill in the ratings replace the 5
                                const fillPercentage = Math.min(Math.max(5 - index, 0), 1) * 100;

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
                    </button>

                    {/* Review Card */}
                    <div className="w-[350px] h-[153px] bg-white flex flex-col p-[10px] shadow-[0px_0px_20px_rgba(0,0,0,0.1)] rounded-[20px]">
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
                        </div>

                        {/* Review title */}
                        <div className="font-ibarra mt-[16px] line-clamp-1 text-[16px] font-bold leading-tight">
                            One of the best brownies ever!!!
                        </div>

                        {/* Review Description */}
                        <div className="font-inter mt-[10px] line-clamp-2 text-[10px] font-light text-justify mb-[8px]">
                            WOW — the chocolate flavor is next-level! Can’t wait to share them with the family tonight. 🥰
                        </div>

                        <div className="flex gap-[4px]">
                            {[...Array(5)].map((_, index) => {
                                // Fill in the ratings replace the 5
                                const fillPercentage = Math.min(Math.max(5 - index, 0), 1) * 100;

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

                    {/* Review Card */}
                    <div className="w-[350px] h-[153px] bg-white flex flex-col p-[10px] shadow-[0px_0px_20px_rgba(0,0,0,0.1)] rounded-[20px]">
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
                        </div>

                        {/* Review title */}
                        <div className="font-ibarra mt-[16px] line-clamp-1 text-[16px] font-bold leading-tight">
                            One of the best brownies ever!!!
                        </div>

                        {/* Review Description */}
                        <div className="font-inter mt-[10px] line-clamp-2 text-[10px] font-light text-justify mb-[8px]">
                            WOW — the chocolate flavor is next-level! Can’t wait to share them with the family tonight. 🥰
                        </div>

                        <div className="flex gap-[4px]">
                            {[...Array(5)].map((_, index) => {
                                // Fill in the ratings replace the 5
                                const fillPercentage = Math.min(Math.max(5 - index, 0), 1) * 100;

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
                </div>

                <button className="font-inter mt-[48px] cursor-pointer mx-auto bg-white px-[22px] py-[2px] border border-black rounded-full font-light hover:scale-105 transition-all duration-[600ms]">
                    View More
                </button>
            </div>
        </RgUserLayout>
    );
};

export default RgUserHome;
