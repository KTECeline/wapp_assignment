import { IoIosArrowBack, IoIosArrowForward, IoMdHeart } from "react-icons/io";
import RgUserLayout from "../components/RgUserLayout.tsx";
import { CiBookmark, CiFilter } from "react-icons/ci";
import { FaStar } from "react-icons/fa";
import { IoAdd, IoShareSocialSharp } from "react-icons/io5";
import { TbArrowsSort } from "react-icons/tb";

const RgUserCourseReview = () => {
    return (
        <RgUserLayout>
            <div className="max-w-screen overflow-x-hidden">
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
                    {/* Reviews */}
                    <div className="items-center text-black flex flex-col w-[1090px] relative">
                        <div className="font-ibarra text-[32px] font-bold flex flex-row items-center gap-[8px]">
                            <div className="w-[16px] h-[1px] bg-[#DA1A32]" />
                            Reviews
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

                        <div className="flex flex-row justify-center mt-[22px] mb-[16px]">
                            <div className="w-[295px] flex flex-col items-center">
                                {/* Review */}
                                <div className="font-inter text-[#484848] text-[14px] font-light">
                                    6 reviews
                                </div>

                                <div className="font-ibarra text-[64px] h-[64px] flex flex-row items-center my-[2px]">
                                    5.0
                                </div>

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
                            </div>

                            <div className="w-[295px] flex flex-col gap-[4px]">
                                <div className="flex flex-row gap-[6px]">
                                    <div className="text-black font-inter text-[12px] font-medium">
                                        5
                                    </div>
                                    <div className="w-full bg-[#FFDBDB] rounded-full h-[6px] overflow-hidden my-auto">
                                        <div
                                            className="bg-[#DA1A32] h-[6px] transition-all duration-500 rounded-full"
                                            style={{ width: `100%` }}
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-row gap-[6px]">
                                    <div className="text-black font-inter text-[12px] font-medium">
                                        4
                                    </div>
                                    <div className="w-full bg-[#FFDBDB] rounded-full h-[6px] overflow-hidden my-auto">
                                        <div
                                            className="bg-[#DA1A32] h-[6px] transition-all duration-500 rounded-full"
                                            style={{ width: `80%` }}
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-row gap-[6px]">
                                    <div className="text-black font-inter text-[12px] font-medium">
                                        3
                                    </div>
                                    <div className="w-full bg-[#FFDBDB] rounded-full h-[6px] overflow-hidden my-auto">
                                        <div
                                            className="bg-[#DA1A32] h-[6px] transition-all duration-500 rounded-full"
                                            style={{ width: `50%` }}
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-row gap-[6px]">
                                    <div className="text-black font-inter text-[12px] font-medium">
                                        2
                                    </div>
                                    <div className="w-full bg-[#FFDBDB] rounded-full h-[6px] overflow-hidden my-auto">
                                        <div
                                            className="bg-[#DA1A32] h-[6px] transition-all duration-500 rounded-full"
                                            style={{ width: `0%` }}
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-row gap-[6px]">
                                    <div className="text-black font-inter text-[12px] font-medium">
                                        1
                                    </div>
                                    <div className="w-full bg-[#FFDBDB] rounded-full h-[6px] overflow-hidden my-auto">
                                        <div
                                            className="bg-[#DA1A32] h-[6px] transition-all duration-500 rounded-full"
                                            style={{ width: `0%` }}
                                        />
                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* Review Container */}
                        <div className="mt-[22px] w-screen max-h-[380px] overflow-y-scroll no-scrollbar pb-[64px] pt-[10px]">
                            <div className="grid grid-cols-3 gap-[20px] w-[1090px] mx-auto">
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
