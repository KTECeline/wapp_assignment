import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { FaStar } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import RgUserLayout from "../components/RgUserLayout.tsx";
import VisitorLayout from "../components/VisitorLayout.tsx";

interface CourseStep {
    courseStepId: number;
    description: string;
    step: number;
    courseStepImg: string;
}
interface Course {
    courseId: number;
    title: string;
    description: string;
    courseImg: string;
    rating: number;
    reviews: number;
    cookingTimeMin: number;
    servings: number;
    video: string;
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

interface CourseTip {
    tipId: number;
    courseId: number;
    description: string;
}

const RgUserCourseStep = () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const { id } = useParams<{ id: string }>();
    const [steps, setSteps] = useState<CourseStep[]>([]);
    const [course, setCourse] = useState<Course | null>(null);
    const [tips, setTips] = useState<CourseTip[]>([]);

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


    useEffect(() => {
        if (!id) return;

        fetch(`/api/CourseSteps/course/${id}`)
            .then(res => res.json())
            .then((data: CourseStep[]) => setSteps(data))
            .catch(err => console.error(err));
    }, [id]);

    useEffect(() => {
        if (!id) return;

        fetch(`/api/CourseTips/course/${id}`)
            .then(res => res.json())
            .then((data: CourseTip[]) => setTips(data))
            .catch(err => console.error("Error fetching tips:", err));
    }, [id]);

    const getYouTubeEmbedUrl = (url: string) => {
        const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/);
        return match ? `https://www.youtube.com/embed/${match[1]}` : "";
    };

    if (!user?.userId) {
        return (
            <VisitorLayout>
                <div className="flex flex-col justify-center items-center h-[400px] gap-6 text-center">
                    <h2 className="text-2xl font-bold text-gray-800">
                        Oops! You don’t have access.
                    </h2>
                    <p className="text-gray-600 max-w-[400px]">
                        To view this course, please login or register an account.
                        It only takes a few seconds!
                    </p>
                    <div className="flex gap-4">
                        <button
                            onClick={() => navigate("/login")}
                            className="py-2 px-10 bg-[#DA1A32] text-white rounded-full font-medium hover:scale-105 transition-all duration-[600ms]"
                        >
                            Login
                        </button>
                        <button
                            onClick={() => navigate("/register")}
                            className="py-2 px-10 border border-[#DA1A32] text-[#DA1A32] rounded-full font-medium hover:scale-105  transition-all duration-[600ms]"
                        >
                            Register
                        </button>
                    </div>
                </div>
            </VisitorLayout>
        );
    }



    if (!course) {
        return (
            <RgUserLayout>
                <div className="flex justify-center items-center h-[400px]">
                    Loading course...
                </div>
            </RgUserLayout>
        );
    }


    return (
        <RgUserLayout>
            <div className="flex flex-row justify-between w-[1408px] mx-auto">
                {/* Left Content */}
                <div className="h-full mx-auto flex flex-col mt-[32px] ml-[36px]">
                    <div className="font-ibarra text-[32px] leading-tight font-bold text-black mb-[8px] relative">
                        Step-by-Step Guide
                        <button className="cursor-pointer"
                            onClick={() => navigate(`/RgUserCourse/${course.courseId}`)}>
                            <IoIosArrowBack className="text-[#DA1A32] h-[28px] absolute top-[6px] -left-9 " />
                        </button>
                    </div>

                    <div className="font-inter text-[10px] max-w-[500px] leading-tight font-[200] text-black flex items-center gap-[2px]">
                        <button className="cursor-pointer uppercase hover:text-[#DA1A32] transition-all duration-[600ms]"
                            onClick={() => navigate(`/RgUserLearn`)}>
                            Learn
                        </button>
                        <IoIosArrowForward className="text-[#DA1A32] h-[18px]" />
                        <button className="cursor-pointer uppercase hover:text-[#DA1A32] transition-all duration-[600ms]"
                            onClick={() => navigate(`/RgUserCat/${course.categoryId}`)}>
                            {course.category?.title}
                        </button>
                        <IoIosArrowForward className="text-[#DA1A32] h-[18px]" />
                        <button className="cursor-pointer uppercase hover:text-[#DA1A32] transition-all duration-[600ms]"
                            onClick={() => navigate(`/RgUserCourse/${course.courseId}`)}>
                            {course.title}
                        </button>
                    </div>

                    <div className="w-[814px] h-[458px] mt-[18px]">
                        <iframe
                            width="814"
                            height="458"
                            src={getYouTubeEmbedUrl(course.video)}
                            title={course.title}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="rounded-[10px]"
                        />
                    </div>

                </div>

                <style>
                    {`
                        .scrol::-webkit-scrollbar {
                            width: 5px;
                            height: 5px;
                        }
                        .scrol::-webkit-scrollbar-track {
                            background: rgba(188, 188, 188, 0.2);
                            border-radius: 10px;
                            cursor: pointer;
                        }
                        .scrol::-webkit-scrollbar-thumb {
                            background: rgba(0, 0, 0, 0.2);
                            border-radius: 10px;
                            transition: background 0.3s ease-in-out;
                            cursor: grab;
                        }
                        .scrol::-webkit-scrollbar-thumb:active {
                            cursor: grabbing;
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
                        <ul className="flex flex-col gap-[28px]">
                            {steps.map(step => (
                                <li
                                    key={step.courseStepId}
                                    className="max-w-[432px] text-[14px] text-black font-light text-justify flex flex-col gap-[10px]"
                                >
                                    <div className="flex flex-row gap-[8px]">
                                        <span className="font-semibold">{step.step}.</span>
                                        <p>{step.description}</p>
                                    </div>
                                    {step.courseStepImg && (
                                        <img
                                            src={step.courseStepImg}
                                            alt={`Step ${step.step}`}
                                            className="ml-[20px] w-[200px] h-auto rounded-md"
                                        />
                                    )}
                                </li>
                            ))}
                        </ul>

                        {/* Tips remain unchanged */}
                        <div className="font-ibarra text-[32px] font-bold flex flex-row items-center gap-[8px] text-black mt-[44px] justify-center mb-[24px]">
                            <div className="w-[16px] h-[1px] bg-[#DA1A32]" />
                            Tips
                            <div className="w-[16px] h-[1px] bg-[#DA1A32]" />
                        </div>

                        <ul className="flex flex-col gap-[24px]">
                            {tips.map(tip => (
                                <li key={tip.tipId} className="max-w-[432px] text-[14px] text-black font-light text-justify flex gap-[14px]">
                                    <span>
                                        <FaStar className="text-[#DA1A32] translate-y-[2px]" size="14px" />
                                    </span>
                                    <p>{tip.description}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </RgUserLayout>
    );
};

export default RgUserCourseStep;
