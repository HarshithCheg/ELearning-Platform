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
    const [error, setError] = useState('');
    const [selectedOpt, setSelectedOpt] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [videoError, setVideoError] = useState(false);

    const { completeLesson, completedLessonIds, saveQuizResult } = useLearning();

    useEffect(() => {
        async function fetchLesson() {
            try {
                const response = await axios.get('/data.json');
                const foundCourse = response.data.courses.find(
                    item => String(item.id) === String(courseId)
                );
                const foundLesson = foundCourse?.lessons.find(
                    item => String(item.id) === String(lessonId)
                );
                const foundQuiz = foundCourse?.quizzes.find(
                    item => String(item.lessonId) === String(lessonId)
                );

                setCourse(foundCourse || null);
                setLesson(foundLesson || null);
                setQuiz(foundQuiz || null);
            } catch (error) {
                console.error('Could not load lesson:', error);
                setError('Lesson could not be loaded. Please try again later.');
            } finally {
                setLoading(false);
            }
        }

        fetchLesson();
    }, [courseId, lessonId]);

    if (loading) return <div className="flex-center">Loading lesson...</div>;
    if (error) return <div className="page-container"><p className="error-message">{error}</p></div>;
    if (!course || !lesson) return <div className="page-container"><p className="error-message">Lesson not found.</p></div>;

    return (
        <div className="viewer-container">
            <main className="video-main-column">
                <Link to={`/course/${courseId}`} className="back-link">← Back to {course.title}</Link>
                
                <div className="video-wrapper">
                    {videoError ? (
                        <div className="video-error">
                            <p>This video could not be loaded in the embedded player.</p>
                            <a href={lesson.videoUrl} target="_blank" rel="noreferrer">Watch on YouTube</a>
                        </div>
                    ) : (
                        <ReactPlayer
                            src={lesson.videoUrl}
                            controls
                            width="100%"
                            height="100%"
                            onEnded={() => completeLesson(lessonId)}
                            onError={playerError => {
                                console.error('Video playback failed:', playerError);
                                setVideoError(true);
                            }}
                        />
                    )}
                </div>
                <p className="video-fallback-link">
                    If the video does not play here, <a href={lesson.videoUrl} target="_blank" rel="noreferrer">watch it on YouTube</a>.
                </p>

                <div className="video-meta">
                    <h1>{lesson.title}</h1>
                    <p>{lesson.description}</p>
                    <button
                        className="btn-primary"
                        onClick={() => completeLesson(lessonId)}
                        disabled={completedLessonIds.includes(lessonId)}
                    >
                        {completedLessonIds.includes(lessonId) ? 'Lesson completed' : 'Mark lesson complete'}
                    </button>
                </div>

                {quiz && (
                    <div className="quiz-section-viewer">
                        <h2>Quick quiz</h2>
                        <h3>{quiz.question}</h3>
                        <div className="quiz-options">
                            {quiz.options.map(opt => (
                                <button 
                                    key={opt}
                                    className={`quiz-answer ${selectedOpt === opt ? 'selected' : ''}`}
                                    onClick={() => !submitted && setSelectedOpt(opt)}
                                    disabled={submitted}
                                >{opt}</button>
                            ))}
                        </div>
                        {!submitted ? (
                            <button
                                className="btn-success"
                                disabled={!selectedOpt}
                                onClick={() => {
                                    if (selectedOpt) {
                                        saveQuizResult(quiz.id, selectedOpt, selectedOpt === quiz.correctAnswer);
                                        setSubmitted(true);
                                    }
                                }}
                            >
                                Submit answer
                            </button>
                        ) : (
                            <div className={`quiz-feedback ${selectedOpt === quiz.correctAnswer ? 'correct' : 'incorrect'}`}>
                                <strong>
                                    {selectedOpt === quiz.correctAnswer
                                        ? 'Correct! Well done.'
                                        : `Not quite. The correct answer is ${quiz.correctAnswer}.`}
                                </strong>
                            </div>
                        )}
                    </div>
                )}
            </main>

            <aside className="curriculum-sidebar" aria-label="Course lessons">
                <div className="sidebar-head">Course Content</div>
                <div className="playlist">
                    {course.lessons.map((l, i) => (
                        <Link to={`/course/${courseId}/lesson/${l.id}`} key={l.id} className={`lesson-row ${l.id === lessonId ? 'active' : ''}`}>
                            <span className="num">{i + 1}</span>
                            <div className="lesson-row-title">{l.title}</div>
                            {completedLessonIds.includes(l.id) && <span className="lesson-complete" aria-label="Completed">✓</span>}
                        </Link>
                    ))}
                </div>
            </aside>
        </div>
    );
}
