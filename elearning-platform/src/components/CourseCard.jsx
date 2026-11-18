import { Link } from 'react-router-dom';
import './Components.css';

export default function CourseCard({ course }) {
    return (
        <div className='course-card'>
            {/* 1. Visual Top Area */}
            <div className="course-card-image">
                <img src={course.thumbnail || 'https://placehold.co/600x400/2563EB/white?text=Course'} alt={course.title} />
                <span className='badge'>{course.difficulty}</span>
            </div>

            {/* 2. Content Middle Area */}
            <div className="course-card-body">
                <p className="course-meta">{course.category} • {course.lessons?.length || 0} lessons</p>
                <h2>{course.title}</h2>
                <p className="course-description">{course.description}</p>
                
                {/* 3. Action Bottom Area */}
                <div className="course-card-footer">
                    <Link to={`/course/${course.id}`} className='btn-primary'>
                        View Course
                    </Link>
                </div>
            </div>
        </div>
    );
}
