import { IoIosSearch } from "react-icons/io";
import RgUserLayout from "../components/RgUserLayout.tsx";
import { CiFilter } from "react-icons/ci";
import { TbArrowsSort } from "react-icons/tb";
import { FaStar } from "react-icons/fa";
import React, { useState, useEffect } from "react";
import { getUserCourses } from "../api/client.js";

interface Course {
    courseId: number;
    title: string;
    description: string;
    rating: number;
    courseImg: string;
    cookingTimeMin: number;
    servings: number;
    video: string;
    levelId: number;
    levelName: string;
    bookmark: boolean;
    quizStatus: string;
    quizProgress: number;
}

const RgUserCol = () => {
    const [active, setActive] = useState("Progressing");
    const [courses, setCourses] = useState<Course[]>([]);
    const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    const tabs = ["Progressing", "Completed", "Bookmarked"];

    // Fetch courses based on active tab
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                setLoading(true);
                const user = JSON.parse(localStorage.getItem('user') || '{}');
                
                if (!user?.userId) {
                    setError("User not logged in");
                    setLoading(false);
                    return;
                }

                let statusFilter: string | null = active.toLowerCase();
                if (statusFilter === "progressing") {
                    statusFilter = "progressing";
                } else if (statusFilter === "completed") {
                    statusFilter = "completed";
                } else if (statusFilter === "bookmarked") {
                    statusFilter = "bookmarked";
                }

                const data = await getUserCourses(user.userId, statusFilter || undefined);
                setCourses(data);
                setFilteredCourses(data);
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to fetch courses");
                console.error("Error fetching courses:", err);
                setCourses([]);
                setFilteredCourses([]);
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, [active]);

    // Handle search
    const handleSearch = (value: string) => {
        setSearchTerm(value);
        if (value.trim() === "") {
            setFilteredCourses(courses);
        } else {
            const filtered = courses.filter(course =>
                course.title.toLowerCase().includes(value.toLowerCase()) ||
                course.description.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredCourses(filtered);
        }
    };

    return (
        <RgUserLayout>
            <div className="max-w-screen overflow-x-hidden">
                <div className="w-full flex flex-col items-center">
                    <p className="font-ibarra font-bold text-black text-[36px] pt-[50px]">
                        My <span className="text-[#DA1A32]">Collections</span>
                    </p>
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

                    <div className="relative flex flex-row font-ibarra text-[22px] font-medium mb-[36px] gap-[16px] rounded-full bg-[#F8F5F0] p-2">
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

                    <div className="font-ibarra text-[24px] font-bold flex flex-row items-center gap-[8px] justify-between w-full">
                        <div className="flex items-center justify-between h-[48px] bg-white border border-black rounded-full pr-[4px] pl-[22px]">
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={(e) => handleSearch(e.target.value)}
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

                    {/* Loading State */}
                    {loading && (
                        <div className="mt-[50px] text-center">
                            <p className="text-black text-[18px] font-light">Loading courses...</p>
                        </div>
                    )}

                    {/* Error State */}
                    {error && (
                        <div className="mt-[50px] text-center">
                            <p className="text-red-500 text-[18px] font-light">Error: {error}</p>
                        </div>
                    )}

                    {/* No Results State */}
                    {!loading && !error && filteredCourses.length === 0 && (
                        <div className="mt-[50px] text-center">
                            <p className="text-black text-[18px] font-light">No courses found</p>
                        </div>
                    )}

                    {/* Courses Container */}
                    {!loading && !error && filteredCourses.length > 0 && (
                    <div className="mt-[32px] w-screen max-h-[512px] overflow-y-scroll no-scrollbar pb-[64px]">
                        <div className="grid grid-cols-4 gap-x-[14px] gap-y-[48px] w-[1090px] mx-auto">
                            {filteredCourses.map((course) => (
                                <div key={course.courseId} className="max-h-[297px] w-[262px] group cursor-pointer">
                                    <img src={course.courseImg || "/images/Recipe.jpeg"} alt={course.title} className="w-full h-[177px] object-cover" />

                                    {/* Review */}
                                    <div className="flex flex-row mt-[16px] items-center">
                                        <div className="flex gap-[4px]">
                                            {[...Array(5)].map((_, index) => {
                                                const fillPercentage = Math.min(Math.max(course.rating - index, 0), 1) * 100;

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
                                            {Math.round(course.rating)} reviews
                                        </div>
                                    </div>

                                    {/* Title */}
                                    <div className="font-ibarra text-[18px] font-bold mt-[12px] line-clamp-2 group-hover:text-[#DA1A32] transition-all duration-300">
                                        {course.title}
                                    </div>

                                    {/* Details */}
                                    <div className="flex gap-[14px] mt-[14px]">
                                        <div className="flex items-center">
                                            <img src="/images/Time.png" alt="time" className="w-[12px] h-[12px] object-cover" />
                                            <div className="font-inter ml-[4px] text-[#484848] text-[11px] font-light">
                                                {course.cookingTimeMin}
                                            </div>
                                            <div className="font-inter ml-[1px] text-[#484848] text-[11px] font-light">
                                                min
                                            </div>
                                        </div>

                                        <div className="h-[16px] w-[1.1px] bg-black" />

                                        <div className="flex items-center">
                                            <img src="/images/Profile.png" alt="servings" className="w-[11px] h-[11px] object-cover" />
                                            <div className="font-inter ml-[4px] text-[#484848] text-[11px] font-light">
                                                {course.servings}
                                            </div>
                                            <div className="font-inter ml-[1px] text-[#484848] text-[11px] font-light">
                                                servings
                                            </div>
                                        </div>

                                        <div className="h-[16px] w-[1.1px] bg-black" />

                                        <div className="flex items-center">
                                            <img src="/images/Level.png" alt="level" className="w-[14px] h-[14px] object-cover" />
                                            <div className="font-inter ml-[6px] text-[#484848] text-[11px] font-light">
                                                {course.levelName}
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            ))}
                        </div>
                    </div>
                    )}
                </div>
            </div>
        </RgUserLayout>
    );
};

export default RgUserCol;

