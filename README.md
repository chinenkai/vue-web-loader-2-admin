# vue-web-loader-2-admin

一个简单通用的后台模板，提供了“表格、表单、统计”三种类型的后台页面，通过提供JSON配置，即可实现一个简单的后台。

设计参考  [SCUI](https://gitee.com/lolicode/scui)

## 项目预览：
预览地址：[DEMO](https://vue-web-loader-2-admin.pages.dev/)

默认帐号：vue-web-loader-2-admin

默认密码：vue-web-loader-2-admin

## 项目部署：

下面介绍如何在本地环境中安装和部署项目，包括安装 wrangler、创建 D1 数据库和 KV 数据库。

### 1. 安装 Wrangler
首先，您需要安装 wrangler，这是 Cloudflare 提供的命令行工具，用于管理和部署 Cloudflare Workers 和 Pages。

```bash
npm install -g wrangler
```
安装完成后，您可以通过以下命令验证 wrangler 是否安装成功：

```bash
wrangler --version
```
### 2. 创建 D1 数据库
在本地项目目录下，您需要创建一个 D1 数据库。以下是创建和初始化数据库的步骤：

### 2.1 创建数据库
使用 wrangler 命令创建一个新的 D1 数据库：

```bash
wrangler d1 create <YOUR_DATABASE_NAME>
```
将 <YOUR_DATABASE_NAME> 替换为您想要的数据库名称。

### 2.2 保存数据库配置
创建数据库后，wrangler 会生成一些配置信息。您需要将这些配置信息保存到 wrangler.toml 文件中。

### 2.3 初始化本地数据库
在本地环境中初始化数据库，执行以下命令：

```bash
wrangler d1 execute <YOUR_DATABASE_NAME> --local --file=./install.sql
```
### 2.4 初始化线上数据库
在项目上线时，您需要初始化线上数据库。执行以下命令：

```bash
wrangler d1 execute <YOUR_DATABASE_NAME> --remote --file=./install.sql
```
注意，项目上线时请移除install.sql文件。

### 3. 创建 KV 数据库
接下来，您需要创建一个 KV 数据库。以下是创建和配置 KV 数据库的步骤：

### 3.1 创建 KV 命名空间
使用 wrangler 命令创建一个新的 KV 命名空间：

```bash
wrangler kv namespace create <YOUR_NAMESPACE>
```
将 <YOUR_NAMESPACE> 替换为您想要的命名空间名称。

### 3.2 保存 KV 配置
创建命名空间后，wrangler 会生成一些配置信息。您需要将这些配置信息保存到 wrangler.toml 文件中。

### 4. 指定buckets
需要通过Cloudflare管理面板创建buckets，并将地址配置到wrangler.toml
```bash
[[r2_buckets]]
binding = 'BUCKET' # <~ valid JavaScript variable name
bucket_name = 'vue-web-loader-2-admin-r2'

[vars]
R2_BUCKET_DOMAIN = "https://xxxx.r2.dev/"
```

### 5. 远程调试
在开发过程中，您可能需要进行远程调试。以下是远程调试的命令：

```bash
wrangler pages deployment tail --project-name <YOUR_PROJECT_NAME>
```
将 <YOUR_PROJECT_NAME> 替换为您的项目名称。

### 6. 本地开发
在本地开发环境中，您可以使用以下命令启动本地开发服务器：

```bash
wrangler pages dev ./ --local
```
这将启动一个本地开发服务器，您可以在本地环境中进行开发和测试。

### 7. 项目上线
在项目上线时，您需要前往 Cloudflare 网页版控制台，将 KV 和 D1 数据库操作绑定到您的项目中。路径如下：

```bash
项目 -> 设置 -> 函数
```
在此处，您可以配置数据库和 KV 命名空间的绑定。