<template>
  <div class="ms-ani">
    <el-dialog
      title="时间线管理"
      :visible.sync="timelinesListShow"
      width="30%" append-to-body> 
      <el-row v-for="item in timeLine" class="ms-timeLine-list" @click.native="timeLineChange(item.id)">
        <el-col :span="2">&nbsp;</el-col>
        <el-col :span="18">
            {{item.name}}
        </el-col>
        <el-col :span="4">
          <i v-if="item.id==currentTimeline.id" class="el-icon-check"></i>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" type="danger" @click="timeLineCreate">新增时间线</el-button>
        <el-button size="small" @click="timelinesListShow = false">关 闭</el-button>
<!--         <el-button type="primary" @click="timelinesListShow = false">确 定</el-button> -->
      </span>
    </el-dialog>

    <el-dialog
      title="时间线触发动作"
      :visible.sync="actionListShow"
      width="500px" append-to-body :before-close="actionListClose"> 
      <!-- <el-row v-for="item in timeLine" class="ms-timeLine-list" @click.native="timeLineChange(item.id)">
        <el-col :span="2">&nbsp;</el-col>
        <el-col :span="18">
            {{item.name}}
        </el-col>
        <el-col :span="4">
          <i v-if="item.id==currentTimeline.id" class="el-icon-check"></i>
        </el-col>
      </el-row> -->

      <el-row v-for="(action, index) in curTimeLineAction.list" style="border-bottom:1px solid #E5E5E5;">
        <el-col :span="24">
          <el-row style="margin:4px auto;">
            <el-col :span="8" style="text-align:right;height:28px;line-height:28px;">
              操作：
            </el-col>
            <el-col :span="16" style="text-align:left;height:28px;">
              <el-select size="mini" v-model="action.type" @change="changeActionType(action, $event)" placeholder="请选择动作">
                <el-option-group
                v-for="group in actionTypeOptions"
                :key="group.label">
                    <el-option
                      v-for="item in group.options"
                      :key="item.key"
                      :label="item.value"
                      :value="item.key">
                    </el-option>
                </el-option-group>
              </el-select>
              &nbsp;&nbsp;
              <el-button icon="el-icon-close" type="danger" size="mini" @click="actionListDelete(index, $event)">删除</el-button>
            </el-col>
          </el-row>

          <el-row v-if="action.type==1" style="margin:4px auto;">
            <el-col :span="8" style="text-align:right;height:28px;line-height:28px;">
              场景：
            </el-col>
            <el-col :span="16" style="text-align:left;height:28px;">
              <el-select size="mini" v-model="action.jump" placeholder="请选择跳转类型">
                <el-option
                  v-for="item in actionOptionsLinks[action.type].jump"
                  :key="item.key"
                  :label="item.value"
                  :value="item.key">
                </el-option>
              </el-select>
            </el-col>
          </el-row>

          <el-row v-if="action.jump==2" style="margin:4px auto;">
            <el-col :span="8" style="text-align:right;height:28px;line-height:28px;">
              选择场景：
            </el-col>
            <el-col :span="16" style="text-align:left;height:28px;">
              <el-select size="mini" v-model="action.pageId" placeholder="请选择场景">
                <el-option
                  v-for="item in sliderPageSort"
                  :key="item.pageId"
                  :label="item.pageName"
                  :value="item.pageId">
                </el-option>
              </el-select>
            </el-col>
          </el-row>

          <el-row v-if="action.type==1" style="margin:4px auto;">
            <el-col :span="8" style="text-align:right;height:28px;line-height:28px;">
              过度：
            </el-col>
            <el-col :span="16" style="text-align:left;height:28px;">
              <el-select size="mini" v-model="action.excess" placeholder="请选择过度类型">
                <el-option
                  v-for="item in actionOptionsLinks[action.type].excess"
                  :key="item.key"
                  :label="item.value"
                  :value="item.key">
                </el-option>
              </el-select>
            </el-col>
          </el-row>

          <el-row v-if="action.type==1" style="margin:4px auto;">
            <el-col :span="8" style="text-align:right;height:36px;line-height:36px;">
              时间长度(s)：
            </el-col>
            <el-col :span="16" style="text-align:left;padding-left:10px;height:36px;">
              <el-slider
                v-model="action.time"
                show-input size="mini">
              </el-slider>
            </el-col>
          </el-row>


          <el-row v-if="action.type==8" style="margin:4px auto;">
            <el-col :span="8" style="text-align:right;height:28px;line-height:28px;">
              场景：
            </el-col>
            <el-col :span="16" style="text-align:left;height:28px;">
              <el-select size="mini" v-model="action.timeLine" placeholder="请选择场景">
                <el-option
                  v-for="item in timeLine"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-col>
          </el-row>

          <el-row v-if="action.type==8" style="margin:4px auto;">
            <el-col :span="8" style="text-align:right;height:28px;line-height:28px;">
              
            </el-col>
            <el-col :span="16" style="text-align:left;height:28px;">
               <el-checkbox v-model="action.reverse">倒序播放</el-checkbox>
            </el-col>
          </el-row>

        </el-col>
      </el-row>

      <span slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="actionListAdd">新增动作</el-button>
        <el-button size="small" type="danger" @click="actionDelete">整体删除</el-button>
        <el-button size="small" @click="actionListShow = false;curTimeLineAction = {};">关 闭</el-button>
      </span>
    </el-dialog>

    <div class="ms-ani-play">
      <div class="play">
        <div title="开始">
          <i class="el-icon-sold-out"></i>
        </div>
        <div title="上一贞">
          <i class="el-icon-sold-out"></i>
        </div>
        <div title="播放">
          <i class="el-icon-sold-out"></i>
        </div>
        <div title="上一贞">
          <i class="el-icon-sold-out"></i>
        </div>
        <div title="重复播放">
          <i class="el-icon-sold-out"></i>
        </div>
        <div title="录制">
          <i class="el-icon-sold-out"></i>
        </div>
      </div>
      <div class="time">
        <span>{{timelineShow(timelineAuxPos)}}</span>
      </div>
      <div class="zoom">
        <el-slider style="margin-top: -7px;" :min="0.1" :max="3" :step="0.1" v-model="zoom"></el-slider>
      </div>
    </div>
    <div class="ms-ani-symbol" :style="{'display':symbolEditState?'block':'none'}">
      <div class="close" @click="symbolEditState=!symbolEditState"><i class="el-icon-error"></i></div>
      <el-breadcrumb style="height:21px;line-height:21px;font-size:12px;display: inline-block;margin-left:25px;" separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>主场景</el-breadcrumb-item>
        <el-breadcrumb-item>元件1</el-breadcrumb-item>
        <el-breadcrumb-item>元件1-1</el-breadcrumb-item>
        <el-breadcrumb-item>元件1-1-1</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="ms-ani-manager" :style="{'top': (symbolEditState?46:25) +'px'}">
      <div class="top" :style="{'height':topBottomRatio+'%'}">
        <div class="functionBtn">
          <div class="main" @click="timelinesListShow=true">
            <div>&nbsp;&nbsp;{{currentTimeline.name}}</div>
            <div><i class="el-icon-caret-right"></i></div>
          </div>
          <div class="action">
            <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;时间轴动作</div>
            <div title="添加动作" @click="actionAdd">添加<i class="el-icon-circle-plus-outline"></i></div>
          </div>
        </div>
        <div class="timeline" @mousedown="moveTimelineAux" @mousewheel="wheelTimelineAux">
          
          <div class="actionline"></div>
        </div>
        <div class="elements" @mousewheel="wheelElementsAux">
          <div class="trans" :style="{transform:'translateY(-'+elementsMoveY+'px)'}">
            <div class="rowItem" v-for="n in curPageObjectsLength+20"></div>
          </div>
        </div>
        <div class="elements" @mousewheel="wheelElementsAux">
          <div class="trans" :style="{transform:'translateY(-'+elementsMoveY+'px)'}">
            <animationElements v-for='ob in curPageObjects' :object='ob' :selectedObjectList="selectedObjectList" :objectIcon = "objectIcon"/>
          </div>
        </div>

        <div class="lane">
          <div class="trans" :style="{width:this.time*this.miPx*this.zoom + 30 + 'px', transform:'translate(-'+timeLineMoveX+'px, -'+elementsMoveY+'px)'}">
            <div class="item" v-for="n in curPageObjectsLength+20"></div>
          </div>
        </div>
        <div class="elementScroll" @scroll="elementsScrollY">
          <div :style="{height:curPageObjectsLength*21 + 30 + 'px'}"></div>
        </div>
      </div>

      <div class="ms-ani-lane" @mousewheel="wheelElementsAux" :style="{'height':'calc('+topBottomRatio+'% - 40px)'}" @mousedown="animationLaneActive">
        <div class="trans" :style="{width:this.time*this.miPx*this.zoom + 30 + 'px', transform:'translate(-'+timeLineMoveX+'px, -'+elementsMoveY+'px)'}">
          <animationLanes v-for='ob in curPageObjects' :object='ob' :selectedObjectList="selectedObjectList" :timeLines="timeLines" :timeLineMoveX="timeLineMoveX"/>
        </div>
      </div>

      <div class="ms-ani-action-line">
        <div class="action" :style="{width:this.time*this.miPx*this.zoom + 30 + 'px', transform:'translateX(-'+timeLineMoveX+'px)'}">
          <div @dblclick="actionListShow=true" class="point" v-for="item in currentTimeline.action" :style="{left:getActionPositin(item.time)-3+'px'}" @mousedown="actionControll(item, $event)">
            <div class="rect" :class="{rectActive:item==curTimeLineAction}"></div>
            <div class="rect" v-if="item.list!=null&&item.list.length>1" style="top:3px;z-index:1;" :class="{rectActive:item==curTimeLineAction}"></div>
          </div>
        </div>
      </div>
      <div class="ms-ani-attr-time">
        <div class="timelineAux" :style="{'left': timeLines.pxArray==null?0:timeLines.pxArray[timelineAuxPos]-6-timeLineMoveX + 'px'}">
          <div class="cur">
            <div class="rect"></div>
          </div>
          <div class="line"></div>
        </div>
        <div class="line"></div>
        <!-- 'translateX('+timeLineMoveX+'+\'px\')' -->
        <svg :width="this.time*this.miPx*this.zoom+30" height="100%" version="1.1" xmlns="http://www.w3.org/2000/svg" :style="{transform:'translateX(-'+timeLineMoveX+'px)'}">
          <g transform="translate(0.5 0.5)">
            <path :d="timeLines.path" fill="transparent" stroke="#D5D5D5" stroke-width="1px" vector-effect="non-scaling-stroke"/>  
          </g>
          <text v-for="item in timeLines.textArr" :x="item.x" :y="item.y" fill="#A1A1A1" stroke="transparent" class="lineTxt">{{item.w}}</text>
        </svg>
      </div>
      <div class="ms-ani-attr-aux" :style="{top:msAniHeightAux-3+'px', display:msAniHeightAuxShow?'block':'none'}"></div>
      <div class="attrBtn" :style="{'top':topBottomRatio+'%'}">
        <div class="bottomAux" @mousedown="changeAttributeSlider"></div>
        <div class="properties">
          <div>&nbsp;&nbsp;属性</div>
          <div><i class="el-icon-caret-right"></i></div>
        </div>
        <div class="ease">
          <div>缓动函数(easeInOutElastic) <i class="el-icon-caret-bottom"></i></div>
        </div>
      </div>
      <div class="bottom" :style="{'top':topBottomRatio+'%'}">
        <div class="attribute">
          <div class="trans" :style="{transform:'translateY(-'+attributeMoveY+'px)'}">
            <div class="animationAttrItem" v-for="item in curObjectAnimation.animation">
              <div class="row">
                <div class="name">
                  {{propertyKeyValue[item.property]}}
                </div>
              </div>
              <div class="path" v-if="item.property=='left' || item.property=='top'">
                <i class="el-icon-circle-plus-outline"></i>
              </div>
              <div class="add" title="添加关键帧" @mousedown="addAttrKeyframe(item, curObjectAnimation.id,$event)">
                <i class="el-icon-circle-plus-outline"></i>
              </div>
            </div>
          </div>
        </div>
        <div class="effect">
          <div class="trans" :style="{width:this.time*this.miPx*this.zoom + 30 + 'px', transform:'translate(-'+timeLineMoveX+'px, -'+attributeMoveY+'px)'}">
            <div class="item" v-for="aniItem in curObjectAnimation.animation">
                <div class="row"></div>
            </div>
          </div>
        </div>
        <div class="attributeScroll" @scroll="attributeScrollY">
          <div :style="{height:(curObjectAnimation.animation!=null?curObjectAnimation.animation.length:0)*21 + 30 + 'px'}"></div>
        </div>
      </div>
      <div class="ms-ani-attr-lane" @mousewheel="wheelAttrAux" :style="{'top':'calc('+topBottomRatio+'% + 20px)'}" @mousedown="timeLineAuxActive">
        <div class="trans" :style="{width:this.time*this.miPx*this.zoom + 30 + 'px', transform:'translate(-'+timeLineMoveX+'px, -'+attributeMoveY+'px)'}">

            <div class="animationLaneAttrItem" v-for="aniItem in curObjectAnimation.animation">
              <div class="row" >
                  <template>
                      <div class="tween" v-for="(ani, index) in aniItem.ani" :style="{left:findPosbyTime(ani.startTime)+1+'px', width:(findPosbyTime(ani.endTime)-findPosbyTime(ani.startTime)-1)+'px'}" @mousedown="attributeTweenActive(aniItem, index, $event)">
                      </div>
                      <div class="keyFrame" v-for="(kf, index) in aniItem.keyframe" :style="{left:(findPosbyTime(kf.time)-3) +'px'}" @mousedown="attributeKeyFrameActive(aniItem, index, $event)">
                        <div class="rect" :class="{rectActive:keyframeCheckSelected(kf)}"></div>
                      </div>
                  </template>
              </div>
            </div>

        </div>
      </div>
      <div class="scroll" @scroll="timelineScrollX">
        <div :style="{width:this.time*this.miPx*this.zoom + 30 + 'px'}" @scroll=""></div>
      </div>
    </div>
  </div>
</template>

<script>

  import $$ from 'jquery'
  import animationElements from '../components/animationElements'
  import animationLanes from '../components/animationLanes'

  export default {
    props:{
      selectedObjectList: {
        type: Object,
        default: {}
      },
      sliderCanvas:{
        type: Object,
        default: {}
      }
    },
    components: {animationElements,animationLanes},
    //props:[{"selectedObjectList"}, "sliderCanvas"],
    data: () => ({
      zoom:1,
      miPx:30,
      fps:30,
      time:120,

      defaultFps:30,

      symbolEditState:false,

      topBottomRatio:60,
      msAniHeightAux:0,
      msAniHeightAuxShow:false,

      timeLines:{},

      timelineAuxPos:0,

      timeLineMoveX:0,

      propertyKeyValue:{
        "left":"水平位置",
        "top":"垂直位置",
        "rotate":"旋转",
        "path":"位置路径",
      },

      timelinesListShow:false,      

      curTimeLineAction:{},

      actionListShow:false,

      // actionType:{},

      actionTypeOptions:[
        {
          "label":"默认",
          "options":[
            {
              key:"0",
              value:"请选择动作...",
            }
          ]
        },
        {
          "label":"常规",
          "options":[
            {
              key:"1",
              value:"跳转到场景页...",
            },
            {
              key:"2",
              value:"运行JavaScript...",
            },
            {
              key:"3",
              value:"触发自定义行为...",
            },
            {
              key:"4",
              value:"前往URL...",
            },
            {
              key:"5",
              value:"发送电子邮件...",
            },
          ]
        },
        {
          "label":"声音",
          "options":[
            {
              key:"6",
              value:"播放声音...",
            },
            {
              key:"7",
              value:"停止声音...",
            },
          ]
        },
        {
          "label":"时间线",
          "options":[
            {
              key:"8",
              value:"开始时间线...",
            },
            {
              key:"9",
              value:"暂停时间线...",
            },
            {
              key:"10",
              value:"继续时间线...",
            },
            {
              key:"11",
              value:"前往某一时间...",
            },
          ]
        }
      ],
      actionOptionsLinks:{
        "1":{
          "jump":[
            {
              key:"0",
              value:"下一个场景"
            },
            {
              key:"1",
              value:"上一个场景"
            },
            {
              key:"2",
              value:"跳转到场景页..."
            }
          ],
          "excess":[
            {
              key:"0",
              value:"即时"
            },
          ]
        },

        "8":{

        }

      },
      objectIcon:{
        "rect":"el-icon-circle-plus-outline",
        "ellipse":"el-icon-circle-plus-outline",
        "triangle":"el-icon-circle-plus-outline",
        "msLine":"el-icon-circle-plus-outline",
        "polygon":"el-icon-circle-plus-outline",
        "polyline":"el-icon-circle-plus-outline",
        "msImage":"el-icon-circle-plus-outline",
        "path":"el-icon-circle-plus-outline",
        "textbox":"el-icon-circle-plus-outline",
        "i-text":"el-icon-circle-plus-outline",
        "group":"el-icon-circle-plus-outline",
        "list":"el-icon-circle-plus-outline",
        "table":"el-icon-circle-plus-outline",
        "chart":"el-icon-circle-plus-outline",
        "select":"el-icon-circle-plus-outline",
        "circle":"el-icon-circle-plus-outline",
      },
      elementsMoveY:0,

      lanesSelectedList:{},

      attributeMoveY:0,

      keyframeSelectedList:[],

      curAniItem:null,

      //timeLinesValue:'00:00.00'
    }),
    mounted: function(){
      var _this = this;

      //$$(this.$el).find(".scroll").scroll();

      this.$nextTick(function () {
        setTimeout(function(){
          _this.setTimeLines();
        }, 0);
      });
    },
    watch:{
      zoom:function(newV, oldV){
        this.fps = 30;
        var fpsCache = this.fps;
        var oneMinutePx = this.miPx * this.zoom,
        perPx = oneMinutePx / fpsCache;
        var deno = [2,3,5,6,10,15,30], i=0;
        while(perPx<1 && i<7){
          fpsCache = this.fps/deno[i++];
          perPx = oneMinutePx / fpsCache;
          //console.log(i, perPx, fpsCache, this.fps, deno[i-1]);
        }

        this.fps = fpsCache;
        this.setTimeLines();
      },
      timelineAuxPos:function(newV, oldV){
        
      }
    },
    computed:{
      sliderPageSort:function(){
        return this.$store.state.sliderPageSort;
      },
      timeLine:function(){
        var page = this.$store.state.curPage;
        if(page==null){
          return [];
        }
        var t = page.timeLine;
        if(t==null){
          t = [];
        }
        return t;
      },
      curPageObjects:function(){
        var page = this.$store.state.curPage;
        if(page==null){
          return [];
        }
        var objects = page.objects;
        if(objects==null){
          objects = [];
        }
        
        return this.deepPageObjectsCopy(objects, null, this.currentTimeline.id);
      },
      curPageObjectsLength:function(){
        return this.computeDeepLen(this.curPageObjects);
      },
      curObjectAnimation:function(){ //当前激活的的对象，多选只认一个
        var active = null;
        var list = this.$parent.selectedObjectList;
        for(var x in list){
          var item = list[x];
          if(item!=null){
            active = {"id":x, "animation":item};
            break;
          }
        }

        if(active==null){
          return {};
        }

        if(this.type(active.animation)!="array"){
          var curTimeLineId = this.$store.state.curTimeLineId;
          if(curTimeLineId==null){
            curTimeLineId = "0";
          }
          active.animation = active.animation[curTimeLineId];
        }

        return active;
      },
      currentTimeline:function(){
        var _this = this;
        var curTimeLineId = _this.$store.state.curTimeLineId;
        if(curTimeLineId==null){
          curTimeLineId = "0";
        }
        
        var line = _this.timeLine;
        for(var i=0;i<line.length;i++){
          var item = line[i];
          if(item.id==curTimeLineId){
            return item;
          }
        }

        return {};
      }
    },
    methods:{
      animationLaneActive:function(e){
        this.timeLineAuxActive(e);
        this.lanesSelectedList = {};
      },
      findPosbyTime:function(time){
          var _this = this;
          if(_this.timeLines.timeArray==null){
              return -100;
          }
          var rangeIndex = this.jfgrid_searcharray(_this.timeLines.timeArray, time);
          return _this.timeLines.pxArray[rangeIndex];
      },
      findTimeByPos:function(pos){
          var _this = this;
          if(_this.timeLines.pxArray==null){
              return -100;
          }

          var rangeIndex = this.jfgrid_searcharray(_this.timeLines.pxArray, pos);
          return _this.timeLines.timeArray[rangeIndex];
      },
      deepPageObjectsCopy(objects, p, curTimeLineId) {
        var ret = [];
        for(var i=objects.length-1;i>=0;i--){
          var item = objects[i], ae = null;
          var curTimeAni = item.animation!=null? item.animation[curTimeLineId]:null;
          if(curTimeAni!=null){
            ae = {};
            var st = Infinity, ed = -Infinity, kf = [];
            for(var a=0;a<curTimeAni.length;a++){
              var aniAll = curTimeAni[a];
              for(var n=0;n<aniAll.ani.length;n++){
                var ani = aniAll.ani[n];
                if(ae.startTime==null || st>ani.startTime){
                  ae.startTime = ani.startTime;
                  st = ani.startTime;
                }

                if(ae.endTime==null || ed<ani.endTime){
                  ae.endTime = ani.endTime;
                  ed = ani.endTime;
                }

                kf.push(ani.startTime, ani.endTime);
              }
            }

            kf = this.arrayMinulsValue(kf, ae.startTime);
            var kf1 = this.sortAndCancelDup(kf);
            kf1.splice(kf1.length-1,1);
            kf1.splice(0,1);
            ae.keyFrame = this.sortAndCancelDup(kf1);
          }

          var ob = {
            type:item.type,
            msName:item.msName,
            msItemID:item.msItemID,
            animation:item.animation,
            curTimeLineId:curTimeLineId,
            animationEle:ae,
            parent: p,
          }

          if(item.type=="group"){
            //console.log(item.type, item.objects, item);
            ob.objects = this.deepPageObjectsCopy(item.objects, ob, curTimeLineId);
          }

          ret.push(ob);
        }

        return ret;
      },
      arrayMinulsValue:function(arr, value){
        for(var i=0;i<arr.length;i++){
          arr[i] = arr[i] - value;
        }
        return arr;
      },
      computeDeepLen:function(d){
        var len = d.length;
        for(var i=0;i<d.length;i++){
          var item = d[i];
          if(item.type=="group"){
            len += this.computeDeepLen(item.objects);
          }
        }
        return len;
      },
      sortAndCancelDup:function(ar){
        var  end;//临时变量用于对比重复元素
        ar.sort(function(a,b){
          if (a>b) {
              return 1;
          }else if(a<b){
              return -1
          }else{
              return 0;
          }
        });
        end = ar[0];
        for (var i = 1; i < ar.length; i++) {
            if (ar[i] == end) {//当前元素如果和临时元素相等则将此元素从数组中删除
                ar.splice(i,1);
                i--;
            }else{
                end = ar[i];
            }
        }
        return ar;
      },
      type(obj) {
          var toString = Object.prototype.toString;
          var map = {
              '[object Boolean]': 'boolean',
              '[object Number]': 'number',
              '[object String]': 'string',
              '[object Function]': 'function',
              '[object Array]': 'array',
              '[object Date]': 'date',
              '[object RegExp]': 'regExp',
              '[object Undefined]': 'undefined',
              '[object Null]': 'null', 
              '[object Object]': 'object'
          };
          return map[toString.call(obj)];
      },
      attributeScrollY:function(e){
        var target = e.currentTarget;
        var _this = this;
        this.attributeMoveY = $$(target).scrollTop();
      },
      elementsScrollY:function(e){
        var target = e.currentTarget;
        var _this = this;
        this.elementsMoveY = $$(target).scrollTop();
      },
      timeLineAuxActive:function(e){
        var _this = this;
        var target = e.currentTarget, managerOffset = $$(this.$el).find(".ms-ani-manager").offset().left+270;
        var pos = e.clientX - managerOffset + _this.timeLineMoveX;
        _this.timelineAuxPos = this.jfgrid_searcharray(_this.timeLines.pxArray, pos);

        this.curTimeLineAction = {};
        this.keyframeSelectedList = [];
        this.lanesSelectedList = {};
      },
      getMaxMinFromArray:function(arr, key){
        if(arr==null || arr.length==0){
          return null;
        }
        if(key==null){
          key = "time";
        }
        var max = -Infinity, min=Infinity;
        for(var i=0;i<arr.length;i++){
          var v = arr[i][key];
          if(min > v){
            min = v;
          }
          if(max < v){
            max = v;
          }
        }

        return {"max":max, "min":min};
      },
      getCurKeyframeBytime:function(keyframe, time){
        for(var i=0;i<keyframe.length;i++){
          var kf = keyframe[i];
          if(kf.time==time){
            return kf;
          }
        }

        return null;
      },
      tweenSelectedKeyframe:function(aniItem, curTween){
        var itemStTime = curTween.startTime;
        var itemEdTime = curTween.endTime;
        var kf = aniItem.keyframe;

        if(this.keyframeSelectedList.length==kf.length){
          return {"max":itemStTime, "min":itemEdTime};
        }

        var stKf = this.getCurKeyframeBytime(kf,itemStTime), edKf = this.getCurKeyframeBytime(kf,itemEdTime);

        var keyframeLimit = this.getMaxMinFromArray(this.keyframeSelectedList, "time");

        //console.log(keyframeLimit);

        if(keyframeLimit!=null && keyframeLimit.max==itemStTime){
          this.keyframeSelectedList.push(edKf);
        }
        else if(keyframeLimit!=null && itemStTime>=keyframeLimit.min && itemEdTime<=keyframeLimit.max){
          return keyframeLimit;
        }
        else {
          this.keyframeSelectedList = [stKf, edKf];
        }

        return this.getMaxMinFromArray(this.keyframeSelectedList, "time");

      },
      attributeTweenActive:function(aniItem, index, e){
        var _this = this;

        if(this.curAniItem!=aniItem){
          _this.keyframeSelectedList = [];
        }

        this.curAniItem = aniItem;

        var $animationEL = this.$el;
        var target = e.currentTarget, managerOffset = $$($animationEL).find(".ms-ani-manager").offset().left+270;
        var timelineWidth = $$($animationEL).find(".timeline").outerWidth();
        var $scroll = $$($animationEL).find(".ms-ani-manager .scroll");

        var curItem = aniItem.ani[index];

        _this.moveTimelineAuxToPos(_this.findPosbyTime(curItem.startTime));

        var limited = this.tweenSelectedKeyframe(aniItem ,curItem);

        var itemStTime = limited.min;
        var itemEdTime = limited.max;

        var cursorPos = e.clientX - managerOffset - _this.findPosbyTime(itemStTime);

        //var cursorPos = ;

        var minulsTime = itemEdTime - itemStTime;

        var timeArray = _this.timeLines.timeArray;

        var lastClientX = e.clientX, moveStart=false;


        $$(document).on("mousemove.changeAttriTweenMove", function(e){

            if(Math.abs(lastClientX-e.clientX)<2 && !moveStart ){
              return;
            }

            if(e.clientX < managerOffset || e.clientX > managerOffset+timelineWidth){

                $scroll.scrollLeft($scroll.scrollLeft() - managerOffset + e.clientX);
            }

            var pos = e.clientX - managerOffset+ _this.timeLineMoveX;


            var start_pos_move = pos - cursorPos;
            var st_time = _this.findTimeByPos(start_pos_move);

            var attachIndex = _this.attachTimelineTick(start_pos_move);
            if(attachIndex!=null){
                st_time = timeArray[attachIndex];
            }

            var ed_time = st_time + minulsTime;

            if(ed_time>=timeArray[timeArray.length-1]){
                ed_time = timeArray[timeArray.length-1];
                st_time = ed_time - minulsTime; 
            }

            for(var i=0;i<_this.keyframeSelectedList.length;i++){
              var kf = _this.keyframeSelectedList[i];
              kf.time += st_time - itemStTime;
            }

            _this.keyFrameGenerate(aniItem);

            itemStTime = st_time;

            // aniItem.ani[index].startTime = st_time;
            // aniItem.ani[index].endTime = ed_time;

            // if(index>0){
            //   aniItem.ani[index-1].endTime = st_time;
            // }

            // if(index<aniItem.ani.length-1){
            //   aniItem.ani[index+1].startTime = ed_time;
            // }

            // aniItem.keyframe[index].time = st_time
            // aniItem.keyframe[index+1].time = ed_time;
            
        });

        $$(document).on("mouseup.changeAttriTweenMove", function(e){
            $$(document).off(".changeAttriTweenMove");
            _this.$store.dispatch("saveSliderData",{
                
            });
        });

        e.stopPropagation();
      },
      attributeKeyFrameActive:function(aniItem, index, e){
        var _this = this;

        if(this.curAniItem!=aniItem){
          _this.keyframeSelectedList = [];
        }

        this.curAniItem = aniItem;

        var $animationEL = this.$el;
        var target = e.currentTarget, managerOffset = $$($animationEL).find(".ms-ani-manager").offset().left+270;
        var timelineWidth = $$($animationEL).find(".timeline").outerWidth();
        var $scroll = $$($animationEL).find(".ms-ani-manager .scroll");


        var itemPreTime = 0;
        var itemStTime = aniItem.keyframe[index].time;
        var itemEdTime = _this.timeLines.timeArray[_this.timeLines.timeArray.length-1];

        var curItem = aniItem.keyframe[index];

        _this.keyframeSelectedList = [curItem];

        if(index<aniItem.keyframe.length-1){
          itemEdTime = aniItem.keyframe[index+1].time;
        }

        if(index>0){
          itemPreTime = aniItem.keyframe[index-1].time;
        }

        _this.moveTimelineAuxToPos(_this.findPosbyTime(itemStTime));

        var timeArray = _this.timeLines.timeArray;

        var lastClientX = e.clientX, moveStart=false;


        $$(document).on("mousemove.changeAttriKfMove", function(e){

            if(Math.abs(lastClientX-e.clientX)<2 && !moveStart ){
              return;
            }

            moveStart = true;

            if(e.clientX < managerOffset || e.clientX > managerOffset+timelineWidth){

                $scroll.scrollLeft($scroll.scrollLeft() - managerOffset + e.clientX);
            }

            var pos = e.clientX - managerOffset+ _this.timeLineMoveX;


            var start_pos_move = pos;
            var st_time = _this.findTimeByPos(start_pos_move);

            // if(st_time>itemEdTime){
            //     var index1 = _this.jfgrid_searcharray(_this.timeLines.timeArray, itemEdTime);
            //     st_time = _this.timeLines.timeArray[index1-1];
            // }
            // else if(st_time<itemPreTime){
            //     var index1 = _this.jfgrid_searcharray(_this.timeLines.timeArray, itemPreTime);
            //     st_time = _this.timeLines.timeArray[index1+1];
            // }
            // else{
            //     var attachIndex = _this.attachTimelineTick(start_pos_move);
            //     if(attachIndex!=null){
            //         st_time = timeArray[attachIndex];
            //     }
            // }

            var attachIndex = _this.attachTimelineTick(start_pos_move);
            if(attachIndex!=null){
                st_time = timeArray[attachIndex];
            }
            

            curItem.time = st_time;
            _this.keyFrameGenerate(aniItem);
            // if(index>0){
            //   aniItem.ani[index-1].endTime = st_time;
            // }

            // if(index<aniItem.keyframe.length-1){
            //   aniItem.ani[index].startTime = st_time;
            // }
            
            
            
        });

        $$(document).on("mouseup.changeAttriKfMove", function(e){
            $$(document).off(".changeAttriKfMove");

            _this.$store.dispatch("saveSliderData",{
                
            });
        });

        e.stopPropagation();
      },
      keyframeCheckSelected:function(kf){
        for(var i=0;i<this.keyframeSelectedList.length;i++){
          var k = this.keyframeSelectedList[i];
          if(k==kf){
            return true;
          }
        }
        return false;
      },
      keyFrameGenerateAll:function(animation, timeLineId, param){
        var curTimeAni = animation!=null? animation[timeLineId]:null;
        if(curTimeAni==null){
          return;
        }

        curTimeAni = $$.extend(true,[],curTimeAni);
        for(var i=0;i<curTimeAni.length;i++){
          var aniItem = curTimeAni[i];
          for(var a=0;a<aniItem.keyframe.length;a++){
            var kf = aniItem.keyframe[a];
            if(param.type=="left"){
              if(kf.time==param.origin_st){
                kf.time = param.st_time;
              }
              else if(kf.time==param.origin_ed){
                kf.time = param.origin_ed;
              }
              else{
                var t = (kf.time-param.origin_st)/(param.origin_ed - kf.time);

                var v = (t * param.origin_ed + param.st_time) / (1+t);

                v = this.timeLines.timeArray[this.jfgrid_searcharray(this.timeLines.timeArray, v)];
                kf.time = v;
              }
            }
            else if(param.type=="right"){
              if(kf.time==param.origin_st){
                kf.time = param.origin_st;
              }
              else if(kf.time==param.origin_ed){
                kf.time = param.ed_time;
              }
              else{
                var t = (kf.time-param.origin_st)/(param.origin_ed - kf.time);

                var v = (t * param.ed_time + param.origin_st) / (1+t);

                v = this.timeLines.timeArray[this.jfgrid_searcharray(this.timeLines.timeArray, v)];
                kf.time = v;
              }
            }
            else if(param.type=="move"){
              if(kf.time==param.origin_st){
                kf.time = param.st_time;
              }
              else if(kf.time==param.origin_ed){
                kf.time = param.ed_time;
              }
              else{
                var t = (kf.time-param.origin_st)/(param.origin_ed - kf.time);

                var v = (t * param.ed_time + param.st_time) / (1+t);

                v = this.timeLines.timeArray[this.jfgrid_searcharray(this.timeLines.timeArray, v)];
                kf.time = v;
              }
            }
          }

          this.keyFrameGenerate(aniItem);
        }

        animation[timeLineId] = curTimeAni;
      },
      getCurObjectById:function(id){
        var page = this.$store.state.curPage;
        if(page==null){
          return null
        }
        var objects = page.objects;
        if(objects==null){
          return null;
        }

        for(var i=0;i<objects.length;i++){
          var ob = objects[i];
          if(ob.msItemID == id){
            return ob;
          }
        }

        return null;
      },
      addAttrKeyframe:function(aniItem, id,e){
        var _this = this;
        var time = _this.timeLines.timeArray[_this.timelineAuxPos], kfItem = null,value=this.getCurObjectById(id);
        if(value!=null){
          value = value[aniItem.property];
        }
        else{
          value = null;
        }


        for(var i=0;i<aniItem.keyframe.length;i++){
          var kf = aniItem.keyframe[i];
          if(kf.time<=time || kfItem==null){
            kfItem = kf;
          }
        }

        if(kfItem!=null){
          value = kfItem.value;
        }

        aniItem.keyframe.push({
            "time": time,
            "value":value,
        });

        console.log(aniItem);

        _this.keyFrameGenerate(aniItem);
      },
      keyFrameGenerate:function(aniItem){
        var kf = aniItem.keyframe, ani = aniItem.ani;
        kf.sort(function(a, b){
          if(a.time>b.time){
            return 1;
          }
          else if(a.time<b.time){
            return -1;
          }
          else{
            return 0;
          }
        });

        var newAni = [];
        for(var i=0;i<kf.length-1;i++){
          var item = kf[i], next = kf[i+1];
          if(item.value==next.value){
            continue;
          }
          var ease = "linear";
          if(ani[i]!=null){
            ease = ani[i].ease;
          }
          newAni.push({
              "startTime": item.time,
              "endTime":next.time,
              "startValue":item.value,
              "endValue":next.value,
              "ease": ease,//linear
          });
        }

        aniItem.ani = newAni;

      },
      objectActive:function(id, object,e){
        var canvas = this.sliderCanvas;
        this.$parent.selectedObjectList = {};
        canvas.discardActiveObject();

        var objects = canvas.getObjects(), activeObjects=[];
        for(var i=0;i<objects.length;i++){
          var item = objects[i];
          if(item.msItemID==id){
            activeObjects.push(item);
          } 
        }

        var sel = new fabric.ActiveSelection(activeObjects, {
          canvas: canvas,
        });
        canvas.setActiveObject(sel);
        canvas.requestRenderAll();

        this.curTimeLineAction = {};
        this.keyframeSelectedList = [];

        //console.log(object.animation);
        window.vueMain.$set(this.$parent.selectedObjectList, id, object.animation);
      },
      actionAdd:function(){
        var _this = this;
        if(_this.currentTimeline.action==null){
          _this.currentTimeline.action = [];
        }

        _this.currentTimeline.action.push({
            "id":_this.$parent.generateRandomKey("timelineAction"),
            "time":_this.timeLines.timeArray[_this.timelineAuxPos],
            "list":[
                {
                    "type":"0",
                }
            ]
        });
      },
      actionDelete:function(){
        var _this = this;

        this.$confirm('清除全部的动作, 是否确定?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            var index = null;
            for(var i=0;i<_this.currentTimeline.action.length;i++){
              var a = _this.currentTimeline.action[i];
              if(a==_this.curTimeLineAction){
                index = i;
              }
            }

            if(index !=null){
              _this.currentTimeline.action.splice(index,1);
              _this.actionListShow = false;
            }
        }).catch(() => {
       
        });

      },
      actionListDelete:function(index, e){
        this.curTimeLineAction.list.splice(index,1);
      },
      actionListAdd:function(){
        if(this.curTimeLineAction.list==null){
          return;
        }
        this.curTimeLineAction.list.push({
            "type":"0"
        });
      },
      changeActionType:function(action, e){
        if(action.type==1){
          action.jump = "0";
          action.excess = "0";
        }
      },
      actionListClose:function(done){
        this.curTimeLineAction = {};
        done();
      },
      actionControll:function(item, e){
        var _this = this;
        var target = e.currentTarget, managerOffset = $$(this.$el).find(".ms-ani-manager").offset().left+270;

        var timelineWidth = $$(this.$el).find(".timeline").outerWidth(); 
        var $scroll = $$(this.$el).find(".ms-ani-manager .scroll");


        var rangeIndex = this.jfgrid_searcharray(_this.timeLines.timeArray, item.time);

        _this.timelineAuxPos = rangeIndex;
        _this.curTimeLineAction = item;

        // var pos = e.clientX - managerOffset + _this.timeLineMoveX;

        // _this.timelineAuxPos = this.jfgrid_searcharray(_this.timeLines.pxArray, pos);

        // var attachIndex = _this.attachTimelineTick(pos);

        // if(attachIndex!=null){
        //   _this.timelineAuxPos = attachIndex;
        // }

        $$(document).on("mousemove.changeActionControll", function(e){

          if(e.clientX < managerOffset || e.clientX > managerOffset+timelineWidth){

            $scroll.scrollLeft($scroll.scrollLeft() - managerOffset + e.clientX);
          }

          var pos = e.clientX - managerOffset+ _this.timeLineMoveX;
          _this.timelineAuxPos = _this.jfgrid_searcharray(_this.timeLines.pxArray, pos);

          var attachIndex = _this.attachTimelineTick(pos);

          if(attachIndex!=null){
            _this.timelineAuxPos = attachIndex;
          }

          window.vueMain.$set(item, "time", _this.timeLines.timeArray[_this.timelineAuxPos]);
          
        });

        $$(document).on("mouseup.changeActionControll", function(e){
          $$(document).off(".changeActionControll");
          var actionIndex = null;
          for(var i=0;i<_this.timeLine.length;i++){
            var item = _this.timeLine[i];
            if(item==_this.curTimeLineAction){
              actionIndex = i;
              break;
            }
          }
          _this.$store.dispatch("saveSliderData",{
            index:i
          });

          // setTimeout(function(){
          //   if(!_this.actionListShow){
          //     _this.curTimeLineAction = {};
          //   }
          // },0);
          
          
        });
      },
      getActionPositin:function(time){
        // timeArray:arr,
        // pxArray:pxArr,
        // path:d,
        // textArr:textArr,
        // attachPx:attachPx,
        // attachIndex:attachIndex
        var _this = this;
        if(_this.timeLines==null || _this.timeLines.timeArray==null || time==null){
          return -100;
        }

        var rangeIndex = this.jfgrid_searcharray(_this.timeLines.timeArray, time);

        return _this.timeLines.pxArray[rangeIndex];
      },
      timeLineCreate:function(){
        //this.$store.commit("setCurTimeLine", id);

        this.$prompt('', '请输入时间线名称', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          // inputValidator:function(v){
          //   console.log(v);
          //   if(v==null || $$.trim(v).length==0){
          //     return false;
          //   }
          //   return true;
          // },
          // inputPattern:"",
          // inputErrorMessage:"请输入内容"
        }).then(({ value }) => {
          if(value==null || $$.trim(value).length==0){
            //console.log(value);
            throw new Error();
            return false;
          }
          //console.log(this);
          this.$store.commit("addTimeLine", {
            id: this.$parent.generateRandomKey("timeline"),
            name:value
          });

          this.$message({
            type: 'success',
            message: '成功创建时间线: ' + value
          });

          this.timelinesListShow = false;
        }).catch(() => {
          this.$message({
            type: 'success',
            message: '请输入正确的值'
          });
        });
      },
      timeLineChange:function(id){
        this.$store.commit("setCurTimeLine", id);
        this.timelinesListShow = false;
      },
      timelineScrollX:function(e){
        var target = e.currentTarget;
        var _this = this;
        this.timeLineMoveX = $$(target).scrollLeft();
      },
      timelineShow:function(pos){
        var _this=this;

        if(_this.timeLines.timeArray==null){
          return "00:00.00";
        }

        var time = _this.timeLines.timeArray[pos];
        //110333
        var sec = Math.floor(time/1000);
        var minu = Math.floor(sec / 60);
        var s = sec % 60;
        var surplus = time - sec*1000;

        if(minu<10){
          minu = "0" + minu;
        }

        if(s<10){
          s = "0" + s;
        }

        var txt = minu + ":" + s + ".";
        if(surplus==0){
          txt += "00";
        }
        else{
          var ds = Math.round(1000/this.defaultFps), index = 0;
          for(var i=0;i<30;i++){
            if(surplus>=i*ds && surplus<(i+1)*ds){
              index = i;
              break;
            }
          }

          if(index<10){
            txt += "0" + index;
          }
          else{
            txt += index;
          }
        }

        return txt;

      },
      jfgridbinary_search : function (arr, key) {
        var low = 0, high = arr.length - 1;
        while (low <= high) {
            var mid = parseInt((high + low) / 2);
            if (key < arr[mid] && (mid == 0 || key >= arr[mid - 1])) {
                return mid;
            } 
            else if (key >= arr[mid]) {
                low = mid + 1;
            } 
            else if (key < arr[mid]) {
                high = mid - 1;
            }
            else {
                return -1;
            }
        }
      },
      jfgridorder_search : function (arr, y) {
          var i = 0, row = 0, row_pre = 0, row_index = -1, i_ed = arr.length - 1;
          while (i < arr.length && i_ed >= 0 && i_ed >= i) {
              row = arr[i_ed];
              if (i_ed == 0) {
                  row_pre = 0;
              }
              else {
                  row_pre = arr[i_ed - 1];
              }

              if (y >= row_pre && y < row) {
                  row_index = i_ed;
                  break;
              }

              row = arr[i];
              if (i == 0) {
                  row_pre = 0;
              }
              else {
                  row_pre = arr[i - 1];
              }

              if (y >= row_pre && y < row) {
                  row_index = i;
                  break;
              }

              i++;
              i_ed--;
          }

          return row_index;
      },
      jfgrid_searcharray : function (arr, y) {
          var index = arr.length - 1;
          if (arr.length < 40 || y <= arr[20] || y >= arr[index - 20]) {
              index = this.jfgridorder_search(arr, y);
          }
          else {
              index = this.jfgridbinary_search(arr, y);
          }

          if(index==null || isNaN(index) || index==-1){
            console.log(arr[arr.length-1] ,y, index);
            if(y<=0){
              index = 0;
              
            }
            else{
              index = arr.length-1;
            }
          }
          else{
            if(arr[index-1]==y){
              index = index -1;
            }
            else if(arr[index+1]==y){
              index = index + 1;
            }
          }
          
          return index;
      },
      attachTimelineTick:function(pos){
        var _this = this;
        var rangeIndex = this.jfgrid_searcharray(_this.timeLines.attachPx, pos);


        if(rangeIndex>0){
          var leftPx = _this.timeLines.attachPx[rangeIndex-1];

          if(Math.abs(leftPx-pos)<=2){
            return _this.timeLines.attachIndex[rangeIndex-1];
          }
        }

        var rightPx = _this.timeLines.attachPx[rangeIndex];

        if(Math.abs(rightPx-pos)<=2){
          return _this.timeLines.attachIndex[rangeIndex];
        }

        return null;
      },
      wheelAttrAux:function(e){
        var deltaX = e.deltaX, deltaY = e.deltaY;
        var _this = this, target = e.currentTarget;   
 
        if(deltaX!=0){
          var $scroll = $$(this.$el).find(".ms-ani-manager .scroll");
          $scroll.scrollLeft($scroll.scrollLeft()+deltaX*2);
        }
        else{
          var $scroll = $$(this.$el).find(".ms-ani-manager .attributeScroll");
          $scroll.scrollTop($scroll.scrollTop()+deltaY/2);
        }
        
      },
      wheelElementsAux:function(e){
        var deltaX = e.deltaX, deltaY = e.deltaY;
        var _this = this, target = e.currentTarget;   
 
        if(deltaX!=0){
          var $scroll = $$(this.$el).find(".ms-ani-manager .scroll");
          $scroll.scrollLeft($scroll.scrollLeft()+deltaX*2);
        }
        else{
          var $scroll = $$(this.$el).find(".ms-ani-manager .elementScroll");
          $scroll.scrollTop($scroll.scrollTop()+deltaY/2);
        }
        
      },
      wheelTimelineAux:function(e){
        var deltaX = e.deltaX, deltaY = e.deltaY;
        var _this = this, target = e.currentTarget;
        var $scroll = $$(this.$el).find(".ms-ani-manager .scroll");
 
        if(deltaX!=0){
          $scroll.scrollLeft($scroll.scrollLeft()+deltaX*2);
        }
        else{
          $scroll.scrollLeft($scroll.scrollLeft()+deltaY*2);
        }
        
      },
      moveTimelineAuxToPos:function(pos){
        var _this = this;
        _this.timelineAuxPos = this.jfgrid_searcharray(_this.timeLines.pxArray, pos);

        var attachIndex = _this.attachTimelineTick(pos);

        if(attachIndex!=null){
          _this.timelineAuxPos = attachIndex;
        }
      },
      moveTimelineAux:function(e){
        var _this = this;
        var target = e.currentTarget, managerOffset = $$(this.$el).find(".ms-ani-manager").offset().left+270;

        var timelineWidth = $$(this.$el).find(".timeline").outerWidth(); 
        var $scroll = $$(this.$el).find(".ms-ani-manager .scroll");

        var pos = e.clientX - managerOffset + _this.timeLineMoveX;
        //console.log(this.timeLines.pxArr);
        _this.timelineAuxPos = this.jfgrid_searcharray(_this.timeLines.pxArray, pos);

        var attachIndex = _this.attachTimelineTick(pos);

        if(attachIndex!=null){
          _this.timelineAuxPos = attachIndex;
        }

        _this.curTimeLineAction = {};
        _this.lanesSelectedList = {};
        _this.keyframeSelectedList = [];

        $$(document).on("mousemove.changeTimelineAux", function(e){

          if(e.clientX < managerOffset || e.clientX > managerOffset+timelineWidth){

            $scroll.scrollLeft($scroll.scrollLeft() - managerOffset + e.clientX);
          }

          var pos = e.clientX - managerOffset+ _this.timeLineMoveX;
          _this.timelineAuxPos = _this.jfgrid_searcharray(_this.timeLines.pxArray, pos);

          var attachIndex = _this.attachTimelineTick(pos);

          if(attachIndex!=null){
            _this.timelineAuxPos = attachIndex;
          }

          //console.log(_this.timelineAuxPos, _this.timeLines.pxArray[_this.timelineAuxPos], _this.timeLines.timeArray[_this.timelineAuxPos]);
        });

        $$(document).on("mouseup.changeTimelineAux", function(e){
          $$(document).off(".changeTimelineAux");
          
        });
      },
      setTimeLines:function(){

        var oneMinutePx = this.miPx * this.zoom,
        perPx = oneMinutePx / this.fps,
        arrayLen = this.time * this.fps,
        pxArr = [],
        d = "",
        tick = 4,
        per = 1000 / this.fps,
        arr = [],
        textArr = [],
        textRatio = 0.75,
        attachPx = [],
        attachIndex = []
        ;

        var showP = 1;

        var allHeight = $$(this.$el).find(".ms-ani-manager").outerHeight();
        if(perPx<3){
          showP = Math.ceil(3 / perPx);
        }

        while(!(this.fps%showP==0)){ 
          showP++;
        }

        if(showP==this.fps){
          showP = 0;
        }

        var interval = 0;
        for(var i=0;i<=arrayLen;i++){
          var p = Math.round(i*perPx);
          var time = Math.round(i*per);
          if(i%this.fps==0){
            p = i*oneMinutePx/this.fps;
            time = i*1000/this.fps;
          }


          if(i%showP==0){
            d += "M"+ p +" 19 L" + p + " " + (19-tick) + " ";
          }

          //console.log(i,this.fps,interval,showP);
          if((i%this.fps==0 && interval>=30) || i ==0 ){
            //console.log(i,this.fps,interval,perPx,showP);
            if(i>0){
              d += "M"+ p +" "+ (19-tick * 4) +" L" + p + " " + allHeight + " ";
              interval = 0;
            }
            
            textArr.push({
              x:(p+3)/textRatio,
              y:(19-tick-3)/textRatio,
              w:i/this.fps,
            });

            attachPx.push(p);
            attachIndex.push(i);
          }

          interval += perPx;
          
          pxArr.push(p);
          arr.push(time);
        }

        this.timeLines = {
          timeArray:arr,
          pxArray:pxArr,
          path:d,
          textArr:textArr,
          attachPx:attachPx,
          attachIndex:attachIndex
        }
      },
      changeAttributeSlider:function(e){
        var _this = this;
        var lastPosY = e.clientY;

        var target = e.currentTarget, offset = $$(target).offset().top;
        var paddingY = e.pageY - offset;

        lastPosY = offset;
        var managerOffset = $$(this.$el).find(".ms-ani-manager").offset().top+3;
        _this.msAniHeightAux = offset - managerOffset;
        _this.msAniHeightAuxShow = true;
        $$(document).css("cursor", "row-resize");

        $$(document).on("mousemove.changeAttrSlider", function(e){

          var changesize = e.clientY - lastPosY;

          var topHeight = _this.msAniHeightAux+changesize;
          //console.log(lastPosY, 100-managerOffset,managerOffset);
          if(topHeight<46 || lastPosY<46+managerOffset ){
            topHeight = 46;
          }

          _this.msAniHeightAux = topHeight;
          lastPosY = e.clientY;
          
        });

        $$(document).on("mouseup.changeAttrSlider", function(e){
          $$(document).off(".changeAttrSlider").css("cursor", "auto");
          //_this.msViewHeight = _this.msAniHeightAux;

          _this.topBottomRatio = Math.floor(((_this.msAniHeightAux-3) / $(_this.$el).find(".ms-ani-manager").outerHeight())*1000)/10;

          //console.log(_this.topBottomRatio);

          _this.msAniHeightAuxShow = false;



          // setTimeout(function(){
          //   _this.allResize();
          // }, 0);
        });
      },
    },

  }
</script>

<style lang="scss">
@import '../assets/common.scss';

.ms-timeLine-list{
  font-size: 16px;
  //color: #409EFF;
  padding-top: 4px;
  padding-bottom: 4px;
  &:hover{
    background: #409EFF;
    color: #fff;
    cursor: pointer;
    i {
      color: #fff;
    }
  }

  i{
    font-size: 22px;
    font-weight: bold;
    color: #409EFF;
  }
}

.ms-ani{
  @extend %position;
  @extend %userSelectNo;
  top:5px;
  //background: url(../../public/animations.png);
  background-size: cover;

  .ms-ani-play{
    @extend %position;
    bottom: auto;
    height: 24px;
    border-bottom: solid 1px #E4E4E4;

    .play{
      @extend %position;
      width:270px;
      height:24px;
      top:0px;
      left:0px;
      div {
        display:inline-block;
        width:44px;
        height:24px;
        border-right:1px solid #E5E5E5;
        text-align:center;
        line-height:24px;

        &:hover{
          // background:#66B1FF;
          color:#66B1FF;
          cursor:pointer;
        }
      }
    }

    .time{
      @extend %position;
      height:24px;
      left:301px;
      right:151px;
      line-height:24px;
    }

    .zoom{
      @extend %position;
      width:150px;
      height:24px;
      left:auto;
      right:12px;
    }
    
  }

  .ms-ani-symbol{
    @extend %position;
    height:21px;
    line-height:21px;
    background:#F56D6D;
    color:#fff;
    top:25px;
    .el-breadcrumb__item .el-breadcrumb__inner, .el-breadcrumb__separator{
      color:#fff;
    }

    .el-breadcrumb__item .el-breadcrumb__inner a:hover , .el-breadcrumb__item .el-breadcrumb__inner:hover{
      cursor: pointer;
      color:#fff;
      text-decoration: underline;
    }

    .el-breadcrumb__item:last-child .el-breadcrumb__inner a:hover , .el-breadcrumb__item:last-child .el-breadcrumb__inner:hover{
      cursor: default;
      color:#fff;
      text-decoration: none;
    }

    .close{
      @extend %position;
      left:2px;
      top:0px;
      width:21px;
      height:21px;
      text-align:center;
      line-height:21px;
      cursor: pointer;
      font-size:13px;
    }
  }

  .ms-ani-manager{
    @extend %position;
    
    font-size:12px;

    .top{
      @extend %position;
      bottom:0px;
      top:0px;
      // height:60%;

      .functionBtn{
        @extend %position;
        width:269px;
        height:40px;
        border-right:1px solid #E5E5E5;

        .main{
          @extend %position;
          height:19px;
          border-bottom:1px solid #E5E5E5;
          line-height:19px;

          div:last-child{
            @extend %position;
            left:auto;
            right:5px;
            width:12px;
            height:12px;
            font-size:14px;
          }

          &:hover{
            background:#66B1FF;
            color:#fff;
            cursor:pointer;
          }
        }

        .action{
          @extend %position;
          top:20px;
          height:19px;
          border-bottom:1px solid #E5E5E5;
          line-height:19px;
          background:#FAFAFA;
          div:last-child{
            @extend %position;
            left:auto;
            right:5px;
            height:12px;

            &:hover{
              color:#66B1FF;
              cursor:pointer;
            }
          }
        }
        
      }

      .timeline{
        @extend %position;
        left:270px;
        height:40px;

        .actionline{
          @extend %position;
          top:20px;
          height:19px;
          border-bottom:1px solid #E5E5E5;
          line-height:19px;
          background:#FAFAFA;
        }
      }

      .elements{
        @extend %position;
        width:269px;
        top:40px;
        border-right:1px solid #E5E5E5;
        overflow: hidden;
        .trans{
          position:relative;
          top:0px;
          left:0px;
          width:100%;

          .rowItem{
            position: relative;
            width: 100%;
            height:21px;
            line-height:21px;
            &:nth-child(odd) {
              background-color: #ffffff;
            }
            &:nth-child(even) {
              background-color:darken(#FAFAFA,2%);
            }
          }

          .animationElementsItem{
              position:relative;
              width:100%;
              // top:auto;
              // bottom:auto;
              // height:21px;


              // &:nth-child(odd) {
              //   background-color: #ffffff;
              // }
              // &:nth-child(even) {
              //   background-color:darken(#FAFAFA,2%);
              // }



              .row{
                position: relative;
                width: 100%;
                height:21px;
                line-height:21px;
                .group{
                  @extend %position;
                  left:0px;
                  width:21px;
                  text-align:center;
                  font-size:18px;
                  color:#5E5E5E;
                  cursor:pointer;
                }

                .icon{
                  @extend %position;
                  left:21px;
                  width:21px;
                  text-align:center;
                }

                .name{
                  @extend %position;
                  left:42px;
                  right:42px;
                }

                

                &.active{
                  background-color: rgba(#409EFF,0.3);
                }
              }

              .hide{
                  @extend %position;
                  left:auto;
                  line-height:21px;
                  right:21px;
                  width:21px;
                  text-align:center;
                }

                .lock{
                  @extend %position;
                  line-height:21px;
                  left:auto;
                  right:0px;
                  width:21px;
                  text-align:center;
                }
          }

          // .row:nth-child(odd) {
          //   background-color: #ffffff;
          // }
          // .row:nth-child(even) {
          //   background-color:darken(#FAFAFA,2%);
          // }
        }
      }

      .lane{
        @extend %position;
        left:270px;
        top:40px;
        overflow: hidden;

        .trans{
          position:relative;
          top:0px;
          left:0px;
          width:100%;
          .item{
            position: relative;
            width: 100%;
            height:21px;
            line-height:21px;
            &:nth-child(odd) {
              background-color: #ffffff;
            }
            &:nth-child(even) {
              background-color:darken(#FAFAFA,2%);
            }
          }
        }
      }

      .elementScroll {
        @extend %position;
        @extend %scrollStyle;
        top:40px;
        // bottom:0px;
        right:0px;
        left:auto;
        width: 8px;
        height:auto;
        z-index:2;
        
        opacity: 0.7;
        transition: opacity 0.3s;

        div {
          height: 1px;
          width: 1px;
        }
      }


      .elementScroll::-webkit-scrollbar-track {
          background-color: transparent;
      }

      .elementScroll::-webkit-scrollbar {
          width: 8px;
          height: 8px;
          background-color: transparent;
          /*border:0 none;*/
      }

      .elementScroll::-webkit-scrollbar-thumb {
        transition: background 0.2s;
          background: rgba(0,0,0,0.7);
          border: 1px solid #f1f1f1;
          border-radius: 12px;
      }

        .elementScroll::-webkit-scrollbar-thumb:hover {
            background: rgba(0,0,0,0.95);
            border: 1px solid #f1f1f1;
            border-radius: 12px;
        }

      .elementScroll::-webkit-scrollbar {
          height:0px;
      }
    }

    .ms-ani-lane{
      @extend %position;
      left:270px;
      top:40px;
      bottom:auto;
      //height:calc(60% - 40px);
      overflow: hidden;
      z-index:2;
      
      .trans{
        position:relative;
        top:0px;
        left:0px;
        width:100%;

        .animationLaneItem{
          position:relative;
          width:100%;
          .row{
            position: relative;
            width: 100%;
            height:21px;
            line-height:21px;

            .item{
              @extend %position;
              top:4px;
              bottom:4px;
              background:#409EFF;
              box-shadow: 0px 0px 1px #343434;
              border-radius:3px;
              // left:0px;
              // width:21px;
              // text-align:center;
              // font-size:18px;
              // color:#5E5E5E;
              // cursor:pointer;

              .leftAux{
                @extend %position;
                left:0px;
                width:3px;
                cursor:col-resize;
              }

              .rightAux{
                @extend %position;
                right:0px;
                width:3px;
                left: auto;
                cursor:col-resize;
              }

              &.itemActive{
                background-color: #fff;
              }
            }

            .keyFrame{
              @extend %position;
              right:auto;
              width:1px;
              top:5px;
              bottom:5px;
              background:lighten(#409EFF, 30%);
              pointer-events: none;
            }

          
            &.active{
              background-color: rgba(#409EFF,0.2);
            }
          }
        }
      }
    }

    .ms-ani-action-line {
      @extend %position;
      top:20px;
      height:20px;
      line-height:20px;
      left:270px;
      z-index:2;
      pointer-events:none;
      overflow:hidden;
      .action{
        @extend %position;
        height:20px;
        line-height:20px;
        left:auto;
        right:auto;
        .point{
          @extend %position;
          pointer-events:all;
          top:5px;
          bottom:all;
          left:auto;
          right:auto;
          width:8px;
          height:8px;
          .rect{
            position:absolute;
            top:0px;
            left:0px;
            height:8px;
            width:8px;
            background:#409EFF;
            transform:rotate(45deg);
            box-shadow:0px 0px 1px #343434;
            z-index:2;
            // cursor:pointer;

            
          }

          .rectActive{
            background:#fff;
          }

          &:hover .rect{
            background:lighten(#409EFF,10%);
          }

          &:hover .rectActive{
            background:#fff;
          }

        }
      }
      
    }

    .ms-ani-attr-time{
      @extend %position;
      left:270px;
      pointer-events:none;
      overflow: hidden;
      z-index: 1;

      .line{
        @extend %position;
        height:19px;
        border-bottom:1px solid #D5D5D5;
        line-height:19px;
      }

      .lineTxt{
        font-size:12px;
        transform:scale(0.75);
      }
      
      .timelineAux{
        @extend %position;
        width:13px;
        left:20px;
        right:auto;
        opacity:0.9;
        z-index: 1;

        .cur{
          @extend %position;
          top:0px;
          overflow:hidden;
          height:13px;
          width:13px;

          .rect{
            position:relative;
            top:-4px;
            left:2px;
            height:9px;
            width:9px;
            background:#444444;
            transform:rotate(45deg);

          }

        }

        .line{
          @extend %position;
          top:5px;
          left:6px;
          width:1px;
          height:100%;
          background:#444444;
        }
      }
    }

    .ms-ani-attr-aux{
        @extend %position;
        top:auto;
        bottom:auto;
        height: 3px;
        background:#66B1FF;
        z-index:10000
      }

    .attrBtn{
      @extend %position;
      // top:60%;
      height:19px;
      line-height:19px;
      border-bottom:1px solid #E5E5E5;
      background:#FAFAFA;
      z-index:1;

      .bottomAux{
        @extend %position;
        top:0px;
        height:3px;
        cursor: row-resize;
        z-index:1;
        
        &:hover{
          cursor: row-resize;
          background:#66B1FF;
        }
      }

      .properties {
        @extend %position;
        width:269px;
        border-right:1px solid #E5E5E5;
        height:19px;
        border-bottom:1px solid #E5E5E5;
        line-height:19px;

        div:last-child {
          @extend %position;
          left:auto;
          right:5px;
          width:12px;
          height:12px;
          font-size:14px;
        }

        &:hover{
          background:#66B1FF;
          color:#fff;
          cursor:pointer;
        }
      }

      .ease {
        @extend %position;
        left:270px;
        height:19px;
        border-bottom:1px solid #E5E5E5;
        line-height:19px;
        background:#FAFAFA;
        div {
          @extend %position;
          left:auto;
          right:5px;
          font-size:12px;
          &:hover{
            color:#66B1FF;
            cursor:pointer;
          }
        }
      }

    }

    .bottom{
      @extend %position;
      // top:60%;

      .attribute{
        @extend %position;
        width:269px;
        top:20px;
        overflow: hidden;
        border-right:1px solid #E5E5E5;

        .trans{
          position:relative;
          top:0px;
          left:0px;
          width:100%;

          .animationAttrItem{
              position:relative;
              width:100%;
              // top:auto;
              // bottom:auto;
              // height:21px;


              &:nth-child(odd) {
                background-color: #ffffff;
              }
              &:nth-child(even) {
                background-color:darken(#FAFAFA,2%);
              }

              .row{
                position: relative;
                width: 100%;
                height:21px;
                line-height:21px;

                .name{
                  @extend %position;
                  left:21px;
                  right:42px;
                }

              }

              .path{
                @extend %position;
                left:auto;
                line-height:21px;
                right:21px;
                width:21px;
                text-align:center;
              }

              .add{
                @extend %position;
                line-height:21px;
                left:auto;
                right:0px;
                width:21px;
                text-align:center;

                &:hover{
                  color:#409EFF;
                  cursor: pointer;
                }
              }

          }
        }

      }

      .effect{
        @extend %position;
        left:270px;
        top:20px;
        overflow: hidden;

        .trans{
          position:relative;
          top:0px;
          left:0px;
          width:100%;
          .item{
            position:relative;
            width: 100%;
            height:21px;
            line-height:21px;

            &:nth-child(odd) {
              background-color: #ffffff;
            }
            &:nth-child(even) {
              background-color:darken(#FAFAFA,2%);
            }
          }
        }
      }

      .attributeScroll {
        @extend %position;
        @extend %scrollStyle;
        top:20px;
        // bottom:0px;
        right:0px;
        left:auto;
        width: 8px;
        height:auto;
        z-index:2;
        
        opacity: 0.7;
        transition: opacity 0.3s;

        div {
          height: 1px;
          width: 1px;
        }
      }


      .attributeScroll::-webkit-scrollbar-track {
          background-color: transparent;
      }

      .attributeScroll::-webkit-scrollbar {
          width: 8px;
          height: 8px;
          background-color: transparent;
          /*border:0 none;*/
      }

      .attributeScroll::-webkit-scrollbar-thumb {
        transition: background 0.2s;
          background: rgba(0,0,0,0.7);
          border: 1px solid #f1f1f1;
          border-radius: 12px;
      }

        .attributeScroll::-webkit-scrollbar-thumb:hover {
            background: rgba(0,0,0,0.95);
            border: 1px solid #f1f1f1;
            border-radius: 12px;
        }

      .attributeScroll::-webkit-scrollbar {
          height:0px;
      }

    }


    .ms-ani-attr-lane {
      @extend %position;
      left:270px;
      // top:40px;
      // bottom:auto;
      //height:calc(60% - 40px);
      overflow: hidden;
      z-index:2;
      
      .trans{
        position:relative;
        top:0px;
        left:0px;
        width:100%;

        .animationLaneAttrItem{
          position:relative;
          width:100%;

          // &:nth-child(odd) {
          //   background-color: #ffffff;
          // }
          // &:nth-child(even) {
          //   background-color:darken(#FAFAFA,2%);
          // }

          .row{
            position: relative;
            width: 100%;
            height:21px;
            line-height:21px;

            .tween {
              @extend %position;
              top:8px;
              bottom:8px;
              background:#409EFF;
              box-shadow: 0px 0px 1px #343434;
              border-radius:3px;
              z-index:1;
            }

            .keyFrame{
              @extend %position;
              top:6px;
              bottom:all;
              left:auto;
              right:auto;
              width:8px;
              height:8px;
              z-index:2;
              .rect{
                position:absolute;
                top:0px;
                left:0px;
                height:8px;
                width:8px;
                background:#409EFF;
                transform:rotate(45deg);
                box-shadow:0px 0px 1px #343434;
                z-index:2;
                // cursor:pointer;

                
              }

              .rectActive{
                background:#fff;
              }

              &:hover .rect{
                background:lighten(#409EFF,10%);
              }

              &:hover .rectActive{
                background:#fff;
              }
            }

          
            &.active{
              background-color: rgba(#409EFF,0.2);
            }
          }
        }
      }
    }

    .scroll {
      @extend %position;
      @extend %scrollStyle;

      bottom:0;
      top:auto;
      height: 8px;
      left:270px;

      z-index:3;
      
      opacity: 0.7;
      transition: opacity 0.3s;

      div {
        height: 1px;
        width: 1px;
      }
    }


    .scroll::-webkit-scrollbar-track {
        background-color: transparent;
    }

    .scroll::-webkit-scrollbar {
        width: 8px;
        height: 8px;
        background-color: transparent;
        /*border:0 none;*/
    }

    .scroll::-webkit-scrollbar-thumb {
      transition: background 0.2s;
        background: rgba(0,0,0,0.7);
        border: 1px solid #f1f1f1;
        border-radius: 12px;
    }

      .scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(0,0,0,0.95);
          border: 1px solid #f1f1f1;
          border-radius: 12px;
      }

    .scroll::-webkit-scrollbar {
        width:0px;
    }
  }

}


</style>
