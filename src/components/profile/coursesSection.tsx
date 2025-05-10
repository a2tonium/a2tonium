import type { EnrolledCoursePreview } from "@/types/courseData" // Assuming this interface is defined in a types file
import { CourseCards } from "@/components/profile/courseCards"

interface CoursesSectionProps {
  courses: EnrolledCoursePreview[]
}

export function CoursesSection({ courses }: CoursesSectionProps) {

  return (
    <div className="py-4">
      <CourseCards courses={courses} />
    </div>
  )
}