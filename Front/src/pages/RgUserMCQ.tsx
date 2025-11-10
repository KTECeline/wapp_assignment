import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import RgUserQLayout from "../components/RgUserQLayout.tsx";

// Types
type MCQOption = {
    id: number;
    content: string; // text or image path
};

type MCQQuestion = {
    id: number;
    text: string;
    options: MCQOption[];
    answer: number; // correct option id
};

// Placeholder
const placeholderQuestion: MCQQuestion = {
    id: 1,
    text: "The toothpick/skewer test is often used to check if brownies are done baking. Based on the image below, which skewer indicates that the brownie is ready?",
    options: [
        { id: 1, content: "A" },
        { id: 2, content: "B" },
        { id: 3, content: "C" },
        { id: 4, content: "None of the options" },
    ],
    answer: 4, // correct option id
};

// Utility: detect image
const isImage = (value?: string) => value ? /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(value) : false;

// Shuffle array
const shuffleArray = <T,>(arr: T[]): T[] => {
    const newArr = [...arr];
    for (let i = newArr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
};

const RgUserMCQ = () => {
    const { id } = useParams<{ id: string }>();
    const [question, setQuestion] = useState<MCQQuestion>(placeholderQuestion);
    const [shuffledOptions, setShuffledOptions] = useState<MCQOption[]>(shuffleArray(placeholderQuestion.options));
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [showResult, setShowResult] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);

    // Fetch question dynamically
    useEffect(() => {
        if (!id) return;

        fetch(`/api/questions/${id}`)
            .then(res => res.ok ? res.json() : Promise.reject("Error fetching"))
            .then((data: MCQQuestion) => {
                setQuestion(data);
                setShuffledOptions(shuffleArray(data.options));
                setSelectedOption(null);
            })
            .catch(err => {
                console.error(err);
                setQuestion(placeholderQuestion);
                setShuffledOptions(shuffleArray(placeholderQuestion.options));
                setSelectedOption(null);
            });
    }, [id]);

    const checkAnswer = () => {
        if (selectedOption === null) return;
        setIsCorrect(selectedOption === question.answer);
        setShowResult(true);
    };

    return (
        <RgUserQLayout progress={10}>
            {/* Left Content */}
            <div className="h-screen flex flex-col w-[36.7%] bg-gradient-to-r from-[#301818] to-[#732222]">
                <div className="mt-[112px] h-[472px] w-[455px] mx-auto gap-[16px] flex flex-col overflow-y-scroll scrol">
                    <div className="font-ibarra w-full bg-white px-[18px] py-[16px] rounded-[10px] text-black font-medium">
                        {question.text}
                    </div>

                    {/* Example image/video */}
                    <img
                        src="/images/MCQ.jpg"
                        className="w-full h-[256px] rounded-[10px] mt-[18px] cursor-pointer object-cover"
                        alt="MCQ"
                    />
                </div>
            </div>

            <style>
                {`
                    .scrol::-webkit-scrollbar {
                        width: 0px;
                        height: 0px;
                    }
                `}
            </style>

            {/* Right Content: Options */}
            <div className="py-[80px] w-[63.3%] flex items-center justify-center">
                <div className="flex h-full w-full items-center justify-center">
                    <div className="flex flex-row gap-[24px] h-[475px]">
                        {shuffledOptions.map(opt => (
                            <div
                                key={opt.id}
                                onClick={() => setSelectedOption(opt.id)}
                                className={`font-inter w-[203px] h-full bg-white flex justify-center items-center p-[24px] text-black text-[14px] border-[3px] rounded-[20px] cursor-pointer shadow-[0px_5px_0px_rgba(185,169,161,1)] transition-all duration-[600ms]
                                    ${selectedOption === opt.id ? "border-[#DA1A32] text-[#DA1A32] shadow-[0px_5px_0px_rgba(218,26,50,1)]" : "border-[#B9A9A1]"}`}
                            >
                                {isImage(opt.content) ? (
                                    <img src={opt.content} alt={`Option ${opt.id}`} className="max-w-full max-h-full object-contain rounded-[8px]" />
                                ) : (
                                    <span>{opt.content}</span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Check Button */}
            <footer className="w-full h-[80px] bg-gradient-to-b from-[#CC3855] to-[#802537] left-0 bottom-0 fixed flex justify-center items-center z-50">
                <button
                    onClick={checkAnswer}
                    className="font-ibarra cursor-pointer bg-white w-[154px] h-[40px] flex justify-center items-center rounded-full font-bold text-[24px] hover:scale-105 transition-all duration-[600ms] text-black hover:text-[#DA1A32]"
                >
                    Check
                </button>
            </footer>

            {/* Result Popup */}
            {showResult && (
                <div className={`fixed bottom-0 left-0 w-full h-[160px] ${isCorrect ? "bg-[#D1F19B]" : "bg-[#FFCDCD]"} flex flex-col items-center z-50`}>
                    <span className={`${isCorrect ? "text-[#00AD30]" : "text-[#FF3A3A]"} font-ibarra text-[35px] font-bold mt-[16px]`}>
                        {isCorrect ? "Correct" : "Incorrect"}
                    </span>
                    <button
                        onClick={() => setShowResult(false)}
                        className="mt-[8px] font-ibarra cursor-pointer bg-white w-[154px] h-[40px] flex justify-center items-center rounded-full font-bold text-[24px] hover:scale-105 transition-all duration-[600ms] text-black hover:text-[#DA1A32]"
                    >
                        Continue
                    </button>
                </div>
            )}
        </RgUserQLayout>
    );
};

export default RgUserMCQ;
