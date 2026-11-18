import { useState, useEffect } from "react";
import axios from 'axios';
import CourseCard from '../components/CourseCard';
import '../App.css';

export default function CourseCatalog() {
    const [courses, setCourses] = useState([]);
    const [heroImage, setHeroImage] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        async function fetchCourses() {
            try {
                const response = await axios.get('/data.json');
                setCourses(response.data.courses);
                setHeroImage(response.data.homeSettings?.heroImage || '/7.jpeg');
            } catch (error) {
                console.error('Could not load courses:', error);
                setError('Courses could not be loaded. Please try again later.');
            } finally {
                setLoading(false);
            }
        }
        fetchCourses();
    }, []);

    if (loading) return <div className="page-container flex-center"><h2>Loading courses...</h2></div>;

    return (
        <div className="catalog-wrapper">
            <section className="catalog-courses">
                <div className="page-container">
                    <div className="catalog-intro">
                        <h1>Explore our courses</h1>
                        <p>Choose a topic and take the next step in your learning journey.</p>
                    </div>

                    {error && <p className="catalog-message error-message">{error}</p>}
                    <div className="course-grid">
                        {courses.map(course => (
                            <CourseCard key={course.id} course={course} />
                        ))}
                    </div>
                    {!error && courses.length === 0 && (
                        <p className="catalog-message">There are no courses to show yet.</p>
                    )}
                </div>
            </section>

            <section className="learning-quote-banner" aria-label="Learning inspiration">
                <img src={heroImage} alt="" className="full-hero-img" />
                <div className="learning-quote">
                    <p>“Small lessons today can open big doors tomorrow.”</p>
                    <p>“Curiosity turns every question into a new skill.”</p>
                </div>
            </section>
        </div>
    );
}
