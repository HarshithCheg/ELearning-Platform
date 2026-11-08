import './App.css';
import {Routes, Route, Link} from 'react-router-dom';

import CourseCatalog from './pages/CourseCatalog';
import CourseOverview from './pages/CourseOverview';
import UserDashboard from './pages/UserDashboard';
import LessonViewer from './pages/LessonViewer';

export default function App() {
    return (
        <>
            <nav className='navbar'>
                <Link to= '/' className='nav-brand'>EduTech Platform</Link>
                <div className='nav-links'>
                    <Link to="/" className='nav-link'>Catalog</Link>
                    <Link to="/dashboard" className='nav-link'>My Dashboard</Link>
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
