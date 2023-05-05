import router from "./router";
import { getPrompt, getUserCode, is_weixin } from "@/utils/common";
// import { Toast } from "vant";
import store from "./store";
import service from "@/api/request";

// 路由请求前置判断
router.beforeEach(async (to, from, next) => {
  if (process.env.ENV === "production") {
    var weixin = is_weixin();
    if (!weixin) {
      alert("请在微信客户端打开链接");
      return false;
    }
    // store.dispatch("changeSetting", '');
    //微信授权
    var token = store.state.token; //缓存的用户token
    var user = store.state.user; //缓存的用户信息
    // console.log(user,'user info');
    if (user.length <= 0) {
      //未登录
      if (to.query.code) {
        //授权回调地址中携带了授权code
        console.log(to.query.code);

        service
          .post("/resume/user/getUserInfo", { code: to.query.code })
          .then((res) => {
            console.log(res, "code授权码校验结果");
            if (res.code != 0) {
              //重新去授权
              getUserCode();
            } else {
              //已经获取了用户授权结果
              store.dispatch("getUserInfo", res.data);
              next();
            }
          })
          .catch(() => {
            console.log("code校验失败");
          });
      } else {
        //去授权，跳转授权地址
        getUserCode(to.path, to.fullPath);
      }
    } else {
      //缓存的token
      console.log(user, "store user");
      //初始化对话prompt
      //预先请求后端配置中的各个场景下的对话prompt
      getPrompt();
      next();
    }
  } else {
    getPrompt();
    next();
  }
});
