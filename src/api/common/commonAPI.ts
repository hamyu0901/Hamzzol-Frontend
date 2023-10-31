import { axios } from '@/main';

const url = {
    getWeatherAPIURL: 'common/weather/api',
}

const getWeatherAPI = async(): Promise<any> => {
    return await axios.get(url.getWeatherAPIURL);
};

export { getWeatherAPI }