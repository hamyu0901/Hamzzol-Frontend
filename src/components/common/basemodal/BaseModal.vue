<template>
    <v-dialog
        :class="$style['base-modal']"
        :model-value="isOpen"
        :persistent="true"
        :scrollable="true"
        :width="renderWidth"
        :height="renderHeight"
    >
        <v-card :class="$style['base-modal__contents']">
            <v-card-title :class="$style['base-modal__contents-card-title']">
                {{title}}
                <v-btn :flat="true" width="35" height="35" @click="emit('onCloseModal')" icon="mdi-close"></v-btn>
            </v-card-title>
            <v-card-text fill-heihgt>
                <slot></slot>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed } from 'vue'

interface IModalItemType {
    width ?: number,
    height ?: number,
    isOpen : boolean,
    title : string
}

const props = defineProps< IModalItemType >();

const emit = defineEmits(['onCloseModal']);

const renderWidth = computed(() => {
    return  props.width ? props.width : 1200;
});

const renderHeight = computed(() => {
    return  props.height ? props.height : 500;
});
</script>

<style lang="scss" module>
@import 'BaseModal.scss';
</style>