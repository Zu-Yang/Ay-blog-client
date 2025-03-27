/* ----

# Pio Plugin
# By: Dreamer-Paul
# Last Update: 2022.8.12

一个支持更换 Live2D 模型的 JS 插件

本代码为奇趣保罗原创，并遵守 GPL 2.0 开源协议。欢迎访问我的博客：https://paugram.com

---- */

var Paul_Pio = function (prop) {
  const that = this;

  // 基本配置
  const option = {
    idol: 0, // 模型索引
    timeout: undefined,
    time: 3000,
    menu: document.querySelector(".pio-container .pio-action"), // 操作栏
    canvas: document.getElementById("pio"),
    body: document.querySelector(".pio-container"),
    root: document.location.protocol + "//" + document.location.hostname + "/", // 站点根目录
  };

  // 工具通用函数
  const tools = {
    // 创建内容
    create: (tag, options) => {
      const el = document.createElement(tag);
      options.class && (el.className = options.class);

      return el;
    },
    // 随机内容
    rand: (arr) => {
      return arr[Math.floor(Math.random() * arr.length + 1) - 1];
    },
    // 是否为移动设备
    isMobile: () => {
      let ua = window.navigator.userAgent.toLowerCase();
      ua = ua.indexOf("mobile") || ua.indexOf("android") || ua.indexOf("ios");

      return window.innerWidth < 500 || ua !== -1;
    },
  };

  // 控件
  const elements = {
    home: tools.create("span", { class: "pio-home" }),
    skin: tools.create("span", { class: "pio-skin" }),
    info: tools.create("span", { class: "pio-info" }),
    night: tools.create("span", { class: "pio-night" }),
    close: tools.create("span", { class: "pio-close" }),
    dialog: tools.create("div", { class: "pio-dialog" }),
    show: tools.create("div", { class: "pio-show" }),
  };

  option.body.appendChild(elements.dialog); // 对话框
  option.body.appendChild(elements.show); // 看板娘显示按钮

  /* - 方法 */
  const modules = {
    // 更换模型
    idol: () => {
      option.idol < prop.model.length - 1 ? option.idol++ : (option.idol = 0);

      return option.idol;
    },
    // 创建对话框方法
    message: (text, options = {}) => {
      const { dialog } = elements;

      if (text.constructor === Array) {
        dialog.innerText = tools.rand(text);
      } else if (text.constructor === String) {
        dialog[options.html ? "innerHTML" : "innerText"] = text;
      } else {
        dialog.innerText = "输入内容出现问题了 X_X";
      }

      dialog.classList.add("active");

      option.timeout = clearTimeout(option.timeout) || undefined;
      option.timeout = setTimeout(() => {
        dialog.classList.remove("active");
      }, options.time || 3000);
    },
    // 隐藏对话框方法
    remove: () => {
      const { dialog } = elements;
      dialog.classList.remove("active");
      option.timeout = clearTimeout(option.timeout) || undefined;
    },

    // 移除方法
    destroy: () => {
      that.initHidden();
      localStorage.setItem("posterGirl", "0");
    },
  };

  this.destroy = modules.destroy;
  this.message = modules.message;

  /* - 提示操作 */
  const action = {
    // 欢迎
    welcome: () => {
      if (document.referrer && document.referrer.includes(option.root)) {
        const referrer = document.createElement("a");
        referrer.href = document.referrer;

        if (prop.content.referer) {
          modules.message(
            prop.content.referer.replace(/%t/, `“${referrer.hostname}”`)
          );
        } else {
          modules.message(`欢迎来自 “${referrer.hostname}” 的朋友！`);
        }
      }
      if (prop.tips) {
        setTimeout(() => {
          let text,
            hour = new Date().getHours();

          if (hour > 22 || hour <= 5) {
            text = [
              "你是夜猫子呀？这么晚还不睡觉，明天起的来嘛",
              "深夜了，早点休息吧，熬夜对身体不好哦",
              "已经这么晚了，快去睡觉吧~",
              "夜深了，记得休息哦，晚安~",
            ];
          } else if (hour > 5 && hour <= 8) {
            text = [
              "早安！新的一天开始啦",
              "早上好！今天也要元气满满哦",
              "早餐记得要吃哦，这是一天中最重要的一餐",
              "清晨的空气真清新，祝你今天心情愉快",
            ];
          } else if (hour > 8 && hour <= 11) {
            text = [
              "上午好！工作顺利嘛，不要久坐，多起来走动走动哦",
              "上午工作时间，要保持专注哦",
              "记得喝水补充水分，保持精力充沛",
              "工作再忙也要记得休息片刻哦",
            ];
          } else if (hour > 11 && hour <= 14) {
            text = [
              "中午了，工作了一个上午，现在是午餐时间！",
              "午餐时间到了，去吃些美味的吧",
              "记得午休一下，养精蓄锐哦",
              "不要光顾着工作，午饭要按时吃~",
            ];
          } else if (hour > 14 && hour <= 17) {
            text = [
              "午后很容易犯困呢，今天的运动目标完成了吗？",
              "困了的话来杯咖啡提提神吧",
              "多活动活动，让自己保持清醒哦",
              "下午茶时间到了，休息一下吧",
            ];
          } else if (hour > 17 && hour <= 19) {
            text = [
              "傍晚了！窗外夕阳的景色很美丽呢，最美不过夕阳红~",
              "快要下班了，今天辛苦啦",
              "夕阳无限好，只是近黄昏",
              "记得收拾好东西再回家哦",
            ];
          } else if (hour > 19 && hour <= 21) {
            text = [
              "晚上好，今天过得怎么样？",
              "忙碌了一天，记得放松一下",
              "晚餐吃得开心吗？",
              "享受美好的夜晚时光吧",
            ];
          } else if (hour > 21 && hour <= 22) {
            text = [
              "已经这么晚了呀，早点休息吧，晚安~",
              "夜深了，要早点休息哦",
              "睡前记得洗漱哦",
              "明天又是崭新的一天呢，晚安~",
            ];
          } else {
            text = [
              "好奇这个时候你会在做什么呢?",
              "无论什么时候见到你都很开心~",
              "欢迎来到我的小窝",
              "希望能陪伴你度过美好的时光",
            ];
          }
          modules.message(text);
        }, 3000);
      } else {
        modules.message(prop.content.welcome || "欢迎来到我的小窝！");
      }
    },
    // 触摸
    touch: () => {
      option.canvas.onclick = () => {
        modules.message(
          prop.content.touch || [
            "你好呀，我是看板娘~",
            "你在干什么？",
            "再摸我就报警了！",
            "HENTAI!",
            "不可以这样欺负我啦！",
            "我是不会理你滴！",
            "别摸我，我会报警的！",
            "今天也要开开心心的呢~",
            "今天也很可爱呢~",
            "摸摸头，乖~",
            "有什么开心的事情要分享吗？",
            "要来杯茶吗？",
            "我是一个可爱的看板娘~",
          ]
        );
      };
    },
    // 右侧按钮
    buttons: () => {
      // 返回首页
      option.menu.appendChild(elements.home);
      elements.home.onclick = () => {
        location.href = option.root;
      };
      elements.home.onmouseover = () => {
        modules.message(prop.content.home || "点击这里回到首页！");
      };

      // 更换模型
      option.menu.appendChild(elements.skin);
      if (prop.model && prop.model.length > 1) {
        elements.skin.onclick = () => {
          loadlive2d("pio", prop.model[modules.idol()]);
          // 确保content.skin存在并且是数组再访问索引
          modules.message(
            prop.content && prop.content.skin && prop.content.skin[1]
              ? prop.content.skin[1]
              : "新衣服真漂亮~"
          );
        };
        elements.skin.onmouseover = () => {
          // 确保content.skin存在并且是数组再访问索引
          modules.message(
            prop.content && prop.content.skin && prop.content.skin[0]
              ? prop.content.skin[0]
              : "想看看我的新衣服吗？"
          );
        };
      }

      // 关于我
      option.menu.appendChild(elements.info);
      elements.info.onclick = () => {
        window.open(
          prop.content.link ||
            "https://paugram.com/coding/add-poster-girl-with-plugin.html"
        );
      };
      elements.info.onmouseover = () => {
        modules.message("想了解更多关于我的信息吗？");
      };

      // 夜间模式
      option.menu.appendChild(elements.night);
      if (prop.night) {
        elements.night.onclick = () => {
          const isDark =
            typeof prop.night === "function" ? prop.night() : eval(prop.night);
          modules.message(isDark ? "夜深了~" : "天亮了~");
        };
        elements.night.onmouseover = () => {
          modules.message("试试更换主题吧~");
        };
      }

      // 关闭看板娘
      option.menu.appendChild(elements.close);
      elements.close.onclick = () => {
        modules.destroy();
      };
      // 显示对话框
      elements.close.onmouseover = () => {
        modules.message(prop.content.close || "QWQ 下次再见吧~");
      };
      // 鼠标移出隐藏对话框
      option.menu.onmouseout = () => {
        modules.remove();
      };
    },
    // 自定义识别选择器，并显示看板娘对话框
    custom: () => {
      prop.content.custom.forEach((item) => {
        const el =
          item.selector.length && document.querySelectorAll(item.selector);

        if (!el.length) return;

        for (let i = 0; i < el.length; i++) {
          if (item.type === "read") {
            el[i].onmouseover = (ev) => {
              const text = ev.currentTarget.title || ev.currentTarget.innerText;
              modules.message("想阅读 %t 吗？".replace(/%t/, "“" + text + "”"));
            };
          } else if (item.type === "link") {
            el[i].onmouseover = (ev) => {
              const text = ev.currentTarget.title || ev.currentTarget.innerText;
              modules.message("想前往 %t 吗？".replace(/%t/, "“" + text + "”"));
            };
          } else if (item.text) {
            el[i].onmouseover = () => {
              modules.message(item.text);
            };
          }
          el[i].onmouseout = () => {
            modules.remove();
          };
        }
      });
    },
  };

  /* - 运行 */
  const begin = {
    // 静态：只保留看板娘自身和文字提示，适合所有模型
    static: () => {
      option.body.classList.add("static");
    },
    // 固定：固定看板娘的位置，增加功能按钮，适合所有模型
    fixed: () => {
      action.touch();
      action.buttons();
    },
    // 	可移动：看板娘的位置可以被用户更改，也保留了功能按钮，不适合半身模型
    draggable: () => {
      action.touch();
      action.buttons();

      const body = option.body;

      const location = {
        x: 0,
        y: 0,
      };

      const mousedown = (ev) => {
        const { offsetLeft, offsetTop } = ev.currentTarget;

        location.x = ev.clientX - offsetLeft;
        location.y = ev.clientY - offsetTop;

        document.addEventListener("mousemove", mousemove);
        document.addEventListener("mouseup", mouseup);
      };

      const mousemove = (ev) => {
        body.classList.add("active");
        body.classList.remove("right");

        body.style.left = ev.clientX - location.x + "px";
        body.style.top = ev.clientY - location.y + "px";
        body.style.bottom = "auto";
      };

      const mouseup = () => {
        body.classList.remove("active");
        document.removeEventListener("mousemove", mousemove);
      };

      body.onmousedown = mousedown;
    },
  };

  // 运行
  this.init = (noModel) => {
    // 未隐藏 + 非手机版，出现操作功能
    if (!(prop.hidden && tools.isMobile())) {
      if (!noModel) {
        action.welcome();
        // loadlive2d("pio", prop.model[0]);
        loadlive2d("pio", prop.model[option.idol]);
      }

      switch (prop.mode) {
        case "static":
          begin.static();
          break;
        case "fixed":
          begin.fixed();
          break;
        case "draggable":
          begin.draggable();
          break;
      }

      prop.content.custom && action.custom();
    }
  };

  // 隐藏状态
  this.initHidden = () => {
    // ! 清除预设好的间距
    if (prop.mode === "draggable") {
      option.body.style.top = null;
      option.body.style.left = null;
      option.body.style.bottom = null;
    }

    option.body.classList.add("hide");
    elements.dialog.classList.remove("active");

    elements.show.onclick = () => {
      option.body.classList.remove("hide");
      localStorage.setItem("posterGirl", "1");

      that.init();
    };
  };

  // 根据本地存储判断是否隐藏看板娘，0：隐藏，1：显示。
  localStorage.getItem("posterGirl") === "0" ? this.initHidden() : this.init();
};

// 请保留版权说明
if (window.console && window.console.log) {
  console.log(
    "%c Pio %c https://paugram.com ",
    "color: #fff; margin: 1em 0; padding: 5px 0; background: #673ab7;",
    "margin: 1em 0; padding: 5px 0; background: #efefef;"
  );
}
