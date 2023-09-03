import axios from 'axios';
import { BASE_URL } from './constants';

// axios public
const axiosPublic = axios.create({
  baseURL: BASE_URL,
});

// axios private
const axiosPrivate = axios.create({
  baseURL: BASE_URL,
});

export { axiosPublic, axiosPrivate };
