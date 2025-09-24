import { IoIosArrowForward, IoMdHeart } from "react-icons/io";
import RgUserLayout from "../components/RgUserLayout.tsx";
import { CiBookmark} from "react-icons/ci";
import { FaStar } from "react-icons/fa";
import { IoAdd } from "react-icons/io5";

const RgUserCourse = () => {
    return (
        <RgUserLayout>

            {/* Banner */}
            <div
                className="w-full h-[200px] relative bg-fixed bg-center bg-cover"
                style={{ backgroundImage: "url('/images/Recipe.jpeg')" }}
            >
                {/* Overlay */}
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-[#000000]/40 to-[#000000]/0 z-10" />

                {/* Content */}
                <div className="absolute top-0 left-0 w-full h-full z-20">
                    <div className="relative w-[1090px] h-full mx-auto flex items-center">
                        <div className="font-ibarra text-[48px] max-w-[500px] leading-tight font-bold text-white">
                            Small-Batch Brownies
                        </div>

                        <div className="font-inter absolute bottom-[54px] left-[4px] text-[10px] max-w-[500px] leading-tight font-[200] text-white flex items-center gap-[2px]">
                            <button className="cursor-pointer uppercase hover:text-[#DA1A32] transition-all duration-[600ms]">
                                Learn
                            </button>
                            <IoIosArrowForward className="text-[#DA1A32] h-[18px]" />
                            <button className="cursor-pointer uppercase hover:text-[#DA1A32] transition-all duration-[600ms]">
                                Cake
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

            <div className="mt-[44px] items-center text-black flex flex-col w-full mx-auto">
                {/* Course Details */}
                <div className="flex flex-row justify-between w-[1090px]">
                    <div className="flex flex-col">
                        {/* Review */}
                        <div className="flex flex-row gap-[16px]">
                            <img src="/images/Like.png" alt="like" className="w-[45px] h-[45px] object-cover" />

                            <div className="flex flex-col gap-[2px] justify-center translate-y-[-2px]">
                                {/* Review */}
                                <div className="font-inter text-[#484848] text-[14px] font-light">
                                    3 reviews
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

                        {/* Description */}
                        <p className="max-w-[435px] mt-[24px] text-[14px] font-light leading-tight text-justify line-clamp-8">
                            Some occasions call for a big batch of brownies: a bake sale or a neighborhood cookout. But when you crave just one or two rich, fudgy brownies, this small-batch recipe is the answer. The brownies are made in one bowl and are ready in 30 minutes, which means there's minimal clean-up and you don't need to plan ahead. Best of all, because these invitingly thick small-batch brownies are baked in a loaf pan, you’re sure to get an edge piece no matter how you slice them (edge-lovers, rejoice!).
                        </p>


                        {/* Details */}
                        <div className="flex gap-[18px] mt-[32px] items-center h-[20px]">
                            <div className="flex items-center">
                                <img src="/images/Time.png" alt="recipe" className="w-[19px] h-[19px] object-cover translate-y-[-1px]" />
                                <div className="flex items-end">
                                    <div className="font-inter ml-[8px] text-[#484848] text-[16px] font-light">
                                        30
                                    </div>
                                    <div className="font-inter ml-[1px] text-[#484848] text-[14px] font-light">
                                        mins
                                    </div>
                                </div>
                            </div>

                            <div className="h-[20px] w-[1.5px] bg-black" />

                            <div className="flex items-center">
                                <img src="/images/Profile.png" alt="recipe" className="w-[18px] h-[18px] object-cover" />
                                <div className="flex items-end">
                                    <div className="font-inter ml-[10px] text-[#484848] text-[16px] font-light">
                                        8
                                    </div>
                                    <div className="font-inter ml-[1px] text-[#484848] text-[14px] font-light">
                                        servings
                                    </div>
                                </div>
                            </div>

                            <div className="h-[20px] w-[1.5px] bg-black" />

                            <div className="flex items-center">
                                <img src="/images/Level.png" alt="recipe" className="w-[20px] h-[20px] object-cover" />
                                <div className="font-inter ml-[9px] text-[#484848] text-[16px] font-light">
                                    Beginner
                                </div>
                            </div>
                        </div>

                        <div className="bg-black w-[435px] mt-[26px] h-[1.5px]" />

                        {/* Action Buttons */}
                        <div className="flex flex-row gap-[10px] mt-[20px]">
                            <button className="w-[265px] h-[48px] flex justify-center items-center text-[16px] bg-[#DA1A32] rounded-full text-white cursor-pointer hover:scale-105 transition-all duration-[600ms]">
                                Start Now
                                {/* Remove Course */}
                            </button>

                            <button className="flex items-center justify-between h-[48px] bg-white border border-black rounded-full pr-[4px] pl-[22px] cursor-pointer hover:scale-105 transition-all duration-[600ms]">
                                <div className="font-inter text-[16px] font-light">
                                    Bookmark
                                </div>
                                <div className="w-[38px] h-[38px] bg-[#DA1A32] flex items-center justify-center rounded-full text-white text-[12px] ml-[20px]">
                                    <CiBookmark className="text-white w-[20px] h-[20px]" />
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* <img src="/images/Recipe.jpeg" alt="recipe" className="w-[546px] h-[370px] object-cover" /> */}

                    <div className="w-[503px] flex flex-col gap-[16px]">
                        <button className="w-full h-[100px] border border-[#B9A9A1] bg-[#F8F5F0] flex items-center px-[36px] rounded-[10px] cursor-pointer hover:scale-[104%] transition-all duration-[600ms] group">
                            <div className="font-ibarra text-[24px] font-bold text-black group-hover:text-[#DA1A32] transition-all duration-[600ms]">
                                Step-by-Step Guide
                            </div>
                        </button>
                        <button className="w-full h-[100px] border border-[#B9A9A1] bg-[#F8F5F0] flex items-center px-[36px] rounded-[10px] cursor-pointer hover:scale-[104%] transition-all duration-[600ms] group">
                            <div className="font-ibarra text-[24px] font-bold text-black flex-2 flex justify-start group-hover:text-[#DA1A32] transition-all duration-[600ms]">
                                Practice Quiz
                            </div>
                            <div className="font-ibarra text-[18px] font-bold text-[#DA1A32] flex-1">
                                80%
                            </div>
                            <div className="font-ibarra text-[18px] font-bold text-[#DA1A32] flex-1">
                                1:30
                                <span className="text-[16px]">min</span>
                            </div>
                        </button>
                        <button className="w-full h-[100px] border border-[#B9A9A1] bg-[#F8F5F0] flex items-center px-[36px] rounded-[10px] cursor-pointer hover:scale-[104%] transition-all duration-[600ms] group">
                            <div className="font-ibarra text-[24px] font-bold text-black flex-2 flex justify-start group-hover:text-[#DA1A32] transition-all duration-[600ms]">
                                Final Quiz
                            </div>
                            <div className="font-ibarra text-[18px] font-bold text-[#DA1A32] flex-1">
                                15/20
                            </div>
                            <div className="font-ibarra text-[18px] font-bold text-[#DA1A32] flex-1">
                                Completed
                            </div>
                        </button>
                    </div>
                </div>

                {/* Ingredient and Tools */}
                <div className="mt-[88px] flex flex-row justify-between w-[1090px]">
                    <div className="w-[435px] flex flex-col items-center">
                        <div className="font-ibarra text-[32px] font-bold flex flex-row items-center gap-[8px] text-black">
                            <div className="w-[16px] h-[1px] bg-[#DA1A32]" />
                            Ingredients
                            <div className="w-[16px] h-[1px] bg-[#DA1A32]" />
                        </div>

                        <ul className="flex flex-col mt-[32px] gap-[16px] w-full">
                            <li className="flex flex-row gap-[12px] items-center">
                                <div className="w-[12px] h-[1.5px] bg-[#DA1A32]" />

                                <div className="text-[14px] font-light txt-black">
                                    Unsalted butter - 71g
                                </div>
                            </li>
                            <li className="flex flex-row gap-[12px] items-center">
                                <div className="w-[12px] h-[1.5px] bg-[#DA1A32]" />

                                <div className="text-[14px] font-light txt-black">
                                    Granulated sugar - 149g
                                </div>
                            </li>
                            <li className="flex flex-row gap-[12px] items-center">
                                <div className="w-[12px] h-[1.5px] bg-[#DA1A32]" />

                                <div className="text-[14px] font-light txt-black">
                                    Large egg - 1
                                </div>
                            </li>
                            <li className="flex flex-row gap-[12px] items-center">
                                <div className="w-[12px] h-[1.5px] bg-[#DA1A32]" />

                                <div className="text-[14px] font-light txt-black">
                                    Vanilla extract - 1 teaspoon
                                </div>
                            </li>
                            <li className="flex flex-row gap-[12px] items-center">
                                <div className="w-[12px] h-[1.5px] bg-[#DA1A32]" />

                                <div className="text-[14px] font-light txt-black">
                                    Unsweetened cocao - 6 tablespoon
                                </div>
                            </li>
                            <li className="flex flex-row gap-[12px] items-center">
                                <div className="w-[12px] h-[1.5px] bg-[#DA1A32]" />

                                <div className="text-[14px] font-light txt-black">
                                    Expresso powder (optional) - 1/4 teaspoon
                                </div>
                            </li>
                            <li className="flex flex-row gap-[12px] items-center">
                                <div className="w-[12px] h-[1.5px] bg-[#DA1A32]" />

                                <div className="text-[14px] font-light txt-black">
                                    All purpose flour - 45g
                                </div>
                            </li>
                            <li className="flex flex-row gap-[12px] items-center">
                                <div className="w-[12px] h-[1.5px] bg-[#DA1A32]" />

                                <div className="text-[14px] font-light txt-black">
                                    Table salt - 1/4 teaspoon
                                </div>
                            </li>
                            <li className="flex flex-row gap-[12px] items-center">
                                <div className="w-[12px] h-[1.5px] bg-[#DA1A32]" />

                                <div className="text-[14px] font-light txt-black">
                                    Baking powder - 1/16 teaspoon
                                </div>
                            </li>
                            <li className="flex flex-row gap-[12px] items-center">
                                <div className="w-[12px] h-[1.5px] bg-[#DA1A32]" />

                                <div className="text-[14px] font-light txt-black">
                                    Chocolate chips - 1/16 teaspoon
                                </div>
                            </li>
                        </ul>
                    </div>

                    <div className="w-[546px] flex flex-col items-center px-[40px]">
                        <div className="font-ibarra text-[32px] font-bold flex flex-row items-center gap-[8px] text-black">
                            <div className="w-[16px] h-[1px] bg-[#DA1A32]" />
                            Tools
                            <div className="w-[16px] h-[1px] bg-[#DA1A32]" />
                        </div>


                        <ul className="flex flex-col mt-[32px] gap-[16px] w-full">
                            <li className="flex flex-row gap-[12px] items-center">
                                <div className="w-[12px] h-[1.5px] bg-[#DA1A32]" />

                                <div className="text-[14px] font-light txt-black">
                                    Baking Pan – 8 1/2" x 4 1/2" pan
                                </div>
                            </li>
                            <li className="flex flex-row gap-[12px] items-center">
                                <div className="w-[12px] h-[1.5px] bg-[#DA1A32]" />

                                <div className="text-[14px] font-light txt-black">
                                    Mixing Bowls
                                </div>
                            </li>
                            <li className="flex flex-row gap-[12px] items-center">
                                <div className="w-[12px] h-[1.5px] bg-[#DA1A32]" />

                                <div className="text-[14px] font-light txt-black">
                                    Whisk or Hand Mixer
                                </div>
                            </li>
                            <li className="flex flex-row gap-[12px] items-center">
                                <div className="w-[12px] h-[1.5px] bg-[#DA1A32]" />

                                <div className="text-[14px] font-light txt-black">
                                    Rubber Spatula
                                </div>
                            </li>
                            <li className="flex flex-row gap-[12px] items-center">
                                <div className="w-[12px] h-[1.5px] bg-[#DA1A32]" />

                                <div className="text-[14px] font-light txt-black">
                                    Measuring Cups & Spoons
                                </div>
                            </li>
                            <li className="flex flex-row gap-[12px] items-center">
                                <div className="w-[12px] h-[1.5px] bg-[#DA1A32]" />

                                <div className="text-[14px] font-light txt-black">
                                    Parchment Paper
                                </div>
                            </li>
                            <li className="flex flex-row gap-[12px] items-center">
                                <div className="w-[12px] h-[1.5px] bg-[#DA1A32]" />

                                <div className="text-[14px] font-light txt-black">
                                    Digital Scale
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Posts */}
                <div className="mt-[88px] items-center text-black flex flex-col w-[1090px] relative">
                    <div className="font-ibarra text-[32px] font-bold flex flex-row items-center gap-[8px]">
                        <div className="w-[16px] h-[1px] bg-[#DA1A32]" />
                        Posts
                        <div className="w-[16px] h-[1px] bg-[#DA1A32]" />
                    </div>

                    <button className="flex items-center justify-between h-[40px] bg-white border border-black rounded-full pr-[4px] pl-[22px] cursor-pointer hover:scale-105 transition-all duration-[600ms] absolute top-0 right-0">
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
                        <div className="w-[350px] h-[323px] bg-white flex flex-row gap-[16px] p-[10px] shadow-[0px_0px_20px_rgba(0,0,0,0.1)] rounded-[20px]">
                            <div className="relative w-[170px] h-full rounded-[16px] overflow-hidden">
                                <img src="/images/Post.webp" alt="post" className="w-full h-full object-cover z-0" />
                                <div className="absolute top-0 left-0 w-full h-full bg-[#fefefe]/20 backdrop-blur-[12px] z-10" />
                                <div className="absolute top-0 left-0 w-full h-full flex items-center z-20">
                                    <img src="/images/Post.webp" alt="post" className="w-full object-cover" />
                                </div>
                            </div>

                            <div className="flex flex-col w-[142px]">
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
                        </div>

                        {/* Post Card */}
                        <div className="w-[350px] h-[323px] bg-white flex flex-row gap-[16px] p-[10px] shadow-[0px_0px_20px_rgba(0,0,0,0.1)] rounded-[20px]">
                            <div className="relative w-[170px] h-full rounded-[16px] overflow-hidden">
                                <img src="/images/Post.webp" alt="post" className="w-full h-full object-cover z-0" />
                                <div className="absolute top-0 left-0 w-full h-full bg-[#fefefe]/20 backdrop-blur-[12px] z-10" />
                                <div className="absolute top-0 left-0 w-full h-full flex items-center z-20">
                                    <img src="/images/Post.webp" alt="post" className="w-full object-cover" />
                                </div>
                            </div>

                            <div className="flex flex-col w-[142px]">
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
                        </div>

                        {/* Post Card */}
                        <div className="w-[350px] h-[323px] bg-white flex flex-row gap-[16px] p-[10px] shadow-[0px_0px_20px_rgba(0,0,0,0.1)] rounded-[20px]">
                            <div className="relative w-[170px] h-full rounded-[16px] overflow-hidden">
                                <img src="/images/Post.webp" alt="post" className="w-full h-full object-cover z-0" />
                                <div className="absolute top-0 left-0 w-full h-full bg-[#fefefe]/20 backdrop-blur-[12px] z-10" />
                                <div className="absolute top-0 left-0 w-full h-full flex items-center z-20">
                                    <img src="/images/Post.webp" alt="post" className="w-full object-cover" />
                                </div>
                            </div>

                            <div className="flex flex-col w-[142px]">
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
                        </div>
                    </div>

                    <button className="font-inter mt-[48px] cursor-pointer mx-auto bg-white px-[22px] py-[2px] border border-black rounded-full font-light hover:scale-105 transition-all duration-[600ms]">
                        View More
                    </button>
                </div>

                {/* Reviews */}
                <div className="mt-[62px] items-center text-black flex flex-col w-full bg-[#F8F5F0] pt-[36px] pb-[62px] relative">
                    <div className="font-ibarra text-[32px] font-bold flex flex-row items-center gap-[8px]">
                        <div className="w-[16px] h-[1px] bg-[#DA1A32]" />
                        Reviews
                        <div className="w-[16px] h-[1px] bg-[#DA1A32]" />
                    </div>


                    <button className="flex items-center justify-between h-[40px] bg-white border border-black rounded-full pr-[4px] pl-[22px] cursor-pointer hover:scale-105 transition-all duration-[600ms] absolute top-[34px] right-[223px]">
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
            </div>
        </RgUserLayout>
    );
};

export default RgUserCourse;
