import { IoIosArrowBack, IoIosArrowForward} from "react-icons/io";
import RgUserLayout from "../components/RgUserLayout.tsx";
import { FaStar } from "react-icons/fa";

const RgUserCourseStep = () => {
    return (
        <RgUserLayout>

            <div className="flex flex-row justify-between w-[1408px] mx-auto">
                {/* Left Content */}
                <div className="h-full mx-auto flex flex-col mt-[32px] ml-[36px]">
                    <div className="font-ibarra text-[32px] leading-tight font-bold text-black mb-[8px] relative">
                        Step-by-Step Guide
                        <button className="cursor-pointer">
                            <IoIosArrowBack className="text-[#DA1A32] h-[28px] absolute top-[6px] -left-9 " />
                        </button>
                    </div>

                    <div className="font-inter text-[10px] max-w-[500px] leading-tight font-[200] text-black flex items-center gap-[2px]">
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

                    <video
                        src="/videos/Brownie.mp4"
                        controls
                        className="w-[814px] h-[458px] rounded-[10px] mt-[18px] cursor-pointer"
                    />
                </div>

                <style>
                    {`
                        .scrol::-webkit-scrollbar {
                            width: 5px;
                            height: 5px;
                        }

                        .scrol::-webkit-scrollbar-track {
                            background: rgba(188, 188, 188, 0.2); /* Darker transparent track */
                            border-radius: 10px;
                            cursor: pointer; /* Pointer cursor on track hover */
                        }

                        .scrol::-webkit-scrollbar-thumb {
                            background: rgba(0, 0, 0, 0.2); /* Lighter thumb for contrast */
                            border-radius: 10px;
                            transition: background 0.3s ease-in-out;
                            cursor: grab; /* Grab cursor for thumb */
                        }

                        .scrol::-webkit-scrollbar-thumb:active {
                            cursor: grabbing; /* Grabbing cursor when dragging */
                        }
                    `}
                </style>


                {/* Right Content */}
                <div className="flex flex-col mt-[38px] w-[500px] items-center">
                    <div className="font-ibarra text-[32px] font-bold flex flex-row items-center gap-[8px] text-black">
                        <div className="w-[16px] h-[1px] bg-[#DA1A32]" />
                        Instruction
                        <div className="w-[16px] h-[1px] bg-[#DA1A32]" />
                    </div>

                    <div className="w-full h-[458px] mt-[34px] overflow-y-scroll scrol">
                        {/* Instruction */}
                        <ul className="flex flex-col gap-[24px]">
                            <li className="max-w-[432px] text-[14px] text-black font-light text-justify flex gap-[14px]">
                                <span>
                                    1.
                                </span>
                                <p>
                                    Preheat the oven to 350°F with a rack in the center. Lightly grease an 8 1/2" x 4 1/2" loaf pan. Line the pan with a parchment sling and lightly grease the parchment.
                                </p>
                            </li>
                            <li className="max-w-[432px] text-[14px] text-black font-light text-justify flex gap-[14px]">
                                <span>
                                    2.
                                </span>
                                <p>
                                    In a large saucepan or microwave-safe bowl, heat the butter over medium-low heat or microwave for 45 to 60 seconds, covered, on 50% power, until just melted.
                                </p>
                            </li>
                            <li className="max-w-[432px] text-[14px] text-black font-light text-justify flex gap-[14px]">
                                <span>
                                    3.
                                </span>
                                <p>
                                    Whisk the sugar into the butter. Add the egg and vanilla and whisk until the mixture is shiny and emulsified.
                                </p>
                            </li>
                            <li className="max-w-[432px] text-[14px] text-black font-light text-justify flex gap-[14px]">
                                <span>
                                    4.
                                </span>
                                <p>
                                    Whisk in the cocoa and espresso powder until well combined.
                                </p>
                            </li>
                            <li className="max-w-[432px] text-[14px] text-black font-light text-justify flex gap-[14px]">
                                <span>
                                    5.
                                </span>
                                <p>
                                    Add the flour, salt, and baking powder and whisk until just combined.
                                </p>
                            </li>
                            <li className="max-w-[432px] text-[14px] text-black font-light text-justify flex gap-[14px]">
                                <span>
                                    6.
                                </span>
                                <p>
                                    Using a flexible spatula, stir in the chocolate chips until incorporated.
                                </p>
                            </li>
                            <li className="max-w-[432px] text-[14px] text-black font-light text-justify flex gap-[14px]">
                                <span>
                                    7.
                                </span>
                                <p>
                                    Transfer the batter to the prepared pan and spread it evenly to the edges.
                                </p>
                            </li>
                            <li className="max-w-[432px] text-[14px] text-black font-light text-justify flex gap-[14px]">
                                <span>
                                    8.
                                </span>
                                <p>
                                    Bake the brownies for 30 to 35 minutes, until the edges feel set and a toothpick or a sharp knife inserted into the center one.
                                </p>
                            </li>
                            <li className="max-w-[432px] text-[14px] text-black font-light text-justify flex gap-[14px]">
                                <span>
                                    9.
                                </span>
                                <p>
                                    Remove the brownies from the oven and let cool completely in the pan on a rack. Use the parchment to lift the brownies out of the pan and transfer them to a cutting board before slicing.
                                </p>
                            </li>
                            <li className="max-w-[432px] text-[14px] text-black font-light text-justify flex gap-[14px]">
                                <span>
                                    10.
                                </span>
                                <p>
                                    Store leftover brownies in an airtight container at room temperature for several days; freeze for longer storage.
                                </p>
                            </li>
                        </ul>

                        <div className="font-ibarra text-[32px] font-bold flex flex-row items-center gap-[8px] text-black mt-[44px] justify-center mb-[24px]">
                            <div className="w-[16px] h-[1px] bg-[#DA1A32]" />
                            Tips
                            <div className="w-[16px] h-[1px] bg-[#DA1A32]" />
                        </div>

                        <ul className="flex flex-col gap-[24px]">
                            <li className="max-w-[432px] text-[14px] text-black font-light text-justify flex gap-[14px]">
                                <span>
                                    <FaStar
                                        className="text-[#DA1A32] translate-y-[2px]"
                                        size="14px"
                                    />
                                </span>
                                <p>
                                    If you don’t have an 8 1/2" x 4 1/2" loaf pan, bake small-batch brownies in a 9" x 5" quick bread pan instead, reducing the baking time to 25 to 30 minutes. You can also bake them in a 9" x 6" mini (eighth) sheet pan, reducing the baking time to 20 to 25 minutes. The brownies will be slightly thinner (about 1/2").
                                </p>
                            </li>
                            <li className="max-w-[432px] text-[14px] text-black font-light text-justify flex gap-[14px]">
                                <span>
                                    <FaStar
                                        className="text-[#DA1A32] translate-y-[2px]"
                                        size="14px"
                                    />
                                </span>
                                <p>
                                    In a large saucepan or microwave-safe bowl, heat the butter over medium-low heat or microwave for 45 to 60 seconds, covered, on 50% power, until just melted.
                                </p>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </RgUserLayout>
    );
};

export default RgUserCourseStep;
