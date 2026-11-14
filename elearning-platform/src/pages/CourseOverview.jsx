import '../App.css';
import {useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';


export default function CourseOverview() {
    const {courseID} = useParams();
    const [course, setCourse] = useState();
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        async function fetchDetails() {
            try{
                const response = await axios.get('/data.json');
                const trg = response.data.courses.find(c => c.id === courseID);
                setCourse(trg);
                setLoading(false);
            }
            catch(error){
                console.error('failed to fetch details', error);
                setLoading(false);
            }
        }
        fetchDetails()
    }, [courseID]);

    if(loading){
        return(
            <div className='page-container'>
                <h2>Loading Course Details...</h2>
            </div>
        );
    }
    if(!loading){
        return(
            <div className='page-container'>
                <h2>Course Not Found</h2>
            </div>
        );
    }
    return(
        <div className='page-container'>
            <h2>{course.title}</h2>
            <p>{course.description}</p>
        </div>
    );
}