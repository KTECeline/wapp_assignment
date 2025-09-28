import { IoIosSearch } from "react-icons/io";
import RgUserLayout from "../components/RgUserLayout.tsx";
import { FaStar } from "react-icons/fa";
import { useState } from "react";

const RgUserSearch = () => {
    const [active, setActive] = useState("Courses");

    const tabs = ["Courses", "Posts", "Badges", "Reviews"];
    return (
        <RgUserLayout>
            <div className="max-w-screen overflow-x-hidden">
                <div className="w-full flex flex-col items-center">
                    <p className="font-ibarra font-bold text-black text-[36px] pt-[50px]">
                        What are you looking for <span className="text-[#DA1A32]">today</span>?
                    </p>

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

                    <div className="flex items-center justify-between w-[666px] h-[48px] bg-white border border-black rounded-full pr-[4px] pl-[22px] mt-[28px]">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="font-inter flex-1 bg-transparent outline-none text-black text-[16px] font-light"
                        />
                        <div className="w-[38px] h-[38px] bg-[#DA1A32] flex items-center justify-center rounded-full text-white text-[12px] cursor-pointer ml-[20px]">
                            <IoIosSearch className="text-white w-[24px] h-[24px] " />
                        </div>
                    </div>

                    <div className="mt-[24px] relative flex flex-row font-ibarra text-[22px] font-medium mb-[28px] gap-[16px] rounded-full bg-[#F8F5F0] p-2">
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

                    {/* Courses Container */}
                    <div className="mt-[32px] w-screen max-h-[512px] overflow-y-scroll no-scrollbar pb-[64px]">
                        <div className="grid grid-cols-4 gap-x-[14px] gap-y-[48px] w-[1090px] mx-auto">
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
                                    Small-Batch Brownies Small-Batch Brownies
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
                    </div>
                </div>
            </div>
        </RgUserLayout>
    );
};

export default RgUserSearch;
