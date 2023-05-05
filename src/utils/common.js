import store from "../store";
import service from "@/api/request";

//获取对话的prompt配置信息
export function getPrompt() {
  service
    .post("/resume/Resume/getPrompt", {})
    .then((res) => {
      //存储prompt信息
      console.log(res, "get prompt info");
      store.dispatch("getPrompt", res.data);
    })
    .catch(() => {
      console.log("获取prompt配置失败");
    });
}

//微信网页授权跳转
export function getUserCode() {
  //跳转路径
  // let innerPath = "";
  // if (path === "/messageenter" && fullPath != "") {
  //   innerPath = fullPath.substring(1);
  // }
  const redirectUrl = encodeURIComponent(
    "http://resume.ai.51tests.net/" 
  );
  window.location.href =
    "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx9c64abf37bee6ca2" +
    "&redirect_uri=" +
    redirectUrl +
    "&response_type=code&scope=snsapi_userinfo&state=#wechat_redirect";
}

//判断是否是在微信内打开的页面
export function is_weixin() {
  var ua = navigator.userAgent.toLowerCase();
  if (ua.match(/MicroMessenger/i) == "micromessenger") {
    return true;
  } else {
    return false;
  }
}

//根据授权返回的code来检测授权信息
export function getUserAuth(code) {
  service
    .post("/resume/user/getUserInfo", { code: code })
    .then((res) => {
      console.log(res);
      if (res.code != 0) {
        //需要去关注公众号
        window.location.href =
          "https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=Mzg4Njk2ODI3OA==#wechat_redirect";
        return false;
      } else {
        getPrompt();
        //已经关注公众号了
        store.dispatch("changeSetting", res.data);
      }
    })
    .catch(() => {
      console.log("code校验失败");
    });
}
