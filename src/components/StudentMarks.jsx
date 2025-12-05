import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { 
  getStudentMarksByStudentId, 
  setStudentMarks, 
  updateStudentMarks, 
  deleteStudentMarks 
} from '../services/marksService';
import { getStudentById } from '../services/studentService';

const StudentMarks = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const [marks, setMarks] = useState([]);
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingMark, setEditingMark] = useState(null);
  const [formData, setFormData] = useState({
    subjectName: '',
    subjectMark: '',
  });

  useEffect(() => {
    fetchStudentAndMarks();
  }, [studentId]);

  const fetchStudentAndMarks = async () => {
    try {
      setLoading(true);
      const [studentRes, marksRes] = await Promise.all([
        getStudentById(studentId),
        getStudentMarksByStudentId(studentId)
      ]);
      
      if (studentRes.success) setStudent(studentRes.data);
      if (marksRes.success) setMarks(marksRes.data);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Failed to fetch data',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const result = await Swal.fire({
      title: editingMark ? 'Update Mark?' : 'Add New Mark?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
    });

    if (result.isConfirmed) {
      try {
        if (editingMark) {
          await updateStudentMarks(editingMark.id, {
            subjectName: formData.subjectName,
            subjectMark: parseInt(formData.subjectMark),
          });
          Swal.fire({
            icon: 'success',
            title: 'Updated!',
            text: 'Mark updated successfully',
            timer: 2000,
          });
        } else {
          await setStudentMarks({
            studentId,
            subjectName: formData.subjectName,
            subjectMark: parseInt(formData.subjectMark),
          });
          Swal.fire({
            icon: 'success',
            title: 'Created!',
            text: 'Mark added successfully',
            timer: 2000,
          });
        }
        setFormData({ subjectName: '', subjectMark: '' });
        setShowAddForm(false);
        setEditingMark(null);
        fetchStudentAndMarks();
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: `Failed to ${editingMark ? 'update' : 'add'} mark`,
        });
      }
    }
  };

  const handleEdit = (mark) => {
    setEditingMark(mark);
    setFormData({
      subjectName: mark.subjectName,
      subjectMark: mark.subjectMark.toString(),
    });
    setShowAddForm(true);
  };

  const handleDelete = async (markId) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'Delete this mark record? This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      try {
        await deleteStudentMarks(markId);
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'Mark deleted successfully',
          timer: 2000,
        });
        fetchStudentAndMarks();
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Failed to delete mark',
        });
      }
    }
  };

  const calculateAverage = () => {
    if (marks.length === 0) return 0;
    const total = marks.reduce((sum, mark) => sum + mark.subjectMark, 0);
    return (total / marks.length).toFixed(2);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <button
          onClick={() => navigate('/')}
          className="text-blue-600 hover:text-blue-800 flex items-center gap-2 mb-4"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Students
        </button>

        {student && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">{student.name}'s Marks</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <span className="text-sm font-medium text-gray-500">Roll Number:</span>
                <p className="text-lg font-semibold">{student.rollNumber}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Standard:</span>
                <p className="text-lg font-semibold">{student.standard}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Total Subjects:</span>
                <p className="text-lg font-semibold">{marks.length}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Average Mark:</span>
                <p className="text-lg font-semibold text-blue-600">{calculateAverage()}</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-800">Subject Marks</h3>
          <button
            onClick={() => {
              setEditingMark(null);
              setFormData({ subjectName: '', subjectMark: '' });
              setShowAddForm(true);
            }}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Add Mark
          </button>
        </div>
      </div>

      {showAddForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">
            {editingMark ? 'Edit Mark' : 'Add New Mark'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject Name *
                </label>
                <input
                  type="text"
                  value={formData.subjectName}
                  onChange={(e) => setFormData(prev => ({ ...prev, subjectName: e.target.value }))}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mark (0-100) *
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.subjectMark}
                  onChange={(e) => setFormData(prev => ({ ...prev, subjectMark: e.target.value }))}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setEditingMark(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                {editingMark ? 'Update Mark' : 'Add Mark'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Subject
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mark
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Grade
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Updated
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {marks.map((mark) => {
              const grade = mark.subjectMark >= 90 ? 'A' :
                           mark.subjectMark >= 80 ? 'B' :
                           mark.subjectMark >= 70 ? 'C' :
                           mark.subjectMark >= 60 ? 'D' : 'F';
              const gradeColor = grade === 'A' ? 'text-green-600' :
                               grade === 'B' ? 'text-blue-600' :
                               grade === 'C' ? 'text-yellow-600' :
                               grade === 'D' ? 'text-orange-600' : 'text-red-600';

              return (
                <tr key={mark.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{mark.subjectName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{mark.subjectMark}/100</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${gradeColor}`}>
                      {grade}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(mark.updatedAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleEdit(mark)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(mark.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {marks.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No marks recorded yet. Add marks to get started.
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentMarks;