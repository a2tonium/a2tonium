import { TonConnectUIProvider } from '@tonconnect/ui-react';
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion"
import { AnimQuiz } from "@/components/animated/animQuizAttempt";

import { MainLayout } from "@/layouts/mainLayout";
import { Catalog } from "@/pages/catalog/catalog";
import { Teach } from "@/pages/teach/teach";
import { CreateCourse } from "@/pages/teach/createCourse";

import { Learn } from "@/pages/learn/learn";
import { Syllabus } from "@/pages/learn/syllabus";
import { Quizzes } from "@/pages/learn/quizzes";
import { Lesson } from "@/pages/lesson/lesson";
import { Quiz } from "@/pages/quiz/quiz";
import { QuizAttempt } from "@/pages/quiz/quizAttempt";
import { QuizReview } from "@/pages/quiz/quizReview";
import { CoursePromo } from "@/pages/coursePromo/coursePromo";
import { UserProfile } from "@/pages/user/profile";
import { CoursePromoSample } from "@/pages/teach/createCourse/coursePromoSample";

import { PageNotFound } from "@/pages/error/pageNotFound";
import { UserNotAuthorized } from "@/pages/error/userNotAuthorized";
import { ProtectedRoute } from '@/pages/protectedRoute/protectedRoute';
import { Certificate } from '@/pages/certificate/certificate';

export default function App() {
    const location = useLocation();

    return (
        <AnimatePresence mode="wait">
            <TonConnectUIProvider manifestUrl="https://raw.githubusercontent.com/a2tonium/a2tonium/main/public/tonconnect-manifest.json">
                    <Routes location={location} key={location.pathname}>
                        <Route index element={<Navigate to="catalog" replace />} />
                        <Route path="catalog" element={ <MainLayout children={<Catalog />} />} />
                        
                        <Route path="learn" element={ <ProtectedRoute><MainLayout children={<Learn />}></MainLayout></ProtectedRoute>} />

                        <Route path="teach" >
                            <Route index element={ <ProtectedRoute><MainLayout><Teach /></MainLayout></ProtectedRoute> } />
                            <Route path="create">
                                <Route index element={ <ProtectedRoute><MainLayout><CreateCourse children={undefined} /></MainLayout></ProtectedRoute> } />
                                <Route path="coursePromo" element={<ProtectedRoute><MainLayout><CoursePromoSample /></MainLayout></ProtectedRoute>} />
                            </Route>

                        </Route>

                        <Route path="course/:courseAddress">
                            <Route index element={<Navigate to="syllabus" replace />} />
                            <Route path="promo" element={<MainLayout><CoursePromo /></MainLayout>} />
                            <Route path="syllabus" element={ <ProtectedRoute><MainLayout><Syllabus /></MainLayout></ProtectedRoute> } />
                            <Route path="quizzes" element={ <ProtectedRoute><MainLayout><Quizzes /></MainLayout></ProtectedRoute> } />
                            <Route path="lesson/:lessonId" element={<ProtectedRoute><MainLayout><Lesson /></MainLayout></ProtectedRoute>} />
                            <Route path="quiz/:quizId">
                                <Route index element={<ProtectedRoute><MainLayout><Quiz /></MainLayout></ProtectedRoute>} />
                                <Route path="attempt" element={<ProtectedRoute><AnimQuiz><QuizAttempt /></AnimQuiz></ProtectedRoute>} />
                                <Route path="review" element={<ProtectedRoute><AnimQuiz><QuizReview /></AnimQuiz></ProtectedRoute>} />
                            </Route>
                        </Route>

                        <Route path="user/:walletAddr">
                            <Route index element={<MainLayout><UserProfile /></MainLayout>} />
                        </Route>
                            
                        <Route path="certificate/:certificateAddr"> 
                            <Route index element={<MainLayout><Certificate /></MainLayout>} />
                        </Route>
                        
                        <Route path="/unauthorized" element={<MainLayout><UserNotAuthorized /></MainLayout>} />
                        <Route path="*" element={<MainLayout><PageNotFound /></MainLayout>} />
                        
                    </Routes>
            </TonConnectUIProvider>
        </AnimatePresence>
    );
  };
  
  


