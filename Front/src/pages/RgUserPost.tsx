import { IoIosArrowBack, IoIosSearch, IoMdHeart } from "react-icons/io";
import RgUserLayout from "../components/RgUserLayout.tsx";
import { CiFilter } from "react-icons/ci";
import { TbArrowsSort } from "react-icons/tb";
import { FaStar } from "react-icons/fa";
import React, { useState } from "react";
import { IoAdd, IoShareSocialSharp } from "react-icons/io5";

const RgUserCol = () => {

    const [active, setActive] = useState("Discover Posts");

    const tabs = ["Discover Posts", "Liked Posts", "My Posts"];

    return (
        <RgUserLayout>

            <div className="w-full flex flex-col items-center">
                <p className="font-ibarra font-bold text-black text-[36px] pt-[50px]">
                    Discover <span className="text-[#DA1A32]">Posts</span>
                </p>
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

            {/* Courses */}
            <div className="mt-[24px] items-center text-black flex flex-col w-[1090px] mx-auto">

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


                <button className="fixed bottom-[20px] right-[20px] flex items-center justify-between h-[40px] bg-white border border-black rounded-full pr-[4px] pl-[22px] cursor-pointer hover:scale-105 transition-all duration-[600ms]">
                    <div className="font-inter text-[16px] font-light text-black">
                        Post
                    </div>
                    <div className="w-[30px] h-[30px] bg-[#DA1A32] flex items-center justify-center rounded-full text-white text-[12px] ml-[20px]">
                        <IoAdd className="text-white w-[32px] h-[32px]" />
                    </div>
                </button>
            </div>
        </RgUserLayout>
    );
};

export default RgUserCol;
