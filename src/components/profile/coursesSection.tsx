import type { OwnerCoursePreview } from "@/types/course.types"; // Assuming this interface is defined in a types file
import { CourseCards } from "@/components/profile/courseCards";

interface CoursesSectionProps {
    courses: OwnerCoursePreview[];
}

export function CoursesSection({ courses }: CoursesSectionProps) {
    return (
        <div className="py-4">
            <CourseCards courses={courses} />
        </div>
    );
}
