import { useState } from "react";
import RgUserQLayout from "../components/RgUserQLayout.tsx";

type Step = {
    id: number;
    option?: string;    // text shown in the card (optional)
    image?: string;     // image shown instead of text (optional)
    boxLabel?: string;
    boxImage?: string;
};


type BoxKey = "box1" | "box2" | "box3" | "box4";

type BoxState = {
    value: number | null; // store the id as number
    label: string;
    image?: string;
};

export const steps: Step[] = [
    {
        id: 1,
        option: "Preheat the oven to 350°F and line the baking pan with parchment paper.",
        boxLabel: "Prep",
    },
    {
        id: 2,
        option: "Cookie",
        boxImage: "/images/Cookie.webp",
    },
    {
        id: 3,
        option: "Bake for 30–35 minutes until edges are set and a toothpick has moist crumbs.",
        boxLabel: "Baking",
    },
    {
        id: 4,
        image: "/images/Cake.webp",
        boxLabel: "Cake",
    },
];


const makeInitialBoxes = (): Record<BoxKey, BoxState> => {
  const keys: BoxKey[] = ["box1", "box2", "box3", "box4"];

  return keys.reduce((acc, key, idx) => {
    const step = steps[idx];

    acc[key] = {
      value: null,
      label: step.boxLabel ?? `Step ${idx + 1}`,
      image: step.boxImage, 
    };

    return acc;
  }, {} as Record<BoxKey, BoxState>);
};

export const initialBoxes = makeInitialBoxes();

const RgUserDD = () => {

    const [boxes, setBoxes] = useState(initialBoxes);

    return (
        <RgUserQLayout mode="quiz" progress={10}>
            {/* Left Content */}
            <div className="h-screen flex flex-col w-[36.7%] bg-gradient-to-r from-[#301818] to-[#732222]">
                <div className="mt-[112px] h-[472px] w-[455px] mx-auto gap-[16px] flex flex-col overflow-y-scroll scrol">

                    <div className="font-ibarra w-full bg-white px-[18px] py-[16px] rounded-[10px] text-black font-medium">
                        Drag the correct step description into each box to match the stage of the brownie-making process.
                    </div>

                    <div className="w-full h-[455px] grid-cols-2 grid-rows-2 grid gap-[10px]">

                        {(Object.keys(boxes) as BoxKey[]).map((bx) => {
                            const box = boxes[bx];
                            const chosen = steps.find((s) => s.id === box.value);

                            return (
                                <div
                                    key={bx}
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop={(e) => {
                                        e.preventDefault();
                                        const id = Number(e.dataTransfer.getData("text"));
                                        setBoxes((prev) => ({
                                            ...prev,
                                            [bx]: { ...prev[bx], value: id },
                                        }));
                                    }}
                                    onClick={() =>
                                        setBoxes((prev) => ({ ...prev, [bx]: { ...prev[bx], value: null } }))
                                    }
                                    className={`w-full h-full rounded-[10px] border-[10px] flex items-center justify-center text-black text-[14px] p-4
                                                    ${chosen ? "bg-white border-[#B9A9A1] cursor-pointer" : "bg-white border-[#F8F5F0]"}`}
                                >
                                    {chosen ? (
                                        chosen.image ? (
                                            <img
                                                src={chosen.image}
                                                alt={chosen.boxLabel}
                                                className="max-w-full max-h-full object-contain rounded-[8px]"
                                            />
                                        ) : (
                                            <span>{chosen.option}</span>
                                        )
                                    ) : (
                                        box.image ? (
                                            <img
                                                src={box.image}
                                                alt={box.label}
                                                className="max-w-full max-h-full object-contain rounded-[8px]"
                                            />
                                        ) : (
                                            <span>{box.label}</span>
                                        )
                                    )}

                                </div>
                            );
                        })}


                    </div>

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

            <div className="py-[80px] w-[63.3%]">
                {/* Right Content */}
                <div className="flex h-full w-full items-center justify-center">
                    <div className="flex flex-row gap-[24px] h-[475px]">
                        {steps.map((s) => {
                            const isUsed = Object.values(boxes).some((b) => b.value === s.id);
                            return isUsed ? (
                                <div key={s.id} className="font-inter w-[203px] h-full bg-[#B9A9A1] flex justify-center items-center p-[24px] text-black text-[14px] border-[3px] border-[#B9A9A1] rounded-[20px] cursor-pointer shadow-[0px_5px_0px_rgba(185,169,161,1)] transition-all duration-[600ms] " />
                            ) : (
                                <div
                                    key={s.id}
                                    draggable
                                    onDragStart={(e) => e.dataTransfer.setData("text", String(s.id))}
                                    className="font-inter w-[203px] h-full bg-white flex justify-center items-center p-[24px] text-black text-[14px] text-center border-[3px] border-[#B9A9A1] rounded-[20px] cursor-grab active:cursor-grabbing shadow-[0px_5px_0px_rgba(185,169,161,1)] transition-all duration-[600ms] hover:-translate-y-2 hover:text-[#DA1A32] hover:border-[#DA1A32] hover:shadow-[0px_5px_0px_rgba(218,26,50,1)]"
                                >
                                    {s.image ? (
                                        <img
                                            src={s.image}
                                            alt={s.boxLabel}
                                            className="max-w-full max-h-full object-contain rounded-[8px]"
                                        />
                                    ) : (
                                        s.option
                                    )}
                                </div>
                            );
                        })}

                    </div>
                </div>
            </div>
        </RgUserQLayout>
    );
};

export default RgUserDD;
