<template>
    <v-card style="width: 100%" :class="$style['weather-forecast']">
        <div v-for="(weather, index) in weatherData" :key="index">
            <img />
        </div>
    </v-card>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { axios } from "@/main";
const weatherData = ref<any>([]);
// const sunsetArray = ref<number[]>([]);
// const sunriseArray = ref<number[]>([]);

onMounted(() => {
    getWeatherForecast();
});

const getWeatherForecast = async () => {
    try {
        const response = await axios.get(
            'https://api.openweathermap.org/data/2.5/forecast?q=Seoul&cnt=7&appid=71878480cdd4f838da85f3940b699b86&units=metric',
        );
        weatherData.value = response.data.list;
        const sunsetTimestamp = response.data.city.sunset;
        const sunsetFormatted = formatDate(sunsetTimestamp);

        const sunset = new Date(sunsetFormatted);

        const beforeSunset = [];
        const afterSunset = [];

        for (const day of response.data.list) {
            const date = new Date(day.dt_txt);

            if (date < sunset) {
                beforeSunset.push(day);
            }else {
                afterSunset.push(day)
            }
        }

    } catch (error) {
        console.error('Error fetching weather data', error);
    }
};

const formatDate = (time: number) => {
    const date = new Date(time * 1000);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

// const formatTime = (timestamp: number) => {
//     const date = new Date(timestamp * 1000);
//     return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
// };
</script>

<style lang="scss" module>
@import "WeatherForecast";
</style>