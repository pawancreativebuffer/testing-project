<template>
  <div class="resume">
    <div class="mask">
      <div class="drawer">
        <div class="title">
          <img
            src="@/fonts/sback.svg"
            alt="back"
            class="back"
            @click="backPage"
          />
          <!-- <img src="@/fonts/daohang.svg" alt="svg" class="dh" /> -->
          <h2>Your Resume</h2>
        </div>
        <div class="temp">
          <h3>Slelect your template</h3>
          <div class="temp-select">
            <div
              class=""
              v-for="(item, index) in Resumetemp"
              :key="index"
              ref="item"
              @click="ResumetempFn(index)"
            >
              {{ item }}
            </div>
          </div>
        </div>
        <div class="contentr">
          <div class="scroll" ref="scroll">
            <div class="this">
              <WordView ref="resume"></WordView>
            </div>
            <div class="this">
              <WordView></WordView>
            </div>
            <div class="this">
              <WordView></WordView>
            </div>
            <div class="this">
              <WordView></WordView>
            </div>
          </div>
          <!-- <img src="@/assets/images/resume.png" alt="" /> -->
        </div>
        <div class="dots">
          <div
            class=""
            v-for="(item, index) in Resumetemp.length"
            :key="index"
            ref="item2"
            @click="ResumetempFn(index)"
          ></div>
        </div>
        <div class="sharebox" @click="toShare">
          <div class="share">
            <span>Share</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import WordView from "@/components/WordView.vue";
export default {
  name: "AboutView",
  components: { WordView },
  data() {
    return {
      // "Classic", "Elegant", "Modern", "Business"
      Resumetemp: ["Classic"],
      resumeInfo: [],
    };
  },
  methods: {
    backPage() {
      location.reload();
    },
    //加载页面获取简历信息
    getResumeInfo(info) {
      this.resumeInfo = info;
      console.log("resume page get resume info", this.resumeInfo);
      this.$refs["resume"].pushResume(this.resumeInfo);
    },
    ResumetempFn(index) {
      for (var i = 0; i < this.Resumetemp.length; i++) {
        this.$refs.item[i].className = "";
        this.$refs.item2[i].className = "";
      }
      this.$refs.item[index].className = "active";
      this.$refs.item2[index].className = "active";
      this.$refs.scroll.style.transform = `translateX(-${100 * index}vw)`;
    },

    //点击分享下载Word文档
    toShare() {
      this.$refs["resume"].toShare();
    },
  },
  mounted() {
    this.$refs.item[0].className = "active";
    this.$refs.item2[0].className = "active";
  },
};
</script>

<style lang="scss">
html {
  background-color: #f5f5f5;
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
  background-color: #fff;
  .drawer {
    position: absolute;
    width: 100%;
    height: 100vh;
    left: 0;
    bottom: 0;
    background-color: #fff;
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
    .temp {
      width: 90vw;
      margin: 0 auto 2.9rem;
      h3 {
        margin-bottom: 1.5rem;
        letter-spacing: normal;
        font-family: "DM Sans";
        font-style: normal;
        font-weight: 700;
        font-size: 1.7rem;
        line-height: 2.2rem;
        color: #040415;
      }
      .temp-select {
        display: flex;
        justify-content: space-between;
        & > div {
          box-sizing: border-box;
          // margin-right: 1rem;
          padding: 1.4rem 2rem;
          border-radius: 1rem;
          border: 1px solid #ddd;
          background-color: #fff;
          color: #808080;
          font-size: 1.3rem;
          font-weight: 500;
          line-height: 1.7rem;
        }
        & > div:last-child {
          margin-right: none;
        }
        & > .active {
          border: 1px solid #4e5fff;
          background-color: #4e5fff;
          color: #fff;
        }
      }
    }
    .contentr {
      overflow: hidden;
      width: 90vw;
      padding: 0.1rem;
      margin: 0 auto;
      // height: 48rem;
      height: calc(100% - 28.8rem);
      background-color: #fff;
      box-shadow: 1.2rem 1.2rem 2rem 1rem rgba(0, 0, 0, 0.04);
      border-radius: 0.7rem;
      .scroll {
        width: 400vw;
        display: flex;
        transition: all 1s;
      }
      .this {
        width: 100vw;
        height: 67rem;
        overflow: scroll;
        margin: 0 auto;
        font-family: "Dm Sans";
        transform: scale(0.7) translate(-2rem, -15rem);
      }
    }
    ::-webkit-scrollbar {
      width: 0;
      height: 0;
      color: transparent;
    }
    h2,
    h3 {
      letter-spacing: 0.5rem;
    }
    // img {
    //   height: 100%;
    // }
    .sharebox {
      // background-color: #fff;
    }
    .dots {
      margin-top: 3.2rem;
      // display: flex;
      display: none;
      justify-content: space-between;
      position: relative;
      width: 10rem;
      left: 50%;
      transform: translateX(-50%);
      & > div {
        border-radius: 0.5rem;
        box-sizing: border-box;
        width: 1.8rem;
        border: 0.6rem solid rgba(78, 95, 255, 0.4);
        background-color: rgba(78, 95, 255, 0.4);
      }
      & > .active {
        width: 3rem;
        border: 0.6rem solid #4e5fff;
        background-color: #4e5fff;
        transition: all 0.5s;
      }
    }
    .share {
      width: 30%;
      margin: 1.4rem auto;
      border-radius: 1.6rem;
      color: #fff;
      font-weight: 700;
      font-size: 1rem;
      text-align: center;
      padding: 1.9rem 7rem;
      background-color: #4e5fff;
    }
  }
}
</style>
