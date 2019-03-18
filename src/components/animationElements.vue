<template><!-- :style="{ 'height': (object.type=='group'?(21*object.objects.length):21) + 'px' }" -->
    <div class="animationElementsItem">
      <div :style="{left:10*upLevel+'px'}" class="row" @mousedown="objectActive(object.msItemID, object, $event)" :class="{'active': (object.msItemID in selectedObjectList)}">
        <div class="group" v-if="isFolder" @click="toggle">
          <i :class="[open?'el-icon-caret-bottom':'el-icon-caret-right']"></i>
        </div>
        <div class="icon">
          <i :class="[objectIcon[object.type]]"></i>
        </div>
        <div class="name">
          {{object.msName}}
        </div>
      </div>
      <div class="hide">
        <i class="el-icon-circle-plus-outline"></i>
      </div>
      <div class="lock">
        <i class="el-icon-circle-plus-outline"></i>
      </div>
      <template v-if='isFolder'>
        <animationElements v-show="laneLinks(open, ob.msItemID)"  v-for='ob in object.objects' :object='ob' :selectedObjectList="selectedObjectList" :objectIcon="objectIcon" />
      </template>
    </div>
</template>
<script type="text/javascript">
    import $$ from 'jquery'

    export default {
        name: 'animationElements',
        props: ['object', "selectedObjectList", "objectIcon"],
        components: {},
        data() {
            return {
                open: true
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
            toggle: function() {
                if(this.isFolder) {
                    this.open = !this.open;
                }
            },
            laneLinks:function(open, id){
                var $aniRef = this.$root.$children[0].$children[0].$refs.animation;
                if(open){
                    //console.log(id, open, $$($aniRef.$el).find("." + id + "_lane"));
              
                        $$("#"+id+"_lane").show();
           
                    
                }
                else{
                    //console.log(id,open, $$(id+"_lane"));
                    //console.log(id,open, $$($aniRef.$el).find("." + id + "_lane"));
                
                        $$("#"+id+"_lane").hide();
          
                }
                return open;
            },
            objectActive:function(id, object,e){
                //console.log(this);
                this.$root.$children[0].$children[0].$refs.animation.objectActive(id, object,e);
            }
        }
    }
</script>


<style lang="scss">
@import '../assets/common.scss';

</style>