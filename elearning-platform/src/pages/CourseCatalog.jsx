import { useState, useEffect } from "react";
import axios from 'axios';
import CourseCard from '../components/CourseCard';
import '../App.css';

export default function CourseCatalog() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchCourses() {
            try {
                const response = await axios.get('/data.json');
                setCourses(response.data.courses);
            } catch (error) {
                console.error("Error:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchCourses();
    }, []);

    if (loading) return <div className="page-container"><h2>Loading...</h2></div>;

    return (
        <div className="catalog-wrapper">
            {/* Broad Landscape Hero Panel */}
            <section className="hero-banner">
                <div className="hero-content">
                    <h1>Skills to transform your career and life</h1>
                    <p>From critical workplace skills to technical topics, EduTech supports your professional development.</p>
                    <button className="btn-hero">Start Learning Now</button>
                </div>
                <div className="hero-image-container">
                    {/* Replace this URL with your landscape photo */}
                    <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" alt="Learning" />
                </div>
            </section>

            <div className="page-container">
                <div className="section-title">
                    <h2>Our Top Courses</h2>
                    <p>Expand your horizon with our most popular content.</p>
                </div>

                <div className="course-grid">
                    {courses.map(course => (
                        <CourseCard key={course.id} course={course} />
                    ))}
                </div>
            </div>
        </div>
    );
}
