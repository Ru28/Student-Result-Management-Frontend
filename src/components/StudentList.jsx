import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import StudentForm from './StudentForm';
import { 
  getAllStudents, 
  deleteStudentById, 
  setStudentInfo, 
  updateStudentInfo 
} from '../services/studentService';

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [expandedStudent, setExpandedStudent] = useState(null);
  const navigate = useNavigate();
  const itemsPerPage = 10;

  useEffect(() => {
    fetchStudents();
  }, [currentPage]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await getAllStudents();
      if (response.success) {
        setStudents(response.data);
        setTotalPages(Math.ceil(response.data.length / itemsPerPage));
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Failed to fetch students',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Delete ${name}? This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      try {
        await deleteStudentById(id);
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'Student has been deleted.',
          timer: 2000,
        });
        fetchStudents();
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Failed to delete student',
        });
      }
    }
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setShowForm(true);
  };

  const handleViewMarks = (studentId) => {
    navigate(`/student/${studentId}/marks`);
  };

  const handleSubmitForm = async (studentData) => {
    try {
      if (editingStudent) {
        await updateStudentInfo({ ...studentData, id: editingStudent.id });
        Swal.fire({
          icon: 'success',
          title: 'Updated!',
          text: 'Student information updated successfully.',
          timer: 2000,
        });
      } else {
        await setStudentInfo(studentData);
        Swal.fire({
          icon: 'success',
          title: 'Created!',
          text: 'New student created successfully.',
          timer: 2000,
        });
      }
      setShowForm(false);
      setEditingStudent(null);
      fetchStudents();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: `Failed to ${editingStudent ? 'update' : 'create'} student`,
      });
    }
  };

  const toggleStudentExpand = (studentId) => {
    setExpandedStudent(expandedStudent === studentId ? null : studentId);
  };

  const paginatedStudents = students.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Student Result Management</h1>
        <button
          onClick={() => {
            setEditingStudent(null);
            setShowForm(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Add Student
        </button>
      </div>

      {showForm && (
        <StudentForm
          student={editingStudent}
          onSubmit={handleSubmitForm}
          onCancel={() => {
            setShowForm(false);
            setEditingStudent(null);
          }}
        />
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student Info
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedStudents.map((student) => (
                  <React.Fragment key={student.id}>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <button
                            onClick={() => toggleStudentExpand(student.id)}
                            className="mr-3 text-gray-400 hover:text-gray-600"
                          >
                            <svg
                              className={`w-5 h-5 transform transition-transform ${
                                expandedStudent === student.id ? 'rotate-90' : ''
                              }`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{student.name}</div>
                            <div className="text-sm text-gray-500">
                              Roll No: {student.rollNumber} | Class: {student.standard}
                            </div>
                            <div className="text-sm text-gray-500">Student Card ID: {student.studentCardId}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{student.email}</div>
                        <div className="text-sm text-gray-500">{student.phone}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-3">
                          <button
                            onClick={() => handleEdit(student)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleViewMarks(student.id)}
                            className="text-green-600 hover:text-green-900"
                          >
                            View Marks
                          </button>
                          <button
                            onClick={() => handleDelete(student.id, student.name)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                    {expandedStudent === student.id && (
                      <tr>
                        <td colSpan="3" className="px-6 py-4 bg-gray-50">
                          <div className="ml-8">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              <div>
                                <span className="text-sm font-medium text-gray-500">Full Name:</span>
                                <p className="text-sm">{student.name}</p>
                              </div>
                              <div>
                                <span className="text-sm font-medium text-gray-500">Roll Number:</span>
                                <p className="text-sm">{student.rollNumber}</p>
                              </div>
                              <div>
                                <span className="text-sm font-medium text-gray-500">Student Card ID:</span>
                                <p className="text-sm">{student.studentCardId}</p>
                              </div>
                              <div>
                                <span className="text-sm font-medium text-gray-500">Standard:</span>
                                <p className="text-sm">{student.standard}</p>
                              </div>
                              <div>
                                <span className="text-sm font-medium text-gray-500">Email:</span>
                                <p className="text-sm">{student.email}</p>
                              </div>
                              <div>
                                <span className="text-sm font-medium text-gray-500">Phone:</span>
                                <p className="text-sm">{student.phone}</p>
                              </div>
                              <div>
                                <span className="text-sm font-medium text-gray-500">Created At:</span>
                                <p className="text-sm">
                                  {new Date(student.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-700">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to{' '}
              {Math.min(currentPage * itemsPerPage, students.length)} of {students.length} students
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded ${
                  currentPage === 1
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 rounded ${
                    currentPage === page
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded ${
                  currentPage === totalPages
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default StudentList;