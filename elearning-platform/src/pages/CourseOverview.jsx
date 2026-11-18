import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from 'axios';
import '../App.css';

export default function CourseOverview() {
    const { id } = useParams();
    const [course, setCourse] = useState(null);
    const [activeTab, setActiveTab] = useState('lessons'); // Brain: Tab State
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('/data.json').then(res => {
            const found = res.data.courses.find(c => String(c.id) === String(id));
            setCourse(found);
            setLoading(false);
        });
    }, [id]);

    if (loading || !course) return <div className="flex-center">Loading Content...</div>;

    return (
        <div className="course-view">
            {/* 1. BROAD HERO BANNER */}
            <header className="hero-banner-full">
                <img src={course.thumbnail} className="full-hero-img" alt={course.title} />
                <div className="hero-overlay">
                    <h1>{course.title}</h1>
                    <p>{course.category} • {course.difficulty}</p>
                </div>
            </header>

            {/* 2. OVERLAPPING CONTENT SECTION */}
            <main className="main-content-area">
                <nav className="view-tabs">
                    <div className={`tab ${activeTab === 'lessons' ? 'active' : ''}`} onClick={() => setActiveTab('lessons')}>Lessons</div>
                    <div className={`tab ${activeTab === 'quizzes' ? 'active' : ''}`} onClick={() => setActiveTab('quizzes')}>Assessments</div>
                </nav>

                <div className="grid-layout">
                    {activeTab === 'lessons' ? (
                        course.lessons.map((l, index) => (
                            <div key={l.id} className="course-card-udemy">
                                <div className="card-thumbnail" style={{background: '#222', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white'}}>▶</div>
                                <div className="card-info">
                                    <h3>{l.title}</h3>
                                    <p className="card-instructor">Lesson {index + 1}</p>
                                    <Link to={`/course/${course.id}/lesson/${l.id}`} className="btn-primary">Watch Now</Link>
                                </div>
                            </div>
                        ))
                    ) : (
                        course.quizzes?.map((q, index) => (
                            <div key={q.id} className="course-card-udemy">
                                <div className="card-thumbnail" style={{background: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white'}}>📝</div>
                                <div className="card-info">
                                    <h3>Quiz {index + 1}</h3>
                                    <p className="card-instructor">Checkpoint Assessment</p>
                                    <Link to={`/course/${course.id}/lesson/${q.lessonId}`} className="btn-primary" style={{background: '#10b981'}}>Take Quiz</Link>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </main>
        </div>
    );
}
