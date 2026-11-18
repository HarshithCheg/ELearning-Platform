import { useState } from 'react';
import './App.css';
import { Routes, Route, Link } from 'react-router-dom';

import CourseCatalog from './pages/CourseCatalog';
import CourseOverview from './pages/CourseOverview';
import UserDashboard from './pages/UserDashboard';
import LessonViewer from './pages/LessonViewer';

export default function App() {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <div className="app-shell">
            <nav className={`navbar ${menuOpen ? 'nav-open' : ''}`}>
                <div className="nav-container">
                    <Link to='/' className='nav-brand' onClick={() => setMenuOpen(false)}>
                        EduTech <span>Platform</span>
                    </Link>
                    <button
                        type="button"
                        className="nav-toggle"
                        aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                        aria-expanded={menuOpen}
                        aria-controls="primary-navigation"
                        onClick={() => setMenuOpen(isOpen => !isOpen)}
                    >
                        <span />
                        <span />
                        <span />
                    </button>
                    <div className='nav-links' id="primary-navigation">
                        <Link to="/" className='nav-link' onClick={() => setMenuOpen(false)}>Catalog</Link>
                        <Link to="/dashboard" className='nav-link' onClick={() => setMenuOpen(false)}>My Dashboard</Link>
                    </div>
                </div>
            </nav>

            <div>
                <Routes>
                    <Route path='/' element={<CourseCatalog />} />
                    <Route path='/dashboard' element={<UserDashboard />} />
                    <Route path='/course/:id' element={<CourseOverview />} />
                    <Route path='/course/:courseId/lesson/:lessonId' element={<LessonViewer />} />
                    <Route
                        path='*'
                        element={
                            <div className="page-container not-found">
                                <h1>Page not found</h1>
                                <Link to="/">Return to the course catalog</Link>
                            </div>
                        }
                    />
                </Routes>
            </div>
        </div>
    );
}
