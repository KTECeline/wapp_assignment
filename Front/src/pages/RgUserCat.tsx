import { IoIosSearch } from "react-icons/io";
import RgUserLayout from "../components/RgUserLayout.tsx";
import { CiFilter } from "react-icons/ci";
import { TbArrowsSort } from "react-icons/tb";
import { FaStar } from "react-icons/fa";

const RgUserCat = () => {
    return (
        <RgUserLayout>

            {/* Banner */}
            <div
                className="w-full h-[200px] relative bg-fixed bg-center bg-cover"
                style={{ backgroundImage: "url('/images/Pastry_Banner.jpg')" }}
            >
                {/* Overlay */}
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-[#000000]/40 to-[#000000]/0 z-10" />

                {/* Content */}
                <div className="absolute top-0 left-0 w-full h-full z-20">
                    <div className="relative w-[1090px] h-full mx-auto flex items-center">
                        <div className="font-ibarra text-[48px] max-w-[500px] leading-tight font-bold text-white">
                            Pastry
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

            {/* Courses */}
            <div className="mt-[24px] items-center text-black flex flex-col w-[1090px] mx-auto">
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

                {/* Courses Container */}
                <div className="mt-[32px] grid grid-cols-4 gap-x-[14px] gap-y-[48px] max-w-screen h-[512px] overflow-y-scroll no-scrollbar pb-[64px]">

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
        </RgUserLayout>
    );
};

export default RgUserCat;
