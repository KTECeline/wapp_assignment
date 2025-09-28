import { IoIosSearch } from "react-icons/io";
import RgUserLayout from "../components/RgUserLayout.tsx";
import { CiEdit, CiFilter } from "react-icons/ci";
import { TbArrowsSort } from "react-icons/tb";
import { FaStar } from "react-icons/fa";
import { useState } from "react";

const RgUserCat = () => {
    const [active, setActive] = useState("My Profile");

    const tabs = ["My Profile", "Edit Password", "About Us", "Contact Us", "Terms and Conditions", "Help"];

    return (
        <RgUserLayout>

            {/* Banner */}
            <div
                className="w-full h-[140px] relative bg-fixed bg-center bg-cover"
                style={{ backgroundImage: "url('/images/Pastry_Banner.jpg')" }}
            >
                {/* Overlay */}
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-[#000000]/40 to-[#000000]/0 z-10" />
            </div>

            <style>
                {`
                    .no-scrollbar::-webkit-scrollbar {
                        display: none;
                        }

                    .no-scrollbar {
                        -ms-overflow-style: none;  
                        scrollbar-width: none;  
                        }
                    `}
            </style>

            <div className="mt-[36px] text-black flex flex-row justify-between w-[1090px] mx-auto">
                <div className="w-[554px] pb-[64px]">
                    {active === "My Profile" && (
                        <div className="flex flex-col">
                            <div className="flex flex-row justify-between">
                                <div className="flex flex-row gap-[28px] h-full">
                                    <div className="w-[112px] h-[112px] rounded-full bg-[#DA1A32] text-[54px] font-inter text-white flex justify-center items-center ">
                                        A
                                    </div>

                                    <div className="flex flex-col my-auto gap-[6px] pb-4">
                                        <div className="font-ibarra font-bold text-[32px]">
                                            Amy Wong
                                        </div>
                                        <div className="font-inter font-light text-[16px] underline">
                                            amy123@email.com
                                        </div>
                                    </div>
                                </div>

                                <button className="flex items-center justify-between h-[40px] bg-white border border-black rounded-full pr-[4px] pl-[22px] cursor-pointer hover:scale-105 transition-all duration-[600ms]">
                                    <div className="font-inter text-[16px] font-light text-black">
                                        Edit
                                    </div>
                                    <div className="w-[30px] h-[30px] bg-[#DA1A32] flex items-center justify-center rounded-full text-white text-[12px] ml-[20px]">
                                        <CiEdit className="text-white w-[18px] h-[18px]" />
                                    </div>
                                </button>
                            </div>

                            <div className="mt-[28px] flex flex-col gap-[12px]">
                                <div className="bg-[#F8F5F0] w-full h-[44px] flex flex-row justify-between items-center pl-[22px] pr-[36px] rounded-[10px]">
                                    <div className="text-[14px] font-inter font-light">
                                        First Name
                                    </div>

                                    <div className="text-[14px] font-inter">
                                        Amy
                                    </div>
                                </div>

                                <div className="bg-[#F8F5F0] w-full h-[44px] flex flex-row justify-between items-center pl-[22px] pr-[36px] rounded-[10px]">
                                    <div className="text-[14px] font-inter font-light">
                                        Last Name
                                    </div>

                                    <div className="text-[14px] font-inter">
                                        Wong
                                    </div>
                                </div>

                                <div className="bg-[#F8F5F0] w-full h-[44px] flex flex-row justify-between items-center pl-[22px] pr-[36px] rounded-[10px]">
                                    <div className="text-[14px] font-inter font-light">
                                        Gender
                                    </div>

                                    <div className="text-[14px] font-inter">
                                        Female
                                    </div>
                                </div>

                                <div className="bg-[#F8F5F0] w-full h-[44px] flex flex-row justify-between items-center pl-[22px] pr-[36px] rounded-[10px]">
                                    <div className="text-[14px] font-inter font-light">
                                        Date of Birth
                                    </div>

                                    <div className="text-[14px] font-inter">
                                        23 June 2001
                                    </div>
                                </div>

                                <div className="bg-[#F8F5F0] w-full h-[44px] flex flex-row justify-between items-center pl-[22px] pr-[36px] rounded-[10px]">
                                    <div className="text-[14px] font-inter font-light">
                                        Preferred Category
                                    </div>

                                    <div className="text-[14px] font-inter">
                                        Pastry
                                    </div>
                                </div>

                                <div className="bg-[#F8F5F0] w-full h-[44px] flex flex-row justify-between items-center pl-[22px] pr-[36px] rounded-[10px]">
                                    <div className="text-[14px] font-inter font-light">
                                        Preferred Level
                                    </div>

                                    <div className="text-[14px] font-inter">
                                        Beginner
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {active === "About Us" && (
                        <div className="flex flex-col">
                            <p className="font-ibarra font-bold text-black text-[36px]">
                                About <span className="text-[#DA1A32]">Us</span>
                            </p>

                            <p className="mt-[6px] text-[14px] font-inter font-light text-justify">
                                At De Pastry Lab, we believe that the art of baking should be accessible to everyone. Whether you’re a complete beginner discovering the joy of baking for the first time or an aspiring pastry chef aiming to perfect your craft. Our platform was created with one mission in mind: To inspire and empower learners to explore the world of pastries, cakes, and desserts through hands-on, high-quality online learning.
                            </p>

                            <p className="mt-[32px] font-ibarra font-bold text-black text-[28px]">
                                Our Mission
                            </p>

                            <p className="mt-[6px] text-[14px] font-inter font-light text-justify">
                                Our mission is to make pastry education engaging, practical, and inclusive. We aim to bridge the gap between professional techniques and home-baking creativity by offering easy-to-follow lessons, expert guidance, and a supportive learning community.
                            </p>

                            <p className="mt-[32px] font-ibarra font-bold text-black text-[28px]">
                                What We Offer
                            </p>

                            <div className="mt-[6px] text-[14px] font-inter font-light flex flex-col gap-[16px]">
                                <li className="flex flex-row gap-[12px]">
                                    <div className="w-[12px] h-[2px] bg-[#DA1A32] mt-[8px]" />
                                    <span className="flex flex-col">
                                        <span className="font-bold mb-[2px]">Interactive Courses:
                                        </span>
                                        Step-by-step lessons designed by passionate pastry experts.
                                    </span>
                                </li>

                                <li className="flex flex-row gap-[12px]">
                                    <div className="w-[12px] h-[2px] bg-[#DA1A32] mt-[8px]" />
                                    <span className="flex flex-col">
                                        <span className="font-bold mb-[2px]">Learn Anytime, Anywhere:
                                        </span>
                                        Access courses on your own schedule, perfect for hobbyists and busy professionals.
                                    </span>
                                </li>

                                <li className="flex flex-row gap-[12px]">
                                    <div className="w-[12px] h-[2px] bg-[#DA1A32] mt-[8px]" />
                                    <span className="flex flex-col">
                                        <span className="font-bold mb-[2px]">Practical Skills:
                                        </span>
                                        Learn techniques you can apply instantly, from basic pastries to advanced desserts.
                                    </span>
                                </li>

                                <li className="flex flex-row gap-[12px]">
                                    <div className="w-[12px] h-[2px] bg-[#DA1A32] mt-[8px]" />
                                    <span className="flex flex-col">
                                        <span className="font-bold mb-[2px]">Community & Sharing:
                                        </span>
                                        A place to connect, share your creations, and celebrate progress together.
                                    </span>
                                </li>
                            </div>

                            <p className="mt-[32px] font-ibarra font-bold text-black text-[28px]">
                                Our Vision
                            </p>
                            <p className="mt-[6px] text-[14px] font-inter font-light text-justify">
                                We envision a world where anyone with a whisk and a little curiosity can create pastries that bring people together. De Pastry Lab strives to be the leading e-learning hub for pastry education, nurturing creativity, confidence, and lifelong passion for baking.
                            </p>
                        </div>
                    )}

                    {active === "Contact Us" && (
                        <div className="flex flex-col">
                            <p className="font-ibarra font-bold text-black text-[36px]">
                                Contact <span className="text-[#DA1A32]">Us</span>
                            </p>

                            <p className="mt-[6px] text-[14px] font-inter font-light text-justify">
                                We’d love to hear from you! At De Pastry Lab, we value your feedback, questions, and ideas.
                                Whether you’re reaching out for support, partnership opportunities, or simply to share your
                                baking journey, our team is here to help and connect with you.
                            </p>

                            <p className="mt-[32px] font-ibarra font-bold text-black text-[28px]">
                                Get in Touch
                            </p>

                            <div className="mt-[6px] text-[14px] font-inter font-light flex flex-col gap-[16px]">
                                <li className="flex flex-row gap-[12px]">
                                    <div className="w-[12px] h-[2px] bg-[#DA1A32] mt-[8px]" />
                                    <span className="flex flex-col max-w-[530px]">
                                        <span className="font-bold mb-[2px]">Email Support:</span>
                                        <span className="text-justify">
                                            Reach out anytime at <button className="text-[#DA1A32] font-medium underline">Help</button> or <span className="text-[#DA1A32] font-medium mx-[3px]">support@depastrylab.com</span> for course help, account inquiries, or technical assistance.
                                        </span>
                                    </span>
                                </li>

                                <li className="flex flex-row gap-[12px]">
                                    <div className="w-[12px] h-[2px] bg-[#DA1A32] mt-[8px]" />
                                    <span className="flex flex-col">
                                        <span className="font-bold mb-[2px]">Community Engagement:</span>
                                        <span className="text-justify">
                                            Share your pastry creations or join discussions on our forums and social channels.
                                        </span>
                                    </span>
                                </li>
                            </div>

                            <p className="mt-[32px] font-ibarra font-bold text-black text-[28px]">
                                Follow Us
                            </p>
                            <p className="mt-[6px] text-[14px] font-inter font-light text-justify">
                                Stay inspired and connected! Follow us on social media for the latest recipes,
                                baking tips, and updates from the De Pastry Lab community.
                            </p>
                        </div>
                    )}

                    {active === "Terms and Conditions" && (
                        <div className="flex flex-col">
                            <p className="font-ibarra font-bold text-black text-[36px]">
                                Terms & <span className="text-[#DA1A32]">Conditions</span>
                            </p>

                            <p className="mt-[6px] text-[14px] font-inter font-light text-justify">
                                Welcome to De Pastry Lab! By accessing or using our platform, you agree to follow the terms and conditions outlined below. These terms are designed to ensure a safe, fair, and enjoyable learning experience for all our users. Please read them carefully before using our services.
                            </p>

                            <p className="mt-[32px] font-ibarra font-bold text-black text-[28px]">
                                User Responsibilities
                            </p>
                            <div className="mt-[6px] text-[14px] font-inter font-light flex flex-col gap-[16px]">
                                <li className="flex flex-row gap-[12px]">
                                    <div className="w-[12px] h-[2px] bg-[#DA1A32] mt-[8px]" />
                                    <span className="flex flex-col">
                                        <span className="font-bold mb-[2px]">Account Security:</span>
                                        You are responsible for keeping your login details secure and for all activities under your account.
                                    </span>
                                </li>

                                <li className="flex flex-row gap-[12px]">
                                    <div className="w-[12px] h-[2px] bg-[#DA1A32] mt-[8px]" />
                                    <span className="flex flex-col">
                                        <span className="font-bold mb-[2px]">Respectful Use:</span>
                                        Use the platform responsibly. Do not share harmful, offensive, or inappropriate content.
                                    </span>
                                </li>

                                <li className="flex flex-row gap-[12px]">
                                    <div className="w-[12px] h-[2px] bg-[#DA1A32] mt-[8px]" />
                                    <span className="flex flex-col">
                                        <span className="font-bold mb-[2px]">Personal Use Only:</span>
                                        All courses and resources are for your personal learning. Redistribution or resale is not permitted.
                                    </span>
                                </li>
                            </div>

                            <p className="mt-[32px] font-ibarra font-bold text-black text-[28px]">
                                Intellectual Property
                            </p>
                            <p className="mt-[6px] text-[14px] font-inter font-light text-justify">
                                All course content, including videos, text, images, and resources, are the property of De Pastry Lab or its instructors. You may not copy, modify, distribute, or use the content for commercial purposes without permission.
                            </p>


                            <p className="mt-[32px] font-ibarra font-bold text-black text-[28px]">
                                Limitation of Liability
                            </p>
                            <p className="mt-[6px] text-[14px] font-inter font-light text-justify">
                                De Pastry Lab is not responsible for any issues, losses, or damages resulting from the use of our platform. While we aim to provide accurate and helpful content, baking results may vary based on individual skills, equipment, and environment.
                            </p>

                            <p className="mt-[32px] font-ibarra font-bold text-black text-[28px]">
                                Changes to Terms
                            </p>
                            <p className="mt-[6px] text-[14px] font-inter font-light text-justify">
                                We may update these Terms & Conditions from time to time to reflect changes in our services or policies. Users will be notified of significant updates, and continued use of our platform constitutes acceptance of the revised terms.
                            </p>

                            <p className="mt-[32px] text-[14px] font-inter font-light text-justify">
                                Thank you for being part of De Pastry Lab. By using our platform, you help us build a respectful and inspiring space for pastry lovers everywhere!
                            </p>
                        </div>
                    )}
                </div>

                <div className="sticky top-[112px] right-0 w-[322px] h-[392px] flex flex-col font-inter text-[16px] font-light rounded-[20px] bg-[#F8F5F0] p-[10px]">
                    <div className="w-full flex flex-col">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActive(tab)}
                                className="relative rounded-[15px] transition-all duration-300 h-[47px] flex flex-row items-center pl-[26px]"
                            >
                                <span
                                    className={`relative z-10 transition-colors duration-300 ${active === tab ? "text-[#DA1A32]" : "text-black"
                                        }`}
                                >
                                    {tab}
                                </span>

                                {/* Animated rounded highlight */}

                                <span className={`absolute inset-0 border border-[#DA1A32] rounded-[15px] transition-all duration-[300ms] bg-white ${active === tab ? "opacity-100" : "opacity-0"}`} />

                            </button>
                        ))}
                    </div>

                    <div className="mt-[36px] w-[270px] h-[1px] bg-black mx-auto" />

                    <button className="mt-[6px] w-full h-[47px] flex justify-center items-center hover:bg-[#f7eee2]/60 transition-all duration-300 rounded-[15px]">
                        Logout
                    </button>
                </div>
            </div>
        </RgUserLayout>
    );
};

export default RgUserCat;
