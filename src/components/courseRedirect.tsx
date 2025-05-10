import React from "react";
import { useParams, Navigate } from "react-router-dom";

export const CourseRedirect: React.FC = () => {
    const { courseId } = useParams();

    if (!courseId) {
        return <p>Ошибка: courseId отсутствует!</p>;
    }

    return <Navigate to={`/course/${courseId}/info`} replace />;
};
