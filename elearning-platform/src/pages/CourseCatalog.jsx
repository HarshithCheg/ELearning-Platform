import {useState, useEffect} from "react";
import axios from 'axios';
import CourseCard from '../components/CourseCard';
import '../App.css';

export default function CourseCatalog() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() =>{
        async function fetchCourses() {
            try{
                const response = await axios.get('/data.json');
                setCourses(response.data.courses);
            }
            catch (error){
                console.error("Error Fetching Courses:", error);
                setError('Courses could not be loaded. Please try again later.');
            } finally {
                setLoading(false);
            }
        }
        fetchCourses();
    }, []);

    if(loading){
        return (
            <div className="page-container"><h2>Loading courses...</h2></div>
        );
    }

    return (
        <div className="page-container">
            <h1>Available Courses</h1>
            {error && <p className="error-message">{error}</p>}
            <div className="course-grid">
                {courses.map(course => (
                    <CourseCard key={course.id} course={course}/>
                ))}
            </div>
            {!error && courses.length === 0 && <p>No courses are available yet.</p>}
        </div>
    );
}