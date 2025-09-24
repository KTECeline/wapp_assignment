import RgUserQLayout from "../components/RgUserQLayout.tsx";

const RgUserMCQ = () => {
    return (
        <RgUserQLayout mode="quiz" progress={10}>
            {/* Left Content */}
            <div className="h-screen flex flex-col w-[36.7%] bg-gradient-to-r from-[#301818] to-[#732222]">
                <div className="mt-[112px] h-[472px] w-[455px] mx-auto gap-[16px] flex flex-col overflow-y-scroll scrol">

                    <div className="font-ibarra w-full bg-white px-[18px] py-[16px] rounded-[10px] text-black font-medium">
                        The toothpick/skewer test is often used to check if brownies are done baking. Based on the image below, which skewer indicate that the brownie is ready
                    </div>

                    {/* <video
                            src="/videos/Brownie.mp4"
                            controls
                            className="w-full h-[256px] rounded-[10px] mt-[18px] cursor-pointer"
                        /> */}

                    <img
                        src="/images/MCQ.jpg"
                        className="w-full h-[256px] rounded-[10px] mt-[18px] cursor-pointer object-cover"
                        alt="MCQ"
                    />

                </div>
            </div>

            <style>
                {`
                        .scrol::-webkit-scrollbar {
                            width: 0px;
                            height: 0px;
                        }
                    `}
            </style>

            <div className="py-[80px] w-[63.3%]">
                {/* Right Content */}
                <div className="flex h-full w-full items-center justify-center">
                    <div className="flex flex-row gap-[24px] h-[475px]">
                        <div className="font-inter w-[203px] h-full bg-white flex justify-center items-center p-[24px] text-black text-[14px] border-[3px] border-[#B9A9A1] rounded-[20px] cursor-pointer shadow-[0px_5px_0px_rgba(185,169,161,1)] transition-all duration-[600ms] hover:-translate-y-2    hover:text-[#DA1A32] hover:border-[#DA1A32] hover:shadow-[0px_5px_0px_rgba(218,26,50,1)] ">
                            {/* <img
                                    src="/images/MCQ.jpg"
                                    className="w-full h-auto rounded-[10px] cursor-pointer object-cover"
                                    alt="Option1"
                                /> */}

                            A
                        </div>
                        <div className="font-inter w-[203px] h-full bg-white flex justify-center items-center p-[24px] text-black text-[14px] border-[3px] border-[#B9A9A1] rounded-[20px] cursor-pointer shadow-[0px_5px_0px_rgba(185,169,161,1)] transition-all duration-[600ms] hover:-translate-y-2 hover:text-[#DA1A32] hover:border-[#DA1A32] hover:shadow-[0px_5px_0px_rgba(218,26,50,1)] ">
                            B
                        </div>
                        <div className="font-inter w-[203px] h-full bg-white flex justify-center items-center p-[24px] text-black text-[14px] border-[3px] border-[#B9A9A1] rounded-[20px] cursor-pointer shadow-[0px_5px_0px_rgba(185,169,161,1)] transition-all duration-[600ms] hover:-translate-y-2 hover:text-[#DA1A32] hover:border-[#DA1A32] hover:shadow-[0px_5px_0px_rgba(218,26,50,1)] ">
                            C
                        </div>
                        <div className="font-inter w-[203px] h-full bg-white flex justify-center items-center p-[24px] text-black text-[14px] border-[3px] border-[#B9A9A1] rounded-[20px] cursor-pointer shadow-[0px_5px_0px_rgba(185,169,161,1)] transition-all duration-[600ms] hover:-translate-y-2 hover:text-[#DA1A32] hover:border-[#DA1A32] hover:shadow-[0px_5px_0px_rgba(218,26,50,1)] ">
                            None of the options
                        </div>
                    </div>
                </div>
            </div>
        </RgUserQLayout>
    );
};

export default RgUserMCQ;
