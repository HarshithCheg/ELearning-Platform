import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import CourseCard from '../components/CourseCard';
import ProgressBar from '../components/ProgressBar';
import useLearning from '../context/useLearning';
import '../App.css';

export default function UserDashboard() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { enrolledCourseIds, completedLessonIds } = useLearning();

    useEffect(() => {
        async function fetchCourses() {
            try {
                const response = await axios.get('/data.json');
                setCourses(response.data.courses);
            } catch (error) {
                console.error('Could not load dashboard courses:', error);
                setError('Your courses could not be loaded.');
            } finally {
                setLoading(false);
            }
        }
        fetchCourses();
    }, []);

    const enrolledCourses = courses.filter(course => enrolledCourseIds.includes(course.id));
    const totalLessons = enrolledCourses.reduce((acc, c) => acc + c.lessons.length, 0);

    if (loading) return <div className="page-container flex-center"><div className="loader"></div></div>;

    return (
        <div className="dashboard-wrapper">
            <header className="hero-banner-full dashboard-hero">
                <div className="page-container">
                    <h1>Student Dashboard</h1>
                    <p>Welcome back! Track your progress and continue your journey.</p>
                </div>
            </header>

            <main className="main-content-area">
                <div className="page-container">
                    {error && <p className="dashboard-error" role="alert">{error}</p>}
                    
                    <section className="performance-section shadow-md">
                        <div className="performance-intro">
                            <h2>My Performance</h2>
                        </div>
                        <div className="performance-summary">
                            <div className="performance-card">
                                <span className="performance-label">Enrolled Courses</span>
                                <strong>{enrolledCourses.length}</strong>
                            </div>
                            <div className="performance-card">
                                <span className="performance-label">Lessons Completed</span>
                                <strong>{completedLessonIds.length} <span>/ {totalLessons}</span></strong>
                            </div>
                        </div>
                    </section>

                    {!error && enrolledCourses.length === 0 && (
                        <div className="empty-dashboard-box shadow-md">
                            <p>You have not enrolled in any courses yet.</p>
                            <Link to="/" className="btn-primary">Explore Catalog</Link>
                        </div>
                    )}

                    <div className="course-grid">
                        {enrolledCourses.map(course => {
                            const completedCount = course.lessons.filter(
                                lesson => completedLessonIds.includes(lesson.id)
                            ).length;

                            return (
                                <div className="dashboard-course-item" key={course.id}>
                                    <CourseCard course={course} />
                                    <div className="progress-footer">
                                        <ProgressBar completed={completedCount} total={course.lessons.length} />
                                        <Link to={`/course/${course.id}`} className="resume-link">
                                            {completedCount > 0 ? 'Resume' : 'Start'} →
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </main>
        </div>
    );
}
