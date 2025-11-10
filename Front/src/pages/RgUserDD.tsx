import { useState, useEffect } from "react";
import RgUserQLayout from "../components/RgUserQLayout.tsx";
import { useParams } from "react-router-dom";

// Types
type DragDropItem = {
    id: number;
    content: string; // can be text or image path
};

type BoxKey = "box1" | "box2" | "box3" | "box4";

type BoxState = {
    value: number | null;
    content: string; // content for the box
};

type Question = {
    id: number;
    text: string;
    boxes: DragDropItem[];   // the drop targets
    options: DragDropItem[]; // draggable items
};

// Placeholder fallback
const placeholderQuestion: Question = {
    id: 1,
    text: "Drag the correct step description into each box to match the stage of the process.",
    boxes: [
        { id: 1, content: "Prep" },
        { id: 2, content: "/images/Cookie.webp" },
        { id: 3, content: "Baking" },
        { id: 4, content: "Cake" },
    ],
    options: [
        { id: 1, content: "Preheat oven to 350°F" },
        { id: 2, content: "Cookie" },
        { id: 3, content: "Bake 30–35 min" },
        { id: 4, content: "/images/Cake.webp" },
    ],
};

// Initialize boxes from data
const makeInitialBoxes = (items: DragDropItem[]): Record<BoxKey, BoxState> => {
    const keys: BoxKey[] = ["box1", "box2", "box3", "box4"];
    return keys.reduce((acc, key, idx) => {
        const item = items[idx];
        acc[key] = { value: null, content: item.content };
        return acc;
    }, {} as Record<BoxKey, BoxState>);
};

// Detect if a string is an image path
const isImage = (value?: string): boolean => {
    if (!value) return false;
    return /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(value);
};

// Shuffle array utility
const shuffleArray = <T,>(arr: T[]): T[] => {
    const newArr = [...arr];
    for (let i = newArr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
};

const RgUserDD = () => {
    const { id } = useParams<{ id: string }>();
    const [question, setQuestion] = useState<Question>(placeholderQuestion);
    const [boxes, setBoxes] = useState<Record<BoxKey, BoxState>>(makeInitialBoxes(placeholderQuestion.boxes));
    const [shuffledOptions, setShuffledOptions] = useState<DragDropItem[]>(shuffleArray(placeholderQuestion.options));
    const [showResult, setShowResult] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);

    // Fetch question dynamically
    useEffect(() => {
        if (!id) return;

        fetch(`/api/questions/${id}`)
            .then(res => res.ok ? res.json() : Promise.reject("Error fetching"))
            .then((data: Question) => {
                setQuestion(data);
                setBoxes(makeInitialBoxes(data.boxes));
                setShuffledOptions(shuffleArray(data.options)); // shuffle options on load
            })
            .catch(err => {
                console.error(err);
                setQuestion(placeholderQuestion);
                setBoxes(makeInitialBoxes(placeholderQuestion.boxes));
                setShuffledOptions(shuffleArray(placeholderQuestion.options));
            });
    }, [id]);

    // Validate answer
    const checkAnswer = () => {
        let correct = true;
        question.boxes.forEach((boxItem, idx) => {
            const boxKey = `box${idx + 1}` as BoxKey;
            if (boxes[boxKey].value !== boxItem.id) correct = false;
        });
        setIsCorrect(correct);
        setShowResult(true);
    };

    return (
        <RgUserQLayout progress={10}>
            {/* Left: Drop Boxes */}
            <div className="h-screen flex flex-col w-[36.7%] bg-gradient-to-r from-[#301818] to-[#732222]">
                <style>
                    {`
                        .scrol::-webkit-scrollbar {
                            width: 0px;
                            height: 0px;
                        }
                    `}
                </style>
                <div className="mt-[112px] h-[472px] w-[455px] mx-auto gap-[16px] flex flex-col overflow-y-scroll scrol">
                    <div className="font-ibarra w-full bg-white px-[18px] py-[16px] rounded-[10px] text-black font-medium">
                        {question.text}
                    </div>

                    <div className="w-full h-[455px] grid grid-cols-2 grid-rows-2 gap-[10px]">
                        {(Object.keys(boxes) as BoxKey[]).map((bx, idx) => {
                            const box = boxes[bx];
                            const chosen = question.options.find(opt => opt.id === box.value);

                            return (
                                <div
                                    key={bx}
                                    onDragOver={e => e.preventDefault()}
                                    onDrop={e => {
                                        const val = Number(e.dataTransfer.getData("text"));
                                        setBoxes(prev => ({ ...prev, [bx]: { ...prev[bx], value: val } }));
                                    }}
                                    onClick={() => setBoxes(prev => ({ ...prev, [bx]: { ...prev[bx], value: null } }))}
                                    className={`w-full h-full rounded-[10px] border-[10px] flex items-center justify-center text-black text-[14px] p-4
                                        ${chosen ? "bg-white border-[#B9A9A1] cursor-pointer" : "bg-white border-[#F8F5F0]"}`}
                                >
                                    {chosen ? (
                                        isImage(chosen.content) ? (
                                            <img src={chosen.content} alt={`Option ${chosen.id}`} className="max-w-full max-h-full object-contain rounded-[8px]" />
                                        ) : (
                                            <span>{chosen.content}</span>
                                        )
                                    ) : isImage(box.content) ? (
                                        <img src={box.content} alt={`Box ${idx + 1}`} className="max-w-full max-h-full object-contain rounded-[8px]" />
                                    ) : (
                                        <span>{box.content}</span>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Right: Options to Drag */}
            <div className="py-[80px] w-[63.3%] flex items-center justify-center">
                <div className="flex flex-row gap-[24px] h-[475px]">
                    {shuffledOptions.map(opt => {
                        const isUsed = Object.values(boxes).some(b => b.value === opt.id);
                        return isUsed ? (
                            <div key={opt.id} className="font-inter w-[203px] h-full bg-[#B9A9A1] rounded-[20px]" />
                        ) : (
                            <div
                                key={opt.id}
                                draggable
                                onDragStart={e => e.dataTransfer.setData("text", String(opt.id))}
                                className="font-inter w-[203px] h-full bg-white flex justify-center items-center p-[24px] text-black text-[14px] text-center border-[3px] border-[#B9A9A1] rounded-[20px] cursor-grab active:cursor-grabbing shadow-[0px_5px_0px_rgba(185,169,161,1)] transition-all duration-[600ms] hover:-translate-y-2 hover:text-[#DA1A32] hover:border-[#DA1A32]"
                            >
                                {isImage(opt.content) ? (
                                    <img src={opt.content} alt={`Option ${opt.id}`} className="max-w-full max-h-full object-contain rounded-[8px]" />
                                ) : (
                                    <span>{opt.content}</span>
                                )}
                            </div>
                        );
                    })}
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

            {/* Bottom Result Popup */}
            {showResult && (
                <div className={`fixed bottom-0 left-0 w-full h-[160px] ${isCorrect ? "bg-[#D1F19B]" : "bg-[#FFCDCD]"} flex flex-col items-center z-50`}>
                    <span className={`${isCorrect ? "text-[#00AD30]" : "text-[#FF3A3A]"} font-ibarra text-[35px] font-bold mt-[16px]`}>{isCorrect ? "Correct" : "Incorrect"}</span>
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

export default RgUserDD;
