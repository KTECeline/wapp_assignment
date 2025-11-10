import { FC, useEffect, useRef, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import IconLoading from "../components/IconLoading.tsx";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import DropUpload from "../components/DropUpload.tsx";
import { RxCross2 } from "react-icons/rx";
import VisitorLayout from "../components/VisitorLayout.tsx";
import Select from 'react-select';
import { Link } from "react-router-dom";
import { createUser, getCategories } from "../api/client.js";

interface Category {
    categoryId: number;
    title: string;
    description: string;
}

const customStyles = {
    control: (base: any, state: { isFocused: boolean }) => ({
        ...base,
        backgroundColor: "#FFFFFF",
        boxShadow: "none",
        border: state.isFocused ? "1px solid #000000" : "1px solid #000000", // always black border
        borderRadius: "9999px", // fully rounded (rounded-full)
        height: "37px",
        width: "556px",
        paddingLeft: "10px",
        fontSize: "0.875rem",
        color: "#111827",
        "&:hover": {
            border: "1px solid #000000", // stays black on hover
        },
    }),
    input: (base: any) => ({
        ...base,
        color: "#111827",
    }),
    placeholder: (base: any) => ({
        ...base,
        color: "#9CA3AF", // gray-400
    }),
    singleValue: (base: any) => ({
        ...base,
        color: "#111827", // dark text
    }),
    menu: (base: any) => ({
        ...base,
        backgroundColor: "#FFFFFF",
        color: "#111827",
        borderRadius: "12px",
        border: "1px solid #000000",
        zIndex: 10,
        padding: "4px",
        overflowY: "auto",
    }),
    menuList: (base: any) => ({
        ...base,
        padding: 0,
        maxHeight: "300px",
        overflowY: "auto",
        scrollbarWidth: "thin",
    }),
    option: (
        base: any,
        state: { isSelected: boolean; isFocused: boolean }
    ) => ({
        ...base,
        backgroundColor: state.isSelected
            ? "#DA1A32"
            : state.isFocused
                ? "#F8F5F0" // your requested hover color
                : "#FFFFFF",
        color: state.isSelected ? "#ffffff" : "#111827",
        cursor: "pointer",
        fontSize: "0.875rem",
        borderRadius: "8px",
    }),
    dropdownIndicator: (base: any) => ({
        ...base,
        color: "#111827",
        "&:hover": {
            color: "#000000",
        },
    }),
    indicatorSeparator: () => ({
        display: "none",
    }),
};


const plevels = [
    { value: "Beginner", label: "Beginner" },
    { value: "Amateur", label: "Amateur" },
    { value: "Master", label: "Master" },
];

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

const Registration: FC = () => {
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

    const [emailExists, setEmailExists] = useState(false);
    const [categories, setCategories] = useState<Array<{ value: string; label: string }>>([]);

    useEffect(() => {
        let mounted = true;
        
        const fetchCategories = async () => {
            try {
                // First try to fetch hardcoded categories for testing
                const testCategories = [
                    { categoryId: 1, title: "Bread" },
                    { categoryId: 2, title: "Pastry" },
                    { categoryId: 3, title: "Cookies" },
                    { categoryId: 4, title: "Cake" },
                    { categoryId: 5, title: "Pie & Tarts" },
                    { categoryId: 6, title: "Sourdough" },
                    { categoryId: 7, title: "Pizza" },
                    { categoryId: 8, title: "Scones & Muffins" },
                    { categoryId: 9, title: "Others" }
                ];

                if (mounted) {
                    const formattedCategories = testCategories.map(cat => ({
                        value: String(cat.categoryId),
                        label: cat.title
                    }));
                    console.log('Using test categories:', formattedCategories);
                    setCategories(formattedCategories);
                }

                // Then try the API call
                console.log('Also fetching from API...');
                const response = await fetch('/api/Categories');
                console.log('API Response:', response.status, response.statusText);
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const categoriesData = await response.json();
                console.log('API categories received:', categoriesData);
                
                if (mounted && categoriesData && categoriesData.length > 0) {
                    const formattedCategories = categoriesData.map((cat: Category) => ({
                        value: String(cat.categoryId),
                        label: cat.title
                    }));
                    console.log('Using API categories:', formattedCategories);
                    setCategories(formattedCategories);
                }
            } catch (error) {
                console.error('Failed to fetch categories from API:', error);
                // API error is logged but won't affect the UI since we have test categories
            }
        };
        
        fetchCategories();
        
        return () => {
            mounted = false;
        };
    }, []);

    const validationSchema = Yup.object({
        // Step 1
        fname: Yup.string().when("step", ([step], schema) =>
            step === 1
                ? schema.required("First Name is required").min(3, "First Name must be at least 3 characters")
                : schema
        ),

        lname: Yup.string().when("step", ([step], schema) =>
            step === 1
                ? schema.required("Last Name is required").min(3, "Last Name must be at least 3 characters")
                : schema
        ),

        gender: Yup.string().when("step", ([step], schema) =>
            step === 1 ? schema.required("Gender is required.") : schema
        ),

        DOB: Yup.string().when("step", ([step], schema) =>
            step === 1
                ? schema.required("Date of Birth is required")
                : schema
        ),

        profileimage: Yup.mixed().nullable().when("step", ([step], schema) =>
            step === 1
                ? schema.test(
                    "fileSize",
                    "Image size is too large! (Max 32MB)",
                    (value) => {
                        if (!value) return true; // allow empty
                        if (value instanceof File) {
                            return value.size <= 32 * 1024 * 1024;
                        }
                        return false;
                    }
                )
                : schema
        ),

        plevel: Yup.string().when("step", ([step], schema) =>
            step === 1
                ? schema.required("Preferred Level is required")
                : schema
        ),

        pcat: Yup.string().when("step", ([step], schema) =>
            step === 1
                ? schema.required("Preferred Category is required")
                : schema
        ),


        // Step 2
        username: Yup.string().when("step", ([step], schema) =>
            step === 2
                ? schema
                    .required("Username is required")
                    .min(3, "Username must be at least 3 characters")
                    .max(20, "Username cannot be more than 20 characters")
                    .matches(/^[a-zA-Z][a-zA-Z0-9._]*$/,
                        "Username must start with a letter and can only contain letters, numbers, dots, and underscores"
                    )
                    .matches(/^(?!.*[._]{2})/,
                        "Username cannot contain consecutive dots or underscores"
                    )
                    .matches(/^(?!.*[._]$)/,
                        "Username cannot end with a dot or underscore"
                    )
                : schema
        ),

        email: Yup.string().when("step", ([step], schema) =>
            step === 2
                ? schema.required("Email is required.").email("Invalid email address")
                : schema
        ),

        password: Yup.string().when("step", ([step], schema) =>
            step === 2
                ? schema
                    .required("Password is required.")
                    .min(8, "Password must be at least 8 characters.")
                    .matches(/[a-z]/, "Password must contain at least one lowercase letter.")
                    .matches(/[A-Z]/, "Password must contain at least one uppercase letter.")
                    .matches(/\d/, "Password must contain at least one digit.")
                    .matches(/[@$!%*?&#]/, "Password must contain at least one special character.")
                : schema
        ),

        confirmPassword: Yup.string().when("step", ([step], schema) =>
            step === 2
                ? schema
                    .oneOf([Yup.ref("password"), undefined], "Passwords must match.")
                    .required("Please confirm your password.")
                : schema
        ),
    });

    // const onSubmit = async (
    //     values: FormValues,
    //     formikHelpers: any
    // ) => {
    //     formikHelpers.setSubmitting(true);

    //     try {
    //         let imageUrl = null;

    //         // 1. Upload profile image if provided
    //         if (values.profileimage) {
    //             const fileExt = values.profileimage.name.split('.').pop();
    //             const fileName = `${Date.now()}_${values.username}.${fileExt}`;
    //             const filePath = `user_${values.username}/${fileName}`;

    //             const { data: uploadData, error: uploadError } = await supabase.storage
    //                 .from('profile-img')
    //                 .upload(filePath, values.profileimage);

    //             if (uploadError) throw uploadError;

    //             // Get public URL
    //             const { data: publicUrlData } = supabase.storage
    //                 .from('profile-img')
    //                 .getPublicUrl(filePath);

    //             imageUrl = publicUrlData.publicUrl;
    //         }

    //         // 2. Hash password
    //         const hashedPassword = await bcrypt.hash(values.password, 10);

    //         // 3. Insert into Supabase DB
    //         const { error: insertError } = await supabase.from('user').insert([
    //             {
    //                 name: values.name,
    //                 gender: values.gender,
    //                 birthYear: values.birthYear,
    //                 profileimage: imageUrl,
    //                 jobfield: values.jobfield,
    //                 school: values.school,
    //                 levelofstudy: values.levelofstudy,
    //                 username: values.username,
    //                 email: values.email,
    //                 password: hashedPassword,
    //             }
    //         ]);

    //         if (insertError) throw insertError;

    //         alert('User registered successfully!');
    //         router.push("/dashboard");
    //         formikHelpers.resetForm();
    //     } catch (error: any) {
    //         console.error("Error during registration:", error);

    //         if (
    //             error.message &&
    //             error.message.includes('duplicate key value violates unique constraint') &&
    //             error.message.includes('user_email_key')
    //         ) {
    //             setEmailExists(true); // 🔔 Show custom modal for email exists
    //         } else {
    //             alert(`Something went wrong: ${error.message || JSON.stringify(error)}`);
    //         }
    //     }
    //     finally {
    //         formikHelpers.setSubmitting(false);
    //     }
    // };

    const [showPassword, setShowPassword] = useState(false);

    const [step, setStep] = useState(1);

    const handleBack = () => {
        setStep(1);
    };

    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const renderRegistrationForm = () => (
        <Formik
            initialValues={{
                fname: "",
                lname: "",
                gender: "",
                DOB: "",
                profileimage: null,
                plevel: "",
                pcat: "",

                username: "",
                email: "",
                password: "",
                confirmPassword: "",

                step: 1
            }}

            validationSchema={validationSchema}
            validateOnChange={true}

            onSubmit={async (values, { setSubmitting, validateForm, setFieldValue }) => {
                try {
                    if (step === 2) {
                        // Create the user data object
                        const userData = {
                            username: values.username,
                            email: values.email,
                            password: values.password,
                            firstName: values.fname,
                            lastName: values.lname,
                            gender: values.gender,
                            DOB: values.DOB,
                            profileimage: values.profileimage,
                            levelId: values.plevel ? (values.plevel === "Beginner" ? 1 : values.plevel === "Amateur" ? 2 : 3) : null,
                            categoryId: values.pcat ? parseInt(values.pcat, 10) : null
                        };

                        // Call the API to create user
                        await createUser(userData);
                        
                        // Show success message and redirect
                        alert("Registration successful!");
                        window.location.href = "/login";
                    } else {
                        // Move to step 2 if all step 1 validations pass
                        const step1Fields = ["fname", "lname", "gender", "DOB", "profileimage", "plevel", "pcat"];
                        const errors = await validateForm();
                        const step1Errors = Object.keys(errors)
                            .filter(field => step1Fields.includes(field));
                        
                        if (step1Errors.length === 0) {
                            setStep(2);
                            setFieldValue("step", 2);
                        }
                    }
                } catch (error: any) {
                    console.error("Registration error:", error);
                    alert(error.message || "Failed to register. Please try again.");
                } finally {
                    setSubmitting(false);
                }
            }
            }

        >
            {({ isSubmitting, values, setFieldValue, touched, errors, resetForm, isValid, validateForm, setTouched }) => {


                const buttonType = !values.email && step === 1 ? "submit" : "button";

                return (
                    <Form className="mx-auto w-[620px] h-full pt-[28px] overflow-hidden">
                        <style>
                            {`
                                   .scrol::-webkit-scrollbar {
                                        width: 5px;
                                        height: 5px;
                                    }

                                    .scrol::-webkit-scrollbar-track {
                                        background: rgba(188, 188, 188, 0.2); /* Darker transparent track */
                                        border-radius: 10px;
                                        cursor: pointer; /* Pointer cursor on track hover */
                                    }

                                    .scrol::-webkit-scrollbar-thumb {
                                        background: rgba(0, 0, 0, 0.2); /* Lighter thumb for contrast */
                                        border-radius: 10px;
                                        transition: background 0.3s ease-in-out;
                                        cursor: grab; /* Grab cursor for thumb */
                                    }

                                    .scrol::-webkit-scrollbar-thumb:active {
                                        cursor: grabbing; /* Grabbing cursor when dragging */
                                    }
                                    `}
                        </style>

                        <div className="mb-[20px] w-full flex flex-col items-center">
                            <div className="font-ibarra text-[24px] font-bold flex flex-row items-center gap-[8px] mx-auto">
                                <div className="w-[16px] h-[1px] bg-[#DA1A32]" />
                                Registration
                                <div className="w-[16px] h-[1px] bg-[#DA1A32]" />
                            </div>

                            <div className="text-[11px] font flex flex-row mt-[2px] text-[#6a6a6a]">Already have an account?
                                <Link className="underline ml-1 cursor-pointer hover:text-[#DA1A32]" to="/Login">
                                    Login
                                </Link>
                            </div>
                        </div>

                        <div className="w-full h-[26px] mb-[14px] flex flex-row ml-6 gap-[12px] font-semibold text-[16px]">

                            <button
                                type="button"
                                className={`hover:scale-105 transition-all duration-[600ms] -translate-y-[4px] z-50 ${step === 2 ? "cursor-pointer border-black/40" : "border-black"} flex relative flex-row items-center justify-center py-[10px] pl-[4px] pr-[20px] h-[34px] rounded-full group bg-white  border`}
                                onClick={() => {
                                    if (step === 2) {
                                        handleBack();
                                        setFieldValue("step", 1);
                                    }
                                }}
                            >
                                <div className={`transition-all rounded-full duration-[100ms] w-[24px] h-[24px] scale-100 justify-center items-center flex ${step === 1 ? "bg-[#DA1A32] text-white" : "bg-[#DA1A32]/20 text-white/60"}`}>
                                    1
                                </div>

                                <span className={`mt-[1px] transition-all z-10 text-[15px] font-[300] text-black duration-[600ms] ml-[12px] ${step === 1 ? "text-black" : "text-black/60"}`}>
                                    Personal
                                </span>
                            </button>

                            <button
                                className={`hover:scale-105 transition-all duration-[600ms] -translate-y-[4px] z-50 ${step === 1 ? "cursor-pointer border-black/40" : "border-black"} flex relative flex-row items-center justify-center py-[10px] pl-[4px] pr-[20px] h-[34px] border rounded-full group bg-white`}
                                type={buttonType}
                                onClick={() => {
                                    if (step === 1) {
                                        validateForm().then((formErrors) => {
                                            // Only check step 1 errors
                                            const step1Errors = Object.keys(formErrors).filter((field) =>
                                                ["fname", "lname", "gender", "DOB", "profileimage", "plevel", "pcat"].includes(field)
                                            );

                                            if (step1Errors.length === 0) {
                                                setStep(2);
                                                setFieldValue("step", 2);
                                            }
                                        });
                                    }
                                }}
                            >
                                <div className={`transition-all rounded-full duration-[100ms] w-[24px] h-[24px] scale-100 justify-center items-center flex ${step === 2 ? "bg-[#DA1A32] text-[#ffffff]" : "bg-[#DA1A32]/20 text-[#ffffff]/60"}`}>
                                    2
                                </div>

                                <span className={`mt-[1px] transition-all z-10 text-[15px] font-[300] duration-[300ms] ml-[12px] ${step === 2 ? "text-black" : "text-black/40"}`}>
                                    Account
                                </span>
                            </button>
                        </div>

                        {step === 1 && (
                            <div>
                                <div className="w-full px-6">
                                    <div className="w-full h-[1px] bg-black"></div>
                                </div>

                                <div className="overflow-y-scroll w-full max-h-[400px] px-8 scrol">
                                    <div className="my-4">
                                        <div className=" flex flex-col mb-6">
                                            <div className="font-inter text-[20px] font-semibold ">
                                                Tells us a bit about yourself
                                            </div>
                                            <div className="font-inter text-[10px] font-light text-[#2f2f2f]">Fill in your personal details to help us know you better.</div>
                                        </div>

                                        {/* Fname Field*/}
                                        <div className="mb-8 relative">
                                            <div className="flex flex-row justify-between">
                                                <label htmlFor="fname" className="block text-sm font-medium mb-[5px] ml-[2px] text-black">First Name</label>
                                                {values.fname && (
                                                    <div className="flex items-end mb-[5px]">
                                                        <button
                                                            type="button"
                                                            onClick={() => { setFieldValue("fname", "") }}
                                                            className="text-red-500 text-[13px] mr-[8px]"
                                                        >
                                                            Clear
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                            <Field id="fname" name="fname" type="fname" placeholder="First name" className={`bg-white border border-black rounded-full px-[15px] text-black placeholder-gray-500 block w-full sm:text-sm h-[37px] align-text-bottom focus:outline-none focus:ring-0 ${errors.fname && touched.fname ? "border border-red-300" : ""}`} />
                                            <ErrorMessage name="fname" component="div" className="text-red-500 text-xs mt-2 absolute -bottom-5 left-[2px]" />
                                        </div>

                                        {/* Lname Field*/}
                                        <div className="mb-8 relative">
                                            <div className="flex flex-row justify-between">
                                                <label htmlFor="lname" className="block text-sm font-medium mb-[5px] ml-[2px] text-black">Last Name</label>
                                                {values.lname && (
                                                    <div className="flex items-end mb-[5px]">
                                                        <button
                                                            type="button"
                                                            onClick={() => { setFieldValue("lname", "") }}
                                                            className="text-red-500 text-[13px] mr-[8px]"
                                                        >
                                                            Clear
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                            <Field id="lname" name="lname" type="lname" placeholder="Last name" className={`bg-white border border-black rounded-full px-[15px] text-black placeholder-gray-500 block w-full sm:text-sm h-[37px] align-text-bottom focus:outline-none focus:ring-0 ${errors.lname && touched.lname ? "border border-red-300" : ""}`} />
                                            <ErrorMessage name="lname" component="div" className="text-red-500 text-xs mt-2 absolute -bottom-5 left-[2px]" />
                                        </div>

                                        {/* Gender Field */}
                                        <div className="mb-8 relative">
                                            <div className="flex flex-row justify-between">
                                                <label className="block text-sm font-medium mb-[5px] ml-[2px] text-black">Gender</label>
                                                {values.gender && (
                                                    <div className="flex items-end mb-[5px]">
                                                        <button
                                                            type="button"
                                                            onClick={() => { setFieldValue("gender", "") }}
                                                            className="text-red-500 text-[13px] mr-[8px]"
                                                        >
                                                            Clear
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex gap-4 text-sm text-black pt-[3px] pb-1">
                                                <label className="flex items-center gap-2 cursor-pointer ml-[8px]">
                                                    <Field
                                                        type="radio"
                                                        name="gender"
                                                        value="Male"
                                                        className="cursor-pointer appearance-none bg-white border border-black rounded-full w-3 h-3 checked:bg-[#DA1A32]"
                                                    />
                                                    Male
                                                </label>
                                                <label className="flex items-center gap-2 cursor-pointer">
                                                    <Field
                                                        type="radio"
                                                        name="gender"
                                                        value="Female"
                                                        className="cursor-pointer appearance-none bg-white border border-black rounded-full w-3 h-3 checked:bg-[#DA1A32]"
                                                    />
                                                    Female
                                                </label>
                                            </div>
                                            <ErrorMessage name="gender" component="div" className="text-red-500 text-xs mt-2 absolute -bottom-5 left-[2px]" />
                                        </div>

                                        {/* Date of Birth Field */}
                                        <div className="mb-8 relative">
                                            <div className="flex flex-row justify-between">
                                                <label
                                                    htmlFor="DOB"
                                                    className="block text-sm font-medium mb-[5px] ml-[2px] text-black"
                                                >
                                                    Date of Birth
                                                </label>
                                                {values.DOB && (
                                                    <div className="flex items-end mb-[5px]">
                                                        <button
                                                            type="button"
                                                            onClick={() => setFieldValue("DOB", "")}
                                                            className="text-red-500 text-[13px] mr-[8px]"
                                                        >
                                                            Clear
                                                        </button>
                                                    </div>
                                                )}
                                            </div>

                                            <Field
                                                type="date"
                                                id="DOB"
                                                name="DOB"
                                                className={`bg-white border border-black rounded-full cursor-pointer px-[15px] text-black block w-full sm:text-sm h-[37px] focus:outline-none focus:ring-0 ${errors.DOB && touched.DOB ? "border-red-300" : ""
                                                    }`}
                                            />

                                            <ErrorMessage
                                                name="DOB"
                                                component="div"
                                                className="text-red-500 text-xs mt-2 absolute -bottom-5 left-[2px]"
                                            />
                                        </div>

                                        {/* Profile Pic Field */}
                                        <div className="mb-8 relative">
                                            <div className="flex flex-row justify-between">
                                                <label htmlFor="name" className="block text-sm font-medium mb-[5px] ml-[2px] text-black">Profile Picture</label>
                                                {values.profileimage && (
                                                    <div className="flex items-end mb-[5px]">
                                                        <button
                                                            type="button"
                                                            onClick={() => { setFieldValue("profileimage", null) }}
                                                            className="text-red-500 text-[13px] mr-[8px]"
                                                        >
                                                            Clear
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="bg-white border-dotted">
                                                <DropUpload
                                                    className="flex "
                                                    onChange={(value) => setFieldValue("profileimage", value)}
                                                    value={values.profileimage as unknown as globalThis.File}
                                                    description="PNG, JPG, GIF, WEBP up to 32MB"
                                                    disabled={isSubmitting}
                                                />
                                            </div>
                                            <ErrorMessage name="profileimage" component="div" className="text-red-500 text-xs mt-1 absolute -bottom-5 left-[2px]" />
                                        </div>

                                        {/* Preferred Level */}
                                        <div className="mb-8 relative">
                                            <div className="flex flex-row justify-between">
                                                <label htmlFor="plevel" className="block text-sm font-medium mb-[5px] ml-[2px] text-black">
                                                    Preferred Level
                                                </label>
                                                {values.plevel && (
                                                    <div className="flex items-end mb-[5px]">
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setFieldValue("plevel", "");
                                                            }}
                                                            className="text-red-500 text-[13px] mr-[8px]"
                                                        >
                                                            Clear
                                                        </button>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex flex-row h-[37px] items-center">
                                                <Select
                                                    options={plevels}
                                                    value={plevels.find(option => option.value === values.plevel) || null}
                                                    onChange={(selectedOption) => {
                                                        setFieldValue("plevel", selectedOption?.value);
                                                    }}
                                                    styles={customStyles}
                                                    placeholder="Select Preferred Level"
                                                    isClearable
                                                />
                                            </div>

                                            <ErrorMessage name="plevel" component="div" className="text-red-500 text-xs mt-2 absolute -bottom-5 left-[2px]" />
                                        </div>

                                        {/* Preferred Category */}
                                        <div className="mb-8 relative">
                                            <div className="flex flex-row justify-between">
                                                <label htmlFor="pcat" className="block text-sm font-medium mb-[5px] ml-[2px] text-black">
                                                    Preferred Category
                                                </label>
                                                {values.pcat && (
                                                    <div className="flex items-end mb-[5px]">
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setFieldValue("pcat", "");
                                                            }}
                                                            className="text-red-500 text-[13px] mr-[8px]"
                                                        >
                                                            Clear
                                                        </button>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex flex-row h-[37px] items-center">
                                                <Select
                                                    options={categories}
                                                    value={categories.find(option => option.value === values.pcat) || null}
                                                    onChange={(selectedOption) => {
                                                        setFieldValue("pcat", selectedOption?.value);
                                                        console.log("Selected category:", selectedOption);
                                                    }}
                                                    styles={customStyles}
                                                    placeholder="Select Preferred Category"
                                                    isClearable
                                                />
                                            </div>

                                            <ErrorMessage name="pcat" component="div" className="text-red-500 text-xs mt-2 absolute -bottom-5 left-[2px]" />
                                        </div>
                                    </div>
                                </div>

                                <div className="w-full px-6 pb-3">
                                    <div className="w-full h-[1px] bg-black"></div>
                                </div>

                                <div className="w-full flex flex-row justify-end">
                                    <div className="w-[160px] px-6 pb-4 gap-[12px] flex flex-row justify-between">
                                        <button
                                            type="submit"
                                            onClick={() => {
                                                setTouched({ email: false, password: false }, false);
                                                validateForm().then((formErrors) => {
                                                    if (Object.keys(formErrors).length === 0) {
                                                        setStep(2);
                                                        setFieldValue("step", 2);
                                                    }
                                                });
                                            }}
                                            className="w-full h-[37px] hover:scale-105 flex justify-center items-center rounded-full transition-all duration-[600ms] bg-[#DA1A32] text-white"
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div>
                                <div className="w-full px-6">
                                    <div className="w-full h-[1px] bg-black"></div>
                                </div>

                                <div className="overflow-y-scroll w-full max-h-[400px] px-8 scrol">
                                    <div className="my-4">
                                        <div className=" flex flex-col mb-6">
                                            <div className="text-[20px] font-semibold ">You’re Almost Done!</div>
                                            <div className="text-[11px] font-light">Fill in your email and password to secure your account.</div>
                                        </div>

                                        {/* Username */}
                                        <div className="mb-8 relative">
                                            <div className="flex flex-row justify-between">
                                                <label htmlFor="username" className="block text-sm font-medium mb-[5px] ml-[2px] text-black">Username</label>
                                                {values.username && (
                                                    <div className="flex items-end mb-[5px]">
                                                        <button
                                                            type="button"
                                                            onClick={() => { setFieldValue("username", "") }}
                                                            className="text-red-500 text-[13px] mr-[8px]"
                                                        >
                                                            Clear
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                            <Field id="username" name="username" type="name" placeholder="Username" className={`bg-white border border-black rounded-full px-[15px] text-black placeholder-gray-500 block w-full sm:text-sm h-[37px] align-text-bottom focus:outline-none focus:ring-0 ${errors.username && touched.username ? "border border-red-300" : ""}`} />
                                            <ErrorMessage name="username" component="div" className="text-red-500 text-xs mt-2 absolute -bottom-5 left-[2px]" />
                                        </div>

                                        {/* Email Field */}
                                        < div className="mb-8 relative">
                                            <div className="flex flex-row justify-between">
                                                <label htmlFor="email" className="block text-sm font-medium mb-[5px] ml-[2px] text-black">Email</label>
                                                {values.email && (
                                                    <div className="flex items-end mb-[5px]">
                                                        <button
                                                            type="button"
                                                            onClick={() => { setFieldValue("email", "") }}
                                                            className="text-red-500 text-[13px] mr-[8px]"
                                                        >
                                                            Clear
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                            <Field
                                                id="email"
                                                name="email"
                                                type="email"
                                                placeholder="Enter your email"
                                                className={`bg-white border border-black rounded-full px-[15px] text-black placeholder-gray-500 block w-full sm:text-sm h-[37px] align-text-bottom focus:outline-none focus:ring-0 ${errors.email && touched.email ? "border border-red-300" : ""}`}
                                            />
                                            <ErrorMessage name="email" component="div" className="text-red-500 text-xs mt-2 absolute -bottom-5 left-[2px]" />
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
                                                    placeholder="Enter a strong password"
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

                                        <p className="text-xs text-center mb-8 font-light">
                                            We are governed by PDPA Act 2010. Your Data privacy is
                                            respected
                                            <br />
                                            By clicking “Register Now”, you agree to our
                                            <a
                                                href="https:/privacy-notice"
                                                className="text-[#DA1A32] font-semibold"
                                            >
                                                {" "}
                                                Terms & Conditions{" "}
                                            </a>
                                            and
                                            <a
                                                href="https:/privacy-policy"
                                                className="text-[#DA1A32] font-semibold"
                                            >
                                                {" "}
                                                Privacy Policy{" "}
                                            </a>
                                            .
                                        </p>

                                    </div>
                                </div>

                                <div className="w-full px-6 pb-3">
                                    <div className="w-full h-[1px] bg-black"></div>
                                </div>

                                {emailExists && (
                                    <div className="absolute top-0 left-0 w-full h-full inset-0 bg-black/50 flex justify-center items-center transition-opacity duration-300 z-50">
                                        <div onClick={() => setEmailExists(false)} className="absolute top-0 left-0 w-full h-full z-0" />

                                        <div className="bg-white border border-black rounded-full rounded-[15px] w-[410px] shadow-md transform transition-all overflow-hidden duration-300 scale-100 opacity-100 z-10 absolute">
                                            <div className="w-full bg-[#171c20] flex flex-row justify-between h-[55px] items-center pl-4 pr-2">
                                                <h2 className="text-[18px] font-bold text-[#f1f1f1]">
                                                    Email already registered
                                                </h2>
                                                <div className="flex justify-center items-center w-[30px] h-full text-gray-600">
                                                    <RxCross2 size={20} onClick={() => setEmailExists(false)} className="cursor-pointer hover:text-[#eb5757] active:text-[#bf4b4b] transition-all duration-[400ms]" />
                                                </div>
                                            </div>

                                            <p className="text-[#f1f1f1] text-[13px] flex flex-row justify-between h-[68px] items-center pl-4 font-light">
                                                This email is already in use. Please log in instead or try another email.
                                            </p>

                                            <div className="w-full h-[1px] bg-gray-300"></div>

                                            <div className="w-full flex flex-row justify-end p-4">
                                                <div className="gap-[10px] flex flex-row justify-between text-[16px]">
                                                    <button
                                                        type="button"
                                                        onClick={() => setEmailExists(false)}
                                                        className="w-[209px] h-[34px] relative group"
                                                    >
                                                        <div className="z-10 w-full h-full absolute hover:scale-[102%] top-0 flex justify-center items-center rounded-[7px] transition-all duration-[700ms] border-[#4F6DDD] text-[#f1f1f1] cursor-pointer border">
                                                            Try another email
                                                        </div>
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setEmailExists(false);
                                                            // router.push("/login");
                                                        }}
                                                        className="w-[105px] h-[34px] relative group"
                                                    >
                                                        <div className="z-10 w-full h-full absolute top-0 flex justify-center items-center rounded-[7px] transition-all duration-[700ms] bg-gradient-to-r from-[#8567f1] to-[#4F6DDD] hover:scale-[102%] text-white cursor-pointer">
                                                            Login
                                                        </div>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}


                                <div className="w-full flex flex-row justify-end">
                                    <div className="w-[340.6px] px-6 pb-4 gap-[12px] flex flex-row justify-between">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                handleBack();
                                                setFieldValue("step", 1)
                                            }}
                                            className="w-[36%] h-[37px] relative group cursor-pointer rounded-full bg-white mx-[2px] flex justify-center items-center text-black font-inter border-black border hover:scale-105 transition-all duration-[600ms]"
                                        >
                                            Back
                                        </button>

                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-[64%] h-[37px] hover:scale-105 flex justify-center items-center rounded-full transition-all duration-[600ms] bg-[#DA1A32] text-white"
                                        >
                                            {isSubmitting ? (
                                                <IconLoading className="text-black w-5 h-5 animate-spin ml-4" />
                                            ) : <span>Register Now</span>}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}</Form>
                )
            }}
        </Formik>
    );

    return (
        <VisitorLayout>
            <div className="relative h-screen overflow-y-scroll scroll pt-[80px] -mt-[80px]">
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
                                Welcome to De Pastry Lab
                            </div>
                            <div className="text-white text-[15px] leading-[55px] absolute left-[65px] bottom-[50px] w-[500px] drop-shadow-[0px_2px_5px_rgba(0,0,0,0.55)]">
                                <span ref={dynamicTextRef} className=""></span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col justify-center w-[46%] h-full">
                        {renderRegistrationForm()}
                    </div>
                </div>
            </div>
        </VisitorLayout >
    );
};

export default Registration;
