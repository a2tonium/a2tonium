import { Link } from "react-router-dom"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import type { EnrolledCoursePreview } from "@/types/courseData"

interface CourseCardsProps {
  courses: EnrolledCoursePreview[]
}

export function CourseCards({ courses }: CourseCardsProps) {
  if (!courses || courses.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No courses enrolled yet.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {courses.map((course) => (
        <Link
          to={`/course/${course.courseAddress}`}
          key={course.courseAddress}
          className="block"
        >
          <Card className="overflow-hidden rounded-xl h-full shadow-md transition-shadow hover:shadow-lg">
            <CardContent className="p-0">
              <div className="aspect-square w-full overflow-hidden">
                <img
                  src={course.image || "/placeholder.svg?height=300&width=300"}
                  alt={course.title}
                  className="h-full w-full object-cover transform transition-transform duration-300 ease-in-out hover:scale-105"
                />
              </div>
            </CardContent>
            <CardFooter className="p-4 bg-white">
              <h3 className="font-medium text-sm sm:text-base md:text-lg line-clamp-2">
                {course.title}
              </h3>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  )
}
