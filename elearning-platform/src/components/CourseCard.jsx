import { Link } from 'react-router-dom';

export default function CourseCard({ course }) {
    return (
        <div className='course-card-udemy'>
            <Link to={`/course/${course.id}`} className="card-link">
                <div className='card-thumbnail'>
                    <img src={course.thumbnail || 'https://placehold.co/600x400/2563EB/white?text=Course'} alt={course.title} />
                </div>
                
                <div className='card-info'>
                    <h3 className="card-title">{course.title}</h3>
                    <p className="card-instructor">{course.instructor}</p>
                    <div className="card-meta">
                        <span className="rating">4.6 ★★★★☆</span>
                        <span className="lessons">({course.lessons?.length} lessons)</span>
                    </div>
                    <p className="card-category">{course.category} • {course.difficulty}</p>
                </div>
            </Link>
        </div>
    );
}
