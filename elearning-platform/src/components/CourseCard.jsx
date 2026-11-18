import { Link } from 'react-router-dom';

export default function CourseCard({ course }) {
    return (
        <div className='course-card-udemy'>
            <Link to={`/course/${course.id}`} className="card-link">
                <div className='card-thumbnail'>
                    <img
                        src={course.thumbnail || '/7.jpeg'}
                        alt=""
                        onError={event => {
                            event.currentTarget.src = '/7.jpeg';
                        }}
                    />
                </div>
                
                <div className='card-info'>
                    <h3 className="card-title">{course.title}</h3>
                    <div className="card-meta">
                        <span>{course.lessons?.length || 0} lessons</span>
                        <span>{course.difficulty}</span>
                    </div>
                    <p className="card-category">{course.category}</p>
                    <span className="course-card-action">View course <span aria-hidden="true">→</span></span>
                </div>
            </Link>
        </div>
    );
}
