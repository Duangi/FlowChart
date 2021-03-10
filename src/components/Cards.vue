<template>
  <el-container>
    <el-header>
      <div>
        <el-button class="addNodeButton" type="primary" @click="addNodeSelectorShow = !addNodeSelectorShow">添加节点</el-button>
        <el-select class="addNodeSelector" v-model="value" v-show="addNodeSelectorShow"  placeholder="请选择" @change="addNode(value)">
          <el-option
            v-for="item in addOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>

      </div>
    </el-header>
    <el-main>
      <div class="container">

        <div v-for="(level,index) in nodeStruct" :key="index">
          <div v-for="(card,index) in level" :key="index" v-bind:id="card.nodeName" class="box" v-bind:style="card.style">
            <!--        如果直接设置el-card为draggable，会导致拖动的延迟很高，在外面套一个div，并将该div设置为draggable可以有效解决该问题-->
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <input class="cardname" :readonly="readonly" v-model="card.nodeName" ></input>
                <el-button class="cardbutton" type="danger" icon="el-icon-delete" circle @click="deleteCard(index)"></el-button>
                <el-button class="cardbutton" :type="edit_button_type" :icon="edit_button_icon"  circle @click="toggleEditable"></el-button>

              </div>

              <el-input
                type="textarea"
                class="cardcontent"
                :rows="3"
                :readonly = "readonly"
                autosize
                v-model="card.content">
              </el-input>
              <div>
                <el-row>
                  <el-col v-for="(branch,index) in card.branchArray" :key="index" :span="4">
                    <div class="buttoncontainer" v-bind:id="card.nodeName + branch.branchType">
                      <el-button type="text" class="deletebutton" v-show="!readonly" icon="el-icon-close" @click="deleteLink(card.nodeName,branch.branchType)"></el-button>
                      <!--                  <div v-bind:id="card.nodeName + branch.branchType" >{{ branch.branchType}}</div>-->
                      <el-button  class="linkbutton" type="primary" >{{ branch.branchType}}</el-button>
                    </div>

                  </el-col>


                  <el-select class="selector"  v-model="value" v-show="card.addselector" placeholder="请选择" >
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                  <el-button class="addbutton" type="primary" icon="el-icon-plus" circle @click="card.addselector = !card.addselector"></el-button>
                </el-row>

                <!--        <div class = "type"  v-for="(type,index) in card.linktype" :key="index">{{type}}</div>-->

              </div>
            </el-card>
          </div>
        </div>
        <div v-for="(card,index) in newNodes" :key="index" v-bind:id="card.nodeName" class="box">
          <!--        如果直接设置el-card为draggable，会导致拖动的延迟很高，在外面套一个div，并将该div设置为draggable可以有效解决该问题-->
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <input class="cardname" :readonly="readonly" v-model="card.nodeName" ></input>
              <el-button class="cardbutton" type="danger" icon="el-icon-delete" circle @click="deleteCard(index)"></el-button>
              <el-button class="cardbutton" :type="edit_button_type" :icon="edit_button_icon"  circle @click="toggleEditable"></el-button>

            </div>

            <el-input
              type="textarea"
              class="cardcontent"
              :rows="3"
              :readonly = "readonly"
              autosize
              v-model="card.content">
            </el-input>
            <div>
              <el-row>
                <el-col v-for="(branch,index) in card.branchArray" :key="index" :span="4">
                  <div class="buttoncontainer" v-bind:id="card.nodeName + branch.branchType">
                    <el-button type="text" class="deletebutton" v-show="!readonly" icon="el-icon-close" @click="deleteLink(card.nodeName,branch.branchType)"></el-button>
                    <!--                  <div v-bind:id="card.nodeName + branch.branchType" >{{ branch.branchType}}</div>-->
                    <el-button  class="linkbutton" type="primary" >{{ branch.branchType}}</el-button>
                  </div>

                </el-col>


                <el-select class="selector" v-show="card.addselector" placeholder="请选择" @change="addSelectorButtonClicked(value)">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
                <el-button class="addbutton" type="primary" icon="el-icon-plus" circle @click="card.addselector = !card.addselector"></el-button>
              </el-row>

              <!--        <div class = "type"  v-for="(type,index) in card.linktype" :key="index">{{type}}</div>-->

            </div>
          </el-card>
        </div>

        </div>
    </el-main>
  </el-container>
</template>

<script>
import SimpleFlowchart from 'vue-simple-flowchart';
import 'vue-simple-flowchart/dist/vue-flowchart.css';
import Button from "./Button";

export default {
  name: "cards",
  components: {Button, SimpleFlowchart},
  data(){
    return{
      readonly : true,
      edit_button_type : "primary",
      edit_button_icon : "el-icon-edit",
      //每一个节点都拥有它的按钮和按钮指向的节点
      cardInfo:{
        "code": "200",
        "reMsg": "查询成功",
        "speechcraftList": [
          {
            "nodeName": "开场白",
            "speechcraftNum": "2T001",
            "nodeState": "1",
            "tagIntention": [],
            "speechcraftContent": "家长，您好，我是轻轻家教的张老师，轻轻是国内专业家教平台，小学到高中所有科目都可以提供老师上门一对一辅导，您家孩子目前哪个科目比较薄弱一些呢？",
            "branchArray": [
              {
                "branchType": "肯定",
                "branchNode": "产品介绍"
              },
              {
                "branchType": "否定",
                "branchNode": "挽留"
              }
            ],
            "markupTags": []
          },
          {
            "nodeName": "产品介绍",
            "speechcraftNum": "2T001",
            "nodeState": "1",
            "tagIntention": [],
            "speechcraftContent": "产品介绍",
            "branchArray": [
              {
                "branchType": "成功结束",
                "branchNode": "再见"
              },
            ],
            "markupTags": []
          },
          {
            "nodeName": "挽留",
            "speechcraftNum": "2T001",
            "nodeState": "1",
            "tagIntention": [],
            "speechcraftContent": "挽留",
            "branchArray": [
              {
                "branchType": "成功结束",
                "branchNode": "再见"
              },
            ],
            "markupTags": []
          },

          {
            "nodeName": "再见",
            "speechcraftNum": "2T001",
            "nodeState": "1",
            "tagIntention": [],
            "speechcraftContent": "再见",
            "branchArray": [],
            "markupTags": []
          },
        ]
      },
      //
      travelsalList:[],
      travelsalListNames:[],
      //所有连线的集合
      branchList :[],
      // nodeNameList:[],
      //第一层的数据index=0，第二层index=1，以此类推
      nodeStruct:[],
      cardStruct:[
        {
          id:"node1",
          content:"这里是节点的内容这里是节点的内容这里是节点的内容这里是节点的内容这里是节点的内容这里是节点的内容这里是节点的内容",
          nodeName:"第一个节点",
            index:0,
            style:"top:0px;",
          branchArray:[
              {
                branchType:"正向",
                branchNode:"1",
              },
              {
                branchType:"拒绝",
                branchNode:"2",
              },
            ],
          addselector: false,
          },
        {
          id:"node2",
          content:"这里是节点的内容这里是节点的内容这里是节点的内容这里是节点的内容这里是节点的内容这里是节点的内容这里是节点的内容",
          nodeName:"第二个节点",
          index: 1,
          style:'top:350px;',
          branchArray:[
              {
                branchType:"结束",
                branchNode:"3",
              },
          ],
          addselector: false,

        },
        {
            id:"node3",
            content:"这里是节点的内容这里是节点的内容这里是节点的内容这里是节点的内容这里是节点的内容这里是节点的内容这里是节点的内容",
            nodeName:"这是第一个节点",
            index: 1,
            style:"top:350px;left:520px",
            branchArray:[
              {
                branchType:"结束",
                branchNode:"3",
              },
            ],
            addselector: false,

          },
        {
          id:"node4",
          content:"这里是节点的内容这里是节点的内容这里是节点的内容这里是节点的内容这里是节点的内容这里是节点的内容这里是节点的内容",
          nodeName:"第4个节点",
          index: 2,
          style:"top:700px;",
          branchArray:[
          ],
          addselector: false,
        },
      ],
      options: [{
        value: '正向',
        label: '正向'
      }, {
        value: '肯定',
        label: '肯定'
      }, {
        value: '拒绝',
        label: '拒绝'
      }, {
        value: '其他',
        label: '其他'
      }, {
        value: '待确认',
        label: '待确认'
      },{
        value: '待定',
        label: '待定'
      },{
        value: '快说',
        label: '快说'
      },{
        value: '投诉',
        label: '投诉'
      },{
        value: '重复',
        label: '重复'
      },{
        value: '确认',
        label: '确认'
      },{
        value: '参加',
        label: '参加'
      },{
        value: '在听',
        label: '在听'
      }
      ],
      value:"",
      addOptions: [{
        value: 1,
        label: '头节点'
      }, {
        value: 2,
        label: '普通节点'
      }, {
        value: 3,
        label: '尾节点'
      },
      ],
      //控制node添加selector的显示状况
      addNodeSelectorShow:false,
      newNodes:[],
    }
  },
  methods:{
    // 添加分支按钮按下
    addSelectorButtonClicked(value){
      console.log("当前选择：" +value);
    },
    toggleEditable(){
      //如果当前处于不能编辑状态，则将状态修改，并修改图标为保存
      if (this.readonly){
        this.readonly = !this.readonly;
        this.edit_button_type = "success";
        this.edit_button_icon = "el-icon-check"
      }else{//否则修改编辑状态，并将图标进行替换
        this.readonly = !this.readonly;
        this.edit_button_type = "primary";
        this.edit_button_icon = "el-icon-edit";
      }
    },
    deleteLink(nodeName,branchType){
      this.removeNode(nodeName+branchType);
      console.log(nodeName+branchType + "已被删除")
      //删除结构中的数据
      for (let i = 0;i<this.cardInfo.speechcraftList.length;i++){
        if(this.cardInfo.speechcraftList[i].nodeName == nodeName){
          for(let k = 0;k<this.cardInfo.speechcraftList[i].branchArray.length;k++){
            if(this.cardInfo.speechcraftList[i].branchArray[k].branchType == branchType){
              //找到该节点，并将该节点删除
              this.cardInfo.speechcraftList[i].branchArray.splice(k,1);
              return;
            }
          }
        }
      }
    },
    orderData(cardInfo){
      let dataJson = JSON.stringify(cardInfo);
      let data = JSON.parse(dataJson);
      let nodeList = data.speechcraftList;

      //获取头节点
      for(let i=0; i<nodeList.length;i++){
        //如果获取的是头节点
        if(nodeList[i].nodeState == 1){
          let nodeInfo = {
            nodeName:"",
            content:"",
            index:0,
            style:"",
            branchArray:"",
            addselector:false,
          };
          // console.log("找到头节点");
          //删除该元素并添加到list，并将所有分支节点的名字添加到list
          nodeInfo['nodeName'] = nodeList[i].nodeName;
          nodeInfo['content'] = nodeList[i].speechcraftContent;
          nodeInfo['index'] = 0;
          nodeInfo['style'] = "top:"+(nodeInfo['index'] * 350)+"px;";
          nodeInfo['branchArray'] = nodeList[i].branchArray;
          let nodeLevel = [];
          nodeLevel.push(nodeInfo);
          this.nodeStruct.push(nodeLevel);
          this.travelsalListNames.push(nodeInfo['nodeName']);
          // console.log(nodeInfo['nodeName']+"节点已被加入");
          for(let j = 0;j<nodeList[i].branchArray.length;j++){
            let branchInfo = {
              branchNode:"",
              index:0,
            };
            branchInfo['branchNode'] = nodeList[i].branchArray[j].branchNode;
            // console.log(branchInfo['branchNode'] + "节点创建完成");
            branchInfo['index'] = 1;
            //初始化连线
            let line = {
              source:"",
              target:""
            };
            let btnName = nodeList[i].nodeName + nodeList[i].branchArray[j].branchType;
            line['source'] = btnName;
            // this.addPoint(btnName,'Bottom');
            line['target'] = nodeList[i].branchArray[j].branchNode;
            //将连线加入list
            this.branchList.push(line);
            // console.log(line['source']+"->"+line['target']+" 连线 已被加入");
            this.travelsalList.push(branchInfo);
            this.travelsalListNames.push(branchInfo['branchNode']);
            // console.log(branchInfo['branchNode'] + "已经被加入遍历数组");
          }
          nodeList.splice(i,1);
          this.nodeTraversal(nodeList);
          break;
        }
      }
    },
    nodeTraversal(nodeList){
      //当应该遍历的数组为空，则表示遍历结束，退出遍历
      if(this.travelsalList.length == 0){
        return;
      }
      // for(let i = 0;i<this.travelsalList.length;i++){
      //   console.log("当前遍历数组中还剩:"+this.travelsalList[i].branchNode + "节点")
      // }
      // for(let i = 0;i<nodeList.length;i++){
      //   console.log("当前nodeList中还剩:"+nodeList[i].nodeName + " 节点")
      // }
      // 遍历所有list中上一层访问到的节点
      for(let i = 0 ; i < this.travelsalList.length;i++){
        //获取该节点的name
        let name = this.travelsalList[i].branchNode;
        //获取该节点的index 和 x
        let currentIndex = this.travelsalList[i].index;
        let currentX = this.travelsalList[i].x;
        //通过name从nodeList中找到对应的node
        let nodeIndex = -1;
        // console.log("当前正在寻找" + name + "节点");
        for(let j=0;j<nodeList.length;j++){
          // console.log("当前节点为" + nodeList[j].nodeName);
          if(nodeList[j].nodeName == name){
            nodeIndex = j;
            // console.log("从nodeList中找到" + nodeList[j].nodeName);
            break;
          }
        }
        if(nodeIndex != -1){
          // console.log("当前正在遍历 "+nodeList[nodeIndex].nodeName+" 节点")
          // this.addPoint(nodeList[nodeIndex].nodeName,"Top");
          let nodeInfo = {
            nodeName:"",
            content:"",
            index:0,
            style:"",
            branchArray:"",
            addselector:false,
          };
          nodeInfo['nodeName'] = nodeList[nodeIndex].nodeName;
          nodeInfo['content'] = nodeList[nodeIndex].speechcraftContent;
          nodeInfo['index'] = currentIndex;
          nodeInfo['style'] = "top:"+(nodeInfo['index'] * 350)+"px;";
          nodeInfo['branchArray'] = nodeList[i].branchArray;
          if (currentIndex+1 > this.nodeStruct.length){
            let nodeLevel = [];
            nodeLevel.push(nodeInfo);
            this.nodeStruct.push(nodeLevel);
          }
          else{
            this.nodeStruct[currentIndex].push(nodeInfo);
          }


          //将所有连线添加到branchList
          for (let j=0; j<nodeList[nodeIndex].branchArray.length;j++){
            let line = {
              source:"",
              target:""
            };
            let btnName = nodeList[nodeIndex].nodeName + nodeList[nodeIndex].branchArray[j].branchType;
            line['source'] = btnName;
            // this.addPoint(btnName,"Bottom");

            line['target'] = nodeList[nodeIndex].branchArray[j].branchNode;
            // console.log(line['source']+"->"+line['target']+" 连线 已被加入");
            this.branchList.push(line);
            //将该node的所有分支节点<不重复的>添加到应该遍历的list中
            for (let k =0;k<nodeList[nodeIndex].branchArray.length;k++){
              let branchInfo = {
                branchNode:"",
                index:0,
              };
              if(this.travelsalListNames.indexOf(nodeList[nodeIndex].branchArray[k].branchNode) == -1){
                branchInfo['branchNode'] = nodeList[nodeIndex].branchArray[k].branchNode;
                branchInfo['index'] = currentIndex+1;
                if (branchInfo['index'] + 1 > this.nodeStruct.length)
                this.travelsalList.push(branchInfo);
                this.travelsalListNames.push(branchInfo['branchNode']);
                // console.log(nodeList[nodeIndex].branchArray[k].branchNode + "已被添加到遍历数组");
              }
            }

          }
          //把当前节点从遍历list中移除
          nodeList.splice(nodeIndex,1);
          this.travelsalList.splice(i,1);
          // for(let i = 0;i<nodeList.length;i++){
          //   console.log("当前nodeList中还剩:"+nodeList[i].nodeName + " 节点")
          // }
          //继续遍历
          this.nodeTraversal(nodeList);
        }
      }
    },
    calculatePosition(){
      for(let i =0 ;i<this.nodeStruct.length;i++){
        for(let j=0;j<this.nodeStruct[i].length;j++){
          let top = this.nodeStruct[i][j].index * 350;
          let left = j * 520;
          this.nodeStruct[i][j].style = "top:+"+ top +"px;left:"+left+"px"
        }
      }
    },
    //传入一个node的name，该函数默认给card加上上断点，用于连线
    addPoint(nodeName,position,maxConnections=1){
      let ins = this.$jsPlumb;
      let common = {
        isSource: true,
        isTarget: true,
        connector: ['Bezier'],
        maxConnections: maxConnections
      }
      ins.ready(function(){
        ins.addEndpoint(nodeName,{
          anchors:[position]
        },common)
      })
      console.log(nodeName+"节点已经添加端点");
    },
    addAllPoint(){
      for (let i = this.nodeStruct.length-1;i>=0;i--){
        for (let j=0;j<this.nodeStruct[i].length;j++){
          //给每一个非头节点添加上endPoint
          if(i != 0){
            this.addPoint(this.nodeStruct[i][j].nodeName,"Top",-1);
          }
          //给每一个按钮加上endPoint
          for(let k=0;k<this.nodeStruct[i][j].branchArray.length;k++){
            let btnName = this.nodeStruct[i][j].nodeName + this.nodeStruct[i][j].branchArray[k].branchType;
            this.addPoint(btnName,"Bottom");
          }
        }
      }
    },
    addAllLines(){
      let ins = this.$jsPlumb;
      let lines = this.branchList;
      ins.ready(function(){
        for (let i = 0;i<lines.length;i++){
          ins.connect({
              source:lines[i].source,
              target:lines[i].target,
              endpoint:"Dot",
            }
          );
        }
      })
    },
    removeNode(nodeName){
      let ins = this.$jsPlumb;

      ins.ready(function(){
        ins.remove(nodeName);
      })
    },
    addNode(value){
      let nodeInfo = {
        'nodeName' : '',
        'speechcraftNum':"2T001",
        'nodeState' : value,
        'tagIntention' : [],
        'speechcraftContent':"",
        'branchArray':[],
        'markupTags':[],
      }
      //将新节点添加到
      this.newNodes.push(nodeInfo);

    }
  },
  mounted() {
    this.orderData(this.cardInfo);
    //this.addPoint("开场白肯定")

    this.calculatePosition();
    let ins = this.$jsPlumb;
    let list = this.travelsalListNames;
    let branchList = this.branchList;
    this.addAllPoint();
    this.addAllLines();
    // this.addPoint("开场白肯定","Bottom");
    // this.addPoint("开场白否定","Bottom");
    ins.ready(function(){
      ins.draggable(list);
    })


  }


}
</script>

<style scoped>
  .addbutton{
    float: right;
    margin-right: 10px;
  }
  .addNodeButton{
    float: left;
  }
  .addNodeSelector{
    float: left;
  }
  .box {
    position: absolute;
    height: 0px;
    width: 480px;
    top:0px;
  }
  .box-card{
    /*position: absolute;*/
    width: 480px;
    /*display: inline-block;*/
  }
  .buttoncontainer{
    position: relative;
  }
  .card-level{
    /*position: relative;*/
    /*display: block;*/
  }
  .cardname{
    float: left;
    margin-left: 5px;
    margin-top: 10px;
  }
  .cardbutton{
    float: right;
    margin-right: 10px;
  }

  .cardcontent{
    margin-bottom: 30px;
  }
  .container {
    position: relative;
    padding: 20px;
    width: 100%;
    height: 800px;
  }
  .deletebutton{
    /*z-index: 5;*/
    position: absolute;
    top: -10px;
    right: -5px;
    color: white;
  }
  .deletebutton:hover{
    color: red;
  }
  .linkbutton{
    z-index: -1;
  }
  .text {
    font-size: 14px;
  }

  .type{
    border-radius: 30px
  }
  .item {
    margin-bottom: 18px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }
  .selector{
    float: right;
  }
</style>
