<template>
    <div class="ms-point">
		<v-contextmenu ref="contextmenu">
<!-- 			<v-contextmenu-item value="menu1" @click="handleClick">菜单1</v-contextmenu-item> -->
			<component v-for="item in contextMenuData" :is="contextmenuSlot(item)" :value="item.controller" @click="contextmenuClick" :divider="item.controller=='divider' && item.name==null" :title="(item.subMenu==null && item.group==null)?'':item.name">
				<template v-if="item.controller=='divider' && item.name==null">
					
				</template>
				<template v-else-if="item.group==null && item.subMenu==null ">
					<i :class="item.icon"></i> {{item.name}}
				</template>
				<template v-else>
					<component v-for="subItem in contextmenuSub(item)" :is="contextmenuSlot(subItem)" :value="subItem.controller" :divider="subItem.controller=='divider' && subItem.name==null" @click="contextmenuClick">
						<template v-if="subItem.controller=='divider' && subItem.name==null">
							
						</template>
						<template v-else-if="item.group!=null">
							<i :class="subItem.icon" :title="subItem.name"></i>
						</template>
						<template v-else>
							<i :class="subItem.icon"></i> {{subItem.name}}
						</template>
					</component>
				</template>
			</component>
		</v-contextmenu>

    	<div class="ms-pageMove-aux" :style="{left:msPageMoveAuxLeft+'px', top:msPageMoveAuxTop+'px', display:msPageMoveAuxContent.length>0?'block':'none'}">{{msPageMoveAuxContent}}</div>
    	<div class="ms-top">
    		<div class="ms-top-left">
    		    <div class="ms-logo"></div>
    			<div class="ms-share">
    				<el-row style="line-height: 50px;">
					  <el-button type="primary" round size="mini" icon="el-icon-share">协作</el-button>
					  <el-button type="primary" round size="mini" icon="el-icon-download">导出</el-button>
					</el-row>
    			</div>
    		</div>
    		<div class="ms-component-list-c">
    			<div :style="{marginLeft: -msComponentListLeft/2+'px'}" class="ms-component-list">
    				<template v-for="item in componentButtonList">
	    				<el-dropdown :show-timeout="0" @command= "componentButtonClick" v-if="item.type=='list'" class="ms-component">
	    					<div @click= "componentButtonClick(item.controller)">
			    				<div class="ms-component-icon"><i :class="item.icon"></i></div>
			    				<div class="ms-component-txt">{{item.name}}</div>
		    				</div>
		    				<el-dropdown-menu slot="dropdown">
							    <el-dropdown-item :command="list.controller" v-for="list in item.list"><i :class="list.icon"></i> {{list.name}}</el-dropdown-item>
							</el-dropdown-menu>
		    			</el-dropdown>
		    			<div @click= "componentButtonClick(item.controller)" v-if="item.type=='btn'" class="ms-component">
			    			<div class="ms-component-icon"><i :class="item.icon"></i></div>
			    			<div class="ms-component-txt">{{item.name}}</div>
			    		</div>
		    		</template>
    			</div>
    		</div>
    		<div class="ms-top-right">
	    		<div class="ms-amimate">
	    			<el-row style="line-height: 45px;">
	    				<el-radio-group size="small" v-model="componentItemType">
					      <el-radio-button label="1"><i class="el-icon-sold-out"></i>动画</el-radio-button>
					      <el-radio-button label="2"><i class="el-icon-setting"></i>格式</el-radio-button>
					    </el-radio-group>
	    			</el-row>
	    		</div>
	    		<div class="ms-publish">
	    			<el-row style="line-height: 50px;">
					  <el-button type="primary" round size="mini" icon="el-icon-news">保存</el-button>
					  <el-button type="primary" round size="mini" icon="el-icon-edit">发布/预览</el-button>
					  <el-button type="danger" size="mini" icon="el-icon-more" circle></el-button>
					</el-row>
	    		</div>
    		</div>
    	</div>
    	<div class="ms-bottom">
    		<div class="ms-left-slider-aux" :style="{left:msLeftWidthAux-5+'px', display:msLeftWidthAuxShow?'block':'none'}"></div>
    		<div class="ms-left" :style="{width:msLeftWidth+'px'}">
    			<div class="ms-left-slider" @mousedown="changeLeftSlider"></div>
    			<div class="ms-left-Container">
					<el-tabs value="page" type="card" :stretch="true">
						<el-tab-pane label="页面" name="page">
							<pages ref="pages" :sliderCanvas="sliderCanvas" :sliderCanvasParentW="sliderCanvasParentW" :sliderCanvasParentH="sliderCanvasParentH" :msLeftWidth="msLeftWidth" :ctrlKeyDown="ctrlKeyDown" :shiftKeyDown="shiftKeyDown"/>
						</el-tab-pane>
						<el-tab-pane label="布局" name="layout">
							<div class="ms-left-layout">
								
							</div>
						</el-tab-pane>
						<el-tab-pane label="资源库" name="element">
							<div class="ms-left-element">
								
							</div>
						</el-tab-pane>
						<el-tab-pane label="数据源" name="data">
							<div class="ms-left-dataSource">
								
							</div>
						</el-tab-pane>
					</el-tabs>
    			</div>
    		</div>
    		<!-- v-contextmenu:contextmenu -->
    		<div class="ms-mid-c" :style="{left:msLeftWidth+1+'px'}">
	    		<div id="msMidKey" class="ms-mid" :style="{bottom:msViewHeight+1+'px'}">
	    			<canvas id="sliderCanvas"></canvas>
	    			<transition name="fade">
		    			<div @scroll="pointScrollX"  v-show="showsSroll==true" class="ms-mid-scroll ms-mid-scrollx">
		    				<div :style="{width:scrollWidth + 'px' }"></div>
		    			</div>
		    		</transition>
		    		<transition name="fade">
		    			<div @scroll="pointScrollY"  v-show="showsSroll==true" class="ms-mid-scroll ms-mid-scrolly" >
		    				<div :style="{height:scrollHeight+ 'px'}"></div>
		    			</div>
		    		</transition>
		    		<div class="horizon-guide-trigger" title="水平辅助线" @mousedown="createGuide('h', $event)"></div>
		    		<div class="vertical-guide-trigger" title="垂直辅助线" @mousedown="createGuide('v', $event)"></div>

		    		<div v-if="guideType=='h'" :style="{top: guidePos+'px'}" class="horizon-guide-line"></div>
		    		<div v-if="guideType=='v'" :style="{left: guidePos+'px'}" class="vertical-guide-line"></div>

		    		<div class="mscursor"></div>
		    		<transition name="fade">
			    		<div class="msCanvasLoading" :style="{'display':msCanvasLoading?'block':'none'}">
			    			<div><i class="el-icon-loading"></i></div>
			    		</div>
		    		</transition>
	    		</div>
	    		<div class="ms-ani-slider-aux" :style="{bottom:msAniHeightAux-5+'px', display:msAniHeightAuxShow?'block':'none'}"></div>
	    		<div class="ms-ani-c" :style="{height:msViewHeight+'px'}">
	    			<div class="ms-ani-slider" @mousedown="changeAnimationSlider"></div>

	    			<animation ref="animation" :sliderCanvas="sliderCanvas" :selectedObjectList="selectedObjectList" />
	    		</div>
    		</div>
    		<div class="ms-right">
    			<div>{{logtxt}}</div>
    			<div class="ms-function-button">
    				<template v-for="item in functionButtonList">
	    				<el-tooltip v-if="item.controller!='zoomTxt'" class="item" effect="dark" :content="item.name" placement="left">
					      <div class="undo-function-button" @click="functionButtonClick(item.controller, $event)"><i :class="item.icon"></i></div>
					    </el-tooltip>
					    <el-tooltip v-else-if="item.controller=='zoomTxt'" class="item" effect="dark" :content="item.name" placement="left">
					      <div class="undo-function-button undo-function-txt" @click="functionButtonClick(item.controller, $event)">{{zoomFixShow()}}</div>
					    </el-tooltip>
				    </template>
    			</div>
    			<styles ref="styles" :sliderCanvas="sliderCanvas"/>
    		</div>
    	</div>
    </div>
</template>


<script>
import $$ from "jquery";

import styles from "../components/styles"; //基本元素样式、设置等
import pages from "../components/page"; //页面设置及管理
import animation from "../components/animation"; //动画设置及转换

export default {
  components: {
    styles,
    pages,
    animation
  },
  data: () => ({
    //##################编辑器内部参数#####################
    //可滚动的宽度 = 2*sliderCanvasParentW + viewCanvasWidth - Math.min(2*showMin, viewCanvasWidth)
    scrollWidth: 1,
    //可滚动的宽度 = 2*sliderCanvasParentH + viewCanvasHeight - Math.min(2*showMin, viewCanvasHeight)
    scrollHeight: 1, //可滚动的高度

    curScrollX: 0, //目前滚动条X位置
    curScrollY: 0, //目前滚动条Y位置
    curzoom: null, //全局缩放比例

    showviewportBorder: null, //画布框
    showviewport: null, //画布裁剪

    sliderCanvasParentW: null, //视区宽度
    sliderCanvasParentH: null, //视区高度

    sliderCanvas: null, //视区canvas实例

    showMin: 100, //最小显示的方形面积

    objScrollX: null,
    objScrollY: null,

    showsSroll: true,
    showsSrollLag: null,
    resetObjectPositionLag: null,

    logtxt: "",

    spaceKeyDown: false,
    isWheelScaleState: null,
    editorMode: false,
    //辅助线相关设置
    canvasWidthCenterMap: {},
    canvasHeightCenterMap: {},

    guideType: null,
    guidePos: null,

    componentItemType: null,

    msComponentListLeft: 0,

    axisControllOn: true,

    msCanvasLoading: true,

    componentButtonList: [
      {
        name: "页面",
        icon: "el-icon-mobile-phone",
        controller: "page",
        type: "btn"
      },
      {
        name: "文本",
        icon: "el-icon-edit",
        controller: "text",
        type: "list",
        list: [
          {
            name: "单行文本",
            icon: "el-icon-location",
            controller: "singleText",
            type: "btn"
          },
          {
            name: "多行文本",
            icon: "el-icon-location",
            controller: "multiText",
            type: "btn"
          }
        ]
      },
      {
        name: "形状",
        icon: "el-icon-time",
        controller: "shape",
        type: "list",
        list: [
          {
            name: "矩形",
            icon: "el-icon-location",
            controller: "rectShape",
            type: "btn"
          },
          {
            name: "圆形",
            icon: "el-icon-location",
            controller: "circleShape",
            type: "btn"
          },
          {
            name: "三角形",
            icon: "el-icon-location",
            controller: "triangleShape",
            type: "btn"
          },
          {
            name: "线条",
            icon: "el-icon-location",
            controller: "lineShape",
            type: "btn"
          },
          {
            name: "更多形状",
            icon: "el-icon-location",
            controller: "moreShape",
            type: "btn"
          }
        ]
      },
      {
        name: "图片",
        icon: "el-icon-picture",
        controller: "image",
        type: "list",
        list: [
          {
            name: "图片",
            icon: "el-icon-location",
            controller: "defaultImage",
            type: "btn"
          },
          {
            name: "图标",
            icon: "el-icon-location",
            controller: "iconImage",
            type: "btn"
          },
          {
            name: "插图",
            icon: "el-icon-location",
            controller: "illustrationImage",
            type: "btn"
          },
          {
            name: "动画",
            icon: "el-icon-location",
            controller: "gifImage",
            type: "btn"
          }
        ]
      },
      {
        name: "表格",
        icon: "el-icon-date",
        controller: "table",
        type: "list",
        list: [
          {
            name: "静态表格",
            icon: "el-icon-location",
            controller: "staticTable",
            type: "btn"
          },
          {
            name: "常规报表",
            icon: "el-icon-location",
            controller: "defaultTable",
            type: "btn"
          },
          {
            name: "全屏报表",
            icon: "el-icon-location",
            controller: "fullscreenTable",
            type: "btn"
          },
          {
            name: "图片式报表",
            icon: "el-icon-location",
            controller: "imageTable",
            type: "btn"
          }
        ]
      },
      {
        name: "图表",
        icon: "el-icon-share",
        controller: "chart",
        type: "list",
        list: [
          {
            name: "折线图",
            icon: "el-icon-location",
            controller: "lineChart",
            type: "btn"
          },
          {
            name: "柱状图",
            icon: "el-icon-location",
            controller: "columnChart",
            type: "btn"
          },
          {
            name: "条形图",
            icon: "el-icon-location",
            controller: "barChart",
            type: "btn"
          },
          {
            name: "饼图",
            icon: "el-icon-location",
            controller: "pieChart",
            type: "btn"
          },
          {
            name: "更多",
            icon: "el-icon-location",
            controller: "moreChart",
            type: "btn"
          }
        ]
      },
      {
        name: "列表",
        icon: "el-icon-document",
        controller: "list",
        type: "list",
        list: [
          {
            name: "一行列表",
            icon: "el-icon-location",
            controller: "singleList",
            type: "btn"
          },
          {
            name: "多行列表",
            icon: "el-icon-location",
            controller: "moreList",
            type: "btn"
          }
        ]
      },
      {
        name: "表单",
        icon: "el-icon-tickets",
        controller: "form",
        type: "btn"
      },
      {
        name: "更多",
        icon: "el-icon-edit-outline",
        controller: "more",
        type: "list",
        list: [
          {
            name: "音乐",
            icon: "el-icon-more",
            controller: "music",
            type: "btn"
          },
          {
            name: "视频",
            icon: "el-icon-location",
            controller: "video",
            type: "btn"
          },
          {
            name: "触发器",
            icon: "el-icon-rank",
            controller: "trigger",
            type: "btn"
          },
          {
            name: "特效",
            icon: "el-icon-star-on",
            controller: "effect",
            type: "btn"
          },
          {
            name: "数字动效",
            icon: "el-icon-sort",
            controller: "number",
            type: "btn"
          },
          {
            name: "计时",
            icon: "el-icon-bell",
            controller: "date",
            type: "btn"
          },
          {
            name: "公式",
            icon: "el-icon-goods",
            controller: "formula",
            type: "btn"
          },
          {
            name: "特殊组件",
            icon: "el-icon-star-on",
            controller: "smartArt",
            type: "btn"
          },
          {
            name: "小游戏",
            icon: "el-icon-mobile-phone",
            controller: "game",
            type: "btn"
          }
        ]
      }
    ],

    functionButtonList: [
      {
        name: "撤销",
        icon: "el-icon-d-arrow-left",
        controller: "undo"
      },
      {
        name: "重做",
        icon: "el-icon-d-arrow-right",
        controller: "redo"
      },
      {
        name: "预览",
        icon: "el-icon-caret-right",
        controller: "play"
      },
      {
        name: "标尺",
        icon: "el-icon-menu",
        controller: "staff"
      },
      {
        name: "网格",
        icon: "el-icon-news",
        controller: "copy"
      },
      {
        name: "放大",
        icon: "el-icon-zoom-in",
        controller: "zoomIn"
      },
      {
        name: "缩放比例",
        icon: "",
        controller: "zoomTxt"
      },
      {
        name: "缩小",
        icon: "el-icon-zoom-out",
        controller: "zoomOut"
      },
      {
        name: "还原比例",
        icon: "el-icon-search",
        controller: "zoomDefault"
      },
      {
        name: "手写模式",
        icon: "el-icon-edit",
        controller: "freeWriting"
      }
    ],
    contextMenuType: null,
    contextMenu: [
      {
        name: "剪切",
        icon: "el-icon-edit",
        controller: "cut",
        class: "normal"
      },
      {
        name: "复制",
        icon: "el-icon-edit",
        controller: "copy",
        class: "normal"
      },
      {
        name: "粘贴",
        icon: "el-icon-edit",
        controller: "paste",
        class: "normal"
      },
      {
        controller: "divider"
      },
      {
        name: "编辑顶点",
        icon: "el-icon-edit",
        controller: "editVer",
        class: "object"
      },
      {
        controller: "divider"
      },
      {
        name: "组合",
        icon: "el-icon-edit",
        controller: "group",
        class: "object",
        subMenu: [
          {
            name: "组合",
            icon: "el-icon-edit",
            controller: "group",
            class: "object"
          },
          {
            name: "重新组合",
            icon: "el-icon-edit",
            controller: "reGroup",
            class: "object"
          },
          {
            controller: "divider"
          },
          {
            name: "取消组合",
            icon: "el-icon-edit",
            controller: "unGroup",
            class: "object"
          }
        ]
      },
      {
        controller: "divider"
      },
      {
        name: "叠放层次",
        icon: "el-icon-edit",
        class: "object",
        group: [
          {
            name: "顶部",
            icon: "el-icon-edit",
            controller: "bringToFront",
            class: "object"
          },
          {
            name: "上移一层",
            icon: "el-icon-edit",
            controller: "sendBackwards",
            class: "object"
          },
          {
            name: "底部",
            icon: "el-icon-edit",
            controller: "bringForward",
            class: "object"
          },
          {
            name: "下移一层",
            icon: "el-icon-edit",
            controller: "sendToBack",
            class: "object"
          }
        ]
      },
      {
        controller: "divider"
      },
      {
        name: "隐藏",
        icon: "el-icon-edit",
        controller: "hideObject",
        class: "object"
      },
      {
        name: "锁定",
        icon: "el-icon-edit",
        controller: "lockObject",
        class: "object"
      },
      {
        controller: "divider"
      },
      {
        name: "分散",
        icon: "el-icon-edit",
        controller: "distribute",
        class: "group",
        subMenu: [
          {
            name: "横向分散",
            icon: "el-icon-edit",
            controller: "distributeH",
            class: "group"
          },
          {
            name: "纵向分散",
            icon: "el-icon-edit",
            controller: "distributeV",
            class: "group"
          }
        ]
      },
      {
        name: "对齐",
        icon: "el-icon-edit",
        controller: "align",
        class: "group",
        subMenu: [
          {
            name: "左对齐",
            icon: "el-icon-edit",
            controller: "alignLeft",
            class: "group"
          },
          {
            name: "居中",
            icon: "el-icon-edit",
            controller: "alignCenterH",
            class: "group"
          },
          {
            name: "右对齐",
            icon: "el-icon-edit",
            controller: "alignRight",
            class: "group"
          },
          {
            controller: "divider"
          },
          {
            name: "顶部对齐",
            icon: "el-icon-edit",
            controller: "alignTop",
            class: "group"
          },
          {
            name: "垂直居中",
            icon: "el-icon-edit",
            controller: "alignCenterV",
            class: "group"
          },
          {
            name: "底部对齐",
            icon: "el-icon-edit",
            controller: "alignBottom",
            class: "group"
          }
        ]
      },
      {
        name: "大小",
        icon: "el-icon-edit",
        controller: "equal",
        class: "group",
        subMenu: [
          {
            name: "使宽度相同",
            icon: "el-icon-edit",
            controller: "equalWidth",
            class: "group"
          },
          {
            name: "使高度相同",
            icon: "el-icon-edit",
            controller: "equalHeight",
            class: "group"
          },
          {
            name: "使大小相同",
            icon: "el-icon-edit",
            controller: "equalSize",
            class: "group"
          }
        ]
      },
      {
        controller: "divider"
      },
      {
        name: "转换为元件",
        icon: "el-icon-edit",
        controller: "convertSymbol",
        class: "object"
      },
      {
        controller: "divider"
      },
      {
        name: "超链接",
        icon: "el-icon-edit",
        controller: "hyperlink",
        class: "object"
      },
      {
        controller: "divider"
      },
      {
        name: "另存为图片",
        icon: "el-icon-edit",
        controller: "saveImage",
        class: "object"
      },
      {
        controller: "divider"
      },
      {
        name: "新建场景页",
        icon: "el-icon-edit",
        controller: "newPage",
        class: "page"
      },
      {
        name: "复制场景页",
        icon: "el-icon-edit",
        controller: "copyPage",
        class: "page"
      },
      {
        name: "删除场景页",
        icon: "el-icon-edit",
        controller: "delPage",
        class: "page"
      },
      {
        controller: "divider"
      },
      {
        name: "隐藏场景页",
        icon: "el-icon-edit",
        controller: "hidePage",
        class: "page"
      },
      {
        controller: "divider"
      },
      {
        name: "标尺",
        icon: "el-icon-edit",
        controller: "staff",
        class: "page"
      },
      {
        name: "参考线",
        icon: "el-icon-edit",
        controller: "copyPage",
        class: "guideline"
      },
      {
        name: "缩放比例",
        icon: "el-icon-edit",
        controller: "zoom",
        class: "page"
      },
      {
        controller: "divider"
      },
      {
        name: "设置背景",
        icon: "el-icon-edit",
        controller: "background",
        class: "page"
      },
      {
        controller: "divider"
      },
      {
        name: "预览",
        icon: "el-icon-edit",
        controller: "preview",
        class: "page"
      }
    ],

    playBtn: [
      {
        icon: "",
        name: "",
        func: ""
      }
    ],

    msLineClass: null,

    msLeftWidth: 230,

    msViewHeight: 0,

    msLeftWidthAux: 0,
    msLeftWidthAuxShow: false,

    msAniHeightAux: 0,
    msAniHeightAuxShow: false,

    viewOriginX: 0,
    viewOriginY: 0,

    fixResizeX: 0,
    fixResizeY: 0,

    iniResizeX: 0,
    iniResizeY: 0,

    cutImageMask: false,

    ctrlKeyDown: false,
    shiftKeyDown: false,

    msPageMoveAuxTop: 0,
    msPageMoveAuxLeft: 0,
    msPageMoveAuxContent: "",

    groupEditState: false,
    groupEditObjects: [],
    groupEditAux: null,

    selectedObjectList: {}

    // currentObjectOpacity:1
  }),
  mounted: function() {
    //console.log(_this);
		//_this.$store.state.pointMain
		var _this = this;
    _this.$store.dispatch("getSliderFileData").then(() => {
      _this.initialSlider();
    });
  },
  watch: {
    curzoom: function(newV, oldV) {
      this.calScrollSize();
      if (oldV == null) {
        this.initialCanvasShow(
          (this.scrollWidth - this.sliderCanvasParentW) / 2,
          (this.scrollHeight - this.sliderCanvasParentH) / 2
        );
      }
    },
    componentItemType: function(newV, oldV) {
      var _this = this;
      if (newV == 2) {
        this.msViewHeight = 0;
      } else {
        this.msViewHeight = 250;
      }

      setTimeout(function() {
        _this.allResize();
      }, 0);
    }
  },
  computed: {
    contextMenuData: function() {
      var ct = this.contextMenuType;
      var data = this.contextMenu;
      var preItem = { class: 1 };
      if (ct == "page") {
        data = data.filter(function(item) {
          if (
            item.class == ct ||
            (item.class == null && preItem.class != null) ||
            item.class == "normal"
          ) {
            preItem = item;
            return true;
          } else {
            return false;
          }
        });
      } else if (ct == "object") {
        data = data.filter(function(item) {
          if (
            item.class == ct ||
            (item.class == null && preItem.class != null) ||
            item.class == "normal"
          ) {
            preItem = item;
            return true;
          } else {
            return false;
          }
        });
      } else if (ct == "group") {
        data = data.filter(function(item) {
          if (
            item.class == ct ||
            (item.class == null && preItem.class != null) ||
            item.class == "normal" ||
            item.controller == "group"
          ) {
            preItem = item;
            return true;
          } else {
            return false;
          }
        });
      }

      return data;
    },
    curPageId: function() {
      var cp = this.$store.state.curPageId;
      if (cp == null) {
        return {};
      }

      // this.axisOn = cp.axisOn; //刻度显示选项
      // this.matrixOn = cp.matrixOn; //网格线显示
      // this.matrixColor = cp.matrixColor; //网格线颜色
      // this.matrixBorderStyle = cp.matrixBorderStyle; //网格线边框样式设置
      // this.martixAttach = cp.martixAttach; //是否吸附网格线

      // this.curPage.viewCanvasWidth = cp.viewCanvasWidth; //画布的宽度，画布为视区中的有效制作区域
      // this.curPage.viewCanvasHeight = cp.viewCanvasHeight; //画布的高度

      return cp;
    }
  },
  methods: {
    contextmenufilter(vm, event) {
      console.log(vm);
    },
    contextmenuSub(item) {
      //console.log(item);
      if (item.subMenu != null && item.subMenu.length > 0) {
        return item.subMenu;
      } else if (item.group != null && item.group.length > 0) {
        return item.group;
      }
    },
    contextmenuSlot(item) {
      var slot = "v-contextmenu-item";
      if (item.subMenu != null && item.subMenu.length > 0) {
        slot = "v-contextmenu-submenu";
      } else if (item.group != null && item.group.length > 0) {
        slot = "v-contextmenu-group";
      }
      //console.log(slot);
      return slot;
    },
    contextmenuClick(vm, event) {
      console.log(vm);
      var controller = $$(vm.$el).attr("value");
      if (controller == "group") {
        this.$refs.styles.objectGroup();
      } else if (controller == "unGroup") {
        //ungroupOnCanvas()
        //toActiveSelection()
        this.$refs.styles.objectUnGroup();
      } else {
        alert(`${controller} 被点击啦！`);
      }
    },
    cancelCutState: function(auxRectSave, imageSave, curCutImage) {
      var _this = this;
      _this.cutImageMask = false;
      var offsetX = (imageSave.left - auxRectSave.left) / imageSave.scaleX,
        offsetY = (imageSave.top - auxRectSave.top) / imageSave.scaleY;

      var offset = fabric.util.rotateVector(
        { x: offsetX, y: offsetY },
        fabric.util.degreesToRadians(-auxRectSave.angle)
      );

      curCutImage.fill.offsetX = offset.x;
      curCutImage.fill.offsetY = offset.y;

      curCutImage.set({
        width: auxRectSave.width * auxRectSave.scaleX / imageSave.scaleX,
        height: auxRectSave.height * auxRectSave.scaleY / imageSave.scaleY,
        left: auxRectSave.left,
        top: auxRectSave.top,
        scaleX: imageSave.scaleX,
        scaleY: imageSave.scaleY,
        angle: auxRectSave.angle,
        flipX: auxRectSave.flipX,
        flipY: auxRectSave.flipY,
        skewX: auxRectSave.skewX,
        skewY: auxRectSave.skewY
      });

      _this.notActiveStyle([auxRectSave, imageSave], function(obj) {
        obj.set({
          opacity: obj.get("opacityC"),
          selectable: true,
          evented: true
        });
      });

      _this.sliderCanvas.remove(auxRectSave);
      _this.sliderCanvas.remove(imageSave);
      curCutImage.set("visible", true);
      curCutImage.setCoords();
      _this.sliderCanvas.renderAll();
    },
    scaleFix: function(object, auxRectSave, scx, scy) {
      var type = object.type;
      var changeObj = {
        rect: 1,
        triangle: 1,
        ellipse: 1,
        "i-text": 1,
        textbox: 1,
        group: 1
      };
      if (!(type in changeObj) || object == auxRectSave) {
        return;
      }

      if (scx == null) {
        scx = 1;
      }

      if (scy == null) {
        scy = 1;
      }

      var width = object.get("width"),
        scaleX = object.get("scaleX") * scx,
        height = object.get("height"),
        scaleY = object.get("scaleY") * scy;

      object.set({
        width: width * scaleX,
        height: height * scaleY,
        scaleX: 1,
        scaleY: 1
      });

      if (type == "ellipse") {
        object.set("rx", object.get("rx") * scaleX);
        object.set("ry", object.get("ry") * scaleY);
      }
    },
    notActiveStyle: function(objects, objHanddle) {
      var _this = this;
      var allobjects = _this.sliderCanvas.getObjects();
      for (var i = 0; i < allobjects.length; i++) {
        var obj = allobjects[i];
        var isMatch = _this.checkInObjects(obj, objects);

        if (!isMatch && obj != _this.showviewportBorder) {
          if (typeof objHanddle == "function") {
            objHanddle(obj);
          }
          //obj.set({"opacity": obj.get("opacityC"), "selectable":true});
        }
      }
    },
    checkInObjects: function(obj, objects) {
      var _this = this;
      var isMatch = false;
      for (var x = 0; x < objects.length; x++) {
        var ac = objects[x];
        if (obj == ac) {
          isMatch = true;
        }
      }
      return isMatch;
    },
    cancelEditGroup: function() {
      var _this = this;

      _this.notActiveStyle(_this.groupEditObjects, function(obj) {
        if (obj != _this.groupEditAux) {
          obj.set({
            opacity: obj.get("opacityC"),
            selectable: true,
            evented: true
          });
        }
      });

      _this.groupEditState = false;

      //var options = fabric.Object.prototype.toObject.call(_this.groupEditAux);
      var newGroup = new fabric.Group([], {
        width: _this.groupEditAux.width,
        height: _this.groupEditAux.height,
        scaleX: _this.groupEditAux.scaleX,
        scaleY: _this.groupEditAux.scaleY,
        left: _this.groupEditAux.left,
        top: _this.groupEditAux.top,
        angle: _this.groupEditAux.angle,
        flipX: _this.groupEditAux.flipX,
        flipY: _this.groupEditAux.flipY,
        skewX: _this.groupEditAux.skewX,
        skewY: _this.groupEditAux.skewY,
        subTargetCheck: true
      });
      // delete options.type;
      // delete options.type;
      // delete options.type;
      // delete options.type;
      // newGroup.set(options);
      var center = newGroup.getCenterPoint();
      _this.groupEditObjects.forEach(function(object) {
        object.canvas.remove(object);
        object.group = newGroup;
        object.set({
          left: object.left - center.x,
          top: object.top - center.y
        });
        object.setCoords(true, true);
      });
      newGroup._objects = _this.groupEditObjects;
      _this.sliderCanvas.add(newGroup);
      _this.sliderCanvas._activeObject = newGroup;
      newGroup.setCoords();

      _this.sliderCanvas.remove(_this.groupEditAux);
      _this.groupEditAux = null;

      // _this.sliderCanvas.remove(_this.groupEditAux);
      // _this.groupEditAux = null;
      // _this.sliderCanvas.discardActiveObject();
      // var sel = new fabric.ActiveSelection(_this.groupEditObjects, {
      //          		canvas: _this.sliderCanvas,
      //       		});
      // _this.sliderCanvas.setActiveObject(sel);
      // _this.sliderCanvas.getActiveObject().toGroup();
      // _this.sliderCanvas.requestRenderAll();
    },
    applyFilters: function(img, type) {
      var f = fabric.Image.filters;
      if (type == "Invert") {
        img.filters.push(new fabric.Image.filters.Invert());
        //img.filters[1] = new f.Invert();
      } else if (type == "Sepia") {
        img.filters.push(new f.Sepia());
        //img.filters[3] = new f.Sepia();
      } else if (type == "BlackWhite") {
        img.filters.push(new f.BlackWhite());
        //img.filters[19] = new f.BlackWhite();
      } else if (type == "Brownie") {
        img.filters.push(new f.Brownie());
        //img.filters[4] = new f.Brownie();
      } else if (type == "Polaroid") {
        img.filters.push(new f.Polaroid());
        //img.filters[15] = new f.Polaroid();
      } else if (type == "Kodachrome") {
        img.filters.push(new f.Kodachrome());
        //img.filters[18] = new f.Kodachrome();
      }
    },

    //生成随机的图表id
    generateRandomKey: function(prefix) {
      if (prefix == null) {
        prefix = "page";
      }

      var userAgent = window.navigator.userAgent
        .replace(/[^a-zA-Z0-9]/g, "")
        .split("");
      var mid = "";
      for (var i = 0; i < 12; i++) {
        mid += userAgent[Math.round(Math.random() * (userAgent.length - 1))];
      }
      var time = new Date().getTime();

      return prefix + "_" + mid + "_" + time;
    },

    initialSlider: function() {
      var _this = this;
      var $pc = document.querySelector("#sliderCanvas");
      var $parent = $pc.parentElement;
      $pc.height = this.iniResizeY = this.sliderCanvasParentH =
        $parent.clientHeight;
      $pc.width = this.iniResizeX = this.sliderCanvasParentW =
        $parent.clientWidth;

      fabric.filterBackend = new fabric.Canvas2dFilterBackend();

      var canvas = new fabric.Canvas("sliderCanvas", {
        preserveObjectStacking: true,
        centeredKey: "shiftKey",
        stopContextMenu: true,
        uniScaleKey: "ctrlKey"
        // stateful:true,
      });
      this.sliderCanvas = canvas;
      $$("#msMidKey")
        .attr("tabindex", 0)
        .focus()
        .mousedown(function() {
          $$("#msMidKey")
            .attr("tabindex", 0)
            .focus();
        })
        .mouseover(function() {
          $$("#msMidKey")
            .attr("tabindex", 0)
            .focus();
        });

      $$("#msMidKey").on("keydown.msmain", function(e) {
        if (!_this.editorMode) {
          if (e.keyCode == 32) {
            _this.spaceKeyDown = true;
            canvas.defaultCursor = "none";
            _this.showsSroll = false;
            _this.banCanvasInteract();

            $$(_this.$el)
              .find(".mscursor")
              .show();
          }

          if (e.altKey) {
            _this.banCanvasInteract();
          }

          if (e.shiftKey) {
            _this.shiftKeyDown = true;
          }

          if (e.ctrlKey) {
            _this.ctrlKeyDown = true;
          }

          if (e.keyCode == 27) {
            if (_this.groupEditState) {
              _this.cancelEditGroup();
            }

            if (_this.cutImageMask) {
              _this.cancelCutState(auxRectSave, imageSave, curCutImage);
            }
          }

          e.preventDefault();
          e.stopPropagation();
        }
      });

      $$("#msMidKey").on("keyup.msmain", function(e) {
        if (!_this.editorMode) {
          if (_this.spaceKeyDown) {
            _this.spaceKeyDown = false;
            canvas.defaultCursor = "default";
            $$(_this.$el)
              .find(".mscursor")
              .hide();
            _this.initialCanvasShow();
            _this.banCanvasInteract(true);
            _this.showsSroll = true;

            canvas.forEachObject(function(obj) {
              obj.setCoords();
            });
          }

          if (_this.isWheelScaleState == "point") {
            _this.initialCanvasShow();
            _this.showsSroll = true;
            _this.banCanvasInteract(true);
          } else if (_this.isWheelScaleState == "center") {
            _this.initialCanvasShow(
              (_this.scrollWidth - _this.sliderCanvasParentW) / 2,
              (_this.scrollHeight - _this.sliderCanvasParentH) / 2
            );
            _this.showsSroll = true;
            _this.banCanvasInteract(true);
          }

          if (e.altKey) {
            _this.banCanvasInteract(true);
          }

          _this.isWheelScaleState = null;

          _this.shiftKeyDown = false;
          _this.ctrlKeyDown = false;

          e.preventDefault();
          e.stopPropagation();
        }
      });

      $$(document).on("mousemove", function(e) {
        var $midOffset = $$(_this.$el)
          .find(".ms-mid")
          .offset();
        $$(_this.$el)
          .find(".mscursor")
          .css({
            left: e.clientX - $midOffset.left,
            top: e.clientY - $midOffset.top
          });
      });

      canvas.on("text:editing:entered", function(opt) {
        _this.editorMode = true;
        _this.axisControllOn = false;
      });

      canvas.on("text:editing:exited", function(opt) {
        _this.editorMode = false;
        _this.axisControllOn = true;
      });

      // canvas.on("object:scaling",function(opt){
      // 	var o = opt.target;
      // 	//console.log(o);
      // 	var ob = o._objects || o.objects;
      // 	if(ob!=null && ob.length>0){
      // 		for(var i=0;i<ob.length;i++){
      // 			var innerOb = ob[i];
      // 			if(innerOb.type=="msLine"){
      // 				console.log(innerOb);
      // 				innerOb.set("scale", 1);
      // 				innerOb.set("scaleX", 1);
      // 				innerOb.set("scaleY", 1);
      // 				innerOb.setCoords();
      // 			}
      // 		}
      // 	}
      // });

      canvas.on("object:rotating", function(opt) {
        var o = opt.target;
        if (o.objects != null && o.objects.length > 0) {
          console.log(2);
        }
      });

      canvas.on("object:rotated", function(opt) {
        var o = opt.target;
        if (o == imageSave) {
          if (_this.cutImageMask) {
            canvas.setActiveObject(auxRectSave);
          }
        }
      });

      canvas.on("object:scaled", function(opt) {
        var object = opt.target;

        if (object == imageSave) {
          if (_this.cutImageMask) {
            canvas.setActiveObject(auxRectSave);
          }
        }

        _this.scaleFix(object, auxRectSave);
      });

      // canvas.on("object:scaling",function(opt){
      // 	var object = opt.target;

      // 	if(object==imageSave){
      // 		if(_this.cutImageMask){
      // 			canvas.setActiveObject(auxRectSave);
      // 		}
      // 	}

      // 	_this.scaleFix(object, auxRectSave);
      // });

      var lineControl1 = new fabric.Circle({
        fill: "#fff",
        radius: 6,
        stroke: "#969696",
        strokeWidth: 1,
        msType: "lineControl",
        hasControls: false,
        hasBorders: false,
        hasRotatingPoint: false,
        msItemID: "lineControl1",
        hoverCursor: "e-resize"
      });
      var lineControl2 = new fabric.Circle({
        fill: "#fff",
        radius: 6,
        stroke: "#969696",
        strokeWidth: 1,
        msType: "lineControl",
        hasControls: false,
        hasBorders: false,
        hasRotatingPoint: false,
        msItemID: "lineControl2",
        hoverCursor: "e-resize"
      });
      var changeLineObject = null;
      canvas.on("mouse:down:before", function(opt) {
        var o = opt.target;
        if (opt.e.which == 3) {
          if (o == null) {
            _this.contextMenuType = "page";
          } else if (o._objects != null && o._objects.length > 0) {
            _this.contextMenuType = "group";
          } else {
            _this.contextMenuType = "object";
          }

          var e = opt.e;
          _this.$refs.contextmenu.show({
            top: e.pageY,
            left: e.pageX
          });
        } else {
          _this.$refs.contextmenu.hide();
        }

        console.log(o, auxRectSave, imageSave);
        if (_this.cutImageMask) {
          if (o == null || (o != auxRectSave && o != imageSave)) {
            _this.cancelCutState(auxRectSave, imageSave, curCutImage);
          }
        }
        if (o == null) {
          return;
        }
        if (o.type == "msLine") {
          if (!canvas.contains(lineControl1)) {
            canvas.add(lineControl1);
            if ((o.x1 < o.x2 && o.y1 < o.y2) || (o.x1 > o.x2 && o.y1 > o.y2)) {
              lineControl1.set({ top: o.top - 3, left: o.left - 3 });
            } else {
              lineControl1.set({ top: o.top - 3 + o.height, left: o.left - 3 });
            }
          }

          if (!canvas.contains(lineControl2)) {
            canvas.add(lineControl2);
            if ((o.x1 < o.x2 && o.y1 < o.y2) || (o.x1 > o.x2 && o.y1 > o.y2)) {
              lineControl2.set({
                top: o.top + o.y2 - o.y1,
                left: o.left + o.x2 - o.x1
              });
            } else {
              lineControl2.set({
                top: o.top + o.y2 - o.y1 + o.height,
                left: o.left + o.x2 - o.x1
              });
            }
          }
          changeLineObject = o;
          lineControl1.setCoords();
          lineControl2.setCoords();
          //canvas.add(lineControl1, lineControl2);
        } else if (o.msType != "lineControl" && changeLineObject != null) {
          canvas.discardActiveObject();
        }
      });

      canvas.on("selection:created", function(opt) {
        if (opt.selected == null) {
          return;
        }

        var ob = opt.selected;
        var selected = {};
        for (var i = 0; i < ob.length; i++) {
          var innerOb = ob[i];
          selected[innerOb.msItemID] = innerOb.animation;
        }

        _this.selectedObjectList = selected;
      });

      canvas.on("selection:updated", function(opt) {
        if (opt.selected == null) {
          return;
        }

        var ob = opt.selected;
        var selected = {};
        for (var i = 0; i < ob.length; i++) {
          var innerOb = ob[i];
          selected[innerOb.msItemID] = innerOb.animation;
        }

        _this.selectedObjectList = selected;
      });

      canvas.on("selection:cleared", function(opt) {
        _this.selectedObjectList = {};
        if (opt.deselected == null) {
          return;
        }
        var o = opt.deselected[0];
        if (opt.deselected.length == 1 && o.type == "msLine") {
          canvas.remove(lineControl1, lineControl2);
          changeLineObject = null;
        } else {
          var ob = opt.deselected;
          for (var i = 0; i < ob.length; i++) {
            var innerOb = ob[i];
            if (innerOb.type == "msLine") {
              console.log(innerOb);
              var currentT = innerOb.calcTransformMatrix();

              var point1 = fabric.util.transformPoint(
                new fabric.Point(-3, -3),
                currentT
              );

              var point2 = fabric.util.transformPoint(
                new fabric.Point(
                  innerOb.x2 - innerOb.x1,
                  innerOb.y2 - innerOb.y1
                ),
                currentT
              );

              var left = innerOb.left,
                top = innerOb.top;

              var x1 = point1.x,
                y1 = point1.y,
                x2 = point2.x,
                y2 = point2.y;
              if ((x1 < x2 && y1 < y2) || (x1 > x2 && y1 > y2)) {
                innerOb.set({
                  x1: Math.min(x1, x2),
                  y1: Math.min(y1, y2),
                  x2: Math.max(x1, x2),
                  y2: Math.max(y1, y2)
                });
              } else if (x1 < x2 && y1 > y2) {
                innerOb.set({ x1: x1, y1: y1, x2: x2, y2: y2 });
              } else {
                innerOb.set({ x1: x2, y1: y2, x2: x1, y2: y1 });
              }

              innerOb.set({
                scaleX: 1,
                scaleY: 1,
                skewX: 0,
                skewY: 0,
                angle: 0,
                skewY: 0,
                left: left,
                top: top
              });
              innerOb.setCoords();
            }
          }
        }
      });

      canvas.on("object:moving", function(opt) {
        var o = opt.target;
        if (o.type == "msLine") {
          if ((o.x1 < o.x2 && o.y1 < o.y2) || (o.x1 > o.x2 && o.y1 > o.y2)) {
            lineControl1.set({ top: o.top - 3, left: o.left - 3 });
            lineControl2.set({
              top: o.top + o.y2 - o.y1,
              left: o.left + o.x2 - o.x1
            });
          } else {
            lineControl1.set({ top: o.top - 3 + o.height, left: o.left - 3 });
            lineControl2.set({
              top: o.top + o.y2 - o.y1 + o.height,
              left: o.left + o.x2 - o.x1
            });
          }

          lineControl1.setCoords();
          lineControl2.setCoords();
        } else if (o.msType == "lineControl") {
          var x1 = lineControl1.get("left"),
            y1 = lineControl1.get("top"),
            x2 = lineControl2.get("left"),
            y2 = lineControl2.get("top");
          //console.log("1:",x1, y1, " 2:",x2, y2);
          //x1:Math.min(x1, x2), y1:Math.min(y1, y2), x2:Math.max(x1, x2), y2:Math.max(y1, y2)
          //changeLineObject.set({ x1:x1, y1:y1, x2:x2, y2:y2 });
          if ((x1 < x2 && y1 < y2) || (x1 > x2 && y1 > y2)) {
            changeLineObject.set({
              x1: Math.min(x1, x2),
              y1: Math.min(y1, y2),
              x2: Math.max(x1, x2),
              y2: Math.max(y1, y2)
            });
          } else if (x1 < x2 && y1 > y2) {
            changeLineObject.set({ x1: x1, y1: y1, x2: x2, y2: y2 });
          } else {
            changeLineObject.set({ x1: x2, y1: y2, x2: x1, y2: y1 });
          }

          changeLineObject.setCoords();
          lineControl1.setCoords();
          lineControl2.setCoords();
        }
      });

      canvas.on("object:moved", function(opt) {
        var o = opt.target;
        if (o.msType == "lineControl") {
          if (changeLineObject != null) {
            canvas.setActiveObject(changeLineObject);
          }
        } else if (o == imageSave) {
          if (_this.cutImageMask) {
            canvas.setActiveObject(auxRectSave);
          }
        }
      });

      canvas.on("object:modified", function(opt) {
        console.log("modified", opt);
      });

      _this.msLineClass = fabric.util.createClass(fabric.Line, {
        type: "msLine",

        initialize: function(options) {
          //options || (options = { });
          this.lineWidth = options.strokeWidth;
          this.lineColor = options.stroke;
          options.strokeWidth = 10;
          options.stroke = "rgba(255,255,255,0.01)";
          this.callSuper(
            "initialize",
            [options.x1, options.y1, options.x2, options.y2],
            options
          );
          this.set("hasControls", false);
          this.set("hasBorders", false);
          this.set("hasRotatingPoint", false);
          for (var item in options) {
            this[item] = options[item];
          }
        },

        _render: function(ctx) {
          this.callSuper("_render", ctx);
          ctx.save();
          ctx.beginPath();
          if (
            (this.x1 < this.x2 && this.y1 < this.y2) ||
            (this.x1 > this.x2 && this.y1 > this.y2)
          ) {
            ctx.moveTo(-this.width / 2, -this.height / 2);
            ctx.lineTo(
              this.x2 - this.x1 - this.width / 2,
              this.y2 - this.y1 - this.height / 2
            );
          } else {
            ctx.moveTo(-this.width / 2, this.height / 2);
            ctx.lineTo(
              this.x2 - this.x1 - this.width / 2,
              this.y2 - this.y1 + this.height / 2
            );
          }

          ctx.lineWidth = this.lineWidth;
          ctx.strokeStyle = this.lineColor;
          ctx.stroke();

          ctx.restore();
        }
      });

      _this.msImageClass = fabric.util.createClass(fabric.Rect, {
        type: "msImage",

        initialize: function(options, img) {
          //options || (options = { });
          // this.lineWidth = options.strokeWidth;
          // this.lineColor = options.stroke;
          // options.strokeWidth = 10;
          // options.stroke = 'rgba(255,255,255,0.01)';

          // text.set('fill', new fabric.Pattern({
          //   source: img,
          //   repeat: document.getElementById('repeat').value
          // }));
          // shape.set('fill', new fabric.Pattern({
          //   source: img,
          //   repeat: document.getElementById('repeat').value
          // }));
          //canvas.renderAll();

          //img.set("filters", options.filters);
          var cimg = img.cloneAsImage();
          for (var i = 0; i < options.filters.length; i++) {
            var f = options.filters[i];
            _this.applyFilters(cimg, f.type);
          }

          if (options.filters || options.filters.length > 0) {
            cimg.applyFilters();
          }

          this.callSuper("initialize", {
            type: "msImage", //图片组件
            left: options.left,
            top: options.top,
            width: options.width,
            height: options.height,
            fill: new fabric.Pattern({
              source: cimg.getElement(),
              repeat: "no-repeat",
              offsetX: 0,
              offsetY: 0
            }),
            stroke: null,
            strokeWidth: 0,
            scaleX: options.scaleX,
            scaleY: options.scaleY,
            angle: options.angle,
            flipX: options.flipX,
            flipY: options.flipY,
            opacity: options.opacity,
            shadow: options.shadow,
            visible: options.visible,
            skewX: options.skewX,
            skewY: options.skewY,
            img: img,
            perPixelTargetFind: false,
            objectCaching: false
          });

          // setTimeout(function(){
          // 	_this.sliderCanvas.renderAll();
          // },2000);

          // this.set('hasControls',false);
          // this.set('hasBorders',false);
          // this.set('hasRotatingPoint',false);
          // for(var item in options){
          // 	this[item] = options[item];
          // }
        },

        _render: function(ctx) {
          this.callSuper("_render", ctx);
          //console.log(111);
          // ctx.save();
          // ctx.beginPath();
          // if((this.x1<this.x2 && this.y1<this.y2) || (this.x1>this.x2 && this.y1>this.y2) ){
          // 	ctx.moveTo(-this.width/2, -this.height/2);
          //                   	ctx.lineTo(this.x2-this.x1-this.width/2, this.y2-this.y1-this.height/2);
          // }
          // else{
          // 	ctx.moveTo(-this.width/2, this.height/2);
          //                   	ctx.lineTo(this.x2-this.x1-this.width/2, this.y2-this.y1+this.height/2);
          // }

          //                  	ctx.lineWidth = this.lineWidth;
          //                   ctx.strokeStyle = this.lineColor;
          //                   ctx.stroke();

          //                   ctx.restore();
        }
      });

      var auxRectSave = null,
        imageSave = null,
        curCutImage = null;

      canvas.on("mouse:dblclick", function(opt) {
        if (opt.target == null) {
          if (_this.groupEditState) {
            _this.cancelEditGroup();
          } else {
            _this.addObjectsByType("text", function(text) {
              var m = _this.transformPoint(opt.e.offsetX, opt.e.offsetY);
              text.set({
                left: m.x,
                top: m.y
              });
              _this.sliderCanvas.requestRenderAll();

              text.enterEditing().selectAll();
              // text.set("isEditing", true);
            });
          }
        } else if (opt.target.type == "msImage") {
          var imageRect = opt.target;
          var img = imageRect.img.cloneAsImage();

          var left = imageRect.fill.offsetX * imageRect.scaleX,
            top = imageRect.fill.offsetY * imageRect.scaleY;

          var offset = fabric.util.rotateVector(
            { x: left, y: top },
            fabric.util.degreesToRadians(imageRect.angle)
          );

          imageRect.img.set({
            scaleX: imageRect.scaleX,
            scaleY: imageRect.scaleY,
            left: imageRect.left + offset.x,
            top: imageRect.top + offset.y,
            angle: imageRect.angle,
            flipX: imageRect.flipX,
            flipY: imageRect.flipY,
            skewX: imageRect.skewX,
            skewY: imageRect.skewY
          });
          _this.sliderCanvas.add(img);
          imageRect.set("visible", false);

          var auxRect = new fabric.Rect({
            msType: "auxRect",
            width: 200,
            height: 200,
            scaleX: imageRect.scaleX,
            scaleY: imageRect.scaleY,
            left: imageRect.left,
            top: imageRect.top,
            angle: imageRect.angle,
            flipX: imageRect.flipX,
            flipY: imageRect.flipY,
            skewX: imageRect.skewX,
            skewY: imageRect.skewY,
            fill: null,
            stroke: null,
            strokeWidth: 0,
            cornerStyle: "cutImage",
            hasBorders: false,
            hasRotatingPoint: false,
            cornerSize: 30,
            padding: -15
          });
          _this.sliderCanvas.add(auxRect);
          _this.sliderCanvas.setActiveObject(auxRect);

          _this.cutImageMask = true;
          auxRectSave = auxRect;
          imageSave = img;
          curCutImage = imageRect;

          _this.notActiveStyle([auxRectSave, imageSave], function(obj) {
            obj.set({
              opacityC: obj.get("opacity"),
              opacity: 0.8,
              selectable: false,
              evented: false
            });
          });
        } else if (
          opt.target.type == "group" ||
          opt.target.msType == "msSymbol"
        ) {
          var group = opt.target;
          _this.groupEditObjects = [];
          _this.groupEditState = true;
          _this.groupEditAux = new fabric.Rect({
            msType: "auxRect",
            width: group.width,
            height: group.height,
            scaleX: group.scaleX,
            scaleY: group.scaleY,
            left: group.left,
            top: group.top,
            angle: group.angle,
            flipX: group.flipX,
            flipY: group.flipY,
            skewX: group.skewX,
            skewY: group.skewY,
            fill: null,
            stroke: "red",
            strokeWidth: 1,
            strokeDashArray: [2, 3],
            hasBorders: false,
            hasRotatingPoint: false,
            hasControls: false
          });
          group.toActiveSelection();
          _this.groupEditObjects = _this.sliderCanvas.getActiveObject()._objects;
          _this.sliderCanvas.discardActiveObject();
          _this.sliderCanvas.add(_this.groupEditAux);

          _this.notActiveStyle(_this.groupEditObjects, function(obj) {
            if (obj != _this.groupEditAux) {
              obj.set({
                opacityC: obj.get("opacity"),
                opacity: 0.3,
                selectable: false,
                evented: false
              });
            }
          });
        }
      });

      var cutImageMaskFunc = function() {
        if (!_this.cutImageMask) {
          return;
        }
        var ctx = _this.sliderCanvas.getSelectionContext();
        ctx.save();
        ctx.beginPath();
        var point = new fabric.Point(auxRectSave.left, auxRectSave.top);
        ctx.lineWidth = "0";
        ctx.strokeStyle = "rgba(0,0,0,0)";
        ctx.fillStyle = "rgba(0,0,0,0.5)";
        var tf = _this.sliderCanvas.viewportTransform;
        var obTf = auxRectSave.calcTransformMatrix();
        var mT = fabric.util.multiplyTransformMatrices(tf, obTf);

        ctx.transform(mT[0], mT[1], mT[2], mT[3], mT[4], mT[5]);

        var fixzoom = 100;

        ctx.rect(
          -fixzoom * point.x,
          -fixzoom * point.y,
          _this.scrollWidth * fixzoom,
          fixzoom * point.y - auxRectSave.height / 2
        );
        ctx.rect(
          -fixzoom * point.x,
          auxRectSave.height / 2,
          _this.scrollWidth * fixzoom,
          _this.scrollHeight * fixzoom
        );
        ctx.rect(
          -fixzoom * point.x,
          -fixzoom * point.y,
          fixzoom * point.x - auxRectSave.width / 2,
          _this.scrollHeight * fixzoom
        );
        ctx.rect(
          auxRectSave.width / 2,
          -fixzoom * point.y,
          _this.scrollWidth * fixzoom,
          _this.scrollHeight * fixzoom
        );
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      };

      // var groupEditFunc = function(){
      // 	if(!_this.groupEditState){
      // 		return;
      // 	}
      // 	var aux = _this.groupEditAux;
      // 	var ctx = _this.sliderCanvas.getSelectionContext();
      // 	ctx.save();
      //     ctx.beginPath();
      //     var point = new fabric.Point(aux.left, aux.top);
      //     ctx.lineWidth="0";

      canvas.on("after:render", function() {
        cutImageMaskFunc();//剪切
      });

      canvas.on("mouse:down", function(opt) {
        var evt = opt.e;

        if (_this.$refs.pages.pageAuxShow) {
          _this.$refs.pages.pageAuxShow = false;
          _this.$refs.pages.pageAutoScroll(_this.curPageId);
        }

        if (_this.spaceKeyDown) {
          this.isDragging = true;
          this.selection = false;
          this.lastPosX = evt.clientX;
          this.lastPosY = evt.clientY;

          $$(_this.$el)
            .find(".mscursor")
            .addClass("msmoving");
        }
      });
      canvas.on("mouse:move", function(opt) {
        var e = opt.e;
        if (this.isDragging) {
          this.viewportTransform[4] += e.clientX - this.lastPosX;
          this.viewportTransform[5] += e.clientY - this.lastPosY;
          this.requestRenderAll();
          this.lastPosX = e.clientX;
          this.lastPosY = e.clientY;
        }

        // if (_this.spaceKeyDown) {
        // 	canvas.defaultCursor = "none";
        // 	_this.banCanvasInteract();
        // }

        _this.logtxt =
          "111111" + _this.isMousePointInView(opt.e.offsetX, opt.e.offsetY);
      });
      canvas.on("mouse:up", function(opt) {
        if (this.isDragging) {
          this.isDragging = false;
          this.selection = true;
          _this.initialCanvasShow();
        }

        $$(_this.$el)
          .find(".mscursor")
          .removeClass("msmoving");
      });

      this.objScrollX = $$(_this.$el).find(".ms-mid-scrollx");
      this.objScrollY = $$(_this.$el).find(".ms-mid-scrolly");

      //var resetObjectPosition =null;

      canvas.on("mouse:wheel", function(opt) {
        var evt = opt.e;
        var deltaX = opt.e.deltaX,
          deltaY = opt.e.deltaY;
        var pointer = canvas.getPointer(opt.e);
        var center = canvas.getCenter();
        if (evt.altKey === true) {
          var zoom = canvas.getZoom();
          var zlHeight =
              Math.round(
                _this.sliderCanvasParentH /
                  _this.$store.state.curPage.viewCanvasHeight *
                  10000
              ) / 10000,
            zlWidth =
              Math.round(
                _this.sliderCanvasParentW /
                  _this.$store.state.curPage.viewCanvasWidth *
                  10000
              ) / 10000;
          zoom = zoom - _this.curzoom * deltaY / 200;
          if (zoom > 100) zoom = 100;
          if (zoom < Math.min(0.01, zlHeight, zlWidth))
            zoom = Math.min(0.01, zlHeight, zlWidth);

          if (_this.isMousePointInView(opt.e.offsetX, opt.e.offsetY)) {
            canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);

            _this.isWheelScaleState = "point";
          } else {
            _this.canvasZoomCenter(zoom);
            _this.isWheelScaleState = "center";
          }

          _this.curzoom = zoom;
          _this.showsSroll = false;

          clearTimeout(_this.resetObjectPositionLag);
          _this.resetObjectPositionLag = setTimeout(function() {
            canvas.forEachObject(function(obj) {
              obj.setCoords();
            });
          }, 200);
        } else {
          if (!_this.showsSroll) {
            canvas.forEachObject(function(obj) {
              obj.setCoords();
            });
            opt.e.preventDefault();
            opt.e.stopPropagation();
            return;
          }
          var e = opt.e;

          _this.objScrollX.scrollLeft(
            _this.objScrollX.scrollLeft() + Math.max(_this.curzoom, 1) * deltaX
          );
          _this.objScrollY.scrollTop(
            _this.objScrollY.scrollTop() + Math.max(_this.curzoom, 1) * deltaY
          );
        }

        opt.e.preventDefault();
        opt.e.stopPropagation();
      });

      fabric.Object.prototype.cornerStyle = "circle";
      fabric.Object.prototype.cornerSize = 11;
      fabric.Object.prototype.padding = 0;
      fabric.Object.prototype.rotatingPointOffset = 32;
      fabric.Object.prototype.cornerColor = "#fff";
      fabric.Object.prototype.cornerStrokeColor = "#969696";
      fabric.Object.prototype.borderColor = "#969696";
      fabric.Object.prototype.transparentCorners = false;
      fabric.Object.prototype.perPixelTargetFind = true;
      fabric.Object.prototype.borderOpacityWhenMoving = 0.1;

      this.initAligningGuidelines(canvas);
      this.iniAxisLines(canvas);
      // create a rectangle object

      _this.msCanvasLoading = true;

      _this.refreshPageObjects();

      _this.curzoom = 1;

      // var rect = new fabric.Rect({
      //   id:"11",
      //   left: 100,
      //   top: 100,
      //   fill: 'orange',
      //   width: 20,
      //   height: 20
      // });

      // var rect1 = new fabric.Rect({
      // 	id:"12",
      //   left: 100,
      //   top: 200,
      //   fill: 'blue',
      //   width: 100,
      //   height: 20
      // });

      // var rect2 = new fabric.Rect({
      // 	id:"13",
      //   left: 100,
      //   top: 200,
      //   fill: 'red',
      //   width: 100,
      //   height: 70
      // });

      // for(var i=0 ;i<1000; i++){
      // 	var eee = new fabric.Rect({
      // 	  left: 1000*Math.random(),
      // 	  top: 2000*Math.random(),
      // 	  fill: 'black',
      // 	  width: 320*Math.random(),
      // 	  height: 140**Math.random(),
      // 	});
      // 	canvas.add(eee);
      // }
      // var rect3 = new fabric.Rect({
      // 	id:"14",
      //   left: 100,
      //   top: 200,
      //   fill: 'black',
      //   width: 120,
      //   height: 40
      // });

      // var text = new fabric.IText('大神学python', {
      // 	left: 100,
      // 	top: 100,
      // 	id:"text1" ,
      // 	perPixelTargetFind :false,
      // });

      // var x = text.cloneAsImage(function(img){
      // 	console.log(img);
      // 	canvas.add(img);
      // }, { enableRetinaScaling:true,id:"15", });

      // canvas.add(text);
      // canvas.add(rect);
      // canvas.add(rect1);
      // canvas.add(rect2);
      // canvas.add(rect3);

      this.componentItemType = 1;

      setTimeout(function() {
        _this.msComponentListLeft = $$(_this.$el)
          .find(".ms-component-list")
          .width();
      }, 0);

      var resizeSetTimeOut = null;
      window.onresize = function() {
        clearTimeout(resizeSetTimeOut);
        resizeSetTimeOut = setTimeout(function() {
          _this.allResize();
        }, 100);
      };

      _this.fullscreenFitZoom();
    },
    drawObjectOnCanvas: function(objects, canvas, type) {
      var _this = this;
      if (objects == null || objects.length == 0) {
        return;
      }

      objects.sort(function(a, b) {
        if (a.mszIndex > b.mszIndex) {
          return 1;
        } else {
          return -1;
        }
      });

      for (var i = 0; i < objects.length; i++) {
        var o = objects[i];
        if (!o || !o.type) {
          continue;
        }
        if (o.type == "msLine") {
          if (type == "c") {
            o.x1 = o.x1 + _this.viewOriginX;
            o.y1 = o.y1 + _this.viewOriginY;
            o.x2 = o.x2 + _this.viewOriginX;
            o.y2 = o.y2 + _this.viewOriginY;
          } else if (type == "p") {
            o = $.extend(true, {}, o);
          }

          var line = new _this.msLineClass(o);
          canvas.add(line);
        } else if (o.type == "msImage") {
          if (type == "c") {
            o.left = o.left + _this.viewOriginX;
            o.top = o.top + _this.viewOriginY;
          }

          var imgeset = o;
          fabric.Image.fromURL(o.src, function(img) {
            var image = new _this.msImageClass(imgeset, img);
            canvas.add(image);
          });
        } else {
          if (type == "c") {
            o.left = o.left + _this.viewOriginX;
            o.top = o.top + _this.viewOriginY;
          }
          var klass = fabric.util.getKlass(o.type);
          klass.fromObject(o, function(obj, error) {
            canvas.add(obj);
          });
        }
      }
    },
    refreshPageObjects: function(force) {
      var _this = this;
      if (force) {
        force = false;
      }
      if (
        this.$store.state.curPage.pageId == null ||
        _this.sliderCanvas == null ||
        force
      ) {
        return;
      }
      _this.sliderCanvas.clear();
      _this.sliderCanvas.renderOnAddRemove = false;

      var objects = $$.extend(true, [], this.$store.state.curPage.objects);

      _this.viewOriginX = _this.sliderCanvasParentW - _this.showMin;
      _this.viewOriginY = _this.sliderCanvasParentH - _this.showMin;

      _this.drawObjectOnCanvas(objects, _this.sliderCanvas, "c");

      var viewH = _this.$store.state.curPage.viewCanvasHeight,
        viewW = _this.$store.state.curPage.viewCanvasWidth;
      _this.showviewportBorder = new fabric.Rect({
        left: _this.viewOriginX,
        top: _this.viewOriginY,
        fill: "#ffffff",
        evented: false,
        selectable: false,
        excludeFromExport: true,
        // width: viewW > _this.sliderCanvasParentW?viewW:_this.sliderCanvasParentW,
        // height: viewH > _this.sliderCanvasParentH?viewH:_this.sliderCanvasParentH,
        width: viewW,
        height: viewH,
        shadow: new fabric.Shadow("0px 0px 10px rgba(0,0,0,0.5)")
      });

      _this.showviewport = new fabric.Rect({
        //top:-this.sliderCanvasParentH/2 + 20,
        evented: false,
        top: -viewH / 2,
        left: -viewW / 2,
        width: viewW,
        height: viewH
      });

      //_this.showviewportBorder.clipPath = _this.showviewport;
      _this.sliderCanvas.add(_this.showviewportBorder);
      _this.showviewportBorder.sendToBack();

      //_this.msCanvasLoading = false;

      _this.sliderCanvas.renderOnAddRemove = true;
    },
    fullscreenFitZoom: function() {
      var _this = this,
        zoomX =
          _this.sliderCanvasParentW /
          _this.$store.state.curPage.viewCanvasWidth,
        zoomY =
          _this.sliderCanvasParentH /
          _this.$store.state.curPage.viewCanvasHeight;

      var zoom = Math.min(zoomX, zoomY);
      // if(zoomX>=1 && zoomY>=1){

      // }
      // else{
      // 	zoom = Math.min(zoomX<1?Infinity:zoomX, zoomY<1?Infinity:zoomY);

      // }
      zoom = 0.92 * Math.floor(zoom * 1000) / 1000;
      if (zoom < 1.2 && zoomX >= 1 && zoomY >= 1) {
        _this.msCanvasLoading = false;
        return;
      }
      _this.canvasZoomCenter(zoom);
      _this.curzoom = zoom;

      setTimeout(function() {
        _this.initialCanvasShow(
          (_this.scrollWidth - _this.sliderCanvasParentW) / 2,
          (_this.scrollHeight - _this.sliderCanvasParentH) / 2
        );
        _this.sliderCanvas.forEachObject(function(obj) {
          obj.setCoords();
          _this.msCanvasLoading = false;
        });
      }, 0);
    },
    canvasZoomCenter: function(zoom) {
      var _this = this,
        param = _this.calMoveParam(),
        canvas = _this.sliderCanvas;
      var x = (_this.scrollWidth - _this.sliderCanvasParentW) / 2,
        y = (_this.scrollHeight - _this.sliderCanvasParentH) / 2;
      canvas.viewportTransform[4] = param.moveLimitX - x;
      canvas.viewportTransform[5] = param.moveLimitY - y;
      canvas.requestRenderAll();
      canvas.zoomToPoint(
        { x: _this.sliderCanvasParentW / 2, y: _this.sliderCanvasParentH / 2 },
        zoom
      );
    },
    zoomFixShow: function() {
      var curzoom = this.curzoom;
      if (curzoom >= 100) {
        return curzoom.toFixed(1);
      } else if (curzoom >= 10) {
        return curzoom.toFixed(2);
      } else {
        return (curzoom * 100).toFixed(0) + "%";
      }
      // else{
      // 	return curzoom==null?"1.0":curzoom<1?curzoom.toFixed(3):curzoom.toFixed(2);
      // }
    },
    functionButtonClick: function(controller, e) {
      alert(controller);
    },
    getRandomPosition: function(type) {
      var _this = this,
        center = _this.getViewAbsoluteXY();

      return {
        left: center.width / 2,
        top: center.height / 2
      };
    },
    addObjectsByType: function(type, addAfterHanddle) {
      var _this = this;
      var objects = _this.$store.state.objectPrototype;
      var ob = null,
        key = null,
        point = { x: 0, y: 0 };
      if (type == "text" || type == "singleText") {
        ob = $.extend(true, {}, objects["singleText"]);
        key = _this.generateRandomKey("itext");
        point = _this.getRandomPosition("i-text");
        point.left = point.left + _this.viewOriginX;
        point.top = point.top + _this.viewOriginY;
        ob.text = "单行文本";
      } else if (type == "multiText") {
        ob = $.extend(true, {}, objects["multiText"]);
        key = _this.generateRandomKey("textBox");
        point = _this.getRandomPosition("textBox");
        point.left = point.left + _this.viewOriginX;
        point.top = point.top + _this.viewOriginY;
        ob.text = "多行文本";
      } else if (type == "rectShape") {
        ob = $.extend(true, {}, objects["rect"]);
        key = _this.generateRandomKey("rect");
        point = _this.getRandomPosition("rect");
        point.left = point.left + _this.viewOriginX;
        point.top = point.top + _this.viewOriginY;
      } else if (type == "circleShape") {
        ob = $.extend(true, {}, objects["ellipse"]);
        key = _this.generateRandomKey("ellipse");
        point = _this.getRandomPosition("ellipse");
        point.left = point.left + _this.viewOriginX;
        point.top = point.top + _this.viewOriginY;
      } else if (type == "triangleShape") {
        ob = $.extend(true, {}, objects["triangle"]);
        key = _this.generateRandomKey("triangle");
        point = _this.getRandomPosition("triangle");
        point.left = point.left + _this.viewOriginX;
        point.top = point.top + _this.viewOriginY;
      } else if (type == "lineShape") {
        ob = $.extend(true, {}, objects["line"]);
        key = _this.generateRandomKey("line");
        point = _this.getRandomPosition("line");
        ob.x1 = point.left + _this.viewOriginX;
        ob.y1 = point.top + _this.viewOriginY;
        ob.x2 = point.left + _this.viewOriginX + 100;
        ob.y2 = point.top + _this.viewOriginY + 50;
        var line = new _this.msLineClass(ob);
        _this.sliderCanvas.add(line);
        return;
      } else if (type == "defaultImage") {
        ob = $.extend(true, {}, objects["imgae"]);
        key = _this.generateRandomKey("imgae");
        point = _this.getRandomPosition("imgae");
        ob.left = point.left + _this.viewOriginX;
        ob.top = point.top + _this.viewOriginY;

        var imgeset = ob;
        fabric.Image.fromURL(ob.src, function(img) {
          imgeset.width = img.width;
          imgeset.height = img.height;
          var image = new _this.msImageClass(imgeset, img);
          _this.sliderCanvas.add(image);
        });
        return;
      } else if (type == "image") {
        ob = $.extend(true, {}, objects["imgae"]);
        key = _this.generateRandomKey("imgae");
        point = _this.getRandomPosition("imgae");
        ob.left = point.left + _this.viewOriginX;
        ob.top = point.top + _this.viewOriginY;
        ob.src = "ade.png";

        var imgeset = ob;
        fabric.Image.fromURL(ob.src, function(img) {
          imgeset.width = img.width;
          imgeset.height = img.height;
          var image = new _this.msImageClass(imgeset, img);
          _this.sliderCanvas.add(image);
        });
        return;
      } else if (type == "illustrationImage") {
        ob = $.extend(true, {}, objects["imgae"]);
        key = _this.generateRandomKey("imgae");
        point = _this.getRandomPosition("imgae");
        ob.left = point.left + _this.viewOriginX;
        ob.top = point.top + _this.viewOriginY;
        ob.src = "ade.png";
        ob.filters.push({
          type: "Invert",
          invert: true
        });

        var imgeset = ob;
        fabric.Image.fromURL(ob.src, function(img) {
          imgeset.width = img.width;
          imgeset.height = img.height;
          var image = new _this.msImageClass(imgeset, img);
          _this.sliderCanvas.add(image);
        });
        return;
      }

      ob.msItemID = key;
      ob.left = point.left;
      ob.top = point.top;
      ob.mszIndex = _this.sliderCanvas.getObjects().length;
      var klass = fabric.util.getKlass(ob.type);
      klass.fromObject(ob, function(obj, error) {
        _this.sliderCanvas.add(obj);
        _this.sliderCanvas.setActiveObject(obj);
        if (typeof addAfterHanddle == "function") {
          addAfterHanddle(obj);
        }
      });
    },
    componentButtonClick: function(controller) {
      var _this = this;
      if (controller == "text") {
        _this.addObjectsByType("text");
      } else if (controller == "singleText") {
        _this.addObjectsByType("singleText");
      } else if (controller == "multiText") {
        _this.addObjectsByType("multiText");
      } else if (controller == "shape") {
        _this.addObjectsByType("rectShape");
      } else if (controller == "rectShape") {
        _this.addObjectsByType("rectShape");
      } else if (controller == "circleShape") {
        _this.addObjectsByType("circleShape");
      } else if (controller == "triangleShape") {
        _this.addObjectsByType("triangleShape");
      } else if (controller == "lineShape") {
        _this.addObjectsByType("lineShape");
      } else if (controller == "image") {
        _this.addObjectsByType("image");
      } else if (controller == "defaultImage") {
        _this.addObjectsByType("defaultImage");
      } else if (controller == "illustrationImage") {
        _this.addObjectsByType("illustrationImage");
      } else {
        alert(controller);
      }

      //alert(controller);
    },
    banCanvasInteract: function(state) {
      if (state == null) {
        state = false;
      }
      //console.log(state);
      this.sliderCanvas.interactive = state;
      this.sliderCanvas.selection = state;
      this.sliderCanvas.selectable = state;
      // this.sliderCanvas.forEachObject(function(object,x,x1){
      // 	object.set("selectable", state);
      // });
      this.sliderCanvas.renderAll();
    },
    allResize: function() {
      var _this = this;

      var scrollLeftOld = _this.objScrollX.scrollLeft(),
        scrollTopOld = _this.objScrollY.scrollTop();

      var $parent = $$(_this.$el)
        .find(".ms-mid")
        .get(0);
      var oldPcH = _this.sliderCanvasParentH;
      var oldPcW = _this.sliderCanvasParentW;
      _this.sliderCanvasParentH = $parent.clientHeight;
      _this.sliderCanvasParentW = $parent.clientWidth;

      //console.log($parent.clientHeight);
      //alert($parent.clientWidth + ":" + $parent.clientHeight);
      //console.log(_this.sliderCanvasParentW,_this.sliderCanvasParentH);
      _this.sliderCanvas.setWidth(_this.sliderCanvasParentW);
      _this.sliderCanvas.setHeight(_this.sliderCanvasParentH);

      _this.fixResizeX = _this.sliderCanvasParentW - this.iniResizeX;

      _this.fixResizeY = _this.sliderCanvasParentH - this.iniResizeY;

      // _this.sliderCanvas.setZoom(_this.curzoom);

      // _this.showviewportBorder.set("width", _this.$store.state.curPage.viewCanvasWidth > _this.sliderCanvasParentW?_this.$store.state.curPage.viewCanvasWidth:_this.sliderCanvasParentW);
      // _this.showviewportBorder.set("height", _this.$store.state.curPage.viewCanvasHeight > _this.sliderCanvasParentH?_this.$store.state.curPage.viewCanvasHeight:_this.sliderCanvasParentH);

      _this.calScrollSize();
      //_this.initialCanvasShow(0, 0);
      _this.initialCanvasShow(
        Math.round(scrollLeftOld * _this.sliderCanvasParentW / oldPcW),
        Math.round(scrollTopOld * _this.sliderCanvasParentH / oldPcH)
      );

      _this.msComponentListLeft = $$(_this.$el)
        .find(".ms-component-list")
        .width();

      setTimeout(function() {
        _this.refreshPageObjects(true);
      }, 200);
    },
    changeLeftSlider: function(e) {
      var _this = this;
      var lastPosX = e.clientX;

      var target = e.currentTarget,
        offset = $$(target).offset().left;
      var paddingX = e.pageX - offset;

      lastPosX = offset;

      _this.msLeftWidthAux = _this.msLeftWidth;
      _this.msLeftWidthAuxShow = true;
      $$(document).css("cursor", "col-resize");

      $$(document).on("mousemove.changeLeftSlider", function(e) {
        var changesize = e.clientX - lastPosX;

        var leftWidth = _this.msLeftWidthAux + changesize;
        if (leftWidth < 190 || lastPosX < 190) {
          //console.log(changesize,leftWidth);
          leftWidth = 190;
        }

        _this.msLeftWidthAux = leftWidth;
        lastPosX = e.clientX;
      });

      $$(document).on("mouseup.changeLeftSlider", function(e) {
        $$(document)
          .off(".changeLeftSlider")
          .css("cursor", "auto");
        _this.msLeftWidth = _this.msLeftWidthAux;
        _this.msLeftWidthAuxShow = false;
        setTimeout(function() {
          _this.allResize();
        }, 0);
      });
    },
    changeAnimationSlider: function(e) {
      var _this = this;
      var lastPosY = e.clientY;

      var target = e.currentTarget,
        offset = $$(target).offset().top;
      var paddingY = e.pageY - offset;

      lastPosY = offset;

      _this.msAniHeightAux = _this.msViewHeight;
      _this.msAniHeightAuxShow = true;
      $$(document).css("cursor", "row-resize");

      $$(document).on("mousemove.changeAniSlider", function(e) {
        var changesize = e.clientY - lastPosY;

        var topHeight = _this.msAniHeightAux - changesize;
        console.log(lastPosY);
        if (topHeight < 250 || lastPosY > $(window).height() - 250) {
          topHeight = 250;
        }

        _this.msAniHeightAux = topHeight;
        lastPosY = e.clientY;
      });

      $$(document).on("mouseup.changeAniSlider", function(e) {
        $$(document)
          .off(".changeAniSlider")
          .css("cursor", "auto");
        _this.msViewHeight = _this.msAniHeightAux;
        _this.msAniHeightAuxShow = false;
        setTimeout(function() {
          _this.allResize();
          _this.$refs.animation.setTimeLines();
        }, 0);
      });
    },
    createGuide: function(type, e) {
      var _this = this;
      var lastPosX = e.clientX;
      var lastPosY = e.clientY;

      var offset = 0,
        target = e.currentTarget;
      if (type == "h") {
        offset = $$(target).offset().top;
      } else {
        offset = $$(target).offset().left;
      }
      var paddingX = e.pageX - offset,
        paddingY = e.pageY - offset;

      lastPosX = offset;
      lastPosY = offset;

      console.log(offset, paddingX, paddingY);

      _this.guideType = type;
      _this.guidePos = 0;

      $$(document).on("mousemove.createGuide", function(e) {
        if (type == "h") {
          _this.guidePos += e.clientY - lastPosY;
        } else {
          _this.guidePos += e.clientX - lastPosX;
        }

        //console.log(_this.guidePos);

        lastPosX = e.clientX;
        lastPosY = e.clientY;
      });

      $$(document).on("mouseup.createGuide", function(e) {
        $$(document).off(".createGuide");

        _this.createGuideLine(_this.guideType, _this.guidePos);

        _this.guideType = null;
        _this.guidePos = null;
      });
    },
    createGuideLine: function(type, pos) {
      var left, top, width, height;
      var _this = this;
      var center = _this.sliderCanvas.getCenter();
      var allWidth = Math.max(
        _this.sliderCanvasParentW * 2 +
          _this.$store.state.curPage.viewCanvasWidth,
        100000
      );
      var allHeight = Math.max(
        _this.sliderCanvasParentH * 2 +
          _this.$store.state.curPage.viewCanvasHeight,
        100000
      );
      var lockX = false,
        lockY = false,
        moveCursor;
      var guideWidth = 10;
      var guideLinesColor = _this.$store.state.curPage.guideLinesColor;
      guideLinesColor = guideLinesColor == null ? "#00ffff" : guideLinesColor;
      if (type == "h") {
        lockX = true;
        // x1 = center.left - width;
        // x2 = center.left + width;
        // y1 = y2 = pos;
        left = center.left - allWidth;
        top = pos;
        width = allWidth * 2;
        height = 1;
        moveCursor = "n-resize";
      } else {
        lockY = true;
        left = pos;
        top = center.top - allHeight;
        width = 1;
        height = allHeight * 2;
        // y1 = center.top - height;
        // y2 = center.top + height;
        // x1 = x2 = pos;
        moveCursor = "w-resize";
      }

      var m = _this.transformPoint(left, top);

      var line = new fabric.Rect(
        // [m1.x,m1.y,m2.x,m2.y],
        {
          left: m.x - guideWidth / 2,
          top: m.y - guideWidth / 2,
          width: width,
          height: height,
          fill: guideLinesColor,
          stroke: "rgba(255,255,255,0.01)",
          strokeWidth: guideWidth,
          borderColor: "transparent",
          lockMovementX: lockX,
          lockMovementY: lockY,
          lockRotation: true,
          lockScalingX: true,
          lockScalingY: true,
          perPixelTargetFind: false,
          hasControls: false,
          hasBorder: false,
          moveCursor: moveCursor,
          hoverCursor: moveCursor,
          opacity: 0.8,
          msType: "guidelines",
          msGuideDirection: type
        }
      );
      _this.sliderCanvas.add(line);
    },
    calScrollSize: function() {
      this.scrollWidth =
        this.sliderCanvasParentW * 2 +
        this.$store.state.curPage.viewCanvasWidth * this.curzoom -
        2 * this.showMin;
      this.scrollHeight =
        this.sliderCanvasParentH * 2 +
        this.$store.state.curPage.viewCanvasHeight * this.curzoom -
        2 * this.showMin;

      //console.log(this.scrollWidth, this.scrollHeight);

      // if(this.curPage.viewCanvasWidth > this.sliderCanvasParentW){
      //    	this.scrollWidth -= 2*(this.sliderCanvas.getCenter().left+this.viewFixScrollLeft) * (this.curzoom);
      //    }

      //    if(this.curPage.viewCanvasHeight > this.sliderCanvasParentH){
      //    	this.scrollHeight -= 2*(this.sliderCanvas.getCenter().top+this.viewFixScrollTop) * (this.curzoom);
      //    }
    },
    calTickParam: function(zoom) {
      //space 代表间隔距离px，可以为小数， interval代表10个刻度一格，必须为整数
      //space*interval>=35 and space*interval <=80 and interval<=10
      //space/zoom>=5
      //5 14 2.25
      var intervalSelect = [10, 5, 4, 2, 1],
        is = 0;
      var interval = intervalSelect[is];
      var mid = interval * zoom,
        v = Math.round(50 / mid),
        space = v * zoom;
      while (space < 5 && is < 4 && v < 1) {
        interval = intervalSelect[++is];
        mid = interval * zoom;
        v = Math.round(50 / mid);
        space = v * zoom;
      }

      if (space < 5 && is == 4 && v < 1) {
        interval = 1;
        mid = interval * zoom;
        v = Math.round(50 / mid);
        space = v * zoom;
      }

      return {
        space: space,
        interval: interval
      };
    },
    getViewAbsoluteXY: function() {
      var _this = this,
        // param = _this.calMoveParam(),
        // center = _this.sliderCanvas.getCenter(),
        // vf = _this.sliderCanvas.viewportTransform,
        // centerfix = fabric.util.transformPoint(new fabric.Point(center.left, center.top), vf),
        // centerLeft = centerfix.x,
        // centerTop = centerfix.y,

        viewCanvasWidth = _this.$store.state.curPage.viewCanvasWidth,
        viewCanvasHeight = _this.$store.state.curPage.viewCanvasHeight,
        viewW = viewCanvasWidth,
        viewH = viewCanvasHeight;

      // if(viewCanvasWidth > this.sliderCanvasParentW){
      // 	centerLeft += (center.left+this.viewFixScrollLeft) * this.curzoom;
      // }

      // if(viewCanvasHeight > this.sliderCanvasParentH){
      // 	centerTop += (center.top+this.viewFixScrollTop) * this.curzoom;
      // }

      return {
        left: _this.viewOriginX,
        right: _this.viewOriginX + viewW,
        top: _this.viewOriginY,
        bottom: _this.viewOriginY + viewH,
        width: viewW,
        height: viewH,
        zoomWidth: viewW * _this.curzoom,
        zoomHeight: viewH * _this.curzoom
      };
    },
    transformPoint: function(x, y, invert) {
      var _this = this;
      if (invert == null) {
        invert = true;
      }
      var vf = _this.sliderCanvas.viewportTransform;
      if (invert) {
        vf = fabric.util.invertTransform(vf);
      }
      var centerfix = fabric.util.transformPoint(new fabric.Point(x, y), vf);

      return {
        x: centerfix.x,
        y: centerfix.y
      };
    },
    isMousePointInView: function(x, y) {
      var _this = this;
      var viewXY = _this.getViewAbsoluteXY();
      var inContainView = false;
      var centerfix = _this.transformPoint(x, y);
      //console.log("viewXY:"+JSON.stringify(viewXY) + ", x:" + x + ", y:" + y + ", centerfix.x:" + centerfix.x + ", centerfix.y:" + centerfix.y);
      x = centerfix.x;
      y = centerfix.y;
      if (
        y > viewXY.top &&
        y < viewXY.bottom &&
        x > viewXY.left &&
        x < viewXY.right
      ) {
        inContainView = true;
      }
      return inContainView;
    },
    calMoveParam: function() {
      var viewCanvasWidth =
          this.$store.state.curPage.viewCanvasWidth * this.curzoom,
        viewCanvasHeight =
          this.$store.state.curPage.viewCanvasHeight * this.curzoom;
      var center = this.sliderCanvas.getCenter();

      // var moveLimitX = (viewCanvasWidth+this.sliderCanvasParentW)/2 - this.showMin;
      // var moveLimitY = (viewCanvasHeight+this.sliderCanvasParentH)/2 -this.showMin;

      // if(this.$store.state.curPage.viewCanvasWidth > this.sliderCanvasParentW){
      // 	moveLimitX -= (center.left+this.viewFixScrollLeft) * this.curzoom;
      // }

      // if(this.$store.state.curPage.viewCanvasHeight > this.sliderCanvasParentH){
      // 	moveLimitY -= (center.top+this.viewFixScrollTop) * this.curzoom;
      // }

      var cl =
          (this.sliderCanvasParentW - this.showMin) * (1 - this.curzoom) -
          this.fixResizeX / this.curzoom,
        ct =
          (this.sliderCanvasParentH - this.showMin) * (1 - this.curzoom) -
          this.fixResizeY / this.curzoom;

      //中心点测试
      //var _this = vueMain.$children[0].$children[0];var zoom = 0.4;var center = _this.sliderCanvas.getCenter();_this.sliderCanvas.viewportTransform = [zoom,0,0,zoom,center.left*(1-zoom),center.left*(1-zoom)  ];_this.sliderCanvas.requestRenderAll();_this.sliderCanvas.forEachObject(function(obj) {obj.setCoords();});

      // console.log("Y",this.viewportTransform[5]-ct,moveLimitY,viewCanvasHeight/2 , _this.sliderCanvasParentH/2);
      // console.log("X",this.viewportTransform[4]-cl,moveLimitX,viewCanvasWidth/2, _this.sliderCanvasParentW/2);
      // console.log("center", JSON.stringify(center), JSON.stringify(vpcenter), _this.curzoom ,canvas.getZoom(), "cl"+cl, "ct"+ct);

      return {
        moveLimitX:
          (this.sliderCanvasParentW - this.showMin) * (1 - this.curzoom),
        moveLimitY:
          (this.sliderCanvasParentH - this.showMin) * (1 - this.curzoom),
        centerFixLeft: 0,
        centerFixTop: 0
      };

      //return {moveLimitX: (this.sliderCanvasParentW-this.showMin)*(1-this.curzoom)+this.fixResizeX*this.curzoom, moveLimitY:(this.sliderCanvasParentH-this.showMin)*(1-this.curzoom)+this.fixResizeY*this.curzoom, centerFixLeft:0, centerFixTop:0};
    },
    initialCanvasShow: function(x, y) {
      var _this = this;
      var scrollOffsetX, scrollOffsetY;
      var param = this.calMoveParam();
      if (x == null) {
        scrollOffsetX =
          param.moveLimitX +
          param.centerFixLeft -
          this.sliderCanvas.viewportTransform[4];
      } else {
        scrollOffsetX = x;
      }

      if (y == null) {
        scrollOffsetY =
          param.moveLimitY +
          param.centerFixTop -
          this.sliderCanvas.viewportTransform[5];
      } else {
        scrollOffsetY = y;
      }

      //  		_this.objScrollX.scrollLeft((_this.scrollWidth - _this.sliderCanvasParentW)/2);
      // _this.objScrollY.scrollTop((_this.scrollHeight - _this.sliderCanvasParentH)/2);

      // console.log("X",param.moveLimitX , param.centerFixLeft,this.sliderCanvas.viewportTransform[4], scrollOffsetX);
      // console.log("Y",param.moveLimitY , param.centerFixTop ,this.sliderCanvas.viewportTransform[5], scrollOffsetY);

      setTimeout(function() {
        //alert(scrollOffsetX+":"+scrollOffsetY);
        _this.objScrollX.scrollLeft(scrollOffsetX);
        _this.objScrollY.scrollTop(scrollOffsetY);
      }, 0);
    },
    pointScrollX: function(e) {
      var target = e.currentTarget;
      var param = this.calMoveParam();
      var _this = this;
      this.sliderCanvas.viewportTransform[4] =
        param.moveLimitX + param.centerFixLeft - $$(target).scrollLeft();
      //console.log("Y",param.moveLimitX , param.centerFixLeft , $$(target).scrollLeft(),this.sliderCanvas.viewportTransform[4]);

      clearTimeout(_this.resetObjectPositionLag);
      _this.resetObjectPositionLag = setTimeout(function() {
        _this.sliderCanvas.forEachObject(function(obj) {
          obj.setCoords();
        });
      }, 200);

      this.sliderCanvas.requestRenderAll();

      //  		setTimeout(function(){
      //     _this.showsSroll = true;
      // }, 0);

      // clearTimeout(_this.showsSrollLag);
      // _this.showsSrollLag = setTimeout(function(){
      // 	_this.showsSroll = false;
      // }, 3000);
    },
    pointScrollY: function(e) {
      var target = e.currentTarget;
      var param = this.calMoveParam();
      var _this = this;
      this.sliderCanvas.viewportTransform[5] =
        param.moveLimitY + param.centerFixTop - $$(target).scrollTop();
      //console.log(param.moveLimitY , param.centerFixTop , $$(target).scrollTop());
      //console.log("X",param.moveLimitY , param.centerFixTop , $$(target).scrollTop(),this.sliderCanvas.viewportTransform[5]);
      //alert(this.sliderCanvas.viewportTransform[5]);
      clearTimeout(_this.resetObjectPositionLag);
      _this.resetObjectPositionLag = setTimeout(function() {
        _this.sliderCanvas.forEachObject(function(obj) {
          obj.setCoords();
        });
      }, 200);

      this.sliderCanvas.requestRenderAll();

      //  		setTimeout(function(){
      //     _this.showsSroll = true;
      // }, 0);
    },
    iniAxisLines: function(canvas) {
      var _this = this,
        context = canvas.getSelectionContext(),
        TICK_WIDTH = 8, //刻度的长度
        TICKS_LINEWIDTH = 0.5,
        TICKS_COLOR = "#2A2A2A";
      function drawVerticalAxisTicks(start, end, space, interval, zoom) {
        var deltaX;
        var TICKS = Math.abs(end - start) / space;

        if (start < end) {
          for (var i = 0; i < TICKS; i++) {
            context.beginPath();
            if (i % interval === 0) {
              deltaX = TICK_WIDTH;
              context.moveTo(0, space * i + start);
              context.lineTo(TICK_WIDTH, space * i + start);
              context.textAlign = "left";
              context.font =
                'normal normal normal 6pt  "Microsoft YaHei",宋体, "Helvetica Neue", Helvetica, Arial';
              context.fillText(
                Math.round(i * space / zoom),
                TICK_WIDTH - 4,
                space * i - 3 + start
              );
            } else if (interval == 10 && i % 5 === 0) {
              deltaX = TICK_WIDTH / 2 + 2;
            } else {
              deltaX = TICK_WIDTH / 2;
            }
            context.moveTo(0, i * space + start);
            context.lineTo(deltaX, i * space + start);
            context.stroke();
          }
        } else {
          for (var i = 1; i < TICKS; i++) {
            context.beginPath();
            if (i % interval === 0) {
              deltaX = TICK_WIDTH;
              context.moveTo(0, start - space * i);
              context.lineTo(TICK_WIDTH, start - space * i);
              context.textAlign = "left";
              context.font =
                'normal normal normal 6pt  "Microsoft YaHei",宋体, "Helvetica Neue", Helvetica, Arial';
              context.fillText(
                "-" + Math.round(i * space / zoom),
                TICK_WIDTH - 2,
                start - space * i - 3
              );
            } else if (interval == 10 && i % 5 === 0) {
              deltaX = TICK_WIDTH / 2 + 2;
            } else {
              deltaX = TICK_WIDTH / 2;
            }
            context.moveTo(0, start - i * space);
            context.lineTo(deltaX, start - i * space);
            context.stroke();
          }
        }
      }
      function drawHorizontalAxisTicks(start, end, space, interval, zoom) {
        var deltaY;
        var TICKS = Math.abs(end - start) / space;

        if (start < end) {
          for (var i = 0; i < TICKS; i++) {
            context.beginPath();
            if (i % interval === 0) {
              deltaY = TICK_WIDTH;
              context.moveTo(space * i + start, 0);
              context.lineTo(space * i + start, TICK_WIDTH);
              context.textAlign = "left";
              context.font =
                'normal normal normal 6pt  "Microsoft YaHei",宋体, "Helvetica Neue", Helvetica, Arial';
              context.fillText(
                Math.round(i * space / zoom),
                3 + space * i + start,
                TICK_WIDTH + 5
              );
            } else if (interval == 10 && i % 5 === 0) {
              deltaY = TICK_WIDTH / 2 + 2;
            } else {
              deltaY = TICK_WIDTH / 2;
            }
            context.moveTo(i * space + start, 0);
            context.lineTo(i * space + start, deltaY);
            context.stroke();
          }
        } else {
          for (var i = 1; i < TICKS; i++) {
            context.beginPath();
            if (i % interval === 0) {
              deltaY = TICK_WIDTH;
              context.moveTo(start - space * i, 0);
              context.lineTo(start - space * i, TICK_WIDTH);
              context.textAlign = "left";
              context.font =
                'normal normal normal 6pt  "Microsoft YaHei",宋体, "Helvetica Neue", Helvetica, Arial';
              context.fillText(
                "-" + Math.round(i * space / zoom),
                start - (3 + space * i),
                TICK_WIDTH + 5
              );
            } else if (interval == 10 && i % 5 === 0) {
              deltaY = TICK_WIDTH / 2 + 2;
            } else {
              deltaY = TICK_WIDTH / 2;
            }
            context.moveTo(start - i * space, 0);
            context.lineTo(start - i * space, deltaY);
            context.stroke();
          }
        }
      }

      function drawAxes() {
        var center = canvas.getCenter(),
          vf = canvas.viewportTransform,
          viewXY = _this.getViewAbsoluteXY(),
          centerfix = _this.transformPoint(viewXY.left, viewXY.top, false),
          zeroPoint = { x: centerfix.x, y: centerfix.y };
        context.save();

        context.lineWidth = TICKS_LINEWIDTH;
        context.strokeStyle = TICKS_COLOR;

        var tickParam = _this.calTickParam(_this.curzoom);

        var space = tickParam.space,
          interval = tickParam.interval;
        //_this.logtxt = "space:" + space + ", interval:" + interval + ", zoom:" + _this.curzoom + ", space/zoom:" + space/_this.curzoom + ", space*interval:" + space*interval;
        drawVerticalAxisTicks(
          zeroPoint.y,
          _this.sliderCanvasParentH,
          space,
          interval,
          _this.curzoom
        );
        drawVerticalAxisTicks(zeroPoint.y, 0, space, interval, _this.curzoom);

        drawHorizontalAxisTicks(
          zeroPoint.x,
          _this.sliderCanvasParentW,
          space,
          interval,
          _this.curzoom
        );
        drawHorizontalAxisTicks(zeroPoint.x, 0, space, interval, _this.curzoom);
        context.restore();
      }

      canvas.on("before:render", function() {
        if (_this.axisControllOn && _this.$store.state.curPage.axisOn) {
          canvas.clearContext(canvas.contextTop);
        }
      });

      canvas.on("after:render", function() {
        if (_this.axisControllOn && _this.$store.state.curPage.axisOn) {
          drawAxes();
        }
      });
    },
    drawLine: function(ctx, x1, y1, x2, y2, width, style) {
      var _this = this;
      var vt = _this.sliderCanvas.viewportTransform;

      ctx.save();
      ctx.lineWidth = width;
      ctx.strokeStyle = style;

      ctx.beginPath();
      var m1 = fabric.util.transformPoint(new fabric.Point(x1, y1), vt);
      var m2 = fabric.util.transformPoint(new fabric.Point(x2, y2), vt);
      ctx.moveTo(m1.x, m1.y);
      ctx.lineTo(m2.x, m2.y);
      ctx.stroke();
      ctx.restore();
    },
    initAligningGuidelines: function(canvas) {
      var ctx = canvas.getSelectionContext(),
        aligningLineOffset = 3,
        aligningLineMargin = 2,
        aligningLineWidth = 1,
        aligningLineColor = "rgb(0,255,0)",
        isScaleLineColor = "#EAEA2F",
        viewportTransform,
        zoom = 1,
        _this = this,
        param;

      function drawVerticalLine(coords) {
        var lineWidth = aligningLineWidth;
        var strokeStyle;
        if (coords.isScale) {
          strokeStyle = isScaleLineColor;
        } else {
          strokeStyle = aligningLineColor;
        }

        _this.drawLine(
          ctx,
          coords.x + 0.5,
          coords.y1 > coords.y2 ? coords.y2 : coords.y1,
          coords.x + 0.5,
          coords.y2 > coords.y1 ? coords.y2 : coords.y1,
          lineWidth,
          strokeStyle
        );
      }

      function drawHorizontalLine(coords) {
        //_this.logtxt = JSON.stringify([coords.x1, coords.y, coords.x2, coords.y]);
        var lineWidth = aligningLineWidth;
        var strokeStyle;
        if (coords.isScale) {
          strokeStyle = isScaleLineColor;
        } else {
          strokeStyle = aligningLineColor;
        }

        _this.drawLine(
          ctx,
          coords.x1 > coords.x2 ? coords.x2 : coords.x1,
          coords.y + 0.5,
          coords.x2 > coords.x1 ? coords.x2 : coords.x1,
          coords.y + 0.5,
          lineWidth,
          strokeStyle
        );
      }

      function isInRange(value1, value2, isScale, type) {
        value1 = Math.round(value1);
        value2 = Math.round(value2);
        var margin = aligningLineMargin;
        if (isScale) {
          margin = 1;
        }

        if (type == "matrix") {
          margin = 4;
        } else if (type == "guidelines") {
          margin = 8;
        } else if (type == "center") {
          margin = 4;
        }

        for (var i = value1 - margin, len = value1 + margin; i <= len; i++) {
          if (i === value2) {
            return true;
          }
        }
        return false;
      }

      function setPosition(activeObject, Point, isScale) {
        if (isScale) {
          return;
        }
        activeObject.setPositionByOrigin(Point, "center", "center");
      }

      function createGuideLine(e, isScale) {
        if (!isScale) {
          isScale = false;
        }

        var activeObject = e.target,
          canvasObjects = canvas.getObjects(),
          activeObjectCenter = activeObject.getCenterPoint(),
          activeObjectLeft = activeObjectCenter.x,
          activeObjectTop = activeObjectCenter.y,
          activeObjectBoundingRect = activeObject.getBoundingRect(),
          activeObjectHeight =
            activeObjectBoundingRect.height / viewportTransform[3],
          activeObjectWidth =
            activeObjectBoundingRect.width / viewportTransform[0],
          horizontalInTheRange = false,
          verticalInTheRange = false,
          transform = canvas._currentTransform;

        // _this.logtxt = "activeObjectLeft:" + activeObjectLeft + ", activeObjectTop:" + activeObjectTop + ", activeObjectBoundingRect:" + JSON.stringify(activeObjectBoundingRect) + ", scaleX:" + JSON.stringify(e.transform.newScaleX) + ", scaleY:" + JSON.stringify(e.transform.newScaleY);

        if (activeObject.msType == "guidelines") {
          return;
        }

        if (isScale) {
          if (e.transform.action == "scale" || e.transform.action == "scaleY") {
            activeObjectHeight =
              activeObjectHeight * e.transform.newScaleY / e.transform.scaleY;
          }

          if (e.transform.action == "scale" || e.transform.action == "scaleX") {
            activeObjectWidth =
              activeObjectWidth * e.transform.newScaleX / e.transform.scaleX;
          }

          //   	var circle = new fabric.Circle({
          //   radius: 4, fill: '#'+Math.floor(Math.random()*256).toString(10), left: activeObjectLeft, top: activeObjectTop
          // });
          // var rect = new fabric.Rect({
          //   left: activeObjectLeft,
          //   top: activeObjectTop,
          //   fill: '#'+Math.floor(Math.random()*256).toString(10),
          //   width: activeObjectWidth,
          //   height: activeObjectHeight,
          //   originX:"center",
          //   originY:"center"
          // });
          // canvas.add(circle, rect);
        }

        if (!transform) return;

        //画布居中以及边缘对齐
        var viewXY = _this.getViewAbsoluteXY();
        var objectLeft = viewXY.left + viewXY.width / 2,
          objectTop = viewXY.top + viewXY.height / 2,
          objectHeight = viewXY.height,
          objectWidth = viewXY.width,
          preAdjusted = null;
        //水平位移辅助线生成
        var common = {
          y1: 0,
          y2: _this.scrollHeight + _this.sliderCanvasParentH,
          isScale: isScale
        };
        // snap by the horizontal center line 前者是参照、后者是活动者，水平中中
        if (isInRange(objectLeft, activeObjectLeft, isScale, "center")) {
          verticalInTheRange = true;
          var common1 = $$.extend(true, {}, common);
          common1.x = objectLeft;
          verticalLines.push(common1);
          preAdjusted = objectLeft;
          setPosition(
            activeObject,
            new fabric.Point(preAdjusted, activeObjectTop),
            isScale
          );
        }
        //中左
        if (
          isInRange(
            objectLeft,
            activeObjectLeft - activeObjectWidth / 2,
            isScale,
            "center"
          )
        ) {
          verticalInTheRange = true;
          var common1 = $$.extend(true, {}, common);
          common1.x = objectLeft;
          verticalLines.push(common1);
          preAdjusted = objectLeft + activeObjectWidth / 2;
          setPosition(
            activeObject,
            new fabric.Point(preAdjusted, activeObjectTop),
            isScale
          );
        }
        //中右
        if (
          isInRange(
            objectLeft,
            activeObjectLeft + activeObjectWidth / 2,
            isScale,
            "center"
          )
        ) {
          verticalInTheRange = true;
          var common1 = $$.extend(true, {}, common);
          common1.x = objectLeft;
          verticalLines.push(common1);
          preAdjusted = objectLeft - activeObjectWidth / 2;
          setPosition(
            activeObject,
            new fabric.Point(preAdjusted, activeObjectTop),
            isScale
          );
        }

        // snap by the left edge 前者是参照、后者是活动者，水平左中
        if (
          isInRange(
            objectLeft - objectWidth / 2,
            activeObjectLeft,
            isScale,
            "center"
          )
        ) {
          verticalInTheRange = true;
          var common1 = $$.extend(true, {}, common);
          common1.x = objectLeft - objectWidth / 2;
          verticalLines.push(common1);
          preAdjusted = objectLeft - objectWidth / 2;
          setPosition(
            activeObject,
            new fabric.Point(objectLeft - objectWidth / 2, activeObjectTop),
            isScale
          );
        }
        //左左**
        if (
          isInRange(
            objectLeft - objectWidth / 2,
            activeObjectLeft - activeObjectWidth / 2,
            isScale,
            "center"
          )
        ) {
          verticalInTheRange = true;
          var common1 = $$.extend(true, {}, common);
          common1.x = objectLeft - objectWidth / 2;
          verticalLines.push(common1);
          preAdjusted = objectLeft - objectWidth / 2 + activeObjectWidth / 2;
          setPosition(
            activeObject,
            new fabric.Point(preAdjusted, activeObjectTop),
            isScale
          );
        }
        //左右
        if (
          isInRange(
            objectLeft - objectWidth / 2,
            activeObjectLeft + activeObjectWidth / 2,
            isScale,
            "center"
          )
        ) {
          verticalInTheRange = true;
          var common1 = $$.extend(true, {}, common);
          common1.x = objectLeft - objectWidth / 2;
          verticalLines.push(common1);
          preAdjusted = objectLeft - objectWidth / 2 - activeObjectWidth / 2;
          setPosition(
            activeObject,
            new fabric.Point(preAdjusted, activeObjectTop),
            isScale
          );
        }

        // snap by the right edge 前者是参照、后者是活动者，水平右中
        if (
          isInRange(
            objectLeft + objectWidth / 2,
            activeObjectLeft,
            isScale,
            "center"
          )
        ) {
          verticalInTheRange = true;
          var common1 = $$.extend(true, {}, common);
          common1.x = objectLeft + objectWidth / 2;
          verticalLines.push(common1);
          preAdjusted = objectLeft + objectWidth / 2;
          setPosition(
            activeObject,
            new fabric.Point(preAdjusted, activeObjectTop),
            isScale
          );
        }
        //右左
        if (
          isInRange(
            objectLeft + objectWidth / 2,
            activeObjectLeft - activeObjectWidth / 2,
            isScale,
            "center"
          )
        ) {
          verticalInTheRange = true;
          var common1 = $$.extend(true, {}, common);
          common1.x = objectLeft + objectWidth / 2;
          verticalLines.push(common1);
          preAdjusted = objectLeft + objectWidth / 2 + activeObjectWidth / 2;
          setPosition(
            activeObject,
            new fabric.Point(preAdjusted, activeObjectTop),
            isScale
          );
        }
        //右右
        if (
          isInRange(
            objectLeft + objectWidth / 2,
            activeObjectLeft + activeObjectWidth / 2,
            isScale,
            "center"
          )
        ) {
          verticalInTheRange = true;
          var common1 = $$.extend(true, {}, common);
          common1.x = objectLeft + objectWidth / 2;
          verticalLines.push(common1);
          preAdjusted = objectLeft + objectWidth / 2 - activeObjectWidth / 2;
          setPosition(
            activeObject,
            new fabric.Point(preAdjusted, activeObjectTop),
            isScale
          );
        }

        var common = {
          x1: 0,
          x2: _this.scrollWidth + _this.sliderCanvasParentW,
          isScale: isScale
        };

        // snap by the vertical center line 前者是参照、后者是活动者，垂直中中
        if (isInRange(objectTop, activeObjectTop, isScale, "center")) {
          horizontalInTheRange = true;
          var common1 = $$.extend(true, {}, common);
          common1.y = objectTop;
          horizontalLines.push(common1);
          setPosition(
            activeObject,
            new fabric.Point(
              preAdjusted == null ? activeObjectLeft : preAdjusted,
              objectTop
            ),
            isScale
          );
        }
        //中上
        if (
          isInRange(
            objectTop,
            activeObjectTop - activeObjectHeight / 2,
            isScale,
            "center"
          )
        ) {
          horizontalInTheRange = true;
          var common1 = $$.extend(true, {}, common);
          common1.y = objectTop;
          horizontalLines.push(common1);
          setPosition(
            activeObject,
            new fabric.Point(
              preAdjusted == null ? activeObjectLeft : preAdjusted,
              objectTop + activeObjectHeight / 2
            ),
            isScale
          );
        }
        //中下
        if (
          isInRange(
            objectTop,
            activeObjectTop + activeObjectHeight / 2,
            isScale,
            "center"
          )
        ) {
          horizontalInTheRange = true;
          var common1 = $$.extend(true, {}, common);
          common1.y = objectTop;
          horizontalLines.push(common1);
          setPosition(
            activeObject,
            new fabric.Point(
              preAdjusted == null ? activeObjectLeft : preAdjusted,
              objectTop - activeObjectHeight / 2
            ),
            isScale
          );
        }

        //上中
        if (
          isInRange(
            objectTop - objectHeight / 2,
            activeObjectTop,
            isScale,
            "center"
          )
        ) {
          horizontalInTheRange = true;
          var common1 = $$.extend(true, {}, common);
          common1.y = objectTop - objectHeight / 2;
          horizontalLines.push(common1);
          setPosition(
            activeObject,
            new fabric.Point(
              preAdjusted == null ? activeObjectLeft : preAdjusted,
              objectTop - objectHeight / 2
            ),
            isScale
          );
        }
        // snap by the top edge 上上
        if (
          isInRange(
            objectTop - objectHeight / 2,
            activeObjectTop - activeObjectHeight / 2,
            isScale,
            "center"
          )
        ) {
          horizontalInTheRange = true;
          var common1 = $$.extend(true, {}, common);
          common1.y = objectTop - objectHeight / 2;
          horizontalLines.push(common1);
          setPosition(
            activeObject,
            new fabric.Point(
              preAdjusted == null ? activeObjectLeft : preAdjusted,
              objectTop - objectHeight / 2 + activeObjectHeight / 2
            ),
            isScale
          );
        }
        //上下
        if (
          isInRange(
            objectTop - objectHeight / 2,
            activeObjectTop + activeObjectHeight / 2,
            isScale,
            "center"
          )
        ) {
          horizontalInTheRange = true;
          var common1 = $$.extend(true, {}, common);
          common1.y = objectTop - objectHeight / 2;
          horizontalLines.push(common1);
          setPosition(
            activeObject,
            new fabric.Point(
              preAdjusted == null ? activeObjectLeft : preAdjusted,
              objectTop - objectHeight / 2 - activeObjectHeight / 2
            ),
            isScale
          );
        }

        //下中
        if (
          isInRange(
            objectTop + objectHeight / 2,
            activeObjectTop,
            isScale,
            "center"
          )
        ) {
          horizontalInTheRange = true;
          var common1 = $$.extend(true, {}, common);
          common1.y = objectTop + objectHeight / 2;
          horizontalLines.push(common1);
          setPosition(
            activeObject,
            new fabric.Point(
              preAdjusted == null ? activeObjectLeft : preAdjusted,
              objectTop + objectHeight / 2
            ),
            isScale
          );
        }
        //下上
        if (
          isInRange(
            objectTop + objectHeight / 2,
            activeObjectTop - activeObjectHeight / 2,
            isScale,
            "center"
          )
        ) {
          horizontalInTheRange = true;
          var common1 = $$.extend(true, {}, common);
          common1.y = objectTop + objectHeight / 2;
          horizontalLines.push(common1);
          setPosition(
            activeObject,
            new fabric.Point(
              preAdjusted == null ? activeObjectLeft : preAdjusted,
              objectTop + objectHeight / 2 + activeObjectHeight / 2
            ),
            isScale
          );
        }
        // snap by the bottom edge 下下
        if (
          isInRange(
            objectTop + objectHeight / 2,
            activeObjectTop + activeObjectHeight / 2,
            isScale,
            "center"
          )
        ) {
          horizontalInTheRange = true;
          var common1 = $$.extend(true, {}, common);
          common1.y = objectTop + objectHeight / 2;
          horizontalLines.push(common1);
          setPosition(
            activeObject,
            new fabric.Point(
              preAdjusted == null ? activeObjectLeft : preAdjusted,
              objectTop + objectHeight / 2 - activeObjectHeight / 2
            ),
            isScale
          );
        }

        //水平网格对齐
        if (
          _this.$store.state.curPage.martixAttach &&
          _this.$store.state.curPage.matrixOn
        ) {
          var preAdjusted = null;
          for (var i = 0; i < matrixVertical.length; i++) {
            var m = matrixVertical[i];
            var transformPoint = fabric.util.transformPoint(
              new fabric.Point(0, m[0]),
              fabric.util.invertTransform(viewportTransform)
            );
            var linespx = transformPoint.y;
            //中中
            if (isInRange(linespx, activeObjectTop, isScale, "matrix")) {
              //_this.logtxt = "linespx:" +linespx + ", activeObjectTop:" + activeObjectTop + ", -:" + (activeObjectTop- activeObjectHeight / 2) + ", +:" + (activeObjectTop+ activeObjectHeight / 2);
              preAdjusted = linespx;
              setPosition(
                activeObject,
                new fabric.Point(activeObjectLeft, preAdjusted),
                isScale,
                "matrix"
              );
            }
            //中上
            if (
              isInRange(
                linespx,
                activeObjectTop - activeObjectHeight / 2,
                isScale,
                "matrix"
              )
            ) {
              //_this.logtxt = "linespx:" + linespx + ", activeObjectTop:" + activeObjectTop + ", -:" + (activeObjectTop- activeObjectHeight / 2) + ", +:" + (activeObjectTop+ activeObjectHeight / 2);
              preAdjusted = linespx + activeObjectHeight / 2;
              setPosition(
                activeObject,
                new fabric.Point(activeObjectLeft, preAdjusted),
                isScale,
                "matrix"
              );
            }
            //中下
            if (
              isInRange(
                linespx,
                activeObjectTop + activeObjectHeight / 2,
                isScale,
                "matrix"
              )
            ) {
              //_this.logtxt = "linespx:" + linespx + ", activeObjectTop:" + activeObjectTop + ", -:" + (activeObjectTop- activeObjectHeight / 2) + ", +:" + (activeObjectTop+ activeObjectHeight / 2);
              preAdjusted = linespx - activeObjectHeight / 2;
              setPosition(
                activeObject,
                new fabric.Point(activeObjectLeft, preAdjusted),
                isScale,
                "matrix"
              );
            }
          }

          //垂直网格对齐
          for (var i = 0; i < matrixHorizen.length; i++) {
            var m = matrixHorizen[i];
            var transformPoint = fabric.util.transformPoint(
              new fabric.Point(m[0], 0),
              fabric.util.invertTransform(viewportTransform)
            );
            var linespx = transformPoint.x;
            // snap by the horizontal center line 前者是参照、后者是活动者，水平中中
            if (isInRange(linespx, activeObjectLeft, isScale, "matrix")) {
              verticalInTheRange = true;
              setPosition(
                activeObject,
                new fabric.Point(
                  linespx,
                  preAdjusted == null ? activeObjectTop : preAdjusted
                ),
                isScale,
                "matrix"
              );
            }
            //中左
            if (
              isInRange(
                linespx,
                activeObjectLeft - activeObjectWidth / 2,
                isScale,
                "matrix"
              )
            ) {
              setPosition(
                activeObject,
                new fabric.Point(
                  linespx + activeObjectWidth / 2,
                  preAdjusted == null ? activeObjectTop : preAdjusted
                ),
                isScale,
                "matrix"
              );
            }
            //中右
            if (
              isInRange(
                linespx,
                activeObjectLeft + activeObjectWidth / 2,
                isScale,
                "matrix"
              )
            ) {
              setPosition(
                activeObject,
                new fabric.Point(
                  linespx - activeObjectWidth / 2,
                  preAdjusted == null ? activeObjectTop : preAdjusted
                ),
                isScale,
                "matrix"
              );
            }
          }
        }

        // It should be trivial to DRY this up by encapsulating (repeating) creation of x1, x2, y1, and y2 into functions,
        // but we're not doing it here for perf. reasons -- as this a function that's invoked on every mouse move

        for (var i = canvasObjects.length; i--; ) {
          if (
            canvasObjects[i] === activeObject ||
            !canvasObjects[i].evented ||
            canvasObjects[i].msType == "guidelines"
          )
            continue;

          var objectCenter = canvasObjects[i].getCenterPoint(),
            objectLeft = objectCenter.x,
            objectTop = objectCenter.y,
            objectBoundingRect = canvasObjects[i].getBoundingRect(),
            objectHeight = objectBoundingRect.height / viewportTransform[3],
            objectWidth = objectBoundingRect.width / viewportTransform[0],
            preAdjusted = null;

          //水平位移辅助线生成
          var common = {
            y1:
              objectTop < activeObjectTop
                ? objectTop - objectHeight / 2 - aligningLineOffset
                : objectTop + objectHeight / 2 + aligningLineOffset,
            y2:
              activeObjectTop > objectTop
                ? activeObjectTop + activeObjectHeight / 2 + aligningLineOffset
                : activeObjectTop - activeObjectHeight / 2 - aligningLineOffset,
            isScale: isScale
          };
          // snap by the horizontal center line 前者是参照、后者是活动者，水平中中
          if (isInRange(objectLeft, activeObjectLeft, isScale)) {
            verticalInTheRange = true;
            var common1 = $$.extend(true, {}, common);
            common1.x = objectLeft;
            verticalLines.push(common1);
            preAdjusted = objectLeft;
            setPosition(
              activeObject,
              new fabric.Point(preAdjusted, activeObjectTop),
              isScale
            );
          }
          //中左
          if (
            isInRange(
              objectLeft,
              activeObjectLeft - activeObjectWidth / 2,
              isScale
            )
          ) {
            verticalInTheRange = true;
            var common1 = $$.extend(true, {}, common);
            common1.x = objectLeft;
            verticalLines.push(common1);
            preAdjusted = objectLeft + activeObjectWidth / 2;
            setPosition(
              activeObject,
              new fabric.Point(preAdjusted, activeObjectTop),
              isScale
            );
          }
          //中右
          if (
            isInRange(
              objectLeft,
              activeObjectLeft + activeObjectWidth / 2,
              isScale
            )
          ) {
            verticalInTheRange = true;
            var common1 = $$.extend(true, {}, common);
            common1.x = objectLeft;
            verticalLines.push(common1);
            preAdjusted = objectLeft - activeObjectWidth / 2;
            setPosition(
              activeObject,
              new fabric.Point(preAdjusted, activeObjectTop),
              isScale
            );
          }

          // snap by the left edge 前者是参照、后者是活动者，水平左中
          if (
            isInRange(objectLeft - objectWidth / 2, activeObjectLeft, isScale)
          ) {
            verticalInTheRange = true;
            var common1 = $$.extend(true, {}, common);
            common1.x = objectLeft - objectWidth / 2;
            verticalLines.push(common1);
            preAdjusted = objectLeft - objectWidth / 2;
            setPosition(
              activeObject,
              new fabric.Point(objectLeft - objectWidth / 2, activeObjectTop),
              isScale
            );
          }
          //左左**
          if (
            isInRange(
              objectLeft - objectWidth / 2,
              activeObjectLeft - activeObjectWidth / 2,
              isScale
            )
          ) {
            verticalInTheRange = true;
            var common1 = $$.extend(true, {}, common);
            common1.x = objectLeft - objectWidth / 2;
            verticalLines.push(common1);
            preAdjusted = objectLeft - objectWidth / 2 + activeObjectWidth / 2;
            setPosition(
              activeObject,
              new fabric.Point(preAdjusted, activeObjectTop),
              isScale
            );
          }
          //左右
          if (
            isInRange(
              objectLeft - objectWidth / 2,
              activeObjectLeft + activeObjectWidth / 2,
              isScale
            )
          ) {
            verticalInTheRange = true;
            var common1 = $$.extend(true, {}, common);
            common1.x = objectLeft - objectWidth / 2;
            verticalLines.push(common1);
            preAdjusted = objectLeft - objectWidth / 2 - activeObjectWidth / 2;
            setPosition(
              activeObject,
              new fabric.Point(preAdjusted, activeObjectTop),
              isScale
            );
          }

          // snap by the right edge 前者是参照、后者是活动者，水平右中
          if (
            isInRange(objectLeft + objectWidth / 2, activeObjectLeft, isScale)
          ) {
            verticalInTheRange = true;
            var common1 = $$.extend(true, {}, common);
            common1.x = objectLeft + objectWidth / 2;
            verticalLines.push(common1);
            preAdjusted = objectLeft + objectWidth / 2;
            setPosition(
              activeObject,
              new fabric.Point(preAdjusted, activeObjectTop),
              isScale
            );
          }
          //右左
          if (
            isInRange(
              objectLeft + objectWidth / 2,
              activeObjectLeft - activeObjectWidth / 2,
              isScale
            )
          ) {
            verticalInTheRange = true;
            var common1 = $$.extend(true, {}, common);
            common1.x = objectLeft + objectWidth / 2;
            verticalLines.push(common1);
            preAdjusted = objectLeft + objectWidth / 2 + activeObjectWidth / 2;
            setPosition(
              activeObject,
              new fabric.Point(preAdjusted, activeObjectTop),
              isScale
            );
          }
          //右右
          if (
            isInRange(
              objectLeft + objectWidth / 2,
              activeObjectLeft + activeObjectWidth / 2,
              isScale
            )
          ) {
            verticalInTheRange = true;
            var common1 = $$.extend(true, {}, common);
            common1.x = objectLeft + objectWidth / 2;
            verticalLines.push(common1);
            preAdjusted = objectLeft + objectWidth / 2 - activeObjectWidth / 2;
            setPosition(
              activeObject,
              new fabric.Point(preAdjusted, activeObjectTop),
              isScale
            );
          }

          var common = {
            x1:
              objectLeft < activeObjectLeft
                ? objectLeft - objectWidth / 2 - aligningLineOffset
                : objectLeft + objectWidth / 2 + aligningLineOffset,
            x2:
              activeObjectLeft > objectLeft
                ? activeObjectLeft + activeObjectWidth / 2 + aligningLineOffset
                : activeObjectLeft - activeObjectWidth / 2 - aligningLineOffset,
            isScale: isScale
          };

          // snap by the vertical center line 前者是参照、后者是活动者，垂直中中
          if (isInRange(objectTop, activeObjectTop, isScale)) {
            horizontalInTheRange = true;
            var common1 = $$.extend(true, {}, common);
            common1.y = objectTop;
            horizontalLines.push(common1);
            setPosition(
              activeObject,
              new fabric.Point(
                preAdjusted == null ? activeObjectLeft : preAdjusted,
                objectTop
              ),
              isScale
            );
          }
          //中上
          if (
            isInRange(
              objectTop,
              activeObjectTop - activeObjectHeight / 2,
              isScale
            )
          ) {
            horizontalInTheRange = true;
            var common1 = $$.extend(true, {}, common);
            common1.y = objectTop;
            horizontalLines.push(common1);
            setPosition(
              activeObject,
              new fabric.Point(
                preAdjusted == null ? activeObjectLeft : preAdjusted,
                objectTop + activeObjectHeight / 2
              ),
              isScale
            );
          }
          //中下
          if (
            isInRange(
              objectTop,
              activeObjectTop + activeObjectHeight / 2,
              isScale
            )
          ) {
            horizontalInTheRange = true;
            var common1 = $$.extend(true, {}, common);
            common1.y = objectTop;
            horizontalLines.push(common1);
            setPosition(
              activeObject,
              new fabric.Point(
                preAdjusted == null ? activeObjectLeft : preAdjusted,
                objectTop - activeObjectHeight / 2
              ),
              isScale
            );
          }

          //上中
          if (
            isInRange(objectTop - objectHeight / 2, activeObjectTop, isScale)
          ) {
            horizontalInTheRange = true;
            var common1 = $$.extend(true, {}, common);
            common1.y = objectTop - objectHeight / 2;
            horizontalLines.push(common1);
            setPosition(
              activeObject,
              new fabric.Point(
                preAdjusted == null ? activeObjectLeft : preAdjusted,
                objectTop - objectHeight / 2
              ),
              isScale
            );
          }
          // snap by the top edge 上上
          if (
            isInRange(
              objectTop - objectHeight / 2,
              activeObjectTop - activeObjectHeight / 2,
              isScale
            )
          ) {
            horizontalInTheRange = true;
            var common1 = $$.extend(true, {}, common);
            common1.y = objectTop - objectHeight / 2;
            horizontalLines.push(common1);
            setPosition(
              activeObject,
              new fabric.Point(
                preAdjusted == null ? activeObjectLeft : preAdjusted,
                objectTop - objectHeight / 2 + activeObjectHeight / 2
              ),
              isScale
            );
          }
          //上下
          if (
            isInRange(
              objectTop - objectHeight / 2,
              activeObjectTop + activeObjectHeight / 2,
              isScale
            )
          ) {
            horizontalInTheRange = true;
            var common1 = $$.extend(true, {}, common);
            common1.y = objectTop - objectHeight / 2;
            horizontalLines.push(common1);
            setPosition(
              activeObject,
              new fabric.Point(
                preAdjusted == null ? activeObjectLeft : preAdjusted,
                objectTop - objectHeight / 2 - activeObjectHeight / 2
              ),
              isScale
            );
          }

          //下中
          if (
            isInRange(objectTop + objectHeight / 2, activeObjectTop, isScale)
          ) {
            horizontalInTheRange = true;
            var common1 = $$.extend(true, {}, common);
            common1.y = objectTop + objectHeight / 2;
            horizontalLines.push(common1);
            setPosition(
              activeObject,
              new fabric.Point(
                preAdjusted == null ? activeObjectLeft : preAdjusted,
                objectTop + objectHeight / 2
              ),
              isScale
            );
          }
          //下上
          if (
            isInRange(
              objectTop + objectHeight / 2,
              activeObjectTop - activeObjectHeight / 2,
              isScale
            )
          ) {
            horizontalInTheRange = true;
            var common1 = $$.extend(true, {}, common);
            common1.y = objectTop + objectHeight / 2;
            horizontalLines.push(common1);
            setPosition(
              activeObject,
              new fabric.Point(
                preAdjusted == null ? activeObjectLeft : preAdjusted,
                objectTop + objectHeight / 2 + activeObjectHeight / 2
              ),
              isScale
            );
          }
          // snap by the bottom edge 下下
          if (
            isInRange(
              objectTop + objectHeight / 2,
              activeObjectTop + activeObjectHeight / 2,
              isScale
            )
          ) {
            horizontalInTheRange = true;
            var common1 = $$.extend(true, {}, common);
            common1.y = objectTop + objectHeight / 2;
            horizontalLines.push(common1);
            setPosition(
              activeObject,
              new fabric.Point(
                preAdjusted == null ? activeObjectLeft : preAdjusted,
                objectTop + objectHeight / 2 - activeObjectHeight / 2
              ),
              isScale
            );
          }
        }

        if (_this.$store.state.curPage.guideLinesAttach) {
          //垂直辅助线处理
          var preAdjusted = null;
          for (var i = 0; i < canvasObjects.length; i++) {
            var objectCenter = canvasObjects[i].getCenterPoint(),
              objectLeft = objectCenter.x,
              objectTop = objectCenter.y,
              objectBoundingRect = canvasObjects[i].getBoundingRect(),
              objectHeight = objectBoundingRect.height / viewportTransform[3],
              objectWidth = objectBoundingRect.width / viewportTransform[0];
            if (canvasObjects[i].msType != "guidelines") {
              continue;
            }

            if (canvasObjects[i].msGuideDirection != "v") {
              continue;
            }

            //水平辅助线生成
            var common = {
              y1:
                objectTop < activeObjectTop
                  ? objectTop - objectHeight / 2 - aligningLineOffset
                  : objectTop + objectHeight / 2 + aligningLineOffset,
              y2:
                activeObjectTop > objectTop
                  ? activeObjectTop +
                    activeObjectHeight / 2 +
                    aligningLineOffset
                  : activeObjectTop -
                    activeObjectHeight / 2 -
                    aligningLineOffset,
              isScale: isScale
            };

            // snap by the horizontal center line 前者是参照、后者是活动者，水平中中
            if (
              isInRange(objectLeft, activeObjectLeft, isScale, "guidelines")
            ) {
              verticalInTheRange = true;
              var common1 = $$.extend(true, {}, common);
              common1.x = objectLeft;
              verticalLines.push(common1);
              preAdjusted = objectLeft;
              setPosition(
                activeObject,
                new fabric.Point(preAdjusted, activeObjectTop),
                isScale,
                "guidelines"
              );
            }
            //中左
            if (
              isInRange(
                objectLeft,
                activeObjectLeft - activeObjectWidth / 2,
                isScale,
                "guidelines"
              )
            ) {
              verticalInTheRange = true;
              var common1 = $$.extend(true, {}, common);
              common1.x = objectLeft;
              verticalLines.push(common1);
              preAdjusted = objectLeft + activeObjectWidth / 2;
              setPosition(
                activeObject,
                new fabric.Point(preAdjusted, activeObjectTop),
                isScale,
                "guidelines"
              );
            }
            //中右
            if (
              isInRange(
                objectLeft,
                activeObjectLeft + activeObjectWidth / 2,
                isScale,
                "guidelines"
              )
            ) {
              verticalInTheRange = true;
              var common1 = $$.extend(true, {}, common);
              common1.x = objectLeft;
              verticalLines.push(common1);
              preAdjusted = objectLeft - activeObjectWidth / 2;
              setPosition(
                activeObject,
                new fabric.Point(preAdjusted, activeObjectTop),
                isScale,
                "guidelines"
              );
            }
          }

          //水平辅助线处理
          for (var i = 0; i < canvasObjects.length; i++) {
            var objectCenter = canvasObjects[i].getCenterPoint(),
              objectLeft = objectCenter.x,
              objectTop = objectCenter.y,
              objectBoundingRect = canvasObjects[i].getBoundingRect(),
              objectHeight = objectBoundingRect.height / viewportTransform[3],
              objectWidth = objectBoundingRect.width / viewportTransform[0];
            if (canvasObjects[i].msType != "guidelines") {
              continue;
            }

            if (canvasObjects[i].msGuideDirection != "h") {
              continue;
            }

            var common = {
              x1:
                objectLeft < activeObjectLeft
                  ? objectLeft - objectWidth / 2 - aligningLineOffset
                  : objectLeft + objectWidth / 2 + aligningLineOffset,
              x2:
                activeObjectLeft > objectLeft
                  ? activeObjectLeft +
                    activeObjectWidth / 2 +
                    aligningLineOffset
                  : activeObjectLeft -
                    activeObjectWidth / 2 -
                    aligningLineOffset,
              isScale: isScale
            };

            // snap by the vertical center line 前者是参照、后者是活动者，垂直中中
            if (isInRange(objectTop, activeObjectTop, isScale, "guidelines")) {
              horizontalInTheRange = true;
              var common1 = $$.extend(true, {}, common);
              common1.y = objectTop;
              horizontalLines.push(common1);
              setPosition(
                activeObject,
                new fabric.Point(
                  preAdjusted == null ? activeObjectLeft : preAdjusted,
                  objectTop
                ),
                isScale,
                "guidelines"
              );
            }
            //中上
            if (
              isInRange(
                objectTop,
                activeObjectTop - activeObjectHeight / 2,
                isScale,
                "guidelines"
              )
            ) {
              horizontalInTheRange = true;
              var common1 = $$.extend(true, {}, common);
              common1.y = objectTop;
              horizontalLines.push(common1);
              setPosition(
                activeObject,
                new fabric.Point(
                  preAdjusted == null ? activeObjectLeft : preAdjusted,
                  objectTop + activeObjectHeight / 2
                ),
                isScale,
                "guidelines"
              );
            }
            //中下
            if (
              isInRange(
                objectTop,
                activeObjectTop + activeObjectHeight / 2,
                isScale,
                "guidelines"
              )
            ) {
              horizontalInTheRange = true;
              var common1 = $$.extend(true, {}, common);
              common1.y = objectTop;
              horizontalLines.push(common1);
              setPosition(
                activeObject,
                new fabric.Point(
                  preAdjusted == null ? activeObjectLeft : preAdjusted,
                  objectTop - activeObjectHeight / 2
                ),
                isScale,
                "guidelines"
              );
            }
          }
        }

        if (!horizontalInTheRange) {
          horizontalLines.length = 0;
        }

        if (!verticalInTheRange) {
          verticalLines.length = 0;
        }
      }

      var matrixHorizen = [],
        matrixVertical = [];

      function createMatrixData() {
        var center = canvas.getCenter(),
          vf = canvas.viewportTransform,
          viewXY = _this.getViewAbsoluteXY(),
          space = 50 * _this.curzoom,
          isHorizen = true,
          isVertical = true;

        //vercal
        var matrixVertical = [];
        var centerfix = _this.transformPoint(viewXY.left, viewXY.top, false);
        for (var i = 1; i < viewXY.zoomHeight / space; i++) {
          var top = centerfix.y + i * space + 0.5,
            left1 = centerfix.x + 1,
            left2 = centerfix.x + viewXY.zoomWidth + 0.5;
          matrixVertical.push([top, left1, left2]);
        }

        var matrixHorizen = [];
        for (var i = 1; i < viewXY.zoomWidth / space; i++) {
          var left = centerfix.x + i * space + 0.5,
            top1 = centerfix.y + 1,
            top2 = centerfix.y + viewXY.zoomHeight + 0.5;
          matrixHorizen.push([left, top1, top2]);
        }

        return { matrixVertical: matrixVertical, matrixHorizen: matrixHorizen };
      }

      function drawMatrix() {
        // var param = _this.calMoveParam(), center = canvas.getCenter(),vf = canvas.viewportTransform,
        //     viewXY = _this.getViewAbsoluteXY(),
        //     space = 50*_this.curzoom,
        //     isHorizen = true,
        //     isVertical = true
        // ;

        //vercal
        var matrixData = createMatrixData();
        var matrixHorizen = matrixData.matrixHorizen,
          matrixVertical = matrixData.matrixVertical,
          matrixColor = _this.$store.state.curPage.matrixColor,
          matrixBorderStyle = _this.$store.state.curPage.matrixBorderStyle;
        matrixColor = matrixColor == null ? "#8D8D8D" : matrixColor;
        matrixBorderStyle =
          matrixBorderStyle == null ? [1, 1] : matrixBorderStyle;
        for (var i = 0; i < matrixVertical.length; i++) {
          var m = matrixVertical[i];
          ctx.save();
          ctx.lineWidth = 0.5;
          ctx.strokeStyle = matrixColor;
          ctx.setLineDash(matrixBorderStyle);
          ctx.beginPath();
          ctx.moveTo(m[1], m[0]);
          ctx.lineTo(m[2], m[0]);
          ctx.stroke();
          ctx.restore();
        }

        for (var i = 0; i < matrixHorizen.length; i++) {
          var m = matrixHorizen[i];
          ctx.save();
          ctx.lineWidth = 0.5;
          ctx.strokeStyle = matrixColor;
          ctx.setLineDash(matrixBorderStyle);
          ctx.beginPath();
          ctx.moveTo(m[0], m[1]);
          ctx.lineTo(m[0], m[2]);
          ctx.stroke();
          ctx.restore();
        }
      }

      var verticalLines = [],
        horizontalLines = [],
        movingstate = false;

      canvas.on("mouse:down", function() {
        viewportTransform = canvas.viewportTransform;
        zoom = canvas.getZoom();
        movingstate = true;
        var matrixData = createMatrixData();
        matrixHorizen = matrixData.matrixHorizen;
        matrixVertical = matrixData.matrixVertical;
      });

      canvas.on("object:moving", function(e) {
        if (movingstate) {
          createGuideLine(e);
        }
      });

      canvas.on("object:scaling", function(e) {
        if (movingstate) {
          createGuideLine(e, true);
        }
      });

      canvas.on("before:render", function() {
        if (_this.$store.state.curPage.matrixOn) {
          canvas.clearContext(canvas.contextTop);
        }
      });

      canvas.on("after:render", function() {
        if (!_this.$store.state.curPage.matrixOn) {
          return;
        }

        for (var i = verticalLines.length; i--; ) {
          drawVerticalLine(verticalLines[i]);
        }
        for (var i = horizontalLines.length; i--; ) {
          drawHorizontalLine(horizontalLines[i]);
        }

        verticalLines.length = horizontalLines.length = 0;

        drawMatrix();
      });

      canvas.on("mouse:up", function() {
        verticalLines.length = horizontalLines.length = 0;
        movingstate = false;
        canvas.renderAll();
      });
    }
  }
};
</script>

<style lang="scss">
@import "../assets/common.scss";

body {
  overflow: hidden;
}

//整体
.ms-point {
  @extend %position;

  overflow: hidden;

  .ms-pageMove-aux {
    position: absolute;
    background: rgba(0, 0, 0, 0.8);
    color: #fff;
    font-size: 13px;
    height: 16px;
    line-height: 16px;
    text-align: center;
    padding: 2px 4px;
    z-index: 10;
    border-radius: 2px;
    border: solid 1px #fff;
  }

  .ms-top {
    @extend %position;

    bottom: auto;
    background: $topBarColor;
    height: 49px;

    @extend %border;
    border-bottom-width: 1px;

    .ms-top-left {
      @extend %position;
      width: 350px;
      left: 0px;
      right: auto;

      .ms-logo {
        @extend %position;
        width: 145px;
        height: 38px;
        top: 50%;
        margin-top: -19px;
        left: 10px;
        background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJEAAAAmCAYAAADEF3nuAAALPklEQVR4nO2ce1hU1RqH3xmGERAILyRiKkIiOAmiZCKGKWqZaZplmvaEmvpo55jX45N57NhNzXuZl8w4+pSZHa1M8DppKl4Ak5BtCOIVOKCCiMhFLnP+gIk9mz3DzDApdeb9i73WXutbm/2bdfnWt7ZCp9NhLRsSGbdDYFpzZ3Km92JKz0e4bHVldv60KKwRUWw6PTcmsqigFE9AU5MsDPTjq7ciWGTTFtpp9FgkopTreKw6ztqMWwRRKx4xgoOCyqgQ/jU2mO9s1ko7jRqzRfTuYRYcusRI5MUjRfB2I2NWLyZ38yanQS200+ipV0TRZxi97Syz7lXiRK2AtI5KKsYEsybYixPXbvPoZ4nMLbqHOxApKi70bseu9yKZ9we1304jwKiIDmbQdV0Cy/JL8MKw99FGtGffwn4slZZZeZzxu87zChIhOSopHxPMote6st2mrbfTKKgjorQ8nFadYO1vN+iBRDztHiJjZi/mBXuRZ6zC8zdx+eBnVl8rpAMSMakdKH2hM59ODiXapk9h54FiIKIPj/DWgQzGIBGPm5rC8d1YOiyQE+ZWvDWZAVuTeeNuOa5IxPRwU65FhbBwUEdONvgJ7DxwFDqdjq/PMnTzGRaUSeY9SgVVQzrx1fQwNltr4FuBp6J/YVZJBc5IxBTqjfaVIBaFtLZPvv/MKN75Sbfw58uMQNL7BHtxatUg3raVoYWHmHn4Ms9iKCQUIGx8nhC/5pSbKj9zL2uqdCgtsRnpy7YhnTgC8GsOntP3cAjAWcXd2Fd5wsJHsGMEVVoe3RH1Pl6uZE55nPcjfLhgS0Pv9GXFhR0EZhYaputAI1wnzK959cuWY+c5Is/8l6cwz72gR3iyPd9L0jQAJRUIFtRjpx5USqjUX/h4kBE9nMm2NrI+gZH/EXi90khPUl8PU6XDAQsF5KqmYERn9lvSTjvynM6mjfYio45c5sXdYwmT5qvEF0FenLKl8Z8uEvhpPAvyS/BEMowZoDC/TmcV8Qv78ZKjAyWm7uvqxQ3za7Vjitn72Ef1j1hIvUnTgJbcFecbiAjr92Lr8GYsi5NzCcVQPFo3NYVPtmdvbDobrLHr4cyNx9tw1WYNtWMJsqOBStwL2EJDa+MZteMc42uGKAMBPduR7XN681lCFt6x6TYw1og5nU2bs7mEW1rOxZHCkY+x9363Q6WkXLrfmZSDZ2EZLeotWzPfACwaVepw8CKadfHMlxm6tO09yJjbm1mBnhTJFm6I4T+IDYmM23aWWebc66zi7qxwJkf6kgQQn0W7ufuJxbJ5nB4hI58QfTREWh5OM/ZwqLgcN3MKS7eZRENRvXZj05mw9UWeA1ifwLhvUpglLTvlx9opj1JBpTaKYMPhzMqXOXc/C+KziEAiHmcVJVEhLB/5GIfF95dW4GJQgQ2HUVtxKpNnMFMEJRXw00VG60WUfQdfc8vKoEnPp6v+IiWX8OJyeppb+Fj1QG/NXqXmVkntXEeyV2pwn/6PKh1CWh5OKpmbLCI5l2ZyAurjQ+y/+rJCrszedEYaJFgg3jtlePz7jKS8DO09SO3bgWTzazZKXFt3Mpq7cF2akV2Iz41iWgPhxn4HTiriX+jMp45KSq/eJkAcCdGpBVt6tiUG4EAGY7LvMNRUQ5xV5Pm35Jg0vawCt9Sb9AbUJooLg/3Z1NKFLHHiyUwGn79p4OYxKCP6WyOTBkgm1grRct9cbt7Fi1oBab1cyZzTmzndWtddHaVcx31ZHEuvFOBnkGFBT1R0j/DNSfWO8UJUCO9Cw0XkpKJ4ywheM5bfN7ruSxUT0Z7vJ3Zni/46I5+gq7erX8jUJ5gZ1Kp6HzK0Dfv/HsMtU3XNDGdIf1/5rafZ+9h+OpuXjJX1dCFrdjgrpelRIWzvG02KNH1aT9ZN68k6AHH+uiE8YXJ1pqN2fmQhWkclFaODWDcuhB/kblhylCl7LzACuaW+bedEgosjd2wVMaBSmvak14eDknvia7VD7bVKlOdohh21kmJjeW5q45viNe1o0HOYwkBESit6IoCQ1pxY8Qz/lMv7PpWwjYnMLa67EVuLBT2Rq5q4EZ352Fi+QgFyAlIqqDLfSi1F93goNp1Qb7e68eMpufSwpk5rOXiRN9ydeEeaXl6JS3IuA+5nW8QYiKjKip6ony+/9fOtK6C0PJosOcrKi7fwx5SjESzqidyaUBAVYnkv04C5e/jSYyRYX9x2HL3CxKNXmPig2yGlwRNrOVYcZ/yPdYPTALRBrUjs48PuT05x9PfU+7A6Uyqs62XNRPBybRwnXZo6cud+27TJcKYnNo1u6xOYf6dumKzWw4m8KT14f6AfZxOy8Dawa+VQYwk6nXXzPbUDp0d34SNT9zRRUTq6C7usa5n5POXDu+09TG8e61d79xOVOLDR2g4hPY8mK46zOPUmXagb6qEdEsDWGWF8Yay8DstCPO4nagdKrRk+/wj6duDrCB9SH2QbMm/TMaBltT9Mj01e3ux9fJV6k+lIep+OLfh4/VAGSwVUaWWvAFB8zzzPrZSmagoQ+The3cHOs7n1u/TLq51ujYKySpo+CLsOoqnA56frnis0GM6E6zwOlkUxxmfhXViGhyhJ29SRogndWTY8UN6Hcu463SyxIeZ2GS1Gf8vuVq6mN2EdlZQvfZo39de+zah0b0JeYRkAmsxCNNNi8dfnN3cmZ9EAnvNvQam4nrJKnN46wLJOLYmXs6NUUBnejl31BdXZgg0JLMksZJMxf563OxkD/Thta7thbYk5drU6HCf3Lm37RZPSpRVxYW3ZNaoLMQYiupBPwGs72TAplMXh7bhkjoGiMh5C5Gzs78uut/sYX4LPO8i8E9foJ0oSnFTG/R8yaHKK0OTI78KJESbt4svPhjJWnzAuhHdWn2QNtd7X3720+SVoFh9h8xfDeRkM5oeak5loTmYaN/RDKtodo+hvwTOYTc2CQAA0eSVEbkkyudIVmjjwch8f2wbdvRfJvMFf0re4+mei0QHJuWiScwkPac1hZYQP31HbzUdevc2k+Vo2Tt3N8l+y8TTTjtbbjS9WDeJlYwLakMjIAZvZWyOg3/8RagdKn35U/leup3W1j8bSf4wmPY+uBzLork8YFsjhqT2Y7aomTq6+SwVoYtKqveGRfmwz12Z+CV5HrhCgv1ZCVU1ZQepErFlE1MmrcUoKgCB2cA4L5LCzirvmtiU2jQkyyYKjxOkph4OJBc7qZ4nwciVG0g5N9BkWKnQ6HYnZtPnkJKuv3iYASax1t9acWG7EkQgQd5UOl27hPzaYfXL5sel0Wx8vu2IT/JqRPKc3EztJ3OhypOXhZO5OthhjwWlnc2khF2kpvv/iLRwKy2hujZ2knOofoJz9pBw8VUrKH3uYAnF6ynU8KqpwlCvzaw6e5ix8pGVN1anntxu4lVXi5N6EfN9mplfohy4RlFlIx8qq6nmtQiE5MrQnnZ5r41lWdA8PJKc+nuvENlMrLCkZ+TgujeOj83VXbILagdJJocyzh6/+NZA9Abssjhl70omSxDZrXdUUTgplyZBOpsNolx/n9d3nGYWMeAb7s0m/sWfnr4HJs/gz9rA2KYcIJENcVy9OrZQ5TrQ+gZE7zzG+vAoVEgGFtSXmw/7MtVnL7TQa6v2gwzcpDN6SxPya+YjBBx1e1LCxxyMcTs+ji7EDiq5qCl7vzvznAwwD0+z8dTD70zJr45mw8xzTKs07viOolJQPD2TN1B5sanAr7TRqLP5S2j/2syIhi4GYiITr1ZaYD+xD1/8NVn1ub38G3TcksETy2RnBrxnJnw/jFZu20E6jxyoR6VmXwITvzvG3R9xJG+RP9Esa2x11sfPn4X+66fd2RQNQOQAAAABJRU5ErkJggg==);
      }

      .ms-share {
        @extend %position;
        right: 0px;
        left: auto;
      }
    }

    .ms-component-list-c {
      @extend %position;
      left: 350px;
      right: 400px;

      .ms-component-list {
        position: relative;
        left: 50%;
        display: inline;
        .ms-component {
          position: relative;
          text-align: center;
          display: inline-block;
          width: 50px;
          height: 100%;
          transition: all 0.2s;
          color: #4e4e4e;
          &:hover {
            cursor: pointer;
            background: #efefef;
          }

          .ms-component-icon {
            position: absolute;
            top: 0px;
            height: 25px;
            width: 100%;
            line-height: 25px;
            text-align: center;
            font-size: 20px;
          }
          .ms-component-txt {
            position: absolute;
            top: 25px;
            height: 24px;
            width: 100%;
            line-height: 19px;
            text-align: center;
            font-size: 12px;
          }

          &:hover .ms-component-icon,
          &:hover .ms-component-txt {
            color: #409eff;
          }
        }
      }
    }

    .ms-top-right {
      @extend %position;
      right: 0px;
      left: auto;
      width: 400px;

      .ms-amimate {
        @extend %position;
        left: 0px;
        right: auto;
      }

      .ms-publish {
        @extend %position;
        right: 10px;
        left: auto;
      }
    }
  }

  .ms-bottom {
    @extend %position;

    top: 50px;

    .ms-left-slider-aux {
      @extend %position;
      left: auto;
      right: auto;
      width: 5px;
      background: #66b1ff;
      z-index: 10000;
    }

    .ms-left {
      @extend %position;

      background: $leftBarColor;

      @extend %border;
      border-right-width: 1px;

      .ms-left-slider {
        @extend %position;
        @extend %userSelectNo;

        right: 0px;
        left: auto;
        width: 5px;
        cursor: col-resize;
        background: #f6f6f6;
        &:hover {
          cursor: col-resize;
          background: #66b1ff;
        }
      }

      .ms-left-Container {
        @extend %position;
        @extend %userSelectNo;

        left: 0px;
        right: 5px;

        .el-tabs__item {
          font-size: 12px;
          padding: 0px 5px;
          height: 35px;
          line-height: 35px;
          // border-radius: 0px;
          // border-top:none;
        }

        .el-tabs--card > .el-tabs__header .el-tabs__nav {
          border: none;
        }

        .el-tabs.el-tabs--card.el-tabs--top {
          @extend %position;

          .el-tabs__content {
            @extend %position;
            top: 40px;
          }
        }

        .el-button--mini,
        .el-button--mini.is-round {
          padding-top: 5px;
          padding-bottom: 5px;
        }

        .ms-left-element {
          @extend %position;
          @extend %scrollStyle;
        }

        .ms-left-layout {
          @extend %position;
          @extend %scrollStyle;
        }

        .ms-left-dataSource {
          @extend %position;
          @extend %scrollStyle;
        }
      }
    }

    .ms-mid-c {
      @extend %position;
      right: 311px;

      .ms-ani-slider-aux {
        @extend %position;
        top: auto;
        bottom: auto;
        height: 5px;
        background: #66b1ff;
        z-index: 10000;
      }

      .ms-ani-c {
        @extend %position;
        top: auto;
        // height: 200px;
        border-top: solid 1px #e4e4e4;
        //background: url(../../public/animations.png);
        background-size: cover;

        .ms-ani-slider {
          @extend %position;
          @extend %userSelectNo;

          top: 0px;
          bottom: auto;
          height: 5px;
          cursor: row-resize;
          background: #f6f6f6;
          z-index: 1;
          &:hover {
            cursor: row-resize;
            background: #66b1ff;
          }
        }
      }
    }

    .ms-mid {
      @extend %position;

      // bottom: 201px;
      background-color: $painColor;
      overflow: hidden;
      outline: none;
      //background:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAIAAADZF8uwAAAAGUlEQVQYV2M4gwH+YwCGIasIUwhT25BVBADtzYNYrHvv4gAAAABJRU5ErkJggg==");

      canvas {
        position: absolute;
        width: 100%;
        height: 100%;
      }

      .ms-mid-scroll {
        @extend %position;
        @extend %scrollStyle;

        opacity: 0.7;
        transition: opacity 0.3s;

        div {
          height: 1px;
          width: 1px;
        }
      }

      .ms-mid-scroll::-webkit-scrollbar-track {
        background-color: transparent;
      }

      .ms-mid-scroll::-webkit-scrollbar {
        width: 10px;
        height: 10px;
        background-color: transparent;
        /*border:0 none;*/
      }

      .ms-mid-scroll::-webkit-scrollbar-thumb {
        transition: background 0.2s;
        background: rgba(0, 0, 0, 0.7);
        border: 1px solid #f1f1f1;
        border-radius: 12px;
      }

      .ms-mid-scroll::-webkit-scrollbar-thumb:hover {
        background: rgba(0, 0, 0, 0.95);
        border: 1px solid #f1f1f1;
        border-radius: 12px;
      }

      .ms-mid-scrollx {
        @extend %position;

        bottom: 0;
        top: auto;
        height: 10px;

        //overflow-x: scroll;
      }

      .ms-mid-scrollx::-webkit-scrollbar {
        width: 0px;
      }

      .ms-mid-scrolly {
        @extend %position;

        right: 0;
        left: auto;
        width: 10px;

        //overflow-y: scroll;
      }

      .ms-mid-scrolly::-webkit-scrollbar {
        height: 10px;
        width: 10px;
        background: transparent;
      }

      .horizon-guide-trigger {
        @extend %position;
        @extend %userSelectNo;
        top: 0px;
        bottom: auto;
        height: 20px;
        z-index: 1;
        &:hover {
          background: rgba(0, 0, 0, 0.1);
          cursor: pointer;
        }
      }

      .vertical-guide-trigger {
        @extend %position;
        @extend %userSelectNo;
        left: 0px;
        right: auto;
        width: 20px;
        z-index: 1;
        &:hover {
          background: rgba(0, 0, 0, 0.1);
          cursor: pointer;
        }
      }

      .horizon-guide-line,
      .vertical-guide-line {
        @extend %position;
        @extend %userSelectNo;
        background: #00ffff;
        z-index: 2;
      }

      .horizon-guide-line {
        top: 0px;
        bottom: auto;
        height: 1px;
      }

      .vertical-guide-line {
        left: 0px;
        right: auto;
        width: 1px;
      }

      .mscursor {
        position: absolute;
        display: none;
        margin: -8px 0 0 -8px;
        top: 50%;
        left: 50%;
        width: 16px;
        height: 17px;
        background-size: 16px 17px;
        background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAiCAMAAAAJbCvNAAABVlBMVEUAAAAGBgYBAQEBAQEAAAAAAAAAAAAnJycAAAA3NzcDAwMNDQ0AAAAAAAAAAAAhISEbGxsYGBgPDw8CAgIDAwMBAQEAAAAAAAAAAAAAAAAAAAAvLy8UFBQCAgIBAQEAAAAAAAAAAAAAAAAAAAA+Pj5BQUE/Pz8zMzMCAgIDAwMDAwMCAgIBAQEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA7OzsAAAAAAAAAAAAAAAD///8AAABhYWEdHR36+vpVVVX9/f329vbz8/Pb29uBgYF0dHRjY2MsLCz39/ft7e3r6+vR0dFxcXFSUlJNTU3X19fKysq4uLh3d3dXV1dJSUlGRkZERETv7+/o6Ojj4+O8vLy1tbW0tLSnp6empqaTk5OKioqGhoZtbW1nZ2dcXFxPT0/Dw8PCwsKwsLCurq6pqamhoaGZmZmNjY16enpeXl5JnG7xAAAAPHRSTlMA/fj9B1EC/jf+/vw8Ew7+/fz85t26mpRoYyX9/OLMoHlKMiL+/f398enY0cC1tLGojouGVh4Z/qpyQy7UG/vLAAACHUlEQVQ4T33QVVdbURBA4bk3QjwQIIa7u9T2QDwQxx2K1+X/v/QhlzRpWN2v51tnZo1IS4ERx4b8J4epaht+5cHpiKzGRfzmxH55R0ftseERZwuIqGGY6xLTLKSNoTlV7W0WY7Z8qjRhflgxADrUOMjcarQJjGgZiqHecBfAuB4Cfb1NwKcHwJ0OdgKc6jWw1S0y5rLXgd18AIqGdtVBGdjpti+r9sTrYqkrBSS1H+BEz4GjnojmvnutQQ79AnxTL8CxFoCkqXnYmakD58AkkPEYADUPQFVDGajOWmsOaxboU4DnEEBN80Dfgoj4og7/pu0QeNQ08NxZ32QPEp41cS6rqvluqT8FX4MJIPcEkHQDn9Qh65rP7le1W/dpKVEAcraArHpTQE71nvZO50TWjAxARU9eAaGwiEtvARJTnQCpNKTPIFEEuNCoiCwYnwGKWYCKG7bGobILcK0+EfHPevcafz4FoboLW9sA9xoQEdmY6Si8gN9BSDZArad+xvf66wVsbTeBMyNiHXrIs9cMOixwp6MW8E9PWmBnG44scOFdlJdi+tMCXQ2QcE/HG8D5Vj8CkO+Axymo7HKoDvmbfd5zA5AoQeYcCqWsLSzNBeZtP2guZ/O3ALEvWlMoveksQ7JH/sk56K6DmjkQTHM8+C+Qof6rg8vLqweNumzHN+7uNhDWeisiMVN1oA3YR10un8+1KSISiI/Z28Dr/QHPa6Em8DfwfAAAAABJRU5ErkJggg==");
        background-repeat: no-repeat;
        cursor: none;
        z-index: 1;
        pointer-events: none;
      }
      .mscursor.msshow {
        display: block;
      }

      .mscursor.msmoving {
        background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAiCAMAAAAJbCvNAAABMlBMVEUAAAAAAAA2NjYsLCwCAgIAAAAAAAAMDAwBAQECAgIBAQECAgIBAQEBAQEAAAAAAAAAAAA5OTkgICAICAgAAAAcHBwCAgIAAAAAAAAAAAAAAAAAAABDQ0M8PDwxMTE0NDQVFRUCAgIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPDw8DAwMAAAAAAAAAAAAAAAAAAAAAAAAAAAD///8AAABhYWEcHBz6+vr39/dMTEzs7Oy8vLy4uLhWVlYqKiooKCj09PTw8PC1tbWnp6d2dnZZWVn8/Pzp6enj4+Pd3d3a2trNzc2tra2pqammpqaKioqAgIBzc3NwcHBmZmZdXV1TU1NHR0c+Pj7W1tbR0dHGxsbAwMCampqSkpKPj4+GhoZycnJsbGwkJCTy91wiAAAANnRSTlMAPP7+/ZcN/Pnr487Kv7QlEv7+/fz71jk2GAcE/v7+/fzzpaCUkGZZQTEsIAn826uEg3JtXFGryOxIAAABkElEQVR4AeXS1XLbQBjF8RXIDHbNdiBpOCnDOa4kg2Oww9w2KUPf/xW6s8q2sTXT6X1+t99/NJozK+6lR8ZmRPzDZpxc3sg9y2Sez3aNl+mUsx23TjpzxbJtmnaqMR08ZO8mGuNn4JA8AU75YiXl5ISW5SXwgTwAUGIfcAuM3thpoRnsAJhnC8DcY0gWj3HBmg5qPAdw1nMBfJ9Aai4AQ1aFllzENNcD2jSEsuOkEvyIEB1k44XrEicI6bCigtXoIbzFN5D2PMAbAG4L0im3VVD2AQyOIF3lgeY88MOC9JXBEEkf2rsHwHtLRup749jtikvTQU8Hflkor/hJB00ZdHUwKKwKJRLP70FRh+7ubXDOLRHY4GU4wEE0I7Q1foPyVh4mQeCay1nxx1OeqWC8K6MF4MrCmK/FX/W0PQKCgfr7gLd/ZDvirkiaX3DXRTE381wzHEFp5UvHQPeJmNFImlD8WOJXH35SzFpZGnba7eFPrleK1yMzEQocBtaEWI+R4aC+Va0YRrWm/jm7Uxf/5zeExWvZghlTSgAAAABJRU5ErkJggg==");
      }

      .msCanvasLoading {
        @extend %position;
        background: #f2f2f2;
        div {
          position: absolute;
          top: 50%;
          left: 50%;
          height: 40px;
          width: 40px;
          margin-left: -20px;
          margin-top: -20px;
          font-size: 36px;
        }
      }
    }

    .ms-right {
      @extend %position;

      left: auto;
      width: 310px;
      background: $rightBarColor;

      word-break: break-all;

      @extend %border;
      border-left-width: 1px;

      .ms-function-button {
        @extend %position;
        left: 0px;
        right: auto;
        width: 39px;

        background: #fafafa;

        @extend %border;
        border-right-width: 1px;

        .undo-function-button {
          width: 32px;
          height: 32px;
          margin-left: 3px;
          border-radius: 4px;
          text-align: center;
          line-height: 34px;
          margin-top: 3px;
          cursor: pointer;
          border: 1px solid #fafafa;
          font-size: 20px;
          outline: none;

          &:hover {
            border: 1px solid #e4e4e4;
            background: #fff;
          }
        }

        .undo-function-txt {
          font-size: 12px;
          color: #63b1ff;
          &:hover {
            border: 1px solid #fafafa;
            background: inherit;
          }
        }
      }
    }
  }
}
</style>
