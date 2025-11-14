import { IoIosSearch } from "react-icons/io";
import RgUserLayout from "../components/RgUserLayout.tsx";
import VisitorLayout from "../components/VisitorLayout.tsx";
import { CiFilter } from "react-icons/ci";
import { TbArrowsSort } from "react-icons/tb";
import { FaStar } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { RxCross2 } from "react-icons/rx";

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
    averageRating: number;
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
    const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [showSortModal, setShowSortModal] = useState(false);

    // Filter states
    const [selectedLevels, setSelectedLevels] = useState<number[]>([]);

    // Sort state
    const [sortBy, setSortBy] = useState<string>("default");


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


    const navigate = useNavigate();

    // Handle search
    const handleSearch = (value: string) => {
        setSearchTerm(value);
        applyFiltersAndSort(courses, value);
    };

    // Get unique levels
    const getUniqueLevels = () => {
        const levels = new Map<number, Level>();
        courses.forEach(course => {
            if (course.level && !levels.has(course.level.levelId)) {
                levels.set(course.level.levelId, course.level);
            }
        });
        return Array.from(levels.values());
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
            result = result.filter(course => selectedLevels.includes(course.levelId));
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
                result.sort((a, b) => b.averageRating - a.averageRating);
                break;
            case "ratingLow":
                result.sort((a, b) => a.averageRating - b.averageRating);
                break;
            case "timeHigh":
                result.sort((a, b) => b.cookingTimeMin - a.cookingTimeMin);
                break;
            case "timeLow":
                result.sort((a, b) => a.cookingTimeMin - b.cookingTimeMin);
                break;
            default:
                // Keep original order
                break;
        }

        setFilteredCourses(result);
    };

    // Apply filters and sort whenever any filter changes or courses are updated
    useEffect(() => {
        applyFiltersAndSort(courses);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedLevels, sortBy, courses]);

    // Handle filter clear
    const handleClearFilters = () => {
        setSelectedLevels([]);
        setSortBy("default");
    };

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

                    {/* Courses Container */}
                    <div className="mt-[32px] w-screen max-h-[512px] overflow-y-scroll no-scrollbar pb-[64px]">
                        <div className="grid grid-cols-4 gap-x-[14px] gap-y-[48px] w-[1090px] mx-auto">
                            {filteredCourses.length === 0 ? (
                                <div className="col-span-4 flex justify-center items-center h-[200px]">
                                    <p className="text-[20px] font-ibarra text-gray-500">
                                        No courses available in this category.
                                    </p>
                                </div>
                            ) : (filteredCourses.map(course => (
                                <div key={course.courseId} className="max-h-[297px] w-[262px] group cursor-pointer"
                                    onClick={() => navigate(`/RgUserCourse/${course.courseId}`)}>
                                    <img src={course.courseImg} alt={course.title} className="w-full h-[177px] object-cover" />

                                    {/* Review */}
                                    <div className="flex flex-row mt-[16px] items-center">
                                        <div className="flex gap-[4px]">
                                            {[...Array(5)].map((_, index) => {
                                                const fillPercentage = Math.min(Math.max(course.averageRating - index, 0), 1) * 100;
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
                                        <label key={level.levelId} className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={selectedLevels.includes(level.levelId)}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setSelectedLevels([...selectedLevels, level.levelId]);
                                                    } else {
                                                        setSelectedLevels(selectedLevels.filter(id => id !== level.levelId));
                                                    }
                                                }}
                                                className="w-4 h-4 accent-[#DA1A32]"
                                            />
                                            <span className="font-inter text-[14px] text-gray-700">{level.title}</span>
                                        </label>
                                    ))}
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
                        <div className="bg-white rounded-2xl w-[400px] max-h-[500px] overflow-y-auto p-6 shadow-2xl">
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
                                        <span className="font-inter text-[14px] text-gray-700">Highest Rated</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="sort"
                                            checked={sortBy === "ratingLow"}
                                            onChange={() => setSortBy("ratingLow")}
                                            className="w-4 h-4 accent-[#DA1A32]"
                                        />
                                        <span className="font-inter text-[14px] text-gray-700">Lowest Rated</span>
                                    </label>
                                </div>

                                <div className="border-t pt-3 mt-2">
                                    <h3 className="font-inter text-[12px] font-bold text-gray-600 mb-2">Cooking Time</h3>
                                    <label className="flex items-center gap-2 cursor-pointer mb-2">
                                        <input
                                            type="radio"
                                            name="sort"
                                            checked={sortBy === "timeLow"}
                                            onChange={() => setSortBy("timeLow")}
                                            className="w-4 h-4 accent-[#DA1A32]"
                                        />
                                        <span className="font-inter text-[14px] text-gray-700">Quick First</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="sort"
                                            checked={sortBy === "timeHigh"}
                                            onChange={() => setSortBy("timeHigh")}
                                            className="w-4 h-4 accent-[#DA1A32]"
                                        />
                                        <span className="font-inter text-[14px] text-gray-700">Long First</span>
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
        </Layout>
    );
};

export default RgUserCat;
