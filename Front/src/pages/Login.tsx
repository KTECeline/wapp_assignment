import { FC, useEffect, useRef, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import IconLoading from "../components/IconLoading.tsx";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import VisitorLayout from "../components/VisitorLayout.tsx";
import { Link, useNavigate } from "react-router-dom";
import login, { testConnection } from "../services/authService.ts";

type FormValues = {
    fname: string;
    lname: string;
    gender: string;
    DOB: string;
    profileimage: globalThis.File | null;
    plevel: string;
    pcat: string;

    username: string;
    email: string;
    password: string;
};

const Login: FC = () => {
    const navigate = useNavigate();
    // Test server connection on component mount
    useEffect(() => {
        const testServer = async () => {
            try {
                const result = await testConnection();
                console.log('Server test result:', result);
            } catch (error) {
                console.error('Server test failed:', error);
            }
        };
        testServer();
    }, []);

    // Dynamic Text Animation
    const dynamicTextRef = useRef<HTMLSpanElement>(null);
    useEffect(() => {
        const words = [
            "Where passion meets pastry.",
            "Whisk up skills, one lesson at a time.",
            "From oven to excellence.",
            "Rise to the art of baking.",
        ];
        let wordIndex = 0;
        let charIndex = 1;
        let isDeleting = false;

        const typeEffect = () => {
            if (dynamicTextRef.current) {
                const currentWord = words[wordIndex];
                const currentChar = currentWord.substring(0, charIndex);
                dynamicTextRef.current.innerHTML = ` ${currentChar}<span class="blink-cursor">|</span>`;

                if (!isDeleting && charIndex < currentWord.length) {
                    charIndex++;
                    setTimeout(typeEffect, 100);
                } else if (isDeleting && charIndex > 0) {
                    charIndex--;
                    setTimeout(typeEffect, 100);
                } else {
                    isDeleting = !isDeleting;
                    wordIndex = isDeleting ? wordIndex : (wordIndex + 1) % words.length;
                    setTimeout(typeEffect, isDeleting ? 2000 : 100);
                }
            }
        };

        typeEffect();
    }, []);

    const [showPassword, setShowPassword] = useState(false);

    const renderLoginForm = () => (
        <Formik
            initialValues={{
                loginId: "",
                password: "",
            }}
            validationSchema={Yup.object().shape({
                loginId: Yup.string()
                    .required("Email or Username is required"),
                password: Yup.string().required("Password is required"),
            })}
            onSubmit={async (values, { setSubmitting, setFieldError }) => {
                try {
                    const result = await login({
                        loginId: values.loginId.trim(),
                        password: values.password
                    });

                    // Store user data in localStorage
                    localStorage.setItem('user', JSON.stringify(result));
                    
                    // Redirect to RgUserHome for regular users
                    navigate('/RgUserHome');
                } catch (error: any) {
                    const errorMessage = error.message || 'Login failed. Please try again.';
                    setFieldError('loginId', errorMessage);
                } finally {
                    setSubmitting(false);
                }
            }}
        >
            {({ isSubmitting, values, setFieldValue, touched, errors, resetForm, isValid, validateForm, setTouched }) => {
                return (
                    <Form className="mx-auto w-[620px] h-full pt-[28px] overflow-hidden">
                        <div className="mb-[20px] w-full flex flex-col items-center">
                            <div className="font-ibarra text-[24px] font-bold flex flex-row items-center gap-[8px] mx-auto">
                                <div className="w-[16px] h-[1px] bg-[#DA1A32]" />
                                Login
                                <div className="w-[16px] h-[1px] bg-[#DA1A32]" />
                            </div>

                            <div className="text-[11px] font flex flex-row mt-[2px] text-[#6a6a6a]">Don't have an account?
                                <Link className="underline ml-1 cursor-pointer hover:text-[#DA1A32]" to="/Register">
                                    Register
                                </Link>
                            </div>
                        </div>

                        <div className="w-full px-6">
                            <div className="w-full h-[1px] bg-black"></div>
                        </div>

                        <div className="w-full max-h-[400px] px-8">
                            <div className="my-4">
                                {/* Email or Username Field */}
                                <div className="mb-8 relative">
                                    <div className="flex flex-row justify-between">
                                        <label htmlFor="loginId" className="block text-sm font-medium mb-[5px] ml-[2px] text-black">
                                            Email or Username
                                        </label>
                                        {values.loginId && (
                                            <div className="flex items-end mb-[5px]">
                                                <button
                                                    type="button"
                                                    onClick={() => { setFieldValue("loginId", "") }}
                                                    className="text-red-500 text-[13px] mr-[8px]"
                                                >
                                                    Clear
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                    <Field
                                        id="loginId"
                                        name="loginId"
                                        type="text"
                                        placeholder="Enter your email or username"
                                        className={`bg-white border border-black rounded-full px-[15px] text-black placeholder-gray-500 block w-full sm:text-sm h-[37px] focus:outline-none focus:ring-0 ${errors.loginId && touched.loginId ? "border border-red-300" : ""}`}
                                    />
                                    <ErrorMessage name="loginId" component="div" className="text-red-500 text-xs mt-2 absolute -bottom-5 left-[2px]" />
                                </div>

                                {/* Password Field */}
                                <div className="mb-8 relative">
                                    <div className="flex flex-row justify-between">
                                        <label htmlFor="password" className="block text-sm font-medium mb-[5px] ml-[8px] text-black">
                                            Password
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
                            </div>
                        </div>

                        <div className="w-full flex flex-row justify-center ">
                            <div className="w-full px-8 pb-4 gap-[16px] flex flex-row justify-center mt-2">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full h-[37px] hover:scale-105 flex justify-center items-center rounded-full transition-all duration-[600ms] bg-[#DA1A32] text-white"
                                >
                                    {isSubmitting ? (
                                        <IconLoading className="text-black w-5 h-5 animate-spin ml-4" />
                                    ) : <span>Login Now</span>}
                                </button>
                            </div>
                        </div>
                    </Form>
                )
            }}
        </Formik>
    );

    return (
        <VisitorLayout>
            <div className="relative h-screen overflow-y-scroll scrol pt-[80px]">
                <div className="flex flex-row items-center justify-between h-full overflow-hidden">
                    <div className="flex justify-center items-center w-[54%] overflow-hidden">
                        <div className="mx-[10px] my-[10px] relative h-[580px] w-[780px]  overflow-hidden rounded-[30px]">
                            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-black/10 to-black/0" ></div>

                            <video
                                id="De Pastry Lab"
                                className="w-full h-full object-cover"
                                autoPlay
                                muted
                                loop
                                src="/videos/Register.mp4"
                            >
                            </video>

                            <div className="font-ibarra text-white text-[50px] leading-[55px] absolute left-[60px] bottom-[105px] w-[500px] drop-shadow-[0px_2px_5px_rgba(0,0,0,0.55)]">
                                Welcome to De Pastry Lab<span ref={dynamicTextRef} className=""></span>
                            </div>
                            <div className="text-white text-[15px] leading-[55px] absolute left-[65px] bottom-[50px] w-[500px] drop-shadow-[0px_2px_5px_rgba(0,0,0,0.55)]">
                                <span ref={dynamicTextRef} className="">

                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col justify-center w-[46%] h-full">
                        {renderLoginForm()}
                    </div>
                </div>
            </div>
        </VisitorLayout >
    );
};

export default Login;
