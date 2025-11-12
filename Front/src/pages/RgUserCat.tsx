import { IoIosSearch } from "react-icons/io";
import RgUserLayout from "../components/RgUserLayout.tsx";
import VisitorLayout from "../components/VisitorLayout.tsx";
import { CiFilter } from "react-icons/ci";
import { TbArrowsSort } from "react-icons/tb";
import { FaStar } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Category {
    categoryId: number;
    title: string;
    catImg: string;
    catBanner: string;
    description: string;
    deleted: boolean;
}

interface Level {
    levelId: number;
    title: string;
}

interface Course {
    courseId: number;
    title: string;
    description: string;
    courseImg: string;
    rating: number;
    totalReviews: number;
    cookingTimeMin: number;
    servings: number;
    levelId: number;
    level: Level;
    categoryId: number;
}


const RgUserCat = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const Layout = user?.userId ? RgUserLayout : VisitorLayout;

    const { id } = useParams<{ id: string }>(); // get categoryId from URL
    const [category, setCategory] = useState<Category | null>(null);
    const [courses, setCourses] = useState<Course[]>([]);


    useEffect(() => {
        if (!id) return;

        fetch(`/api/categories/${id}`) // fetch from your ASP.NET backend
            .then(res => {
                if (!res.ok) throw new Error("Network response was not ok");
                return res.json();
            })
            .then(data => setCategory(data))
            .catch(err => console.error("Error fetching category:", err));
    }, [id]);

    // Later in useEffect, you can fetch from API
    useEffect(() => {
        if (!id) return;

        fetch('/api/courses')
            .then(res => res.json())
            .then(async (data) => {
                // Filter courses by category
                const filtered = data.filter((c: Course) => c.categoryId === Number(id));

                // Fetch only the totalReviews for each course
                const withReviews = await Promise.all(
                    filtered.map(async (course: Course) => {
                        try {
                            const res = await fetch(`/api/UserFeedbacks/course/${course.courseId}`);
                            const feedbackData = await res.json();
                            return {
                                ...course,
                                totalReviews: feedbackData.totalReviews || 0
                            };
                        } catch (err) {
                            console.error(`Error fetching reviews for course ${course.courseId}:`, err);
                            return { ...course, totalReviews: 0 };
                        }
                    })
                );

                setCourses(withReviews);
            })
            .catch(err => console.error("Error fetching courses:", err));
    }, [id]);


    const navigate = useNavigate();

    if (!category) {
        return (
            <Layout>
                <div className="flex justify-center items-center h-[400px]">
                    Loading category...
                </div>
            </Layout>
        );
    }

    function formatCookingTime(minutes: number) {
        if (minutes < 60) return `${minutes} mins`;
        const h = Math.floor(minutes / 60);
        const m = minutes % 60;
        return m === 0 ? `${h}h` : `${h}h ${m}m`;
    }

    return (
        <Layout>
            <div className="max-w-screen overflow-x-hidden">
                {/* Banner */}
                <div
                    className="w-full h-[200px] relative bg-fixed bg-center bg-cover"
                    style={{ backgroundImage: `url(${category.catBanner})` }}
                >
                    {/* Overlay */}
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-[#000000]/40 to-[#000000]/0 z-10" />

                    {/* Content */}
                    <div className="absolute top-0 left-0 w-full h-full z-20">
                        <div className="relative w-[1090px] h-full mx-auto flex items-center">
                            <div className="font-ibarra text-[48px] max-w-[500px] leading-tight font-bold text-white">
                                {category.title}
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
                    <div className="mt-[32px] w-screen max-h-[512px] overflow-y-scroll no-scrollbar pb-[64px]">
                        <div className="grid grid-cols-4 gap-x-[14px] gap-y-[48px] w-[1090px] mx-auto">
                            {courses.length === 0 ? (
                                <div className="col-span-4 flex justify-center items-center h-[200px]">
                                    <p className="text-[20px] font-ibarra text-gray-500">
                                        No courses available in this category.
                                    </p>
                                </div>
                            ) : (courses.map(course => (
                                <div key={course.courseId} className="max-h-[297px] w-[262px] group cursor-pointer"
                                    onClick={() => navigate(`/RgUserCourse/${course.courseId}`)}>
                                    <img src={course.courseImg} alt={course.title} className="w-full h-[177px] object-cover" />

                                    {/* Review */}
                                    <div className="flex flex-row mt-[16px] items-center">
                                        <div className="flex gap-[4px]">
                                            {[...Array(5)].map((_, index) => {
                                                const fillPercentage = Math.min(Math.max(course.rating - index, 0), 1) * 100;
                                                return (
                                                    <div key={index} className="relative" style={{ width: "18px", height: "18px" }}>
                                                        <FaStar className="absolute top-0 left-0 text-gray-300" size="18px" />
                                                        <div className="absolute top-0 left-0 overflow-hidden" style={{ width: `${fillPercentage}%`, height: "100%" }}>
                                                            <FaStar className="text-[#DA1A32]" size="18px" />
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        <div className="font-inter ml-[8px] text-[#484848] text-[12px]">{course.totalReviews} {course.totalReviews === 1 ? "review" : "reviews"}</div>
                                    </div>

                                    {/* Title */}
                                    <div className="font-ibarra text-[18px] font-bold mt-[12px] line-clamp-2 group-hover:text-[#DA1A32] transition-all duration-300">
                                        {course.title}
                                    </div>

                                    {/* Details */}
                                    <div className="flex gap-[14px] mt-[14px]">
                                        <div className="flex items-center">
                                            <img src="/images/Time.png" alt="time" className="w-[12px] h-[12px] object-cover" />
                                            <div className="font-inter ml-[4px] text-[#484848] text-[11px] font-light">{formatCookingTime(course.cookingTimeMin)}</div>
                                        </div>

                                        <div className="h-[16px] w-[1.1px] bg-black" />

                                        <div className="flex items-center">
                                            <img src="/images/Profile.png" alt="servings" className="w-[11px] h-[11px] object-cover" />
                                            <div className="font-inter ml-[4px] text-[#484848] text-[11px] font-light">{course.servings}</div>
                                            <div className="font-inter ml-[1px] text-[#484848] text-[11px] font-light">servings</div>
                                        </div>

                                        <div className="h-[16px] w-[1.1px] bg-black" />

                                        <div className="flex items-center">
                                            <img src="/images/Level.png" alt="level" className="w-[14px] h-[14px] object-cover" />
                                            <div className="font-inter ml-[6px] text-[#484848] text-[11px] font-light">{course.level?.title}</div>
                                        </div>
                                    </div>
                                </div>
                            ))
                            )}
                        </div>

                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default RgUserCat;
