import { FaStar } from "react-icons/fa";
import { IoIosSend, IoMdArrowBack, IoMdArrowForward, IoMdHeart } from "react-icons/io";
import RgUserLayout from "../components/RgUserLayout.tsx";
import { IoAdd } from "react-icons/io5";
import { Link } from "react-router-dom";

const RgUserHome = () => {
    return (
        <RgUserLayout>

            {/* HeroSection */}
            <div className="w-full h-[500px] relative">
                <img src="/images/Announcement2.jpg" alt="announcement" className="w-full h-[500px] object-cover z-0" />
                <div className="absolute top-0 left-0 w-full h-[500px] bg-[#fefefe]/20 backdrop-blur-[12px] z-10" />
                <div className="absolute top-0 left-0 w-full h-[500px] z-20">
                    <div className="relative w-[1100px] h-[500px] mx-auto">
                        <img src="/images/Announcement2.jpg" alt="announcement" className="w-full h-full object-cover" />
                        <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-br from-[#000000]/50 to-[#000000]/10" />
                        <div className="absolute top-[120px] left-0 w-full text-white pl-[122px]">
                            <div className="text-[40px] max-w-[500px] leading-tight font-medium drop-shadow-[0px_2px_5px_rgba(0,0,0,0.55)]">
                                Discover the Art of Pastry, Anytime, Anywhere
                            </div>
                            <div className="text-[14px] max-w-[390px] leading-tight font-[200] pt-[18px] drop-shadow-[0px_2px_5px_rgba(0,0,0,0.55)]">
                                Learn to bake like a pro with expert pastry chefs guiding you through fun, step-by-step online lessons for bakery-quality treats at home.
                            </div>

                            <div className="mt-[24px] w-[340.6px] gap-[12px] flex flex-row justify-between">
                                <Link to="/Register"
                                    className="w-[62%] h-[44px] hover:scale-105 flex justify-center items-center rounded-full transition-all duration-[600ms] bg-[#DA1A32] text-white"
                                >
                                    Start Now
                                </Link>

                                <Link to="/Login"
                                    className="w-[36%] h-[44px] relative group cursor-pointer rounded-full mx-[2px] flex justify-center items-center text-white font-inter border-white border hover:scale-105 transition-all duration-[600ms]"
                                >
                                    Login
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Discover Courses */}
            <div className="mt-[36px] items-center text-black flex flex-col w-full">
                <div className="font-ibarra text-[32px] font-bold flex flex-row items-center gap-[8px]">
                    <div className="w-[16px] h-[1px] bg-[#DA1A32]" />
                    Discover Our Courses
                    <div className="w-[16px] h-[1px] bg-[#DA1A32]" />
                </div>

                <div className="mt-[8px] font-inter text-[14px] flex flex-row items-center font-light max-w-[540px] text-center">
                    Explore our most popular recipe categories, from soft breads to delicate pastries and classic cookies. Choose your favorite and start baking today.
                </div>

                <div className="mt-[38px] text-black flex flex-row justify-between w-[1090px] mx-auto">
                    <div className="w-full">
                        {/* Category container */}
                        <div className="grid grid-cols-3 gap-x-[20px] gap-y-[44px]">
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
                        </div>
                    </div>
                </div>

                <button className="font-inter mt-[38px] cursor-pointer mx-auto bg-white px-[22px] py-[2px] border-[1px] border-black rounded-full font-light hover:scale-105 transition-all duration-[600ms]">
                    View More
                </button>
            </div>

            {/* Discover Posts */}
            <div className="mt-[62px] bg-[#F8F5F0] pt-[36px] items-center text-black flex flex-col w-full pb-[62px] relative">
                <div className="font-ibarra text-[32px] font-bold flex flex-row items-center gap-[8px]">
                    <div className="w-[16px] h-[1px] bg-[#DA1A32]" />
                    Join Our Community
                    <div className="w-[16px] h-[1px] bg-[#DA1A32]" />
                </div>

                <div className="mt-[8px] font-inter text-[14px] flex flex-row items-center font-light max-w-[540px] text-center">
                    Share your creations, exchange tips, and connect with fellow baking enthusiasts worldwide. De Pastry Lab is more than learning, it’s about growing together.
                </div>

                {/* Post Container */}
                <div className="mt-[38px] flex flex-row gap-[20px] max-w-screen">

                    {/* Post Card */}
                    <div className="cursor-pointer hover:scale-[105%] transition-all duration-[600ms] w-[350px] h-[323px] bg-white flex flex-row gap-[16px] p-[10px] shadow-[0px_0px_20px_rgba(0,0,0,0.1)] rounded-[20px]">
                        <div className="relative w-[170px] h-full rounded-[16px] overflow-hidden">
                            <img src="/images/Post.webp" alt="post" className="w-full h-full object-cover z-0" />
                            <div className="absolute top-0 left-0 w-full h-full bg-[#fefefe]/20 backdrop-blur-[12px] z-10" />
                            <div className="absolute top-0 left-0 w-full h-full flex items-center z-20">
                                <img src="/images/Post.webp" alt="post" className="w-full object-cover" />
                            </div>
                        </div>

                        <div className="flex flex-col w-[142px] justify-between">
                            <div>
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

                                    {/* Like button */}
                                    <button className="cursor-pointer">
                                        <IoMdHeart className="w-[20px] h-[20px] text-[#D9D9D9]" />
                                    </button>
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
                                <div className="font-inter mt-[26px] line-clamp-4 text-[10px] font-light underline cursor-pointer">
                                    <a>#Small-Batch Brownies</a>
                                    <a>#Cakes</a>
                                </div>
                            </div>

                            <div className="flex flex-col">
                                <div className="bg-black w-full h-[1px]" />
                                <div className="flex flex-row font-inter text-[10px] font-light gap-[2px] mt-[5px] mb-[3px]">
                                    <IoMdHeart className="w-[17px] h-[17px] text-[#FF5454]" />
                                    <div className="translate-y-[2px]">
                                        100
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Post Card */}
                    <div className="cursor-pointer hover:scale-[105%] transition-all duration-[600ms] w-[350px] h-[323px] bg-white flex flex-row gap-[16px] p-[10px] shadow-[0px_0px_20px_rgba(0,0,0,0.1)] rounded-[20px]">
                        <div className="relative w-[170px] h-full rounded-[16px] overflow-hidden">
                            <img src="/images/Post.webp" alt="post" className="w-full h-full object-cover z-0" />
                            <div className="absolute top-0 left-0 w-full h-full bg-[#fefefe]/20 backdrop-blur-[12px] z-10" />
                            <div className="absolute top-0 left-0 w-full h-full flex items-center z-20">
                                <img src="/images/Post.webp" alt="post" className="w-full object-cover" />
                            </div>
                        </div>

                        <div className="flex flex-col w-[142px] justify-between">
                            <div>
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

                                    {/* Like button */}
                                    <button className="cursor-pointer">
                                        <IoMdHeart className="w-[20px] h-[20px] text-[#D9D9D9]" />
                                    </button>
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
                                <div className="font-inter mt-[26px] line-clamp-4 text-[10px] font-light underline cursor-pointer">
                                    <a>#Small-Batch Brownies</a>
                                    <a>#Cakes</a>
                                </div>
                            </div>

                            <div className="flex flex-col">
                                <div className="bg-black w-full h-[1px]" />
                                <div className="flex flex-row font-inter text-[10px] font-light gap-[2px] mt-[5px] mb-[3px]">
                                    <IoMdHeart className="w-[17px] h-[17px] text-[#FF5454]" />
                                    <div className="translate-y-[2px]">
                                        100
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Post Card */}
                    <div className="cursor-pointer hover:scale-[105%] transition-all duration-[600ms] w-[350px] h-[323px] bg-white flex flex-row gap-[16px] p-[10px] shadow-[0px_0px_20px_rgba(0,0,0,0.1)] rounded-[20px]">
                        <div className="relative w-[170px] h-full rounded-[16px] overflow-hidden">
                            <img src="/images/Post.webp" alt="post" className="w-full h-full object-cover z-0" />
                            <div className="absolute top-0 left-0 w-full h-full bg-[#fefefe]/20 backdrop-blur-[12px] z-10" />
                            <div className="absolute top-0 left-0 w-full h-full flex items-center z-20">
                                <img src="/images/Post.webp" alt="post" className="w-full object-cover" />
                            </div>
                        </div>

                        <div className="flex flex-col w-[142px] justify-between">
                            <div>
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

                                    {/* Like button */}
                                    <button className="cursor-pointer">
                                        <IoMdHeart className="w-[20px] h-[20px] text-[#D9D9D9]" />
                                    </button>
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
                                <div className="font-inter mt-[26px] line-clamp-4 text-[10px] font-light underline cursor-pointer">
                                    <a>#Small-Batch Brownies</a>
                                    <a>#Cakes</a>
                                </div>
                            </div>

                            <div className="flex flex-col">
                                <div className="bg-black w-full h-[1px]" />
                                <div className="flex flex-row font-inter text-[10px] font-light gap-[2px] mt-[5px] mb-[3px]">
                                    <IoMdHeart className="w-[17px] h-[17px] text-[#FF5454]" />
                                    <div className="translate-y-[2px]">
                                        100
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <button className="font-inter mt-[48px] cursor-pointer mx-auto bg-white px-[22px] py-[2px] border-[1px] border-black rounded-full font-light hover:scale-105 transition-all duration-[600ms]">
                    View More
                </button>
            </div>

            {/* About Us */}
            <div className="mt-[36px] items-center text-black flex flex-col w-full">
                <div className="font-ibarra text-[32px] font-bold flex flex-row items-center gap-[8px]">
                    <div className="w-[16px] h-[1px] bg-[#DA1A32]" />
                    Our Journey
                    <div className="w-[16px] h-[1px] bg-[#DA1A32]" />
                </div>

                <div className="mt-[38px] text-black flex flex-row justify-between w-[1090px] mx-auto">
                    <div className="w-[500px]">
                        <div className="flex flex-col">
                            <p className="font-ibarra font-bold text-black text-[36px]">
                                About <span className="text-[#DA1A32]">Us</span>
                            </p>

                            <p className="mt-[6px] text-[14px] font-inter font-light text-justify">
                                At De Pastry Lab, we believe that the art of baking should be accessible to everyone. Whether you’re a complete beginner discovering the joy of baking for the first time or an aspiring pastry chef aiming to perfect your craft. Our platform was created with one mission in mind: To inspire and empower learners to explore the world of pastries, cakes, and desserts through hands-on, high-quality online learning.
                            </p>

                            <p className="mt-[32px] font-ibarra font-bold text-black text-[28px]">
                                Our Mission
                            </p>

                            <p className="mt-[6px] text-[14px] font-inter font-light text-justify">
                                Our mission is to make pastry education engaging, practical, and inclusive. We aim to bridge the gap between professional techniques and home-baking creativity by offering easy-to-follow lessons, expert guidance, and a supportive learning community.
                            </p>


                            <p className="mt-[32px] font-ibarra font-bold text-black text-[28px]">
                                Our Vision
                            </p>
                            <p className="mt-[6px] text-[14px] font-inter font-light text-justify">
                                We envision a world where anyone with a whisk and a little curiosity can create pastries that bring people together. De Pastry Lab strives to be the leading e-learning hub for pastry education, nurturing creativity, confidence, and lifelong passion for baking.
                            </p>
                        </div>
                    </div>

                    <div className="w-[500px]">
                        <div className="w-full h-[540px] relative overflow-hidden rounded-[30px]">
                            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-black/10 to-black/0" ></div>

                            <video
                                id="De Pastry Lab"
                                className="w-full h-full object-cover"
                                autoPlay
                                muted
                                loop
                                src="/videos/Register.mp4"
                            >
                            </video>
                        </div>
                    </div>
                </div>
            </div>

            {/* What we offer */}
            <div className="mt-[80px] w-full flex flex-col items-center text-black px-4">
                {/* Section Title */}
                <div className="font-ibarra text-[32px] font-bold flex items-center gap-[8px]">
                    <div className="w-[30px] h-[2px] bg-[#DA1A32]" />
                    What We Offer
                    <div className="w-[30px] h-[2px] bg-[#DA1A32]" />
                </div>

                {/* Cards Container */}
                <div className="grid grid-cols-4 gap-[20px] mt-[38px] max-w-[1200px] w-full">

                    {/* Card */}
                    <div className="bg-[#F8F5F0] rounded-2xl shadow-sm p-6 flex flex-col items-center text-center">
                        <h3 className="font-ibarra font-bold text-[18px] text-[#DA1A32] mb-2">Interactive Courses</h3>
                        <p className="font-inter text-[13px] text-gray-600">
                            Step-by-step lessons designed by passionate pastry experts.
                        </p>
                    </div>

                    {/* Card */}
                    <div className="bg-[#F8F5F0] rounded-2xl shadow-sm p-6 flex flex-col items-center text-center">
                        <h3 className="font-ibarra font-bold text-[18px] text-[#DA1A32] mb-2">Learn Anytime, Anywhere</h3>
                        <p className="font-inter text-[13px] text-gray-600">
                            Access courses on your own schedule, perfect for hobbyists and busy professionals.
                        </p>
                    </div>

                    {/* Card */}
                    <div className="bg-[#F8F5F0] rounded-2xl shadow-sm p-6 flex flex-col items-center text-center">
                        <h3 className="font-ibarra font-bold text-[18px] text-[#DA1A32] mb-2">Practical Skills</h3>
                        <p className="font-inter text-[13px] text-gray-600">
                            Learn techniques you can apply instantly, from basic pastries to advanced desserts.
                        </p>
                    </div>

                    {/* Card */}
                    <div className="bg-[#F8F5F0] rounded-2xl shadow-sm p-6 flex flex-col items-center text-center">
                        <h3 className="font-ibarra font-bold text-[18px] text-[#DA1A32] mb-2">Community & Sharing</h3>
                        <p className="font-inter text-[13px] text-gray-600">
                            A place to connect, share your creations, and celebrate progress together.
                        </p>
                    </div>
                </div>
            </div>


            {/* Reviews */}
            <div className="mt-[62px] items-center text-black flex flex-col w-full bg-[#F8F5F0] pt-[36px] pb-[62px] relative">
                <div className="font-ibarra text-[32px] font-bold flex flex-row items-center gap-[8px]">
                    <div className="w-[16px] h-[1px] bg-[#DA1A32]" />
                    What our Student Say?
                    <div className="w-[16px] h-[1px] bg-[#DA1A32]" />
                </div>

                {/* Review Container */}
                <div className="mt-[38px] flex flex-row gap-[20px] max-w-screen">

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

                <button className="font-inter mt-[48px] cursor-pointer mx-auto bg-white px-[22px] py-[2px] border border-black rounded-full font-light hover:scale-105 transition-all duration-[600ms]">
                    View More
                </button>
            </div>

            {/* Call to Action Section */}
            <div className="mt-[48px] pb-[62px] w-full bg-white flex flex-col items-center text-black px-6">

                {/* Decorative Divider */}
                <div className="flex items-center justify-center gap-[8px] mb-[12px]">
                    <div className="w-[30px] h-[2px] bg-[#DA1A32]" />
                    <span className="font-ibarra text-[14px] text-[#DA1A32] uppercase tracking-widest">
                        Join Us Now
                    </span>
                    <div className="w-[30px] h-[2px] bg-[#DA1A32]" />
                </div>

                {/* Headline */}
                <h2 className="font-ibarra text-[32px] font-bold text-center mb-4">
                    Ready to Start Your Baking Journey?
                </h2>

                {/* Subtext */}
                <p className="font-inter text-[15px] text-gray-600 text-center max-w-[600px] mb-8">
                    Join De Pastry Lab today and learn step-by-step from expert pastry chefs.
                    Whether you're baking for fun or chasing your dream, we’ve got the right course for you.
                </p>

                {/* Buttons */}
                <div className="flex flex-row gap-[18px] mt-4">
                    {/* Main CTA */}
                    <a
                        href="/Register"
                        className="py-2 px-10 bg-[#DA1A32] text-white rounded-full font-medium hover:scale-105 transition-all duration-[600ms]"
                    >
                        Start Now
                    </a>

                    {/* Secondary CTA */}
                    <a
                        href="/Support"
                        className="py-2 px-10 border border-[#DA1A32] text-[#DA1A32] rounded-full font-medium hover:scale-105  transition-all duration-[600ms]"
                    >
                        Need Help?
                    </a>
                </div>

                <div className="mt-[48px] text-black flex flex-row justify-between w-[1090px] mx-auto">
                    <div className="w-full">
                        {/* Category container */}
                        <div className="grid grid-cols-3 gap-x-[20px] gap-y-[44px]">
                            {/* Category Card */}
                            <div className="w-[350px] flex flex-col items-center group cursor-pointer">
                                <img src="/images/L1.jpg" alt="Bread" className="w-full h-[237px] object-cover" />
                            </div>

                            {/* Category Card */}
                            <div className="w-[350px] flex flex-col items-center group cursor-pointer">
                                <img src="/images/L3.jpg" alt="Pastry" className="w-full h-[237px] object-cover" />
                            </div>

                            {/* Category Card */}
                            <div className="w-[350px] flex flex-col items-center group cursor-pointer">
                                <img src="/images/L2.jpg" alt="Cookie" className="w-full h-[237px] object-cover" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <footer className="mt-[80px] bg-[#F8F5F0] py-[60px] px-[80px] text-black">
                <div className="grid grid-cols-4 gap-[40px] max-w-[1200px] mx-auto">
                    {/* Brand */}
                    <div className="w-[300px]">
                        <h3 className="font-ibarra text-[20px] font-bold mb-3 text-[#DA1A32]">De Pastry Lab</h3>
                        <p className="font-inter text-[13px] text-gray-600 leading-relaxed max-w-[250px] text-justify">
                            Empowering everyone to discover the joy of baking, from simple pastries
                            to elegant desserts. Learn, practice, and connect with a community that shares your passion.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="ml-24">
                        <h4 className="font-ibarra font-bold text-[16px] mb-3">Quick Links</h4>
                        <ul className="space-y-2 text-[13px] text-gray-600">
                            <li><a href="/" className="hover:text-[#DA1A32]">Home</a></li>
                            <li><a href="/Courses" className="hover:text-[#DA1A32]">Courses</a></li>
                            <li><a href="/Community" className="hover:text-[#DA1A32]">Community</a></li>
                            <li><a href="/Achievements" className="hover:text-[#DA1A32]">Achievements</a></li>
                            <li><a href="/FAQ" className="hover:text-[#DA1A32]">FAQ</a></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div className="ml-16">
                        <h4 className="font-ibarra font-bold text-[16px] mb-3">Get Support</h4>
                        <ul className="space-y-2 text-[13px] text-gray-600">
                            <li><a href="/Support" className="hover:text-[#DA1A32]">Get Help</a></li>
                            <li><a href="/Contact" className="hover:text-[#DA1A32]">Contact Us</a></li>
                            <li><a href="/Terms" className="hover:text-[#DA1A32]">Terms and Conditions</a></li>
                            <li><a href="/Privacy" className="hover:text-[#DA1A32]">FAQs</a></li>
                        </ul>
                    </div>

                    {/* Social */}
                    <div className="ml-6">
                        <h4 className="font-ibarra font-bold text-[16px] mb-3">Stay Connected</h4>
                        <p className="text-[13px] text-gray-600 mb-3">
                            Join our baking community for the latest updates, new courses, and tips!
                        </p>
                        <div className="flex gap-3">
                            <a href="#" className="hover:text-[#DA1A32]"><i className="fa-brands fa-instagram"></i></a>
                            <a href="#" className="hover:text-[#DA1A32]"><i className="fa-brands fa-facebook"></i></a>
                            <a href="#" className="hover:text-[#DA1A32]"><i className="fa-brands fa-youtube"></i></a>
                        </div>
                    </div>
                </div>

                {/* Bottom Line */}
                <div className="mt-10 border-t border-gray-300 pt-4 text-center text-[12px] text-gray-500">
                    © {new Date().getFullYear()} De Pastry Lab. All rights reserved.
                </div>
            </footer>


        </RgUserLayout>
    );
};

export default RgUserHome;
