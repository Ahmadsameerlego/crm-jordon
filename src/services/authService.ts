import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://crm.be-kite.com/backend';

const authService = {
  async login(userType: 'admin' | 'employee', email: string, password: string) {
    try {
      const response = await axios.post(`${BASE_URL}/api/login`, {
        user_type: userType,
        email,
        password,
        lang: 'ar',
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async logout(token: string) {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/logout`,
        { lang: 'ar' },
        { headers: { Authorization: token } }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async showUser(userId: number, token: string) {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/show-user`,
        { user_id: userId, lang: 'ar' },
        { headers: { Authorization: token } }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async updatePassword(oldPassword: string, newPassword: string, token: string) {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/update-password`,
        { old_password: oldPassword, password: newPassword, lang: 'ar' },
        { headers: { Authorization: token } }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default authService;
