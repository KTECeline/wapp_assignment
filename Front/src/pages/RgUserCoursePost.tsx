import { IoIosArrowBack, IoIosArrowForward, IoMdHeart } from "react-icons/io";
import RgUserLayout from "../components/RgUserLayout.tsx";
import { CiBookmark, CiFilter } from "react-icons/ci";
import { FaStar } from "react-icons/fa";
import { IoAdd, IoShareSocialSharp } from "react-icons/io5";
import { TbArrowsSort } from "react-icons/tb";

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
                            <IoIosArrowForward className="text-[#DA1A32] h-[18px]" />
                            <button className="cursor-pointer uppercase hover:text-[#DA1A32] transition-all duration-[600ms]">
                                Small-Batch Brownies
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
                        <button className="cursor-pointer">
                            <IoIosArrowBack className="text-[#DA1A32] h-[32px] w-[32px]" />
                        </button>

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

                    {/* Post Container */}
                    <div className="mt-[22px] w-screen h-[522px] overflow-y-scroll no-scrollbar pb-[64px] pt-[10px]">
                        <div className=" columns-3 gap-[20px] w-[1090px] mx-auto">
                            {/* Post Card */}
                            <div className="cursor-pointer hover:scale-[102%] transition-all duration-[600ms] w-full h-auto bg-white flex flex-col gap-[16px] p-[10px] shadow-[0px_0px_20px_rgba(0,0,0,0.1)] rounded-[20px] mb-4 break-inside-avoid">
                                <img src="/images/Post.webp" alt="post" className="w-[332px] h-auto max-h-[377px] object-cover rounded-[16px] " />

                                <div className="flex flex-col w-full px-[6px]">
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

                                        <div className="flex flex-row items-center gap-2">
                                            {/* Share button */}
                                            <button className="cursor-pointer flex flex-row justify-center items-center -translate-y-[2px] w-[20px] h-[20px] rounded-full bg-[#D9D9D9]">
                                                <IoShareSocialSharp className="w-[14px] h-[14px] text-[#4f4f4f]" />
                                            </button>

                                            {/* Like button */}
                                            <button className="cursor-pointer flex flex-row justify-center -translate-y-[2px]">
                                                <IoMdHeart className="w-[25px] h-[25px] text-[#D9D9D9]" />
                                            </button>
                                        </div>
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
                                    <div className="font-inter mt-[16px] line-clamp-4 text-[10px] font-light underline cursor-pointer">
                                        <a>#Small-Batch Brownies</a>
                                        <a>#Cakes</a>
                                    </div>

                                    <div className="flex flex-col mt-[18px]">
                                        <div className="bg-black w-full h-[1px]" />
                                        <div className="flex flex-row font-inter text-[10px] font-light gap-[2px] mt-[7px] mb-[4px]">
                                            <IoMdHeart className="w-[17px] h-[17px] text-[#FF5454]" />
                                            <div className="translate-y-[2px]">
                                                100
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Post Card */}
                            <div className="cursor-pointer hover:scale-[102%] transition-all duration-[600ms] w-full h-auto bg-white flex flex-col gap-[16px] p-[10px] shadow-[0px_0px_20px_rgba(0,0,0,0.1)] rounded-[20px] mb-4 break-inside-avoid">
                                <img src="/images/Brownie_Post.jpg" alt="post" className="w-[332px] h-auto max-h-[377px] object-cover rounded-[16px] " />

                                <div className="flex flex-col w-full px-[6px]">
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

                                        <div className="flex flex-row items-center gap-2">
                                            {/* Share button */}
                                            <button className="cursor-pointer flex flex-row justify-center items-center -translate-y-[2px] w-[20px] h-[20px] rounded-full bg-[#D9D9D9]">
                                                <IoShareSocialSharp className="w-[14px] h-[14px] text-[#4f4f4f]" />
                                            </button>

                                            {/* Like button */}
                                            <button className="cursor-pointer flex flex-row justify-center -translate-y-[2px]">
                                                <IoMdHeart className="w-[25px] h-[25px] text-[#D9D9D9]" />
                                            </button>
                                        </div>
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
                                    <div className="font-inter mt-[16px] line-clamp-4 text-[10px] font-light underline cursor-pointer">
                                        <a>#Small-Batch Brownies</a>
                                        <a>#Cakes</a>
                                    </div>

                                    <div className="flex flex-col mt-[18px]">
                                        <div className="bg-black w-full h-[1px]" />
                                        <div className="flex flex-row font-inter text-[10px] font-light gap-[2px] mt-[7px] mb-[4px]">
                                            <IoMdHeart className="w-[17px] h-[17px] text-[#FF5454]" />
                                            <div className="translate-y-[2px]">
                                                100
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Post Card */}
                            <div className="cursor-pointer hover:scale-[102%] transition-all duration-[600ms] w-full h-auto bg-white flex flex-col gap-[16px] p-[10px] shadow-[0px_0px_20px_rgba(0,0,0,0.1)] rounded-[20px] mb-4 break-inside-avoid">
                                <img src="/images/Brownie_Post.jpg" alt="post" className="w-[332px] h-auto max-h-[377px] object-cover rounded-[16px] " />

                                <div className="flex flex-col w-full px-[6px]">
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

                                        <div className="flex flex-row items-center gap-2">
                                            {/* Share button */}
                                            <button className="cursor-pointer flex flex-row justify-center items-center -translate-y-[2px] w-[20px] h-[20px] rounded-full bg-[#D9D9D9]">
                                                <IoShareSocialSharp className="w-[14px] h-[14px] text-[#4f4f4f]" />
                                            </button>

                                            {/* Like button */}
                                            <button className="cursor-pointer flex flex-row justify-center -translate-y-[2px]">
                                                <IoMdHeart className="w-[25px] h-[25px] text-[#D9D9D9]" />
                                            </button>
                                        </div>
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
                                    <div className="font-inter mt-[16px] line-clamp-4 text-[10px] font-light underline cursor-pointer">
                                        <a>#Small-Batch Brownies</a>
                                        <a>#Cakes</a>
                                    </div>

                                    <div className="flex flex-col mt-[18px]">
                                        <div className="bg-black w-full h-[1px]" />
                                        <div className="flex flex-row font-inter text-[10px] font-light gap-[2px] mt-[7px] mb-[4px]">
                                            <IoMdHeart className="w-[17px] h-[17px] text-[#FF5454]" />
                                            <div className="translate-y-[2px]">
                                                100
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Post Card */}
                            <div className="cursor-pointer hover:scale-[102%] transition-all duration-[600ms] w-full h-auto bg-white flex flex-col gap-[16px] p-[10px] shadow-[0px_0px_20px_rgba(0,0,0,0.1)] rounded-[20px] mb-4 break-inside-avoid">
                                <img src="/images/Post.webp" alt="post" className="w-[332px] h-auto max-h-[377px] object-cover rounded-[16px] " />

                                <div className="flex flex-col w-full px-[6px]">
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

                                        <div className="flex flex-row items-center gap-2">
                                            {/* Share button */}
                                            <button className="cursor-pointer flex flex-row justify-center items-center -translate-y-[2px] w-[20px] h-[20px] rounded-full bg-[#D9D9D9]">
                                                <IoShareSocialSharp className="w-[14px] h-[14px] text-[#4f4f4f]" />
                                            </button>

                                            {/* Like button */}
                                            <button className="cursor-pointer flex flex-row justify-center -translate-y-[2px]">
                                                <IoMdHeart className="w-[25px] h-[25px] text-[#D9D9D9]" />
                                            </button>
                                        </div>
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
                                    <div className="font-inter mt-[16px] line-clamp-4 text-[10px] font-light underline cursor-pointer">
                                        <a>#Small-Batch Brownies</a>
                                        <a>#Cakes</a>
                                    </div>

                                    <div className="flex flex-col mt-[18px]">
                                        <div className="bg-black w-full h-[1px]" />
                                        <div className="flex flex-row font-inter text-[10px] font-light gap-[2px] mt-[7px] mb-[4px]">
                                            <IoMdHeart className="w-[17px] h-[17px] text-[#FF5454]" />
                                            <div className="translate-y-[2px]">
                                                100
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Post Card */}
                            <div className="cursor-pointer hover:scale-[102%] transition-all duration-[600ms] w-full h-auto bg-white flex flex-col gap-[16px] p-[10px] shadow-[0px_0px_20px_rgba(0,0,0,0.1)] rounded-[20px] mb-4 break-inside-avoid">
                                <img src="/images/Post.webp" alt="post" className="w-[332px] h-auto max-h-[377px] object-cover rounded-[16px] " />

                                <div className="flex flex-col w-full px-[6px]">
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

                                        <div className="flex flex-row items-center gap-2">
                                            {/* Share button */}
                                            <button className="cursor-pointer flex flex-row justify-center items-center -translate-y-[2px] w-[20px] h-[20px] rounded-full bg-[#D9D9D9]">
                                                <IoShareSocialSharp className="w-[14px] h-[14px] text-[#4f4f4f]" />
                                            </button>

                                            {/* Like button */}
                                            <button className="cursor-pointer flex flex-row justify-center -translate-y-[2px]">
                                                <IoMdHeart className="w-[25px] h-[25px] text-[#D9D9D9]" />
                                            </button>
                                        </div>
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
                                    <div className="font-inter mt-[16px] line-clamp-4 text-[10px] font-light underline cursor-pointer">
                                        <a>#Small-Batch Brownies</a>
                                        <a>#Cakes</a>
                                    </div>

                                    <div className="flex flex-col mt-[18px]">
                                        <div className="bg-black w-full h-[1px]" />
                                        <div className="flex flex-row font-inter text-[10px] font-light gap-[2px] mt-[7px] mb-[4px]">
                                            <IoMdHeart className="w-[17px] h-[17px] text-[#FF5454]" />
                                            <div className="translate-y-[2px]">
                                                100
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Post Card */}
                            <div className="cursor-pointer hover:scale-[102%] transition-all duration-[600ms] w-full h-auto bg-white flex flex-col gap-[16px] p-[10px] shadow-[0px_0px_20px_rgba(0,0,0,0.1)] rounded-[20px] mb-4 break-inside-avoid">
                                <img src="/images/Brownie_Post.jpg" alt="post" className="w-[332px] h-auto max-h-[377px] object-cover rounded-[16px] " />

                                <div className="flex flex-col w-full px-[6px]">
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

                                        <div className="flex flex-row items-center gap-2">
                                            {/* Share button */}
                                            <button className="cursor-pointer flex flex-row justify-center items-center -translate-y-[2px] w-[20px] h-[20px] rounded-full bg-[#D9D9D9]">
                                                <IoShareSocialSharp className="w-[14px] h-[14px] text-[#4f4f4f]" />
                                            </button>

                                            {/* Like button */}
                                            <button className="cursor-pointer flex flex-row justify-center -translate-y-[2px]">
                                                <IoMdHeart className="w-[25px] h-[25px] text-[#D9D9D9]" />
                                            </button>
                                        </div>
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
                                    <div className="font-inter mt-[16px] line-clamp-4 text-[10px] font-light underline cursor-pointer">
                                        <a>#Small-Batch Brownies</a>
                                        <a>#Cakes</a>
                                    </div>

                                    <div className="flex flex-col mt-[18px]">
                                        <div className="bg-black w-full h-[1px]" />
                                        <div className="flex flex-row font-inter text-[10px] font-light gap-[2px] mt-[7px] mb-[4px]">
                                            <IoMdHeart className="w-[17px] h-[17px] text-[#FF5454]" />
                                            <div className="translate-y-[2px]">
                                                100
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            <button className="fixed bottom-[20px] right-[20px] flex items-center justify-between h-[40px] bg-white border border-black rounded-full pr-[4px] pl-[22px] cursor-pointer hover:scale-105 transition-all duration-[600ms]">
                <div className="font-inter text-[16px] font-light text-black">
                    Post
                </div>
                <div className="w-[30px] h-[30px] bg-[#DA1A32] flex items-center justify-center rounded-full text-white text-[12px] ml-[20px]">
                    <IoAdd className="text-white w-[32px] h-[32px]" />
                </div>
            </button>
        </RgUserLayout>
    );
};

export default RgUserCourse;
