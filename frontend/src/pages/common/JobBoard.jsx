import React, { useState, useEffect } from 'react';
import { recruitmentAPI } from '../../services/api';
import ApplyModal from '../../components/Recruitment/ApplyModal';

const JobBoard = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedJob, setSelectedJob] = useState(null);
    const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

    const fetchOpenJobs = async () => {
        setLoading(true);
        try {
            const res = await recruitmentAPI.getJobs();
            // Filter only open jobs for the public board
            setJobs(res.data.filter(job => job.status === 'open'));
        } catch (err) {
            setError('Could not load job postings. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOpenJobs();
    }, []);

    const handleApply = async (applicationData) => {
        try {
            await recruitmentAPI.createApplication(applicationData);
            alert('Application submitted successfully! Good luck.');
            setIsApplyModalOpen(false);
        } catch (err) {
            alert('Error submitting application: ' + err.message);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <header className="bg-white border-b border-gray-100 px-6 py-6 shadow-sm">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <h1 className="text-2xl font-black text-gray-900 tracking-tighter uppercase italic">
                        Careers <span className="text-blue-600">Portal</span>
                    </h1>
                    <a href="/login" className="text-sm font-bold text-gray-500 hover:text-blue-600 transition-colors">
                        Employee Login
                    </a>
                </div>
            </header>

            {/* Hero */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-800 text-white py-16 px-6">
                <div className="max-w-7xl mx-auto text-center space-y-4">
                    <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">Join Our Outstanding Team</h2>
                    <p className="text-lg text-blue-100 max-w-2xl mx-auto">
                        We are looking for passionate individuals to help us build the next generation of HR technology.
                    </p>
                </div>
            </div>

            {/* Jobs List */}
            <main className="max-w-4xl mx-auto w-full px-6 py-12 flex-1">
                {error && (
                    <div className="bg-red-50 border border-red-100 text-red-700 px-6 py-4 rounded-2xl mb-8">
                        {error}
                    </div>
                )}

                {jobs.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                        <p className="text-gray-400 font-medium">No open positions at the moment. Check back soon!</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {jobs.map((job) => (
                            <div key={job.id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-blue-100 transition-all group">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded">
                                                New
                                            </span>
                                            <span className="text-xs text-gray-400 font-medium italic">Posted: {job.posted_date}</span>
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">{job.title}</h3>
                                        <div className="flex items-center gap-4 text-sm text-gray-500 font-medium">
                                            <span className="flex items-center gap-1">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-10V4a1 1 0 011-1h2a1 1 0 011 1v3M12 7h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                </svg>
                                                Development
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                Remote
                                            </span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => { setSelectedJob(job); setIsApplyModalOpen(true); }}
                                        className="px-8 py-3 bg-gray-900 text-white rounded-2xl font-bold hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-200 transition-all active:scale-95"
                                    >
                                        Apply Now
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            <footer className="bg-white border-t border-gray-100 py-12 px-6">
                <div className="max-w-7xl mx-auto text-center">
                    <p className="text-gray-400 text-sm font-medium">© 2026 HR ERP Systems Inc. All rights reserved.</p>
                </div>
            </footer>

            <ApplyModal
                isOpen={isApplyModalOpen}
                onClose={() => setIsApplyModalOpen(false)}
                onApply={handleApply}
                job={selectedJob}
            />
        </div>
    );
};

export default JobBoard;
