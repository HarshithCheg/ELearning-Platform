import {Link} from 'react-router-dom';
import './Components.css';

export default function CourseCard({course}){
    return(
        <div className='course-card'>
            <span className='badge'>{course.difficulty}</span>
            <h2>{course.title}</h2>
            <p>{course.description}</p>

            <Link to={'/course/${course.id}'} style={{textDecoration: 'none'}}>
                <button className='route-btn'>View Course</button>
            </Link>
        </div>
    );
}