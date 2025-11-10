import { IoIosArrowForward, IoMdHeart } from "react-icons/io";
import RgUserLayout from "../components/RgUserLayout.tsx";
import VisitorLayout from "../components/VisitorLayout.tsx";
import { CiBookmark } from "react-icons/ci";
import { FaStar } from "react-icons/fa";
import { IoAdd, IoBookmark } from "react-icons/io5";
import { useEffect, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { useNavigate, useParams } from "react-router-dom";

interface Course {
    courseId: number;
    title: string;
    description: string;
    courseImg: string;
    rating: number;
    reviews: number;
    cookingTimeMin: number;
    servings: number;
    levelId: number;
    level: Level;
    categoryId: number;
    category: Category;
}

interface Level {
    levelId: number;
    title: string;
}

interface Category {
    categoryId: number;
    title: string;
    catImg: string;
    catBanner: string;
    description: string;
    deleted: boolean;
}

const RgUserCourse = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const Layout = user?.userId ? RgUserLayout : VisitorLayout;

    const { id } = useParams<{ id: string }>(); // get courseId from URL
    const [course, setCourse] = useState<Course | null>(null);

    const navigate = useNavigate();

    useEffect(() => {
        if (!id) return;

        fetch(`/api/courses/${id}`) // fetch from your ASP.NET backend
            .then(res => {
                if (!res.ok) throw new Error("Network response was not ok");
                return res.json();
            })
            .then(data => setCourse(data))
            .catch(err => console.error("Error fetching course:", err));
    }, [id]);

    // Placeholder first
    const UserRegisteredCourse = false;
    const Saved = false;

    const TotalReviews = 3;

    function formatCookingTime(minutes: number) {
        if (minutes < 60) return `${minutes} mins`;
        const h = Math.floor(minutes / 60);
        const m = minutes % 60;
        return m === 0 ? `${h}h` : `${h}h ${m}m`;
    }

    const coursePrepItems = [
        { id: 1, type: "ingredient", title: "Unsalted butter", amount: 71, metric: "g", item_image: "/images/Recipe.jpeg", description: "Unsalted butter is butter that has no salt added to it. This product is solid at room temperature but melts at higher temperatures." },
        { id: 2, type: "ingredient", title: "Granulated sugar", amount: 149, metric: "g", item_image: "/images/Recipe.jpeg", description: "Sweet stuff that makes brownies sweet." },
        { id: 3, type: "ingredient", title: "Large egg", amount: 1, metric: "", item_image: "/images/Recipe.jpeg", description: "Binds ingredients together so brownies hold shape." },
        { id: 4, type: "ingredient", title: "Vanilla extract", amount: 1, metric: "teaspoon", item_image: "/images/Recipe.jpeg", description: "Gives a nice vanilla smell and taste." },
        { id: 5, type: "ingredient", title: "Unsweetened cocoa", amount: 6, metric: "tablespoon", item_image: "/images/Recipe.jpeg", description: "Makes brownies chocolatey." },
        { id: 6, type: "ingredient", title: "Espresso powder (optional)", amount: 0.25, metric: "teaspoon", item_image: "/images/Recipe.jpeg", description: "Optional tiny coffee taste to make chocolate stronger." },
        { id: 7, type: "ingredient", title: "All purpose flour", amount: 45, metric: "g", item_image: "/images/Recipe.jpeg", description: "Powder that gives structure to brownies." },
        { id: 8, type: "ingredient", title: "Table salt", amount: 0.25, metric: "teaspoon", item_image: "/images/Recipe.jpeg", description: "Tiny bit of salt to make sweetness taste better." },
        { id: 9, type: "ingredient", title: "Baking powder", amount: 0.0625, metric: "teaspoon", item_image: "/images/Recipe.jpeg", description: "Makes brownies puff up a little." },
        { id: 10, type: "ingredient", title: "Chocolate chips", amount: 0.0625, metric: "teaspoon", item_image: "/images/Recipe.jpeg", description: "Tiny chocolate pieces for extra chocolate in bites." },
        { id: 11, type: "tool", title: "Baking Pan (8.5 x 4.5) inch", amount: null, metric: null, item_image: "/images/Recipe.jpeg", description: "The pan used to bake the brownies. This size helps them cook evenly." },
        { id: 12, type: "tool", title: "Mixing Bowls", amount: null, metric: null, item_image: "/images/Recipe.jpeg", description: "Used to hold and mix all the ingredients." },
        { id: 13, type: "tool", title: "Whisk or Hand Mixer", amount: null, metric: null, item_image: "/images/Recipe.jpeg", description: "Helps blend ingredients smoothly with no lumps." },
        { id: 14, type: "tool", title: "Rubber Spatula", amount: null, metric: null, item_image: "/images/Recipe.jpeg", description: "Used to scrape batter from the bowl so nothing is wasted." },
        { id: 15, type: "tool", title: "Measuring Cups & Spoons", amount: null, metric: null, item_image: "/images/Recipe.jpeg", description: "Tools for measuring each ingredient accurately." },
        { id: 16, type: "tool", title: "Parchment Paper", amount: null, metric: null, item_image: "/images/Recipe.jpeg", description: "Prevents sticking and makes it easy to lift brownies from the pan." },
        { id: 17, type: "tool", title: "Digital Scale", amount: null, metric: null, item_image: "/images/Recipe.jpeg", description: "Measures ingredients by weight for more accurate baking." },

    ];



    const [popupItem, setPopupItem] = useState(null as null | typeof coursePrepItems[0]);

    function decimalToFraction(decimal: number): string {
        const tolerance = 1.0e-6; // for floating point precision
        let h1 = 1, h2 = 0, k1 = 0, k2 = 1;
        let b = decimal;
        do {
            const a = Math.floor(b);
            let aux = h1; h1 = a * h1 + h2; h2 = aux;
            aux = k1; k1 = a * k1 + k2; k2 = aux;
            b = 1 / (b - a);
        } while (Math.abs(decimal - h1 / k1) > decimal * tolerance);

        return k1 === 1 ? `${h1}` : `${h1}/${k1}`;
    }

    if (!course) {
        return (
            <Layout>
                <div className="flex justify-center items-center h-[400px]">
                    Loading course...
                </div>
            </Layout>
        );
    }

    return (
        <Layout>

            {/* Banner */}
            <div
                className="w-full h-[200px] relative bg-fixed bg-center bg-cover"
                style={{ backgroundImage: `url(${course.courseImg})` }}
            >
                {/* Overlay */}
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-[#000000]/40 to-[#000000]/0 z-10" />

                {/* Content */}
                <div className="absolute top-0 left-0 w-full h-full z-20">
                    <div className="relative w-[1090px] h-full mx-auto flex items-center">
                        <div className="font-ibarra text-[48px] max-w-[1000px] line-clamp-1 leading-tight font-bold text-white">
                            {course.title}
                        </div>

                        <div className="font-inter absolute bottom-[54px] left-[4px] text-[10px] max-w-[500px] leading-tight font-[200] text-white flex items-center gap-[2px]">
                            <button className="cursor-pointer uppercase hover:text-[#DA1A32] transition-all duration-[600ms]"
                                onClick={() => navigate(`/RgUserLearn`)}>
                                Learn
                            </button>
                            <IoIosArrowForward className="text-[#DA1A32] h-[18px]" />
                            <button className="cursor-pointer uppercase hover:text-[#DA1A32] transition-all duration-[600ms]"
                                onClick={() => navigate(`/RgUserCat/${course.categoryId}`)}>
                                {course.category?.title}
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

            <div className="mt-[44px] items-center text-black flex flex-col w-full mx-auto">
                {/* Course Details */}
                <div className="flex flex-row justify-between w-[1090px]">
                    <div className="flex flex-col">
                        {/* Review */}
                        <div className="flex flex-row gap-[16px]">
                            <img src="/images/Like.png" alt="like" className="w-[45px] h-[45px] object-cover" />

                            <div className="flex flex-col gap-[2px] justify-center translate-y-[-2px]">
                                {/* Review */}
                                <div className="font-inter text-[#484848] text-[14px] font-light">
                                    {TotalReviews} reviews
                                </div>

                                <div className="flex gap-[4px]">
                                    {[...Array(5)].map((_, index) => {
                                        const fillPercentage = Math.min(Math.max(5 - index, 0), 1) * 100;

                                        return (
                                            <div
                                                key={index}
                                                className="relative"
                                                style={{ width: `14px`, height: `14px` }}
                                            >

                                                <FaStar
                                                    className="absolute top-0 left-0 text-gray-300"
                                                    size="14px"
                                                />

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

                        {/* Description */}
                        <p className="max-w-[435px] mt-[24px] text-[14px] font-light leading-[1.5] text-justify line-clamp-8">
                            {course.description}
                        </p>


                        {/* Details */}
                        <div className="flex gap-[18px] mt-[32px] items-center h-[20px]">
                            <div className="flex items-center">
                                <img src="/images/Time.png" alt="recipe" className="w-[19px] h-[19px] object-cover translate-y-[-1px]" />
                                <div className="flex items-end">
                                    <div className="font-inter ml-[8px] text-[#484848] text-[16px] font-light">
                                        {formatCookingTime(course.cookingTimeMin)}
                                    </div>
                                </div>
                            </div>

                            <div className="h-[20px] w-[1.5px] bg-black" />

                            <div className="flex items-center">
                                <img src="/images/Profile.png" alt="recipe" className="w-[18px] h-[18px] object-cover" />
                                <div className="flex items-end">
                                    <div className="font-inter ml-[10px] text-[#484848] text-[16px] font-light">
                                        {course.servings} servings
                                    </div>
                                </div>
                            </div>

                            <div className="h-[20px] w-[1.5px] bg-black" />

                            <div className="flex items-center">
                                <img src="/images/Level.png" alt="recipe" className="w-[20px] h-[20px] object-cover" />
                                <div className="font-inter ml-[9px] text-[#484848] text-[16px] font-light">
                                    {course.level?.title}
                                </div>
                            </div>
                        </div>

                        <div className="bg-black w-[435px] mt-[26px] h-[1.5px]" />

                        {/* Action Buttons */}
                        {!user?.userId ? (
                            <div className="flex flex-row gap-[10px] mt-[20px]">
                                <button className="w-full h-[48px] flex justify-center items-center text-[16px] bg-[#DA1A32] rounded-full text-white cursor-pointer hover:scale-105 transition-all duration-[600ms]">
                                    Register now to start course
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-row gap-[10px] mt-[20px]">
                                {!UserRegisteredCourse ? (
                                    <button className="w-[265px] h-[48px] flex justify-center items-center text-[16px] bg-[#DA1A32] rounded-full text-white cursor-pointer hover:scale-105 transition-all duration-[600ms]">
                                        Start Now
                                    </button>
                                ) : (
                                    <button className="w-[265px] h-[48px] flex justify-center items-center text-[16px] bg-[#DA1A32] rounded-full text-white cursor-pointer hover:scale-105 transition-all duration-[600ms]">
                                        Remove Course
                                    </button>
                                )}

                                {!Saved ? (
                                    <button className="w-[160px] flex items-center justify-between h-[48px] bg-white border border-black rounded-full pr-[4px] pl-[22px] cursor-pointer hover:scale-105 transition-all duration-[600ms]">
                                        <div className="font-inter text-[16px] font-light ml-[10px]">
                                            Save
                                        </div>
                                        <div className="w-[38px] h-[38px] bg-[#DA1A32] flex items-center justify-center rounded-full text-white text-[12px] ml-[20px]">
                                            <CiBookmark className="text-white w-[20px] h-[20px]" />
                                        </div>
                                    </button>
                                ) : (
                                    <button className="w-[160px] flex items-center justify-between h-[48px] bg-white border border-black rounded-full pr-[4px] pl-[22px] cursor-pointer hover:scale-105 transition-all duration-[600ms]">
                                        <div className="font-inter text-[16px] font-light ml-[10px]">
                                            Saved
                                        </div>
                                        <div className="w-[38px] h-[38px] bg-[#DA1A32] flex items-center justify-center rounded-full text-white text-[12px] ml-[20px]">
                                            <IoBookmark className="text-white w-[20px] h-[20px]" />
                                        </div>
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    {!UserRegisteredCourse ? (
                        <img src={course.courseImg} alt="recipe" className="w-[546px] h-[370px] object-cover" />
                    ) : (
                        <div className="w-[503px] flex flex-col gap-[16px]">
                            <button className="w-full h-[100px] border border-[#B9A9A1] bg-[#F8F5F0] flex items-center px-[36px] rounded-[10px] cursor-pointer hover:scale-[104%] transition-all duration-[600ms] group">
                                <div className="font-ibarra text-[24px] font-bold text-black group-hover:text-[#DA1A32] transition-all duration-[600ms]">
                                    Step-by-Step Guide
                                </div>
                            </button>
                            <button className="w-full h-[100px] border border-[#B9A9A1] bg-[#F8F5F0] flex items-center px-[36px] rounded-[10px] cursor-pointer hover:scale-[104%] transition-all duration-[600ms] group">
                                <div className="font-ibarra text-[24px] font-bold text-black flex-3 flex justify-start group-hover:text-[#DA1A32] transition-all duration-[600ms]">
                                    Practice Quiz
                                </div>
                                <div className="font-ibarra text-[18px] font-bold text-[#DA1A32] ml-24">
                                    80%
                                </div>
                                <div className="font-ibarra text-[18px] font-bold text-[#DA1A32] ml-20">
                                    1:30
                                    <span className="text-[16px]">min</span>
                                </div>
                            </button>
                            <button className="w-full h-[100px] border border-[#B9A9A1] bg-[#F8F5F0] flex items-center px-[36px] rounded-[10px] cursor-pointer hover:scale-[104%] transition-all duration-[600ms] group">
                                <div className="font-ibarra text-[24px] font-bold text-black flex-2 flex justify-start group-hover:text-[#DA1A32] transition-all duration-[600ms]">
                                    Download Recipe as PDF
                                </div>
                            </button>
                        </div>
                    )}
                </div>

                {/* Popup Modal */}
                {popupItem && (
                    <div className="fixed inset-0 flex items-center justify-center z-50">
                        <div className="absolute w-full h-full bg-black bg-opacity-50"
                            onClick={() => setPopupItem(null)} />
                        <div className="bg-white pt-2 px-2 rounded-2xl w-[300px] relative ">
                            <button className="absolute top-3 right-3 text-white">
                                <div className="rounded-full p-[2px] bg-black/50">
                                    <RxCross2 size={20} onClick={() => setPopupItem(null)} className="cursor-pointer hover:text-[#eb5757] active:text-[#bf4b4b] transition-all duration-[400ms]" />
                                </div>
                            </button>
                            <img
                                src={popupItem.item_image}
                                alt={popupItem.title}
                                className="w-full h-[200px] object-cover rounded-xl mb-2"
                            />
                            <div className="px-[8px] pb-[24px]">
                                <h3 className="font-ibarra mt-[18px] line-clamp-3 text-[20px] font-bold leading-tight mb-2">{popupItem.title}</h3>
                                <p className="font-inter text-[12px] font-light text-justify">{popupItem.description}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Ingredient and Tools */}
                <div className="mt-[88px] flex flex-row justify-between w-[1090px]">
                    <div className="w-[480px] flex flex-col items-center">
                        <div className="font-ibarra text-[32px] font-bold flex flex-row items-center gap-[8px] text-black">
                            <div className="w-[16px] h-[1px] bg-[#DA1A32]" />
                            Ingredients
                            <div className="w-[16px] h-[1px] bg-[#DA1A32]" />
                        </div>

                        <ul className="flex flex-col mt-[32px] gap-[16px] w-full">
                            {coursePrepItems
                                .filter(item => item.type === "ingredient")
                                .map(item => {
                                    // Convert small amounts <1 to fractions
                                    const amountDisplay =
                                        item.type === "ingredient" &&
                                            typeof item.amount === "number" &&
                                            item.amount < 1 &&
                                            item.amount > 0
                                            ? decimalToFraction(item.amount)
                                            : item.amount;

                                    return (
                                        <li key={item.id} className="w-full justify-between items-center flex flex-row">
                                            <div className="items-center flex flex-row gap-[12px] ">
                                                <div className="w-[12px] h-[1.5px] bg-[#DA1A32]" />
                                                <div className="text-[14px] font-light text-black">
                                                    {item.title} - {amountDisplay} {item.metric}
                                                </div>
                                            </div>

                                            <button
                                                className="text-[#DA1A32] underline text-[14px]"
                                                onClick={() => setPopupItem(item)}
                                            >
                                                Learn More
                                            </button>
                                        </li>
                                    );
                                })
                            }
                        </ul>
                    </div>

                    <div className="w-[480px] flex flex-col items-center px-[40px]">
                        <div className="font-ibarra text-[32px] font-bold flex flex-row items-center gap-[8px] text-black">
                            <div className="w-[16px] h-[1px] bg-[#DA1A32]" />
                            Tools
                            <div className="w-[16px] h-[1px] bg-[#DA1A32]" />
                        </div>


                        <ul className="flex flex-col mt-[32px] gap-[16px] w-full">
                            {coursePrepItems
                                .filter(item => item.type === "tool")
                                .map(item => {

                                    return (
                                        <li key={item.id} className="w-full justify-between items-center flex flex-row">
                                            <div className="items-center flex flex-row gap-[12px] ">
                                                <div className="w-[12px] h-[1.5px] bg-[#DA1A32]" />
                                                <div className="text-[14px] font-light text-black">
                                                    {item.title}
                                                </div>
                                            </div>

                                            <button
                                                className="text-[#DA1A32] underline text-[14px]"
                                                onClick={() => setPopupItem(item)}
                                            >
                                                Learn More
                                            </button>
                                        </li>
                                    );
                                })
                            }
                        </ul>
                    </div>
                </div>

                {/* Posts */}
                <div className="mt-[88px] items-center text-black flex flex-col w-[1090px] relative">
                    <div className="font-ibarra text-[32px] font-bold flex flex-row items-center gap-[8px]">
                        <div className="w-[16px] h-[1px] bg-[#DA1A32]" />
                        Posts
                        <div className="w-[16px] h-[1px] bg-[#DA1A32]" />
                    </div>

                    {UserRegisteredCourse && (
                        <button className="flex items-center justify-between h-[40px] bg-white border border-black rounded-full pr-[4px] pl-[22px] cursor-pointer hover:scale-105 transition-all duration-[600ms] absolute top-0 right-0">
                            <div className="font-inter text-[16px] font-light text-black">
                                Post
                            </div>
                            <div className="w-[30px] h-[30px] bg-[#DA1A32] flex items-center justify-center rounded-full text-white text-[12px] ml-[20px]">
                                <IoAdd className="text-white w-[32px] h-[32px]" />
                            </div>
                        </button>
                    )}

                    {/* Post Container */}
                    <div className="mt-[32px] flex flex-row gap-[20px] max-w-screen">

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

                    <button className="font-inter mt-[48px] cursor-pointer mx-auto bg-white px-[22px] py-[2px] border border-black rounded-full font-light hover:scale-105 transition-all duration-[600ms]">
                        View More
                    </button>
                </div>

                {/* Reviews */}
                <div className="mt-[62px] items-center text-black flex flex-col w-full bg-[#F8F5F0] pt-[36px] pb-[62px] relative">
                    <div className="font-ibarra text-[32px] font-bold flex flex-row items-center gap-[8px]">
                        <div className="w-[16px] h-[1px] bg-[#DA1A32]" />
                        Reviews
                        <div className="w-[16px] h-[1px] bg-[#DA1A32]" />
                    </div>

                    {UserRegisteredCourse && (
                        <button className="flex items-center justify-between h-[40px] bg-white border border-black rounded-full pr-[4px] pl-[22px] cursor-pointer hover:scale-105 transition-all duration-[600ms] absolute top-[34px] right-[223px]">
                            <div className="font-inter text-[16px] font-light text-black">
                                Review
                            </div>
                            <div className="w-[30px] h-[30px] bg-[#DA1A32] flex items-center justify-center rounded-full text-white text-[12px] ml-[20px]">
                                <IoAdd className="text-white w-[32px] h-[32px]" />
                            </div>
                        </button>
                    )}

                    {/* Review Container */}
                    <div className="mt-[32px] flex flex-row gap-[20px] max-w-screen">

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
            </div>
        </Layout>
    );
};

export default RgUserCourse;
