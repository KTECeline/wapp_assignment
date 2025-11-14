import { IoIosSearch } from "react-icons/io";
import RgUserLayout from "../components/RgUserLayout.tsx";
import { CiFilter } from "react-icons/ci";
import { TbArrowsSort } from "react-icons/tb";
import { FaStar } from "react-icons/fa";
import React, { useState, useEffect } from "react";
import { getUserCourses } from "../api/client.js";
import { RxCross2 } from "react-icons/rx";
import { useNavigate } from "react-router-dom";

interface Course {
    courseId: number;
    title: string;
    description: string;
    rating: number;
    averageRating: number;
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
    const navigate = useNavigate();
    const [active, setActive] = useState("Progressing");
    const [courses, setCourses] = useState<Course[]>([]);
    const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [showSortModal, setShowSortModal] = useState(false);

    // Filter states
    const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
    const [ratingFilter, setRatingFilter] = useState<number | null>(null);
    const [minCookingTime, setMinCookingTime] = useState<number>(0);
    const [maxCookingTime, setMaxCookingTime] = useState<number | null>(null);

    // Sort state
    const [sortBy, setSortBy] = useState<string>("default");

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

                // Fetch average ratings for all courses
                const withAverageRatings = await Promise.all(
                    data.map(async (course: Course) => {
                        try {
                            // Fetch average rating
                            const avgRes = await fetch(`/api/UserFeedbacks/average/${course.courseId}`);
                            const avgText = await avgRes.text();
                            const averageRating = avgText ? parseFloat(avgText) : 0.0;

                            return {
                                ...course,
                                averageRating: averageRating
                            };
                        } catch (err) {
                            console.error(`Error fetching average rating for course ${course.courseId}:`, err);
                            return { ...course, averageRating: 0.0 };
                        }
                    })
                );

                setCourses(withAverageRatings);
                setFilteredCourses(withAverageRatings);
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
        applyFiltersAndSort(courses, value);
    };

    // Get unique levels from courses
    const getUniqueLevels = () => {
        const levels = new Set(courses.map(course => course.levelName));
        return Array.from(levels)
            .filter(level => level)
            .sort((a, b) => {
                // Extract numeric part if it exists (e.g., "Level 1" -> 1)
                const numA = parseInt(a.match(/\d+/)?.[0] || "0");
                const numB = parseInt(b.match(/\d+/)?.[0] || "0");
                return numA - numB;
            });
    };

    // Apply filters and sort
    const applyFiltersAndSort = (sourceCourses: Course[], search: string = searchTerm) => {
        let result = [...sourceCourses];

        // Apply search filter
        if (search.trim() !== "") {
            result = result.filter(course =>
                course.title.toLowerCase().includes(search.toLowerCase()) ||
                course.description.toLowerCase().includes(search.toLowerCase())
            );
        }

        // Apply level filter
        if (selectedLevels.length > 0) {
            result = result.filter(course => selectedLevels.includes(course.levelName));
        }

        // Apply rating filter
        if (ratingFilter !== null) {
            result = result.filter(course => Math.floor(course.rating) >= ratingFilter);
        }

        // Apply cooking time filter
        if (maxCookingTime !== null) {
            result = result.filter(course =>
                course.cookingTimeMin >= minCookingTime && course.cookingTimeMin <= maxCookingTime
            );
        }

        // Apply sorting
        switch (sortBy) {
            case "titleAsc":
                result.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case "titleDesc":
                result.sort((a, b) => b.title.localeCompare(a.title));
                break;
            case "ratingHigh":
                result.sort((a, b) => b.rating - a.rating);
                break;
            case "ratingLow":
                result.sort((a, b) => a.rating - b.rating);
                break;
            case "timeShort":
                result.sort((a, b) => a.cookingTimeMin - b.cookingTimeMin);
                break;
            case "timeLong":
                result.sort((a, b) => b.cookingTimeMin - a.cookingTimeMin);
                break;
            case "servingsAsc":
                result.sort((a, b) => a.servings - b.servings);
                break;
            case "servingsDesc":
                result.sort((a, b) => b.servings - a.servings);
                break;
            default:
                // Keep original order
                break;
        }

        setFilteredCourses(result);
    };

    // Apply filters and sort whenever any filter changes
    useEffect(() => {
        applyFiltersAndSort(courses, searchTerm);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedLevels, ratingFilter, minCookingTime, maxCookingTime, sortBy, searchTerm, courses]);

    // Handle filter modal
    const handleClearFilters = () => {
        setSelectedLevels([]);
        setRatingFilter(null);
        setMinCookingTime(0);
        setMaxCookingTime(null);
        setSortBy("default");
    };

    function formatCookingTime(minutes: number) {
        if (minutes < 60) return `${minutes} mins`;
        const h = Math.floor(minutes / 60);
        const m = minutes % 60;
        return m === 0 ? `${h}h` : `${h}h ${m}m`;
    }

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
                            <button
                                onClick={() => setShowFilterModal(true)}
                                className="flex items-center justify-between h-[48px] bg-white border border-black rounded-full pr-[4px] pl-[22px] cursor-pointer hover:scale-105 transition-all duration-[600ms]">
                                <div className="font-inter text-[16px] font-light">
                                    Filter
                                </div>
                                <div className="w-[38px] h-[38px] bg-[#DA1A32] flex items-center justify-center rounded-full text-white text-[12px] ml-[20px]">
                                    <CiFilter className="text-white w-[20px] h-[20px]" />
                                </div>
                            </button>

                            <button
                                onClick={() => setShowSortModal(true)}
                                className="flex items-center justify-between h-[48px] bg-white border border-black rounded-full pr-[4px] pl-[22px] cursor-pointer hover:scale-105 transition-all duration-[600ms]">
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
                                    <div key={course.courseId} className="max-h-[297px] w-[262px] group cursor-pointer" onClick={() => navigate(`/RgUserCourse/${course.courseId}`)}>
                                        <img src={course.courseImg || "/images/Recipe.jpeg"} alt={course.title} className="w-full h-[177px] object-cover" />

                                        {/* Review */}
                                        <div className="flex flex-row mt-[16px] items-center">
                                            <div className="flex gap-[4px]">
                                                {[...Array(5)].map((_, index) => {
                                                    const fillPercentage = Math.min(Math.max(course.averageRating - index, 0), 1) * 100;

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
                                                {course.averageRating > 0 ? course.averageRating.toFixed(1) : '0.0'} rating
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
                                                    {formatCookingTime(course.cookingTimeMin)}
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

                    {/* Filter Modal */}
                    {showFilterModal && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <div className="bg-white rounded-2xl w-[400px] max-h-[600px] overflow-y-auto p-6 shadow-2xl">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="font-ibarra text-[24px] font-bold text-black">Filters</h2>
                                    <button
                                        onClick={() => setShowFilterModal(false)}
                                        className="text-gray-500 hover:text-black transition-all"
                                    >
                                        <RxCross2 size={24} />
                                    </button>
                                </div>

                                {/* Level Filter */}
                                <div className="mb-6">
                                    <h3 className="font-ibarra text-[16px] font-bold text-black mb-3">Level</h3>
                                    <div className="flex flex-col gap-2">
                                        {getUniqueLevels().map((level) => (
                                            <label key={level} className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedLevels.includes(level)}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setSelectedLevels([...selectedLevels, level]);
                                                        } else {
                                                            setSelectedLevels(selectedLevels.filter(l => l !== level));
                                                        }
                                                    }}
                                                    className="w-4 h-4 accent-[#DA1A32]"
                                                />
                                                <span className="font-inter text-[14px] text-gray-700">{level}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Rating Filter */}
                                <div className="mb-6">
                                    <h3 className="font-ibarra text-[16px] font-bold text-black mb-3">Minimum Rating</h3>
                                    <div className="flex flex-col gap-2">
                                        {[null, 1, 2, 3, 4, 5].map((rating) => (
                                            <label key={rating === null ? "all" : rating} className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="rating"
                                                    checked={ratingFilter === rating}
                                                    onChange={() => setRatingFilter(rating)}
                                                    className="w-4 h-4 accent-[#DA1A32]"
                                                />
                                                <span className="font-inter text-[14px] text-gray-700">
                                                    {rating === null ? "All Ratings" : `${rating}+ Stars`}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Cooking Time Filter */}
                                <div className="mb-6">
                                    <h3 className="font-ibarra text-[16px] font-bold text-black mb-3">Maximum Cooking Time</h3>
                                    <div className="grid grid-cols-3 gap-2">
                                        <button
                                            onClick={() => setMaxCookingTime(30)}
                                            className={`px-3 py-2 rounded-lg font-inter text-[13px] transition-all ${maxCookingTime === 30
                                                    ? "bg-[#DA1A32] text-white"
                                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                                }`}
                                        >
                                            &lt; 30 mins
                                        </button>
                                        <button
                                            onClick={() => setMaxCookingTime(60)}
                                            className={`px-3 py-2 rounded-lg font-inter text-[13px] transition-all ${maxCookingTime === 60
                                                    ? "bg-[#DA1A32] text-white"
                                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                                }`}
                                        >
                                            1 hour
                                        </button>
                                        <button
                                            onClick={() => setMaxCookingTime(120)}
                                            className={`px-3 py-2 rounded-lg font-inter text-[13px] transition-all ${maxCookingTime === 120
                                                    ? "bg-[#DA1A32] text-white"
                                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                                }`}
                                        >
                                            2 hours
                                        </button>
                                        <button
                                            onClick={() => setMaxCookingTime(180)}
                                            className={`px-3 py-2 rounded-lg font-inter text-[13px] transition-all ${maxCookingTime === 180
                                                    ? "bg-[#DA1A32] text-white"
                                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                                }`}
                                        >
                                            3 hours
                                        </button>
                                        <button
                                            onClick={() => setMaxCookingTime(240)}
                                            className={`px-3 py-2 rounded-lg font-inter text-[13px] transition-all ${maxCookingTime === 240
                                                    ? "bg-[#DA1A32] text-white"
                                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                                }`}
                                        >
                                            4 hours
                                        </button>
                                        <button
                                            onClick={() => setMaxCookingTime(999999)}
                                            className={`px-3 py-2 rounded-lg font-inter text-[13px] transition-all ${maxCookingTime === 999999
                                                    ? "bg-[#DA1A32] text-white"
                                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                                }`}
                                        >
                                            4+ hours
                                        </button>
                                    </div>
                                </div>

                                {/* Filter Actions */}
                                <div className="flex gap-3 pt-4 border-t">
                                    <button
                                        onClick={handleClearFilters}
                                        className="flex-1 px-4 py-2 bg-gray-200 text-black rounded-full font-inter text-[14px] hover:bg-gray-300 transition-all"
                                    >
                                        Clear All
                                    </button>
                                    <button
                                        onClick={() => setShowFilterModal(false)}
                                        className="flex-1 px-4 py-2 bg-[#DA1A32] text-white rounded-full font-inter text-[14px] hover:bg-[#b91728] transition-all"
                                    >
                                        Apply
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Sort Modal */}
                    {showSortModal && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <div className="bg-white rounded-2xl w-[400px] max-h-[400px] overflow-y-auto p-6 shadow-2xl">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="font-ibarra text-[24px] font-bold text-black">Sort By</h2>
                                    <button
                                        onClick={() => setShowSortModal(false)}
                                        className="text-gray-500 hover:text-black transition-all"
                                    >
                                        <RxCross2 size={24} />
                                    </button>
                                </div>

                                <div className="flex flex-col gap-3">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="sort"
                                            checked={sortBy === "default"}
                                            onChange={() => setSortBy("default")}
                                            className="w-4 h-4 accent-[#DA1A32]"
                                        />
                                        <span className="font-inter text-[14px] text-gray-700">Default</span>
                                    </label>

                                    <div className="border-t pt-3 mt-2">
                                        <h3 className="font-inter text-[12px] font-bold text-gray-600 mb-2">Title</h3>
                                        <label className="flex items-center gap-2 cursor-pointer mb-2">
                                            <input
                                                type="radio"
                                                name="sort"
                                                checked={sortBy === "titleAsc"}
                                                onChange={() => setSortBy("titleAsc")}
                                                className="w-4 h-4 accent-[#DA1A32]"
                                            />
                                            <span className="font-inter text-[14px] text-gray-700">A to Z</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="sort"
                                                checked={sortBy === "titleDesc"}
                                                onChange={() => setSortBy("titleDesc")}
                                                className="w-4 h-4 accent-[#DA1A32]"
                                            />
                                            <span className="font-inter text-[14px] text-gray-700">Z to A</span>
                                        </label>
                                    </div>

                                    <div className="border-t pt-3 mt-2">
                                        <h3 className="font-inter text-[12px] font-bold text-gray-600 mb-2">Rating</h3>
                                        <label className="flex items-center gap-2 cursor-pointer mb-2">
                                            <input
                                                type="radio"
                                                name="sort"
                                                checked={sortBy === "ratingHigh"}
                                                onChange={() => setSortBy("ratingHigh")}
                                                className="w-4 h-4 accent-[#DA1A32]"
                                            />
                                            <span className="font-inter text-[14px] text-gray-700">Highest First</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="sort"
                                                checked={sortBy === "ratingLow"}
                                                onChange={() => setSortBy("ratingLow")}
                                                className="w-4 h-4 accent-[#DA1A32]"
                                            />
                                            <span className="font-inter text-[14px] text-gray-700">Lowest First</span>
                                        </label>
                                    </div>

                                    <div className="border-t pt-3 mt-2">
                                        <h3 className="font-inter text-[12px] font-bold text-gray-600 mb-2">Cooking Time</h3>
                                        <label className="flex items-center gap-2 cursor-pointer mb-2">
                                            <input
                                                type="radio"
                                                name="sort"
                                                checked={sortBy === "timeShort"}
                                                onChange={() => setSortBy("timeShort")}
                                                className="w-4 h-4 accent-[#DA1A32]"
                                            />
                                            <span className="font-inter text-[14px] text-gray-700">Shortest First</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="sort"
                                                checked={sortBy === "timeLong"}
                                                onChange={() => setSortBy("timeLong")}
                                                className="w-4 h-4 accent-[#DA1A32]"
                                            />
                                            <span className="font-inter text-[14px] text-gray-700">Longest First</span>
                                        </label>
                                    </div>

                                    <div className="border-t pt-3 mt-2">
                                        <h3 className="font-inter text-[12px] font-bold text-gray-600 mb-2">Servings</h3>
                                        <label className="flex items-center gap-2 cursor-pointer mb-2">
                                            <input
                                                type="radio"
                                                name="sort"
                                                checked={sortBy === "servingsAsc"}
                                                onChange={() => setSortBy("servingsAsc")}
                                                className="w-4 h-4 accent-[#DA1A32]"
                                            />
                                            <span className="font-inter text-[14px] text-gray-700">Low to High</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="sort"
                                                checked={sortBy === "servingsDesc"}
                                                onChange={() => setSortBy("servingsDesc")}
                                                className="w-4 h-4 accent-[#DA1A32]"
                                            />
                                            <span className="font-inter text-[14px] text-gray-700">High to Low</span>
                                        </label>
                                    </div>
                                </div>

                                {/* Sort Actions */}
                                <div className="flex gap-3 pt-4 border-t mt-4">
                                    <button
                                        onClick={() => setSortBy("default")}
                                        className="flex-1 px-4 py-2 bg-gray-200 text-black rounded-full font-inter text-[14px] hover:bg-gray-300 transition-all"
                                    >
                                        Reset
                                    </button>
                                    <button
                                        onClick={() => setShowSortModal(false)}
                                        className="flex-1 px-4 py-2 bg-[#DA1A32] text-white rounded-full font-inter text-[14px] hover:bg-[#b91728] transition-all"
                                    >
                                        Apply
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </RgUserLayout>
    );
};

export default RgUserCol;

