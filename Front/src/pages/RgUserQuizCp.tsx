import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import RgUserLayout from "../components/RgUserLayout.tsx";

interface LeaderboardEntry {
    rank: number;
    name: string;
    accuracy: number;
    time: string;
}

const RgUserQuizCp = () => {
    const { id } = useParams(); 
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [userRank, setUserRank] = useState<LeaderboardEntry | null>(null);

    const user = JSON.parse(localStorage.getItem("user") || "{}");

     const navigate = useNavigate();

    useEffect(() => {
        if (!id) return;
        const fetchLeaderboard = async () => {
            const res = await fetch(`/api/CourseUserActivities/leaderboard?courseId=${id}`);
            const data = await res.json();
            setLeaderboard(data);

            // Find current user's record
            const current = data.find((x: any) => x.name === user.username);
            if (current) setUserRank(current);
        };
        fetchLeaderboard();
    }, [id]);

    return (
        <RgUserLayout>
            <div className="flex flex-col justify-center">
                {/* --- Title --- */}
                <div className="flex flex-row mx-auto mt-[26px] gap-[88px]">
                    <img src="/images/Sparkles.gif" className="w-[56px] h-[56px] -translate-y-[4px]" alt="Sparkles" />
                    <div className="font-ibarra text-[32px] font-bold text-[#FF5858]">
                        Good Job!
                    </div>
                    <img src="/images/Sparkles.gif" className="w-[56px] h-[56px] -translate-y-[4px]" alt="Sparkles" />
                </div>

                {/* --- User's Result Summary --- */}
                {userRank && (
                    <div className="flex flex-row mx-auto mt-[16px] justify-between w-[548px]">
                        <div className="bg-[#CC3855] rounded-[15px] flex flex-col items-center w-[172px] pt-[4px] pb-[8px] px-[8px]">
                            <div className="font-ibarra text-[20px] font-bold text-white">Rank</div>
                            <div className="font-inter bg-white rounded-[10px] w-[156px] h-[54px] font-light flex items-center justify-center text-black text-[22px]">
                                {userRank.rank}
                            </div>
                        </div>

                        <div className="bg-[#CC3855] rounded-[15px] flex flex-col items-center w-[172px] pt-[4px] pb-[8px] px-[8px]">
                            <div className="font-ibarra text-[20px] font-bold text-white">Accuracy</div>
                            <div className="font-inter bg-white rounded-[10px] w-[156px] h-[54px] font-light flex items-center justify-center text-black text-[22px]">
                                {userRank.accuracy}%
                            </div>
                        </div>

                        <div className="bg-[#CC3855] rounded-[15px] flex flex-col items-center w-[172px] pt-[4px] pb-[8px] px-[8px]">
                            <div className="font-ibarra text-[20px] font-bold text-white">Time</div>
                            <div className="font-inter bg-white rounded-[10px] w-[156px] h-[54px] font-light flex items-center justify-center text-black text-[22px]">
                                {userRank.time}
                            </div>
                        </div>
                    </div>
                )}

                {/* --- Leaderboard --- */}
                <div className="h-[295px] w-[788px] flex flex-col rounded-[20px] mx-auto mt-[22px] bg-gradient-to-r from-[#301818] to-[#732222] pb-[14px] px-[16px] pt-[18px]">
                    <div className="grid-cols-12 grid">
                        <div className="font-ibarra text-[16px] font-semibold text-white col-start-1 col-span-1 flex justify-center">Rank</div>
                        <div className="font-ibarra text-[16px] font-semibold text-white col-start-4 col-span-1 flex justify-center">Name</div>
                        <div className="font-ibarra text-[16px] font-semibold text-white col-start-7 col-span-3 flex justify-center">Accuracy</div>
                        <div className="font-ibarra text-[16px] font-semibold text-white col-start-11 col-span-2 flex justify-center">Time</div>
                    </div>

                    <div className="flex flex-col gap-[12px] mt-[12px]">
                        {leaderboard.slice(0, 3).map((entry) => (
                            <div key={entry.rank} className="bg-white w-full h-[68px] rounded-[10px]">
                                <div className="grid-cols-12 grid w-full h-full items-center">
                                    <div className="font-inter text-[24px] font-semibold text-[#DA1A32] col-start-1 col-span-1 flex justify-center">
                                        {entry.rank}
                                    </div>
                                    <div className="font-inter text-[16px] text-black col-start-4 col-span-1 flex justify-center">
                                        {entry.name}
                                    </div>
                                    <div className="col-start-7 col-span-3 flex justify-center">
                                        <div className="font-inter text-[12px] w-[72px] h-[22px] font-light rounded-full border border-black text-black flex items-center justify-center pt-[1px]">
                                            {entry.accuracy}%
                                        </div>
                                    </div>
                                    <div className="col-start-11 col-span-2 flex justify-center">
                                        <div className="font-inter text-[12px] w-[72px] h-[22px] font-light rounded-full border border-black text-black flex items-center justify-center pt-[1px]">
                                            {entry.time}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <footer className="w-full h-[80px] bg-gradient-to-b from-[#CC3855] to-[#802537] left-0 bottom-0 fixed flex flex-row justify-center items-center z-50">
                <button className="font-ibarra cursor-pointer bg-white w-[154px] h-[40px] flex justify-center items-center rounded-full font-bold text-[24px] hover:scale-105 transition-all duration-[600ms] text-black hover:text-[#DA1A32]"
                    onClick={() => navigate(`/RgUserCourse/${id}`)}>
                    Return
                </button>
            </footer>
        </RgUserLayout>
    );
};

export default RgUserQuizCp;
