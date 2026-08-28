# LX Music iOS 版构建指南

> 本指南用于将 `lx-music-mobile` 项目适配并在 GitHub Actions 上编译 iOS 版本。
> 当前环境为 Windows，无法本地运行 iOS 模拟器，因此采用云端 macOS Runner 编译。

---

## 已完成的改动

| 文件 | 改动说明 |
|---|---|
| `ios/LxMusicMobile/Info.plist` | 添加后台音频模式（`audio`/`fetch`/`processing`）、麦克风与 Apple Music 权限说明 |
| `ios/Podfile` | 固定最低 iOS 版本为 `13.0`；CI 环境下自动禁用 Flipper |
| `react-native.config.js` | 新增配置文件，声明 iOS/Android 源码目录，支持 CI 禁用 Flipper |
| `.github/workflows/ios-build.yml` | 新增 GitHub Actions 工作流，自动在 macOS 上编译 iOS 模拟器版本 |

---

## 快速开始

### 1. 将代码推送到 GitHub

如果你已经 fork 了原仓库：

```bash
git add .
git commit -m "feat: add iOS build support and GitHub Actions workflow"
git push origin main
```

如果还没有仓库：

```bash
# 在 GitHub 上创建空仓库，然后关联推送
git remote add origin https://github.com/你的用户名/lx-music-mobile-ios.git
git branch -M main
git push -u origin main
```

### 2. 触发 GitHub Actions

推送后进入仓库页面 → **Actions** → **iOS Build** → 选择 **Run workflow** 手动触发，或等待 push 自动触发。

### 3. 查看编译结果

- 成功：可在 Actions 产物中下载 `LxMusicMobile-simulator`，在 Mac 上配合 iOS 模拟器运行。
- 失败：下载 `ios-build-log` 查看详细日志。

---

## 已知限制

以下依赖主要面向 Android，iOS 端可能存在功能缺失或空实现：

| 依赖 | iOS 支持情况 | 说明 |
|---|---|---|
| `react-native-track-player` (lyswhut fork) | ✅ 有 iOS 代码 | 核心播放功能可工作 |
| `react-native-file-system` (lyswhut fork) | ⚠️ 有 podspec，但 README 标注 Android | 文件操作可能不完整 |
| `react-native-local-media-metadata` (lyswhut fork) | ⚠️ 基于 Android Jaudiotagger | 本地音频元数据读取在 iOS 上可能无效 |
| `react-native-background-timer` | ✅ 通常支持 iOS | 后台定时器可用 |

**结论**：模拟器编译大概率能通过，但部分功能（尤其是本地文件扫描、元数据读取）在 iOS 上需要额外原生开发。

---

## 后续：打包真机 IPA

模拟器版只能看 UI 和基础播放。要安装到真机或上架，需要 Apple Developer 账号。

### 在 GitHub Actions 中配置证书

1. 在本地 Mac 上创建 App ID、Distribution Certificate、Provisioning Profile。
2. 将证书和 Profile 转为 Base64：

```bash
base64 -i 证书.p12 | pbcopy
base64 -i profile.mobileprovision | pbcopy
```

3. 在 GitHub 仓库设置 → **Secrets and variables** → **Actions** 中添加：
   - `P12_BASE64`
   - `P12_PASSWORD`
   - `MOBILEPROVISION_BASE64`
   - `TEAM_ID`

4. 将 `.github/workflows/ios-build.yml` 中的编译命令从 `iphonesimulator` 改为 `iphoneos`，并添加签名参数。

---

## 调试建议

1. **先在 GitHub Actions 上跑通模拟器版本**，确认项目能编译。
2. **再逐步修复运行时问题**：
   - 如果启动白屏，检查 Metro 是否能正常打包 JS Bundle。
   - 如果音频无法播放，检查网络请求是否被 ATS 拦截（Info.plist 中 `NSAllowsArbitraryLoads` 当前为 `false`）。
   - 如果本地文件功能异常，考虑替换为 iOS 原生实现或条件禁用。

---

## 免责声明

本项目仅用于技术学习和研究。LX Music 本身不对第三方音乐源负责，iOS 版若接入第三方源需自行承担相关合规与版权风险。
