<template>
  <div>
    <el-row>
      <el-dropdown size="mini" split-button type="primary" @click="addPage">
        <i class="el-icon-circle-plus"></i> 添加
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>黄金糕</el-dropdown-item>
          <el-dropdown-item>狮子头</el-dropdown-item>
          <el-dropdown-item>螺蛳粉</el-dropdown-item>
          <el-dropdown-item>双皮奶</el-dropdown-item>
          <el-dropdown-item>蚵仔煎</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-button size="mini" round type="danger"><i class="el-icon-circle-plus-outline"></i> 模板</el-button>
    </el-row>
    <!-- :cur="curPageId" -->
    <div  @mousedown="pageAux" class="ms-left-page">
      <div class="ms-page" @mousedown="changePageOrder(item.pageId, item.pageIndex, $event)" v-for="item in pageLayoutCache" :pageIndex = "item.pageIndex" :pageId="item.pageId" :key="item.pageId" :style="{height:item.viewH + 13 + 'px', top:item.pageTop+'px'}" :class="{'ms-page-canvas-active':pageActiveStyle(item.pageId)}">
        <div class="ms-page-num" :style="{width:item.numWidth+'px', top:item.viewTop+'px'}">{{item.num}}</div>
        <div :style="{left:item.viewLeft+'px', top:item.viewTop+'px', width:item.viewW+'px', height:item.viewH+'px'}" class="ms-page-canvas" :class="{'ms-page-canvas-active-border':pageActiveStyle(item.pageId)}">
          <canvas :key="item.pageId+'_thumb'" :id="item.pageId+'_thumb'" :width="item.viewW" :height="item.viewH"></canvas>
        </div>
      </div>
      <div class="ms-left-page-height" :style="{height:pageLayoutHeight +'px'}"></div>
      <div class="ms-left-page-aux" :style="{ top:pageAuxTop+'px', display:pageAuxShow?'block':'none'}"></div>
    </div>
  </div>
</template>

<script>

  import $$ from 'jquery'

  export default {
    props:["sliderCanvas","sliderCanvasParentW","sliderCanvasParentH","msLeftWidth","ctrlKeyDown","shiftKeyDown"],
    data: () => ({
      pageLayoutCacheSetTimeout:null,
      pageAuxTop:0,
      pageAuxShow:false,

      pageSelectList:[],

      msPageChangePosOn:false,

      staticCanvas:{},
    }),
    watch:{

    },
    computed:{
      pageLayoutCache:function(){
        var _this = this;
        var sliderPageSort = this.$store.state.sliderPageSort;
        //var sliderPageIndex = this.$store.state.sliderPageIndex;
        var sliderFile = this.$store.state.sliderFile;
        if(sliderPageSort==null){
          return [];
        }
        var ret = [];
        var sl = sliderPageSort.length;
        var numpageMargin = 4;
        var numWidth = 10 + sl.toString().length*5;
        var pageContainerW = _this.msLeftWidth - numWidth - 15 - numpageMargin;
          //console.log("pageLayoutCache");
        for(var i=0;i<sl;i++){
          var page = sliderPageSort[i], item = {};

          item.num = i+1;
          item.numWidth = numWidth;
          item.viewLeft = numWidth+numpageMargin;
          item.viewW = pageContainerW-numpageMargin-7;
          item.viewH = item.viewW*page.viewH/page.viewW-7;
          item.viewTop = 3;
          item.scale = item.viewW/page.viewW;
          item.pageId = page.pageId;
          item.oPageIndex = page.pageIndex;
          item.pageIndex = i;
          item.order = page.order;
          // if(item.pageId==this.curPageId){
          //  item.activePage = true;
          // }
          // else{
          //  item.activePage = false;
          // }

          item.pageTop = i>0?ret[i-1].viewH+13+ret[i-1].pageTop+9:9;          

          ret.push(item);
          
        }

        clearTimeout(_this.pageLayoutCacheSetTimeout);
        _this.pageLayoutCacheSetTimeout = setTimeout(function(){
          for(var i=0;i<sl;i++){
            var page = ret[i], pageFact = sliderPageSort[i], canvas;
            if(page.pageId in _this.staticCanvas){
              canvas = _this.staticCanvas[page.pageId];
            }
            else{
              canvas = new fabric.StaticCanvas(item.pageId+'_thumb');
              var leftFix = (_this.sliderCanvasParentW - pageFact.viewW)/2,
                topFix = (_this.sliderCanvasParentH - pageFact.viewH)/2;
              //console.log(_this.sliderCanvasParentW , pageFact.viewCanvasWidth);
              _this.staticCanvas[page.pageId] = canvas;
              canvas.renderOnAddRemove = false;
              //var pageIndex = sliderPageIndex[page.pageId];
              var objects = sliderFile.page[page.oPageIndex].objects;

              _this.$parent.$parent.$parent.drawObjectOnCanvas(objects, canvas, "p");

                canvas.renderOnAddRemove = true;
            }
            canvas.setWidth(page.viewW);
            canvas.setHeight(page.viewH);
            canvas.setZoom(page.scale);
          }
        }, 0);

        return ret;
      },
      pageLayoutHeight:function(){
        if(this.pageLayoutCache==null || this.pageLayoutCache.length==0){
          return 0;
        }
        else{
          var lastItem = this.pageLayoutCache[this.pageLayoutCache.length-1];
          return lastItem.pageTop + lastItem.viewH + 13 + 25;
        }
      },
      pageLayoutAuxSize:function(){
        if(this.pageLayoutCache==null || this.pageLayoutCache.length==0){
          return [0, 0];
        }
        else{
          var lastItem = this.pageLayoutCache[this.pageLayoutCache.length-1];
          //lastItem.numWidth + 
          var width = lastItem.viewW+4;
          var left = lastItem.viewLeft+4;
          return [left , width];
        }
      }
    },
    methods:{
      pageAux:function(e){
        var y = e.offsetY;
        var _this = this;
        var target = $$(e.currentTarget), scrollTop = target.scrollTop(), sPsition = scrollTop+y;
        var auxShow = false;
        for(var i=0;i<_this.pageLayoutCache.length;i++){
          var page = _this.pageLayoutCache[i];
          var bottom = page.pageTop + page.viewH + 13;
          if(i==_this.pageLayoutCache.length-1){
            
            if(sPsition>bottom){
                _this.pageAuxTop = bottom + 2;
                _this.pageAuxShow = true;
              break;
            }

          }
          else{
            var nextPage = _this.pageLayoutCache[i+1];
            var nextBottom = nextPage.pageTop;

            if(sPsition<page.pageTop && i==0){
              _this.pageAuxTop = page.pageTop - 6;
                _this.changeCurPage(page.pageId, page.order, e, false);
                _this.pageAuxShow = true;
            }
            else if(sPsition>bottom && sPsition<nextBottom){
              _this.pageAuxTop = bottom + 2;
                _this.changeCurPage(page.pageId, page.order, e, false);
                _this.pageAuxShow = true;
              break;
            }
          }
        }  

      },
      addPage:function(e){
        var param = {};
        var _this = this;
        param.pageId = this.$parent.$parent.$parent.generateRandomKey("page");
        var sliderPageSort = this.$store.state.sliderPageSort;
        param.order = sliderPageSort[sliderPageSort.length-1].order+1;
        param.pageName = "新建页面" + param.order;
        _this.pageSelectList = [];
        this.$store.commit("addPage", param);
        setTimeout(function(){
          var lastEle = _this.pageLayoutCache[_this.pageLayoutCache.length-1];
          var $leftPage = $$(_this.$el).find(".ms-left-page");
          $leftPage.animate({
            scrollTop: lastEle.pageTop + lastEle.viewH + 13 - $leftPage.height()
          }, 100);
        }, 0);
        _this.changeCurPage(param.pageId, param.order, e);

      },

      getPageLayoutCache:function(pageId){
        var _this = this;
        for(var i=0;i<_this.pageLayoutCache.length;i++){
          var la = _this.pageLayoutCache[i];
          if(la.pageId==pageId){
            if(i==_this.pageLayoutCache.length-1){
              return [la, null];
            }
            else{
              return [la, _this.pageLayoutCache[i+1]];
            }
          }
        }

        return null;
      },
      pageAutoScroll:function(pageId){
        var _this = this;
        setTimeout(function(){
            var lastEle = _this.getPageLayoutCache(pageId);
            if(lastEle==null){
              return;
            }
            var $leftPage = $$(_this.$el).find(".ms-left-page");
            var leftPageScrolltop = $leftPage.scrollTop(), leftPageHeight = $leftPage.height();

            var curEle = lastEle[0], prevEle = lastEle[1];

            var scrollTopV = null;
            if(curEle.pageTop<leftPageScrolltop){
              scrollTopV = curEle.pageTop -20;
            }
            else if((curEle.pageTop + curEle.viewH) > (leftPageScrolltop + leftPageHeight) ){
              if(prevEle==null){
                scrollTopV = leftPageScrolltop + leftPageHeight;
              }
              else{
                scrollTopV = prevEle.pageTop - leftPageHeight + 20;
              }
              
            }
            _this.$parent.$parent.$parent.calScrollSize();
            if(scrollTopV!=null){
              $leftPage.animate({
              scrollTop: scrollTopV
            }, 100);
            }
          }, 0);
      },
      changeCurPage:function(pageId, pageIndex, e, isScroll){
        this.pageAuxShow = false;
        if(this.$store.state.curPageId == pageId){
          return;
        }

        if(isScroll==null){
          isScroll = true;
        }

        this.$store.commit("setCurPage", pageId);
        var _this = this;
        _this.$parent.$parent.$parent.refreshPageObjects();
        if(!isScroll){
          return;
        }
        this.pageAutoScroll(pageId);
      },
      pageActiveStyle:function(pageId){
        var _this = this;
        var multiPageSelect = false;
        for(var i=0;i<_this.pageSelectList.length;i++){
          if(pageId == _this.pageSelectList[i].pageId){
            multiPageSelect = true;
            break;
          }
        }
        return (pageId==_this.$store.state.curPageId  || multiPageSelect) && (!_this.pageAuxShow || _this.msPageChangePosOn);
      },
      changePageOrder:function(pageId, pageIndex, e){
        //alert(pageId+":"+pageIndex);
        var _this = this;

        if(_this.ctrlKeyDown || _this.shiftKeyDown){
          _this.changeCurPage(pageId, pageIndex, e);
          if(_this.ctrlKeyDown){
            _this.pageSelectList.push(_this.pageLayoutCache[pageIndex]);
          }
          else{
            var existsPage = {};
            var maxIndex = -Infinity, minIndex = Infinity;
            for(var i=0;i<_this.pageSelectList.length;i++){
              var item = _this.pageSelectList[i];
              if(maxIndex<item.pageIndex){
                maxIndex = item.pageIndex;
              }

              if(minIndex>item.pageIndex){
                minIndex = item.pageIndex;
              }

              existsPage[item.pageIndex] = item.pageId;
            }

            if(pageIndex<maxIndex){
              for(var i=pageIndex;i<=maxIndex;i++){
                var item = _this.pageLayoutCache[i];
                if(!(item.pageIndex in existsPage)){
                   _this.pageSelectList.push(item); 
                }
              }
            }
            else {
              for(var i=minIndex;i<maxIndex;i++){
                var item = _this.pageLayoutCache[i];
                if(item.pageIndex in existsPage){
                  for(var d=0;d<_this.pageSelectList.length;d++){
                    if(_this.pageSelectList[d].pageId == item.pageId){
                      _this.pageSelectList.splice(d, 1);
                    }
                  }
                }
              }

              for(var i=maxIndex;i<=pageIndex;i++){
                var item = _this.pageLayoutCache[i];
                console.log(i, item);
                if(!(item.pageIndex in existsPage)){
                   _this.pageSelectList.push(item);
                }
              }
            }
          }
        }
        else{

          var isSelected = false;

          for(var i=0;i<_this.pageSelectList.length;i++){
            var item = _this.pageSelectList[i];
            if(item.pageId == pageId){
              isSelected = true;
              break;
            }
          }


          if(!isSelected){
            _this.changeCurPage(pageId, pageIndex, e);
            
            _this.pageSelectList = [];
            _this.pageSelectList.push(_this.pageLayoutCache[pageIndex]);
          }

          var lastPosX = 0, moveX = 0, lastPosY = 0, moveY = 0, selectedPos=null;
          $$(document).on("mousemove.changePagePosition", function(event){

            var changeX = event.clientX - lastPosX;
            var changeY = event.clientY - lastPosY;

            if(moveY>5){
              _this.msPageChangePosOn = true;
              var target = $$(_this.$el).find(".ms-left-page"), scrollTop = target.scrollTop(), sPsition = scrollTop+event.clientY-target.offset().top, pageClen = _this.pageLayoutCache.length;

              for(var i=0;i<pageClen;i++){
                var page = _this.pageLayoutCache[i];
                var bottomHalf = page.pageTop + (page.viewH + 13)/2;
                var bottom = page.pageTop + (page.viewH + 13);
                if(i==pageClen-1){
                  
                  if(sPsition>bottomHalf){
                      _this.pageAuxTop = bottom + 2;
                      _this.pageAuxShow = true;
                      selectedPos = pageClen;
                    break;
                  }
                }
                else{
                  var nextPage = _this.pageLayoutCache[i+1];
                  var nextBottomHalf = nextPage.pageTop + (nextPage.viewH + 13)/2;
                  var nextBottom = nextPage.pageTop + (nextPage.viewH + 13);

                  if(sPsition<bottomHalf && i==0){
                    _this.pageAuxTop = page.pageTop - 6;
                      //_this.changeCurPage(page.pageId, page.order, e, false);
                      _this.pageAuxShow = true;
                      selectedPos = 0;
                      break;
                  }
                  else if(sPsition>bottomHalf && sPsition<nextBottomHalf){
                    _this.pageAuxTop = bottom + 2;
                      //_this.changeCurPage(page.pageId, page.order, e, false);
                      _this.pageAuxShow = true;
                      selectedPos = nextPage.pageIndex;
                    break;
                  }
                }
              }

              _this.$parent.$parent.$parent.msPageMoveAuxLeft =event.clientX+5;
              _this.$parent.$parent.$parent.msPageMoveAuxTop =event.clientY-20;
              _this.$parent.$parent.$parent.msPageMoveAuxContent = "正在移动"+ _this.pageSelectList.length +"页";

              if((sPsition-scrollTop)<0){
                target.scrollTop(target.scrollTop()-40);
              }
              else if((sPsition-scrollTop)>target.outerHeight()){
                target.scrollTop(target.scrollTop()+40);
              }
            }

            moveX += changeX;
            moveY += changeY;

            lastPosX = event.clientX;
            lastPosY = event.clientY;
            
          });

          $$(document).on("mouseup.changePagePosition", function(event){
            $$(document).off(".changePagePosition");
            if(!_this.msPageChangePosOn){
              _this.changeCurPage(pageId, pageIndex, e);
              _this.pageSelectList = [];
              _this.pageSelectList.push(_this.pageLayoutCache[pageIndex]);
              return;
            }

            var pageSelectedList = {};
            _this.pageSelectList.sort(function(a, b){
              if(a.order > b.order){
                return 1;
              }
              else{
                return -1;
              }
            });
            for(var i=0;i<_this.pageSelectList.length;i++){
              var item = _this.pageSelectList[i];
              pageSelectedList[item.pageId] = item;

            }
            console.log(selectedPos, _this.pageSelectList);
            var r = 0, orderList = {};
            var pLen = _this.pageLayoutCache.length;
            for(var i=0;i<pLen;i++){
              var item = _this.pageLayoutCache[i];
              if(i==selectedPos){
                for(var x=0;x<_this.pageSelectList.length;x++){
                  orderList[_this.pageSelectList[x].pageId] = r++;
                }
              }
              
              if(!(item.pageId in pageSelectedList)){
                orderList[item.pageId] = r++;
              }
            }

            if(selectedPos == pLen){
              for(var x=0;x<_this.pageSelectList.length;x++){
                orderList[_this.pageSelectList[x].pageId] = r++;
              }
            }

            
            _this.$parent.$parent.$parent.msPageMoveAuxContent = "";
            _this.msPageChangePosOn = false;
            _this.pageAuxShow = false;

            //_this.staticCanvas = {};

            _this.$store.commit("changePageOrder", orderList);

            setTimeout(function(){
              _this.changeCurPage(pageId, pageIndex, e);
              _this.pageSelectList = [];
              for(var i=0;i<_this.pageLayoutCache.length;i++){
                var item = _this.pageLayoutCache[i];
                if(item.pageId in pageSelectedList){
                  _this.pageSelectList.push(item);
                }
              }
              
            });
            
          });
         

        }
        
        e.stopPropagation();
      },

    },


  }
</script>

<style lang="scss">
  @import '../assets/common.scss';

  .ms-left-page{
    @extend %position;
    @extend %scrollStyle;

    top:27px;


    overflow-x: hidden;
    overflow-y: auto;

    .ms-left-page-height{
      position:relative;
      top:0px;
      width: 1px;
      visibility: hidden;
    }

    .ms-left-page-aux{
      @extend %position;
      top:auto;
      bottom: auto;
      left:4px;
      right:2px;
      height: 3px; 
      background: #000;
    }

    .ms-page{
      @extend %position;

      left:4px;
      right:2px;

      border-radius:2px;

      transition:all 0.1s;

      .ms-page-num{
        @extend %position;
        font-size:12px;
        color:#A2A2A2;
        text-align: right;
        left:0px;
        right:auto;
        vertical-align: top;
      }


      &.ms-page-canvas-active {
        background:#EFEFEF;
      }

      &:hover .ms-page-canvas {
        border:2px solid #B6B6B6;
      }

      .ms-page-canvas{
        position:absolute;
        background:#fff;
        border:2px solid #D5D5D5;
        border-radius:2px;
        transition:all 0.3s;

        &.ms-page-canvas-active-border{
          border:2px solid #66B1FF;
        }
      }
    }
  }


.ms-left-page::-webkit-scrollbar-track {
    background-color: transparent;
}

.ms-left-page::-webkit-scrollbar {
    width: 10px;
    height: 10px;
    background-color: transparent;
    /*border:0 none;*/
}

.ms-left-page::-webkit-scrollbar-thumb {
  transition: background 0.2s;
    background: rgba(0,0,0,0.7);
    border: 1px solid #f1f1f1;
    border-radius: 12px;
}

  .ms-left-page::-webkit-scrollbar-thumb:hover {
      background: rgba(0,0,0,0.95);
      border: 1px solid #f1f1f1;
      border-radius: 12px;
  }

  .ms-left-page::-webkit-scrollbar {
    height: 10px;
    width: 10px;
    background:transparent;
}


</style>
