import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import StudentList from './components/StudentList';
import StudentMarks from './components/StudentMarks';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<StudentList />} />
          <Route path="/student/:studentId/marks" element={<StudentMarks />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;