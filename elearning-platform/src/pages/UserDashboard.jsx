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
    const {enrolledCourseIds, completedLessonIds} = useLearning();

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

    return (
        <div className="page-container">
            <h1>My Dashboard</h1>
            {error && <p className="error-message">{error}</p>}
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