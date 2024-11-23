<template class="body">
    <div class="background">
        <img src="../../public/vote-item-img/head.png" alt="">
        <header>
            <h2>笔尖笃志 流墨生辉</h2>
            <h2>兰州大学“好作业、好笔记”展评活动</h2>
            <p>每人最多可投 {{ votesNum }} 票</p>
            <div v-if="hasVoted">
                <span>您已投票：</span>
                <button @click="router.push('/theback/24poll/results')" style="color: red;">查看结果</button>
            </div>
            <input type="text" v-model="searchKeyword" placeholder="搜索名称...">
        </header>
        <main>
            <template v-for="(item,index) in filteredVoteItems" :key="item.id">
                <div class="vote-item" :id="'vote-item-' + item.id">
                    <div class="item-header">
                        <h3>{{ index + 1 }}  {{ item.name }}</h3>
                        <input type="checkbox" :value="{ id: item.id, name: item.name }" v-model="selectedItems" 
                        @change="checkVote(item.id)" class="input">
                    </div>
                    <img :src="item.image" alt="" @click="showImage(item.image)">
                    <!-- <button @click="viewDetails(item.id)" class="button">查看详情</button> -->
                </div>
            </template>
        </main>
        <footer>
            <div>
                <h3>剩余{{ votesNum - selectedItems.length }}票</h3>
            </div>
            <button @click="submit" >提交</button>
        </footer>

        <!-- 遮罩层和放大图片的容器 -->
        <div v-if="showModal" class="modal-overlay" @click="hideImage">
            <img :src="selectedImage" alt="放大图片" class="enlarged-image">
        </div>
    </div>
</template>

<script setup>
import axios from 'axios'
import { ref, onBeforeMount, watch } from 'vue'
import { useRouter } from 'vue-router';

const router = useRouter();
// const voteItems = ref([])
const voteItems = ref([
    // {id: 1, name: '选项1', image: 'https://img.picui.cn/free/2024/11/17/6739f600a10c9.png'},
    // {id: 2, name: '选项2', image: 'https://img.picui.cn/free/2024/11/17/6739f600a10c9.png'},
    // {id: 3, name: '选项3', image: 'https://img.picui.cn/free/2024/11/17/6739f600a10c9.png'},
    // {id: 4, name: '选项4', image: 'https://img.picui.cn/free/2024/11/17/6739f600a10c9.png'},
    // {id: 5, name: '选项5', image: 'https://img.picui.cn/free/2024/11/17/6739f600a10c9.png'},
    // {id: 6, name: '选项6', image: 'https://img.picui.cn/free/2024/11/17/6739f600a10c9.png'},
    // {id: 7, name: '选项7', image: 'https://img.picui.cn/free/2024/11/17/6739f600a10c9.png'},
    // {id: 8, name: '选项8', image: 'https://img.picui.cn/free/2024/11/17/6739f600a10c9.png'},
])
const selectedItems = ref([])
const votesNum = ref(10)
const hasVoted = ref(false)

// 控制遮罩层的显示和隐藏
const showModal = ref(false)
const selectedImage = ref('')
const searchKeyword = ref(''); // 搜索关键词
const filteredVoteItems = ref([]);

onBeforeMount(async () => {
    let response = await axios.get('/theback/24poll/api/get-vote-items')
    // console.log(response.data)
    console.log(response.data)
    voteItems.value = response.data
    filteredVoteItems.value = voteItems.value;
    // console.log(voteItems.value)
    console.log(voteItems.value)
    console.log(filteredVoteItems.value)
    console.log(filteredVoteItems.value.image)
    response = await axios.post('/theback/24poll/api/does-have-voted', {
        md5Fingerprint: window.md5Fingerprint
    })
    hasVoted.value = response.data.hasVoted
})
watch(searchKeyword, (newKeyword) => {
    if (newKeyword === '') {
        filteredVoteItems.value = voteItems.value; // 如果搜索框为空，显示所有投票项
    } else {
        const filteredItems = voteItems.value.filter(item =>
            item.name.toLowerCase().includes(newKeyword.toLowerCase()) // 模糊搜索
        );
        filteredVoteItems.value = filteredItems; // 否则，显示过滤后的投票项
    }
});
function filterVoteItems(keyword) {
    const filteredItems = voteItems.value.filter(item => item.name.includes(keyword));
    voteItems.value = filteredItems; // 更新显示的投票项
}

function checkVote(id) {
    const selectedCount = Object.values(selectedItems.value).filter(Boolean).length
    if (selectedCount > votesNum.value) {
        alert(`每人最多只能投${votesNum.value}票！`)
        // 取消最后一个选中的项
        selectedItems.value[id] = false
    }
}

async function submit() {
    // console.log(selectedItems.value)
    if ((selectedItems.value).length > votesNum.value) {
        alert(`每人最多只能投${votesNum.value}票！`);
        return; // 如果超过票数限制，则不执行提交操作
    }
    const { data } = await axios.post('/theback/24poll/api/submit-vote-result', {
        'md5Fingerprint': window.md5Fingerprint,
        selectedItems: selectedItems.value
    })
    if (data.success) {
        alert('投票成功！')
        router.push('/theback/24poll/results')
    }
    else {
        alert(`投票失败！ error: ${data.error}`)
    }
}

function showImage(imageUrl) {
    selectedImage.value = imageUrl
    showModal.value = true
}

function hideImage() {
    showModal.value = false
}
function viewDetails(id) {
    console.log('查看详情的ID:', id);
}
</script>

<style scoped>
header {
    text-align: center;
    background-image: linear-gradient(to top, #accbee 0%, #e7f0fd 100%);
    /* 浅灰色背景 */
    border-bottom: 1px solid #b0c4de;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    padding: 20px;
}
img {
    width: 100%; /* 设置图片宽度为100%，占满容器宽度 */
    height: auto; /* 高度自动，以保持图片的宽高比 */
    object-fit: cover; /* 如果图片的宽高比与容器不同，图片会被裁剪以覆盖整个容器 */
}
@media (max-width: 768px) {
    img {
        object-fit: contain; /* 包含模式，图片不会被裁剪，可能会留有空白 */
    }
}

main {
    /* border: 1px solid #ddd; */
    padding: 10%;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    grid-gap: 20px;
    margin-top: 5px;
}

.background {
    background-image: url('../../public/vote-item-img/background.png');
    /* 替换为您的图片路径 */
    background-size: cover;
    /* 覆盖整个页面 */
    background-position: center;
    /* 居中显示 */
    background-repeat: no-repeat;
    /* 不重复 */
    background-attachment: fixed;
    /* 固定背景，使得内容滚动时背景不动 */
    height: 100%;
    /* 设置高度为100%  */
    width: 100%;
    top: 0;
    left: 0;
    z-index: -1;
    /* 设置z-index为-1，确保背景在所有内容下方 */
}

.vote-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    border: 1px solid #e0e0e0;
    border-radius: 10px;
    background-color: #ffffff;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    padding: 20px;
    transition: transform 0.3s ease-in-out;
}

.vote-item:hover {
    transform: translateY(-5px);
}

.item-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
}

.item-header h3 {
    margin: 0;
    font-size: 1.5em;
    color: #333;
}

.button {
    padding: 8px 15px;
    background-color: #1ea0fa;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.button:hover {
    background-color: #0d8cd2;
}

.vote-item img {
    height: 200px;
    /* 增加图片高度 */
    width: 200px;
    /* 增加图片宽度 */
    object-fit: cover;
    margin-bottom: 10px;
}

.input[type="checkbox"] {
    width: 24px;
    height: 24px;
}

footer {
    background-image: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    border-top: 1px solid #b0c4de;
    /* 边框颜色 */
    position: fixed;
    display: flex;
    width: 100%;
    height: 60px;
    bottom: 0;
    left: 0;
    justify-content: center;
    align-items: center;
    box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.2);
}

footer button {
    padding: 10px 20px;
    background-color: #1ea0fa;
    color: white;
    border: none;
    border-radius: 7px;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    margin-left: 10px;
}

footer button:hover {
    background-color: #0d8cd2;
}

/* 遮罩层样式 */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.enlarged-image {
    max-width: 90%;
    max-height: 90%;
    border: 3px solid #fff;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
    object-fit: contain;
}
</style>