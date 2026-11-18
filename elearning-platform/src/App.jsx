import './App.css';
import { Routes, Route, Link } from 'react-router-dom';

import CourseCatalog from './pages/CourseCatalog';
import CourseOverview from './pages/CourseOverview';
import UserDashboard from './pages/UserDashboard';
import LessonViewer from './pages/LessonViewer';

export default function App() {
    return (
        <div className="app-shell">
            <nav className='navbar'>
                <div className="nav-container">
                    <Link to='/' className='nav-brand'>EduTech <span>Platform</span></Link>
                    
                    <div className='nav-links'>
                        <Link to="/" className='nav-link'>Catalog</Link>
                        <Link to="/dashboard" className='nav-link'>My Dashboard</Link>
                    </div>
                </div>
            </nav> 

            {/* Note: I removed 'page-container' from here because our pages 
                now handle their own spacing for that full-width hero look */}
            <main>
                <Routes>
                    {/* Homepage: Course Grid */}
                    <Route path='/' element={<CourseCatalog />} />
                    
                    {/* Protected-style Dashboard */}
                    <Route path='/dashboard' element={<UserDashboard />} />
                    
                    {/* Course Detail (YouTube style tabs) */}
                    <Route path='/course/:id' element={<CourseOverview />} />
                    
                    {/* Inner Lesson/Quiz Viewer (The 2-column layout) */}
                    <Route path='/course/:courseId/lesson/:lessonId' element={<LessonViewer />} />
                </Routes>
            </main>       
        </div>
    );
}
