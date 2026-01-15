import api from './api';
import { Analytics, User, CreateUserRequest } from '../types';

interface UserProfile {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    status: string;
    createdAt: string;
  };
  enrollments: {
    id: string;
    courseId: string;
    courseTitle: string;
    role: string;
    enrolledAt: string;
  }[];
}

export const AdminService = {
  getAnalytics: async (): Promise<Analytics> => {
    const response = await api.get<Analytics>('/api/admin/analytics');
    return response.data;
  },

  assignInstructor: async (instructorId: string, courseId: string): Promise<void> => {
    await api.post('/admin/courses/assign', {
      instructorId,
      courseId
    });
  },

  createUser: async (data: CreateUserRequest): Promise<User> => {
    const response = await api.post<User>('/api/admin/users', data);
    return response.data;
  },

  getAllUsers: async (search?: string, courseId?: string, role?: string): Promise<User[]> => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (courseId) params.append('courseId', courseId);
    if (role) params.append('role', role);
    
    const response = await api.get<User[]>(`/api/admin/users?${params.toString()}`);
    return response.data;
  },

  updateUserRole: async (userId: string, role: string): Promise<User> => {
    const response = await api.patch<User>(`/api/admin/users/${userId}/role`, { role });
    return response.data;
  },

  updateUserStatus: async (userId: string, status: string): Promise<User> => {
    const response = await api.patch<User>(`/api/admin/users/${userId}/status`, { status });
    return response.data;
  },

  deleteUser: async (userId: string): Promise<void> => {
    await api.delete(`/api/admin/users/${userId}`);
  },
  
  suspendUser: async (userId: string): Promise<void> => {
    await api.post(`/api/admin/users/${userId}/suspend`);
  },
  
  unsuspendUser: async (userId: string): Promise<void> => {
    await api.post(`/api/admin/users/${userId}/unsuspend`);
  },
  
  resetPassword: async (userId: string): Promise<{ message: string }> => {
    const response = await api.post<{ message: string }>(`/admin/users/${userId}/reset-password`);
    return response.data;
  },

  getUserProfile: async (userId: string): Promise<UserProfile> => {
    const response = await api.get(`/api/admin/users/${userId}/profile`);
    return response.data;
  },

  removeEnrollment: async (enrollmentId: string) => {
    const response = await api.delete(`/enroll/admin/${enrollmentId}`);
    return response.data;
  }
};

export default AdminService;