import { useState, useEffect } from "react";
import axios from 'axios';
import CourseCard from '../components/CourseCard';
import '../App.css';

export default function CourseCatalog() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        async function fetchCourses() {
            try {
                const response = await axios.get('/data.json');
                setCourses(response.data.courses);
            } catch (err) {
                console.error("Error Fetching Courses:", err);
                setError('Courses could not be loaded. Please try again later.');
            } finally {
                setLoading(false);
            }
        }
        fetchCourses();
    }, []);

    // 1. Loading State
    if (loading) {
        return (
            <div className="page-container flex-center">
                <div className="loader"></div>
                <h2>Loading Courses...</h2>
            </div>
        );
    }

    // 2. Main Render State
    return (
        <div className="page-container">
            <header className="page-header">
                <h1>Available Courses</h1>
                <p>{courses.length} high-quality programs found</p>
            </header>

            {/* Error Message */}
            {error && <p className="error-message">{error}</p>}

            {/* Empty State */}
            {!error && courses.length === 0 && (
                <div className="empty-state">
                    <p>No courses are available at this moment.</p>
                </div>
            )}

            {/* The Grid - This is where the magic happens */}
            <div className="course-grid">
                {courses.map(course => (
                    <CourseCard key={course.id} course={course} />
                ))}
            </div>
        </div>
    );
}
