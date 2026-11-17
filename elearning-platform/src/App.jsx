import {useState} from 'react';
import './App.css';
import {Routes, Route, Link} from 'react-router-dom';

import CourseCatalog from './pages/CourseCatalog';
import CourseOverview from './pages/CourseOverview';
import UserDashboard from './pages/UserDashboard';
import LessonViewer from './pages/LessonViewer';

export default function App() {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <>
            <nav className={`navbar ${menuOpen ? 'menu-open' : ''}`}>
                <div className="nav-top-row">
                    <Link to="/" className="nav-brand" onClick={() => setMenuOpen(false)}>
                        EduTech Platform
                    </Link>
                    <button
                        className="menu-toggle"
                        type="button"
                        aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                        aria-expanded={menuOpen}
                        aria-controls="primary-navigation"
                        onClick={() => setMenuOpen(isOpen => !isOpen)}
                    >
                        <span />
                        <span />
                        <span />
                    </button>
                </div>
                <div className="nav-links" id="primary-navigation">
                    <Link to="/" className="nav-link" onClick={() => setMenuOpen(false)}>Catalog</Link>
                    <Link to="/dashboard" className="nav-link" onClick={() => setMenuOpen(false)}>My Dashboard</Link>
                </div>
            </nav> 
            <main className='page-container'>
                <Routes>
                    <Route path='/' element={<CourseCatalog/>}></Route>
                    <Route path='/dashboard' element={<UserDashboard/>}/>
                    <Route path='/course/:courseID' element={<CourseOverview/>}/>
                    <Route path='/course/:courseID/lesson/:lessonID' element={<LessonViewer/>}/>
                </Routes>
            </main>       
        </>
    );
}
