<template>
    <header>
        <h1>投票结果</h1>
    </header>
    <main>

        <p>获票排名如下：</p>
        <ul class="score">
            <li v-for="(item, index) in sortedVoteResults" :key="item.id" class="score-item">
                {{ item.name }} - {{ item.votes }} 票
            </li>
        </ul>
    </main>
</template>

<script setup>
import axios from 'axios'
import { ref, onMounted, nextTick, onBeforeMount } from 'vue'
import * as echarts from 'echarts/core';
import { useRouter } from 'vue-router';



const router = useRouter();

const voteResults = ref([])
const sortedVoteResults = ref([])

onBeforeMount(async () => {
    const response = await axios.post('/theback/24poll/api/does-have-voted', {
        md5Fingerprint: window.md5Fingerprint
    })
    if (!response.data.hasVoted) {
        alert('请先投票')
        router.push('/')
    }
})

onMounted(async () => {
    await nextTick()
    const { data } = await axios.get('/theback/24poll/api/get-vote-results')
    voteResults.value = data.voteResults

    sortedVoteResults.value = voteResults.value.sort((a, b) => b.votes - a.votes)

    
})
</script>

<style scoped>
header {
    text-align: center;
    /* 居中对齐 */
    font-size: 26px;
    /* 放大字体 */
    margin: 15px 0;
    /* 减少上下边距 */
}

.flex-container {
    display: flex;
    justify-content: left;
    align-items: left;
    margin-top: 20px;
}

.flex-item {
    flex: 1;
    margin: 0 10px;
    text-align: center;
}

.flex-item:first-child {
    margin-left: 0;
}

.flex-item:last-child {
    margin-right: 0;
}

.echarts {
    width: 20%;
    height: 250px;
    min-height: 100px;
    /* 设置最小高度 */
}

.score {
    background-color: #333;
    /* 深色背景 */
    padding: 20px;
    border-radius: 8px;
    /* 圆角边框 */
    width: 100%;
    /* 设置宽度为100% */
    margin-top: 20px;
}

.score-item {
    color: #fff;
    /* 文字颜色为白色 */
    border-bottom: 1px solid #444;
    /* 分隔线颜色 */
    padding: 15px;
    /* 增加内边距 */
    font-size: 18px;
    /* 放大字体 */
    cursor: default;
    /* 鼠标指针样式 */
}

.score-item:last-child {
    border-bottom: none;
    /* 最后一个项目没有底部分隔线 */
}

.score-item:hover {
    background-color: #444;
    /* 鼠标悬停时的背景颜色 */
}
</style>