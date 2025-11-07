import { FC, useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { RxCross2 } from "react-icons/rx";
import { BsCheck } from "react-icons/bs";
import IconLoading from "./IconLoading.tsx";
import DropUpload from "./DropUpload.tsx";
import Select from 'react-select';
import { updateUser } from '../api/client';

const customStyles = {
    control: (base: any, state: { isFocused: boolean }) => ({
        ...base,
        backgroundColor: "#FFFFFF",
        boxShadow: "none",
        border: state.isFocused ? "1px solid #000000" : "1px solid #000000", // always black border
        borderRadius: "8px",
        height: "37px",
        width: "444px",
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

const pcats = [
    { value: "Bread", label: "Bread" },
    { value: "Pastry", label: "Pastry" },
    { value: "Cookies", label: "Cookies" },
    { value: "Cake", label: "Cake" },
    { value: "Pie & Tarts", label: "Pie & Tarts" },
    { value: "SourDough", label: "SourDough" },
    { value: "Pizza", label: "Pizza" },
    { value: "Scones & Muffins", label: "Scones & Muffins" },
    { value: "Others", label: "Others" },
];

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

type ProfileFormProps = {
    onClose: () => void;
    onSave: (profile: Profile, isEdit: boolean) => void;
    isEdit?: boolean;
    userId: number;
};

const ProfileForm: FC<ProfileFormProps> = ({ onClose, onSave, isEdit = false, userId }) => {

    // ✅ Validation Schema
    const validationSchema = Yup.object({
        fname: Yup.string().required("First Name is required").min(3, "At least 3 characters"),
        lname: Yup.string().required("Last Name is required").min(3, "At least 3 characters"),
        gender: Yup.string().required("Gender is required."),
        DOB: Yup.string().required("Date of Birth is required"),
        plevel: Yup.string().required("Preferred Level is required"),
        pcat: Yup.string().required("Preferred Category is required"),
        username: Yup.string()
            .required("Username is required")
            .min(3, "Minimum 3 characters")
            .max(20, "Max 20 characters")
            .matches(/^[a-zA-Z][a-zA-Z0-9._]*$/, "Invalid username format"),
        email: Yup.string().required("Email is required.").email("Invalid email address"),
        profileimage: Yup.mixed()
            .nullable()
            .test("fileSize", "Image size too large (max 32MB)", (value) => {
                if (!value) return true;
                if (value instanceof File) {
                    return value.size <= 32 * 1024 * 1024;
                }
                return false;
            }),
    });


    // ✅ Initial form values depending on where it's opened from
    const [initialValues, setInitialValues] = useState({
        fname: "",
        lname: "",
        gender: "",
        DOB: "",
        profileimage: null,
        plevel: "",
        pcat: "",
        username: "",
        email: "",
        userId: userId,
    });

    useEffect(() => {
        async function loadUserData() {
            if (isEdit && userId) {
                try {
                    const response = await fetch(`/api/Users/${userId}`);
                    if (!response.ok) throw new Error('Failed to fetch user data');
                    const userData = await response.json();
                    
                    // Map backend data to form fields
                    setInitialValues({
                        fname: userData.firstName || "",
                        lname: userData.lastName || "",
                        gender: userData.gender || "",
                        DOB: userData.dob ? userData.dob.split('T')[0] : "",
                        profileimage: null,
                        plevel: userData.levelId === 1 ? "Beginner" : userData.levelId === 2 ? "Amateur" : "Master",
                        pcat: pcats[userData.categoryId - 1]?.value || "",
                        username: userData.username || "",
                        email: userData.email || "",
                        userId: userData.userId
                    });
                } catch (error) {
                    console.error('Error loading user data:', error);
                    alert('Failed to load user data. Please try again.');
                }
            }
        }
        
        loadUserData();
    }, [isEdit, userId, pcats]);

    return (
        <div className="fixed top-0 left-0 w-full h-full bg-black/30 z-80 flex items-center justify-center">
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

            <div className="bg-white text-black rounded-2xl w-[500px] pt-[16px] pb-[18px] px-[18px] relative shadow-lg">
                <button className="absolute top-3 right-3 text-black">
                    <RxCross2 size={20} onClick={onClose} className="cursor-pointer hover:text-[#eb5757] active:text-[#bf4b4b] transition-all duration-[400ms]" />
                </button>
                <h2 className="text-2xl mb-6 font-semibold">Edit Profile</h2>
                <Formik
                    enableReinitialize
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={async (values, { resetForm, setSubmitting }) => {
                        setSubmitting(true);
                        // Map frontend field names to the backend User model property names
                        const payload: any = {
                            username: values.username,
                            email: values.email,
                            firstName: values.fname,
                            lastName: values.lname,
                            gender: values.gender,
                            // Format date as ISO string for .NET DateTime
                            dob: values.DOB ? new Date(values.DOB).toISOString() : null,
                            // Map string values to IDs
                            levelId: values.plevel === 'Beginner' ? 1 : values.plevel === 'Amateur' ? 2 : 3,
                            categoryId: pcats.findIndex(cat => cat.value === values.pcat) + 1,
                            // Include password if it's required (you might want to handle this differently)
                            password: "changeme" // Required by the model, you should implement proper password handling
                        };

                        // Attach file if present — client.updateUser will build FormData when a File is present
                        const maybeFile = values.profileimage as any;
                        const isFile = maybeFile && typeof maybeFile.size === 'number' && typeof maybeFile.name === 'string';
                        if (isFile) {
                            payload.profileimage = maybeFile;
                        }

                        try {
                            // Call API to update user (userId is passed as prop)
                            const updated = await updateUser(userId, payload);
                            console.log("✅ Profile updated:", updated);

                            // Notify parent and close modal
                            onSave(updated as any, isEdit);
                            resetForm();
                            onClose();
                        } catch (err: any) {
                            console.error("Failed to update profile:", err);
                            // Basic error feedback — you can replace with a toast UI
                            alert(err?.message || "Failed to update profile. See console for details.");
                        } finally {
                            setSubmitting(false);
                        }
                    }}

                >
                    {({ values, isSubmitting, setFieldValue, touched, errors }) => (
                        <Form>
                            <div className="w-full pb-3">
                                <div className="w-full h-[1px] bg-black"></div>
                            </div>

                            <div className=" h-[400px] overflow-y-scroll scrol pr-5">
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
                                    <Field id="username" name="username" type="name" placeholder="Username" className={`bg-white border border-black rounded-[8px] px-[15px] text-black placeholder-gray-500 block w-full sm:text-sm h-[37px] align-text-bottom focus:outline-none focus:ring-0 ${errors.username && touched.username ? "border border-red-300" : ""}`} />
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
                                        className={`bg-white border border-black rounded-[8px] px-[15px] text-black placeholder-gray-500 block w-full sm:text-sm h-[37px] align-text-bottom focus:outline-none focus:ring-0 ${errors.email && touched.email ? "border border-red-300" : ""}`}
                                    />
                                    <ErrorMessage name="email" component="div" className="text-red-500 text-xs mt-2 absolute -bottom-5 left-[2px]" />
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
                                    <Field id="fname" name="fname" type="fname" placeholder="First name" className={`bg-white border border-black rounded-[8px] px-[15px] text-black placeholder-gray-500 block w-full sm:text-sm h-[37px] align-text-bottom focus:outline-none focus:ring-0 ${errors.fname && touched.fname ? "border border-red-300" : ""}`} />
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
                                    <Field id="lname" name="lname" type="lname" placeholder="Last name" className={`bg-white border border-black rounded-[8px] px-[15px] text-black placeholder-gray-500 block w-full sm:text-sm h-[37px] align-text-bottom focus:outline-none focus:ring-0 ${errors.lname && touched.lname ? "border border-red-300" : ""}`} />
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
                                                className="cursor-pointer appearance-none bg-white border border-black rounded-[8px] w-3 h-3 checked:bg-[#DA1A32]"
                                            />
                                            Male
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <Field
                                                type="radio"
                                                name="gender"
                                                value="Female"
                                                className="cursor-pointer appearance-none bg-white border border-black rounded-[8px] w-3 h-3 checked:bg-[#DA1A32]"
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
                                        className={`bg-white border border-black rounded-[8px] cursor-pointer px-[15px] text-black block w-full sm:text-sm h-[37px] focus:outline-none focus:ring-0 ${errors.DOB && touched.DOB ? "border-red-300" : ""
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
                                            options={pcats}
                                            value={pcats.find(option => option.value === values.pcat) || null}
                                            onChange={(selectedOption) => {
                                                setFieldValue("pcat", selectedOption?.value);
                                            }}
                                            styles={customStyles}
                                            placeholder="Select Preferred cat"
                                            isClearable
                                        />
                                    </div>

                                    <ErrorMessage name="pcat" component="div" className="text-red-500 text-xs mt-2 absolute -bottom-5 left-[2px]" />
                                </div>

                            </div>

                            <div className="w-full">
                                <div className="w-full h-[1px] bg-black"></div>
                            </div>

                            <div className="w-full flex flex-row justify-between gap-4 mt-4">
                                {/* Cancel Button */}
                                <button
                                    type="button"// define this function in your component
                                    onClick={onClose}
                                    className="w-[50%] h-[37px] relative group cursor-pointer"
                                >
                                    <div className="w-full h-full flex justify-center items-center rounded-[10px] border border-[#DA1A32] text-[#DA1A32] font-medium hover:scale-105  transition-all duration-[600ms]">
                                        Cancel
                                    </div>
                                </button>

                                {/* Add Task Button */}
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-[50%] h-[37px] relative group cursor-pointer"
                                >
                                    <div className="w-full h-full bg-[#DA1A32] flex justify-center items-center rounded-[10px] text-white font-medium hover:scale-105 transition-all duration-[600ms]">
                                        {isSubmitting ? (
                                            <IconLoading className="text-black w-5 h-5 animate-spin" />
                                        ) : (
                                            <span>Save Changes</span>
                                        )}
                                    </div>
                                </button>
                            </div>

                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
};

export default ProfileForm;
