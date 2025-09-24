import { IoIosSearch} from "react-icons/io";
import RgUserLayout from "../components/RgUserLayout.tsx";

const RgUserLearn = () => {
    return (
        <RgUserLayout>
            <div className="w-full flex flex-col items-center">
                <p className="font-ibarra font-bold text-black text-[36px] pt-[50px]">
                    What do you want to <span className="text-[#DA1A32]">learn</span>?
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

                {/* Category container */}
                <div className="grid grid-cols-3 gap-x-[20px] gap-y-[44px] mt-[88px]">
                    {/* Category Card */}
                    <div className="w-[350px] flex flex-col items-center group cursor-pointer">
                        <img src="/images/Bread.webp" alt="Bread" className="w-full h-[237px] object-cover" />
                        <div className="font-ibarra font-bold text-black text-[20px] mt-[16px] group-hover:text-[#DA1A32] transition-all duration-300">
                            Bread
                        </div>
                    </div>

                    {/* Category Card */}
                    <div className="w-[350px] flex flex-col items-center group cursor-pointer">
                        <img src="/images/Pastry.jpg" alt="Pastry" className="w-full h-[237px] object-cover" />
                        <div className="font-ibarra font-bold text-black text-[20px] mt-[16px] group-hover:text-[#DA1A32] transition-all duration-300">
                            Pastry
                        </div>
                    </div>

                    {/* Category Card */}
                    <div className="w-[350px] flex flex-col items-center group cursor-pointer">
                        <img src="/images/Cookie.webp" alt="Cookie" className="w-full h-[237px] object-cover" />
                        <div className="font-ibarra font-bold text-black text-[20px] mt-[16px] group-hover:text-[#DA1A32] transition-all duration-300">
                            Cookies
                        </div>
                    </div>

                    {/* Category Card */}
                    <div className="w-[350px] flex flex-col items-center group cursor-pointer">
                        <img src="/images/Cake.webp" alt="Cake" className="w-full h-[237px] object-cover" />
                        <div className="font-ibarra font-bold text-black text-[20px] mt-[16px] group-hover:text-[#DA1A32] transition-all duration-300">
                            Cake
                        </div>
                    </div>

                    {/* Category Card */}
                    <div className="w-[350px] flex flex-col items-center group cursor-pointer">
                        <img src="/images/Pie.webp" alt="Pie" className="w-full h-[237px] object-cover" />
                        <div className="font-ibarra font-bold text-black text-[20px] mt-[16px] group-hover:text-[#DA1A32] transition-all duration-300">
                            Pie & Tarts
                        </div>
                    </div>

                    {/* Category Card */}
                    <div className="w-[350px] flex flex-col items-center group cursor-pointer">
                        <img src="/images/Sourdough.webp" alt="Sourdough" className="w-full h-[237px] object-cover" />
                        <div className="font-ibarra font-bold text-black text-[20px] mt-[16px] group-hover:text-[#DA1A32] transition-all duration-300">
                            Sourdough
                        </div>
                    </div>

                    {/* Category Card */}
                    <div className="w-[350px] flex flex-col items-center group cursor-pointer">
                        <img src="/images/Pizza.webp" alt="Pizza" className="w-full h-[237px] object-cover" />
                        <div className="font-ibarra font-bold text-black text-[20px] mt-[16px] group-hover:text-[#DA1A32] transition-all duration-300">
                            Pizza
                        </div>
                    </div>

                    {/* Category Card */}
                    <div className="w-[350px] flex flex-col items-center group cursor-pointer">
                        <img src="/images/Scone.webp" alt="Scone" className="w-full h-[237px] object-cover" />
                        <div className="font-ibarra font-bold text-black text-[20px] mt-[16px] group-hover:text-[#DA1A32] transition-all duration-300">
                            Scones & Muffins
                        </div>
                    </div>

                    {/* Category Card */}
                    <div className="w-[350px] flex flex-col items-center group cursor-pointer">
                        <img src="/images/Others.webp" alt="Others" className="w-full h-[237px] object-cover" />
                        <div className="font-ibarra font-bold text-black text-[20px] mt-[16px] group-hover:text-[#DA1A32] transition-all duration-300">
                            Others
                        </div>
                    </div>
                </div>

                {/* Basic Courses */}
                <div className="mt-[88px] w-full flex flex-col items-center pb-[62px]">
                    <div className="font-ibarra text-[32px] font-bold flex flex-row items-center gap-[8px] text-black">
                        <div className="w-[16px] h-[1px] bg-[#DA1A32]" />
                        Baking Basics
                        <div className="w-[16px] h-[1px] bg-[#DA1A32]" />
                    </div>
                    {/* Basic Courses container */}
                    <div className="grid grid-cols-3 gap-x-[20px] gap-y-[44px] mt-[32px]">
                        {/* Basic Course Card */}
                        <div className="w-[350px] flex flex-col items-center group cursor-pointer">
                            <img src="/images/Flour.jpg" alt="Flour" className="w-full h-[237px] object-cover" />
                            <div className="font-ibarra font-bold text-black text-[20px] mt-[16px] group-hover:text-[#DA1A32] transition-all duration-300">
                                Flour 101
                            </div>
                        </div>

                        {/* Basic Course Card */}
                        <div className="w-[350px] flex flex-col items-center group cursor-pointer">
                            <img src="/images/Leavening.png" alt="leavening" className="w-full h-[237px] object-cover" />
                            <div className="font-ibarra font-bold text-black text-[20px] mt-[16px] group-hover:text-[#DA1A32] transition-all duration-300">
                                Leavening Agents Explained
                            </div>
                        </div>

                        {/* Basic Course Card */}
                        <div className="w-[350px] flex flex-col items-center group cursor-pointer">
                            <img src="/images/Fat.jpg" alt="Fat" className="w-full h-[237px] object-cover" />
                            <div className="font-ibarra font-bold text-black text-[20px] mt-[16px] group-hover:text-[#DA1A32] transition-all duration-300">
                                Butter & Fats Basics
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </RgUserLayout>
    );
};

export default RgUserLearn;
