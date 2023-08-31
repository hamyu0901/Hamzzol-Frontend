<template>
    <v-text-field
        :class="$style['base-text-field']"
        :prepend-inner-icon="icon ? icon : ''"
        variant="outlined"
        :type="type ? type : 'text'"
        :label="label ? label : ''"
        :placeholder="placeHolder ? placeHolder : ''"
        :model-value="props.value"
        :disabled="disabled ? disabled : false"
        :error="error ? error : false"
        @update:modelValue="updateValue($event)"
    ></v-text-field>
</template>

<script lang="ts" setup>
import {defineEmits, PropType} from "vue";

const props = defineProps({
    value : {
        type : [String, null] as PropType<string | null>, // 선택된 존 정보
        required: true
    },
    label: {
        type: String as PropType<string>
    },
    icon: {
        type: String as PropType<string>
    },
    type: {
        type: String as PropType<string>
    },
    placeHolder: {
        type: String as PropType<string>
    },
    disabled: {
        type: Boolean as PropType<boolean>,
    },
    error: {
        type: Boolean as PropType<boolean>
    }
});

const emit = defineEmits(['updateValue']);

const updateValue = (value: string | null) => {
    emit('updateValue', value)
}
</script>

<style lang="scss" module>
@import "BaseTextField";
</style>