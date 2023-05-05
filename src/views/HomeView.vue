<template>
  <div class="home">
    <div v-if="!showVisible && !showPreview && !showResume">
      <nav>
        <div class="nav-home"></div>
      </nav>
      <img
        style="position: absolute"
        src="@/fonts/stransport.svg"
        alt=""
        class="stransport"
      />
      <div class="logo">
        <img src="@/fonts/slogo.svg" alt="" />
      </div>
      <!-- 简介 -->
      <div class="home-content" v-if="!showPreview">
        <p class="p1">Welcome to Hired!</p>
        <p class="p2">We help you create a stunning resume through chat.</p>
        <p class="p3">Let's begin!</p>
      </div>
      <!-- 简历信息预览 -->
      <!-- <div class="home-content" v-if="showPreview">
        <HistoryResume
          ref="historyResume"
          class="resumeListBox"
        ></HistoryResume>
      </div> -->

      <div class="btns">
        <div class="btn1" ref="btn1" @click="handleJob">
          <img src="@/fonts/sone.svg" alt="" />
        </div>
        <div class="btn2" ref="btn2" @click="handleInterest">
          <img src="@/fonts/sthree.svg" alt="" />
        </div>
        <div class="btn3" ref="btn3" @click="handleEducation">
          <img src="@/fonts/stwo.svg" alt="" />
        </div>
        <div class="btn" @click="showFn">
          <img src="@/fonts/sjia.svg" ref="btn" alt="" />
        </div>
      </div>

      <!-- 扫描二维码关注公众号 -->

      <van-loading
        type="spinner"
        v-if="checkLoading"
        class="loading"
        vertical
        color="#FFFFFF"
        text-color="#FFFFFF"
        size="50"
        >加载中...</van-loading
      >
      <van-overlay :show="isOverlay" />
      <div class="qcode" v-if="isCodeShow">
        <img src="@/assets/images/code.jpg" alt="二维码" />
      </div>
    </div>

    <div v-if="showVisible">
      <!-- chat组件框 -->
      <ChatPage
        ref="chat"
        :system-prompt="systemPrompt"
        :assistant-first-msg="assistantFirstMsg"
        :promptType="promptType"
        @preview="chatCompleteCallback"
      >
      </ChatPage>
    </div>

    <!-- preview page -->
    <div v-if="showPreview">
      <!-- <HistoryResume ref="historyResume" class="resumeListBox"></HistoryResume> -->
      <Preview
        ref="historyResume"
        class="resumeListBox"
        @handleJobOn="handleJob"
        @handleEducationOn="handleEducation"
        @handleInterestOn="handleInterest"
        @buildResume="buildResume"
      ></Preview>
    </div>

    <!-- resume page -->
    <div v-if="showResume">
      <Resume ref="resumeInfo"></Resume>
    </div>
  </div>
</template>

<script>
import ChatPage from "@/components/ChatPage.vue";
import Resume from "./ResumeView";
import Preview from "./UserPreview";
import service from "@/api/request";
import store from "../store";
import Vue from "vue";
import { Overlay } from "vant";
import { Toast } from "vant";
import { Loading } from "vant";
Vue.use(Overlay);
Vue.use(Loading);
import { getPrompt } from "@/utils/common";
export default {
  name: "HomeView",
  components: { ChatPage, Preview, Resume },
  data() {
    return {
      isOverlay: false,
      checkLoading: false,
      isCodeShow: false,
      cardItem: [],
      btnNum: 0,
      showVisible: false,
      showPreview: false,
      showResume: false,
      timer: null,
      systemPrompt: {},
      assistantFirstMsg: {},
      promptType: "education", // education 教育经历  job 工作经历,interest 个人爱好兴趣
      //生成简历-工作经验-prompt
      promptList: undefined,
      educationPrompt: undefined,
      professionalPrompt: undefined,
      interestPrompt: undefined,
      jobPrompt:
        "你是一名专业的简历写手，请根据提供的对话信息，按照以下格式生成中文简历的工作经历部分。简历内容必须基于对话中了解到的事实，不能有任何的编造。生成的简历内容必须要专业，每一个工作描述都需要结果导向，尽量专业、生动、展开详细描写。如果求职者没有提到工作经历中的相关软技能，请帮助补充完备。简历里的内容必须以bullet point方式来展示，不少于8个bullet points，每个bullet point不少于50字，内容必须充实丰富专业，最好有具体案例或者数字。\n" +
        "格式：\n" +
        "【工作经历开始】\n" +
        "工作职位\n" +
        "公司名称，开始时间 - 结束时间\n" +
        "- 工作内容及业绩亮点1\n" +
        "- 工作内容及业绩亮点2\n" +
        "- 工作内容及业绩亮点3\n" +
        "【工作经历结束】",
      //生成简历-学历教育-prompt
      eduPrompt:
        "你是一名专业的简历写手，请根据提供的对话信息，按照以下格式生成中文简历的教育经历部分。简历内容必须基于对话中了解到的事实，不能有任何的编造。生成的简历内容必须要专业，每一个教育经历描述都需要结果导向，尽量专业、生动、展开详细描写。如果求职者没有提到教育经历中的相关软技能，请帮助补充完备。简历里的内容必须以bullet point方式来展示，不少于8个bullet points，每个bullet point不少于50字，内容必须充实丰富专业，最好有具体案例或者数字。\n" +
        "格式：\n" +
        "【教育经历开始】\n" +
        "学校名称\n" +
        "所学专业,获得学位，开始时间 - 结束时间\n" +
        "- 教育经历及亮点1\n" +
        "- 教育经历及亮点2\n" +
        "- 教育经历及亮点3\n" +
        "【教育经历结束】",
      //生成简历-兴趣爱好-prompt
      interPrompt:
        "你是一名专业的简历写手，请根据提供的对话信息，按照以下格式生成中文简历的兴趣爱好、证书奖项、以及社会活动部分。简历内容必须基于对话中了解到的事实，不能有任何的编造。生成的简历内容必须要专业，必须以bullet point方式来展示，不少于8个bullet points，每个bullet point不少于20字，用词必须专业精炼。\n" +
        "格式：\n" +
        "【其他部分开始】\n" +
        "其他信息\n" +
        "-趣爱好、证书奖励、社会活动1\n" +
        "-兴趣爱好、证书奖励、社会活动2\n" +
        "- 兴趣爱好、证书奖励、社会活动3\n" +
        "【其他部分结束】",
      //简历对话-学历对话-prompt
      eduChatPrompt:
        "你是一名职业规划咨询师，现在你需要询问并了解求职者 [USER]的某一段教育经历，并据此给出职业规划建议。你会立即启动聊天，你问的第一个问题必须是：“您好，我将帮助您完成有关这段教育经历的简历内容，请问您正在就读或者已毕业的学校名称？” 根据[USER]的回答，你需要持续提问以便获得有价值的信息，包括GPA、学术成就、课外活动、实习经历等，用来丰富[USER]的简历。你必须知道学校名称、就读专业、获得的学位、以及教育开始时间和结束时间。你每次只能问一个问题，问的问题必须和[USER]的这段教育经历有关，且必须有助于理解教育经历，用来丰富并美化[USER]的简历。你需要至少问12个问题，最多问15个问题。如果你觉得收集的信息已经足够编写[USER]简历中的这段教育经历，必须发出这句结束语：“关于您的这段教育经历，我已经了解并收集了相关信息，我将为您生成简历内容，请点击【That's all】”",
      //简历对话-经验对话-prompt
      workChatPrompt:
        "你是一名职业规划咨询师，现在你需要询问并了解求职者 [USER]的某一段工作经历，并据此给出职业规划建议。你会立即启动聊天，你问的第一个问题必须是：“您好，我将帮助您完成有关这段工作经历的简历内容，请问您工作的公司或单位名称？” 根据[USER]的回答，你需要持续提问以便获得有价值的信息，用来丰富[USER]的简历。你必须知道公司名称、工作职位、以及工作开始时间和结束时间。你每次只能问一个问题，问的问题必须和[USER]的这段职业经历有关，且必须有助于理解工作内容，用来丰富并美化[USER]的简历。你需要至少问12个问题，最多问15个问题。如果你觉得收集的信息已经足够编写[USER]简历中的这段工作经历，必须发出这句结束语：“关于您的这段工作经历，我已经了解并收集了相关信息，我将为您生成简历内容，请点击【That's all】” ",
      //简历对话-兴趣对话-prompt
      intetChatPrompt:
        "你是一名职业规划咨询师，现在你需要询问并了解求职者 [USER]的个人兴趣爱好、获得的证书、获得的奖项、以及参加过的社会活动等信息，并据此给出职业规划建议。你会立即启动聊天，你问的第一个问题必须是：“您好，我将帮助您完成个人兴趣、获得的证书及奖项、参加过的社会活动等相关简历内容，请告诉我，您平时有哪些兴趣爱好？” 根据[USER]的回答，你需要持续提问以便获得有价值的信息，用来丰富[USER]的简历。你必须知道[USER]的兴趣爱好、获得的证书、获得的奖项、以及参加过的社会活动。你每次只能问一个问题，问的问题必须与[USER]的兴趣爱好、获得的证书及奖项、参加过的社会活动有关，且必须有助于丰富并美化[USER]的简历。你需要至少问12个问题，最多问15个问题。如果你觉得收集的信息已经足够编写[USER]简历中的兴趣爱好、获得的证书奖项、参加过的社会活动等有关内容，必须发出这句结束语：“关于您的兴趣爱好、证书奖项、以及社会活动，我已经了解并收集了相关信息，我将为您生成简历内容，请点击【That's all】” ",
      //工作对话默认第一句
      worrkFirstWord:
        "您好，我将帮助您完成有关这段工作经历的简历内容，请问您工作的公司或单位名称？",
      //教育对话默认第一句
      eduFirstWord:
        "您好，我将帮助您完成有关这段教育经历的简历内容，请问您正在就读或者已毕业的学校名称？",
      //兴趣对话第一句
      interFirstWord:
        "您好，我将帮助您完成个人兴趣、获得的证书及奖项、参加过的社会活动等相关简历内容，请告诉我，您平时有哪些兴趣爱好？",
    };
  },
  mounted() {
    var resume = store.state.resume;
    this.cardItem = resume;
    if (resume.length > 0) {
      //定位到preview页面
      this.showVisible = false;
      this.showPreview = true;
      this.showResume = false;
    }
  },
  // created() {
  //   window.addEventListener("popstate", this.onBackButtonPressed());
  // },

  // destroyed() {
  //   window.removeEventListener("popstate", this.onBackButtonPressed());
  // },

  methods: {
    //获取缓存中的对话prompt
    getPromptChat() {
      if (store.state.prompt === undefined) {
        getPrompt();
      }
      var prompt = store.state.prompt;
      console.log("获取存入缓存的prompt", prompt);
      this.promptList = prompt;
      this.educationPrompt = prompt?.educational;
      this.professionalPrompt = prompt?.professional;
      this.interestPrompt = prompt?.interests;
    },
    //点击展开收取选项卡
    showFn() {
      //判断是否关注了公众号
      var user = store.state.user;
      var token = store.state.token;

      //判断环境
      if (process.env.ENV === "production") {
        if (!token) {
          //未关注
          this.isOverlay = true;
          this.checkLoading = true;
          this.isCodeShow = false;
          service
            .post("/resume/user/checkUserSub", {
              openid: user.openid,
            })
            .then((res) => {
              console.log(res, "用户是否关注公众号");
              this.checkLoading = false;
              if (res.code != 0) {
                //打开二维码弹框
                Toast.fail("请关注公众号来获取更多功能体验");
                this.isOverlay = true;
                this.isCodeShow = true;
                this.listenPage();
                return false;
              } else {
                store.dispatch("changeSetting", res.data);
                this.isCodeShow = false;
                this.isOverlay = false;
                this.checkBtns();
              }
            })
            .catch(() => {
              this.isCodeShow = false;
              this.isOverlay = false;
              console.log("校验失败");
            });
        } else {
          //已关注
          this.checkBtns();
        }
      } else {

        this.checkBtns();
      }
    },

    listenPage() {
      var user = store.state.user;
      this.timer = setInterval(() => {
        //需要定时执行的代码
        service
          .post("/resume/user/checkUserSub", {
            openid: user.openid,
          })
          .then((res) => {
            if (res.code != 0) {
              // this.isCodeShow = false;
              // this.isOverlay = false;
            } else {
              store.dispatch("changeSetting", res.data);

              //清除多次执行定时器
              clearInterval(this.timer);

              location.reload();
            }
          });
      }, 5000);
    },

    //展开收缩按钮内容
    checkBtns() {
      this.getPromptChat();
      this.btnNum++;
      if (this.btnNum % 2 === 1) {
        this.$refs.btn1.style.animation = "showIn 0.5s 1";
        this.$refs.btn2.style.animation = "showIn 0.5s 1";
        this.$refs.btn3.style.animation = "showIn 0.5s 1";
        this.$refs.btn1.style.opacity = 1;
        this.$refs.btn2.style.opacity = 1;
        this.$refs.btn3.style.opacity = 1;
        this.$refs.btn.style.transform = "rotate(-45deg)";
      }
      if (this.btnNum % 2 === 0) {
        this.$refs.btn1.style.animation = "showOff 0.5s 1";
        this.$refs.btn2.style.animation = "showOff 0.5s 1";
        this.$refs.btn3.style.animation = "showOff 0.5s 1";
        this.$refs.btn1.style.opacity = 0;
        this.$refs.btn2.style.opacity = 0;
        this.$refs.btn3.style.opacity = 0;
        this.$refs.btn.style.transform = "rotate(0deg)";
      }
    },

    //点击获取教育经历
    handleEducation() {
      this.getPromptChat();
      this.systemPrompt = {
        role: "system",
        content: this.educationPrompt?.chat,
        // content: this.eduChatPrompt,
      };
      this.assistantFirstMsg = {
        role: "assistant",
        content: this.educationPrompt?.firstWord,
        // content: this.eduFirstWord,
      };
      this.promptType = "education";
      this.showVisible = true;
      this.showPreview = false;
    },
    //点击获取工作经历
    handleJob() {
      this.getPromptChat();
      this.systemPrompt = {
        role: "system",
        content: this.professionalPrompt?.chat,
        // content: this.workChatPrompt,
      };
      this.assistantFirstMsg = {
        role: "assistant",
        content: this.professionalPrompt?.firstWord,
        // content: this.worrkFirstWord,
      };
      this.promptType = "job";
      this.showVisible = true;
      this.showPreview = false;
    },

    //点击开启个人兴趣爱好对话
    handleInterest() {
      this.getPromptChat();
      this.systemPrompt = {
        role: "system",
        content: this.interestPrompt?.chat,
        // content: this.intetChatPrompt,
      };
      this.assistantFirstMsg = {
        role: "assistant",
        content: this.interestPrompt?.firstWord,
        // content: this.interFirstWord,
      };
      this.promptType = "interest";
      this.showVisible = true;
      this.showPreview = false;
    },

    //预览简历信息

    /**
     * 聊天完成的回调
     */
    chatCompleteCallback() {
      const currentMsg = Object.assign([], this.$refs["chat"].msg);
      this.showVisible = false;
      if (this.promptType === "education") {
        this.summaryEducationChat(currentMsg);
      } else if (this.promptType === "job") {
        this.summaryJobChat(currentMsg);
      } else if (this.promptType === "interest") {
        this.summaryInterest(currentMsg);
      }

      this.showPreview = true;
      this.$nextTick(() => {
        this.$refs["historyResume"].setInitPosition();
      });
    },
    /**
     * 将聊天记录开始总结教育经历
     */
    summaryEducationChat(history) {
      history[0]["content"] = this.educationPrompt.resumePreview;
      // if (history[history.length - 1]["role"] === "assistant") {
      //   history = history.slice(0, -1);
      // }
      console.log(history, "生成简历学历信息");

      service
        .post("/resume/Resume/chat", { msg: history })
        .then((res) => {
          console.log(res, "学历信息");
          this.handlePreviewData(res.data.content, "education");
        })
        .catch(() => {
          console.log("错误");
        });
    },
    /**
     * 将聊天记录开始总结工作经历
     */
    summaryJobChat(history) {
      history[0]["content"] = this.professionalPrompt.resumePreview;
      // if (history[history.length - 1]["role"] === "assistant") {
      //   history = history.slice(0, -1);
      // }
      console.log(history, "生成简历msg");

      service
        .post("/resume/Resume/chat", { msg: history })
        .then((res) => {
          console.log(res, "工作经验");
          this.handlePreviewData(res.data.content, "job");
        })
        .catch(() => {
          console.log("错误");
        });
    },

    //把聊天记录总结为个人兴趣爱好
    summaryInterest(history) {
      history[0]["content"] = this.interestPrompt.resumePreview;
      // if (history[history.length - 1]["role"] === "assistant") {
      //   history = history.slice(0, -1);
      // }
      console.log(history, "生成简历的个人兴趣部分");
      service
        .post("/resume/Resume/chat", { msg: history })
        .then((res) => {
          console.log(res, "兴趣爱好以及其他");
          this.handlePreviewData(res.data.content, "interest");
        })
        .catch(() => {
          console.log("错误");
        });
    },
    chatHistory2ConversationContext(history) {
      let result = "";
      history.forEach((item) => {
        if (item.role !== "system") {
          result += item.role + " : " + item.content + "\n";
        }
      });
      return result;
    },

    //处理要预览的简历信息
    handlePreviewData(data, type) {
      console.log(data, type, "生成的简历信息");

      var start_str = "";
      var end_str = "";
      var field = "";
      if (type === "job") {
        start_str = "【工作经历开始】";
        end_str = "【工作经历结束】";
        field = "Profession";
      } else if (type === "education") {
        start_str = "【教育经历开始】";
        end_str = "【教育经历结束】";
        field = "Education";
      } else if (type === "interest") {
        start_str = "【其他部分开始】";
        end_str = "【其他部分结束】";
        field = "Interests";
      }

      var arr = {
        id: 0,
        title: field,
        content: "",
      };
      var info = {
        study: "",
        uni: "--------- ---------",
        text: "",
      };

      var start_index = data.indexOf(start_str);
      var end_index = data.indexOf(end_str);
      if (start_index >= 0 && end_index >= 0) {
        info.text = data.slice(start_index + 9, end_index - 1);
      } else {
        info.text = "暂无";
      }
      arr.id = this.cardItem.length + 1;

      arr.content = info;
      this.cardItem.push(arr);

      console.log(this.cardItem, "4545484848");

      //缓存简历信息信息
      this.$store.dispatch("setResumeInfo", {
        info: this.cardItem,
      });

      this.$refs["historyResume"].pushContent(this.cardItem);
    },

    //生成简历
    buildResume() {
      console.log("get start resume");
      var resume = Object.assign([], this.$refs["historyResume"].cardList);
      console.log(resume, "简历信息");
      this.showPreview = false;
      this.showVisible = false;
      this.showResume = true;

      this.$nextTick(() => {
        this.$refs["resumeInfo"].getResumeInfo(resume);
      });
    },
  },
};
</script>

<style lang="scss">
body {
  background-color: #4e5fff;
}
.qcode {
  top: 50%;
  left: 50%;
  position: absolute;
  transform: translate(-50%, -50%);
  // width: 60%;
  // height: 30%;
  z-index: 999;
}
.loading {
  text-align: center;
  position: absolute !important;
  top: 50%;
  transform: translate(-50%, -50%);
  left: 50%;
  z-index: 100;
}
.home {
  background-color: #4e5fff;
  width: 100%;
  height: 100%;
  overflow: hidden;
  .stransport {
    width: 100%;
    height: 48rem;
    top: -1rem;
  }
}
.nav-home {
  width: 100%;
  height: 4.4rem;
  // background-color: skyblue;
}
.logo {
  display: flex;
  justify-content: center;
  margin-top: 7.5rem;
  margin-bottom: 4.5rem;
  & > img {
    width: 8.1rem;
    height: 8.1rem;
  }
  & > span {
    display: block;
    padding: 1rem;
    margin: 3rem auto 0;
    width: 20rem;
    font-weight: 700;
    font-size: 2rem;
    text-align: center;
    border: 1px solid #000;
  }
}
.home-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 90vw;
  margin: 0 auto;
  height: 38rem;
  overflow: scroll;
  // background-color: #fff;
  background-color: #4e5fff;
  color: #fff;
  p {
    font-family: "DM Sans";
    text-align: center;
    margin: 0 !important;
    padding: 0 !important;
  }
  .p1 {
    font-weight: 700;
    font-size: 2rem;
    text-align: center;
    line-height: 3rem;
    font-style: normal;
    margin-bottom: 1.1rem !important;
  }
  .p2 {
    margin-bottom: 2rem !important;
    font-weight: 400;
    font-size: 1.5rem;
    line-height: 2.5rem;
    opacity: 0.9;
  }
  .p3 {
    font-weight: 700;
    font-size: 1.6rem;
    line-height: 30px;
  }
  .questcontent {
    width: 76vw;
    padding: 2rem;
    border: 1px solid #000;
    border-radius: 1rem;
    margin: 1rem auto;
    line-height: 1.6rem;
  }
}
p {
  width: 76vw;
  font-size: 2rem;
  margin: 4rem 0 !important;
}
.btns {
  @keyframes showIn {
    0% {
      left: 0;
      top: 0;
      display: none;
      opacity: 0;
    }
    100% {
      display: block;
      opacity: 1;
    }
  }
  @keyframes showOff {
    0% {
      display: block;
      opacity: 1;
    }
    100% {
      left: 1rem;
      top: 0;
      display: none;
      opacity: 0;
    }
  }
  cursor: pointer;
  position: fixed;
  bottom: 6rem;
  width: 5.3125rem;
  height: 5.3125rem;
  left: 50%;
  transform: translateX(-50%);
  .btn {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    line-height: 5rem;
    font-size: 25px;
    font-weight: 700;
    & > img {
      transition: all 0.5s;
      width: 6.6rem;
      height: 6.6rem;
    }
  }
  .btn1,
  .btn2,
  .btn3 {
    opacity: 0;
    animation-fill-mode: forwards;

    img {
      width: 11.2rem;
      height: 11.2rem;
    }
  }
  .btn1 {
    overflow: hidden;
    box-sizing: border-box;
    position: absolute;
    top: -5rem;
    left: -7rem;
    transform: translate(-50%, -50%);
    // width: 3.3rem;
    // height: 3.3rem;
    // border-radius: 50%;
    font-size: 1.2rem;
    // padding: 0.3rem;
    text-align: center;
    // background-color: skyblue;
  }
  .btn2 {
    overflow: hidden;
    box-sizing: border-box;
    position: absolute;
    top: -5rem;
    left: 12rem;
    transform: translate(-50%, -50%);
    // width: 3.3rem;
    // height: 3.3rem;
    padding: 0.3rem;
    // border-radius: 50%;
    font-size: 1.2rem;
    text-align: center;
    // background-color: skyblue;
  }
  .btn3 {
    overflow: hidden;
    box-sizing: border-box;
    position: absolute;
    top: -15rem;
    left: 2.5rem;
    transform: translate(-50%, -50%);
    // width: 3.3rem;
    // height: 3.3rem;
    // padding: 0.3rem;
    // border-radius: 50%;
    text-align: center;
    // background-color: skyblue;
  }
}
</style>
