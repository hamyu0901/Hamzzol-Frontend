<template>
    <div :class="$style['planner-view']">
        <v-layout :class="$style['planner-view__header-layout']">
            <v-btn @click="prevMonth" icon="mdi-chevron-left" variant="text" ></v-btn>
            <span :class="$style['planner-view__header-layout-year']">{{ year }}년 {{ month + 1 }}월</span>
            <v-btn @click="nextMonth" icon="mdi-chevron-right" variant="text" ></v-btn>
        </v-layout>
        <v-layout :class="$style['planner-view__days-layout']">
            <div v-for="day in daysOfWeek" :key="day" :class="$style['planner-view__days-layout-header']" :style="dayStyle(day)">{{ day }}</div>
        </v-layout>
        <v-layout :class="$style['planner-view__days-layout']" style="height: 100%;">
            <div v-for="blankDay in blankDayOfMonth" :key="blankDay" :class="$style['planner-view__days-layout-day']"></div>
            <div v-for="(date, index) in daysInMonth"
                 :key="date"
                 :class="$style['planner-view__days-layout-day']"
                 @mouseenter="showButton(index, 'enter')"
                 @mouseleave="showButton(index, 'leave')"
            >
                <v-layout style="display: flex; flex-direction: column;">
                    <v-layout style="display: flex; justify-content: right; align-items: center">
                        <v-tooltip text="일정 추가" v-if="showAddPlanButton[index]" location="start">
                            <template v-slot:activator="{ props }">
                                <v-btn v-bind="props" icon="mdi-plus-circle-outline" variant="text" height="35" width="35" color="#AFA2FF" @click="clickPlannerBtnHandler(date, 'insert')"></v-btn>
                            </template>
                        </v-tooltip>
                        <div :class="$style['planner-view__days-layout-day-text']">
                            <v-btn
                                :style="isToday(date) ? 'background: #684AFF; color: white' : dayStyle(daysOfWeek[dayCalculate(blankDayOfMonth, index)])"
                                :icon="`mdi-numeric-${date}`"
                                :border="isToday(date)"
                                height="35"
                                variant="text"
                                width="35"
                                style="pointer-events: none; cursor: not-allowed;"
                            >{{date}}
                            </v-btn>
                        </div>
                    </v-layout>
                    <v-layout
                        style="display: flex; flex-direction: column;"
                        v-for="(item, pIndex) in plannerItems"
                        :key="pIndex"
                    >
                        <div
                            v-if="subDateRange(date, item)"
                            :style="`background-color: ${item.color}`"
                        >
                            <v-layout :class="$style['planner-view__days-layout-list']">
                                <div :style="`min-height: 60px; ${item.date_range[0].slice(-2) !== setDate(date) && 'padding: 5px'}`">
                                    <v-checkbox
                                        v-if="item.date_range[0].slice(-2) === setDate(date)"
                                        :class="$style['planner-view__days-layout-list-checkbox']"
                                        @click="clickCheckBtnHandler(item)"
                                        :model-value=" (item as { check_list: boolean })?.check_list">
                                    </v-checkbox>
                                </div>
                                <v-btn
                                    :class="[$style['planner-view__days-layout-list-btn'], ((item as { check_list: boolean })?.check_list ? $style['decoration'] : '')]"
                                    @click="clickPlannerBtnHandler(item, 'update')"
                                >
                                    {{ (item as { title: string })?.title }}
                                </v-btn>
                            </v-layout>
                        </div>
                        <div
                            v-if="!subDateRange(date,item) && compareDate(date, item)"
                            :style="`background-color: ${item.color}`"
                        >
                            <v-layout :class="$style['planner-view__days-layout-list']">
                                <div style="min-height: 60px; padding: 5px">
                                    <v-checkbox
                                        :class="$style['planner-view__days-layout-list-checkbox']"
                                        @click="clickCheckBtnHandler(item)"
                                        :model-value=" (item as { check_list: boolean })?.check_list">
                                    </v-checkbox>
                                </div>
                                <v-btn
                                    :class="[$style['planner-view__days-layout-list-btn'], ((item as { check_list: boolean })?.check_list ? $style['decoration'] : '')]"
                                    @click="clickPlannerBtnHandler(item, 'update')"
                                >
                                    {{ (item as { title: string })?.title }}
                                </v-btn>
                            </v-layout>
                        </div>
                    </v-layout>
                </v-layout>
            </div>
        </v-layout>
        <base-modal :title="modalTitle" :is-open="isPlannerModalOpen" @onCloseModal="isPlannerModalOpen=false" :height="550">
            <planner-detail-info
                :items="selectedPlannerItems"
                :date="selectedDate"
                :update-type="updateType"
                @updatePlannerItem="updatePlannerItemHandler"
            >
            </planner-detail-info>
        </base-modal>
    </div>
</template>

<script lang="ts" setup>
import { computed, ref, onMounted } from "vue";
import BaseModal from "@/components/common/basemodal/BaseModal.vue";
import { getTodoListAPI, patchTodoListAPI } from "@/api/planner/plannerAPI";
import { useStore } from "@/store";
import PlannerDetailInfo from "@/components/planner/planner-detail-info/PlannerDetailInfo.vue";
import { IPlannerListItemType } from "@/interface/planner/planner";

const store = useStore();

const userId = ref<null | string>(store.getUserInfo.id);

const currentDate = ref<any>(new Date());

const isPlannerModalOpen = ref<boolean>(false);

const modalTitle = ref<string>('');

const showAddPlanButton = ref<boolean[]>([]);

const selectedPlannerItems = ref<IPlannerListItemType[]>([]);

const selectedDate = ref<string>('');

const plannerItems = ref<any[]>([]);

const updateType = ref<string>('');

onMounted (() => {
    getPlannerList();
    initButtonItems();
});

const dayStyle = computed(() => {
    return (day: string) => {
        return `color: ${ day === '토' || day === '일' ? 'red' : '#684AFF' }`
    }
});

const dayCalculate = computed(() => {
    return (blankDayOfMonth: number, index: number) => {
        const day = (blankDayOfMonth-6 + index - 1) % 7;
        return day === -1 ? 0 : day
    }
});

const year = computed(() => {
    return currentDate.value.getFullYear();
});

const month = computed(() => {
    return currentDate.value.getMonth();
});

const daysOfWeek = computed(() => {
    return ['일', '월', '화', '수', '목', '금', '토'];
});

const isToday = computed(() => {
    return (date: any) => new Date().getFullYear() === year.value && new Date().getMonth() === month.value && date === new Date().getDate();
});

const blankDayOfMonth = computed(() => {
    return new Date(year.value, month.value, 1).getDay();
});

const daysInMonth = computed(() => {
    const lastDay = new Date(year.value, month.value + 1, 0).getDate();
    return Array.from({ length: lastDay }, (_, i) => i + 1);
});

const compareDate = computed(() => {
    return (date: number, item: IPlannerListItemType) => {
        return `${year.value}-${month.value + 1}-${setDate.value(date)}` === item.date
    }
});

const setDate = computed(() => {

    return (date: number) => {
        if(String(date).length === 1){
            return `0${date}`
        }else {
            return String(date)
        }
    }
});

const subDateRange = computed(() => {
    return (date: number, item: IPlannerListItemType) => {
        let day = ''
        if(String(date).length === 1){
            day = `0${date}`
        }else{
            day = String(date)
        }
        const targetDate = `${year.value}-${month.value+1}-${day}`;

        return item.date_range.some((dateValue: string) => dateValue === targetDate);
    }
});

const clickCheckBtnHandler = async (item: IPlannerListItemType) => {
    item.check_list = !item.check_list
    await patchTodoListAPI({
        listId: item.list_id,
        userId: item.user_id,
        date: item.date,
        title: item.title,
        contents: item.contents,
        update_time: item.update_time,
        check_list: item.check_list,
        date_range: item.date_range
    })
};

const prevMonth = () => {
    currentDate.value = new Date(year.value, month.value - 1, 1);
    getPlannerList();
};

const nextMonth = () => {
    currentDate.value = new Date(year.value, month.value + 1, 1);
    getPlannerList();
};

const getPlannerList = async () => {
    const plannerListResult = await getTodoListAPI({
        userId: userId.value !== null ? userId.value : '',
        year: `${currentDate.value.getFullYear()}`,
        month: `${currentDate.value.getMonth()+1}`
    });

    plannerItems.value = plannerListResult.data.map((item: IPlannerListItemType) => {
        const color = item.color ? item.color : '#CCAEF4'
        return {
            ...item,
            color
        };
    });
};

const clickPlannerBtnHandler = async (item: any, type: string) => {
    selectedPlannerItems.value = [];
    isPlannerModalOpen.value = true;
    updateType.value = type;
    if(type === 'insert') {
        modalTitle.value = '일정 추가'
        selectedDate.value = String(item).length === 1 ? `${year.value}-${month.value+1}-0${item}` : `${year.value}-${month.value+1}-${item}`;
    }else {
        modalTitle.value = '일정 보기'
        selectedDate.value = item.date;
        selectedPlannerItems.value.push(item)
    }
};

const initButtonItems = () => {
    const lastDay = new Date(year.value, month.value + 1, 0).getDate();
    if (!showAddPlanButton.value.length) {
        showAddPlanButton.value = Array.from({ length: lastDay }, () => false);
    }
};

const showButton = (index: number, mouseType: string) => {
    showAddPlanButton.value[index] = mouseType === 'enter';
};

const updatePlannerItemHandler = () => {
    isPlannerModalOpen.value = false;
    getPlannerList();
};
</script>

<style lang="scss" module>
@import 'PlannerView';
</style>