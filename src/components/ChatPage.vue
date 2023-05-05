<template>
  <div class="chat" ref="chating">
    <!-- 头部 -->
    <nav id="nav">
      <div class="nav">
        <img src="@/fonts/daohang.svg" alt="svg" class="dh" />
        <div class="title">
          <img src="@/fonts/logo.svg" alt="logo" />
        </div>
      </div>
    </nav>

    <!-- 聊天内容 -->
    <div class="content" id="scroll" ref="contheight">
      <template v-for="(item, index) in [...msg]">
        <!-- 用户信息 -->
        <div v-if="item.role === 'user'" v-bind:key="index" class="tello">
          <div class="right">
            <div class="span1">
              {{ item.content }}
            </div>
            <!-- <img src="@/fonts/ready.svg" alt="" /> -->
          </div>
        </div>
        <!-- AI消息 -->
        <div
          v-else-if="item.role === 'assistant'"
          v-bind:key="index"
          class="tellt"
        >
          <div class="left">
            <img src="@/fonts/loading.svg" alt="" />
            <span class="span2">{{ item.content }}</span>
          </div>
        </div>
      </template>
    </div>

    <!-- 聊天输入框 -->
    <div class="input" ref="picker">
      <div class="btn-box">
        <div class="btn" v-show="btnshow" @click="getTextCompiled">
          <img src="@/fonts/ready.svg" alt="" class="btnstyle" />
          <span ref="stop">That's All</span>
        </div>
        <!-- <div
          class="btn"
          style="float: right; text-align: center"
          @click="getSuggest"
        >
          <span>AI建议</span>
        </div> -->
      </div>

      <!--  v-on:blur="blurbtn"  @blur="blurbtn" @blur="getHeight"-->
      <textarea
        @focus="getHeight"
        v-on:focus="getbtn"
        @keydown="getHeight"
        type="text"
        class="msg"
        placeholder="Your message..."
        :rows="rows"
        v-model="currentMsg"
        @keyup.enter="ask"
        ref="address"
        :disabled="disInput"
        @click="scrollUp"
      ></textarea>
      <div class="fixbox">
        <img src="@/fonts/chatfly.svg" alt="send" class="send" @click="ask" />
        <!--  @click="pickeron" -->
        <img
          src="@/fonts/slight.svg"
          alt="before"
          class="before"
          v-if="pickershow"
          @click="getSuggest"
        />
        <img
          src="@/fonts/after.svg"
          alt="after"
          class="after"
          v-else
          @click="pickerout"
        />
        <div class="white"></div>
      </div>
      <van-popup v-model="showPicker">
        <div class="picker" style="height: 25rem" v-if="!pickershow">
          <div class="picker-top">
            <div class="quxiao" @click="onCancel()">Cancel</div>
            <div class="sugmsg">Suggested Messages</div>
            <div class="queren" @click="onConfirm">Confirm</div>
          </div>
          <div class="picker-item" v-loading="pickerData">
            <div
              v-show="!pickerData"
              v-for="(item, index) in columns"
              class=""
              :key="index"
              ref="item"
              @click="itemFn(index)"
            >
              <div class="dots" ref="itemdots"></div>
              <div class="dotitem">{{ item }}</div>
            </div>
          </div>
        </div>
        <!-- <van-picker
              title=""
              show-toolbar
              :columns="columns"
              @confirm="onConfirm"
              @cancel="onCancel"
              @change="onChange"
            /> -->
      </van-popup>
    </div>
    <!--这个是内容占位，用于底部内容区增高-->
    <div class="suffix-placeholder"></div>
  </div>
</template>

<script>
import service from "@/api/request";
import Vue from "vue";
import { Toast } from "vant";
import store from "../store";
Vue.use(Toast);
export default {
  name: "ChatView",
  props: {
    systemPrompt: {
      type: Object,
      default() {
        return {};
      },
    },
    assistantFirstMsg: {
      type: Object,
      default() {
        return {};
      },
    },
    promptType: {
      type: String,
      default() {
        return "";
      },
    },
  },
  data() {
    return {
      msg: [],
      currentMsg: "",
      chooseMsg: "",
      resultHtml: "",
      rows: "1",
      chatLoading: false,
      controller: undefined,
      btnshow: false,
      suggestMsg: [],
      suggest_count: 0,
      pickershow: true,
      showPicker: false,
      pickerData: true,
      isAsk: true,
      disInput: false,
      columns: [],
      // columns: ['问题1凑字数问题1凑字数问题1凑字数问题1凑字数问题1凑字数问题1凑字数问题1凑字数问题1凑字数问题1凑字数问题1凑字数','问题2','问题3'],
      //学历对话建议
      suggestEducation:
        "你是一名优秀的求职者，需要回答面试官[USER]提的问题。你必须给出三个不同的优质答案，答案用[回答1][回答2][回答3]来作为开头，每个答案必须从不同的角度来分析并回答问题，要求语气专业、用词精炼，给面试官留下最佳印象。",
      //经验对话建议
      suggestWork:
        "你是一名优秀的求职者，需要回答面试官[USER]提的问题。你必须给出三个不同的优质答案，答案用[回答1][回答2][回答3]来作为开头，每个答案必须从不同的角度来分析并回答问题，要求语气专业、用词精炼，给面试官留下最佳印象。",
      //个人兴趣爱好建议
      suggestInterest:
        "你是一名优秀的求职者，需要回答面试官[USER]提的问题。你必须给出三个不同的优质答案，答案用[回答1][回答2][回答3]来作为开头，每个答案必须从不同的角度来分析并回答问题，要求语气专业、用词精炼，给面试官留下最佳印象。",
    };
  },
  created() {
    console.log("重新创建chat", this.promptType);
    this.msg.push(this.systemPrompt);
    this.msg.push(this.assistantFirstMsg);
    this.suggestMsg.push({
      role: "user",
      content: this.assistantFirstMsg.content,
    });

    /**
     * 处理iOS 微信客户端6.7.4 键盘收起页面未下移bug
     */
    /iphone|ipod|ipad/i.test(navigator.appVersion) &&
      document.addEventListener(
        "blur",
        (e) => {
          // 这里加了个类型判断，因为a等元素也会触发blur事件
          ["input", "textarea"].includes(e.target.localName) &&
            document.body.scrollIntoView(false);
        console.log("apple");
        },
        true
      );
    var userAgent = navigator.userAgent;
    var isAndroid = userAgent.indexOf('Android') > -1 || userAgent.indexOf('Adr') > -1;
    var isiOS = !!userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    if (isiOS) {
        // alert("apple")
        console.log("apple");
    }
    if (isAndroid) {
        // alert("Android");
        console.log("Amdroid");
    }
    if(/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)){
		console.log("iOS");//iOS
    // alert("apple")
	}
  },
  mounted() {
    var prompt = store.state.prompt;

    var educationPrompt = prompt.educational;
    var professionalPrompt = prompt.professional;
    var interestPrompt = prompt.interests;

    this.suggestWork = professionalPrompt.suggest;
    this.suggestEducation = educationPrompt.suggest;
    this.suggestInterest = interestPrompt.suggest;

    if(/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)){
		console.log("iOS");//iOS
    // alert("apple")
var page = document.querySelector('.chat')
var prePlace = document.querySelector('#scroll')
var sufPlace = document.querySelector('.suffix-placeholder')
var fixedEle = document.querySelector('#nav')
var scrollTop = null // 计算div.page应该滚动的距离
var currentInput = null // 当前聚焦的输入框
var keyboardHeight = 0 // 软键盘高度
// 初始化的时候就要记录了，因为这里有个很奇怪的现象，ios软键盘出现后，window.innerHeight会随着webview自身的滚动而变化，用document.documentElement.offsetHeight和window.visualViewport.height 也是，不知道是什么影响了。
// 滚动时收起软键盘
function stopMove () {
    if (currentInput) {
        currentInput.blur()
        currentInput = null
        window.removeEventListener('touchmove', stopMove)
        window.removeEventListener('scroll', handleScroll)
        fixedEle.style.top = 0
    }
}
// webview发生平移，则及时更新fixed元素的定位
function handleScroll () {
    fixedEle.style.top = `${window.pageYOffset}px`
}

function handleFocusin (e) {
    var el = e || window.event
    // 在本身有输入框处于聚焦状态软键盘出现时，点击聚焦另外的输入框
    if (currentInput) {
        currentInput = el.target
        return
    }
    // 添加滚动监听，为了软键盘出现 以及 从一个聚焦输入框聚焦到另外一个输入框时， 重新定位fixed元素（其实这里不用滚动事件监听变化也可以用setTimeout来更新定位）
    window.addEventListener('scroll', handleScroll)
    currentInput = el.target
    // 监听移动手势：
    // 1. 在软键盘出现后，如果想要滚动，则收起软键盘，解绑webview的滚动监听事件
    // 2. 在软键盘出现后，用户主动收起软键盘（如点击软键盘的收起/完成等按钮），此时用户没有做移动手势，那么就会在收起软键盘后只要做了移动手势，就仍然触发绑定事件，达到解绑滚动监听事件的目的，阻止监听到webview回弹效果导致的固定顶部元素发生位移。
    window.addEventListener('touchmove', stopMove)
}

page.addEventListener('focusin', handleFocusin)

    }
  },
  methods: {
    ask() {
      this.$refs.address.style.height = "auto";
      // this.btnshow = false;

      if (this.disInput) {
        Toast.fail("请点击That's all 查看信息");
        return false;
      }
      if (!this.currentMsg) {
        Toast.fail("消息不能为空");
        return false;
      }

      if (!this.isAsk) {
        Toast.fail("消息回复中");
        return false;
      }
      // 往消息数组推送一条消息
      this.msg.push({ role: "user", content: this.currentMsg });
      this.suggestMsg.push({ role: "assistant", content: this.currentMsg });
      this.currentMsg = "";
      this.toAsk();
      setTimeout(() => {
        this.handleScrollBottom();
      }, 200);
    },
    toAsk() {
      this.chatLoading = true;
      this.getHeight();
      this.isAsk = false;
      service
        .post("/resume/Resume/chat", { msg: this.msg })
        .then((res) => {
          //如果会话结束，提示点击That's all 去获取预览报告
          if (res.data.content.indexOf("【That's all】") >= 0) {
            // res.data.content = res.data.content.replace(
            //   "[END]",
            //   "点击【That's all 】去生成预览信息"
            // );
            this.disInput = true;
          }

          this.msg.push(res.data);

          this.suggestMsg.push({ role: "user", content: res.data.content });
          this.isAsk = true;
          this.chatLoading = false;
          this.handleScrollBottom();
        })
        .catch(() => {
          console.log("错误输出");
          this.chatLoading = false;
          this.isAsk = true;
        });
    },
    // 动态选项框高度
    contheight() {
      this.$refs.contheight.className = " content contheight";
    },
    // 滚动到底部
    handleScrollBottom() {
      this.$nextTick(function () {
        var div = document.getElementById("scroll");
        div.scrollTop = div.scrollHeight;
      });
    },

    getbtn() {
      console.log(this.$refs.chating.offsetHeight);
      // this.$refs.chating.height = `calc(100% - window.innerHeight - (this.$refs.picker.offsetTop - window.pageYOffset) - (this.$refs.picker.offsetHeight))`
      console.log(this.$refs.chating.offsetHeight);
      this.btnshow = true;
      this.showPicker = false;
      this.pickershow = true;
      this.$refs.contheight.className = "content";
      this.$refs.picker.className = "input";
    },
    getHeight() { 
      this.timer = setTimeout(() => {
        this.$refs.address.style.height = "auto";
        this.$refs.address.style.height = `${
          this.$refs.address.scrollHeight / 10
        }rem`;
        console.log(window.innerHeight - (this.$refs.contheight.offsetTop - window.pageYOffset) - (this.$refs.contheight.offsetHeight));
        if (this.$refs.address.scrollHeight <= 234) {
          this.$refs.contheight.style.height = `calc(100vh - 9.5rem - ${this.$refs.address.style.height}`;
        } else {
          this.$refs.contheight.style.height = `calc(100vh - 9.5rem - 23.4rem`;
        }
        this.handleScrollBottom();
      }, 20);
    },
    
    scrollUp(){
      let pendingUpdate = false;

        function viewportHandler() {
          if (pendingUpdate) return;
          pendingUpdate = true;

          requestAnimationFrame(() => {
            pendingUpdate = false;
            
            // Stick to top
            document.querySelector('[data-stickto="top"]').style.transform = `translateY(${ Math.max(0, window.visualViewport.offsetTop)}px)`;
            
            // Stick to bottom
            if (window.visualViewport.offsetTop >= 0) {
              document.querySelector('[data-stickto="bottom"]').style.transform = `translateY(-${Math.max(0, window.innerHeight - window.visualViewport.height - window.visualViewport.offsetTop)}px)`;
            }
          });
        }

        window.visualViewport.addEventListener("scroll", viewportHandler);
        window.visualViewport.addEventListener("resize", viewportHandler);
    },
    blurbtn() {
      this.btnshow = false;
      this.$refs.contheight.className = " content";
      window.scroll(0, 0);
      this.handleScrollBottom();
    },

    //简历预览
    getTextCompiled() {
      console.log("go to get textCompiled");
      this.$emit("preview");
    },

    //为获取AI建议将两种角色对话点到，即用为是提问者，AI为回答者
    reserveMsg() {},
    //获取AI建议
    getSuggest() {
      if (this.disInput) {
        Toast.fail("请点击That's all 查看信息");
        return false;
      }
      this.contheight();
      this.showPicker = true;
      this.pickershow = false;
      this.pickerData = true;
      this.isAsk = false;
      this.$refs.picker.className = "input input-active";
      this.columns = [];
      this.handleScrollBottom();
      // var str =
      //   "[回答1] 在大学期间，我参加了学校的ACM程序设计竞赛，并获得了省级三等奖的好成绩。这个比赛不仅考验了我的编程能力，也锻炼了我的团队协作和解决问题的能力。 [回答2] 我在大学期间积极参加了学校的志愿者活动，曾经担任过志愿者队长，组织过多次社区义工活动和校内公益活动。这些经历让我更加关注社会问题，也提高了我的组织和沟通能力。 [回答3] 我在大学期间参加了学校的创新创业大赛，和我的团队一起开发了一款智能家居控制系统，并获得了校级二等奖的好成绩。这个比赛不仅锻炼了我的创新能力和实践能力，也让我更加了解了市场需求和商业模式。";

      // console.log("[回答1]出现的位置", str.indexOf("[回答1]"));
      // console.log("[回答2]出现的位置", str.indexOf("[回答2]"));
      // console.log("[回答3]出现的位置", str.indexOf("[回答3]"));
      // console.log("回答1内容是", str.slice(5, 79));
      // console.log("回答2内容是", str.slice(84, 165));
      // console.log("回答3内容是", str.slice(165));
      // this.columns.push(str.slice(5, 79));
      // this.columns.push(str.slice(84, 165));
      // this.columns.push(str.slice(170));
      // console.log(this.columns);
      // this.pickerData=false
      // this.pickeron();
      // return false;

      if (this.currentMsg) {
        this.suggestMsg.push({
          role: "user",
          content: this.currentMsg,
        });
      }

      var suggest_system =
        "你是一名优秀的求职者，根据面试者[USER]的问题回答问题。可以给出超过一个回答，但是每个回答必须从不同的角度。语气专业、用词精炼。每个回答前用[回答1][回答2][回答3]标识。";
      if (this.promptType === "job") {
        suggest_system = this.suggestWork;
      } else if (this.promptType === "education") {
        suggest_system = this.suggestEducation;
      } else if (this.promptType === "interest") {
        suggest_system = this.suggestInterest;
      }

      if (this.suggest_count <= 0) {
        this.suggestMsg.unshift({
          role: "system",
          content: suggest_system,
        });
      }

      console.log(this.suggestMsg);
      console.log("get AI suggest");

      //访问chat接口
      service
        .post("/resume/Resume/chat", { msg: this.suggestMsg })
        .then((res) => {
          this.isAsk = true;
          console.log(res, "get suggest chat");
          this.suggest_count = this.suggest_count + 1;
          if (this.currentMsg) {
            this.suggestMsg = this.suggestMsg.slice(0, -1);
          }
          this.handleSuggest(res.data.content);
          console.log(this.suggestMsg);
        })
        .catch(() => {
          this.isAsk = true;
          console.log("错误输出");
        });
    },

    //处理ai建议结果，回显到页面中
    handleSuggest(data) {
      var content = data;
      this.columns = [];
      var aanswer1 = content.indexOf("[回答1]");
      var aanswer2 = content.indexOf("[回答2]");
      var aanswer3 = content.indexOf("[回答3]");
      if (aanswer1 < 0) {
        //不存在回答1-3
        this.columns.push(content);
      } else {
        //存在回答1-3，回答1肯定是有的，判断回答2-3
        if (aanswer2 > 0) {
          this.columns.push(content.slice(aanswer1 + 5, aanswer2));
          if (aanswer3 > 0) {
            this.columns.push(content.slice(aanswer2 + 5, aanswer3));
            this.columns.push(content.slice(aanswer3 + 5));
          } else {
            this.columns.push(content.slice(aanswer2 + 5));
          }
        }
      }

      console.log(this.columns);
      this.pickerData = false;
      // this.pickeron();
    },

    // 点击出现picker
    pickeron() {
      this.btnshow = false;
      this.showPicker = true;
      this.pickershow = false;
      this.$refs.picker.style.animation = "scrollup 1s 1";
      this.$refs.contheight.className = " content contheight";
      this.$refs.picker.className = "input input-active";
      this.getHeight();
    },
    pickerout() {
      clearTimeout();
      this.showPicker = false;
      this.pickershow = true;
      console.log(this.$refs.picker);
      this.$refs.contheight.className = "content";
      this.$refs.picker.className = "input";
    },
    // picker 建议栏 确定
    onConfirm() {
      // this.currentMsg = value
      clearTimeout();
      this.currentMsg = this.chooseMsg;
      this.$refs.contheight.className = "content";
      this.$refs.picker.className = "input";
      this.showPicker = false;
      this.pickershow = true;
      this.$refs.address.focus();
      this.getHeight();
      setTimeout(() => {
        this.handleScrollBottom();
      }, 200);
      // Toast(`当前值：${value}, 当前索引：${index}`);
    },
    // 取消
    onCancel() {
      clearTimeout();
      this.$refs.contheight.className = "content";
      this.$refs.picker.className = "input";
      this.showPicker = false;
      this.pickershow = true;
      // Toast('取消');
    },
    // 点击获取问题
    itemFn(index) {
      for (var i = 0; i < this.columns.length; i++) {
        this.$refs.item[i].className = "";
        this.$refs.itemdots[i].className = "dots";
      }
      this.chooseMsg = this.columns[index];
      this.$refs.item[index].className = "active";
      this.$refs.itemdots[index].className = "dots active";
    },
  },
};
</script>

<style lang="scss">
.home {
  // height: 61.25rem;
  background-color: #f5f5f5;
}
html {
  background-color: #fff;
}
.chat {
  // height: 100%;
  background-color: #fff;
  width: 100%;
  padding-top: 6.5rem;
  padding-bottom: 10rem;
  box-sizing: border-box;
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
}
nav {
  position: fixed;
  top: 0;
}
.nav {
  box-sizing: border-box;
  position: fixed;
  top: 0;
  left: 0;
  transform: translateZ(0);
  -webkit-transform: translateZ(0);
  width: 100%;
  height: 6.5rem;
  padding-top: 2.7rem;
  display: flex;
  align-items: center;
  background-color: #fff;
  .dh {
    margin-left: 2.9rem;
  }
  img {
    width: 2.9rem;
    height: 2.9rem;
  }
  .title {
    margin-left: 7.7rem;
    display: flex;
    align-items: center;
    img {
      width: 10rem;
      height: 4rem;
    }
  }
}
.clearfix {
  content: ".";
  display: block;
  height: 0;
  clear: both;
  visibility: none;
}
.content {
  box-sizing: border-box;
  transform: translateZ(0);
  -webkit-transform: translateZ(0);
  position: absolute;
  box-sizing: border-box;
  width: 100%;
  height: calc(100vh - 16.5rem);
  max-height: 80vh;
  margin: 0 auto;
  padding-top: 3.4rem;
  padding-bottom: 6rem;
  background-color: #fff;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  .tello,
  .tellt {
    width: 90vw;
    clear: both;
    margin: 2.8rem auto;
  }
  .tello img {
    margin-left: 1.3rem;
  }
  .tellt img {
    margin-right: 1.6rem;
  }
  img {
    width: 3.8rem;
    height: 3.8rem;
  }
  .right {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    border: 1px solid transparent;
    .span1 {
      right: 4rem;
      max-width: 21.7rem;
      min-height: 2.1rem;
      line-height: 2.1rem;
      font-size: 1.4rem;
      font-weight: 400;
      border-radius: 1.5rem 0 1.5rem 1.5rem;
      padding: 1.2rem 2rem;
      color: #fff;
      background-color: #4e5fff;
    }
  }
  .left {
    position: relative;
    display: flex;
    align-items: center;
    border: 1px solid transparent;
    img {
      position: absolute;
      width: 3rem;
      height: 3rem;
      top: -1.5rem;
      left: -1rem;
    }
    .span2 {
      margin-left: 0.5rem;
      max-width: 21.7rem;
      min-height: 2.1rem;
      padding: 1.2rem 2rem;
      line-height: 2.1rem;
      font-size: 1.4rem;
      font-weight: 400;
      background-color: #f4f4f4;
      color: #656565;
      border-radius: 0 1.5rem 1.5rem 1.5rem;
    }
  }
}
.contheight {
  height: calc(100vh - 37.5rem) !important;
}
// 隐藏滚动条
::-webkit-scrollbar {
  width: 0;
  height: 0;
  color: transparent;
}
.input {
  z-index: 9999;
  // height: 5.2rem;
  width: 100%;
  margin: 0 auto;
  position: fixed;
  transform: translateZ(0);
  -webkit-transform: translateZ(0);
  bottom: 0rem;
  // left: 5vw;
  background-color: transparent;
  ::-webkit-input-placeholder {
    font-size: 1.2rem;
    color: #474847;
    opacity: 0.5;
    line-height: 2rem;
  }
  .msg {
    box-sizing: border-box;
    width: 88vw;
    // height: 5.5rem;
    height: auto;
    max-height: 25.3rem;
    overflow: scroll;
    font-size: 1.4rem;
    // border-radius: 1rem;
    border: 1px solid #e5e5e5;
    outline: none;
    padding-right: 4rem;
    padding-top: 1.5rem;
    padding-left: 1rem;
    padding-bottom: 1rem;
    line-height: 1.7rem;
    letter-spacing: 0.12rem;
  }
  .btn {
    float: right;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    position: relative;
    left: -0.1rem;
    bottom: 2rem;
    padding: 1.2rem 2rem;
    // margin-left: 1rem;
    width: 13.6rem;
    height: 4.8rem;
    border-radius: 1.5rem;
    font-size: 1.2rem;
    font-family: "DM Sans";
    background-color: #fff;
    color: #4e5fff;
    font-weight: 700;
    border: 0.2rem solid #4e5fff;
    .btnstyle {
      // position: absolute;
      // top: -1rem;
      // left: -1.5rem;
      width: 2.4rem;
      height: 2.4rem;
      font-weight: 700;
      margin-right: 1rem;
    }
    span {
      white-space: nowrap;
    }
  }
  .fixbox {
    position: relative;
  }
  .send {
    position: absolute;
    bottom: -0.65rem;
    right: 4.6rem;
    transform: translateY(-50%);
    width: 3rem;
    height: 3rem;
  }
  .before,
  .after {
    z-index: 999;
    position: absolute;
    bottom: -0.65rem;
    right: 0.6rem;
    transform: translateY(-50%);
    width: 3rem;
    height: 3rem;
    background-color: #fff;
  }
  .white {
    position: absolute;
    bottom: -2.55rem;
    right: 0rem;
    transform: translateY(-50%);
    width: 4.5rem;
    height: 4.7rem;
    background-color: #fff;
  }
  .van-popup {
    z-index: 0 !important;
    position: static !important;
    -webkit-transform: none;
    transform: none;
    animation: scrollup 0.95s 1;
  }

  .picker {
    box-sizing: border-box;
    overflow: scroll;
    width: 100%;
    background-color: #f4f4f4;
    padding-top: 4.4rem;
    // border-radius: 1rem;
    .picker-top {
      width: 100%;
      position: absolute;
      bottom: 20.6rem;
      background: #f4f4f4;
      z-index: 999;
      height: 4.4rem;
      line-height: 4.4rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 1.4rem;
      .queren {
        padding: 0 1.6rem;
        color: #576b95;
      }
      .quxiao {
        padding: 0 1.6rem;
        color: #969799;
      }
      .sugmsg {
        font-family: "DM Sans";
        font-weight: 700;
        font-size: 1.4rem;
        line-height: 2.1rem;
        color: #000;
      }
    }
    .picker-item {
      position: relative;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      justify-content: center;
      // align-items: center;
      & > div:not(.el-loading-mask) {
        line-height: 1.5rem;
        margin: 0.7rem 2rem;
        padding: 0.5rem;
        border-radius: 1rem;
        text-align: left;
        font-size: 1.4rem;
        background-color: #fff;
        color: #656565;
        font-weight: 400;
        line-height: 2.1rem;
        font-family: "DM Sans";
        display: flex;
        align-items: center;
        .dots {
          box-sizing: border-box;
          margin-right: 0.6rem;
          padding: 0.35rem;
          border-radius: 50%;
          background: #d9d9d9;
        }
        .active {
          background: #4f60ff;
        }
      }
      .active {
        background-color: #fff;
        // color: #000;
      }
    }
  }
  @keyframes scrollup {
    0% {
      transform: translateY(34rem);
    }
    100% {
      transform: translateY(0rem);
    }
  }
  @keyframes scrolldown {
    0% {
      transform: translateY(0rem);
    }
    100% {
      transform: translateY(25rem);
    }
  }
  .van-overlay {
    z-index: 0 !important;
    position: relative !important;
    top: auto !important;
    left: auto !important;
  }
  .btn-box {
    // display: flex;
  }
}
.input-active {
  width: 100% !important;
  left: 0 !important;
  .msg {
    width: 88vw !important;
  }
  // .picker {
  //   box-sizing: border-box;
  //   width: 100% !important;
  //   background-color: #f4f4f4;
  //   padding-top: 4.4rem;
  // }
}
.chat .el-loading-spinner {
  transform: translate(0rem, 184%);
  margin-top: 0rem !important;
}

@media all and (max-width:767px){
  .chat{
    position: absolute;
    padding: 0px;
  }
  #nav{
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
  }
  .nav{
    padding:0px;
    transform: initial;
    -webkit-transform: initial;
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    height: 71px;
  }
  .content{
    left: 0;
    bottom: initial !important;
    top: 0;
    background: red;
    height: 50px !important;
    transform: initial;
    -webkit-transform: initial;
    padding: 0;
    margin-top: 71px;
  }
  .input{
    position: absolute;
    transform: initial;
    -webkit-transform: initial;
    bottom: 0;
  }
}
</style>
