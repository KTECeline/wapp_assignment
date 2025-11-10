import React from "react";
import { RxCross2 } from "react-icons/rx";

interface RgUserQQLayoutProps {
  children: React.ReactNode;
  progress: number;
}

const RgUserQQLayout: React.FC<RgUserQQLayoutProps> = ({ children, progress }) => {
  return (
    <div className="font-inter bg-white min-h-screen w-full overflow-hidden">
      {/* Header */}
      <header className="w-full h-[80px] bg-[#F8F5F0] left-0 top-0 fixed flex flex-row justify-between items-center z-50">
        <div className="pl-[24px] absolute">
          <img src="/images/WAPP_Logo.png" alt="Logo" className="w-[203px]" />
        </div>

        <div className="flex flex-row mx-auto text-black text-[16px] font-light gap-[28px] pl-32">
          {/* Stop Quiz*/}
          <button className="cursor-pointer">
            <RxCross2 className="h-[28px] w-[28px] transition-all duration-300 hover:text-[#DA1A32]" />
          </button>

          {/* Progress */}
          <div className="w-[685px] bg-[#FFDBDB] rounded-full h-[10px] overflow-hidden my-auto">
            <div
              className="bg-[#DA1A32] h-[10px] transition-all duration-500 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
            <div className="flex flex-row w-[96px] h-[30px] bg-white rounded-full border border-black justify-center items-center">
              1:36
            </div>
        </div>
      </header>

      {/* Page Content */}
      <div className="flex">{children}</div>
    </div>
  );
};

export default RgUserQQLayout;
