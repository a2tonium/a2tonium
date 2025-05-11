// teachService.ts

export interface TeachCourseInterface {
    courseId: string;
    title: string;
    image: string;
}

// Mock data
const mockCourses: TeachCourseInterface[] = [
    {
        courseId: "1",
        title: "Основы программирования на Python",
        image: "/images/cards/1.png",
    },
    {
        courseId: "2",
        title: "Введение в веб-разработку с HTML и CSS",
        image: "/images/cards/1.png",
    },
    {
        courseId: "3",
        title: "Разработка приложений с React React React ...",
        image: "/images/cards/1.png",
    },
];

/**
 * Simulates an API call that returns the user's courses for "Teach".
 */
export async function fetchTeachCourses(): Promise<TeachCourseInterface[]> {
    // Artificial 0.5s delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    return mockCourses;
}
