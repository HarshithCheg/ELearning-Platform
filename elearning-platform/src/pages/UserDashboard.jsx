import {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import CourseCard from '../components/CourseCard';
import ProgressBar from '../components/ProgressBar';
import useLearning from '../context/useLearning';
import '../App.css';

export default function UserDashboard() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const {enrolledCourseIds, completedLessonIds, quizResults} = useLearning();

    useEffect(() => {
        async function fetchCourses() {
            try {
                const response = await axios.get('/data.json');
                setCourses(response.data.courses);
            } catch (error) {
                console.error('Could not load dashboard courses:', error);
                setError('Your courses could not be loaded. Please try again later.');
            } finally {
                setLoading(false);
            }
        }

        fetchCourses();
    }, []);

    if (loading) {
        return <div className="page-container"><h2>Loading your dashboard...</h2></div>;
    }

    const enrolledCourses = courses.filter(course => enrolledCourseIds.includes(course.id));
    const enrolledQuizzes = enrolledCourses.flatMap(course => course.quizzes);
    const enrolledQuizResults = enrolledQuizzes
        .map(quiz => quizResults.find(result => result.quizId === quiz.id))
        .filter(Boolean);
    const completedLessons = enrolledCourses.flatMap(course => course.lessons)
        .filter(lesson => completedLessonIds.includes(lesson.id)).length;
    const totalLessons = enrolledCourses.reduce((total, course) => total + course.lessons.length, 0);
    const correctQuizCount = enrolledQuizResults.filter(result => result.isCorrect).length;
    const quizAccuracy = enrolledQuizResults.length
        ? Math.round((correctQuizCount / enrolledQuizResults.length) * 100)
        : 0;
    const lessonCompletion = totalLessons
        ? Math.round((completedLessons / totalLessons) * 100)
        : 0;

    return (
        <div className="page-container">
            <h1>My Dashboard</h1>
            {error && <p className="error-message">{error}</p>}
            {!error && enrolledCourses.length > 0 && (
                <section className="performance-section" aria-labelledby="performance-title">
                    <h2 id="performance-title">Your performance</h2>
                    <p className="performance-intro">A quick look at your lesson progress and quiz results.</p>
                    <div className="performance-summary">
                        <article className="performance-card">
                            <span className="performance-label">Lessons completed</span>
                            <strong>{completedLessons}<span> / {totalLessons}</span></strong>
                            <span className="performance-note">{lessonCompletion}% of your enrolled lessons</span>
                        </article>
                        <article className="performance-card">
                            <span className="performance-label">Quiz accuracy</span>
                            <strong>{enrolledQuizResults.length ? `${quizAccuracy}%` : '—'}</strong>
                            <span className="performance-note">
                                {enrolledQuizResults.length
                                    ? `${correctQuizCount} correct out of ${enrolledQuizResults.length} attempted`
                                    : 'Complete a quiz to see your score'}
                            </span>
                        </article>
                    </div>

                    <div className="performance-charts">
                        <section className="performance-chart" aria-labelledby="completion-chart-title">
                            <h3 id="completion-chart-title">Course completion</h3>
                            {enrolledCourses.map(course => {
                                const completedCount = course.lessons.filter(
                                    lesson => completedLessonIds.includes(lesson.id)
                                ).length;
                                const percentage = Math.round((completedCount / course.lessons.length) * 100);

                                return (
                                    <div className="chart-row" key={course.id}>
                                        <div className="chart-label">
                                            <span>{course.title}</span>
                                            <span>{percentage}%</span>
                                        </div>
                                        <div
                                            className="chart-track"
                                            role="progressbar"
                                            aria-label={`${course.title} completion`}
                                            aria-valuenow={percentage}
                                            aria-valuemin="0"
                                            aria-valuemax="100"
                                        >
                                            <div className="chart-fill completion-fill" style={{width: `${percentage}%`}} />
                                        </div>
                                    </div>
                                );
                            })}
                        </section>

                        <section className="performance-chart" aria-labelledby="quiz-chart-title">
                            <h3 id="quiz-chart-title">Quiz accuracy by course</h3>
                            {enrolledCourses.map(course => {
                                const courseQuizResults = course.quizzes
                                    .map(quiz => quizResults.find(result => result.quizId === quiz.id))
                                    .filter(Boolean);
                                const courseCorrectCount = courseQuizResults.filter(result => result.isCorrect).length;
                                const percentage = courseQuizResults.length
                                    ? Math.round((courseCorrectCount / courseQuizResults.length) * 100)
                                    : 0;

                                return (
                                    <div className="chart-row" key={course.id}>
                                        <div className="chart-label">
                                            <span>{course.title}</span>
                                            <span>{courseQuizResults.length ? `${percentage}%` : 'Not attempted'}</span>
                                        </div>
                                        <div
                                            className="chart-track"
                                            role="progressbar"
                                            aria-label={`${course.title} quiz accuracy`}
                                            aria-valuenow={percentage}
                                            aria-valuemin="0"
                                            aria-valuemax="100"
                                        >
                                            <div className="chart-fill quiz-fill" style={{width: `${percentage}%`}} />
                                        </div>
                                    </div>
                                );
                            })}
                        </section>
                    </div>
                </section>
            )}
            {!error && enrolledCourses.length === 0 && (
                <div className="empty-dashboard">
                    <p>You have not enrolled in any courses yet.</p>
                    <Link to="/" className="btn-primary">Browse Courses</Link>
                </div>
            )}
            <div className="course-grid">
                {enrolledCourses.map(course => {
                    const completedCount = course.lessons.filter(
                        lesson => completedLessonIds.includes(lesson.id)
                    ).length;

                    return (
                        <div className="dashboard-course" key={course.id}>
                            <CourseCard course={course} />
                            <ProgressBar completed={completedCount} total={course.lessons.length} />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}