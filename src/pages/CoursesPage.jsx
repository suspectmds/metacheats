import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, Trash2, ArrowLeft, Shield, Lock, Save, X, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import MouseGlow from '../components/MouseGlow.jsx';

const CoursesPage = () => {
    const [courses, setCourses] = useState([]);
    const [isAdmin, setIsAdmin] = useState(false);
    const [showAdminLogin, setShowAdminLogin] = useState(false);
    const [adminPassword, setAdminPassword] = useState('');
    const [isAddingCourse, setIsAddingCourse] = useState(false);
    const [newCourse, setNewCourse] = useState({ title: '', content: '', category: 'Sheet Setup' });
    const [selectedCourse, setSelectedCourse] = useState(null);

    // Load courses from localStorage
    useEffect(() => {
        const savedCourses = localStorage.getItem('metacheats_courses');
        if (savedCourses) {
            setCourses(JSON.parse(savedCourses));
        } else {
            // Default initial courses
            const initialCourses = [
                { id: 1, title: 'Elite Sheet Setup Guide', category: 'Sheet Setup', content: 'Comprehensive instructions on configuring your supreme dominance sheets for maximum performance.' },
                { id: 2, title: 'Kernel-Level Optimization', category: 'Advanced', content: 'Detailed technical documentation on ensuring your environment is optimized for our most undetected cheats.' }
            ];
            setCourses(initialCourses);
            localStorage.setItem('metacheats_courses', JSON.stringify(initialCourses));
        }
    }, []);

    const saveCourses = (updatedCourses) => {
        setCourses(updatedCourses);
        localStorage.setItem('metacheats_courses', JSON.stringify(updatedCourses));
    };

    const handleAdminLogin = (e) => {
        e.preventDefault();
        if (adminPassword === 'admin123') { // Simple mockup password
            setIsAdmin(true);
            setShowAdminLogin(false);
            setAdminPassword('');
        } else {
            alert('Access Denied: Invalid Security Protocol');
        }
    };

    const addCourse = () => {
        if (!newCourse.title || !newCourse.content) return;
        const updated = [...courses, { ...newCourse, id: Date.now() }];
        saveCourses(updated);
        setNewCourse({ title: '', content: '', category: 'Sheet Setup' });
        setIsAddingCourse(false);
    };

    const deleteCourse = (id) => {
        const updated = courses.filter(c => c.id !== id);
        saveCourses(updated);
    };

    return (
        <div className="min-h-screen bg-transparent selection-blue relative overflow-hidden font-['Plus_Jakarta_Sans']">
            <MouseGlow />

            {/* Navbar */}
            <nav className="glass h-20 px-6 flex items-center justify-between border-b border-white/5 sticky top-0 z-50">
                <span className="font-extrabold text-[10px] uppercase tracking-[0.3em]">Return to Nexus</span>
                <div className="flex items-center gap-3">
                    <img src="/src/assets/logo.png" alt="Meta Cheats" className="h-8 w-auto object-contain drop-shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
                    <span className="font-black tracking-tighter text-accent uppercase" style={{ textShadow: '0 0 10px rgba(34, 197, 94, 0.6)' }}>COURSES HUB</span>
                </div>
                <button
                    onClick={() => isAdmin ? setIsAdmin(false) : setShowAdminLogin(true)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all text-[10px] font-black uppercase tracking-widest ${isAdmin ? 'bg-accent/10 border-accent text-accent' : 'bg-white/5 border-white/10 text-muted hover:text-white'}`}
                >
                    {isAdmin ? <Shield size={14} /> : <Lock size={14} />}
                    {isAdmin ? 'Admin Active' : 'Admin Access'}
                </button>
            </nav>

            <main className="max-w-7xl mx-auto px-6 py-20 relative z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                    <div>
                        <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tighter uppercase italic">
                            Operational <span className="text-accent text-glow">Intelligence</span>
                        </h2>
                        <p className="text-muted font-bold uppercase tracking-[0.2em] text-sm opacity-70">
                            Elite instructions for supreme dominance configuration.
                        </p>
                    </div>
                    {isAdmin && (
                        <button
                            onClick={() => setIsAddingCourse(true)}
                            className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-accent to-brandPurple text-white rounded-2xl font-black uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(34,197,94,0.4)] hover:scale-105 transition-all"
                        >
                            <Plus size={20} /> New Document
                        </button>
                    )}
                </div>

                {/* Course Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <AnimatePresence>
                        {courses.map((course) => (
                            <motion.div
                                key={course.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="glass p-8 rounded-[2.5rem] border border-white/5 hover:border-accent/40 transition-all group relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="flex justify-between items-start mb-6">
                                    <div className="p-3 bg-white/5 rounded-xl text-accent group-hover:bg-accent/10 transition-colors">
                                        <FileText size={24} />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-muted border border-white/10 px-3 py-1 rounded-full">
                                        {course.category}
                                    </span>
                                </div>
                                <h3 className="text-xl font-black mb-4 uppercase tracking-tight group-hover:text-accent transition-colors">
                                    {course.title}
                                </h3>
                                <p className="text-muted text-sm leading-relaxed mb-8 font-medium">
                                    {course.content}
                                </p>
                                <div className="flex items-center justify-between">
                                    <button
                                        onClick={() => setSelectedCourse(course)}
                                        className="text-[10px] font-black uppercase tracking-[0.3em] text-accent hover:text-white transition-all flex items-center gap-2 group/btn"
                                    >
                                        Access Intel <ArrowLeft className="rotate-180 group-hover/btn:translate-x-1 transition-transform" size={14} />
                                    </button>
                                    {isAdmin && (
                                        <button
                                            onClick={() => deleteCourse(course.id)}
                                            className="p-2 text-red-500/50 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Admin Login Modal */}
                <AnimatePresence>
                    {showAdminLogin && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 bg-[#08080A]/80 backdrop-blur-sm"
                                onClick={() => setShowAdminLogin(false)}
                            />
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                className="glass w-full max-w-md p-10 rounded-[3rem] relative z-110 border border-accent/20 shadow-[0_0_50px_rgba(0,0,0,0.5)]"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <h3 className="text-2xl font-black mb-2 text-center uppercase tracking-tighter italic">Secure Access</h3>
                                <p className="text-center text-muted text-[10px] font-bold uppercase tracking-[0.3em] mb-8">Verification Required</p>
                                <form onSubmit={handleAdminLogin} className="space-y-6">
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
                                        <input
                                            type="password"
                                            placeholder="ENTER ADMIN PROTOCOL"
                                            value={adminPassword}
                                            onChange={(e) => setAdminPassword(e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-sm font-black tracking-[0.2em] focus:border-accent/50 focus:outline-none transition-all placeholder:text-muted/30"
                                            autoFocus
                                        />
                                    </div>
                                    <button className="w-full py-4 bg-gradient-to-r from-accent to-brandPurple text-white font-black uppercase tracking-[0.3em] rounded-2xl shadow-[0_0_20px_rgba(34,197,94,0.4)]">
                                        Authorize
                                    </button>
                                </form>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                {/* View Course Intel Modal */}
                <AnimatePresence>
                    {selectedCourse && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 bg-[#08080A]/80 backdrop-blur-sm"
                                onClick={() => setSelectedCourse(null)}
                            />
                            <motion.div
                                initial={{ y: 50, opacity: 0, scale: 0.9 }}
                                animate={{ y: 0, opacity: 1, scale: 1 }}
                                exit={{ y: 50, opacity: 0, scale: 0.9 }}
                                className="glass w-full max-w-3xl p-12 rounded-[4rem] relative z-110 border border-accent/20 overflow-hidden"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="absolute top-0 right-0 p-8">
                                    <button onClick={() => setSelectedCourse(null)} className="p-2 hover:bg-white/5 rounded-full transition-colors text-muted hover:text-white">
                                        <X size={24} />
                                    </button>
                                </div>
                                <div className="flex items-start gap-6 mb-10">
                                    <div className="p-5 bg-accent/10 rounded-2xl text-accent shadow-[0_0_15px_rgba(34,197,94,0.3)]">
                                        <FileText size={32} />
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-accent mb-2 block">{selectedCourse.category}</span>
                                        <h2 className="text-4xl font-black uppercase tracking-tighter italic">{selectedCourse.title}</h2>
                                    </div>
                                </div>
                                <div className="h-px w-full bg-gradient-to-r from-accent/20 via-transparent to-transparent mb-10" />
                                <div className="max-h-[50vh] overflow-y-auto pr-6 custom-scrollbar">
                                    <p className="text-muted leading-relaxed text-lg font-medium whitespace-pre-wrap">
                                        {selectedCourse.content}
                                    </p>
                                </div>
                                <div className="mt-12 flex justify-end">
                                    <button
                                        onClick={() => setSelectedCourse(null)}
                                        className="px-10 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white/10 transition-all"
                                    >
                                        Close Intel
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                {/* Add Course Modal */}
                <AnimatePresence>
                    {isAddingCourse && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 bg-[#08080A]/80 backdrop-blur-sm"
                                onClick={() => setIsAddingCourse(false)}
                            />
                            <motion.div
                                initial={{ y: 50, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: 50, opacity: 0 }}
                                className="glass w-full max-w-2xl p-12 rounded-[3.5rem] relative z-110 border border-accent/20"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="flex justify-between items-center mb-10">
                                    <h3 className="text-3xl font-black uppercase tracking-tighter italic">Create Intelligence</h3>
                                    <button onClick={() => setIsAddingCourse(false)} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                                        <X size={24} className="text-muted" />
                                    </button>
                                </div>
                                <div className="space-y-8">
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-accent mb-3 block">Document Title</label>
                                        <input
                                            type="text"
                                            value={newCourse.title}
                                            onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm font-bold focus:border-accent/50 focus:outline-none transition-all"
                                            placeholder="Ex: Advanced Sheet Deployment"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-accent mb-3 block">Category</label>
                                        <select
                                            value={newCourse.category}
                                            onChange={(e) => setNewCourse({ ...newCourse, category: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm font-bold focus:border-accent/50 focus:outline-none transition-all appearance-none"
                                        >
                                            <option value="Sheet Setup">Sheet Setup</option>
                                            <option value="Advanced">Advanced</option>
                                            <option value="Protocol">Protocol</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-accent mb-3 block">Content Intel</label>
                                        <textarea
                                            rows="5"
                                            value={newCourse.content}
                                            onChange={(e) => setNewCourse({ ...newCourse, content: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm font-bold focus:border-accent/50 focus:outline-none transition-all resize-none"
                                            placeholder="Enter the instructions for supreme dominance..."
                                        />
                                    </div>
                                    <button
                                        onClick={addCourse}
                                        className="w-full py-5 bg-gradient-to-r from-accent to-brandPurple text-white font-black uppercase tracking-[0.3em] rounded-2xl shadow-[0_0_30px_rgba(34,197,94,0.4)] flex items-center justify-center gap-3"
                                    >
                                        <Save size={20} /> Deploy Intelligence
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};

export default CoursesPage;
