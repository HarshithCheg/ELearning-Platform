import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from 'axios';
import useLearning from '../context/useLearning';
import '../App.css';

export default function CourseOverview() {
    const { id } = useParams();
    const [course, setCourse] = useState(null);
    const [activeTab, setActiveTab] = useState('lessons');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { enrolledCourseIds, enrollInCourse } = useLearning();

    useEffect(() => {
        async function fetchCourse() {
            try {
                const response = await axios.get('/data.json');
                const found = response.data.courses.find(item => String(item.id) === String(id));
                setCourse(found || null);
            } catch (error) {
                console.error('Could not load course:', error);
                setError('Course details could not be loaded. Please try again later.');
            } finally {
                setLoading(false);
            }
        }

        fetchCourse();
    }, [id]);

    if (loading) return <div className="flex-center">Loading course...</div>;
    if (error) return <div className="page-container"><p className="error-message">{error}</p></div>;
    if (!course) return <div className="page-container"><p className="error-message">Course not found.</p></div>;

    return (
        <div className="course-view">
            <header className="hero-banner-full">
                <img
                    src={course.thumbnail || '/7.jpeg'}
                    className="full-hero-img course-hero-image"
                    alt=""
                    onError={event => {
                        event.currentTarget.src = '/7.jpeg';
                    }}
                />
                <div className="hero-overlay">
                    <h1>{course.title}</h1>
                    <p>{course.category} • {course.difficulty}</p>
                    {enrolledCourseIds.includes(course.id) ? (
                        <p className="enrollment-status">You are enrolled in this course.</p>
                    ) : (
                        <button
                            type="button"
                            className="btn-primary enroll-course-button"
                            onClick={() => enrollInCourse(course.id)}
                        >
                            Enroll in course
                        </button>
                    )}
                </div>
            </header>

            <main className="main-content-area">
                <nav className="view-tabs" aria-label="Course content">
                    <button
                        type="button"
                        className={`tab ${activeTab === 'lessons' ? 'active' : ''}`}
                        aria-pressed={activeTab === 'lessons'}
                        onClick={() => setActiveTab('lessons')}
                    >
                        Lessons
                    </button>
                    <button
                        type="button"
                        className={`tab ${activeTab === 'quizzes' ? 'active' : ''}`}
                        aria-pressed={activeTab === 'quizzes'}
                        onClick={() => setActiveTab('quizzes')}
                    >
                        Quizzes
                    </button>
                </nav>

                <div className="grid-layout">
                    {activeTab === 'lessons' ? (
                        course.lessons.map((l, index) => (
                            <div key={l.id} className="course-card-udemy">
                                <div className="card-thumbnail lesson-thumbnail" aria-hidden="true">▶</div>
                                <div className="card-info">
                                    <h3>{l.title}</h3>
                                    <p className="card-instructor">Lesson {index + 1}</p>
                                    <Link
                                        to={`/course/${course.id}/lesson/${l.id}`}
                                        className="btn-primary watch-now-button"
                                        aria-label={`Watch ${l.title}`}
                                    >
                                        Watch now <span aria-hidden="true">→</span>
                                    </Link>
                                </div>
                            </div>
                        ))
                    ) : course.quizzes?.length ? (
                        course.quizzes.map((q, index) => (
                            <div key={q.id} className="course-card-udemy">
                                <div className="card-thumbnail quiz-thumbnail" aria-hidden="true">📝</div>
                                <div className="card-info">
                                    <h3>Quiz {index + 1}</h3>
                                    <p className="card-instructor">A short quiz for this course.</p>
                                    <Link
                                        to={`/course/${course.id}/lesson/${q.lessonId}`}
                                        className="btn-primary watch-now-button"
                                    >
                                        Take quiz <span aria-hidden="true">→</span>
                                    </Link>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="empty-course-content">There are no quizzes for this course yet.</p>
                    )}
                </div>
            </main>
        </div>
    );
}
