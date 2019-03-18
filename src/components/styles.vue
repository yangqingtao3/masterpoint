<template>
      <div class="ms-obeject-config">
          <el-checkbox-group v-model="filterCheckBox">
            <div>
              <el-checkbox label="Sepia">Sepia</el-checkbox>
            </div>
            <div>
              <el-checkbox label="BlackWhite">BlackWhite</el-checkbox>
            </div>
            <div>
              <el-checkbox label="Brownie">Brownie</el-checkbox>
            </div>
            <div>
              <el-checkbox label="Polaroid">Polaroid</el-checkbox>
            </div>
            <div>
              <el-checkbox label="Invert">Invert</el-checkbox>
            </div>
            <div>
              <el-checkbox label="Kodachrome">Kodachrome</el-checkbox>
            </div>
          </el-checkbox-group>
          {{filterCheckBox}}
    </div>
</template>

<script>

  import $$ from 'jquery'

  export default {
    props:["sliderCanvas"],
    data: () => ({
      filterCheckBox:[],
    }),
    watch:{
      filterCheckBox:function(newV, oldV){
        var _this = this;
        var objects = _this.sliderCanvas.getActiveObjects();
        for(var i=0;i<objects.length;i++){
          var o = objects[i];
          if(o.type=="msImage"){
            var img = o.img.cloneAsImage();
            img.filters = [];
            if(newV.length==0){
              img.filters = [];
            }
            else{
                  for(var f=0;f<newV.length;f++){
                        //console.log(newV[f]);
                    _this.$parent.applyFilters(img, newV[f]);
                  }
            }
            console.log(img);
            img.applyFilters();
            o.fill = new fabric.Pattern(
                {
                    source: img.getElement(),
                    repeat: o.fill.repeat,
                    offsetX:o.fill.offsetX,
                    offsetY:o.fill.offsetY,
                }
            )
          }
        }
        _this.sliderCanvas.renderAll();
      }
    },
    computed:{

    },
    methods:{
      objectGroup:function(){
        this.sliderCanvas.getActiveObject().toGroup();
      },
      objectUnGroup:function(){
        this.sliderCanvas.getActiveObject().toActiveSelection();
      }
    },
  }
</script>

<style lang="scss">
  @import '../assets/common.scss';

  .ms-obeject-config{
      @extend %position;
      left: 40px;

      div {
        margin-top:20px;
        margin-left:20px;
      }
    }
</style>
