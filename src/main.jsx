import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import StorePage from './pages/StorePage.jsx'
import CoursesPage from './pages/CoursesPage.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="/store" element={<StorePage />} />
                <Route path="/courses" element={<CoursesPage />} />
            </Routes>
        </BrowserRouter>
    </React.StrictMode>,
)
