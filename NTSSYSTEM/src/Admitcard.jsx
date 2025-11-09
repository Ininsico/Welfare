import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const AdmitCard = () => {
  const { admitId } = useParams();
  const navigate = useNavigate();
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:3001/api/students/${admitId}`);
        
        if (!response.ok) {
          throw new Error('Student not found');
        }

        const result = await response.json();
        if (result.success) {
          setStudentData(result.data);
        } else {
          throw new Error(result.message);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (admitId) {
      fetchStudentData();
    }
  }, [admitId]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading admit card...</p>
        </div>
      </div>
    );
  }

  if (error || !studentData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Admit Card Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error || 'Invalid admit ID'}</p>
          <button
            onClick={() => navigate('/results')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Back to Results Portal
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <button
            onClick={() => navigate('/results')}
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Portal
          </button>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">AZM.AIO</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">Scholarship Test Admit Card</p>
        </div>

        {/* Admit Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 mb-6">
          {/* Student Photo & Basic Info */}
          <div className="flex flex-col md:flex-row gap-6 mb-8">
            <div className="flex-shrink-0">
              <div className="w-32 h-32 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                {studentData.photoUrl ? (
                  <img 
                    src={studentData.photoUrl} 
                    alt={studentData.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <svg className="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            </div>
            
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{studentData.name}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Admit ID</p>
                  <p className="font-mono font-bold text-lg text-blue-600 dark:text-blue-400">{studentData.admitId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Father's Name</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{studentData.father}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Grade</p>
                  <p className="font-semibold text-gray-900 dark:text-white">Grade {studentData.grade}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Contact</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{studentData.contact}</p>
                </div>
              </div>
            </div>
          </div>

          {/* School & Test Center */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">School Information</h3>
              <p className="text-gray-700 dark:text-gray-300">{studentData.school}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Test Center</h3>
              <p className="text-gray-700 dark:text-gray-300">{studentData.center}</p>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">Important Instructions</h3>
            <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
              <li>• Bring this admit card to the test center</li>
              <li>• Arrive 30 minutes before the test time</li>
              <li>• Bring your original CNIC/B-Form</li>
              <li>• No electronic devices allowed in exam hall</li>
              <li>• Keep this admit card safe until results are announced</li>
            </ul>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handlePrint}
            className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print Admit Card
          </button>
          
          <button
            onClick={() => navigate('/results')}
            className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            Back to Portal
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdmitCard;