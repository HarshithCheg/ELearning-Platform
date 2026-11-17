import '../App.css';
import {useState, useEffect} from 'react';
import {Link, useParams} from 'react-router-dom';
import axios from 'axios';
import useLearning from '../context/useLearning';
import ProgressBar from '../components/ProgressBar';

export default function CourseOverview() {
    const {courseID} = useParams();
    return <CourseDetails key={courseID} courseID={courseID} />;
}

function CourseDetails({courseID}) {
    const [course, setCourse] = useState();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const {enrolledCourseIds, completedLessonIds, enrollInCourse} = useLearning();

    useEffect(() => {
        async function fetchDetails() {
            try{
                const response = await axios.get('/data.json');
                setCourse(response.data.courses.find(item => item.id === courseID));
            }
            catch(error){
                console.error('failed to fetch details', error);
                setError('Course details could not be loaded. Please try again later.');
            } finally {
                setLoading(false);
            }
        }
        fetchDetails();
    }, [courseID]);

    if(loading){
        return(
            <div className='page-container'><h2>Loading course details...</h2></div>
        );
    }

    if (error) {
        return <div className="page-container"><p className="error-message">{error}</p></div>;
    }

    if (!course) {
        return <div className='page-container'><h2>Course not found</h2></div>;
    }

    const isEnrolled = enrolledCourseIds.includes(course.id);
    const completedCount = course.lessons.filter(
        lesson => completedLessonIds.includes(lesson.id)
    ).length;

    return(
        <div className='page-container'>
            <section className="course-header">
                <span className="badge">{course.difficulty}</span>
                <h1>{course.title}</h1>
                <p className="course-meta">{course.category} · {course.lessons.length} lessons</p>
                <p>{course.description}</p>
                <h2>What you will learn</h2>
                <ul className="learning-outcomes">
                    {course.learningOutcomes.map(outcome => <li key={outcome}>{outcome}</li>)}
                </ul>
                {isEnrolled ? (
                    <p className="success-message">You are enrolled in this course.</p>
                ) : (
                    <button className="btn-primary enroll-button" onClick={() => enrollInCourse(course.id)}>
                        Enroll in Course
                    </button>
                )}
            </section>

            <section className="course-lessons">
                <h2>Course progress</h2>
                <ProgressBar completed={completedCount} total={course.lessons.length} />
                <h2>Lessons</h2>
                <ol className="lesson-list">
                    {course.lessons.map((lesson, index) => (
                        <li key={lesson.id}>
                            <Link to={`/course/${course.id}/lesson/${lesson.id}`}>
                                <span>Lesson {index + 1}: {lesson.title}</span>
                                {completedLessonIds.includes(lesson.id) && (
                                    <span className="lesson-complete">Completed</span>
                                )}
                            </Link>
                            <p>{lesson.description}</p>
                        </li>
                    ))}
                </ol>
            </section>
        </div>
    );
}