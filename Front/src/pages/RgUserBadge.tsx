import { IoIosSearch } from "react-icons/io";
import RgUserLayout from "../components/RgUserLayout.tsx";
import { useState, useEffect } from "react";
import { getUserCourses } from "../api/client.js";

interface Badge {
    badgeId?: number;
    courseId?: number;
    title: string;
    description?: string;
    badgeImg: string;
    type: "course" | "quiz";
    isEarned: boolean;
    courseName?: string;
}

const RgUserBadge = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    const [badges, setBadges] = useState<Badge[]>([]);
    const [filteredBadges, setFilteredBadges] = useState<Badge[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterType, setFilterType] = useState<"all" | "course" | "quiz">("all");

    useEffect(() => {
        const fetchEarnedBadges = async () => {
            try {
                setLoading(true);
                
                if (!user?.userId) {
                    setError("User not logged in");
                    setLoading(false);
                    return;
                }

                // Fetch user's courses with their activity status
                const coursesData = await getUserCourses(user.userId);
                
                // Transform courses into earned badges
                const earnedBadges: Badge[] = [];
                
                coursesData.forEach((course: any) => {
                    // Add course completion badge if completed is true
                    if (course.completed && course.badgeImg) {
                        earnedBadges.push({
                            courseId: course.courseId,
                            title: `${course.title} - Completion Badge`,
                            description: `Earned by completing ${course.title}`,
                            badgeImg: course.badgeImg,
                            type: "course",
                            isEarned: true,
                            courseName: course.title
                        });
                    }
                    
                    // Add quiz badge if quiz_total_time is not empty/null
                    if (course.quizTotalTime && course.quizBadgeImg) {
                        earnedBadges.push({
                            courseId: course.courseId,
                            title: `${course.title} - Quiz Badge`,
                            description: `Earned by completing the quiz in ${course.quizTotalTime}`,
                            badgeImg: course.quizBadgeImg,
                            type: "quiz",
                            isEarned: true,
                            courseName: course.title
                        });
                    }
                });
                
                setBadges(earnedBadges);
                setFilteredBadges(earnedBadges);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to fetch badges");
                console.error("Error fetching earned badges:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchEarnedBadges();
    }, [user?.userId]);

    const handleSearch = (value: string) => {
        setSearchTerm(value);
        applyFilters(value, filterType);
    };

    const handleFilterChange = (type: "all" | "course" | "quiz") => {
        setFilterType(type);
        applyFilters(searchTerm, type);
    };

    const applyFilters = (search: string, type: "all" | "course" | "quiz") => {
        let filtered = badges;

        // Filter by type
        if (type !== "all") {
            filtered = filtered.filter(badge => badge.type === type);
        }

        // Filter by search term
        if (search.trim() !== "") {
            filtered = filtered.filter(badge =>
                badge.title.toLowerCase().includes(search.toLowerCase()) ||
                badge.courseName?.toLowerCase().includes(search.toLowerCase())
            );
        }

        setFilteredBadges(filtered);
    };

    return (
        <RgUserLayout>
            <div className="max-w-screen overflow-x-hidden">
                <div className="w-full flex flex-col items-center">
                    <p className="font-ibarra font-bold text-black text-[36px] pt-[50px]">
                        My <span className="text-[#DA1A32]">Achievements</span>
                    </p>

                    <div className="flex items-center justify-between w-[666px] h-[48px] bg-white border border-black rounded-full pr-[4px] pl-[22px] mt-[28px]">
                        <input
                            type="text"
                            placeholder="Search badges or courses..."
                            value={searchTerm}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="font-inter flex-1 bg-transparent outline-none text-black text-[16px] font-light"
                        />
                        <div className="w-[38px] h-[38px] bg-[#DA1A32] flex items-center justify-center rounded-full text-white text-[12px] cursor-pointer ml-[20px]">
                            <IoIosSearch className="text-white w-[24px] h-[24px] " />
                        </div>
                    </div>

                    {/* Filter Buttons */}
                    <div className="flex gap-[12px] mt-[24px]">
                        <button
                            onClick={() => handleFilterChange("all")}
                            className={`px-[20px] py-[8px] rounded-full font-inter text-[14px] transition-all duration-300 ${
                                filterType === "all"
                                    ? "bg-[#DA1A32] text-white"
                                    : "bg-white border border-black text-black hover:bg-[#f5f5f5]"
                            }`}
                        >
                            All Badges
                        </button>
                        <button
                            onClick={() => handleFilterChange("course")}
                            className={`px-[20px] py-[8px] rounded-full font-inter text-[14px] transition-all duration-300 ${
                                filterType === "course"
                                    ? "bg-[#DA1A32] text-white"
                                    : "bg-white border border-black text-black hover:bg-[#f5f5f5]"
                            }`}
                        >
                            Course Badges
                        </button>
                        <button
                            onClick={() => handleFilterChange("quiz")}
                            className={`px-[20px] py-[8px] rounded-full font-inter text-[14px] transition-all duration-300 ${
                                filterType === "quiz"
                                    ? "bg-[#DA1A32] text-white"
                                    : "bg-white border border-black text-black hover:bg-[#f5f5f5]"
                            }`}
                        >
                            Quiz Badges
                        </button>
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

                    {/* Loading and Error States */}
                    {loading && (
                        <div className="mt-[50px] text-center">
                            <p className="text-black text-[18px] font-light">Loading your achievements...</p>
                        </div>
                    )}

                    {error && (
                        <div className="mt-[50px] text-center">
                            <p className="text-red-500 text-[18px] font-light">Error: {error}</p>
                        </div>
                    )}

                    {/* No Results State */}
                    {!loading && !error && filteredBadges.length === 0 && (
                        <div className="mt-[50px] text-center">
                            <p className="text-black text-[18px] font-light">
                                {badges.length === 0 
                                    ? "No badges earned yet. Complete courses and quizzes to unlock achievements!" 
                                    : "No badges match your search criteria."}
                            </p>
                        </div>
                    )}

                    {/* Badges Container */}
                    {!loading && !error && filteredBadges.length > 0 && (
                    <div className="mt-[22px] pt-[22px] w-screen h-[526px] pb-[64px] overflow-y-scroll no-scrollbar">
                        <div className="grid grid-cols-4 gap-x-[14px] gap-y-[30px] w-[1090px] mx-auto">
                            {filteredBadges.map((badge, index) => (
                                <div key={`${badge.courseId}-${badge.type}-${index}`} className="h-[315px] w-[262px] bg-white flex flex-col p-[10px] shadow-[0px_0px_20px_rgba(0,0,0,0.1)] rounded-[20px] text-black items-center px-[18px] hover:shadow-lg transition-all duration-300 group">
                                    <img 
                                        src={badge.badgeImg || "/images/Badge.png"} 
                                        alt={badge.title} 
                                        className="w-[148px] h-[169px] object-cover rounded-[8px]" 
                                    />

                                    {/* Badge Type Badge */}
                                    <div className={`mt-[8px] px-[10px] py-[4px] rounded-full text-[10px] font-bold text-white ${
                                        badge.type === "course" ? "bg-[#4CAF50]" : "bg-[#FF9800]"
                                    }`}>
                                        {badge.type === "course" ? "Course Completion" : "Quiz Completion"}
                                    </div>

                                    {/* Title */}
                                    <div className="font-ibarra text-[16px] font-bold mt-[8px] line-clamp-2 text-center group-hover:text-[#DA1A32] transition-all duration-300">
                                        {badge.title}
                                    </div>

                                    {/* Course Name */}
                                    {badge.courseName && (
                                        <div className="font-inter text-[12px] text-gray-600 mt-[4px] text-center line-clamp-1">
                                            From: {badge.courseName}
                                        </div>
                                    )}

                                    {/* Status */}
                                    <div className="mt-[12px] px-[12px] py-[6px] bg-[#E8F5E9] rounded-full text-[11px] font-semibold text-[#2E7D32]">
                                        ✓ Earned
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

export default RgUserBadge;
