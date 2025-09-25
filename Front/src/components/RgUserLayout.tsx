import React from "react";
import { NavLink } from "react-router-dom";

interface RgUserLayoutProps {
  children: React.ReactNode;
}

const RgUserLayout: React.FC<RgUserLayoutProps> = ({ children }) => {
  return (
    <div className="font-inter bg-white min-h-screen w-full overflow-hidden">
      {/* Header */}
      <header className="w-full h-[80px] bg-[#F8F5F0] left-0 top-0 fixed flex flex-row justify-between items-center z-50">
        {/* Logo */}
        <div className="pl-[24px]">
          <img src="/images/WAPP_Logo.png" alt="Logo" className="w-[203px]" />
        </div>

        {/* RgUser Menu */}
        <div className="flex flex-row px-[68px] text-[16px] font-light gap-[88px] font-inter">
          {[
            { to: "/RgUserHome", label: "Home" },
            { to: "/RgUserLearn", label: "Learn" },
            { to: "/posts", label: "Posts" },
            { to: "/RgUserBadge", label: "Badges" },
            { to: "/RgUserCol", label: "My Collection" },
          ].map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end
              className={({ isActive }) =>
                `justify-center items-center flex cursor-pointer transition-all duration-300 relative group ${isActive ? "text-[#DA1A32]" : "text-black hover:text-[#DA1A32]"
                }`
              }
            >
              {({ isActive }) => (<>
                {item.label}
                <div className={`absolute w-full h-[5px] bg-[#DA1A32] top-[47px] transition-all duration-[600ms] scale-x-0 group-hover:scale-x-[1.6] ${isActive ? "scale-x-[1.6]" : ""}`} />
              </>
              )}
            </NavLink>
          ))}

          {/* Right Icons */}
          <div className="flex gap-[16px]">
            <img
              src="/images/Search.png"
              alt="Search"
              className="w-[22px] h-[22px] cursor-pointer"
            />
            <img
              src="/images/Profile.png"
              alt="Profile"
              className="w-[22px] h-[22px] cursor-pointer"
            />
          </div>
        </div>
      </header>

      {/* Page Content */}
      <div className="pt-[80px]">{children}</div>
    </div>
  );
};

export default RgUserLayout;
