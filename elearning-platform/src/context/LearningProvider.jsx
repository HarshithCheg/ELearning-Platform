import {useEffect, useState} from 'react';
import LearningContext from './LearningContext';

function readSavedList(key) {
    const savedValue = localStorage.getItem(key);

    if (!savedValue) {
        return [];
    }

    try {
        const parsedValue = JSON.parse(savedValue);
        return Array.isArray(parsedValue) ? parsedValue : [];
    } catch (error) {
        console.error(`Could not read ${key} from localStorage:`, error);
        return [];
    }
}

export function LearningProvider({children}) {
    const [enrolledCourseIds, setEnrolledCourseIds] = useState(
        () => readSavedList('enrolledCourseIds')
    );
    const [completedLessonIds, setCompletedLessonIds] = useState(
        () => readSavedList('completedLessonIds')
    );
    const [quizResults, setQuizResults] = useState(
        () => readSavedList('quizResults').filter(result => (
            typeof result.quizId === 'string' &&
            typeof result.isCorrect === 'boolean' &&
            typeof result.selectedAnswer === 'string'
        ))
    );

    useEffect(() => {
        try {
            localStorage.setItem('enrolledCourseIds', JSON.stringify(enrolledCourseIds));
        } catch (error) {
            console.error('Could not save enrolled courses:', error);
        }
    }, [enrolledCourseIds]);

    useEffect(() => {
        try {
            localStorage.setItem('completedLessonIds', JSON.stringify(completedLessonIds));
        } catch (error) {
            console.error('Could not save lesson progress:', error);
        }
    }, [completedLessonIds]);

    useEffect(() => {
        try {
            localStorage.setItem('quizResults', JSON.stringify(quizResults));
        } catch (error) {
            console.error('Could not save quiz results:', error);
        }
    }, [quizResults]);

    function enrollInCourse(courseId) {
        setEnrolledCourseIds(currentIds => (
            currentIds.includes(courseId) ? currentIds : [...currentIds, courseId]
        ));
    }

    function completeLesson(lessonId) {
        setCompletedLessonIds(currentIds => (
            currentIds.includes(lessonId) ? currentIds : [...currentIds, lessonId]
        ));
    }

    function saveQuizResult(quizId, selectedAnswer, isCorrect) {
        setQuizResults(currentResults => [
            ...currentResults.filter(result => result.quizId !== quizId),
            {quizId, selectedAnswer, isCorrect}
        ]);
    }

    return (
        <LearningContext.Provider value={{
            enrolledCourseIds,
            completedLessonIds,
            quizResults,
            enrollInCourse,
            completeLesson,
            saveQuizResult
        }}>
            {children}
        </LearningContext.Provider>
    );
}
