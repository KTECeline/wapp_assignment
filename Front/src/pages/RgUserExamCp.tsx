import { IoAdd } from "react-icons/io5";
import RgUserCLayout from "../components/RgUserCLayout.tsx";

const RgUserExamCp = () => {
    return (
        <RgUserCLayout>
            <div className="flex flex-col justify-center">
                <div className="flex flex-row mx-auto mt-[48px] gap-[88px]">
                    <img src="/images/Sparkles.gif" className="w-[56px] h-[56px] -translate-y-[4px]" alt="Sparkles"/>
                    <div className="font-ibarra text-[32px] font-bold text-[#FF5858]">
                        Congratulation!
                    </div>
                    <img src="/images/Sparkles.gif" className="w-[56px] h-[56px] -translate-y-[4px]" alt="Sparkles"/>
                </div>


                <div className="font-ibarra text-[16px] font-semibold text-[#6D3636] mx-auto mt-[6px]">
                    You have completed the course
                </div>

                <div className="flex flex-row mx-auto mt-[12px] gap-[68px]">
                    <img src="/images/Congratulation.gif" className="w-[58px] h-[58px] -translate-y-[4px]  scale-x-[-1]" alt="Congratulation"/>
                    <div className="font-ibarra text-[36px] bg-gradient-to-r from-[#C83753] to-[#FF466A] bg-clip-text text-transparent font-bold">
                        Small-Batch Brownies
                    </div>
                    <img src="/images/Congratulation.gif" className="w-[58px] h-[58px] -translate-y-[4px]" alt="Congratulation"/>
                </div>

                <div className="font-ibarra text-[28px] font-bold text-black mx-auto mt-[32px]">
                    Next Steps:
                </div>

                <div className="flex flex-col gap-[12px] w-[460px] mx-auto mt-[14px]">
                    <div className="w-full h-[56px] p-[8px] flex flex-row justify-between items-center bg-[#F8F5F0] rounded-full">
                        <div className="font-inter text-[18px] font-light text-black ml-[20px]">
                            1. Share Your Results
                        </div>

                        <button className="flex items-center justify-between h-[40px] bg-white border border-black rounded-full pr-[4px] pl-[22px] cursor-pointer hover:scale-105 transition-all duration-[600ms]">
                            <div className="font-inter text-[16px] font-light text-black">
                                Post
                            </div>
                            <div className="w-[30px] h-[30px] bg-[#DA1A32] flex items-center justify-center rounded-full text-white text-[12px] ml-[20px]">
                                <IoAdd className="text-white w-[32px] h-[32px]" />
                            </div>
                        </button>
                    </div>
                    <div className="w-full h-[56px] p-[8px] flex flex-row justify-between items-center bg-[#F8F5F0] rounded-full">
                        <div className="font-inter text-[18px] font-light text-black ml-[20px]">
                            2. Leave a Review
                        </div>

                        <button className="flex items-center justify-between h-[40px] bg-white border border-black rounded-full pr-[4px] pl-[22px] cursor-pointer hover:scale-105 transition-all duration-[600ms]">
                            <div className="font-inter text-[16px] font-light text-black">
                                Review
                            </div>
                            <div className="w-[30px] h-[30px] bg-[#DA1A32] flex items-center justify-center rounded-full text-white text-[12px] ml-[20px]">
                                <IoAdd className="text-white w-[32px] h-[32px]" />
                            </div>
                        </button>
                    </div>
                    <div className="w-full h-[56px] p-[8px] flex flex-row justify-between items-center bg-[#F8F5F0] rounded-full">
                        <div className="font-inter text-[18px] font-light text-black ml-[20px]">
                            3. View Badge Progress
                        </div>

                        <button className="flex items-center justify-between h-[40px] bg-white border border-black rounded-full px-[22px] cursor-pointer hover:scale-105 transition-all duration-[600ms]">
                            <div className="font-inter text-[16px] font-light text-black">
                                View Badges
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </RgUserCLayout>
    );
};

export default RgUserExamCp;
