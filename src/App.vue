<template>
    <sliderMain/>
</template>

<script>
import sliderMain from './components/sliderMain'



import elements from './components/element' //元素管理
import datasource from './components/datasource' //数据源管理


import effects from './components/effects' //特效组件
import forms from './components/form' //表单组件
import chartMix from './components/chartMix' //chartMix图表
import tables from './components/quicksheet' //静态表格
import report from './components/report' // 报表
import list from './components/list' //列表
import music from './components/music' //音乐
import videos from './components/video' //视频
import trigger from './components/trigger' //触发器
import date from './components/date' //计时器及日期相关组件
import number from './components/number' //数字动效
import formula from './components/formula' //公式
import esComponent from './components/esComponent' //特殊组件
import game from './components/game' //小游戏

export default {
  name: 'App',
  components: {
    sliderMain,
    elements,
    datasource,
    effects,
    forms,
    chartMix,
    tables,
    report,
    list,
    music,
    videos,
    trigger,
    date,
    number,
    formula,
    esComponent,
    game
  },
  data () {
    return {
      //
    }
  }
}
</script>
