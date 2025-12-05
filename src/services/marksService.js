import axios from 'axios';
import { API_BASE_URL } from '../../baseurl';


export const getStudentMarksByStudentId = async (studentId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/mark/studentMarks/${studentId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const setStudentMarks = async (markData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/mark/setStudentMarks`, markData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const updateStudentMarks = async (id, markData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/mark/studentMarks/${id}`, markData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const deleteStudentMarks = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/mark/studentMarks/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};