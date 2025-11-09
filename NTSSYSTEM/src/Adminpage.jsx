import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminPanel = () => {
    const navigate = useNavigate();
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [updateData, setUpdateData] = useState({ result: '', score: '' });
    const [searchTerm, setSearchTerm] = useState('');
    const [filterGrade, setFilterGrade] = useState('all');
    const [filterResult, setFilterResult] = useState('all');

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/admin/students');
            const result = await response.json();
            if (result.success) {
                setStudents(result.data);
            }
        } catch (error) {
            console.error('Error fetching students:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateResult = async (admitId) => {
        try {
            const response = await fetch(`http://localhost:3001/api/students/${admitId}/result`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updateData)
            });
            
            if (response.ok) {
                alert('Result updated successfully!');
                fetchStudents();
                setSelectedStudent(null);
            }
        } catch (error) {
            console.error('Error updating result:', error);
        }
    };

    // Filter students based on search and filters
    const filteredStudents = students.filter(student => {
        const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            student.admitId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            student.school.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesGrade = filterGrade === 'all' || student.grade.toString() === filterGrade;
        const matchesResult = filterResult === 'all' || student.result === filterResult;
        
        return matchesSearch && matchesGrade && matchesResult;
    });

    // Get unique grades and results for filter options
    const uniqueGrades = [...new Set(students.map(student => student.grade))].sort();
    const uniqueResults = [...new Set(students.map(student => student.result))];

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading student data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">
                            Manage student results and information
                        </p>
                    </div>
                    <button
                        onClick={() => navigate('/results')}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-transform"
                    >
                        ← Back to Portal
                    </button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border-l-4 border-blue-500">
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">{students.length}</div>
                        <div className="text-gray-600 dark:text-gray-400 text-sm">Total Students</div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border-l-4 border-green-500">
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
                            {students.filter(s => s.result === 'Passed').length}
                        </div>
                        <div className="text-gray-600 dark:text-gray-400 text-sm">Passed</div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border-l-4 border-red-500">
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
                            {students.filter(s => s.result === 'Failed').length}
                        </div>
                        <div className="text-gray-600 dark:text-gray-400 text-sm">Failed</div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border-l-4 border-yellow-500">
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
                            {students.filter(s => s.result === 'Pending').length}
                        </div>
                        <div className="text-gray-600 dark:text-gray-400 text-sm">Pending</div>
                    </div>
                </div>

                {/* Filters and Search */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="md:col-span-2">
                            <input
                                type="text"
                                placeholder="Search by name, admit ID, or school..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <select
                                value={filterGrade}
                                onChange={(e) => setFilterGrade(e.target.value)}
                                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="all">All Grades</option>
                                {uniqueGrades.map(grade => (
                                    <option key={grade} value={grade}>Grade {grade}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <select
                                value={filterResult}
                                onChange={(e) => setFilterResult(e.target.value)}
                                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="all">All Results</option>
                                {uniqueResults.map(result => (
                                    <option key={result} value={result}>{result}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Students Table */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                            Registered Students ({filteredStudents.length})
                        </h2>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Admit ID
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Name
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Grade
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        School
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Result
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Score
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                {filteredStudents.map((student) => (
                                    <tr key={student._id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <code className="text-sm font-mono text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-600 px-2 py-1 rounded">
                                                {student.admitId}
                                            </code>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                            {student.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                                            Grade {student.grade}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                                            {student.school}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                                student.result === 'Passed' ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' :
                                                student.result === 'Failed' ? 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100' :
                                                'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'
                                            }`}>
                                                {student.result}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                                            {student.score || '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <div className="flex items-center space-x-3">
                                                <button
                                                    onClick={() => {
                                                        setSelectedStudent(student);
                                                        setUpdateData({ result: student.result, score: student.score });
                                                    }}
                                                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors"
                                                >
                                                    Edit
                                                </button>
                                                <span className="text-gray-300 dark:text-gray-600">|</span>
                                                <a
                                                    href={`/admit-card/${student.admitId}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 font-medium transition-colors"
                                                >
                                                    View Card
                                                </a>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {filteredStudents.length === 0 && (
                        <div className="text-center py-12">
                            <div className="text-gray-400 dark:text-gray-500 text-6xl mb-4">🔍</div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No students found</h3>
                            <p className="text-gray-600 dark:text-gray-400">Try adjusting your search or filters</p>
                        </div>
                    )}
                </div>

                {/* Edit Modal */}
                {selectedStudent && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full transform transition-all">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                    Update Result
                                </h3>
                                <button
                                    onClick={() => setSelectedStudent(null)}
                                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                                >
                                    ✕
                                </button>
                            </div>
                            
                            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-6">
                                <p className="text-sm text-blue-800 dark:text-blue-300">
                                    Updating result for <strong>{selectedStudent.name}</strong> (Admit ID: {selectedStudent.admitId})
                                </p>
                            </div>
                            
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Result Status
                                    </label>
                                    <select
                                        value={updateData.result}
                                        onChange={(e) => setUpdateData({...updateData, result: e.target.value})}
                                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="Passed">Passed</option>
                                        <option value="Failed">Failed</option>
                                    </select>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Score
                                    </label>
                                    <input
                                        type="text"
                                        value={updateData.score}
                                        onChange={(e) => setUpdateData({...updateData, score: e.target.value})}
                                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                        placeholder="e.g., 85% or A+"
                                    />
                                </div>
                                
                                <div className="flex gap-3 pt-4">
                                    <button
                                        onClick={() => handleUpdateResult(selectedStudent.admitId)}
                                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors duration-200 shadow-lg hover:shadow-xl"
                                    >
                                        Update Result
                                    </button>
                                    <button
                                        onClick={() => setSelectedStudent(null)}
                                        className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-lg font-medium transition-colors duration-200"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminPanel;