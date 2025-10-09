import { FC } from "react";
import { RxCross2 } from "react-icons/rx";
import { FaHeart, FaComment, FaShareAlt } from "react-icons/fa";
import { IoMdHeart } from "react-icons/io";

type DisplayPostProps = {
  onClose: () => void;
};

const DisplayPost: FC<DisplayPostProps> = ({ onClose }) => {
  // 🧩 Dummy Post Data
  const post = {
    id: 1,
    title: "My Freshly Baked Brownies",
    description:
      "WOW — the chocolate flavor is next-level! Can’t wait to share them with the family tonight. 🥰",
    image:
      "/images/Post.webp",
    author: {
      name: "Amy Wong",
      avatar:
        "",
    },
    date: "Oct 4, 2025",
    likes: 100,
    courses: [
      { name: "Small-Batch Brownies", link: "/courses/brownies" },
      { name: "Cakes", link: "/courses/cakes" },
    ],
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
        <button className="absolute top-[13px] right-[54px] cursor-pointer">
          <IoMdHeart className="w-[26px] h-[26px] text-[#D9D9D9]" />
        </button>

        {/* 🖼 Left: Image Section */}
        <div className="relative w-[340px] h-full rounded-[16px] overflow-hidden">
          <img src={post.image} alt={post.title} className="w-full h-full object-cover z-0" />
          <div className="absolute top-0 left-0 w-full h-full bg-[#fefefe]/20 backdrop-blur-[12px] z-10" />
          <div className="absolute top-0 left-0 w-full h-full flex items-center z-20">
            <img src={post.image} alt={post.title} className="w-full object-cover" />
          </div>
        </div>

        {/* 📜 Right: Content Section */}
        <div className="flex flex-col justify-between w-[460px] ml-[25px]">
          {/* 🧑 Author Info */}
          <div className="flex items-center mt-[10px] mb-[20px]">
            {post.author?.avatar ? (
              <img
                src={post.author.avatar}
                alt={post.author.name}
                className="w-[40px] h-[40px] rounded-full object-cover mr-[12px]"
              />
            ) : (
              <div className="w-[40px] h-[40px] bg-[#DA1A32] flex items-center justify-center rounded-full text-white text-[18px] mr-[12px]">
                {post.author?.name?.charAt(0)?.toUpperCase() || "?"}
              </div>
            )}

            <div>
              <p className="text-[14.5px] font-semibold">
                {post.author.name}
              </p>
              <p className="text-[12px] text-gray-500">{post.date}</p>
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
            {post.courses.map((course, index) => (
              <a
                key={index}
                href={course.link}
                className="hover:text-[#DA1A32] transition-all duration-300"
              >
                #{course.name}
              </a>
            ))}
          </div>

          {/* ❤️ Reactions */}
          <div className="flex flex-row justify-between items-center mt-auto">
            <div className="flex flex-row gap-[25px]">
              <div className="flex items-center gap-[7px]">
                <FaHeart className="text-red-500" />
                <span className="text-[15px]">{post.likes}</span>
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
