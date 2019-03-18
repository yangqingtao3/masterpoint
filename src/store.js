import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import styles from './storeModules/styles.js'
import animation from './storeModules/animation.js'
//animation.js
Vue.use(Vuex)

export default new Vuex.Store({
	modules: {
		styles: styles,
		animation: animation
	},
	state: {
		sliderFile: null, //一个完整的幻灯片文件

		curPage: null, //当前页对应的json

		curPageId: null, //当前活动的场景页索引

		curObjectId: null, //当前场景页中的活动元素索引
		curSymbolId: null, //当前活动场景页中正在编辑的元件id
		curTimeLineId: null, //当前场景页中的活动时间线

		sliderPageIndex: null,

		sliderPageSort: null,

		getFileUrl: "./pointFile.json",

		objectPrototype: {
			singleText: {
				//可变文本框配置，可以对文字进行拉升，制作特殊样式文字
				"msItemID": "",
				"msType": "normal",
				"mszIndex": 0,
				"msName": "可变文本框", //名称
				"type": "i-text",
				"originX": "left",
				"originY": "top",
				"left": 0,
				"top": 0,
				"width": 100,
				"height": 50,
				"fill": "#000",
				"stroke": null,
				"strokeWidth": 0,
				"strokeDashArray": null,
				"strokeLineCap": "butt",
				"strokeLineJoin": "miter",
				"strokeMiterLimit": 10,
				"scaleX": 1,
				"scaleY": 1,
				"angle": 0,
				"flipX": false,
				"flipY": false,
				"opacity": 1,
				"shadow": null,
				"visible": true,
				"clipTo": null,
				"backgroundColor": "",
				"fillRule": "nonzero",
				"globalCompositeOperation": "source-over",
				"transformMatrix": null,
				"skewX": 0,
				"skewY": 0,
				"text": "",
				"fontSize": 14,
				"fontWeight": "normal",
				"fontFamily": "Helvetica",
				"fontStyle": "",
				"lineHeight": 1,
				"textDecoration": "",
				"textAlign": "left",
				"textBackgroundColor": "",
				"styles": {},
				"perPixelTargetFind": false,
				"padding": 10,
			},
			multiText: {
				//内容自适应文本框配置，不能拉伸高度，调整宽度后内容会跟着换行变化
				"msItemID": "",
				"msType": "normal",
				"mszIndex": 0,
				"msName": "文本框", //名称
				"type": "textbox",
				"version": "2.4.6",
				"originX": "left",
				"originY": "top",
				"left": 0,
				"top": 0,
				"width": 100,
				"height": 50,
				"fill": "#000",
				"stroke": null,
				"strokeWidth": 1,
				"strokeDashArray": null,
				"strokeLineCap": "butt",
				"strokeDashOffset": 0,
				"strokeLineJoin": "miter",
				"strokeMiterLimit": 4,
				"scaleX": 1,
				"scaleY": 1,
				"angle": 0,
				"flipX": false,
				"flipY": false,
				"opacity": 1,
				"shadow": null,
				"visible": true,
				"clipTo": null,
				"backgroundColor": "",
				"fillRule": "nonzero",
				"paintFirst": "fill",
				"globalCompositeOperation": "source-over",
				"transformMatrix": null,
				"skewX": 0,
				"skewY": 0,
				"text": "", //文本内容
				"fontSize": 14, //字号
				"fontWeight": "", //加粗，默认normal，bold加粗
				"fontFamily": "helvetica", //字体
				"fontStyle": "normal", //文字样式，默认normal，italic斜体
				"lineHeight": 1, //行间距
				"underline": false, //下划线
				"overline": false, //顶部线
				"linethrough": false, //删除线
				"textAlign": "left", //文字对比方式，默认left， "left", "center", "right", "justify", "justify-left", "justify-center" ， "justify-right".
				"textBackgroundColor": "", //文字背景
				"charSpacing": 0, //字间距

				//以下不需要设置
				"minWidth": 20, //最小宽度，不需要做成选项
				"styles": {}, //每个字的样式表，不需要做成选项
				"perPixelTargetFind": false,
				"padding": 10,
				"splitByGrapheme": true,
			},
			"rect": {
				//###################以下为canvas组件###########
				//ms开头的参数为编辑器自定义，每个组件都应该包含ms属性
				"msItemID": "",
				"msType": "normal",
				"mszIndex": 0,
				"msName": "矩形", //名称
				"type": "rect",
				"originX": "left",
				"originY": "top",
				"left": 0, //top垂直位置
				"top": 0, //left水平位置
				"width": 100, //宽度
				"height": 100, //高度
				"fill": "#66B1FF",
				"stroke": "#41719C", //
				"strokeWidth": 1, //边框粗细
				"strokeDashArray": null,
				"strokeLineCap": "butt",
				"strokeDashOffset": 0,
				"strokeLineJoin": "miter",
				"strokeMiterLimit": 4,
				"scaleX": 1, //
				"scaleY": 1, //
				"angle": 0, //组件旋转的角度值，例如90° 180°等
				"flipX": false, //水平翻转
				"flipY": false, //垂直翻转
				"opacity": 1, //透明度，0-1之间
				"shadow": null,
				"visible": true, //是否隐藏组件
				"clipTo": null, //剪切设置，不需要制作功能
				"fillRule": "nonzero",
				"paintFirst": "fill", //无需设置
				"globalCompositeOperation": "source-over", //无需设置
				"transformMatrix": null, //无需设置
				"skewX": 0, //组件的水平偏度设置
				"skewY": 0, //组件的垂直偏度设置
				"rx": 0, //圆角的水平大小设置
				"ry": 0, //圆角的垂直大小设置

				//以下组件无需设置
				"backgroundColor": "",
				"overlayFill": null,
				"selectable": true,
				"hasControls": true,
				"hasBorders": true,
				"perPixelTargetFind": false,
			},
			"ellipse": {
				"msItemID": "",
				"msType": "normal",
				"mszIndex": 0,
				"msName": "圆形", //名称
				"type": "ellipse", //圆形
				"objID": "",
				"version": "2.4.6",
				"originX": "left",
				"originY": "top",
				"left": 0,
				"top": 0,
				"width": 100,
				"height": 100,
				"fill": "#66B1FF",
				"stroke": "#41719C",
				"strokeWidth": 1,
				"strokeDashArray": null,
				"strokeLineCap": "butt",
				"strokeDashOffset": 0,
				"strokeLineJoin": "miter",
				"strokeMiterLimit": 4,
				"scaleX": 1,
				"scaleY": 1,
				"angle": 0,
				"flipX": false,
				"flipY": false,
				"opacity": 1,
				"shadow": null,
				"visible": true,
				"clipTo": null,
				"backgroundColor": "",
				"fillRule": "nonzero",
				"paintFirst": "fill",
				"globalCompositeOperation": "source-over",
				"transformMatrix": null,
				"skewX": 0,
				"skewY": 0,
				"rx": 100, //半径大小，px
				"ry": 100,
				"startAngle": 0, //圆开始角度，配合endAngle可以制作小月牙儿，px
				"endAngle": 0 //圆结束角度，px
			},
			"triangle": {
				"msItemID": "",
				"msType": "normal",
				"mszIndex": 0,
				"msName": "三角形", //名称
				"type": "triangle", //三角形
				"objID": "",
				"version": "2.4.6",
				"originX": "left",
				"originY": "top",
				"left": 0,
				"top": 0,
				"width": 100,
				"height": 100,
				"fill": "#66B1FF",
				"stroke": "#41719C",
				"strokeWidth": 1,
				"strokeDashArray": null,
				"strokeLineCap": "butt",
				"strokeDashOffset": 0,
				"strokeLineJoin": "miter",
				"strokeMiterLimit": 4,
				"scaleX": 1,
				"scaleY": 1,
				"angle": 0,
				"flipX": false,
				"flipY": false,
				"opacity": 1,
				"shadow": null,
				"visible": true,
				"clipTo": null,
				"backgroundColor": "",
				"fillRule": "nonzero",
				"paintFirst": "fill",
				"globalCompositeOperation": "source-over",
				"transformMatrix": null,
				"skewX": 0,
				"skewY": 0
			},
			"line": {
				"msItemID": "",
				"msType": "normal",
				"mszIndex": 0,
				"msName": "直线", //名称
				"type": "msLine", //线设置
				"objID": "line_shendasdf_1239348234",
				"version": "2.4.6",
				"originX": "left",
				"originY": "top",
				"fill": "rgb(0,0,0)",
				"stroke": "#41719C",
				"strokeWidth": 1,
				"strokeDashArray": null,
				"strokeLineCap": "butt",
				"strokeDashOffset": 0,
				"strokeLineJoin": "miter",
				"strokeMiterLimit": 4,
				"scaleX": 1,
				"scaleY": 1,
				"angle": 0,
				"flipX": false,
				"flipY": false,
				"opacity": 1,
				"shadow": null,
				"visible": true,
				"clipTo": null,
				"backgroundColor": "",
				"fillRule": "nonzero",
				"paintFirst": "fill",
				"globalCompositeOperation": "source-over",
				"transformMatrix": null,
				"skewX": 0,
				"skewY": 0,

				//以下无需设置
				"x1": -75,
				"x2": 75,
				"y1": -50,
				"y2": 50,

			},
			"imgae": {
				"msItemID": "",
				"msType": "normal",
				"mszIndex": 0,
				"msName": "图片", //名称
				"type": "msImage", //图片组件
				"version": "2.4.6",
				"originX": "left",
				"originY": "top",
				"left": 0,
				"top": 0,
				// "width": 128,
				// "height": 134,
				"fill": "rgb(0,0,0)",
				"stroke": null,
				"strokeWidth": 0,
				"strokeDashArray": null,
				"strokeLineCap": "butt",
				"strokeDashOffset": 0,
				"strokeLineJoin": "miter",
				"strokeMiterLimit": 4,
				"scaleX": 1,
				"scaleY": 1,
				"angle": 0,
				"flipX": false,
				"flipY": false,
				"opacity": 1,
				"shadow": null,
				"visible": true,
				"clipTo": null,
				"backgroundColor": "",
				"fillRule": "nonzero",
				"paintFirst": "fill",
				"globalCompositeOperation": "source-over",
				"transformMatrix": null,
				"skewX": 0,
				"skewY": 0,
				"crossOrigin": "",
				"cropX": 0, //图片水平偏移位置
				"cropY": 0, //图片垂直偏移位置
				"src": "bug.png", //图片应用地址
				"filters": [],
			}

		}
	},
	mutations: {
		addTimeLine: function (state, param) {
			state.curPage.timeLine.push({
				"id": param.id,
				"name": param.name,
				"action": []
			});

			this.commit('setCurTimeLine', param.id);
		},
		setCurTimeLine: function (state, timeLineId) {
			state.curTimeLineId = timeLineId;
		},
		changePageOrder: function (state, orderList) {
			if (orderList == null) {
				return;
			}
			for (var i = 0; i < state.sliderFile.page.length; i++) {
				var item = state.sliderFile.page[i];
				if (orderList[item.pageId] != null) {
					item.order = orderList[item.pageId];
				}
			}
			console.log(orderList);
			this.commit('setSliderPageSort');
		},
		getSliderFileData: function (state, file) {
			state.sliderFile = file;

			//state.curPageId = state.sliderFile.page[];
		},
		setSliderPageIndex: function (state) {
			if (state.sliderFile == null) {
				return {};
			}

			var indexPage = {};
			for (var i = 0; i < state.sliderFile.page.length; i++) {
				var page = state.sliderFile.page[i];
				indexPage[page.pageId] = i;
			}

			state.sliderPageIndex = indexPage;
		},
		setSliderPageSort: function (state) {
			if (state.sliderFile == null) {
				return [];
			}

			var sortPage = [];
			for (var i = 0; i < state.sliderFile.page.length; i++) {
				var page = state.sliderFile.page[i];
				sortPage.push({
					pageId: page.pageId,
					pageName: page.pageName,
					order: page.order,
					pageIndex: i,
					viewW: page.viewCanvasWidth,
					viewH: page.viewCanvasHeight
				});
			}

			sortPage.sort(function (a, b) {
				if (a.order > b.order) {
					return 1;
				} else {
					return -1;
				}
			});

			state.sliderPageSort = sortPage;
		},
		setCurPage: function (state, page) {
			var pageIndex = page;
			if (page == null) {
				state.curPageId = state.sliderPageSort[0].pageId;
				pageIndex = state.sliderPageIndex[state.curPageId];
			} else if (typeof (page) == "string") {
				state.curPageId = page;
				pageIndex = state.sliderPageIndex[page];
			} else {
				state.curPageId = state.sliderFile.page[pageIndex].pageId;
			}
			state.curPage = state.sliderFile.page[pageIndex];

			state.curObjectId = state.curPage.curObjectId;
			state.curSymbolId = state.curPage.curSymbolId;
			state.curTimeLineId = state.curPage.curTimeLineId;
		},
		addPage: function (state, param) {
			var pagefile = {
				"pageId": param.pageId,
				"pageName": param.pageName,

				"viewCanvasWidth": 375, //画布的宽度，画布为视区中的有效制作区域
				"viewCanvasHeight": 267, //画布的高度

				"viewMatchType": 0, //可选的方式，默认为0保持比例拉升（以最接近屏幕比例的方式对画布进行拉伸，不能覆盖的地方留白），1横向拉升（以横向宽度为准进行拉升，如果高度不足则留白，否则出现纵向滚动条），2纵向拉升（以纵向高度为基准进行拉升，如宽度不足则留白，否则出现横向滚动条），3全屏拉升（忽略屏幕比例，强制拉升画布到全屏，会出现比例失衡)，5不拉升（按照画布原始大小显示，如果超出则显示滚动条）

				"axisOn": false, //刻度显示选项
				"matrixOn": false, //网格线显示
				"matrixColor": "#8D8D8D", //网格线颜色
				"matrixBorderStyle": [1, 1], //网格线边框样式设置
				"martixAttach": true, //是否吸附网格线

				"guideLinesAttach": true, //是否吸附到辅助线
				"guideLinesColor": "#00ffff", //辅助线颜色

				"order": param.order, //排序

				"pageSwitchType": 0, //0正常，1左右滑动

				"timeLine": [{
					"id": "0",
					"name": "主时间线",
					"action": null
				}],

				"objects": [],


			}

			state.sliderFile.page.push(pagefile);
			this.commit('setSliderPageIndex');
			this.commit('setSliderPageSort');
			//this.commit("setCurPage", param.pageId);

		},
	},
	actions: {
		getSliderFileData(context) {
			return new Promise((resolve) => {
				axios.get(context.state.getFileUrl).then((response) => {
					context.commit('getSliderFileData', eval('(' + response.data + ')'));
					context.commit('setSliderPageIndex');
					context.commit('setSliderPageSort');
					context.commit('setCurPage');
					resolve();
				});
			});
		},
		saveSliderData(context, param) {

		}
	},
	getters: {

	}
})