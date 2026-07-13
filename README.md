# 日地天文教学工具 (Sun-Earth Astronomy Teaching Tool)

开源好用的地理教学工具。

## 项目简介

基于 Three.js 的交互式三维日地天文教学工具，支持：
- 3D 地球/太阳视运动轨迹可视化
- 昼夜与季节变化模拟
- 不同纬度/季节的太阳高度角与方位角计算

## 技术栈

- **前端**: HTML5 Canvas + Three.js (WebGL)
- **移动端**: Android WebView (Java/Kotlin)
- **桌面端**: Electron + Node.js

## 目录结构

```
├── src/              # 源代码
│   ├── app/          # Android app
│   │   ├── build.gradle.kts
│   │   └── src/main/ # 主源码 (Java + HTML/JS assets)
│   ├── build.gradle.kts
│   ├── gradlew / gradlew.bat
│   └── settings.gradle.kts
├── notes/            # 开发笔记与验收标准
├── docs/             # 文档
├── data/             # 数据文件
├── installer/        # 安装包
│   └── 日地天文教学_v1.6_win64.exe  # Windows 桌面版
└── README.md
```

## 下载

Windows 桌面版安装包：[日地天文教学 v1.6 Win64](installer/日地天文教学_v1.6_win64.exe)

## License

MIT
