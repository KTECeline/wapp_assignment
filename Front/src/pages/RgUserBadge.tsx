import { IoIosSearch } from "react-icons/io";
import RgUserLayout from "../components/RgUserLayout.tsx";

const RgUserLearn = () => {
    return (
        <RgUserLayout>
            <div className="max-w-screen overflow-x-hidden">
                <div className="w-full flex flex-col items-center">
                    <p className="font-ibarra font-bold text-black text-[36px] pt-[50px]">
                        My <span className="text-[#DA1A32]">Achievements</span>
                    </p>

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

                    {/* Badges Container */}
                    <div className="mt-[22px] pt-[22px] w-screen h-[526px] pb-[64px] overflow-y-scroll no-scrollbar">
                        <div className="grid grid-cols-4 gap-x-[14px] gap-y-[30px] w-[1090px] mx-auto">
                            {/* Badges Card */}
                            <div className="h-[315px] w-[262px] bg-white flex flex-col p-[10px] shadow-[0px_0px_20px_rgba(0,0,0,0.1)] rounded-[20px] text-black items-center px-[18px]">
                                <img src="/images/Badge.png" alt="recipe" className="w-[148px] h-[169px] object-cover" />

                                {/* Title */}
                                <div className="font-ibarra text-[18px] font-bold mt-[12px] line-clamp-2 group-hover:text-[#DA1A32] transition-all duration-300">
                                    Beginner Baker
                                </div>

                                {/* Description */}
                                <div className="flex gap-[14px] mt-[14px] text-[10px] w-full font-light h-[28px]">
                                    Complete 5 beginner lessons successfully
                                </div>

                                {/* Progress */}
                                <div className="mt-[14px] w-full bg-gray-200 rounded-full h-[9px] overflow-hidden">
                                    <div
                                        className="bg-[#DA1A32] h-[9px] transition-all duration-500"
                                        style={{ width: `100%` }}
                                    />
                                </div>

                                <div className="text-[10px] text-black mt-[10px]">
                                    5/5
                                </div>

                            </div>

                            {/* Badges Card */}
                            <div className="h-[315px] w-[262px] bg-white flex flex-col p-[10px] shadow-[0px_0px_20px_rgba(0,0,0,0.1)] rounded-[20px] text-black items-center px-[18px]">
                                <img src="/images/Badge.png" alt="recipe" className="w-[148px] h-[169px] object-cover" />

                                {/* Title */}
                                <div className="font-ibarra text-[18px] font-bold mt-[12px] line-clamp-2 group-hover:text-[#DA1A32] transition-all duration-300">
                                    Beginner Baker
                                </div>

                                {/* Description */}
                                <div className="flex gap-[14px] mt-[14px] text-[10px] w-full font-light h-[28px]">
                                    Complete 5 beginner lessons successfully
                                </div>

                                {/* Progress */}
                                <div className="mt-[14px] w-full bg-gray-200 rounded-full h-[9px] overflow-hidden">
                                    <div
                                        className="bg-[#DA1A32] h-[9px] transition-all duration-500"
                                        style={{ width: `100%` }}
                                    />
                                </div>

                                <div className="text-[10px] text-black mt-[10px]">
                                    5/5
                                </div>

                            </div>

                            {/* Badges Card */}
                            <div className="h-[315px] w-[262px] bg-white flex flex-col p-[10px] shadow-[0px_0px_20px_rgba(0,0,0,0.1)] rounded-[20px] text-black items-center px-[18px]">
                                <img src="/images/Badge.png" alt="recipe" className="w-[148px] h-[169px] object-cover" />

                                {/* Title */}
                                <div className="font-ibarra text-[18px] font-bold mt-[12px] line-clamp-2 group-hover:text-[#DA1A32] transition-all duration-300">
                                    Beginner Baker
                                </div>

                                {/* Description */}
                                <div className="flex gap-[14px] mt-[14px] text-[10px] w-full font-light h-[28px]">
                                    Complete 5 beginner lessons successfully
                                </div>

                                {/* Progress */}
                                <div className="mt-[14px] w-full bg-gray-200 rounded-full h-[9px] overflow-hidden">
                                    <div
                                        className="bg-[#DA1A32] h-[9px] transition-all duration-500"
                                        style={{ width: `100%` }}
                                    />
                                </div>

                                <div className="text-[10px] text-black mt-[10px]">
                                    5/5
                                </div>

                            </div>

                            {/* Badges Card */}
                            <div className="h-[315px] w-[262px] bg-white flex flex-col p-[10px] shadow-[0px_0px_20px_rgba(0,0,0,0.1)] rounded-[20px] text-black items-center px-[18px]">
                                <img src="/images/Badge.png" alt="recipe" className="w-[148px] h-[169px] object-cover" />

                                {/* Title */}
                                <div className="font-ibarra text-[18px] font-bold mt-[12px] line-clamp-2 group-hover:text-[#DA1A32] transition-all duration-300">
                                    Beginner Baker
                                </div>

                                {/* Description */}
                                <div className="flex gap-[14px] mt-[14px] text-[10px] w-full font-light h-[28px]">
                                    Complete 5 beginner lessons successfully
                                </div>

                                {/* Progress */}
                                <div className="mt-[14px] w-full bg-gray-200 rounded-full h-[9px] overflow-hidden">
                                    <div
                                        className="bg-[#DA1A32] h-[9px] transition-all duration-500"
                                        style={{ width: `100%` }}
                                    />
                                </div>

                                <div className="text-[10px] text-black mt-[10px]">
                                    5/5
                                </div>

                            </div>

                            {/* Badges Card */}
                            <div className="h-[315px] w-[262px] bg-white flex flex-col p-[10px] shadow-[0px_0px_20px_rgba(0,0,0,0.1)] rounded-[20px] text-black items-center px-[18px]">
                                <img src="/images/Badge.png" alt="recipe" className="w-[148px] h-[169px] object-cover" />

                                {/* Title */}
                                <div className="font-ibarra text-[18px] font-bold mt-[12px] line-clamp-2 group-hover:text-[#DA1A32] transition-all duration-300">
                                    Beginner Baker
                                </div>

                                {/* Description */}
                                <div className="flex gap-[14px] mt-[14px] text-[10px] w-full font-light h-[28px]">
                                    Complete 5 beginner lessons successfully
                                </div>

                                {/* Progress */}
                                <div className="mt-[14px] w-full bg-gray-200 rounded-full h-[9px] overflow-hidden">
                                    <div
                                        className="bg-[#DA1A32] h-[9px] transition-all duration-500"
                                        style={{ width: `100%` }}
                                    />
                                </div>

                                <div className="text-[10px] text-black mt-[10px]">
                                    5/5
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </RgUserLayout>
    );
};

export default RgUserLearn;
