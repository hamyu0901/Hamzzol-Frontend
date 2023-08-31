<template>
    <v-card
        :class="$style['base-card']"
        :style="`'min-height: ${renderHeight};`"
        :width="renderWidth"
    >
        <v-card-title :class="$style['base-card-title']">{{ title }}</v-card-title>
        <v-card-text :class="$style['base-card-text-container']">
            <slot></slot>
        </v-card-text>
    </v-card>
</template>

<script lang="ts" setup>

import { computed } from "vue";

interface IBaseUserInfoCardType {
    width ?: number,
    height ?: number,
    title : string
}
const props = defineProps< IBaseUserInfoCardType >();

const renderWidth = computed(() => {
    return  props.width ? props.width : 500;
});

const renderHeight = computed(() => {
    return  props.height ? props.height : 500;
});
</script>

<style lang="scss" module>
@import 'BaseCard';
</style>