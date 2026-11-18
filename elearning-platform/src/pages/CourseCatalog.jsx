import { useState, useEffect } from "react";
import axios from 'axios';
import CourseCard from '../components/CourseCard';
import '../App.css';

export default function CourseCatalog() {
    const [courses, setCourses] = useState([]);
    const [heroImage, setHeroImage] = useState(''); // Space for the background link
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchCourses() {
            try {
                const response = await axios.get('/data.json');
                // Set the courses from the JSON
                setCourses(response.data.courses);
                // Set the hero image from the new homeSettings section
                setHeroImage(response.data.homeSettings.heroImage);
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
            {/* Full Width Cinematic Banner */}
            <div className="hero-section">
                 <img src={heroImage} alt="Hero" className="full-hero-img" />
            </div>
    
            {/* The Course Section with a different background */}
            <main className="main-content-area">
                <div className="page-container">
                    <div className="catalog-intro">
                        <h1>Our Top Courses</h1>
                        <p>Expand your horizon with our most popular content.</p>
                    </div>
    
                    <div className="course-grid">
                        {courses.map(course => (
                            <CourseCard key={course.id} course={course} />
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
