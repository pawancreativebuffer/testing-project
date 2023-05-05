<template>
  <div id="app">
    <!-- <HomeViewVue ></HomeViewVue> -->
    <router-view></router-view>
    <!-- <ResumeView></ResumeView> -->

   <!-- <div class="qcode">
    <img src="@/assets/images/code.jpg" alt="二维码" />
   </div> -->
      
 
  </div>
</template>

<script>
// import HomeViewVue from './components/HomeView';
// import SmartResume from "./components/SmartResume";
// import UserPreview from "@/views/UserPreview";
// import ResumeView from "@/views/ResumeView"
export default {
  name: "App",
  // components: {HomeViewVue},
  // components: {ResumeView},
  data() {
    return {};
  },
  created() {},
};
</script>

<style>
@import "./styles/reset.css";
* {
  margin: 0;
  padding: 0;
}
html,
body {
  height: 100%;
}
#app {
  height: 100%;
  /* display: flex; */
  /* background: white; */
}
.qcode{
       display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
}
</style>
