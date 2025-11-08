import { IoIosSearch, IoIosSend } from "react-icons/io";
import RgUserLayout from "../components/RgUserLayout.tsx";
import { CiEdit, CiFilter } from "react-icons/ci";
import { TbArrowsSort } from "react-icons/tb";
import { FaEye, FaEyeSlash, FaStar } from "react-icons/fa";
import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import IconLoading from "../components/IconLoading.tsx";
import * as Yup from "yup";
import ProfileForm from "../components/EditProfileForm.tsx";
import { useNavigate } from "react-router-dom";
import { logout } from "../services/authService.ts";

type Profile = {
    id: string;
    fname: string;
    lname: string;
    gender: string;
    DOB: string;
    profileimage: globalThis.File | null;
    plevel: string;
    pcat: string;
    username: string;
    email: string;
    userId: number;
};

const RgUserCat = () => {
    const navigate = useNavigate();
    const [userId] = useState(1); // 🔹 Placeholder user ID
    const [active, setActive] = useState("My Profile");

    const tabs = ["My Profile", "Change Password", "About Us", "Contact Us", "Terms and Conditions", "FAQ", "Get Help"];

    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [showProfileForm, setShowProfileForm] = useState(false);

    const handleOpenProfileModal = () => {
        setShowProfileForm(true);
    };

    const handleCloseProfileModal = () => {
        setShowProfileForm(false);
    };

    const handleProfileSave = (updatedProfile: Profile, isEdit: boolean) => {
        console.log("✅ Profile updated:", updatedProfile);
        setShowProfileForm(false);
        // 🧠 Later: call Supabase or API to update profile
    };

    const handleLogout = async () => {
        try {
            await logout();
            // Navigate to login page after successful logout
            navigate('/Login');
        } catch (error) {
            console.error('Logout failed:', error);
            // Still navigate to login page even if logout fails
            navigate('/Login');
        }
    };

    return (
        <RgUserLayout>

            {showProfileForm && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <ProfileForm
                        onClose={handleCloseProfileModal}
                        onSave={handleProfileSave}
                        isEdit={true}
                        userId={userId}
                    />
                </div>
            )}

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

                                <button onClick={handleOpenProfileModal}
                                className="flex items-center justify-between h-[40px] bg-white border border-black rounded-full pr-[4px] pl-[22px] cursor-pointer hover:scale-105 transition-all duration-[600ms]">
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

                    {active === "Change Password" && (
                        <div className="flex flex-col min-h-[518px]">
                            <p className="font-ibarra font-bold text-black text-[36px]">
                                Change <span className="text-[#DA1A32]">Password</span>
                            </p>
                            <Formik
                                initialValues={{
                                    password: "",
                                    newPassword: "",
                                    confirmPassword: "",
                                }}
                                validationSchema={Yup.object().shape({
                                    password: Yup.string().required("Password is required"),

                                    newPassword: Yup.string()
                                        .required("Password is required.")
                                        .min(8, "Password must be at least 8 characters.")
                                        .matches(/[a-z]/, "Password must contain at least one lowercase letter.")
                                        .matches(/[A-Z]/, "Password must contain at least one uppercase letter.")
                                        .matches(/\d/, "Password must contain at least one digit.")
                                        .matches(/[@$!%*?&#]/, "Password must contain at least one special character.")
                                    ,

                                    confirmPassword: Yup.string()
                                        .oneOf([Yup.ref("newPassword"), undefined], "New passwords must match.")
                                        .required("Please confirm your password.")
                                    ,
                                })}

                                onSubmit={async (values, { setSubmitting }) => {
                                    // try {
                                    //     console.log("Logging in with:", values.loginId);

                                    //     // Decide whether it's an email or username
                                    //     const isEmail = values.loginId.includes("@");

                                    //     const { data, error } = await supabase
                                    //         .from("user")
                                    //         .select("*")
                                    //         .eq(isEmail ? "email" : "username", values.loginId.trim().toLowerCase())
                                    //         .maybeSingle();

                                    //     if (error || !data) {
                                    //         throw new Error("Invalid login credentials.");
                                    //     }

                                    //     const match = await bcrypt.compare(values.password, data.password);
                                    //     if (!match) {
                                    //         throw new Error("Incorrect password.");
                                    //     }

                                    //     alert("Login successful!");
                                    //     router.push("/dashboard");
                                    // } catch (err: any) {
                                    //     console.error("Login error:", err);
                                    //     alert(err.message || "Login failed.");
                                    // } finally {
                                    //     setSubmitting(false);
                                    // }
                                }}
                            >
                                {({ isSubmitting, values, setFieldValue, touched, errors, resetForm, isValid, validateForm, setTouched }) => {
                                    return (
                                        <Form className="w-full h-full pt-[12px] pr-[20px] overflow-hidden">

                                            <div className="w-full h-[1px] bg-black mb-[18px]"></div>


                                            <div className="w-full font-inter">
                                                <div className="my-4">
                                                    {/* Password Field */}
                                                    <div className="mb-8 relative">
                                                        <div className="flex flex-row justify-between">
                                                            <label htmlFor="password" className="block text-sm font-medium mb-[5px] ml-[8px] text-black">
                                                                Old Password
                                                            </label>
                                                            {values.password && (
                                                                <div className="flex items-end mb-[5px]">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => { setFieldValue("password", ""); }}
                                                                        className="text-red-500 text-[13px] mr-[8px]"
                                                                    >
                                                                        Clear
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="relative">
                                                            <Field
                                                                id="password"
                                                                name="password"
                                                                type={showPassword ? "text" : "password"}
                                                                placeholder="Enter your password"
                                                                className={`bg-white border border-black rounded-full px-[15px] pr-[45px] text-black placeholder-gray-500 block w-full sm:text-sm h-[37px] align-text-bottom focus:outline-none focus:ring-0 ${errors.password && touched.password ? "border border-red-300" : ""
                                                                    }`}
                                                            />
                                                            {/* Eye Icon */}
                                                            <button
                                                                type="button"
                                                                onClick={() => setShowPassword((prev) => !prev)}
                                                                className="absolute inset-y-0 right-0 flex items-center px-3 text-[#7c7c7c] hover:text-black transition duration-300 focus:outline-none cursor-pointer"
                                                            >
                                                                {showPassword ? (
                                                                    <FaEye className="h-5 w-5" />
                                                                ) : (
                                                                    <FaEyeSlash className="h-5 w-5" />
                                                                )}
                                                            </button>
                                                        </div>
                                                        <ErrorMessage name="password" component="div" className="text-red-500 text-xs mt-2 absolute -bottom-5 left-[2px]" />
                                                    </div>

                                                    {/* New Password Field */}
                                                    <div className="mb-8 relative">
                                                        <div className="flex flex-row justify-between">
                                                            <label htmlFor="newPassword" className="block text-sm font-medium mb-[5px] ml-[8px] text-black">
                                                                New Password
                                                            </label>
                                                            {values.newPassword && (
                                                                <div className="flex items-end mb-[5px]">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => { setFieldValue("newPassword", ""); }}
                                                                        className="text-red-500 text-[13px] mr-[8px]"
                                                                    >
                                                                        Clear
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="relative">
                                                            <Field
                                                                id="newPassword"
                                                                name="newPassword"
                                                                type={showNewPassword ? "text" : "password"}
                                                                placeholder="Enter a strong password"
                                                                className={`bg-white border border-black rounded-full px-[15px] pr-[45px] text-black placeholder-gray-500 block w-full sm:text-sm h-[37px] align-text-bottom focus:outline-none focus:ring-0 ${errors.newPassword && touched.newPassword ? "border border-red-300" : ""
                                                                    }`}
                                                            />
                                                            {/* Eye Icon */}
                                                            <button
                                                                type="button"
                                                                onClick={() => setShowNewPassword((prev) => !prev)}
                                                                className="absolute inset-y-0 right-0 flex items-center px-3 text-[#7c7c7c] hover:text-black transition duration-300 focus:outline-none cursor-pointer"
                                                            >
                                                                {showNewPassword ? (
                                                                    <FaEye className="h-5 w-5" />
                                                                ) : (
                                                                    <FaEyeSlash className="h-5 w-5" />
                                                                )}
                                                            </button>
                                                        </div>
                                                        <ErrorMessage name="newPassword" component="div" className="text-red-500 text-xs mt-2 absolute -bottom-5 left-[2px]" />
                                                    </div>

                                                    {/* Confirm Password Field */}
                                                    <div className="mb-8 relative">
                                                        <div className="flex flex-row justify-between">
                                                            <label htmlFor="confirmPassword" className="block text-sm font-medium mb-[5px] ml-[2px] text-black">
                                                                Confirm Password
                                                            </label>
                                                            {values.confirmPassword && (
                                                                <div className="flex items-end mb-[5px]">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => { setFieldValue("confirmPassword", ""); }}
                                                                        className="text-red-500 text-[13px] mr-[8px]"
                                                                    >
                                                                        Clear
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="relative">
                                                            <Field
                                                                id="confirmPassword"
                                                                name="confirmPassword"
                                                                type={showConfirmPassword ? "text" : "password"}
                                                                placeholder="Confirm your password"
                                                                className={`bg-white border border-black rounded-full px-[15px] pr-[45px] text-black placeholder-gray-500 block w-full sm:text-sm h-[37px] align-text-bottom focus:outline-none focus:ring-0 ${errors.confirmPassword && touched.confirmPassword ? "border border-red-300" : ""
                                                                    }`}
                                                            />
                                                            {/* Eye Icon */}
                                                            <button
                                                                type="button"
                                                                onClick={() => setShowConfirmPassword((prev) => !prev)}
                                                                className="absolute inset-y-0 right-0 flex items-center px-3 text-[#7c7c7c] hover:text-black transition duration-300 focus:outline-none cursor-pointer"
                                                            >
                                                                {showConfirmPassword ? (
                                                                    <FaEye className="h-5 w-5" />
                                                                ) : (
                                                                    <FaEyeSlash className="h-5 w-5" />
                                                                )}
                                                            </button>
                                                        </div>
                                                        <ErrorMessage name="confirmPassword" component="div" className="text-red-500 text-xs mt-2 absolute -bottom-5 left-[2px]" />
                                                    </div>
                                                </div>
                                            </div>


                                            <div className="w-full flex flex-row justify-center ">
                                                <div className="w-full flex flex-row justify-end">
                                                    <div className="w-[340.6px] pb-4 gap-[12px] flex flex-row justify-between">


                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                // handleBack();
                                                                // setFieldValue("step", 1)
                                                            }}
                                                            className="w-[36%] h-[37px] relative group cursor-pointer rounded-full bg-white mx-[2px] flex justify-center items-center text-black font-inter border-black border hover:scale-105 transition-all duration-[600ms]"
                                                        >
                                                            Cancel
                                                        </button>
                                                        <button
                                                            type="submit"
                                                            disabled={isSubmitting}
                                                            className="w-[64%] h-[37px] hover:scale-105 flex justify-center items-center rounded-full transition-all duration-[600ms] bg-[#DA1A32] text-white"
                                                        >
                                                            {isSubmitting ? (
                                                                <IconLoading className="text-black w-5 h-5 animate-spin ml-4" />
                                                            ) : <span>Change Password</span>}
                                                        </button>

                                                    </div>
                                                </div>
                                            </div>
                                        </Form>
                                    )
                                }}
                            </Formik>
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
                        <div className="flex flex-col min-h-[518px]">
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

                    {active === "FAQ" && (
                        <div className="flex flex-col">
                            {/* Title */}
                            <p className="font-ibarra font-bold text-black text-[36px]">
                                Frequently Asked <span className="text-[#DA1A32]">Questions</span>
                            </p>

                            {/* Intro */}
                            <p className="mt-[6px] text-[14px] font-inter font-light text-justify">
                                Have questions about how De Pastry Lab works? Here are some quick answers
                                to help you get started on your baking journey.
                            </p>

                            {/* FAQ List */}
                            <div className="mt-[32px] flex flex-col gap-[24px] text-[14px] font-inter font-light">

                                <div>
                                    <p className="font-bold text-[16px] text-black">
                                        1. Is De Pastry Lab really free to use?
                                    </p>
                                    <p className="mt-[4px] text-gray-700 text-justify">
                                        Yes! All our baking courses, practice quizzes, and community access are completely free.
                                        You can learn, practice, and grow your skills without any hidden fees.
                                    </p>
                                </div>

                                <div>
                                    <p className="font-bold text-[16px] text-black">
                                        2. How do the courses work?
                                    </p>
                                    <p className="mt-[4px] text-gray-700 text-justify">
                                        Each course is divided into short, easy-to-follow lessons. You can learn at your own pace,
                                        take notes, and test your knowledge with practice quizzes before attempting the final exam.
                                    </p>
                                </div>

                                <div>
                                    <p className="font-bold text-[16px] text-black">
                                        3. What happens if I fail a quiz or final exam?
                                    </p>
                                    <p className="mt-[4px] text-gray-700 text-justify">
                                        No worries! You can retry practice quizzes as many times as you like.
                                        For the final exam, you’ll need to pass to officially complete the course,
                                        sbut you can reattempt it anytime until you succeed.
                                    </p>
                                </div>

                                <div>
                                    <p className="font-bold text-[16px] text-black">
                                        4. Do I get a certificate or achievement after finishing a course?
                                    </p>
                                    <p className="mt-[4px] text-gray-700 text-justify">
                                        Yes! Once you pass the final exam, you’ll unlock a course completion badge and achievement.
                                        These showcase your progress and can be proudly displayed in your profile.
                                    </p>
                                </div>

                                <div>
                                    <p className="font-bold text-[16px] text-black">
                                        5. What’s the community section for?
                                    </p>
                                    <p className="mt-[4px] text-gray-700 text-justify">
                                        The community is where learners share their creations, ask for feedback, and connect with other pastry lovers.
                                        It’s a great place to learn tips, stay inspired, and grow together.
                                    </p>
                                </div>

                                <div>
                                    <p className="font-bold text-[16px] text-black">
                                        6. Do I need to register before accessing the courses?
                                    </p>
                                    <p className="mt-[4px] text-gray-700 text-justify">
                                        Yes, registration is required to save your progress, track achievements,
                                        and participate in the community. It only takes a minute to sign up — and it’s free!
                                    </p>
                                </div>
                            </div>

                            {/* Closing line */}
                            <p className="mt-[36px] text-[14px] text-gray-600 text-justify">
                                Still need help? Visit our <span className="text-[#DA1A32] font-medium">Get Help page</span>, our team is always here to guide you every step of the way.
                            </p>
                        </div>
                    )}

                    {active === "Get Help" && (
                        <div className="flex flex-col">
                            <p className="font-ibarra font-bold text-black text-[36px]">
                                How can we <span className="text-[#DA1A32]">help</span> ?
                            </p>

                            <div className="flex items-center justify-between w-full h-[48px] bg-white border border-black rounded-full pr-[4px] pl-[22px] mt-[12px]">
                                <input
                                    type="text"
                                    placeholder="Type your question, feedback, or request here..."
                                    className="font-inter flex-1 bg-transparent outline-none text-black text-[16px] font-light"
                                />
                                <div className="w-[38px] h-[38px] bg-[#DA1A32] flex items-center justify-center rounded-full text-white text-[12px] cursor-pointer ml-[20px]">
                                    <IoIosSend className="text-white w-[24px] h-[24px] " />
                                </div>
                            </div>

                            <p className="mt-[32px] font-ibarra font-bold text-black text-[28px]">
                                Past Chats/Requests
                            </p>

                            <div className="pt-[20px] pb-[64px] min-h-[332px] spr-[6px] flex flex-col gap-[16px]">

                                <div className="cursor-pointer relative p-4 border border-gray-200 rounded-xl shadow-md bg-[#FFF6F7] hover:border-[#DA1A32]/40 transition-all duration-[300ms]">
                                    <div className="absolute -top-2 -right-1 bg-[#DA1A32] text-white text-[10px] px-2 py-1 rounded-full">
                                        Replied
                                    </div>
                                    <p className="text-[14px] text-gray-800 font-medium truncate whitespace-nowrap overflow-hidden">
                                        Why when I use mobile data connections, the video keep on lagging, how to solve.
                                    </p>
                                    <p className="text-[12px] text-gray-500 mt-1">Submitted on Sept 21, 2025</p>
                                    <p className="text-[12px] text-[#DA1A32] mt-2 font-semibold">New reply available →</p>
                                </div>

                                <div className="cursor-pointer p-4 border border-gray-200 rounded-xl shadow-sm bg-white  hover:border-[#DA1A32]/40 transition-all duration-[300ms]">
                                    <p className="text-[14px] text-gray-800 font-medium">“How do I reset my password?”</p>
                                    <p className="text-[12px] text-gray-500 mt-1">Submitted on Sept 12, 2025</p>
                                </div>

                                <div className="cursor-pointer p-4 border border-gray-200 rounded-xl shadow-sm bg-white  hover:border-[#DA1A32]/40 transition-all duration-[300ms]">
                                    <p className="text-[14px] text-gray-800 font-medium">“Can I download the lessons for offline use?”</p>
                                    <p className="text-[12px] text-gray-500 mt-1">Submitted on Sept 18, 2025</p>
                                </div>
                                <div className="cursor-pointer p-4 border border-gray-200 rounded-xl shadow-sm bg-white  hover:border-[#DA1A32]/40 transition-all duration-[300ms]">
                                    <p className="text-[14px] text-gray-800 font-medium">“Can I download the lessons for offline use?”</p>
                                    <p className="text-[12px] text-gray-500 mt-1">Submitted on Sept 18, 2025</p>
                                </div>
                                <div className="cursor-pointer p-4 border border-gray-200 rounded-xl shadow-sm bg-white  hover:border-[#DA1A32]/40 transition-all duration-[300ms]">
                                    <p className="text-[14px] text-gray-800 font-medium">“Can I download the lessons for offline use?”</p>
                                    <p className="text-[12px] text-gray-500 mt-1">Submitted on Sept 18, 2025</p>
                                </div>
                                <div className="cursor-pointer p-4 border border-gray-200 rounded-xl shadow-sm bg-white  hover:border-[#DA1A32]/40 transition-all duration-[300ms]">
                                    <p className="text-[14px] text-gray-800 font-medium">“Can I download the lessons for offline use?”</p>
                                    <p className="text-[12px] text-gray-500 mt-1">Submitted on Sept 18, 2025</p>
                                </div>
                            </div>

                        </div>
                    )}
                </div>

                <div className="sticky top-[112px] right-0 w-[322px] h-[439px] flex flex-col font-inter text-[16px] font-light rounded-[20px] bg-[#F8F5F0] p-[10px]">
                    <div className="w-full flex flex-col">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActive(tab)}
                                className="relative rounded-[15px] transition-all duration-300 h-[47px] flex flex-row items-center pl-[26px] hover:bg-[#f7eee2]/60"
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

                    <button 
                        onClick={handleLogout}
                        className="mt-[6px] w-full h-[47px] flex justify-center items-center hover:bg-[#f7eee2]/60 transition-all duration-300 rounded-[15px]"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </RgUserLayout>
    );
};

export default RgUserCat;
