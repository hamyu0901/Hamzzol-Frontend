<template>
  <v-layout :class="$style['base-tab']" :style="`height: ${props.height}`">
      <div v-for="item in items" :key="item.id">
          <v-btn
              variant="text"
              :prepend-icon="item.icon"
              :class="$style['base-tab-item']"
              :style="`${item.selected && 'border-bottom: 2px solid #684AFF'}`"
              @click="clickTabItemHandler(item)">
              {{ item.title}}
          </v-btn>
      </div>
  </v-layout>
</template>

<script lang="ts" setup>
import { PropType } from "vue";
import { ITabsItemType } from "@/interface/common/common"

const props = defineProps({
    height : {
        type : String as PropType<string>,
        default: '80px'
    },
    items: {
        type: Array as PropType<ITabsItemType[]>,
        required: true
    }
});

const emit = defineEmits(['clickTabItem']);

const clickTabItemHandler = (item: ITabsItemType) => {
    emit('clickTabItem', item)
};
</script>

<style lang="scss" module>
@import "BaseTab";
</style>