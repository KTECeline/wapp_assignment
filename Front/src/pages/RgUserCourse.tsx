import { IoIosArrowForward, IoMdHeart } from "react-icons/io";
import RgUserLayout from "../components/RgUserLayout.tsx";
import VisitorLayout from "../components/VisitorLayout.tsx";
import { CiBookmark } from "react-icons/ci";
import { FaStar } from "react-icons/fa";
import { IoAdd, IoBookmark } from "react-icons/io5";
import { useCallback, useEffect, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { useNavigate, useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { startQuiz } from "../components/QuizManager.tsx";
import jsPDF from "jspdf";
import PostForm from "../components/PostForm.tsx";

interface Course {
    courseId: number;
    title: string;
    description: string;
    courseImg: string;
    rating: number;
    cookingTimeMin: number;
    servings: number;
    levelId: number;
    level: Level;
    categoryId: number;
    category: Category;
}

interface Level {
    levelId: number;
    title: string;
}

interface Category {
    categoryId: number;
    title: string;
    catImg: string;
    catBanner: string;
    description: string;
    deleted: boolean;
}

interface CoursePrepItem {
    coursePrepItemId: number;
    title: string;
    description: string;
    itemImg: string;
    type: string;
    amount?: number;
    metric?: string;
    courseId: number;
}

interface CourseTip {
    tipId: number;
    courseId: number;
    description: string;
}

interface CourseStep {
    courseStepId: number;
    description: string;
    step: number;
    courseStepImg: string;
}

interface Review {
    feedbackId: number;
    userId: number;
    userName: string;
    userInitial: string;
    rating: number;
    title: string;
    description: string;
    createdAt: string;
    timeAgo: string;
}

interface Post {
    postId: number;
    userId: number;
    userName: string;
    userInitial: string;
    title: string;
    description: string;
    postImg: string;
    courseId?: number;
    courseName?: string;
    categoryName?: string;
    createdAt: string;
    timeAgo: string;
    likeCount: number;
    isLiked: boolean;
}

function useLocalToast() {
    const [toasts, setToasts] = useState<{ id: string; message: string; variant: "success" | "error" }[]>([]);

    const add = useCallback((message: string, variant: "success" | "error" = "success") => {
        const id = Math.random().toString(36).slice(2);
        setToasts(prev => [...prev, { id, message, variant }]);
        setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
    }, []);

    const ToastContainer = (
        <div className="fixed bottom-4 right-4 space-y-2 z-[9999] pointer-events-none">
            <AnimatePresence>
                {toasts.map(t => (
                    <motion.div
                        key={t.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className={`px-3 py-2 rounded-xl shadow-md border pointer-events-auto ${t.variant === "error"
                            ? "bg-rose-100/90 text-rose-700 border-rose-200"
                            : "bg-emerald-50/90 text-emerald-700 border-emerald-200"
                            }`}
                    >
                        {t.message}
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );

    return { add, ToastContainer };
}

const RgUserCourse = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const Layout = user?.userId ? RgUserLayout : VisitorLayout;

    const { id } = useParams<{ id: string }>(); // get courseId from URL
    const [course, setCourse] = useState<Course | null>(null);

    const navigate = useNavigate();
    const { add, ToastContainer } = useLocalToast();

    const [userQuizResult, setUserQuizResult] = useState<{ accuracy: number; time: string } | null>(null);

    useEffect(() => {
        if (!id) return;

        fetch(`/api/courses/${id}`)
            .then(res => {
                if (!res.ok) throw new Error("Network response was not ok");
                return res.json();
            })
            .then(data => setCourse(data.course)) // <-- Use the actual course object
            .catch(err => console.error("Error fetching course:", err));
    }, [id]);

    // Mark course as completed when user accesses it
    useEffect(() => {
        if (!user?.userId || !id) return;

        fetch(`/api/CourseUserActivities/mark-completed?userId=${user.userId}&courseId=${id}`, {
            method: 'PUT'
        })
            .then(res => {
                if (res.ok) {
                    console.log("Course marked as completed");
                }
            })
            .catch(err => console.error("Error marking course as completed:", err));
    }, [user?.userId, id]);


    const [coursePrepItems, setCoursePrepItems] = useState<CoursePrepItem[]>([]);
    const [ingredients, setIngredients] = useState<CoursePrepItem[]>([]);
    const [tools, setTools] = useState<CoursePrepItem[]>([]);

    useEffect(() => {
        if (!id) return;

        fetch(`/api/courseprepitems/course/${id}`)
            .then(res => res.json())
            .then((data: CoursePrepItem[]) => {
                console.log("Fetched prep items:", data);
                setCoursePrepItems(data);
                setIngredients(data.filter(item => item.type.toLowerCase() === "ingredients"));
                setTools(data.filter(item => item.type.toLowerCase() === "tools"));
            })
            .catch(err => console.error("Error fetching prep items:", err));
    }, [id]);


    const [UserRegisteredCourse, setUserRegisteredCourse] = useState(false);
    const [Saved, setSaved] = useState(false);

    useEffect(() => {
        if (!user?.userId || !id) return;

        fetch(`/api/CourseUserActivities/status?courseId=${id}&userId=${user.userId}`)
            .then(res => res.json())
            .then(data => {
                setUserRegisteredCourse(data.registered);
                setSaved(data.saved);
            })
            .catch(err => console.error("Error fetching user course activity:", err));
    }, [id, user?.userId]);

    useEffect(() => {
        if (!course?.courseId || !user?.userId) return;

        fetch(`/api/CourseUserActivities/leaderboard?courseId=${course.courseId}`)
            .then(res => res.json())
            .then((data) => {
                const current = data.find((x: any) => x.userId === user.userId);
                if (current) {
                    setUserQuizResult({
                        accuracy: current.accuracy,
                        time: current.time
                    });
                } else {
                    setUserQuizResult(null);
                }
            })
            .catch(err => console.error("Error fetching leaderboard:", err));
    }, [course?.courseId, user?.userId]);

    const [steps, setSteps] = useState<CourseStep[]>([]);
    const [tips, setTips] = useState<CourseTip[]>([]);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [totalReviews, setTotalReviews] = useState<number>(0);
    const [averageRating, setAverageRating] = useState<number>(0);
    const [posts, setPosts] = useState<Post[]>([]);

    // Post form states
    const [showPostForm, setShowPostForm] = useState(false);

    // Review form states
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [reviewRating, setReviewRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [reviewTitle, setReviewTitle] = useState("");
    const [reviewDescription, setReviewDescription] = useState("");

    useEffect(() => {
        if (!id) return;

        fetch(`/api/CourseSteps/course/${id}`)
            .then(res => res.json())
            .then((data: CourseStep[]) => setSteps(data))
            .catch(err => console.error(err));
    }, [id]);

    useEffect(() => {
        if (!id) return;

        fetch(`/api/CourseTips/course/${id}`)
            .then(res => res.json())
            .then((data: CourseTip[]) => setTips(data))
            .catch(err => console.error("Error fetching tips:", err));
    }, [id]);

    useEffect(() => {
        if (!id) return;

        fetch(`/api/UserFeedbacks/count/${id}`)
            .then(res => res.json())
            .then(data => {
                console.log("Review count response:", data);
                setTotalReviews(data);
            })
            .catch(err => console.error("Error fetching review count:", err));
    }, [id]);

    useEffect(() => {
        if (!id) return;

        fetch(`/api/UserFeedbacks/average/${id}`)
            .then(res => {
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                return res.text(); // Get as text first
            })
            .then(text => {
                console.log("Average rating raw response:", text);
                try {
                    const data = text ? JSON.parse(text) : 0;
                    console.log("Average rating parsed:", data);
                    setAverageRating(data);
                } catch (e) {
                    console.error("Failed to parse average rating:", e);
                    setAverageRating(0);
                }
            })
            .catch(err => console.error("Error fetching average rating:", err));
    }, [id]);

    useEffect(() => {
        if (!id) return;

        fetch(`/api/UserFeedbacks/course/${id}/reviews`)
            .then(res => res.json())
            .then((data: Review[]) => {
                console.log("Reviews list response:", data);
                setReviews(data);
            })
            .catch(err => console.error("Error fetching reviews:", err));
    }, [id]);

    useEffect(() => {
        if (!id) return;

        fetch(`/api/UserPosts?courseId=${id}&filter=all`)
            .then(res => res.json())
            .then((data: Post[]) => {
                console.log("Posts response:", data);
                setPosts(data);
            })
            .catch(err => console.error("Error fetching posts:", err));
    }, [id]);

    function formatCookingTime(minutes: number) {
        if (minutes < 60) return `${minutes} mins`;
        const h = Math.floor(minutes / 60);
        const m = minutes % 60;
        return m === 0 ? `${h}h` : `${h}h ${m}m`;
    }

    const [popupItem, setPopupItem] = useState(null as null | typeof coursePrepItems[0]);

    function decimalToFraction(decimal: number): string {
        const tolerance = 1.0e-6;
        let h1 = 1, h2 = 0, k1 = 0, k2 = 1;
        let b = decimal;
        do {
            const a = Math.floor(b);
            let aux = h1; h1 = a * h1 + h2; h2 = aux;
            aux = k1; k1 = a * k1 + k2; k2 = aux;
            b = 1 / (b - a);
        } while (Math.abs(decimal - h1 / k1) > decimal * tolerance);

        return k1 === 1 ? `${h1}` : `${h1}/${k1}`;
    }

    if (!course) {
        return (
            <Layout>
                <div className="flex justify-center items-center h-[400px]">
                    Loading course...
                </div>
            </Layout>
        );
    }

    // Register for course
    async function handleRegister() {
        if (!user?.userId || !course?.courseId) return;

        try {
            // Try to get existing activity
            const checkRes = await fetch(`/api/CourseUserActivities?userId=${user.userId}&courseId=${course.courseId}`);
            const existingActivity = checkRes.ok ? await checkRes.json() : null;

            if (existingActivity?.activityId) {
                // Update existing activity
                const updatedRes = await fetch(`/api/CourseUserActivities/${existingActivity.activityId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ...existingActivity, registered: true }),
                });

                if (!updatedRes.ok) throw new Error('Failed to update activity');

                setUserRegisteredCourse(true);
                add("Successfully registered for this course!");
                return;
            }

            // If no existing activity, create new
            const createRes = await fetch('/api/CourseUserActivities', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.userId, courseId: course.courseId, registered: true, bookmark: false }),
            });

            if (!createRes.ok) throw new Error('Failed to create activity');

            setUserRegisteredCourse(true);
            setSaved(false);
            add("Successfully registered for this course!");

        } catch (err: any) {
            console.error(err);
            alert(err.message || "Failed to register for course.");
        }
    }

    async function handleRemove() {
        if (!user?.userId || !course?.courseId) return;

        try {
            const checkRes = await fetch(`/api/CourseUserActivities?userId=${user.userId}&courseId=${course.courseId}`);
            const existingActivity = checkRes.ok ? await checkRes.json() : null;

            if (existingActivity?.activityId) {
                const updatedRes = await fetch(`/api/CourseUserActivities/${existingActivity.activityId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ...existingActivity, registered: false }),
                });

                if (!updatedRes.ok) throw new Error('Failed to unregister activity');

                setUserRegisteredCourse(false);
                add("You have unregistered from this course.");
            } else {
                console.warn("No existing registration found.");
            }
        } catch (err: any) {
            console.error(err);
            alert(err.message || "Failed to unregister from course.");
        }
    }

    async function handleSave() {
        if (!user?.userId || !course?.courseId) return;

        try {
            // Check if an existing activity exists
            const checkRes = await fetch(`/api/CourseUserActivities?userId=${user.userId}&courseId=${course.courseId}`);
            const existingActivity = checkRes.ok ? await checkRes.json() : null;

            if (existingActivity?.activityId) {
                // Update existing activity's bookmark
                const updatedRes = await fetch(`/api/CourseUserActivities/${existingActivity.activityId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ...existingActivity, bookmark: true }),
                });

                if (!updatedRes.ok) throw new Error('Failed to update bookmark');

                setSaved(true);
                add("Course saved to bookmarks!");
                console.log("Updated existing bookmark");
                return;
            }

            // If not found, create new activity
            const createRes = await fetch('/api/CourseUserActivities', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.userId, courseId: course.courseId, registered: false, bookmark: true }),
            });

            if (!createRes.ok) throw new Error('Failed to create bookmark activity');

            setUserRegisteredCourse(false);
            setSaved(true);
            add("Course saved to bookmarks!");
            console.log("Created new bookmark activity");

        } catch (err: any) {
            console.error("Error saving course:", err);
            alert(err.message || "Failed to save course.");
        }
    }

    async function handleUnsave() {
        if (!user?.userId || !course?.courseId) return;

        try {
            const checkRes = await fetch(`/api/CourseUserActivities?userId=${user.userId}&courseId=${course.courseId}`);
            const existingActivity = checkRes.ok ? await checkRes.json() : null;

            if (existingActivity?.activityId) {
                // Update activity to remove bookmark
                const updatedRes = await fetch(`/api/CourseUserActivities/${existingActivity.activityId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ...existingActivity, bookmark: false }),
                });

                if (!updatedRes.ok) throw new Error('Failed to remove bookmark');

                setSaved(false);
                add("Removed from bookmarks.");
                console.log("Removed bookmark");
            } else {
                console.warn("No existing bookmark found to remove.");
            }

        } catch (err: any) {
            console.error("Error unsaving course:", err);
            alert(err.message || "Failed to unsave course.");
        }
    }

    const downloadRecipePDF = async () => {
        if (!course) return;

        const doc = new jsPDF('p', 'pt', 'a4');
        const pageWidth = doc.internal.pageSize.getWidth();
        const margin = 40;
        let y = 40;

        // Slightly more line spacing for readability
        const wrapText = (text: string, x: number, yPos: number, maxWidth: number, lineHeight: number = 18) => {
            const lines: string[] = doc.splitTextToSize(text, maxWidth);
            lines.forEach((line: string, index: number) => {
                doc.text(line, x, yPos + index * lineHeight);
            });
            return lines.length * lineHeight;
        };

        // Section and bullet spacing
        const sectionSpacing = 20;   // larger separation between sections
        const bulletSpacing = 10;    // clearer spacing between bullet points

        // Title
        doc.setFontSize(24);
        doc.setFont("helvetica", "bold");
        y += wrapText(course.title, margin, y, pageWidth - 2 * margin);
        y += sectionSpacing;

        // Course Info
        doc.setFontSize(12);
        doc.setFont("helvetica", "italic");
        const infoText = `Servings: ${course.servings}  |  Cooking Time: ${formatCookingTime(course.cookingTimeMin)}  |  Level: ${course.level.title}`;
        y += wrapText(infoText, margin, y, pageWidth - 2 * margin);
        y += sectionSpacing;

        // Description
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        y += wrapText("Description:", margin, y, pageWidth - 2 * margin);
        y += 8;
        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        y += wrapText(course.description, margin, y, pageWidth - 2 * margin, 18);
        y += sectionSpacing;

        // Ingredients
        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        y += wrapText("Ingredients:", margin, y, pageWidth - 2 * margin);
        y += 8;

        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        ingredients.forEach(item => {
            const amountDisplay =
                typeof item.amount === "number" && item.amount < 1 && item.amount > 0
                    ? decimalToFraction(item.amount)
                    : item.amount;

            const text = `• ${item.title}${item.amount ? ` - ${amountDisplay} ${item.metric ?? ''}` : ''}`;
            y += wrapText(text, margin + 10, y, pageWidth - 2 * margin - 10, 17);
            y += bulletSpacing; // add gap between bullets
        });
        y += sectionSpacing;

        // Tools
        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        y += wrapText("Tools:", margin, y, pageWidth - 2 * margin);
        y += 8;

        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        tools.forEach(item => {
            const text = `• ${item.title}`;
            y += wrapText(text, margin + 10, y, pageWidth - 2 * margin - 10, 17);
            y += bulletSpacing;
        });
        y += sectionSpacing;

        // Steps
        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        y += wrapText("Steps:", margin, y, pageWidth - 2 * margin);
        y += 8;

        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        steps.forEach(step => {
            const stepText = `${step.step}. ${step.description}`;
            y += wrapText(stepText, margin + 10, y, pageWidth - 2 * margin - 10, 18);
            y += bulletSpacing;
            if (y > 750) {
                doc.addPage();
                y = 40;
            }
        });
        y += sectionSpacing;

        // Tips
        if (tips.length > 0) {
            doc.setFontSize(16);
            doc.setFont("helvetica", "bold");
            y += wrapText("Tips:", margin, y, pageWidth - 2 * margin);
            y += 8;

            doc.setFontSize(12);
            doc.setFont("helvetica", "normal");
            tips.forEach(tip => {
                const tipText = `• ${tip.description}`;
                y += wrapText(tipText, margin + 10, y, pageWidth - 2 * margin - 10, 17);
                y += bulletSpacing;
                if (y > 750) {
                    doc.addPage();
                    y = 40;
                }
            });
        }

        doc.save(`${course.title}.pdf`);
    };

    const handleSubmitReview = async () => {
        if (!user?.userId || !course?.courseId) {
            add("Please log in to submit a review", "error");
            return;
        }

        if (reviewRating === 0) {
            add("Please select a rating", "error");
            return;
        }

        if (!reviewTitle.trim()) {
            add("Please enter a review title", "error");
            return;
        }

        if (!reviewDescription.trim()) {
            add("Please enter a review description", "error");
            return;
        }

        try {
            const formData = new FormData();
            formData.append('userId', user.userId.toString());
            formData.append('courseId', course.courseId.toString());
            formData.append('type', 'review');
            formData.append('rating', reviewRating.toString());
            formData.append('title', reviewTitle);
            formData.append('description', reviewDescription);

            const response = await fetch('/api/UserFeedbacks', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: 'Failed to submit review' }));
                throw new Error(errorData.message || 'Failed to submit review');
            }

            add("Review submitted successfully!");

            // Reset form
            setReviewRating(0);
            setReviewTitle("");
            setReviewDescription("");
            setShowReviewModal(false);

            // Refresh reviews
            fetch(`/api/UserFeedbacks/course/${id}/reviews`)
                .then(res => res.json())
                .then((data: Review[]) => setReviews(data))
                .catch(err => console.error("Error fetching reviews:", err));

            // Refresh review count
            fetch(`/api/UserFeedbacks/count/${id}`)
                .then(res => res.json())
                .then(data => setTotalReviews(data))
                .catch(err => console.error("Error fetching review count:", err));

            // Refresh average rating
            fetch(`/api/UserFeedbacks/average/${id}`)
                .then(res => {
                    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                    return res.text();
                })
                .then(text => {
                    const data = text ? JSON.parse(text) : 0;
                    setAverageRating(data);
                })
                .catch(err => console.error("Error fetching average rating:", err));

        } catch (err: any) {
            console.error("Submit review error:", err);
            add(err.message || "Failed to submit review", "error");
        }
    };

    const handlePostLike = async (postId: number) => {
        if (!user?.userId) {
            add("Please log in to like posts", "error");
            return;
        }

        try {
            const response = await fetch(`/api/UserPosts/${postId}/like`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.userId }),
            });

            if (!response.ok) {
                throw new Error('Failed to toggle like');
            }

            // Refresh posts to get updated like counts
            fetch(`/api/UserPosts?courseId=${id}&filter=all`)
                .then(res => res.json())
                .then((data: Post[]) => setPosts(data))
                .catch(err => console.error("Error refreshing posts:", err));

        } catch (err: any) {
            console.error("Like error:", err);
            add(err.message || "Failed to like post", "error");
        }
    };

    const handlePostSave = async (postData: any, isEdit: boolean) => {
        try {
            if (!user?.userId) {
                add("Please log in to submit a post", "error");
                return;
            }

            let imageUrl = "";

            // Step 1: Upload image if provided
            if (postData.postimage instanceof File) {
                const uploadFormData = new FormData();
                uploadFormData.append('file', postData.postimage);

                const uploadRes = await fetch('/api/Uploads', {
                    method: 'POST',
                    body: uploadFormData,
                });

                if (!uploadRes.ok) {
                    const errorText = await uploadRes.text();
                    throw new Error("Image upload failed: " + (errorText || `${uploadRes.status}`));
                }

                const uploadedData = await uploadRes.json();
                imageUrl = uploadedData.path || uploadedData.url || "";
            }

            // Step 2: Create post with image URL
            const courseIdValue = postData.posttype === "course" && postData.course_id
                ? parseInt(postData.course_id)
                : parseInt(id || '0');

            const postPayload: any = {
                UserId: user.userId,
                Title: postData.title,
                Description: postData.description,
                Type: 'post',
                PostImg: imageUrl,
                CourseId: courseIdValue,
            };

            console.log("Sending post payload:", postPayload);

            const res = await fetch('/api/UserPosts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(postPayload),
            });

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(errorText || `Failed to create post: ${res.status}`);
            }

            add("Post created successfully! It will appear after admin approval.");
            setShowPostForm(false);

            // Refresh posts
            fetch(`/api/UserPosts?courseId=${id}&filter=all`)
                .then(res => res.json())
                .then((data: Post[]) => setPosts(data))
                .catch(err => console.error("Error fetching posts:", err));

        } catch (err) {
            console.error("Error saving post:", err);
            add("Failed to create post: " + (err instanceof Error ? err.message : "Unknown error"), "error");
        }
    };

    return (
        <Layout>

            {showPostForm && (
                <div className="fixed z-[100]">
                    <PostForm
                        onClose={() => setShowPostForm(false)}
                        onSave={handlePostSave}
                        isEdit={false}
                        postId={null}
                        userId={user?.userId || 0}
                        courseId={course?.courseId || null}
                        posttype="course"
                        from="course"
                    />
                </div>
            )}

            {/* Banner */}
            <div
                className="w-full h-[200px] relative bg-fixed bg-center bg-cover"
                style={{ backgroundImage: `url(${course.courseImg})` }}
            >
                {/* Overlay */}
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-[#000000]/40 to-[#000000]/0 z-10" />

                {/* Content */}
                <div className="absolute top-0 left-0 w-full h-full z-20">
                    <div className="relative w-[1090px] h-full mx-auto flex items-center">
                        <div className="font-ibarra text-[48px] max-w-[1000px] line-clamp-1 leading-tight font-bold text-white">
                            {course.title}
                        </div>

                        <div className="font-inter absolute bottom-[54px] left-[4px] text-[10px] max-w-[500px] leading-tight font-[200] text-white flex items-center gap-[2px]">
                            <button className="cursor-pointer uppercase hover:text-[#DA1A32] transition-all duration-[600ms]"
                                onClick={() => navigate(`/RgUserLearn`)}>
                                Learn
                            </button>
                            <IoIosArrowForward className="text-[#DA1A32] h-[18px]" />
                            <button className="cursor-pointer uppercase hover:text-[#DA1A32] transition-all duration-[600ms]"
                                onClick={() => navigate(`/RgUserCat/${course.categoryId}`)}>
                                {course.category?.title}
                            </button>
                        </div>
                    </div>
                </div>
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

            <div className="mt-[44px] items-center text-black flex flex-col w-full mx-auto">
                {/* Course Details */}
                <div className="flex flex-row justify-between w-[1090px]">
                    <div className="flex flex-col">
                        {/* Review */}
                        <div className="flex flex-row gap-[16px]">
                            <img src="/images/Like.png" alt="like" className="w-[45px] h-[45px] object-cover" />

                            <div className="flex flex-col gap-[2px] justify-center translate-y-[-2px]">
                                {/* Review */}
                                <div className="font-inter text-[#484848] text-[14px] font-light">
                                    {totalReviews} {totalReviews === 1 ? "review" : "reviews"}
                                </div>

                                <div className="flex gap-[4px]">
                                    {[...Array(5)].map((_, index) => {
                                        const fillPercentage = Math.min(Math.max(averageRating - index, 0), 1) * 100;
                                        console.log(`Star ${index + 1}: fillPercentage = ${fillPercentage}%, averageRating = ${averageRating}`);

                                        return (
                                            <div
                                                key={index}
                                                className="relative"
                                                style={{ width: `14px`, height: `14px` }}
                                            >
                                                <FaStar
                                                    className="absolute top-0 left-0 text-gray-300"
                                                    size="14px"
                                                />

                                                <div
                                                    className="absolute top-0 left-0 overflow-hidden"
                                                    style={{ width: `${fillPercentage}%`, height: "100%" }}
                                                >
                                                    <FaStar
                                                        className="text-[#DA1A32]"
                                                        size="14px"
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <p className="max-w-[435px] mt-[24px] text-[14px] font-light leading-[1.5] text-justify line-clamp-8">
                            {course.description}
                        </p>


                        {/* Details */}
                        <div className="flex gap-[18px] mt-[32px] items-center h-[20px]">
                            <div className="flex items-center">
                                <img src="/images/Time.png" alt="recipe" className="w-[19px] h-[19px] object-cover translate-y-[-1px]" />
                                <div className="flex items-end">
                                    <div className="font-inter ml-[8px] text-[#484848] text-[16px] font-light">
                                        {formatCookingTime(course.cookingTimeMin)}
                                    </div>
                                </div>
                            </div>

                            <div className="h-[20px] w-[1.5px] bg-black" />

                            <div className="flex items-center">
                                <img src="/images/Profile.png" alt="recipe" className="w-[18px] h-[18px] object-cover" />
                                <div className="flex items-end">
                                    <div className="font-inter ml-[10px] text-[#484848] text-[16px] font-light">
                                        {course.servings} servings
                                    </div>
                                </div>
                            </div>

                            <div className="h-[20px] w-[1.5px] bg-black" />

                            <div className="flex items-center">
                                <img src="/images/Level.png" alt="recipe" className="w-[20px] h-[20px] object-cover" />
                                <div className="font-inter ml-[9px] text-[#484848] text-[16px] font-light">
                                    {course.level?.title}
                                </div>
                            </div>
                        </div>

                        <div className="bg-black w-[435px] mt-[26px] h-[1.5px]" />

                        {/* Action Buttons */}
                        {!user?.userId ? (
                            <div className="flex flex-row gap-[10px] mt-[20px]">
                                <button className="w-full h-[48px] flex justify-center items-center text-[16px] bg-[#DA1A32] rounded-full text-white cursor-pointer hover:scale-105 transition-all duration-[600ms]"
                                    onClick={() => navigate(`/Register`)}>
                                    Register now to start course
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-row gap-[10px] mt-[20px]">
                                {!UserRegisteredCourse ? (
                                    <button className="w-[265px] h-[48px] flex justify-center items-center text-[16px] bg-[#DA1A32] rounded-full text-white cursor-pointer hover:scale-105 transition-all duration-[600ms]"
                                        onClick={handleRegister}>
                                        Start Now
                                    </button>
                                ) : (
                                    <button className="w-[265px] h-[48px] flex justify-center items-center text-[16px] bg-[#DA1A32] rounded-full text-white cursor-pointer hover:scale-105 transition-all duration-[600ms]"
                                        onClick={handleRemove}>
                                        Remove Course
                                    </button>
                                )}

                                {!Saved ? (
                                    <button className="w-[160px] flex items-center justify-between h-[48px] bg-white border border-black rounded-full pr-[4px] pl-[22px] cursor-pointer hover:scale-105 transition-all duration-[600ms]"
                                        onClick={handleSave}>
                                        <div className="font-inter text-[16px] font-light ml-[10px]">
                                            Save
                                        </div>
                                        <div className="w-[38px] h-[38px] bg-[#DA1A32] flex items-center justify-center rounded-full text-white text-[12px] ml-[20px]">
                                            <CiBookmark className="text-white w-[20px] h-[20px]" />
                                        </div>
                                    </button>
                                ) : (
                                    <button className="w-[160px] flex items-center justify-between h-[48px] bg-white border border-black rounded-full pr-[4px] pl-[22px] cursor-pointer hover:scale-105 transition-all duration-[600ms]"
                                        onClick={handleUnsave}>
                                        <div className="font-inter text-[16px] font-light ml-[10px]">
                                            Saved
                                        </div>
                                        <div className="w-[38px] h-[38px] bg-[#DA1A32] flex items-center justify-center rounded-full text-white text-[12px] ml-[20px]">
                                            <IoBookmark className="text-white w-[20px] h-[20px]" />
                                        </div>
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    {!UserRegisteredCourse ? (
                        <img src={course.courseImg} alt="recipe" className="w-[546px] h-[370px] object-cover" />
                    ) : (
                        <div className="w-[503px] flex flex-col gap-[16px]">
                            <button className="w-full h-[100px] border border-[#B9A9A1] bg-[#F8F5F0] flex items-center px-[36px] rounded-[10px] cursor-pointer hover:scale-[104%] transition-all duration-[600ms] group"
                                onClick={() => navigate(`/RgUserCourseStep/${course.courseId}`)} >
                                <div className="font-ibarra text-[24px] font-bold text-black group-hover:text-[#DA1A32] transition-all duration-[600ms]">
                                    Step-by-Step Guide
                                </div>
                            </button>
                            <button className="w-full h-[100px] border border-[#B9A9A1] bg-[#F8F5F0] flex items-center px-[36px] rounded-[10px] cursor-pointer hover:scale-[104%] transition-all duration-[600ms] group"
                                onClick={() => startQuiz(course, user, navigate)} >
                                <div className="font-ibarra text-[24px] font-bold text-black flex-3 flex justify-start group-hover:text-[#DA1A32] transition-all duration-[600ms]">
                                    Practice Quiz
                                </div>
                                {userQuizResult && (
                                    <>
                                        <div className="font-ibarra text-[18px] font-bold text-[#DA1A32] ml-20">
                                            {userQuizResult.accuracy}%
                                        </div>
                                        <div className="font-ibarra text-[18px] font-bold text-[#DA1A32] ml-20">
                                            {userQuizResult.time}
                                            <span className="text-[16px]"> min</span>
                                        </div>
                                    </>)}
                            </button>
                            <button className="w-full h-[100px] border border-[#B9A9A1] bg-[#F8F5F0] flex items-center px-[36px] rounded-[10px] cursor-pointer hover:scale-[104%] transition-all duration-[600ms] group"
                                onClick={downloadRecipePDF}>
                                <div className="font-ibarra text-[24px] font-bold text-black flex-2 flex justify-start group-hover:text-[#DA1A32] transition-all duration-[600ms]">
                                    Download Recipe as PDF
                                </div>
                            </button>
                        </div>
                    )}
                </div>

                {/* Popup Modal */}
                {popupItem && (
                    <div className="fixed inset-0 flex items-center justify-center z-50">
                        <div className="absolute w-full h-full bg-black bg-opacity-50"
                            onClick={() => setPopupItem(null)} />
                        <div className="bg-white pt-2 px-2 rounded-2xl w-[300px] relative ">
                            <button className="absolute top-3 right-3 text-white">
                                <div className="rounded-full p-[2px] bg-black/50">
                                    <RxCross2 size={20} onClick={() => setPopupItem(null)} className="cursor-pointer hover:text-[#eb5757] active:text-[#bf4b4b] transition-all duration-[400ms]" />
                                </div>
                            </button>
                            <img
                                src={popupItem.itemImg}
                                alt={popupItem.title}
                                className="w-full h-[200px] object-cover rounded-xl mb-2"
                            />
                            <div className="px-[8px] pb-[24px]">
                                <h3 className="font-ibarra mt-[18px] line-clamp-3 text-[20px] font-bold leading-tight mb-2">{popupItem.title}</h3>
                                <p className="font-inter text-[12px] font-light text-justify">{popupItem.description}</p>
                            </div>
                        </div>
                    </div>
                )}

                {user?.userId && (
                    <div className="mb-[-40px]">
                        {/* Decorative Divider */}
                        <div className="flex items-center justify-center gap-[8px] mb-[12px] mt-[88px]">
                            <div className="w-[30px] h-[2px] bg-[#DA1A32]" />
                            <span className="font-ibarra text-[16px] text-[#DA1A32] uppercase tracking-widest font-bold">
                                How do I complete this course?
                            </span>
                            <div className="w-[30px] h-[2px] bg-[#DA1A32]" />
                        </div>

                        {/* Subtext */}
                        <p className="font-inter text-[15px] text-gray-600 text-center max-w-[680px] mb-8">
                            1. Complete the quiz to test your understanding of the lesson.
                            <br />
                            2. After that, share your progress by creating a post in this course.
                            Or, if posting in the general feed, make sure to select the relevant course to showcase your work!
                        </p>
                    </div>
                )}


                {/* Ingredient and Tools */}
                <div className="mt-[88px] flex flex-row justify-between w-[1090px]">
                    <div className="w-[480px] flex flex-col items-center">
                        <div className="font-ibarra text-[32px] font-bold flex flex-row items-center gap-[8px] text-black">
                            <div className="w-[16px] h-[1px] bg-[#DA1A32]" />
                            Ingredients
                            <div className="w-[16px] h-[1px] bg-[#DA1A32]" />
                        </div>

                        <ul className="flex flex-col mt-[32px] gap-[16px] w-full">
                            {ingredients.map(item => {
                                // Convert small amounts <1 to fractions
                                const amountDisplay =
                                    item.type === "ingredient" &&
                                        typeof item.amount === "number" &&
                                        item.amount < 1 &&
                                        item.amount > 0
                                        ? decimalToFraction(item.amount)
                                        : item.amount;

                                return (
                                    <li key={item.coursePrepItemId} className="w-full justify-between items-center flex flex-row">
                                        <div className="items-center flex flex-row gap-[12px] ">
                                            <div className="w-[12px] h-[1.5px] bg-[#DA1A32]" />
                                            <div className="text-[14px] font-light text-black">
                                                {item.title} - {amountDisplay} {item.metric}
                                            </div>
                                        </div>

                                        <button
                                            className="text-[#DA1A32] underline text-[14px]"
                                            onClick={() => setPopupItem(item)}
                                        >
                                            Learn More
                                        </button>
                                    </li>
                                );
                            })
                            }
                        </ul>
                    </div>

                    <div className="w-[480px] flex flex-col items-center px-[40px]">
                        <div className="font-ibarra text-[32px] font-bold flex flex-row items-center gap-[8px] text-black">
                            <div className="w-[16px] h-[1px] bg-[#DA1A32]" />
                            Tools
                            <div className="w-[16px] h-[1px] bg-[#DA1A32]" />
                        </div>


                        <ul className="flex flex-col mt-[32px] gap-[16px] w-full">
                            {tools.map(item => {

                                return (
                                    <li key={item.coursePrepItemId} className="w-full justify-between items-center flex flex-row">
                                        <div className="items-center flex flex-row gap-[12px] ">
                                            <div className="w-[12px] h-[1.5px] bg-[#DA1A32]" />
                                            <div className="text-[14px] font-light text-black">
                                                {item.title}
                                            </div>
                                        </div>

                                        <button
                                            className="text-[#DA1A32] underline text-[14px]"
                                            onClick={() => setPopupItem(item)}
                                        >
                                            Learn More
                                        </button>
                                    </li>
                                );
                            })
                            }
                        </ul>
                    </div>
                </div>

                {/* Posts */}
                <div className="mt-[88px] items-center text-black flex flex-col w-[1090px] relative">
                    <div className="font-ibarra text-[32px] font-bold flex flex-row items-center gap-[8px]">
                        <div className="w-[16px] h-[1px] bg-[#DA1A32]" />
                        Posts
                        <div className="w-[16px] h-[1px] bg-[#DA1A32]" />
                    </div>

                    {UserRegisteredCourse && (
                        <button className="flex items-center justify-between h-[40px] bg-white border border-black rounded-full pr-[4px] pl-[22px] cursor-pointer hover:scale-105 transition-all duration-[600ms] absolute top-0 right-0"
                            onClick={() => setShowPostForm(true)}>
                            <div className="font-inter text-[16px] font-light text-black">
                                Post
                            </div>
                            <div className="w-[30px] h-[30px] bg-[#DA1A32] flex items-center justify-center rounded-full text-white text-[12px] ml-[20px]">
                                <IoAdd className="text-white w-[32px] h-[32px]" />
                            </div>
                        </button>
                    )}                    {/* Post Container */}
                    <div className="mt-[32px] flex flex-row gap-[20px] max-w-screen overflow-x-auto no-scrollbar">
                        {posts.length === 0 ? (
                            <div className="w-full text-center text-gray-500 py-8">
                                No posts yet. Be the first to share your creation!
                            </div>
                        ) : (
                            posts.slice(0, 3).map((post) => (
                                <div key={post.postId} className="cursor-pointer hover:scale-[105%] transition-all duration-[600ms] w-[350px] h-[323px] bg-white flex flex-row gap-[16px] p-[10px] shadow-[0px_0px_20px_rgba(0,0,0,0.1)] rounded-[20px] flex-shrink-0">
                                    <div className="relative w-[170px] h-full rounded-[16px] overflow-hidden">
                                        <img src={post.postImg || "/images/Post.webp"} alt="post" className="w-full h-full object-cover z-0" />
                                        <div className="absolute top-0 left-0 w-full h-full bg-[#fefefe]/20 backdrop-blur-[12px] z-10" />
                                        <div className="absolute top-0 left-0 w-full h-full flex items-center z-20">
                                            <img src={post.postImg || "/images/Post.webp"} alt="post" className="w-full object-cover" />
                                        </div>
                                    </div>

                                    <div className="flex flex-col w-[142px] justify-between">
                                        <div>
                                            <div className="flex flex-row justify-between items-center">
                                                {/* Profile and time */}
                                                <div className="flex flex-row gap-[6px]">
                                                    <div className="w-[25px] h-[25px] bg-[#DA1A32] flex items-center justify-center rounded-full text-white text-[12px]">
                                                        {post.userInitial}
                                                    </div>

                                                    <div className="flex flex-col">
                                                        <div className="font-inter text-[10px] line-clamp-1 max-w-[64px]">
                                                            {post.userName}
                                                        </div>

                                                        <div className="font-inter font-light text-[7px] line-clamp-1 max-w-[64px]">
                                                            {post.timeAgo}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Like button */}
                                                <button className="cursor-pointer" onClick={(e) => {
                                                    e.stopPropagation();
                                                    handlePostLike(post.postId);
                                                }}>
                                                    <IoMdHeart className={`w-[20px] h-[20px] ${post.isLiked ? 'text-[#FF5454]' : 'text-[#D9D9D9]'}`} />
                                                </button>
                                            </div>

                                            {/* Post title */}
                                            <div className="font-ibarra mt-[16px] line-clamp-3 text-[16px] font-bold leading-tight">
                                                {post.title}
                                            </div>

                                            {/* Post Description */}
                                            <div className="font-inter mt-[12px] line-clamp-5 text-[10px] font-light text-justify">
                                                {post.description}
                                            </div>

                                            {/* Hashtags, Course Name and Category */}
                                            <div className="font-inter mt-[26px] line-clamp-4 text-[10px] font-light underline cursor-pointer">
                                                {post.courseName && <span>#{post.courseName}</span>}
                                                {post.categoryName && <span>#{post.categoryName}</span>}
                                            </div>
                                        </div>

                                        <div className="flex flex-col">
                                            <div className="bg-black w-full h-[1px]" />
                                            <div className="flex flex-row font-inter text-[10px] font-light gap-[2px] mt-[5px] mb-[3px]">
                                                <IoMdHeart className="w-[17px] h-[17px] text-[#FF5454]" />
                                                <div className="translate-y-[2px]">
                                                    {post.likeCount}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <button className="font-inter mt-[48px] cursor-pointer mx-auto bg-white px-[22px] py-[2px] border border-black rounded-full font-light hover:scale-105 transition-all duration-[600ms]"
                        onClick={() => navigate(`/RgUserCoursePost/${id}`)}>
                        View More
                    </button>
                </div>

                {/* Reviews */}
                <div className="mt-[62px] items-center text-black flex flex-col w-full bg-[#F8F5F0] pt-[36px] pb-[62px] relative">
                    <div className="font-ibarra text-[32px] font-bold flex flex-row items-center gap-[8px]">
                        <div className="w-[16px] h-[1px] bg-[#DA1A32]" />
                        Reviews
                        <div className="w-[16px] h-[1px] bg-[#DA1A32]" />
                    </div>

                    {UserRegisteredCourse && (
                        <button className="flex items-center justify-between h-[40px] bg-white border border-black rounded-full pr-[4px] pl-[22px] cursor-pointer hover:scale-105 transition-all duration-[600ms] absolute top-[34px] right-[223px]"
                            onClick={() => setShowReviewModal(true)}>
                            <div className="font-inter text-[16px] font-light text-black">
                                Review
                            </div>
                            <div className="w-[30px] h-[30px] bg-[#DA1A32] flex items-center justify-center rounded-full text-white text-[12px] ml-[20px]">
                                <IoAdd className="text-white w-[32px] h-[32px]" />
                            </div>
                        </button>
                    )}

                    {/* Review Container */}
                    <div className="mt-[32px] flex flex-row gap-[20px]">
                        {reviews.length === 0 ? (
                            <div className="w-full text-center text-gray-500 py-8">
                                No reviews yet. Be the first to review this course!
                            </div>
                        ) : (
                            reviews.slice(0, 3).map((review) => (
                                <div key={review.feedbackId} className="w-[350px] h-[153px] bg-white flex flex-col p-[10px] shadow-[0px_0px_20px_rgba(0,0,0,0.1)] rounded-[20px] flex-shrink-0">
                                    <div className="flex flex-row justify-between items-center">
                                        {/* Profile and time */}
                                        <div className="flex flex-row gap-[6px]">
                                            <div className="w-[25px] h-[25px] bg-[#DA1A32] flex items-center justify-center rounded-full text-white text-[12px]">
                                                {review.userInitial}
                                            </div>

                                            <div className="flex flex-col">
                                                <div className="font-inter text-[10px] line-clamp-1 max-w-[64px]">
                                                    {review.userName}
                                                </div>

                                                <div className="font-inter font-light text-[7px] line-clamp-1 max-w-[64px]">
                                                    {review.timeAgo}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Review title */}
                                    <div className="font-ibarra mt-[16px] line-clamp-1 text-[16px] font-bold leading-tight">
                                        {review.title}
                                    </div>

                                    {/* Review Description */}
                                    <div className="font-inter mt-[10px] line-clamp-2 text-[10px] font-light text-justify mb-[8px]">
                                        {review.description}
                                    </div>

                                    <div className="flex gap-[4px]">
                                        {[...Array(5)].map((_, index) => {
                                            const fillPercentage = Math.min(Math.max(review.rating - index, 0), 1) * 100;

                                            return (
                                                <div
                                                    key={index}
                                                    className="relative"
                                                    style={{ width: `14px`, height: `14px` }}
                                                >
                                                    <FaStar
                                                        className="absolute top-0 left-0 text-gray-300"
                                                        size="14px"
                                                    />
                                                    <div
                                                        className="absolute top-0 left-0 overflow-hidden"
                                                        style={{ width: `${fillPercentage}%`, height: "100%" }}
                                                    >
                                                        <FaStar
                                                            className="text-[#DA1A32]"
                                                            size="14px"
                                                        />
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <button
                        className="font-inter mt-[48px] cursor-pointer mx-auto bg-white px-[22px] py-[2px] border border-black rounded-full font-light hover:scale-105 transition-all duration-[600ms]"
                        onClick={() => navigate(`/RgUserCourseReview/${id}`)}
                    >
                        View More
                    </button>
                </div>
            </div>

            {/* Review Modal */}
            {
                showReviewModal && (
                    <div className="fixed inset-0 flex items-center justify-center z-50">
                        <div className="absolute w-full h-full bg-black bg-opacity-50"
                            onClick={() => setShowReviewModal(false)} />
                        <div className="bg-white rounded-2xl w-[500px] relative p-8 z-10">
                            <button className="absolute top-4 right-4 text-gray-600 hover:text-[#DA1A32]"
                                onClick={() => setShowReviewModal(false)}>
                                <RxCross2 size={24} />
                            </button>

                            <h2 className="font-ibarra text-[28px] font-bold text-black mb-6">Write a Review</h2>

                            {/* Star Rating */}
                            <div className="mb-6">
                                <label className="font-inter text-[14px] font-medium text-black mb-2 block">Rating</label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <FaStar
                                            key={star}
                                            size={32}
                                            className={`cursor-pointer transition-colors ${star <= (hoverRating || reviewRating)
                                                ? 'text-[#DA1A32]'
                                                : 'text-gray-300'
                                                }`}
                                            onMouseEnter={() => setHoverRating(star)}
                                            onMouseLeave={() => setHoverRating(0)}
                                            onClick={() => setReviewRating(star)}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Title Input */}
                            <div className="mb-6">
                                <label className="font-inter text-[14px] font-medium text-black mb-2 block">Title</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#DA1A32]"
                                    placeholder="Enter review title"
                                    value={reviewTitle}
                                    onChange={(e) => setReviewTitle(e.target.value)}
                                />
                            </div>

                            {/* Description Textarea */}
                            <div className="mb-6">
                                <label className="font-inter text-[14px] font-medium text-black mb-2 block">Description</label>
                                <textarea
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#DA1A32] resize-none"
                                    placeholder="Share your experience with this course"
                                    rows={4}
                                    value={reviewDescription}
                                    onChange={(e) => setReviewDescription(e.target.value)}
                                />
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-4">
                                <button
                                    className="flex-1 h-[48px] bg-[#DA1A32] text-white rounded-full font-inter text-[16px] hover:scale-105 transition-all duration-[600ms]"
                                    onClick={handleSubmitReview}
                                >
                                    Submit Review
                                </button>
                                <button
                                    className="flex-1 h-[48px] bg-white border border-black text-black rounded-full font-inter text-[16px] hover:scale-105 transition-all duration-[600ms]"
                                    onClick={() => setShowReviewModal(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }

            {ToastContainer}
        </Layout >
    );
};

export default RgUserCourse;
