export const MAX_FAILURES = 10;
export const RETRY_DELAY = 2000;

export interface QuestionInterface {
    id: string;
    text: string;
    options: string[];
}

export interface QuizInterface {
    correct_answers: string;
    questions: QuestionInterface[];
}

export interface LessonInterface {
    id: string;
    title: string;
    videoId: string;
}

export interface ModuleInterface {
    id: string;
    title: string;
    lessons: LessonInterface[];
    quiz: QuizInterface;
}

export interface CertificateByGrade {
    gradeHighThan: string;
    certificate: string;
}

export interface CourseAttributesInterface {
    category: Array<string>;
    duration: string;
    level: string;
    lessons: number;
    language: string;
    workload: string;
    learn: string;
    about: string;
    gains: string;
    requirements: string;
}

/* ────────────────────────────────
     3. Course root
     ──────────────────────────────── */

export interface CourseCreationInterface {
    name: string;
    description: string;
    image: string;
    cover_image?: string;
    video?: string;
    social_links: string[];

    attributes: CourseAttributesInterface;
    modules: ModuleInterface[];
    courseCompletion: CertificateByGrade[];
}

export interface EnrolledCoursePreview {
    courseAddress: string;
    title: string;
    image: string;
}

export interface OwnerCoursePreview {
    course: CourseDeployedInterface;
    courseAddress: string;
    cost: string;
}

export interface CertificateInterface {
    certificateAddress: string;
    title: string;
    image: string;
}

export interface CertificateCompletionInterface {
    certificateAddress: string;
    name: string;
    image: string;
    description: string;
    courseAddress: string;
    ownerAddress: string;
    attributes: {
        trait_type: string;
        value: string;
    }[];
    grades: string[];
}

export interface CertificateFullInterface {
    certificateAddress: string;
    title: string;
    description: string;
    courseImage: string;
    courseTitle: string;
    courseAddress: string;
    ownerAddress: string;
    attributes: {
        trait_type: string;
        value: string;
    }[];
}

export type CourseAttribute = {
    trait_type: string;
    value: string;
}[];

export interface CatalogCourseInterface {
    courseAddress: string;
    authorAddress: string;
    title: string;
    author: string;
    price: number;
    duration: number;
    rating: number;
    image: string;
    users: number;
    difficulty: string;
    categories: string[];
    date: string;
}

export type FilterType = "difficulty" | "rating" | "price";

export type VideoCheckState = Record<
    number,
    Record<
        number,
        { isChecking: boolean; isValid: boolean; lastChecked?: string }
    >
>;

export interface CourseDeployedInterface
    extends Omit<CourseCreationInterface, "modules" | "attributes"> {
    modules: ModuleInterfaceNew[];
    attributes: {
        trait_type: string;
        value: string;
    }[];
    quiz_answers: {
        encrypted_answers: string;
        sender_public_key: string;
    };
    limitedVideos: string[];
    owner_public_key: string;
}

export interface ModuleInterfaceNew {
    id: string;
    title: string;
    lessons: LessonInterface[];
    quiz: {
        questions: QuestionInterface[];
    };
}

export interface QuizAnswers {
    quizId: string;
    quizGrade: string;
}

export interface CoursePromoInterface extends CourseDeployedInterface {
    cost: string;
    enrolledNumber: string;
    ownerAddress: string;
}

export type MetadataAttribute = {
    trait_type: string;
    value: string;
};

export type Metadata = {
    attributes: MetadataAttribute[];
    description: string;
    quiz_grades: string[];
    name: string;
    image: string;
};

export type Preview = {
    resolution: string;
    url: string;
};

export type Collection = {
    address: string;
    // name: string;
    // description: string;
};

export type Owner = {
    address: string;
    // is_scam: boolean;
    // is_wallet: boolean;
};

export type NFTItem = {
    address: string;
    index: number;
    owner: Owner;
    collection: Collection;
    verified: boolean;
    metadata: Metadata;
    previews: Preview;
    // approved_by, trust
};

export type NFTResponse = {
    nft_items: NFTItem[];
};

export type NFTDataResponse = {
    success: boolean;
    exit_code: number;
    decoded?: {
        init: boolean;
        [key: string]: unknown;
    };
    [key: string]: unknown;
};

export type ClassifiedCourses = {
    completed: NFTItem[];
    notCompleted: NFTItem[];
};
