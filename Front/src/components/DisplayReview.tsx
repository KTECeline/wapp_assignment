import { FC } from "react";
import { RxCross2 } from "react-icons/rx";
import { FaHeart, FaComment, FaShareAlt, FaStar } from "react-icons/fa";
import { IoMdHeart } from "react-icons/io";

interface ReviewData {
  id: number;
  userId: number;
  userName: string;
  userInitial: string;
  type: string;
  courseId: number;
  courseTitle: string;
  rating: number;
  title: string;
  description: string;
  createdAt: string;
  timeAgo: string;
}

type DisplayReviewProps = {
  onClose: () => void;
  review?: ReviewData;
};

const DisplayReview: FC<DisplayReviewProps> = ({ onClose, review }) => {
  // Use passed review or fallback to empty state
  const displayReview = review || {
    id: 0,
    userId: 0,
    userName: "Anonymous",
    userInitial: "A",
    type: "website",
    courseId: 0,
    courseTitle: "Website Review",
    rating: 0,
    title: "No review selected",
    description: "Please select a review to view details.",
    createdAt: new Date().toISOString(),
    timeAgo: "just now"
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 flex justify-center items-center mt-[75px] cursor-pointer"
      onClick={onClose}
    >
      <div className="relative w-[480px] bg-white flex flex-col py-[15px] px-[21px] shadow-lg rounded-[20px]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ❌ Close Button */}
        <button
          onClick={onClose}
          className="absolute top-[12px] right-[12px] text-gray-500 hover:text-red-500 transition-all"
        >
          <RxCross2 size={28} />
        </button>

        {/* 🧑 Author Info */}
        <div className="flex items-center mt-[10px] mb-[20px]">
          <div className="w-[40px] h-[40px] bg-[#DA1A32] flex items-center justify-center rounded-full text-white text-[18px] mr-[12px]">
            {displayReview.userInitial}
          </div>

          <div>
            <p className="text-[14.5px] font-semibold">
              {displayReview.userName}
            </p>
            <p className="text-[12px] text-gray-500">{displayReview.timeAgo}</p>
          </div>
        </div>

        {/* Course Title */}
        <p className="text-[12px] text-gray-500 mb-[8px]">
          {displayReview.type === "website" ? "Website Review" : `Course: ${displayReview.courseTitle}`}
        </p>

        {/* 📝 Review Title */}
        <h2 className="font-ibarra text-[22px] font-bold mb-[10px]">
          {displayReview.title}
        </h2>

        {/* 💬 Description */}
        <p className="font-inter text-[13.5px] text-gray-700 font-light leading-relaxed mb-[15px] text-justify">
          {displayReview.description}
        </p>

        {/* ⭐ Rating */}
        <div className="flex gap-[4px] mb-4">
          {[...Array(5)].map((_, index) => {
            const fillPercentage = Math.min(Math.max(displayReview.rating - index, 0), 1) * 100;
            return (
              <div
                key={index}
                className="relative"
                style={{ width: `22px`, height: `22px` }}
              >
                {/* Gray star */}
                <FaStar
                  className="absolute top-0 left-0 text-gray-300"
                  size="22px"
                />
                {/* Red filled star */}
                <div
                  className="absolute top-0 left-0 overflow-hidden"
                  style={{ width: `${fillPercentage}%`, height: "100%" }}
                >
                  <FaStar className="text-[#DA1A32]" size="22px" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DisplayReview;
