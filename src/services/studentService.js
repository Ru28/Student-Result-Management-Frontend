import axios from 'axios';
import { API_BASE_URL } from '../../baseurl';


export const getAllStudents = async (params = {}) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/student/getStudents`, {
      params: {
        page: params.page || 1,
        limit: params.limit || 10,
        search: params.search || '',
        standard: params.standard || '',
        sortBy: params.sortBy || 'createdAt',
        sortOrder: params.sortOrder || 'DESC'
      }
    });
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
    const response = await axios.put(`${API_BASE_URL}/student/updateStudentInfo?id=${studentData.id}`, studentData);
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