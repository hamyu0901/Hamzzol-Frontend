<template>
  <v-layout :class="$style['planner-detail-info']">
      <v-layout style="display: flex; width: 100%; align-items: center">
          <v-layout style="display: flex; flex-direction: column;">
              <v-layout>
                  <div :style="`background-color:${inputColor}; padding: 10px; width: 90%`">
                      <v-text-field
                          :class="[$style['planner-detail-info-title'], isCheckList ? $style['decoration'] : '']"
                          variant="solo"
                          placeholder="제목 없음"
                          autofocus
                          hide-details
                          :model-value="title"
                          @update:modelValue="title = $event"
                          @click:append-inner="openColorPickerModal=!openColorPickerModal" :append-inner-icon="`${openColorPickerModal ? 'mdi-menu-up' : 'mdi-menu-down'}`"
                      ></v-text-field>
                  </div>
                  <div style="justify-content: center; align-items: center; display: flex; width: 10%" v-if="props.updateType === 'update'">
                      <v-btn v-bind="props" icon="mdi-delete" variant="text" height="35" width="35" color="#FF8383" @click="clickDeletePlan"></v-btn>
                  </div>

              </v-layout>
              <div style="text-align: right; background-color: white">
                  <v-btn v-if="openColorPickerModal" density="compact" icon @click="inputColor = '#FFADF2';">
                      <v-icon color="#684aff">mdi-refresh</v-icon>
                  </v-btn>
                  <v-color-picker
                       v-if="openColorPickerModal"
                       hide-inputs
                       canvas-height="100"
                       width="100%"
                       mode="hex"
                       @update:model-value="inputColor = $event"
                       :model-value="inputColor"
                       :class="$style['planner-detail-info-color-picker']"
                  >
                  </v-color-picker>
                  <v-layout v-if="openColorPickerModal" style="justify-content: right">
                      <v-btn :class="$style['planner-detail-info-btn']" prepend-icon="mdi-close" variant="flat" @click="openColorPickerModal=false">닫기</v-btn>
                      <v-btn :class="$style['planner-detail-info-btn']" prepend-icon="mdi-check" variant="flat" @click="clickSelectBtnHandler">선택</v-btn>
                  </v-layout>
              </div>
          </v-layout>
      </v-layout>
      <v-layout :class="$style['planner-detail-info__layout']">
          <v-icon style="color: darkgray;" class="mr-2">mdi-clock-outline</v-icon>
          <v-layout>
              <span :class="$style['planner-detail-info__layout-text-title']">Created</span>
              <span :class="$style['planner-detail-info__layout-text-contents']">{{ setCreatedTime }}</span>
          </v-layout>
      </v-layout>
      <v-layout :class="$style['planner-detail-info__layout']" style="height: 100%">
          <v-icon style="color: darkgray" class="mr-2">mdi-calendar-month</v-icon>
          <v-layout style="display: flex; align-items: center">
              <span :class="$style['planner-detail-info__layout-text-title']">Scheduled</span>
              <input type="date" :value="startDate" required class="mr-2" @input="inputDate('start', $event)">
              <div v-if="hasDateRange ? true : isRangeStatus" style="font-family: NanumBd, sans-serif">~
                  <input class="ml-2" type="date" :value="endDate" @input="inputDate('end', $event)">
              </div>
              <v-btn v-if="!isRangeStatus && !(hasDateRange)" v-bind="props" icon="mdi-plus-circle-outline" variant="text" height="35" width="35" color="#684AFF" @click="isRangeStatus = true"></v-btn>
              <v-btn v-if="isRangeStatus && !(hasDateRange)" v-bind="props" icon="mdi-plus-circle" variant="text" height="35" width="35" color="#684AFF" @click="isRangeStatus = false"></v-btn>
          </v-layout>
      </v-layout>
      <v-layout style="display: flex; flex-direction: column">
          <v-layout style="display: flex; padding-top: 10px">
              <v-icon style="color: darkgray" class="mr-2">mdi-checkbox-blank-badge-outline</v-icon>
              <span :class="$style['planner-detail-info__layout-text-title']">Comment</span>
          </v-layout>
          <v-textarea
              :class="$style['planner-detail-info-comment']"
              style="margin-top: 20px"
              variant="outlined"
              placeholder="내용 없음"
              rows="5"
              row-height="50"
              single-line
              color="deep-purple"
              base-color="#353C43D9"
              :model-value="comment"
              @update:modelValue="comment = $event"
          ></v-textarea>
      </v-layout>
      <div style="text-align: right">
          <v-btn style="font-family: NanumBd, sans-serif; background-color: #684AFF; color: #FFFFFF" prepend-icon="mdi-check" @click="clickSaveBtn">완료</v-btn>
      </div>
  </v-layout>
</template>

<script lang="ts" setup>
import { PropType } from "vue/dist/vue";
import { IPlannerListItemType } from "@/interface/planner/planner";
import { computed, onMounted, ref } from "vue";
import { isEmpty } from "lodash";
import { useStore } from "@/store";
import { deleteTodoListAPI, patchTodoListAPI, postTodoListAPI } from "@/api/planner/plannerAPI";

const props = defineProps({
    items: {
        type: Array as PropType<IPlannerListItemType[]>,
        required: true
    },
    date: {
        type: String as PropType<string>,
        required: true
    },
    updateType: {
        type: String as PropType<string>
    }
});

const emit = defineEmits(['updatePlannerItem']);

const store = useStore();

const userId = ref<null | string>(store.getUserInfo.id);

const title = ref<string>(props.items?.length !== 0 ? props.items[0].title : '');

const startDate = ref<string | null>(null);

const endDate = ref<string | null>(null);

const comment = ref<string | null>(!isEmpty(props.items) ? props.items[0].contents : null);

const isRangeStatus = ref<boolean>(false);

const openColorPickerModal = ref<boolean>(false);

const inputColor = ref<string>( !isEmpty(props.items) && props.items[0].color ? props.items[0].color : '#CCAEF4');

const isSelectBtn = ref<boolean>(false);

onMounted(() => {
    setScheduledDate();
});

const setCreatedTime = computed(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 1을 더하고, 두 자리로 만듭니다.
    const day = String(now.getDate()).padStart(2, '0'); // 일도 두 자리로 만듭니다.
    const hours = String(now.getHours()).padStart(2, '0'); // 시간을 두 자리로 만듭니다.
    const minutes = String(now.getMinutes()).padStart(2, '0'); // 분도 두 자리로 만듭니다.
    const seconds = String(now.getSeconds()).padStart(2, '0'); // 초도 두 자리로 만듭니다.

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
});

const isCheckList = computed(() => {
    return props.items.length > 0 && props.items[0].check_list
});

const hasDateRange = computed(() => {
    return props.items?.length && props.items[0].date_range.length !== 0
});

const setScheduledDate = () => {
    if(props.items?.length !== 0 && props.items[0].date_range.length !== 0){

        startDate.value = props.items[0].date_range[0]
        endDate.value = props.items[0].date_range[props.items[0].date_range.length-1]
    }else {
        startDate.value = props.date;
        endDate.value = null;
    }
};

const inputDate = (type: string, event: any) => {
    const selectedDate = new Date(event.target.value);
    if (type === 'start') {
        startDate.value = event.target.value !== '' ? event.target.value : null;
        if (endDate.value !== null) {
            const endDateDate = new Date(endDate.value);
            if (selectedDate > endDateDate) {
                startDate.value = null;
                window.alert('날짜 범위를 다시 선택해주세요')
            }
        }
    } else {
        endDate.value = event.target.value !== '' ? event.target.value : null;
        if (startDate.value !== null) {
            const startDateDate = new Date(startDate.value);
            if (selectedDate < startDateDate) {
                endDate.value = null;
                window.alert('날짜 범위를 다시 선택해주세요')
            }
        }
    }
};

const clickSelectBtnHandler = () => {
    isSelectBtn.value = !isSelectBtn.value
    openColorPickerModal.value = false;
};

const clickSaveBtn = async () => {
    const dateArray = [];

    if (startDate.value !== null && endDate.value !== null) {
        const startDateObj = new Date(startDate.value);
        const endDateObj = new Date(endDate.value);
        let currentDate = new Date(startDateObj);

        while (currentDate <= endDateObj) {
            dateArray.push(currentDate.toISOString().split('T')[0]);
            currentDate.setDate(currentDate.getDate() + 1);
        }
    }

    if(startDate.value !== null){
        dateArray.length === 0 && dateArray.push(startDate.value);

        const confirmationMessage = props.updateType === 'update' ? '수정하시겠습니까?' : '저장하시겠습니까?';

        if (window.confirm(confirmationMessage)) {
            const payload = {
                userId: userId.value,
                date: startDate.value,
                title: title.value,
                contents: comment.value || '',
                update_time: setCreatedTime.value,
                check_list: props.updateType === 'insert' ? false : props.items[0].check_list,
                date_range: dateArray,
                color: inputColor.value
            }

            if (props.updateType === 'update') {
                await patchTodoListAPI({
                    listId: props.items[0].list_id,
                    ...payload
                });

            } else {
                await postTodoListAPI(payload);
            }

            emit('updatePlannerItem');
        }

    }else {
        window.alert('날짜를 선택해주세요')
    }
};

const clickDeletePlan = async () => {
    if(window.confirm('일정을 삭제하시겠습니까?')){
        await deleteTodoListAPI(props.items[0].list_id || 0)
        emit('updatePlannerItem');
    }
};
</script>

<style lang="scss" module>
@import 'PlannerDetailInfo';
</style>