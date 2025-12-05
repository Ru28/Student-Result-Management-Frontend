import React, { useState, useEffect } from 'react';

const StudentForm = ({ student, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    rollNumber: '',
    studentCardId: '',
    standard: '',
    email: '',
    phone: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (student) {
      setFormData({
        name: student.name || '',
        rollNumber: student.rollNumber || '',
        studentCardId: student.studentCardId || '',
        standard: student.standard || '',
        email: student.email || '',
        phone: student.phone || '',
      });
    }
  }, [student]);

  useEffect(() => {
    if (formData.standard && formData.rollNumber) {
      const letter = String.fromCharCode(64 + Number(formData.standard)); 
      const generatedId = `${letter}${formData.rollNumber}`;
      setFormData(prev => ({
        ...prev,
        studentCardId: generatedId,
      }));
    }
  }, [formData.standard, formData.rollNumber]);

  const validate = () => {
    let newErrors = {};

    // Name max 256 chars
    if (!formData.name || formData.name.length > 256) {
      newErrors.name = "Name must be less than 256 characters.";
    }

    // Email validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email address.";
    }

    // Phone validation (10 digit, starts with 6–9)
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = "Phone must be a valid 10-digit number starting with 6–9.";
    }

    // Standard limit 1–26
    const standardNumber = Number(formData.standard);
    if (!standardNumber || standardNumber < 1 || standardNumber > 26) {
      newErrors.standard = "Standard must be between 1 and 26.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return; 
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="relative p-5 w-full max-w-2xl rounded-md bg-white shadow-2xl shadow-gray-800/40">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {student ? 'Edit Student' : 'Add New Student'}
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                maxLength={256}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Roll Number *
              </label>
              <input
                type="number"
                name="rollNumber"
                value={formData.rollNumber}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Standard/Class *
              </label>
              <input
                type="number"
                name="standard"
                value={formData.standard}
                onChange={handleChange}
                required
                min={1}
                max={26}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.standard && <p className="text-red-500 text-xs mt-1">{errors.standard}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Student Card ID *
              </label>
              <input
                type="text"
                name="studentCardId"
                value={formData.studentCardId}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={(e) => {
                  // Allow only digits & max 10 characters
                  if (/^\d{0,10}$/.test(e.target.value)) handleChange(e);
                }}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {student ? 'Update Student' : 'Create Student'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentForm;