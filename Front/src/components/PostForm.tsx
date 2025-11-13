import { FC, useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { RxCross2 } from "react-icons/rx";
import IconLoading from "./IconLoading.tsx";
import DropUpload from "./DropUpload.tsx";
import { getCourses } from "../api/client.js";

type Post = {
    id: string;
    title: string;
    description: string;
    course_id: number;
    posttype: string;
    postimage: globalThis.File | null;
    userId: number;
};

type PostFormProps = {
    onClose: () => void;
    onSave: (post: Post, isEdit: boolean) => void;
    isEdit?: boolean;
    postId?: number | null;
    userId: number;
    courseId?: number | null;
    posttype?: string;
    from: string; // "home" | "course"
};

const PostForm: FC<PostFormProps> = ({ onClose, onSave, isEdit = false, postId, userId, courseId, posttype, from }) => {
    const [courses, setCourses] = useState<any[]>([]);
    const [postType, setPostType] = useState<string>("normal");

    // ✅ Validation Schema
    const validationSchema = Yup.object().shape({
        title: Yup.string().required("Required"),
        description: Yup.string().required("Required"),
        posttype: Yup.string().required("Required"),
        postimage: Yup.mixed()
            .required("Required")
            .test("fileSize", "Image size is too large! (Max 32MB)", (value) => {
                if (!value) return true;
                if (value instanceof File) {
                    return value.size <= 32 * 1024 * 1024;
                }
                return false;
            }),
    });

    // 🧠 Fetch courses from backend
    useEffect(() => {
        if (from === "home") {
            const fetchCoursesFromBackend = async () => {
                try {
                    const data = await getCourses();
                    setCourses(data || []);
                } catch (err) {
                    console.error("Error fetching courses:", err);
                    setCourses([]);
                }
            };
            fetchCoursesFromBackend();
        }
    }, [from, userId]);

    // ✅ Initial form values depending on where it's opened from
    const [initialValues, setInitialValues] = useState({
        title: "",
        description: "",
        posttype: from === "course" ? "course" : "normal",
        course_id: from === "course" ? courseId : null,
        postimage: null,
        userId: userId
    });

    useEffect(() => {
        if (from === "course") setPostType("course");
        else setPostType("normal");
    }, [from]);

    // 🧠 Placeholder for backend fetch when editing
    useEffect(() => {
        if (isEdit && postId) {
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
                posttype: "normal",
                course_id: 1,
                postimage: null,
                userId:1
            });
        }
    }, [isEdit, postId]);

    return (
        <div className="fixed top-0 left-0 w-full h-full bg-black/30 z-[100] flex items-center justify-center">
            <div className="bg-white text-black rounded-2xl w-[500px] pt-[16px] pb-[18px] px-[18px] relative shadow-lg">
                <button className="absolute top-3 right-3 text-black">
                    <RxCross2 size={20} onClick={onClose} className="cursor-pointer hover:text-[#eb5757] active:text-[#bf4b4b] transition-all duration-[400ms]" />
                </button>
                <h2 className="text-2xl mb-6 font-semibold">Add New Post</h2>
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
                                    Post Type
                                </label>
                                <div className="flex flex-row gap-2 w-full">
                                    <Field
                                        as="select"
                                        name="posttype"
                                        className={`bg-white border border-black rounded-[8px] px-[10px] py-[8px] text-black cursor-pointer w-full sm:text-sm focus:outline-none focus:ring-0`}
                                        onChange={(e: any) => {
                                            const value = e.target.value;
                                            setPostType(value);
                                            setFieldValue("posttype", value);
                                            setFieldValue("course_id", null);
                                        }}
                                    >
                                        <option value="normal">Normal</option>
                                        <option value="course">Course</option>
                                    </Field>
                                </div>

                                {postType === "course" && (
                                    <div className="mb-6 relative">
                                        <Field
                                            as="select"
                                            name="course_id"
                                            className="mt-3 border border-black bg-white rounded-[8px] px-[10px] py-[8px] text-black cursor-pointer w-full sm:text-sm focus:outline-none focus:ring-0"
                                        >
                                            <option value="">Select Course</option>
                                            {courses.map((c) => (
                                                <option key={c.courseId} value={c.courseId}>{c.title}</option>
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


                            {/* Post Pic Field */}
                            <div className="mb-6 relative">
                                <div className="flex flex-row justify-between">
                                    <label htmlFor="name" className="block text-sm font-medium mb-[5px] ml-[2px] text-black">Post Image</label>
                                    {values.postimage && (
                                        <div className="flex items-end mb-[5px]">
                                            <button
                                                type="button"
                                                onClick={() => { setFieldValue("postimage", null) }}
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
                                        onChange={(value) => setFieldValue("postimage", value)}
                                        value={values.postimage as unknown as globalThis.File}
                                        description="PNG, JPG, GIF, WEBP up to 32MB"
                                        disabled={isSubmitting}
                                    />
                                </div>
                                <ErrorMessage name="postimage" component="div" className="text-red-500 text-xs mt-1 absolute -bottom-5 left-[2px]" />
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
                                            <span>{isEdit ? "Save Changes" : "Add Post"}</span>
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

export default PostForm;
