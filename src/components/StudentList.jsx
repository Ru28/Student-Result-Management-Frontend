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
  const [totalRecords, setTotalRecords] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [expandedStudent, setExpandedStudent] = useState(null);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('DESC');
  const [standardFilter, setStandardFilter] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchStudents();
  }, [currentPage, itemsPerPage, sortBy, sortOrder, standardFilter, searchTerm]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm,
        standard: standardFilter || undefined,
        sortBy,
        sortOrder,
      };
      
      // Remove undefined params
      Object.keys(params).forEach(key => params[key] === undefined && delete params[key]);
      
      const response = await getAllStudents(params);
      if (response.success) {
        setStudents(response.data);
        setTotalRecords(response.totalRecords);
        setTotalPages(response.totalPages);
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

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page when searching
    fetchStudents();
  };

  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      // Toggle sort order if clicking the same field
      setSortOrder(sortOrder === 'ASC' ? 'DESC' : 'ASC');
    } else {
      // Set new sort field with default DESC order
      setSortBy(field);
      setSortOrder('DESC');
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStandardFilter('');
    setCurrentPage(1);
    setSortBy('createdAt');
    setSortOrder('DESC');
  };

  // Calculate start and end record numbers
  const startRecord = (currentPage - 1) * itemsPerPage + 1;
  const endRecord = Math.min(currentPage * itemsPerPage, totalRecords);

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

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Search - Takes more space */}
          <div className="lg:col-span-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search Students
            </label>
            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, roll number, or card ID"
                className="flex-1 min-w-0 px-3 py-2 border border-gray-300 rounded-md 
                focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 whitespace-nowrap text-sm"
              >
                Search
              </button>
            </form>
          </div>

          {/* Class Filter */}
          <div className="lg:col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Class
            </label>
            <select
              value={standardFilter}
              onChange={(e) => {
                setStandardFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="">All Classes</option>
              <option value="1">Class 1</option>
              <option value="2">Class 2</option>
              <option value="3">Class 3</option>
              <option value="4">Class 4</option>
              <option value="5">Class 5</option>
              <option value="6">Class 6</option>
              <option value="7">Class 7</option>
              <option value="8">Class 8</option>
              <option value="9">Class 9</option>
              <option value="10">Class 10</option>
              <option value="11">Class 11</option>
              <option value="12">Class 12</option>
            </select>
          </div>

          {/* Items Per Page */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Items per page
            </label>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>

          {/* Clear Filters - Compact Button */}
          <div className="lg:col-span-2 flex items-end">
            <button
              onClick={() => {
                setSearchTerm('');
                setStandardFilter('');
                setCurrentPage(1);
                setSortBy('createdAt');
                setSortOrder('DESC');
              }}
              className="w-full px-3 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 text-sm whitespace-nowrap"
            >
              Clear Filters
            </button>
          </div>
        </div>
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
      ) : students.length === 0 ? (
        // No data state
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="text-center py-16 px-4">
            <div className="mx-auto w-24 h-24 mb-6">
              <svg 
                className="w-full h-full text-gray-300" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="1.5" 
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-5.197a5.5 5.5 0 00-11 0 5.5 5.5 0 0011 0z" 
                />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-3">
              No Student Data Available
            </h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              {searchTerm || standardFilter ? 
                "No students found matching your search criteria. Try different filters." : 
                "It looks like you haven't added any students yet. Start by adding your first student to begin managing their results."}
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center">
                      Student Info
                      {sortBy === 'name' && (
                        <span className="ml-1">
                          {sortOrder === 'ASC' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('createdAt')}
                  >
                    <div className="flex items-center">
                      Created
                      {sortBy === 'createdAt' && (
                        <span className="ml-1">
                          {sortOrder === 'ASC' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {students.map((student) => (
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
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {new Date(student.createdAt).toLocaleDateString()}
                        </div>
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
                        <td colSpan="4" className="px-6 py-4 bg-gray-50">
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
                                  {new Date(student.createdAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </p>
                              </div>
                              <div>
                                <span className="text-sm font-medium text-gray-500">Updated At:</span>
                                <p className="text-sm">
                                  {student.updatedAt && new Date(student.updatedAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
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
          <div className="flex flex-col md:flex-row items-center justify-between mt-6 bg-white rounded-lg shadow p-4">
            <div className="mb-4 md:mb-0">
              <div className="text-sm text-gray-700">
                Showing <span className="font-semibold">{startRecord}</span> to{' '}
                <span className="font-semibold">{endRecord}</span> of{' '}
                <span className="font-semibold">{totalRecords}</span> students
                <span className="ml-2 text-gray-500">
                  (Page {currentPage} of {totalPages})
                </span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">Go to page:</span>
                <input
                  type="number"
                  min="1"
                  max={totalPages}
                  value={currentPage}
                  onChange={(e) => {
                    const page = Math.max(1, Math.min(Number(e.target.value), totalPages));
                    setCurrentPage(page);
                  }}
                  className="w-16 px-2 py-1 border border-gray-300 rounded text-center"
                />
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded ${
                    currentPage === 1
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Previous
                </button>
                
                <div className="flex space-x-1">
                  {/* Show first page */}
                  {currentPage > 2 && (
                    <button
                      onClick={() => setCurrentPage(1)}
                      className={`px-3 py-2 rounded ${
                        currentPage === 1
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      1
                    </button>
                  )}
                  
                  {/* Show ellipsis if needed */}
                  {currentPage > 3 && (
                    <span className="px-3 py-2">...</span>
                  )}
                  
                  {/* Show pages around current page */}
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    if (pageNum < 1 || pageNum > totalPages) return null;
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-3 py-2 rounded ${
                          currentPage === pageNum
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  
                  {/* Show ellipsis if needed */}
                  {currentPage < totalPages - 2 && totalPages > 5 && (
                    <span className="px-3 py-2">...</span>
                  )}
                  
                  {/* Show last page */}
                  {currentPage < totalPages - 1 && totalPages > 1 && (
                    <button
                      onClick={() => setCurrentPage(totalPages)}
                      className={`px-3 py-2 rounded ${
                        currentPage === totalPages
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {totalPages}
                    </button>
                  )}
                </div>
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded ${
                    currentPage === totalPages
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default StudentList;