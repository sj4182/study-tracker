# 学习记录追踪器

这是一个基于网页的学习记录追踪工具，可以帮助你记录和追踪每日学习情况。项目使用 HTML、CSS 和 JavaScript 开发，通过 GitHub Pages 部署，可以在任何设备上访问。

## 功能特点

- 记录每日学习内容
- 追踪学习时长
- 查看学习历史记录
- 支持添加学习笔记
- 数据云端同步
- 多设备访问支持

## 技术栈

- HTML5：页面结构
- CSS3：页面样式
- JavaScript：交互功能
- GitHub Pages：网站托管
- GitHub API：数据同步

## 使用方法

1. 访问网站：
   - 打开浏览器访问：`https://sj4182.github.io/study-tracker`
   - 手机和电脑都可以访问

2. 记录学习：
   - 填写学习科目
   - 输入学习时长
   - 添加学习笔记
   - 点击保存按钮

3. 查看历史：
   - 使用筛选功能查看不同时间段的记录
   - 可以删除不需要的记录

## 数据同步原理

1. 本地存储：
   - 使用浏览器的 LocalStorage 存储数据
   - 数据格式为 JSON
   - 包含学习记录的所有信息

2. 云端同步：
   - 使用 GitHub API 进行数据同步
   - 数据存储在 GitHub 仓库中
   - 自动同步到所有设备

3. 同步流程：
   ```
   本地修改 → 提交到本地 → 推送到 GitHub → GitHub Pages 自动部署
   (修改代码) → (git commit) → (git push) → (自动更新网站)
   ```

## 开发指南

1. 本地开发：
   - 克隆仓库：`git clone https://github.com/sj4182/study-tracker.git`
   - 修改代码
   - 提交修改：`git add . && git commit -m "修改说明"`
   - 推送到 GitHub：`git push origin main`

2. 文件结构：
   ```
   study-tracker/
   ├── index.html      # 主页面
   ├── styles.css      # 样式文件
   ├── script.js       # JavaScript 功能
   └── README.md       # 项目说明
   ```

3. 代码修改：
   - 修改 HTML：更新页面结构
   - 修改 CSS：调整页面样式
   - 修改 JavaScript：更新功能逻辑

## GitHub 使用说明

1. 基本概念：
   - 本地仓库：你电脑上的代码
   - 远程仓库：GitHub 上的代码
   - 通过 push 和 pull 同步代码

2. 常用命令：
   ```bash
   git init          # 初始化本地仓库
   git add .         # 添加修改的文件
   git commit        # 提交修改
   git push          # 推送到远程
   git pull          # 拉取更新
   ```

3. 版本控制：
   - 可以查看所有修改历史
   - 可以回退到任意版本
   - 可以多人协作
   - 代码不会丢失

## 部署说明

1. GitHub Pages：
   - 自动从仓库获取代码
   - 将代码部署为网站
   - 通过 github.io 域名访问
   - 自动更新最新代码

2. 访问地址：
   - 网站地址：`https://sj4182.github.io/study-tracker`
   - 仓库地址：`https://github.com/sj4182/study-tracker`

## 注意事项

1. 数据安全：
   - 数据存储在 GitHub 仓库中
   - 使用 HTTPS 加密传输
   - 定期备份重要数据

2. 使用建议：
   - 定期同步数据
   - 及时更新代码
   - 保持网络连接

## 更新日志

- 2024-03-xx：初始版本发布
  - 基本学习记录功能
  - 数据同步功能
  - 移动端支持

## 贡献指南

1. 提交问题：
   - 在 GitHub 仓库提交 Issue
   - 描述问题或建议

2. 提交代码：
   - Fork 仓库
   - 创建新分支
   - 提交修改
   - 发起 Pull Request

## 许可证

MIT License
