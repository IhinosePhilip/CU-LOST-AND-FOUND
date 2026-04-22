// API base URL — uses env variable in production, proxies locally in dev
const API_URL = process.env.REACT_APP_API_URL || '';
export default API_URL;
