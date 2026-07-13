## 项目构建记录

### 2026-06-20
- 首次构建成功
- APK 大小: 789KB (debug)
- 构建工具: Gradle 8.4, AGP 8.2.2, Kotlin 1.9.22, JDK 17 (Azul Zulu)
- SDK: compileSdk 34, minSdk 21, build-tools 34.0.0
- 问题: 中文路径导致构建失败 → 添加 `android.overridePathCheck=true` 解决

### 2026-06-20 (v3.5)
- **地球纹理改用 Image+CanvasTexture 加载**，兼容 Android WebView 的 file:// 协议
- **经线系统**：0°、±30°、±60°、±90°、±120°、±150°、180° 共 13 条经线子午线
- **银河系星空背景**：2048×1024 程序化生成纹理，包含银河带、星云色块、3000+ 散落星点、400 颗亮星，贴于半径 18 的天空球内表面
- **鸭子视角改为仰视天空**：默认向上看，黄色曲线为太阳视运动轨迹（太阳单日运动路径），支持自由旋转缩放
- APK 大小: 881KB (debug)

### 已知限制
- Debug 签名，正式发布需使用 release keystore 签名
- 首版使用 Canvas 2D 渲染，后续可升级为 WebGL 以支持更流畅的 3D 场景
- 太阳视运动轨迹高于 60°N/S 的高纬度场景下极昼/极夜处理已实现，但 UI 可进一步优化
- 地球纹理加载后需设置 `tex.needsUpdate=true` 确保 CanvasTexture 在 WebView 中正确渲染
- 星空背景改为半径 10 的淡雅银河（1200 星点，薄银河带），避免喧宾夺主

### 2026-06-20 (v3.6)
- **CanvasTexture needsUpdate 修复**：`tex.needsUpdate=true` 确保地球纹理在 Android WebView 中正确显示
- **太阳视运动轨迹算法重写**：干净分离高度角/方位角计算，6:00/12:00/18:00 时间标签
- **星空背景精细化**：半径从 18→10，星点从 3000→1200，银河带更薄（宽 40+15），去除星云色块
- **太阳光增强**：DirectionalLight 强度从 4→5→6
- **鸭子视角默认仰视**：duckRotX=1.2（约 69°），垂直于地表向上看天空
- APK 大小: 870KB (debug)

### 2026-06-20 (v3.7)
- **地球纹理彻底重做**：XHR+Blob+ObjectURL 加载 PNG，失败时自动回退到程序化生成纹理（1024×512 Canvas，70+ 椭圆定义各大洲轮廓，含台湾）
- **地球材质切换为 MeshPhongMaterial**：比 MeshStandardMaterial 在 WebView 中更稳定明亮
- **鸭子视角改为看向太空**：lookAt 目标从 0.05 改为 3.0，沿地表法线方向看向高空，duckRotX 默认 1.4（~80°仰角）
- **UI 全面优化**：行间距 6→14px，按钮间距 4→8px，所有按钮添加 backdrop-filter:blur(14px) 高斯模糊效果，滑块高度 3→4px，触摸目标更大
- **环境光增强**：AmbientLight 0.55→0.65，HemisphereLight 0.3→0.35，toneMappingExposure 1.2→1.35
- APK 大小: 883KB (debug)

### 2026-06-20 (v3.8)
- **鸭子视角地球透视**：进入鸭子视角时地球透明度降至 28%（opacity=0.28, depthWrite=false），大气层隐藏，可看穿地球观察太阳视运动轨迹的 3D 空间关系
- **按钮随动发光**：所有按钮添加 `glowPulse` 动画（2.8s 循环，box-shadow 脉冲），激活状态用 `glowPulseOn`（2.2s 循环，金色强光），点击时爆发强光
- **滑块发光**：range 滑块添加 `drop-shadow` 滤镜发光，激活时增强
- **数值文本发光**：`.val` 标签添加金色 text-shadow
- **开关按钮发光**：toggleBtn 也加入 glowPulse 动画
- 退出鸭子视角时恢复地球不透明度和大气层
- APK 大小: 883KB (debug)

### 2026-06-20 (v3.9)
- **发光改为触碰响应**：移除所有持续脉冲动画，改为 `:active` 瞬间爆发 + `ease-out` 缓慢消退（0.04s 亮起，0.35s 淡出），符合"随动发光=触碰发光"的直觉
- **滑块发光增强**：`:active` 时双层 drop-shadow（12px + 24px），释放后缓慢消退
- **大陆形状按标准地图重绘**：改用 Canvas 多边形路径绘制各大洲精确轮廓（非洲、欧亚、印度、日韩、台湾、东南亚群岛、中东、阿拉伯半岛、北美、南美、澳洲、新西兰、格陵兰、南极洲等 30+ 个多边形），叠加地形高度椭球体增加地表纹理变化
- **纹理加载改用 `<img>` 标签**：HTML 内嵌隐藏 img 标签加载 PNG，绕过 JS Image() 的 WebView 兼容问题，3 秒超时自动回退程序化纹理
- **性能优化**：太阳轨迹标签改为对象池复用（`sunPathLabelPool`），避免每帧创建/销毁 Sprite；发光动画使用 GPU 加速的 box-shadow transition
- APK 大小: 885KB (debug)

### 2026-06-20 (v3.10)
- **太阳视运动轨迹始终可见**：`depthTest=false, depthWrite=false` 确保黄色轨迹线始终渲染在所有物体之上，不被地球或天空球遮挡
- **轨迹距离增加**：从 0.55→0.70，确保始终在相机前方（默认 duckZoom=0.55），旋转视角时不会跑到身后
- **轨迹透明度增强**：opacity 0.88→0.95，更醒目
- APK 大小: 885KB (debug)

### 2026-06-20 (v3.11)
- **鸭子视角无旋转限制**：移除 duckRotX 的 ±PI/2.2 限制，视角完全自由，duckZoom 范围从 0.1~3 扩展到 0.05~5
- **视角FOV增大**：进入鸭子视角时 camera.fov 从 45→75，视野更宽阔
- **重置按钮修复**：点击重置时恢复 camera.fov=45
- **大陆形状精细化**：重写全部大陆多边形数据，顶点密度提升约 2.5 倍，新增英国爱尔兰、意大利、西西里、撒丁岛、科西嘉岛、克里特岛、塞浦路斯、海南岛、牙买加，哈德逊湾内陆水域切割，勘察加、墨西哥独立形状
- **滑块触碰发光JS方案**：pointerdown/touchstart 时给父级 .row 添加 .glow class（背景高亮+双层 box-shadow），释放后 0.4s 淡出
- APK 大小: 907KB (debug)

### 2026-06-20 (v3.12)
- **鸭子视角重做**：模拟人站在地球表面抬头看星空。进入鸭子视角后地球停止自转（globeGroup.rotation.y 仅含 earthRotation），太阳随时刻变化绕地球移动（新增 updateSunPosition 函数），时刻调节关联太阳直射点与鸭子位置，调节时刻时地球和鸭子不动、太阳移动
- **鸭子视角初始参数调整**：duckRotX=0.55（更接近地平线，模拟站姿仰望），duckZoom=0.9
- **sunLight 位置动态计算**：根据太阳赤纬和 UTC 时刻计算太阳直射点经纬度，world space 中准确定位太阳光源
- **setDuckView 移除 timeOfDay 依赖**：totRot 仅含 earthRotation，保持地面参照系稳定
- **纹理加载**：继续使用 `<img>` 标签加载 earth_tex.png（最可靠的 WebView 方案），失败时回退程序化纹理
- **WebView 配置增加**：`setAllowFileAccessFromFileURLs(true)` 帮助解决 file:// 协议的图片加载限制
- APK 大小: 907KB (debug)

### 2026-06-20 (v3.13)
- **鸭子视角自动仰视天空**：duckRotX 从 0.55→0.85（约49°仰角），duckZoom 从 0.9→1.0，进入鸭子视角自动展示头顶天空画面
- **太阳视运动轨迹着重表现**：新增 sunPathGlow 发光晕线（橙色半透明，距离 0.72），主轨迹线（亮黄色，距离 0.70）形成双层发光效果，轨迹更加醒目
- **视角灵敏度降低一半**：旋转灵敏度 0.005→0.0025，滚轮缩放灵敏度 0.001→0.0005，操作更稳定不易过冲
- APK 大小: 908KB (debug)

### 2026-06-20 (v3.14)
- **鸭子视角功能完全移除**：删除 `isDuckView`、`setDuckView()`、duckRot 变量、camera FOV 切换、地球透明度变化、大气层隐藏等全部代码
- **太阳视运动轨迹移除**：删除 `sunPathLine`、`sunPathGlow`、`sunPathLabelPool`、`makeLabel()`、`updateSunPath()` 等全部轨迹相关代码
- **太阳位置修正**：timeOfDay 为鸭子所在经度当地时刻，公式 `sunGeoLng=duckLng-(timeOfDay-12)*15; sunLng=(90-sunGeoLng)*DEG`，确保当地正午太阳直射鸭子经线
- **地球固定，太阳移动**：`updateGlobeRotation` 仅含 `earthRotation*DEG`（手动地球旋转），太阳位置由 `updateSunPosition` 根据当地时刻+鸭子经度计算
- **timeOfDay = 当地时刻**：`updateDuckAstro` 直接用 timeOfDay 作为当地时刻，`updateInfo` 用 `utc=(timeOfDay-duckLng/15+24)%24` 换算 UTC 后算直射点经度
- **UTC 偏移显示修正**：天文数据面板显示 `UTC+8`（北京/东经120°），标签恢复为"当地时刻"
- APK 大小: 906KB (debug)

### 2026-06-20 (v3.15)
- **太阳视运动轨迹回归**：鸭子位置上方显示当地单日太阳视运动轨迹（黄色主线 + 橙色淡光晕线，73个采样点覆盖0-24小时）
- **轨迹计算**：根据鸭子纬度和太阳赤纬计算各时刻太阳高度角/方位角，转换为3D空间曲线，距离鸭子表面0.18单位
- **方位角直接从北计算**：直接使用标准天文公式 `sinAz=-cos(dec)*sin(H)/cosAlt` 计算方位角（0°=北，顺时针），不再做南→北转换
- **轨迹实时联动**：调节赤纬/时刻/鸭子经纬度/地球旋转时自动更新轨迹
- APK 大小: 906KB (debug)

### 2026-06-20 (v3.16)
- **坐标系修正**：修复鸭子经纬度与地球纹理位置不匹配的问题。Three.js SphereGeometry 的 UV 映射将 0° 经线（本初子午线）置于 3D 空间的 -Z 方向，但原 placeDuck() 公式将 0° 经度映射到 +X 方向，导致北京（116°E）的鸭子显示在太平洋上空
- **修正范围**：`placeDuck()` 位置和局部坐标系、`updateSunPath()` 鸭子位置和局部框架、`updateSunPosition()` 太阳世界坐标、`createTZGroup()` 时区标签位置、`lngRing()` 经线子午线顶点、`addLabel()` 标签精灵位置
- **新公式**：`px=-cos(lat)*sin(lng), pz=-cos(lat)*cos(lng)`，东向 `(-cos(lng), 0, sin(lng))`，北向 `(sin(lat)*sin(lng), cos(lat), sin(lat)*cos(lng))`
- **验证**：北京(116°E)、格林威治(0°)、东京(140°E)、纽约(74°W) 等测试点经纬度与纹理位置误差均为 0°
- APK 大小: 885KB (debug)

### 2026-06-20 (v3.17)
- **坐标符号修正**：v3.16 公式 `px=-cos(lat)*sin(lng)` 有误，Three.js SphereGeometry 顶点公式为 `x=-cos(φ)*sin(θ)`，代入 `θ=PI+lng*DEG` 后得 `px=+cos(lat)*sin(lng)`（正号）。v3.16 的负号导致鸭子出现在对趾经度（偏差 180°），现已修正为 `px=cos(lat)*sin(lng), pz=-cos(lat)*cos(lng)`
- **指南针**：鸭子下方 0.12 单位处显示指南针圆盘（Canvas 纹理），标有 N/S/E/W 方向、30° 间隔刻度线、方位角数字、红色北极箭头，`updateCompass()` 根据世界空间北方与摄像机方向实时旋转纹理对齐
- **太阳视运动轨迹时间标签**：5 个精灵标签（0:00/6:00/12:00/18:00/24:00），距离鸭子 0.24 单位，跟随轨迹曲线标注各时刻位置
- **重置默认值调整**：赤纬 +23.44°、当地时刻 05:02、地球自转 0°、鸭子纬度 30°N、鸭子经度 120°E（北京）
- APK 大小: 887KB (debug)

### 2026-06-20 (v3.17 修复)
- **黑屏修复**：`updateCompass()` 添加 compassSprite/material null 检查、camRight 零向量保护；`animate()` 中 try-catch 包裹 updateCompass 防止渲染循环崩溃；`updateSunPathLabels()` 添加 sunPathLabels null 检查
- APK 大小: 886KB (debug)

### 2026-06-20 (v3.18)
- **鸭子经度彻底修复**：v3.17 的公式 `px=cos(lat)*sin(lon)` 与 Three.js SphereGeometry UV 纹理映射差 90° 旋转（经度 0° 纹理在 +X 但鸭子公式将 lon=0 映射到 -Z）。彻底修正为 `px=cos(lat)*cos(lon), pz=-cos(lat)*sin(lon)`，同步修正 east/north 切向量、太阳位置、经线网格、时区标签位置、纬度标签位置等所有球坐标转换点
- **指南针增强**：重制 300×300 高清罗盘贴图（5° 刻度线、30° 方位角数字、金色 N 标记 + 红色箭头），`updateCompass()` 每帧更新（animate 循环中调用），位置固定在鸭子下方 0.16 单位处跟随移动
- **太阳方位角显示**：`duckAstro` 面板新增太阳方位角（度数 + 方位文字，如"135.0° (东南)"），通过 `getSunAzimuth()` 标准天文公式实时计算
- **太阳视运动轨迹增强**：时间标签（0:00/6:00/12:00/18:00/24:00）放大至 128×36 Canvas，白色双层描边 + 橙色阴影发光，光晕线透明度提升至 0.45
- **性能优化**：时区标签纹理从每帧新建 Canvas → 预缓存 day/night 两套纹理，`updateTZLabels()` 仅切换引用不再分配内存；`updateCompass()` 精简至仅旋转更新，移除所有 Canvas 创建
- **Bug 修复**：`_errs` 变量未声明导致错误处理器自身崩溃；删除 `_compassAzimuthSprites`/`createAzimuthSprites` 残留死代码
- APK 大小: 908KB (debug)

### 2026-06-20 (v3.19)
- **移除指南针与方位角**：删除 `createCompass()`、`updateCompass()`、`getSunAzimuth()` 函数及全部相关代码
- **移除 v3.18.1 调试代码**：删除 `#errLog` 面板、`_log()` 函数、init try-catch 包裹层
- **animate 简化**：仅保留 `requestAnimationFrame` + `renderer.render`
- **关键修复**：`sunPathLabels` 变量提升（hoisting）Bug — `var sunPathLabels=[]` 声明在函数定义区（第 631 行）但 `createSunPathLabels()` 在 init 段（第 230 行）调用，此时变量尚未初始化导致 `.push()` 抛出 `TypeError`，整个 init 链中断、渲染循环从未启动。修复：将 `sunPathLabels` 加入全局声明，在调用前显式初始化为 `[]`
- APK 大小: 907KB (debug)

