<template>
  <div id="content">
    <div class="word">
      <div class="title">
        <div class="color"></div>
        <h2>Resume</h2>
        <div>·graphic designer·</div>
      </div>
      <div class="learnone">
        <!-- Education List -->
        <div class="conone" v-if="eduList.length > 0">
          <div class="about">
            <h3>EDUCATION</h3>
            <div
              class="para education"
              v-for="(item, index) in eduList"
              :key="index"
            >
              <span style="line-height: 2rem;white-space: pre-line;">
                {{ item.text }}
              </span>
            </div>
          </div>
        </div>
        <!-- Profession List -->
        <div class="contwo" v-if="workList.length > 0">
          <h3>EXPERIENCE</h3>
          <div class="experse" v-for="(item, index) in workList" :key="index">
            <div class="item" style="line-height: 2.5rem">
              {{ item.text }}
            </div>
          </div>
        </div>
      </div>
      <!-- Interests list -->
      <div class="conthree" v-if="interList.length > 0">
        <h3>SKILLS</h3>
        <div class="skillscon" v-for="(item, index) in interList" :key="index">
          <div class="item">
            {{ item.text }}
            <!-- <div class="name">Graphic Design</div>
            <div class="blank blank1"></div> -->
          </div>
        </div>
      </div>

      <div
        id="copy"
        :data-clipboard-text="downUrl"
        @click="copyUrl"
        style="display: none"
      ></div>

      <div class="confour">
        <p>
          (04)290 1092 2093 * + 76 209 1092 2092 ·
          ameliastandfond@email.com·www.ameliastanford.com
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import FileSaver from "file-saver";
import htmlDocx from "html-docx-js/dist/html-docx";
import service from "@/api/request";
import Clipboard from "clipboard";
import { Dialog } from "vant";
import { Toast } from "vant";

export const resumecss = `
html {
  background-color: #f5f5f5;
}

.word {
  width: 100vw;
  background-color: #fff;
  font-size: 1rem;
}
.word .title {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  margin: 1rem;
  height: 3rem;
}
.word .title h2 {
  z-index: 1;
  margin: 0.2rem 0;
  font-size: 1.6rem;
  letter-spacing: 0.8rem !important;
  white-space: nowrap;
  font-weight: 500 !important;
  background-color: rgba(219, 235, 226, 0.9)
}

.word .title div {
  font-weight: 400;
  display: block;
  font-size: 1rem;
}
.word h3 {
  font-size: 1rem !important;
  font-weight: 700;
  letter-spacing: 0.3rem !important;
  white-space: nowrap;
  margin-bottom: 1rem;
}
.word .conone {
  display: flex;
}
.word .conone > div {
  flex: 1;
}
.word .conone .about:last-child {
  margin-left: 0.1rem;
}
.word .conone .para {
  line-height: 1.5rem;
}
.word .conone .para span {
  display: block;
  margin-bottom: 1.5rem;
  white-space: normal;
}
.word .contwo {
  margin-top: 0.5rem;
}
.word .contwo .experse {
  margin-top: 1rem;
}
.word .contwo .experse .item {
  display: flex;
  margin: 1rem 0;
  white-space: normal;
}
.word .contwo .experse .item h4 {
  font-weight: 700;
  margin-bottom: 0.5rem;
}
.word .contwo .experse .item .year {
  font-weight: 700;
  padding-right: 2rem;
  width: 3rem;
  text-align: center;
}
.word .contwo .experse .item .tell {
  line-height: 1rem;
}
.word .contwo .experse .item .tell ul {
  list-style: disc;
  line-height: 1.5rem;
  list-style-position: inside;
}
.word .conthree {
  margin: 1rem 0;
}
.word .conthree .skillscon {
  display: flex;
  flex-wrap: wrap;
  align-content: space-around;
  align-items: center;
}
.word .conthree .skillscon .item {
  width: 49%;
  display: flex;
  align-items: center;
  margin: 0.5rem 0;
}
.word .conthree .skillscon .item .name {
  width: 10rem;
  white-space: nowrap;
  overflow: hidden;
}
.word .conthree .skillscon .blank {
  width: 3rem;
  height: 1rem;
  margin-left: 0.3rem;
  background-color: rgba(219, 235, 226, 0.9);
}
.word .conthree .skillscon .blank1,
.word .conthree .skillscon .blank6 {
  width: 7rem;
}
.word .conthree .skillscon .blank2,
.word .conthree .skillscon .blank5 {
  width: 5rem;
}
.word .confour {
  border-top: 0.2rem solid rgba(219, 235, 226, 0.9);
  padding-top: 1rem;
  text-align: center;
}
.word .confour p {
  margin: 0 auto !important;
  font-size: 0.5rem !important;
}
`;
export default {
  data() {
    return {
      resume: [],
      eduList: [],
      workList: [],
      interList: [],
      downUrl: "",
    };
  },
  methods: {
    pushResume(data) {
      this.resume = data;
      if (this.resume.length > 0) {
        this.eduList = [];
        this.workList = [];
        this.interList = [];
        this.resume.forEach((item) => {
          console.log(item);
          if (item.title === "Profession") {
            this.workList.push(item.content);
          } else if (item.title === "Education") {
            this.eduList.push(item.content);
          } else if (item.title === "Interests") {
            this.interList.push(item.content);
          }
        });
      }

      // console.log(this.workList, "Profession");
      // console.log(this.eduList, "Education");
      // console.log(this.interList, "Interests");
    },

    //复制url
    copyUrl() {
      console.log(this.downUrl);
      if(!this.downUrl){
         Toast.fail("空链接！");
         return false
      }
      const clipboard = new Clipboard("#copy");
      console.log(clipboard);
      clipboard.on("success", (e) => {
        Toast.success("复制成功");
        this.downUrl=''
        // 释放内存
        clipboard.destroy();
      });
      clipboard.on("error", (e) => {
        // 不支持复制
        Toast.fail("暂不支持复制");
        // 释放内存
        clipboard.destroy();
      });
    },
    //模板word导出
    toShare() {
      let html = document.getElementById("content").innerHTML;
      var msg = this.eduList.concat(this.workList, this.interList);
      service
        .post("/resume/Resume/chatToWord", {
          msg: msg,
          content: html,
          style: resumecss,
        })
        .then((res) => {
          // console.log(res);
          // window.open(res.data);
          this.downUrl=res.data
          Dialog.confirm({
            title: "温馨提示",
            message: "建议复制链接到浏览器中下载简历",
          })
            .then(() => {
              console.log("confirm info");
              // on confirm
              const coer = document.getElementById("copy");
              coer.click();
              // this.copyUrl()
            })
            .catch(() => {
              // on cancel
            });
        })
        .catch(() => {
          console.log("错误输出");
        });

      return false;
      let contentHtml = document.getElementById("content").innerHTML;
      let content = `<!DOCTYPE html><html>
            <head>
                <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
                <style>
                ${resumecss}
                </style>
            </head>
            <body>
                ${contentHtml}
            </body>
            </html>`;
      console.log(content);
      // return false;

      let converted = htmlDocx.asBlob(content);

      FileSaver.saveAs(converted, "简历.docx");
    },
  },
};
</script>

<style lang="scss">
html {
  background-color: #f5f5f5;
}
.word {
  width: 100vw;
  background-color: #fff;
  font-size: 1rem;
  .title {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
    margin: 1rem;
    height: 3rem;
    h2 {
      z-index: 1;
      margin: 0.2rem 0;
      font-size: 1.6rem;
      letter-spacing: 0.8rem !important;
      white-space: nowrap;
      font-weight: 500 !important;
    }
    .color {
      z-index: 0;
      position: absolute;
      width: 100vw;
      top: 0.5rem;
      left: 50%;
      transform: translateX(-50%);
      background-color: rgba(#dbebe2, 0.9);
      height: 1.1rem;
      //   opacity: 0.5;
    }
    div {
      font-weight: 400;
      display: block;
      font-size: 1rem;
    }
  }
  h3 {
    font-size: 1rem !important;
    font-weight: 700;
    letter-spacing: 0.3rem !important;
    white-space: nowrap;
    margin-bottom: 1rem;
  }
  .conone {
    display: flex;
    & > div {
      flex: 1;
    }
    .about:last-child {
      margin-left: 0.1rem;
    }
    .para {
      line-height: 1.5rem;
      span {
        display: block;
        margin-bottom: 1.5rem;
        // white-space: pre-wrap;
      }
    }
  }
  .contwo {
    margin-top: 0.5rem;
    .experse {
      margin-top: 1rem;
      .item {
        display: flex;
        margin: 1rem 0;
        white-space: pre-line;
        h4 {
          font-weight: 700;
          margin-bottom: 0.5rem;
        }
        .year {
          font-weight: 700;
          padding-right: 2rem;
          width: 3rem;
          text-align: center;
        }
        .tell {
          line-height: 1rem;
          ul {
            list-style: disc;
            line-height: 1.5rem;
            list-style-position: inside;
            // white-space: nowrap;
          }
        }
      }
    }
  }
  .conthree {
    margin: 1rem 0;
    .skillscon {
      display: flex;
      flex-wrap: wrap;
      // width: 30%;
      // justify-content: space-around;
      align-content: space-around;
      align-items: center;
      .item {
        // width: 49%;
        display: flex;
        // justify-content: space-around;
        align-items: center;
        margin: 0.5rem 0;
        white-space: pre-line;
        line-height: 2.5rem;
        .name {
          width: 10rem;
          white-space: nowrap;
          overflow: hidden;
        }
      }
      .blank {
        width: 3rem;
        height: 1rem;
        margin-left: 0.3rem;
        background-color: rgba(#dbebe2, 0.9);
      }
      .blank1,
      .blank6 {
        width: 7rem;
      }
      .blank2,
      .blank5 {
        width: 5rem;
      }
    }
  }
  .confour {
    border-top: 0.2rem solid rgba(#dbebe2, 0.9);
    padding-top: 1rem;
    text-align: center;
    p {
      margin: 0 auto !important;
      font-size: 0.5rem !important;
    }
  }
}
</style>
