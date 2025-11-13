import { FC, useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { RxCross2 } from "react-icons/rx";
import IconLoading from "./IconLoading.tsx";
import { FaStar } from "react-icons/fa";
import { getUserCourses } from "../api/client.js";

type Review = {
    id: string;
    title: string;
    description: string;
    course_id: number;
    reviewtype: string;
    rating: number;
    userId: number;
};

type ReviewFormProps = {
    onClose: () => void;
    onSave: (review: Review, isEdit: boolean) => void;
    isEdit?: boolean;
    reviewId?: number | null;
    userId: number;
    courseId?: number | null;
    reviewtype?: string;
    from: string; // "home" | "course"
};

const ReviewForm: FC<ReviewFormProps> = ({ onClose, onSave, isEdit = false, reviewId, userId, courseId, reviewtype, from }) => {
    const [courses, setCourses] = useState<any[]>([]);
    const [reviewType, setReviewType] = useState<string>("website");
    const [coursesLoading, setCoursesLoading] = useState(false);

    // ✅ Validation Schema
    const validationSchema = Yup.object().shape({
        title: Yup.string().required("Required"),
        description: Yup.string().required("Required"),
        reviewtype: Yup.string().required("Required"),
        rating: Yup.number().required("Please give a rating").min(1).max(5),
    });

    // Fetch user's enrolled courses
    useEffect(() => {
        const fetchUserCourses = async () => {
            if (from === "home") {
                try {
                    setCoursesLoading(true);
                    const user = JSON.parse(localStorage.getItem('user') || '{}');
                    
                    if (user?.userId) {
                        const data = await getUserCourses(user.userId);
                        // Map to the format expected by the form
                        const formattedCourses = data.map((course: any) => ({
                            id: course.courseId,
                            title: course.title
                        }));
                        setCourses(formattedCourses);
                    } else {
                        setCourses([]);
                    }
                } catch (error) {
                    console.error("Error fetching user courses:", error);
                    setCourses([]);
                } finally {
                    setCoursesLoading(false);
                }
            }
        };

        fetchUserCourses();
    }, [from]);

    // ✅ Initial form values depending on where it's opened from
    const [initialValues, setInitialValues] = useState({
        title: "",
        description: "",
        reviewtype: from === "course" ? "course" : "website",
        course_id: from === "course" ? courseId : null,
        rating: 0,
        userId: userId
    });

    useEffect(() => {
        if (from === "course") setReviewType("course");
        else setReviewType("website");
    }, [from]);

    // 🧠 Placeholder for backend fetch when editing
    useEffect(() => {
        if (isEdit && reviewId) {
            // 🔒 Uncomment when backend ready:
            /*
            const fetchPost = async () => {
                const { data, error } = await supabase
                    .from("post")
                    .select("*")
                    .eq("id", postId)
                    .single();
                if (!error && data) {
                    setPostType(data.posttype);
                    setInitialValues({
                        ...data,
                        postimage: null,
                    });
                }
            };
            fetchPost();
            */

            // 🧩 Temporary mock (for UI testing)
            setInitialValues({
                title: "Sample Post Title",
                description: "This is an editable mock post description.",
                reviewtype: "course",
                course_id: 1,
                rating: 4,
                userId: 1
            });
        }
    }, [isEdit, reviewId]);

    return (
        <div className="fixed top-0 left-0 w-full h-full bg-black/30 z-80 flex items-center justify-center">
            <div className="bg-white text-black rounded-2xl w-[500px] pt-[16px] pb-[18px] px-[18px] relative shadow-lg">
                <button className="absolute top-3 right-3 text-black">
                    <RxCross2 size={20} onClick={onClose} className="cursor-pointer hover:text-[#eb5757] active:text-[#bf4b4b] transition-all duration-[400ms]" />
                </button>
                <h2 className="text-2xl mb-6 font-semibold">Add New Review</h2>
                <Formik
                    enableReinitialize
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={(values, { resetForm }) => {
                        // 🔒 When backend ready, replace this with submit logic
                        console.log("🧩 Form submitted (mock):", values);

                        // ✅ Pass back to parent for frontend preview
                        onSave(values as any, isEdit);
                        resetForm();
                        onClose();
                    }}

                >
                    {({ values, isSubmitting, setFieldValue, touched, errors }) => (
                        <Form>
                            {/* ⭐ Rating Section */}
                            <div className="mb-6 relative">
                                {/* Label + current rating indicator */}
                                <div className="flex flex-row justify-between items-center mb-[5px]">
                                    <label className="block text-sm font-medium ml-[2px] text-black">
                                        Rating
                                    </label>
                                    {values.rating ? (
                                        <span className="text-[13px] text-gray-800">{values.rating}/5</span>
                                    ) : (
                                        <span className="text-[13px] text-gray-400">No rating yet</span>
                                    )}
                                </div>

                                {/* Stars */}
                                <div className="flex gap-[6px] mt-[4px]">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setFieldValue("rating", star)}
                                            className="focus:outline-none transition-transform active:scale-95"
                                        >
                                            <FaStar
                                                size={22}
                                                className={`transition-colors duration-[300ms] ${star <= values.rating
                                                        ? "text-[#DA1A32]"
                                                        : "text-gray-300    "
                                                    }`}
                                            />
                                        </button>
                                    ))}
                                </div>

                                {/* Validation error display */}
                                {touched.rating && errors.rating && (
                                    <p className="text-red-500 text-xs mt-1">{errors.rating}</p>
                                )}
                            </div>


                            {/* Title */}
                            <div className="mb-6 relative">
                                <div className="flex flex-row justify-between">
                                    <label htmlFor="title" className="block text-sm font-medium mb-[5px] ml-[2px] text-black">Title</label>
                                    <div className="flex items-end mb-[5px]">
                                        {values.title && (
                                            <button
                                                type="button"
                                                onClick={() => { setFieldValue("title", "") }}
                                                className="text-red-500 text-[13px] mr-[8px]"
                                            >
                                                Clear
                                            </button>
                                        )}
                                        <span className="text-[12px] text-gray-800">
                                            {values.title?.length || 0}/73
                                        </span>
                                    </div>
                                </div>
                                <Field
                                    id="title"
                                    name="title"
                                    type="text"
                                    placeholder="My Freshly Baked Brownies"
                                    maxLength={73}
                                    className={`bg-white border border-black rounded-[8px] px-[15px] text-black placeholder-gray-500 block w-full sm:text-sm h-[37px] align-text-bottom focus:outline-none focus:ring-0 ${errors.title && touched.title ? "border border-red-300" : ""}`}
                                />
                                <ErrorMessage name="title" component="div" className="text-red-500 text-xs mt-2 absolute -bottom-5 right-[2px]" />
                            </div>

                            {/* Description */}
                            <div className="mb-6 relative">
                                <div className="flex flex-row justify-between">
                                    <label htmlFor="description" className="block text-sm font-medium mb-[5px] ml-[2px] text-black">
                                        Description
                                    </label>
                                    <div className="flex items-end mb-[5px]">
                                        {values.description && (
                                            <button
                                                type="button"
                                                onClick={() => setFieldValue("description", "")}
                                                className="text-red-500 text-[13px] mr-[8px]"
                                            >
                                                Clear
                                            </button>
                                        )}
                                        {/* Character counter */}
                                        <span className="text-[12px] text-gray-800">
                                            {(values.description?.length || 0)}/226
                                        </span>
                                    </div>
                                </div>
                                <Field
                                    as="textarea"
                                    id="description"
                                    name="description"
                                    maxLength={226}
                                    placeholder="WOW, the chocolate flavor is next-level! Can’t wait to share them with the family tonight. 🥰"
                                    className={`bg-white border border-black rounded-[8px] px-[10px] py-[8px] text-black placeholder-gray-500 block w-full sm:text-sm focus:outline-none focus:ring-0 ${errors.description && touched.description ? "border border-red-300" : ""}`}
                                />
                                <ErrorMessage
                                    name="description"
                                    component="div"
                                    className="text-red-500 text-xs mt-2 absolute -bottom-5 right-[2px]"
                                />
                            </div>

                            {/* Category */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium mb-[5px] ml-[2px] text-black">
                                    Review Type
                                </label>
                                <div className="flex flex-row gap-2 w-full">
                                    <Field
                                        as="select"
                                        name="reviewtype"
                                        className={`bg-white border border-black rounded-[8px] px-[10px] py-[8px] text-black cursor-pointer w-full sm:text-sm focus:outline-none focus:ring-0`}
                                        onChange={(e: any) => {
                                            const value = e.target.value;
                                            setReviewType(value);
                                            setFieldValue("reviewtype", value);
                                            setFieldValue("course_id", null);
                                        }}
                                    >
                                        <option value="website">Website</option>
                                        <option value="course">Course</option>
                                    </Field>
                                </div>

                                {reviewType === "course" && (
                                    <div className="mb-6 relative">
                                        <Field
                                            as="select"
                                            name="course_id"
                                            className="mt-3 border border-black bg-white rounded-[8px] px-[10px] py-[8px] text-black cursor-pointer w-full sm:text-sm focus:outline-none focus:ring-0"
                                            disabled={coursesLoading}
                                        >
                                            <option value="">
                                                {coursesLoading ? "Loading courses..." : courses.length === 0 ? "No enrolled courses" : "Select Course"}
                                            </option>
                                            {courses.map((c) => (
                                                <option key={c.id} value={c.id}>{c.title}</option>
                                            ))}
                                        </Field>

                                        <ErrorMessage
                                            name="course_id"
                                            component="div"
                                            className="text-red-500 text-xs mt-2 absolute -bottom-5 right-[2px]"
                                        />
                                    </div>
                                )}
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
                                            <span>{isEdit ? "Save Changes" : "Add Review"}</span>
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

export default ReviewForm;
