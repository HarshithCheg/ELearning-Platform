import {useEffect, useState} from 'react';
import {Link, useParams} from 'react-router-dom';
import axios from 'axios';
import ReactPlayer from 'react-player';
import useLearning from '../context/useLearning';
import '../App.css';

export default function LessonViewer() {
    const {courseID, lessonID} = useParams();
    return <LessonContent key={`${courseID}-${lessonID}`} courseID={courseID} lessonID={lessonID} />;
}

function LessonContent({courseID, lessonID}) {
    const [course, setCourse] = useState();
    const [lesson, setLesson] = useState();
    const [quiz, setQuiz] = useState();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [videoError, setVideoError] = useState(false);
    const [playerAttempt, setPlayerAttempt] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState('');
    const [quizSubmitted, setQuizSubmitted] = useState(false);
    const {completedLessonIds, completeLesson} = useLearning();
    const isCompleted = completedLessonIds.includes(lessonID);

    useEffect(() => {
        async function fetchLesson() {
            try {
                const response = await axios.get('/data.json');
                const foundCourse = response.data.courses.find(item => item.id === courseID);
                const foundLesson = foundCourse?.lessons.find(item => item.id === lessonID);

                setCourse(foundCourse);
                setLesson(foundLesson);
                setQuiz(foundCourse?.quizzes.find(item => item.lessonId === lessonID));
            } catch (error) {
                console.error('Could not load lesson:', error);
                setError('Lesson could not be loaded. Please try again later.');
            } finally {
                setLoading(false);
            }
        }

        fetchLesson();
    }, [courseID, lessonID]);

    if (loading) {
        return <div className="page-container"><h2>Loading lesson...</h2></div>;
    }

    if (error) {
        return <div className="page-container"><p className="error-message">{error}</p></div>;
    }

    if (!course || !lesson) {
        return <div className="page-container"><h2>Lesson not found</h2></div>;
    }

    function markLessonComplete() {
        completeLesson(lesson.id);
    }

    function submitQuiz(event) {
        event.preventDefault();
        if (selectedAnswer) {
            setQuizSubmitted(true);
        }
    }

    return (
        <div className="page-container lesson-page">
            <Link className="back-link" to={`/course/${course.id}`}>← Back to {course.title}</Link>
            <h1>{lesson.title}</h1>
            <p>{lesson.description}</p>

            <div className="video-player">
                {videoError ? (
                    <div className="video-error">
                        <p>The video could not be played in the embedded player.</p>
                        <button
                            className="video-retry"
                            onClick={() => {
                                setVideoError(false);
                                setPlayerAttempt(attempt => attempt + 1);
                            }}
                        >
                            Try again
                        </button>
                        <a href={lesson.videoUrl} target="_blank" rel="noreferrer">
                            Open video on YouTube
                        </a>
                    </div>
                ) : (
                    <ReactPlayer
                        key={`${lesson.videoUrl}-${playerAttempt}`}
                        src={lesson.videoUrl}
                        controls
                        width="100%"
                        height="100%"
                        onEnded={markLessonComplete}
                        onError={(error) => {
                            console.error('Video playback failed:', error);
                            setVideoError(true);
                        }}
                    />
                )}
            </div>
            <p className="video-help">
                If the player stays blank, <a href={lesson.videoUrl} target="_blank" rel="noreferrer">watch this lesson on YouTube</a>.
            </p>

            <button
                className="btn-primary complete-button"
                onClick={markLessonComplete}
                disabled={isCompleted}
            >
                {isCompleted ? 'Lesson Completed' : 'Mark Lesson Complete'}
            </button>

            {quiz && (
                <section className="quiz-section">
                    <h2>Quick Quiz</h2>
                    <form onSubmit={submitQuiz}>
                        <fieldset disabled={quizSubmitted}>
                            <legend>{quiz.question}</legend>
                            {quiz.options.map(option => (
                                <label className="quiz-option" key={option}>
                                    <input
                                        type="radio"
                                        name={quiz.id}
                                        value={option}
                                        checked={selectedAnswer === option}
                                        onChange={() => setSelectedAnswer(option)}
                                    />
                                    {option}
                                </label>
                            ))}
                        </fieldset>
                        <button className="btn-primary quiz-submit" type="submit" disabled={!selectedAnswer || quizSubmitted}>
                            Submit Answer
                        </button>
                    </form>
                    {quizSubmitted && (
                        <p className={selectedAnswer === quiz.correctAnswer ? 'success-message' : 'error-message'}>
                            {selectedAnswer === quiz.correctAnswer
                                ? 'Correct! Well done.'
                                : `Not quite. The correct answer is ${quiz.correctAnswer}.`}
                        </p>
                    )}
                </section>
            )}
        </div>
    );
}