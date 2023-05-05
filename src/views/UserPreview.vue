<template>
  <div class="resume">
    <div class="mask">
      <div class="drawer">
        <div class="title">
          <!-- <img src="@/fonts/sback.svg" alt="back" class="back" /> -->
          <img src="@/fonts/daohang.svg" alt="svg" class="dh" />
          <h2>User preview</h2>
        </div>
        <div
          class="content"
          v-loading="textLoading"
          v-if="cardList.length > 0"
          id="preview"
        >
          <div
            class="education"
            v-for="(item, index) in cardList"
            :key="item.id"
          >
            <div class="title">
              <h3>{{ item.title }}</h3>
              <div class="option">
                <img src="@/fonts/sedit.svg" alt="" @click="editFn(index)" />
                <img src="@/fonts/scan.svg" alt="" @click="deleFn(index)" />
              </div>
            </div>
            <div class="message">
              <span ref="education" v-if="item.content.text.length > 0">
                <!-- {{ item.content }} -->
                <!-- <h4 class="study">{{ item.content.study }}</h4>
                <div class="uni">{{ item.content.uni }}</div> -->
                <div class="text" style="white-space: pre-line">
                  {{ item.content.text }}
                </div>
              </span>
              <img src="@/fonts/sworking.svg" alt="" v-else />
            </div>
          </div>

          <!-- 占位加载 -->
          <div class="education" v-if="previewLoading">
            <div class="title">
              <h3>-----------</h3>
              <div class="option">
                <img src="@/fonts/sedit.svg" alt="" />
                <img src="@/fonts/scan.svg" alt="" />
              </div>
            </div>
            <div class="message">
              <img
                src="@/fonts/sworking.svg"
                alt=""
                style="margin: 0 auto; margin-top: 1.9rem"
              />
            </div>
          </div>
        </div>
        <div class="popmask" ref="popup">
          <div class="popup">
            <span class="t1">Delete experience?</span>
            <span class="t2">This experience will be permanently deleted</span>
            <div class="popsel">
              <div @click="noFn">Cancle</div>
              <div @click="yesFn">Delete</div>
            </div>
          </div>
        </div>
        <div class="popmaskt" ref="popupt">
          <div class="popup">
            <!-- <textarea type="text" v-model="editmsg.study"></textarea>
            <textarea type="text" v-model="editmsg.uni"></textarea> -->
            <textarea
              type="text"
              v-model="editmsg.text"
              @input="getHeight"
              @click="getHeight"
              ref="address"
            ></textarea>
            <div class="popsel">
              <div @click="notFn">Cancle</div>
              <div @click="yestFn">Edit</div>
            </div>
          </div>
        </div>
        <!-- <img src="@/assets/images/resume.png" alt="" /> -->
        <div class="btnfix" v-if="!textLoading && !previewLoading">
          <div class="btns">
            <!-- <div class="tishimsg" ref="btn4">
            <div class="t1">Add aditional experiences</div>
            <div class="t2">
              Aliquet id neque eleifend pretium id eget risus enim nunc.
            </div>
            <div class="t3">Got it!</div>
           
          </div> -->
            <div class="btn1" ref="btn1" @click="handleJobOn">
              <img src="@/fonts/sone.svg" alt="" />
            </div>
            <div class="btn2" ref="btn2" @click="handleInterestOn">
              <img src="@/fonts/sthree.svg" alt="" />
            </div>
            <div class="btn3" ref="btn3" @click="handleEducationOn">
              <img src="@/fonts/stwo.svg" alt="" />
            </div>
            <div class="btn" @click="showFn">
              <img src="@/fonts/sjia.svg" ref="btn" alt="" />
            </div>
          </div>
          <div class="build" @click="buildResume">Build my resume</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import store from "../store";
export default {
  name: "AboutView",
  data() {
    return {
      popmsg: 0,
      btnNum: 0,
      delindex: 0,
      editindex: 0,
      textLoading: true,
      previewLoading: false,
      editmsg: {
        study: "",
        uni: "",
        text: "",
      },
      cardList: [
        {
          id: 1,
          title: "Profession",
          content: {
            study: "",
            uni: "",
            text: "暂无信息",
          },
        },
        // {
        //   id: 2,
        //   title: "Education",
        //   content: {
        //     study: "",
        //     uni: "",
        //     text:
        //       "郑州大学\n" +
        //       "计算机科学与技术,2015.09 - 2019.06\n" +
        //       "- 计算机网络\n" +
        //       "- C语言\n" +
        //       "- 后端开发\n" +
        //       "- 服务器原理\n",
        //   },
        // },
      ],
    };
  },
  methods: {
    pushContent(item) {
      this.cardList = item;
      this.sortResume();
      if (this.cardList.length > 0) {
        this.textLoading = false;
      } else {
        this.textLoading = false;
        this.empty = true;
      }
      this.previewLoading = false;
    },

    //占位信息位置开启加载
    setInitPosition() {
      console.log("开始加载占位");
      this.previewLoading = true;
    },
    getHeight() {
      this.timer = setTimeout(() => {
        this.$refs.address.style.height = "auto";
        this.$refs.address.style.height = `${
          this.$refs.address.scrollHeight / 10
        }rem`;
      }, 20);
    },
    // 点击删除按钮
    deleFn(index) {
      this.$refs.popup.style.display = "block";
      this.delindex = index;
      console.log(this.delindex);
    },
    yesFn() {
      this.cardList.splice(this.delindex, 1);
      this.$refs.popup.style.display = "none";
      //缓存简历信息信息
      this.$store.dispatch("setResumeInfo", {
        info: this.cardList,
      });
    },
    noFn() {
      this.$refs.popup.style.display = "none";
    },
    //点击编辑按钮
    editFn(index) {
      // let c = prompt("请输入专业", this.editmsg.study);
      // let b = prompt("请输入学校", this.editmsg.uni);
      // let a = prompt("请输入内容", this.editmsg.text);
      // if (a) {
      //   this.cardList[index].content.text = a;
      // }
      // if (b) {
      //   this.cardList[index].content.uni = b;
      // }
      // if (c) {
      //   this.cardList[index].content.study = c;
      // }
      this.getHeight();
      this.$refs.popupt.style.display = "block";
      // this.editmsg.study = this.cardList[index].content.study;
      // this.editmsg.uni = this.cardList[index].content.uni;
      this.editmsg.text = this.cardList[index].content.text;
      this.editindex = index;
    },
    notFn() {
      this.$refs.popupt.style.display = "none";
    },
    yestFn() {
      console.log(this.editmsg.study);
      this.cardList[this.editindex].content.study = this.editmsg.study;
      this.cardList[this.editindex].content.uni = this.editmsg.uni;
      this.cardList[this.editindex].content.text = this.editmsg.text;
      this.$refs.popupt.style.display = "none";
      //缓存简历信息信息
      this.$store.dispatch("setResumeInfo", {
        info: this.cardList,
      });
    },
    //点击展开收取选项卡
    showFn() {
      this.btnNum++;
      if (this.btnNum % 2 === 1) {
        clearTimeout(this.timer);
        this.$refs.btn1.style.animation = "showIn 0.5s 1";
        this.$refs.btn2.style.animation = "showIn 0.5s 1";
        this.$refs.btn3.style.animation = "showIn 0.5s 1";
        this.$refs.btn1.style.opacity = 1;
        this.$refs.btn2.style.opacity = 1;
        this.$refs.btn3.style.opacity = 1;
        this.$refs.btn1.style.display = "block";
        this.$refs.btn2.style.display = "block";
        this.$refs.btn3.style.display = "block";
        // this.$refs.btn4.style.opacity = 0;
        this.$refs.btn.style.transform = "rotate(-45deg)";
      }
      if (this.btnNum % 2 === 0) {
        clearTimeout(this.timer);
        this.$refs.btn1.style.animation = "showOff 0.5s 1";
        this.$refs.btn2.style.animation = "showOff 0.5s 1";
        this.$refs.btn3.style.animation = "showOff 0.5s 1";
        this.$refs.btn1.style.opacity = 0;
        this.$refs.btn2.style.opacity = 0;
        this.$refs.btn3.style.opacity = 0;
        this.timer = setTimeout(this.stylenoneFn, 600);
        // this.$refs.btn4.style.opacity = 1;
        this.$refs.btn.style.transform = "rotate(0deg)";
      }
    },
    stylenoneFn() {
      this.$refs.btn1.style.display = "none";
      this.$refs.btn2.style.display = "none";
      this.$refs.btn3.style.display = "none";
    },
    handleJobOn() {
      this.$emit("handleJobOn");
    },
    handleEducationOn() {
      this.$emit("handleEducationOn");
    },
    handleInterestOn() {
      this.$emit("handleInterestOn");
    },

    //生成简历
    buildResume() {
      console.log("go to build resume");
      this.$emit("buildResume");
    },

    //resume 排序
    sortResume() {
      //信息排序，学历和经验各自放在一起
      var workList = [];
      var eduList = [];
      var interList = [];

      this.cardList.forEach((item) => {
        if (item.title === "Profession") {
          workList.push(item);
        } else if (item.title === "Education") {
          eduList.push(item);
        } else if (item.title === "Interests") {
          interList.push(item);
        }
      });
      var resume = eduList.concat(workList);
      resume = resume.concat(interList);
      this.cardList = resume;
      //缓存简历信息信息
      this.$store.dispatch("setResumeInfo", {
        info: resume,
      });
    },

    //preview内容自动滚动到底部
    // 滚动到底部
    handleScrollBottom() {
      this.$nextTick(function () {
        var div = document.getElementById("preview");
        div.scrollTop = div.scrollHeight;
      });
    },
  },
  mounted() {
    var resume = store.state.resume;
    this.handleScrollBottom();
    if (resume.length > 0) {
      this.cardList = resume;
      this.sortResume();
      this.textLoading = false;
    }
  },
};
</script>

<style lang="scss">
html {
  background-color: #fff;
}
.resume {
  width: 100%;
  height: 100%;
}
.mask {
  width: 100vw;
  //   height: 100vh;
  overflow-y: scroll;
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  background-color: #f7f7f7;
  .drawer {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    bottom: 0;
    background-color: #f7f7f7;
    // border-radius: 4rem 4rem 0 0;
    box-shadow: 3rem 3rem 3rem 3rem rgba(0, 0, 0, 0.03);
    .title {
      width: 80vw;
      margin: 0 auto;
    }
    .title {
      position: relative;
      margin: 3.6rem auto 2.7rem;
      font-weight: 800;
      font-size: 2rem;
      display: flex;
      img {
        width: 2.4rem;
        height: 2.4rem;
      }

      //   text-align: center;
      h2 {
        margin-left: 1.4rem;
        font-family: "Dm Sans";
        font-weight: 700;
        font-size: 1.8rem;
        line-height: 2.3rem;
        // text-align: center;
        letter-spacing: 0;
        color: #040415;
      }
    }
  }
  //删除框样式
  .popmask {
    transform: scale(1.2);
    display: none;
    z-index: 99;
    width: 100%;
    height: 100vh;
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    background-color: rgba($color: #000, $alpha: 0.2);
  }
  .popup {
    box-sizing: border-box;
    width: 25rem;
    position: absolute;
    padding: 1.2rem 1.2rem 0;
    display: flex;
    flex-direction: column;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    // border: 1px solid rgba($color: #4e5fff, $alpha: 0.5);
    border-radius: 1rem;
    // box-shadow: 0 0 1rem rgba($color: #4e5fff, $alpha: 0.5);
    // display: flex;
    flex-direction: column;
    span {
      font-family: "Dm Sans";
      // text-align: center;
      letter-spacing: 0;
      text-align: center;
    }
    .t1 {
      font-weight: 700;
      font-size: 1.4rem;
      line-height: 2.3rem;
      color: #040415;
    }
    .t2 {
      font-weight: 500;
      font-size: 1.2rem;
      line-height: 2.3rem;
      padding: 0 2.8rem;
      color: #656565;
    }
    .popsel {
      display: flex;
      justify-content: space-between;
      border-top: 0.01rem solid rgba(0, 0, 0, 0.05);
      div {
        cursor: pointer;
        // background-color: #4e5fff;
        // color: #fff;
        font-family: "Dm Sans";
        letter-spacing: 0;
        font-weight: 700;
        font-size: 1.4rem;
        line-height: 2.3rem;
        text-align: center;
        color: #4e5fff;
        padding: 0.8rem 3.38rem;
        border-radius: 0.5rem;
        & > :first-child {
          border-right: 0.01rem solid rgba(0, 0, 0, 0.08);
        }
      }
    }
  }
  .content {
    font-family: "DM Sans";
    // max-height: calc(100% - 8.8rem - 14rem);
    overflow: scroll;
    background-color: #f7f7f7;
    padding-top: 0;
    & > div {
      box-sizing: border-box;
      width: 31rem;
      overflow: hidden;
      margin: 0 auto 1.7rem;
      padding: 1.8rem;
      background-color: #fff;
      border-radius: 1.5rem;

      .title {
        // margin: 1.8rem 1.8rem 0 2.1rem;
        width: auto !important;
        margin: 0 !important;
        display: flex;
        justify-content: space-between;
        font-weight: 700;
        font-size: 1.6rem;
        line-height: 2.1rem;
        h3 {
          font-weight: 700;
          letter-spacing: 0;
        }
        img {
          width: 1.5rem;
          height: 1.5rem;
        }
      }
      .message {
        margin-top: 0.5rem;
        border-top: 0.01rem solid rgba(0, 0, 0, 0.09);
        display: flex;
        // justify-content: center;
        align-items: center;
        // margin: 0.9rem 2.1rem 1.9rem;
        line-height: 2.15rem;
        font-weight: 400;
        font-size: 1.2rem;
        color: #656565;
        .study {
          font-weight: 700;
          color: #040415;
        }
        .uni {
          color: #656565;
          font-weight: 500;
        }
        .text {
          color: #040415;
          &::first-line {
            font-weight: 700;
          }
        }
        img {
          margin-top: 1.9rem;
          width: 7rem;
          height: 6.5rem;
        }
      }
    }
    .option {
      img {
        margin-right: 1.8rem;
        width: 1.5rem;
        height: 1.5rem;
      }
    }
  }
  //修改框样式
  .popmaskt {
    display: none;
    z-index: 99;
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    background-color: rgba($color: #000, $alpha: 0.2);
    .popup {
      box-sizing: border-box;
      width: 25rem;
      position: absolute;
      padding: 1.2rem 1.2rem 0;
      display: flex;
      flex-direction: column;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      background-color: #fff;
      // border: 1px solid rgba($color: #4e5fff, $alpha: 0.5);
      border-radius: 1rem;
      // box-shadow: 0 0 1rem rgba($color: #4e5fff, $alpha: 0.5);
      // display: flex;
      flex-direction: column;
      textarea {
        font-size: 1.2rem;
        // text-indent: 2em;
        padding: 1rem;
        min-height: 3rem;
        border: 1px solid #000;
        margin: 1rem 0;
        border-radius: 0.5rem;
        line-height: 1.7rem;
        letter-spacing: 0.12rem;
        max-height: 50vh;
        overflow: scroll;
      }
      .popsel {
        display: flex;
        justify-content: space-between;
        border-top: 0.01rem solid rgba(0, 0, 0, 0.05);
        div {
          cursor: pointer;
          // background-color: #4e5fff;
          // color: #fff;
          font-family: "Dm Sans";
          letter-spacing: 0;
          font-weight: 700;
          font-size: 1.4rem;
          line-height: 2.3rem;
          text-align: center;
          color: #4e5fff;
          padding: 0.8rem 3.38rem;
          border-radius: 0.5rem;
          & > :first-child {
            border-right: 0.01rem solid rgba(0, 0, 0, 0.08);
          }
        }
      }
    }
  }
  // 底下按钮样式
  .btns {
    opacity: 0.9;
    position: relative;
    bottom: -3rem;
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
    .tishimsg {
      box-sizing: border-box;
      padding: 3rem;
      position: absolute;
      top: -15rem;
      left: -11rem;
      width: 22.5rem;
      height: 14.1rem;
      background-image: url("../fonts/stishi.svg");
      background-size: 113%;
      background-repeat: no-repeat;
      color: #fff;
      font-family: "DM Sans";
      transition: all 0.5s;
      .t1,
      .t3 {
        white-space: nowrap;
        width: 18.5rem;
        overflow: hidden;
        font-weight: 700;
        font-size: 1.4rem;
        line-height: 2.1rem;
      }
      .t2 {
        font-weight: 400;
        font-size: 1.2rem;
        line-height: 2.1rem;
        height: 4rem;
        overflow: hidden;
      }
    }
    .btn {
      & > img {
        transition: all 0.5s;
        width: 6.6rem;
        height: 6.6rem;
      }
    }
    .btn1,
    .btn2,
    .btn3 {
      display: none;
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
      background-color: #4e5fff;
      border-radius: 50%;
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
      padding: 0 !important;
      // border-radius: 50%;
      font-size: 1.2rem;
      text-align: center;
      background-color: #4e5fff;
      border-radius: 50%;
    }
    .btn3 {
      overflow: hidden;
      box-sizing: border-box;
      position: absolute;
      top: -15rem;
      left: 2.5rem;
      transform: translate(-50%, -50%);
      padding: 0 !important;
      // width: 3.3rem;
      // height: 3.3rem;
      // padding: 0.3rem;
      // border-radius: 50%;
      text-align: center;
      // background-color: skyblue;
      background: #4e5fff;
      border-radius: 50%;
      background-size: cover;
    }
  }
  .build {
    opacity: 0.9;
    position: relative;
    bottom: -5rem;
    box-sizing: border-box;
    margin: 0 auto;
    padding: 0.8rem 0;
    width: 22rem;
    font-family: "DM Sans";
    font-weight: 500;
    font-size: 1.4rem;
    line-height: 2.1rem;
    background-color: #4e5fff;
    border-radius: 1rem;
    color: #fff;
    text-align: center;
  }
  .btnfix {
    position: fixed;
    bottom: 7rem;
    left: 50%;
    transform: translateX(-50%);
  }
}
.resume .el-loading-spinner {
  transform: translate(-1.5rem, -50%);
  margin-top: 0rem !important;
}
</style>
