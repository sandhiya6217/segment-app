import axios from 'axios';

const BASE_URL = 'https://cors-anywhere.herokuapp.com/https://webhook.site';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const Segment = async (payload) => {
  try {
    const response = await api.post('/650b0fae-bfae-42c4-a6f5-e0f624b88f09', payload);
    console.log('Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error in Segment API:', error.response ? error.response.data : error.message);
    throw error;
  }
};
