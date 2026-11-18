import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import ReactPlayer from 'react-player';
import useLearning from '../context/useLearning';
import '../App.css';

export default function LessonViewer() {
    const { courseId, lessonId } = useParams();
    // Key reset ensures quiz resets when you switch lessons in the sidebar
    return <LessonContent key={lessonId} courseId={courseId} lessonId={lessonId} />;
}

function LessonContent({ courseId, lessonId }) {
    const [course, setCourse] = useState(null);
    const [lesson, setLesson] = useState(null);
    const [quiz, setQuiz] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedOpt, setSelectedOpt] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const { completeLesson, completedLessonIds } = useLearning();

    useEffect(() => {
        axios.get('/data.json').then(res => {
            const c = res.data.courses.find(item => String(item.id) === String(courseId));
            const l = c?.lessons.find(item => String(item.id) === String(lessonId));
            const q = c?.quizzes.find(item => String(item.lessonId) === String(lessonId));
            setCourse(c); setLesson(l); setQuiz(q); setLoading(false);
        });
    }, [courseId, lessonId]);

    if (loading || !lesson) return <div className="flex-center">Loading Video Player...</div>;

    return (
        <div className="viewer-container">
            {/* LEFT: MAIN STUDY AREA */}
            <main className="video-main-column">
                <Link to={`/course/${courseId}`} className="back-link" style={{marginBottom: '20px', display: 'block'}}>← Back to Course Overview</Link>
                
                <div className="video-wrapper">
                    <ReactPlayer url={lesson.videoUrl} controls width="100%" height="100%" onEnded={() => completeLesson(lessonId)} />
                </div>

                <div className="video-meta">
                    <h1>{lesson.title}</h1>
                    <p>{lesson.description}</p>
                    <button className="btn-primary" onClick={() => completeLesson(lessonId)}>
                        {completedLessonIds.includes(lessonId) ? '✓ Completed' : 'Mark as Finished'}
                    </button>
                </div>

                {/* THE INTEGRATED QUIZ (Styling it like a pro component) */}
                {quiz && (
                    <div className="quiz-section-viewer">
                        <h2 style={{color: '#059669', marginBottom: '20px'}}>Interactive Quiz Checkpoint</h2>
                        <h3 style={{marginBottom: '15px'}}>{quiz.question}</h3>
                        <div style={{display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px'}}>
                            {quiz.options.map(opt => (
                                <button 
                                    key={opt}
                                    style={{padding: '15px', textAlign: 'left', border: '1px solid #ddd', borderRadius: '8px', background: selectedOpt === opt ? '#dcfce7' : 'white', cursor: 'pointer'}}
                                    onClick={() => !submitted && setSelectedOpt(opt)}
                                >{opt}</button>
                            ))}
                        </div>
                        {!submitted ? (
                            <button className="btn-success" disabled={!selectedOpt} onClick={() => setSubmitted(true)}>Submit Answer</button>
                        ) : (
                            <div style={{padding: '20px', borderRadius: '8px', background: selectedOpt === quiz.correctAnswer ? '#dcfce7' : '#fee2e2'}}>
                                <strong>{selectedOpt === quiz.correctAnswer ? '🎉 Correct!' : '❌ Incorrect. Read again!'}</strong>
                            </div>
                        )}
                    </div>
                )}
            </main>

            {/* RIGHT: COURSE CURRICULUM SIDEBAR */}
            <aside className="curriculum-sidebar">
                <div className="sidebar-head">Course Content</div>
                <div className="playlist">
                    {course.lessons.map((l, i) => (
                        <Link to={`/course/${courseId}/lesson/${l.id}`} key={l.id} className={`lesson-row ${l.id === lessonId ? 'active' : ''}`}>
                            <span className="num">{i + 1}</span>
                            <div style={{flex: 1}}>{l.title}</div>
                            {completedLessonIds.includes(l.id) && <span style={{color: '#10b981'}}>✓</span>}
                        </Link>
                    ))}
                </div>
            </aside>
        </div>
    );
}
