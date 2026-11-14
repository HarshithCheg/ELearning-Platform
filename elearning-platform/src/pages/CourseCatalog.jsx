import {useState, useEffect} from "react";
import axios from 'axios';
import CourseCard from '../components/CourseCard';
import '../App.css';

export default function CourseCatalog() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() =>{
        async function fetchCourses() {
            try{
                const response = await axios.get('/data.json');
                setCourses(response.data.courses);
                setLoading(false);
            }
            catch (error){
                console.error("Error Fetching Courses:", error);
                setLoading(false);
            }
        }
        fetchCourses();
    }, []);

    if(loading){
        return (
            <div className="page-container">
                <h2>
                    Loading Courses...
                </h2>
            </div>
        );
    }

    return (
        <div className="page-container">
            <h1>Availabe Courses</h1>
            <div className="course-grid">
                {courses?.map(course => (
                    <CourseCard key={course.id} course={course}/>
                ))}
            </div>
        </div>
    );
}