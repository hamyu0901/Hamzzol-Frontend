<template>
    <v-card style="width: 100%" :class="$style['weather-forecast']">
        <v-card-title style="color: black;" :class="$style['font-Eb']">Today {{ location }} Weather</v-card-title>
        <base-loading-bar v-if="isWeatherLoading" :isLoading="isWeatherLoading"></base-loading-bar>
        <v-card-text v-else style="flex-direction: row; display: flex; padding-top: 16px">
            <v-layout v-for="(weatherItem, index) in weatherData" :key="index" :class="$style['weather-forecast-container']" :style="index !== weatherData.length-1 && 'margin-right: 20px'">
                <v-layout :class="$style['weather-forecast-container__layout']">
                    <span :class="$style['font-Eb']">{{setHours(weatherItem)}}</span>
                    <div style="width: 100%; text-align: center" class="mt-2 mb-2">
                        <img :src="setWeatherSrc(weatherItem)" width="64" height="64" alt="weatherImg"/>
                    </div>
                    <v-layout :class="$style['font-H']" style="justify-content: center;">
                        <span style="font-size: 18px;">{{temperature(weatherItem)}}</span>
                        <span style="padding-left: 3px"> °C</span>
                    </v-layout>
                </v-layout>
            </v-layout>
        </v-card-text>
    </v-card>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";
import { axios } from "@/main";
import { getWeatherAPI } from "@/api/common/commonAPI";
import BaseLoadingBar from "@/components/common/baseloadingbar/BaseLoadingBar.vue";
const weatherData = ref<any>([]);
const sunset = ref<number>(0);
const location = ref<string>('');
const isWeatherLoading = ref<boolean>(false);

onMounted(() => {
    getWeatherForecast();
});

const temperature = computed(() => {
    return (weatherItem: any) => {
        return String(weatherItem.main['temp']).substring(0, 2);
    }
});

const getWeatherForecast = async () => {
    isWeatherLoading.value = true;
    try {
        const weatherApiKey = await getWeatherAPI();
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(async function  (position) {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                const weatherResult = await axios.get(
                    `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&cnt=7&appid=${weatherApiKey.data}`
                );
                weatherData.value = weatherResult.data.list;
                sunset.value = weatherResult.data.city.sunset;
                location.value = weatherResult.data.city.name;
                isWeatherLoading.value = false;
            }, function (error) {
                isWeatherLoading.value = false;
                window.alert('위치 정보를 가져올 수 없습니다.')
                console.error("위치 정보를 가져올 수 없습니다.", error);
            });
        } else {
            isWeatherLoading.value = false;
            window.alert('지원하지 않는 브라우저입니다.')
        }
    } catch (error) {
        isWeatherLoading.value = false;
        window.alert('Error fetching weather data')
        console.error('Error fetching weather data', error);
    }
};

const setHours = (weatherItem: any) => {
    return formatHours(weatherItem.dt_txt);
};

const setWeatherSrc = (weatherItem: any) => {
    const path = checkSunset(weatherItem);

    switch (weatherItem.weather[0].main) {
        case 'Thunderstorm':
            return require(`@/assets/img/common/weather/${path}/thunder.png`);
        case 'Drizzle':
        case 'Rain':
            return require(`@/assets/img/common/weather/${path}/rain.png`);
        case 'Snow':
            return require(`@/assets/img/common/weather/${path}/snow.png`);
        case 'Clear':
            return require(`@/assets/img/common/weather/${path}/clear.png`);
        case 'Clouds':
            return require(`@/assets/img/common/weather/${path}/clouds.png`);
        default:
            return require(`@/assets/img/common/weather/${path}/mist.png`);
    }
};

const checkSunset = (weatherItem: any) => {
    const sunsetFormatted = formatDate(sunset.value);
    const time = new Date(weatherItem.dt_txt);
    const sunsetTime = new Date(sunsetFormatted);
    return time < sunsetTime ? 'sunrise' : 'sunset';
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
};

const formatHours = (dateString: string) => {
    const date = new Date(dateString);
    const hours = date.getHours();

    let period = "오전";
    let formattedHours: number = hours;

    if (hours >= 12) {
        period = "오후";
        if (hours > 12) {
            formattedHours = hours - 12;
        }
    }
    // 시간을 두 자릿수로 포맷
    const formattedHoursString = String(formattedHours).padStart(2, "0");
    return `${period} ${formattedHoursString}시`;
};
</script>

<style lang="scss" module>
@import "WeatherForecast";
</style>