// Utility: shuffle quiz order
const shuffleArray = <T,>(arr: T[]): T[] => {
    const newArr = [...arr];
    for (let i = newArr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
};

// Helper to fetch the existing CourseUserActivity row (to get ActivityId)
const getExistingActivity = async (userId: number, courseId: number) => {
    const res = await fetch(`/api/CourseUserActivities?userId=${userId}&courseId=${courseId}`);
    if (!res.ok) throw new Error("Failed to find course activity");
    return res.json();
};

// Helper to update CourseUserActivity (PUT /{activityId})
const updateActivity = async (activityId: number, updates: any) => {
    const res = await fetch(`/api/CourseUserActivities/${activityId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates)
    });
    if (!res.ok) throw new Error(`Failed to update activity ${activityId}`);
    return res.json();
};

// =============== QUIZ FLOW FUNCTIONS ===============

// Start quiz
// Initialize progress when quiz starts
export const startQuiz = async (course: any, user: any, navigate: any) => {
    if (!course || !user) return;

    sessionStorage.setItem("currentCourseId", String(course.courseId));
    sessionStorage.setItem("localProgress", "0"); // ✅ local progress counter

    // Shuffle questions
    const res = await fetch(`/api/Questions/course/${course.courseId}`);
    const questions = await res.json();

    const quizQueue = shuffleArray(
        questions.map((q: any) => ({ id: q.questionId, type: q.questionType }))
    );

    sessionStorage.setItem("quizQueue", JSON.stringify(quizQueue));

    // Find or update activity row
    const existingActivity = await getExistingActivity(user.userId, course.courseId);

    const now = new Date();
    await updateActivity(existingActivity.activityId, {
        ...existingActivity,
        quizStatus: "Re-Attempt",
        quizStartTime: now.toISOString(),
        quizProgress: 0,
        quizMistake: 0,
        quizEndTime: null,
        quizTotalTime: null
    });

    // 3️⃣ Start quiz
    navigateToNextQuestion(navigate);
};


// Go to next question
export const navigateToNextQuestion = (navigate: any) => {
    const quizQueue = JSON.parse(sessionStorage.getItem("quizQueue") || "[]");
    if (!quizQueue.length) {
        finishQuiz(navigate);
        return;
    }

    const nextQuestion = quizQueue[0];
    if (nextQuestion.type.toLowerCase() === "mcq") {
        navigate(`/quiz/mcq/${nextQuestion.id}`);
    } else if (nextQuestion.type.toLowerCase() === "dragdrop") {
        navigate(`/quiz/dd/${nextQuestion.id}`);
    }
};

// Handle answer and progress updates
export const handleAnswer = async (isCorrect: boolean, navigate: any) => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const courseId = Number(sessionStorage.getItem("currentCourseId"));
    let quizQueue = JSON.parse(sessionStorage.getItem("quizQueue") || "[]");

    const currentQuestion = quizQueue.shift();
    if (!currentQuestion) return;

    // If wrong, push back for retry
    if (!isCorrect) quizQueue.push(currentQuestion);
    sessionStorage.setItem("quizQueue", JSON.stringify(quizQueue));

    // Local progress (only for correct answers)
    if (isCorrect) {
        const localProgress = Number(sessionStorage.getItem("localProgress") || "0") + 1;
        sessionStorage.setItem("localProgress", String(localProgress));
    }

    // Fetch and update DB progress (can still increment total attempts)
    const existingActivity = await getExistingActivity(user.userId, courseId);
    const updateData = {
        ...existingActivity,
        quizProgress: existingActivity.quizProgress + 1,
        quizMistake: isCorrect ? existingActivity.quizMistake : existingActivity.quizMistake + 1
    };

    await updateActivity(existingActivity.activityId, updateData);

    navigateToNextQuestion(navigate);
};


// Finish quiz
export const finishQuiz = async (navigate: any) => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const courseId = Number(sessionStorage.getItem("currentCourseId"));

    // Find existing record
    const existingActivity = await getExistingActivity(user.userId, courseId);

    // Compute total time
    const start = new Date(existingActivity.quizStartTime);
    const end = new Date();
    const totalMs = end.getTime() - start.getTime();
    const totalTime = new Date(totalMs).toISOString().substr(11, 8); // HH:MM:SS

    // Update to completed
    const updateData = {
        ...existingActivity,
        quizEndTime: end.toISOString(),
        quizTotalTime: totalTime,
        quizStatus: "Completed"
    };

    await updateActivity(existingActivity.activityId, updateData);

    navigate(`/RgUserQuizCp/${courseId}`);
};
