import {Link} from 'react-router-dom';
import './Components.css';

export default function CourseCard({course}){
    return(
        <div className='course-card'>
            <span className='badge'>{course.difficulty}</span>
            <h2>{course.title}</h2>
            <p className="course-meta">{course.category} · {course.lessons.length} lessons</p>
            <p>{course.description}</p>

            <Link to={`/course/${course.id}`} className='btn-primary'>
                View Course
            </Link>
        </div>
    );
}