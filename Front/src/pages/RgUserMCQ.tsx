import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { handleAnswer } from "../components/QuizManager.tsx";
import { useNavigate } from "react-router-dom";

// Types
type MCQOption = {
    id: number;
    content: string; 
};

type MCQQuestion = {
    id: number;
    text: string;
    options: MCQOption[];
    answer: number;
    media?: string;
};

// Utils
const isImage = (value?: string) =>
    value ? /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(value) : false;
const isVideo = (value?: string) =>
    value ? /\.(mp4|webm|ogg)$/i.test(value) : false;

const shuffleArray = <T,>(arr: T[]): T[] => {
    const newArr = [...arr];
    for (let i = newArr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
};

const mapApiToMCQQuestion = (data: any): MCQQuestion => ({
    id: data.questionId,
    text: data.question?.questionText ?? "No question text",
    media: data.questionMedia,
    options: [
        { id: 1, content: data.option1 ?? "" },
        { id: 2, content: data.option2 ?? "" },
        { id: 3, content: data.option3 ?? "" },
        { id: 4, content: data.option4 ?? "" },
    ],
    answer: Number(data.questionAnswer) || 0,
});


const RgUserMCQ = () => {
    const { id } = useParams<{ id: string }>();
    const [question, setQuestion] = useState<MCQQuestion | null>(null);
    const [shuffledOptions, setShuffledOptions] = useState<MCQOption[]>([]);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [showResult, setShowResult] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);

    const navigate = useNavigate();

    // Fetch MCQ dynamically by ID
    useEffect(() => {
        if (!id) return;

        fetch(`/api/McqQuestions/${id}`)
            .then((res) => (res.ok ? res.json() : Promise.reject("Failed to fetch MCQ")))
            .then((data) => {
                const q = mapApiToMCQQuestion(data);
                setQuestion(q);
                setShuffledOptions(shuffleArray(q.options));
                setSelectedOption(null);
                setShowResult(false);
            })
            .catch((err) => {
                console.error(err);
                setQuestion(null);
                setShuffledOptions([]);
            });
    }, [id]);

    const checkAnswer = () => {
        if (selectedOption === null || !question) return;

        const correct = selectedOption === question.answer;
        setIsCorrect(correct);
        setShowResult(true);
    };

    if (!question) return <div className="p-4">Loading question...</div>;

    return (
        <div className="flex">
            {/* Left: Question + Media */}
            <div className="h-screen flex flex-col w-[36.7%] bg-gradient-to-r from-[#301818] to-[#732222]">
                <div className="mt-[112px] h-[472px] w-[455px] mx-auto gap-[16px] flex flex-col overflow-y-scroll scrol">
                    <div className="font-ibarra w-full bg-white px-[18px] py-[16px] rounded-[10px] text-black font-medium">
                        {question.text}
                    </div>

                    {question.media && isImage(question.media) && (
                        <img
                            src={question.media}
                            className="w-full h-[256px] rounded-[10px] mt-[18px] cursor-pointer object-cover"
                            alt="MCQ Media"
                        />
                    )}
                    {question.media && isVideo(question.media) && (
                        <video
                            src={question.media}
                            className="w-full h-[256px] rounded-[10px] mt-[18px] object-cover"
                            controls
                        />
                    )}
                </div>
            </div>

            <style>
                {`.scrol::-webkit-scrollbar { width: 0px; height: 0px; }`}
            </style>

            {/* Right: Options */}
            <div className="py-[80px] w-[63.3%] flex items-center justify-center">
                <div className="flex h-full w-full items-center justify-center">
                    <div className="flex flex-row gap-[24px] h-[475px]">
                        {shuffledOptions.map((opt) => (
                            <div
                                key={opt.id}
                                onClick={() => setSelectedOption(opt.id)}
                                className={`font-inter w-[203px] h-full bg-white flex justify-center items-center p-[24px] text-black text-[14px] border-[3px] rounded-[20px] cursor-pointer shadow-[0px_5px_0px_rgba(185,169,161,1)] transition-all duration-[600ms]
                                ${selectedOption === opt.id ? "border-[#DA1A32] text-[#DA1A32] shadow-[0px_5px_0px_rgba(218,26,50,1)]" : "border-[#B9A9A1]"}`}
                            >
                                {isImage(opt.content) ? (
                                    <img
                                        src={opt.content}
                                        alt={`Option ${opt.id}`}
                                        className="max-w-full max-h-full object-contain rounded-[8px]"
                                    />
                                ) : isVideo(opt.content) ? (
                                    <video
                                        src={opt.content}
                                        className="max-w-full max-h-full object-contain rounded-[8px]"
                                        controls
                                    />
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

            {/* Result */}
            {showResult && (
                <div
                    className={`fixed bottom-0 left-0 w-full h-[160px] ${isCorrect ? "bg-[#D1F19B]" : "bg-[#FFCDCD]"
                        } flex flex-col items-center z-50`}
                >
                    <span
                        className={`${isCorrect ? "text-[#00AD30]" : "text-[#FF3A3A]"
                            } font-ibarra text-[35px] font-bold mt-[16px]`}
                    >
                        {isCorrect ? "Correct" : "Incorrect"}
                    </span>
                    <button
                        onClick={async () => {
                            setShowResult(false);
                            await handleAnswer(isCorrect, navigate); 
                        }}
                        className="mt-[8px] font-ibarra cursor-pointer bg-white w-[154px] h-[40px] flex justify-center items-center rounded-full font-bold text-[24px] hover:scale-105 transition-all duration-[600ms] text-black hover:text-[#DA1A32]"
                    >
                        Continue
                    </button>
                </div>
            )}
        </div>
    );
};

export default RgUserMCQ;
