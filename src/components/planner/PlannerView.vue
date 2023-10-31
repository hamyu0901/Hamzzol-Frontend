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
                                <v-btn  v-bind="props" icon="mdi-plus-circle-outline" variant="text" height="35" width="35" color="#AFA2FF" @click="clickPlannerBtnHandler(date, 'insert')"></v-btn>
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
                                style=" pointer-events: none; cursor: not-allowed;"
                            >
                                {{date}}
                            </v-btn>
                        </div>
                    </v-layout>
                    <v-layout v-if="isPlannerList(index)" style="display: flex; flex-direction: column; width: 100%">
                        <v-layout v-for="(item, iIndex) in isPlannerList(index)" :key="iIndex" :class="$style['planner-view__days-layout-list']">
                            <div><v-checkbox :class="$style['planner-view__days-layout-list-checkbox']" @click="clickCheckBtnHandler(item)" :model-value=" (item as { check_list: boolean })?.check_list"></v-checkbox></div>
                            <v-btn :class="[$style['planner-view__days-layout-list-btn'], ((item as { check_list: boolean })?.check_list ? $style['decoration'] : '')]" @click="clickPlannerBtnHandler(item, 'update')">
                                {{ (item as { title: string })?.title }}
                            </v-btn>
                        </v-layout>
                    </v-layout>
                </v-layout>
            </div>
        </v-layout>
        <base-modal :title="modalTitle" :is-open="isPlannerModalOpen" @onCloseModal="isPlannerModalOpen=false"></base-modal>
    </div>
</template>

<script lang="ts" setup>
import { computed, ref, onMounted } from "vue";
import BaseModal from "@/components/common/basemodal/BaseModal.vue";
import { getTodoListAPI, patchTodoListAPI } from "@/api/planner/plannerAPI";
import { useStore } from "@/store";

interface IPlannerListItemType {
    list_id: number,
    user_id: string,
    date: string,
    title: string,
    contents: string,
    update_time: string,
    check_list: boolean
}

const store = useStore();

const userId = ref<null | string>(store.getUserInfo.id);

const currentDate = ref<any>(new Date());

const isPlannerModalOpen = ref<boolean>(false);

const modalTitle = ref<string>('');

const showAddPlanButton = ref<boolean[]>([]);

const plannerListItems = ref<(IPlannerListItemType | null)[]>([]);

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

const isPlannerList = computed(() => {
    return (index: number) => {
        return plannerListItems.value[index]
    }
});

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

    let array: any[] = [];

    if (daysInMonth.value && daysInMonth.value.length) {
        array = Array.from({ length: daysInMonth.value.length }, () => null);
    } else {
        array = [];
    }

    plannerListItems.value = [];

    plannerListResult.data.forEach((item : IPlannerListItemType) => {
        const dateParts = item.date.split('-');
        const day = parseInt(dateParts[2]);

        if (array[day - 1] === null) {
            array[day - 1] = [];
        }

        array[day - 1].push(item);
    });

    plannerListItems.value.push(...array);
};

const clickPlannerBtnHandler = async (item: any, type: string) => {
    isPlannerModalOpen.value = true;
    if(type === 'insert') {
        modalTitle.value = '일정 추가'
    }else {
        modalTitle.value = '일정 보기'
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

const clickCheckBtnHandler = async (item: IPlannerListItemType) => {
    item.check_list = !item.check_list
    await patchTodoListAPI({
        listId: item.list_id,
        userId: item.user_id,
        date: item.date,
        title: item.title,
        contents: item.contents,
        update_time: item.update_time,
        check_list: item.check_list
    })
};
</script>

<style lang="scss" module>
@import 'PlannerView';
</style>