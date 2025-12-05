import axios from 'axios';
import { API_BASE_URL } from '../../baseurl';


export const getAllStudents = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/student/getStudents`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getStudentById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/student/getStudent/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const setStudentInfo = async (studentData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/student/setStudentInfo`, studentData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const updateStudentInfo = async (studentData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/student/updateStudentInfo`, studentData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const deleteStudentById = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/student/deleteStudentById/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};