<script setup>
import { ref, onMounted } from 'vue'
import instance from './api'
import checkFiveInARow from './util'
const line = ['z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o']
const ziList = ref([])
const message = ref('')
const isEnd = ref(false)
const loading = ref(false)
// 下棋
const xia = (e) => {
  if (loading.value || isEnd.value) return
  let x =  Math.round((e.offsetX - 24) / 29.3)
  let y =  Math.round((e.offsetY - 24) / 29.3)
  if (x <= 0) { x = 0 }
  if (x >= 14) { x = 14 }
  if (y <= 0) { y = 0 }
  if (y >= 14) { y = 14 }
  luozi(x, y, 'white')
  getNext()
}
// 落子
const luozi = (x, y, color) => {
  ziList.value.push({ x, y, color })

}

// 远程获取落子
const getNext = async () => {
  const stepsString = ziList.value.map(item => {
    return `${line[item.x + 1]}${item.y + 1}`
  }).join('_')
  loading.value = true
  const res = await instance.get('https://www.bytedance.ai/next_step', {
    params: { stepsString }
  })
  loading.value = false
  if (res.x) {
    ziList.value.push({ x: res.x, y: res.y, color: 'black' })
    if (checkFiveInARow(ziList.value)) {
      message.value = '已结束'
      isEnd.value = true
    }
    
  } else {
    message.value = '网络错误'
    isEnd.value = true
  }
}

const back = () => {
  if (loading.value) return
  if (ziList.value.length > 2) {
    ziList.value.pop()
    ziList.value.pop()
  }
  if (isEnd.value) {
    isEnd.value = false
    message.value = ''
  }
}

const restart = () => {
  if (loading.value) return
  ziList.value = [{ x: 7, y: 7, color: 'black' }]
  isEnd.value = false
  message.value = ''
}

onMounted(() => {
  ziList.value.push({ x: 7, y: 7, color: 'black' })
})
</script>

<template>
  <div class="page">
    <img src="./assets/board.png" @click="xia" class="board" />
    <div v-for="item in ziList" :class="`zi ${item.color}`" :style="`top: ${item.y * 29.3 + 13}px; left: ${item.x * 29.3 + 13}px`" :key="item"/>
    <div class="message">{{ message }}</div>
    <button class="restart" @click="back">悔棋</button>
    <button class="restart" @click="restart">重新开始</button>
  </div>
</template>

<style scoped lang='scss'>
.page{
  position: relative;
}
.board{
  padding: 20px 0 0 20px;
  width: 417px;
  height: 416px;
}
.zi{
  width: 18px;
  height: 18px;
  border: 1px solid #666;
  border-radius: 9px;
  position: absolute;
  top: 3px;
  left: 3px;
  &.black{
    background-color: #333;
  }
  &.white{
    background-color: #fff;
  }
}
.message{
  margin: 10px 0;
  font-size: 16px;
  font-weight: bold;
  width: 457px;
  text-align: center;
  height: 21px;
  line-height: 21px;
}
.restart{
  margin-left: 100px;
  border: 1px solid #409eff;
  background-color: #409eff;
  color: #FFF;
  padding: 8px 20px;
  font-size: 14px;
  border-radius: 4px;
  cursor: pointer;
}
</style>
