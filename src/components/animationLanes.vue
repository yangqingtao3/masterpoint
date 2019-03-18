<template><!-- :style="{ 'height': (object.type=='group'?(21*object.objects.length):21) + 'px' }" -->
    <div class="animationLaneItem" :id="object.msItemID+'_lane'">
        <div class="row" @mousedown="objectActive(object.msItemID, object, $event)" :class="{'active': (object.msItemID in selectedObjectList)}">

            <template v-if="object.animationEle!=null">
                <div @mousedown="animationEleMove(object, $event)" class="item" :class="{itemActive:isActive(object.msItemID)}" :style="{left:findPosbyTime(object.animationEle.startTime)+1+'px', width:(findPosbyTime(object.animationEle.endTime)-findPosbyTime(object.animationEle.startTime)-1)+'px'}">
                    <div @mousedown="animationEleLeft(object, $event)" class="leftAux"></div>
                    <div @mousedown="animationEleRight(object, $event)" class="rightAux"></div>
                </div>
                <div class="keyFrame" v-for="kf in object.animationEle.keyFrame" :style="{left:findPosbyTime(kf)+findPosbyTime(object.animationEle.startTime)+'px'}"></div>
            </template>
        </div>
        <animationLanes v-show="open"  v-for='ob in object.objects' :object='ob' :selectedObjectList="selectedObjectList" :timeLines="timeLines" :timeLineMoveX="timeLineMoveX"/>
    </div>
</template>
<script type="text/javascript">
    import $$ from 'jquery'

    export default {
        name: 'animationLanes',
        props: ['object', "selectedObjectList","timeLines","timeLineMoveX"],
        components: {},
        data() {
            return {
                open: true,
                isLeftRightMove:false,
                isFocusItem:false,
            }
        },
        computed: {
            isFolder: function() {
                return this.object.objects && this.object.objects.length
            },
            upLevel:function(){
                var i =0;
                var o = this.object;
                while(o!=null && o.parent!=null){
                    o = o.parent;
                    i++;
                }
                return i;
            }
        },
        methods: {
            isActive:function(id){
                var $aniRef = this.$root.$children[0].$children[0].$refs.animation;
                if(id in $aniRef.lanesSelectedList){
                    return true;
                }

                return false;
            },
            findPosbyTime:function(time){
                return this.$root.$children[0].$children[0].$refs.animation.findPosbyTime(time);
            },
            findTimeByPos:function(pos){
                return this.$root.$children[0].$children[0].$refs.animation.findTimeByPos(pos);
            },
            toggle: function() {
                if(this.isFolder) {
                    this.open = !this.open;
                }
            },
            objectActive:function(id, object,e){
                //console.log(this);
                var $aniRef = this.$root.$children[0].$children[0].$refs.animation;
                $aniRef.objectActive(id, object, e);
                //$aniRef.timeLineAuxActive(e);
                if(!!this.isFocusItem){
                    e.stopPropagation();
                }
            },
            animationEleLeft:function(el, e){
                var _this = this;
                var item = el.animationEle;

                var $amRef = this.$root.$children[0].$children[0].$refs.animation;
                var $animationEL = $amRef.$el;
                var target = e.currentTarget, managerOffset = $$($animationEL).find(".ms-ani-manager").offset().left+270;
                var timelineWidth = $$($animationEL).find(".timeline").outerWidth();
                var $scroll = $$($animationEL).find(".ms-ani-manager .scroll");

                var itemStTime = item.startTime;
                var itemEdTime = item.endTime;

                var cursorPos = e.clientX - $$(target).parent().offset().left;

                var timeArray = _this.timeLines.timeArray;

                $amRef.lanesSelectedList = {};
                $amRef.lanesSelectedList[el.msItemID] = true;
                _this.isFocusItem = true;

                $$(document).on("mousemove.changeAnimationEleMove", function(e){

                    if(e.clientX < managerOffset || e.clientX > managerOffset+timelineWidth){

                        $scroll.scrollLeft($scroll.scrollLeft() - managerOffset + e.clientX);
                    }

                    var pos = e.clientX - managerOffset+ _this.timeLineMoveX;


                    var start_pos_move = pos;
                    var st_time = _this.findTimeByPos(start_pos_move);

                    if(st_time>itemEdTime){
                        var index = $amRef.jfgrid_searcharray(_this.timeLines.timeArray, itemEdTime);
                        st_time = _this.timeLines.timeArray[index-1];
                    }
                    else{
                        var attachIndex = $amRef.attachTimelineTick(start_pos_move);
                        if(attachIndex!=null){
                            st_time = timeArray[attachIndex];
                        }
                    }
                    

                    // var ed_time = st_time + minulsTime;

                    // if(ed_time>=timeArray[timeArray.length-1]){
                    //     ed_time = timeArray[timeArray.length-1];
                    //     st_time = ed_time - minulsTime; 
                    // }


                    $amRef.keyFrameGenerateAll(_this.object.animation, _this.object.curTimeLineId, {
                        "type":"left",
                        "st_time":st_time,
                        "origin_ed":itemEdTime,
                        "origin_st":itemStTime,
                    });

                    itemStTime = st_time;
                    //_this.st = st_time;
                    
                });

                $$(document).on("mouseup.changeAnimationEleMove", function(e){
                    $$(document).off(".changeAnimationEleMove");
                    _this.isLeftRightMove = false;
                    _this.isFocusItem = false;
                    _this.$store.dispatch("saveSliderData",{
                        
                    });
                });

                _this.isLeftRightMove = true;
                //e.stopPropagation();
            },
            animationEleMove:function(el, e){
                var _this = this;
                var item = el.animationEle;

                var $amRef = this.$root.$children[0].$children[0].$refs.animation;
                var $animationEL = $amRef.$el;
                var target = e.currentTarget, managerOffset = $$($animationEL).find(".ms-ani-manager").offset().left+270;
                var timelineWidth = $$($animationEL).find(".timeline").outerWidth();
                var $scroll = $$($animationEL).find(".ms-ani-manager .scroll");

                var itemStTime = item.startTime;
                var itemEdTime = item.endTime;

                var cursorPos = e.clientX - $$(target).offset().left;

                var minulsTime = itemEdTime - itemStTime;

                var timeArray = _this.timeLines.timeArray;

                $amRef.lanesSelectedList = {};
                $amRef.lanesSelectedList[el.msItemID] = true;
                _this.isFocusItem = true;

                if(_this.isLeftRightMove){
                    return;
                }

                $$(document).on("mousemove.changeAnimationEleMove", function(e){

                    if(e.clientX < managerOffset || e.clientX > managerOffset+timelineWidth){

                        $scroll.scrollLeft($scroll.scrollLeft() - managerOffset + e.clientX);
                    }

                    var pos = e.clientX - managerOffset+ _this.timeLineMoveX;


                    var start_pos_move = pos - cursorPos;
                    var st_time = _this.findTimeByPos(start_pos_move);

                    var attachIndex = $amRef.attachTimelineTick(start_pos_move);
                    if(attachIndex!=null){
                        st_time = timeArray[attachIndex];
                    }

                    var ed_time = st_time + minulsTime;

                    if(ed_time>=timeArray[timeArray.length-1]){
                        ed_time = timeArray[timeArray.length-1];
                        st_time = ed_time - minulsTime; 
                    }



                    // _this.st = st_time;
                    // _this.ed = ed_time;

                    $amRef.keyFrameGenerateAll(_this.object.animation, _this.object.curTimeLineId, {
                        "type":"move",
                        "st_time":st_time,
                        "ed_time":ed_time,
                        "origin_st":itemStTime,
                        "origin_ed":itemEdTime,
                    });

                    itemStTime = st_time;
                    itemEdTime = ed_time;
                    
                });

                $$(document).on("mouseup.changeAnimationEleMove", function(e){
                    $$(document).off(".changeAnimationEleMove");
                    _this.isFocusItem = false;
                    _this.$store.dispatch("saveSliderData",{
                        
                    });
                });
            },
            animationEleRight:function(el, e){
                var _this = this;
                var item = el.animationEle;

                var $amRef = this.$root.$children[0].$children[0].$refs.animation;
                var $animationEL = $amRef.$el;
                var target = e.currentTarget, managerOffset = $$($animationEL).find(".ms-ani-manager").offset().left+270;
                var timelineWidth = $$($animationEL).find(".timeline").outerWidth();
                var $scroll = $$($animationEL).find(".ms-ani-manager .scroll");

                var itemStTime = item.startTime;
                var itemEdTime = item.endTime;

                var cursorPos = e.clientX - $$(target).parent().offset().left + $$(target).parent().outerWidth();

                var timeArray = _this.timeLines.timeArray;

                $amRef.lanesSelectedList = {};
                $amRef.lanesSelectedList[el.msItemID] = true;
                _this.isFocusItem = true;

                $$(document).on("mousemove.changeAnimationEleMove", function(e){

                    if(e.clientX < managerOffset || e.clientX > managerOffset+timelineWidth){

                        $scroll.scrollLeft($scroll.scrollLeft() - managerOffset + e.clientX);
                    }

                    var pos = e.clientX - managerOffset+ _this.timeLineMoveX;


                    var end_pos_move = pos;
                    var ed_time = _this.findTimeByPos(end_pos_move);

                    if(ed_time<itemStTime){
                        var index = $amRef.jfgrid_searcharray(_this.timeLines.timeArray, itemStTime);
                        ed_time = _this.timeLines.timeArray[index+1];
                    }
                    else{
                        var attachIndex = $amRef.attachTimelineTick(end_pos_move);
                        if(attachIndex!=null){
                            ed_time = timeArray[attachIndex];
                        }
                    }
                    

                    //_this.ed = ed_time;

                    $amRef.keyFrameGenerateAll(_this.object.animation, _this.object.curTimeLineId, {
                        "type":"right",
                        "origin_st":itemStTime,
                        "ed_time":ed_time,
                        "origin_ed":itemEdTime,
                    });

                    itemEdTime = ed_time;
                    
                });

                $$(document).on("mouseup.changeAnimationEleMove", function(e){
                    $$(document).off(".changeAnimationEleMove");
                    _this.isLeftRightMove = false;
                    _this.isFocusItem = false;
                    _this.$store.dispatch("saveSliderData",{
                        
                    });
                });
                _this.isLeftRightMove = true;
                //e.stopPropagation();
            }
        }
    }
</script>


<style lang="scss">
@import '../assets/common.scss';

</style>