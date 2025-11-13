import { FC, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { FaHeart, FaShareAlt } from "react-icons/fa";
import { IoMdHeart } from "react-icons/io";
import { togglePostLike } from "../api/client.js";

type Post = {
  postId: number;
  userId: number;
  userName?: string;
  userFirstName?: string;
  userLastName?: string;
  type: string;
  courseId?: number;
  courseName?: string;
  categoryName?: string;
  title: string;
  description: string;
  postImg: string;
  createdAt: string;
  likeCount: number;
  isLiked: boolean;
};

type DisplayPostProps = {
  onClose: () => void;
  post: Post | null;
  onLikeUpdate?: (postId: number, likeCount: number, isLiked: boolean) => void;
};

const DisplayPost: FC<DisplayPostProps> = ({ onClose, post, onLikeUpdate }) => {
  const [likeCount, setLikeCount] = useState(post?.likeCount || 0);
  const [isLiked, setIsLiked] = useState(post?.isLiked || false);
  
  if (!post) return null;

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLike = async () => {
    if (!user?.userId) {
      alert("Please login to like posts");
      return;
    }

    try {
      const result = await togglePostLike(post.postId, user.userId);
      setLikeCount(result.likeCount);
      setIsLiked(result.isLiked);
      
      // Notify parent component about the like update
      if (onLikeUpdate) {
        onLikeUpdate(post.postId, result.likeCount, result.isLiked);
      }
    } catch (err) {
      console.error("Error toggling like:", err);
    }
  };

  const authorName = post.userFirstName && post.userLastName 
    ? `${post.userFirstName} ${post.userLastName}`
    : post.userName || "Anonymous";
  
  const authorInitial = post.userFirstName?.charAt(0)?.toUpperCase() || 
                        post.userName?.charAt(0)?.toUpperCase() || "?";

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 flex justify-center items-center mt-[75px] cursor-pointer"
      onClick={onClose}
    >
      <div
        className="cursor-default relative flex flex-row bg-white rounded-[20px] shadow-lg p-[15px] w-[820px] h-[550px]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ❌ Close Button */}
        <button
          onClick={onClose}
          className="absolute top-[12px] right-[12px] text-gray-500 hover:text-red-500 transition-all"
        >
          <RxCross2 size={28} />
        </button>

        {/* Like button */}
        <button 
          onClick={handleLike}
          className="absolute top-[13px] right-[54px] cursor-pointer hover:scale-110 transition-all"
        >
          <IoMdHeart className={`w-[26px] h-[26px] ${isLiked ? 'text-[#FF5454]' : 'text-[#D9D9D9]'}`} />
        </button>

        {/* 🖼 Left: Image Section */}
        <div className="relative w-[340px] h-full rounded-[16px] overflow-hidden">
          <img src={post.postImg || "/images/Post.webp"} alt={post.title} className="w-full h-full object-cover z-0" />
          <div className="absolute top-0 left-0 w-full h-full bg-[#fefefe]/20 backdrop-blur-[12px] z-10" />
          <div className="absolute top-0 left-0 w-full h-full flex items-center z-20">
            <img src={post.postImg || "/images/Post.webp"} alt={post.title} className="w-full object-cover" />
          </div>
        </div>

        {/* 📜 Right: Content Section */}
        <div className="flex flex-col justify-between w-[460px] ml-[25px]">
          {/* 🧑 Author Info */}
          <div className="flex items-center mt-[10px] mb-[20px]">
            <div className="w-[40px] h-[40px] bg-[#DA1A32] flex items-center justify-center rounded-full text-white text-[18px] mr-[12px]">
              {authorInitial}
            </div>

            <div>
              <p className="text-[14.5px] font-semibold">
                {authorName}
              </p>
              <p className="text-[12px] text-gray-500">{formatDate(post.createdAt)}</p>
            </div>
          </div>

          {/* 📝 Post Title */}
          <h2 className="font-ibarra text-[22px] font-bold mb-[10px] mr-2">
            {post.title}
          </h2>

          {/* 💬 Description */}
          <p className="font-inter text-[13.5px] text-gray-700 font-light leading-relaxed mb-[15px] text-justify  mr-2">
            {post.description}
          </p>

          {/* 🔖 Hashtags */}
          <div className="text-[12px] font-inter mt-[26px] font-light underline cursor-pointer">
            {post.courseName && (
              <span className="hover:text-[#DA1A32] transition-all duration-300 mr-2">
                #{post.courseName}
              </span>
            )}
            {post.categoryName && (
              <span className="hover:text-[#DA1A32] transition-all duration-300">
                #{post.categoryName}
              </span>
            )}
          </div>

          {/* ❤️ Reactions */}
          <div className="flex flex-row justify-between items-center mt-auto">
            <div className="flex flex-row gap-[25px]">
              <div className="flex items-center gap-[7px]">
                <FaHeart className="text-red-500" />
                <span className="text-[15px]">{likeCount}</span>
              </div>
            </div>
            <div>
              <FaShareAlt className="text-gray-600 hover:text-blue-500 cursor-pointer" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisplayPost;
