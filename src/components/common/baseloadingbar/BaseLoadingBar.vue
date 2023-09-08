<template>
    <v-layout :class="$style['base-loading-bar']">
        <v-progress-circular :size="80" :indeterminate="props.isLoading || false" :class="$style['base-loading-bar-progress']">Loading...</v-progress-circular>
    </v-layout>
</template>

<script lang="ts" setup>
import { PropType } from "vue/dist/vue";

const props = defineProps({
    isLoading : {
        type : Boolean as PropType<boolean>,
        required: true
    },
});
</script>


<style lang="scss" module>
@import 'BaseLoadingBar';
</style>