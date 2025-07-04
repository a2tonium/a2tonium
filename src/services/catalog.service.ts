import { CatalogCourseInterface } from "@/types/course.types";

const mockData: CatalogCourseInterface[] = [
    {
        courseAddress: "EQAALYpb_0uuikSCY91fvB2wgHIS4zcDVhc5OCTieShLJKx1",
        authorAddress: "0QCAUDJy5yh0tq1oGMNrn2KvyffXZ9rz0abji5eSPjTx-tx8",
        title: "Академия продаж. Менеджер по продажам",
        author: "Pavel Durov",
        price: 40,
        duration: 60,
        rating: 5,
        image: "https://cdn.stepik.net/media/cache/images/courses/194388/cover_YEBkk5W/81ec3ca1fc87771f660d0a5e249add6f.png",
        users: 200,
        difficulty: "beginner",
        categories: ["ai", "computer-science"],
        date: "2025-01-03",
    },
    {
        courseAddress: "EQAAnUt2zanII3lWn0JHCRsSXXgsN-L0xSZ4JgPpz_Wdlbu9",
        authorAddress: "0QCAUDJy5yh0tq1oGMNrn2KvyffXZ9rz0abji5eSPjTx-tx8",
        title: "Microservices - паттерны и практика построения микросервисов",
        author: "Pavel Durov",
        price: 32,
        duration: 42,
        rating: 4.9,
        image: "https://cdn.stepik.net/media/cache/images/courses/117212/cover_ihY4c8s/9cf8893e80122ccd7115a2f7210bed10.jpg",
        users: 150,
        difficulty: "expert",
        categories: ["programming", "technology"],
        date: "2025-01-20",
    },
    {
        courseAddress: "EQCcvuwOEQleO0CnrgDm09M4UjmJm0NSNltaNkqXhtu5_8zZ",
        authorAddress: "0QCAUDJy5yh0tq1oGMNrn2KvyffXZ9rz0abji5eSPjTx-tx8",
        title: "Изучаем Arduino",
        author: "Pavel Durov",
        price: 15,
        duration: 50,
        rating: 4.8,
        image: "https://cdn.stepik.net/media/cache/images/courses/180519/cover_RqAtOM0/b9e65990d65b2f35546147d13003364c.jpg",
        users: 120,
        difficulty: "intermediate",
        categories: ["programming"],
        date: "2024-11-15",
    },
    {
        courseAddress: "EQAurhzD4ga89WVEPudV5WmPZlwLYefg2heFBkgAfUcnuggq",
        authorAddress: "0QCAUDJy5yh0tq1oGMNrn2KvyffXZ9rz0abji5eSPjTx-tx8",
        title: "Продвинутый SQL",
        author: "Pavel Durov",
        price: 17,
        duration: 18,
        rating: 4.7,
        image: "https://cdn.stepik.net/media/cache/images/courses/55776/cover_eEyK9xX/fcf6831201233dbbfb64cbf49b0a8f8f.png",
        users: 68,
        difficulty: "beginner",
        categories: ["finance", "personal-development"],
        date: "2024-09-22",
    },
    {
        courseAddress: "EQDr9pDMrtfkvNIZwxEq8Y80gm8AYiF_mnH3xrRv3L4xfiCn",
        authorAddress: "0QAjnpL_6fI089tA_c8jaXi4-FJcUYHHEruEOf-sokMcRjSx",
        title: "PRO Go. Алгоритмы и структуры данных",
        author: "Alexey Shevtsov",
        price: 29,
        duration: 35,
        rating: 4.6,
        image: "https://cdn.stepik.net/media/cache/images/courses/201825/cover_oWEyxEM/602a0b503fbec2e6d75d2796c535b9dd.png",
        users: 88,
        difficulty: "intermediate",
        categories: ["project-mgmt", "business"],
        date: "2024-12-18",
    },
    {
        courseAddress: "EQDXUvj221rgojF7RY-Tadsp6mnaQs6D38PvO0Ue2T8xQHD_",
        authorAddress: "0QAjnpL_6fI089tA_c8jaXi4-FJcUYHHEruEOf-sokMcRjSx",
        title: "Google-таблицы. от А до Я",
        author: "Alexey Shevtsov",
        price: 10,
        duration: 25,
        rating: 4.5,
        image: "https://cdn.stepik.net/media/cache/images/courses/113401/cover_5p4zhPC/d2ed741ebbc9990211515414deae33f8.png",
        users: 95,
        difficulty: "beginner",
        categories: ["graphic-design", "arts-design"],
        date: "2024-10-10",
    },
    {
        courseAddress: "EQBbZJlTh0zZFocC54k8KfvVbw2yGV8RtLMoAjC-Y5EvVfMA",
        authorAddress: "0QAjnpL_6fI089tA_c8jaXi4-FJcUYHHEruEOf-sokMcRjSx",
        title: "Командная строка Linux",
        author: "Alexey Shevtsov",
        price: 22,
        duration: 30,
        rating: 4.3,
        image: "https://cdn.stepik.net/media/cache/images/courses/171984/cover_8BUN3lt/7e349274122c840e1b100465342d7bdc.png",
        users: 72,
        difficulty: "intermediate",
        categories: ["databases", "programming"],
        date: "2024-12-05",
    },
    {
        courseAddress: "EQA82z0X5_oDLbpsM3XWKHjPpzkehbSL7XRzuNrC7ZgelIv9",
        authorAddress: "0QAjnpL_6fI089tA_c8jaXi4-FJcUYHHEruEOf-sokMcRjSx",
        title: "Разработка приложений с Flutter и Dart для IOS и Android",
        author: "Alexey Shevtsov",
        price: 20,
        duration: 20,
        rating: 4.2,
        image: "https://cdn.stepik.net/media/cache/images/courses/191099/cover_H2CjYj2/3d3baabddf76424b3ff6df5efdba9933.png",
        users: 47,
        difficulty: "beginner",
        categories: ["history", "academic-subjects", "databases"],
        date: "2024-11-01",
    },
];

export async function fetchCatalogCourses(): Promise<CatalogCourseInterface[]> {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return mockData;
}
