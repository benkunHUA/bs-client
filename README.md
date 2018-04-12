# nalyst.ai-ui

## 开发与构建环境
+ Node.js >= 8.9.4

## 代码说明
### 初始化
该项目使用 [Create React App](https://github.com/facebookincubator/create-react-app) 作为脚手架工具进行初始化，并通过 react-app-rewired 对其进行了功能拓展。

### 代码结构

```
src
├── assets/                  图标 / 图片等附件
├── components/              组件
├── stores/ Mobx             状态管理器封装
├── agent.js                 API 请求方法封装
├── constant.js              常量定义
├── helper.js                帮助函数
├── index.css                全局样式
├── index.js                 入口文件
└── registerServiceWorker.js Service Worker 注册文件
```
