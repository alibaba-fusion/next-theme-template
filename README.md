# next 主题包模板

## 构建流程

主题在构建时, 会执行以下过程:

1. 获取主题数据, 生成模板参数
2. 拉取主题模板, 如果主题无自定义模板, 就使用基础主题的模板
3. 调用 nunjucks 引擎编译模板, 生成主题包
4. 在主题包中执行 `npm install`, 安装依赖
5. 在主题包中执行 `npm run build-theme`, 执行构建

## 模板参数

配置平台在发布主题时, 会传入以下参数进行模板填充

* name: 主题包名
* version: 主题包版本
* author: 作者
* theme: 主题
* library: 基础库
* variables: 变量
* tokens: token

## 模板语法

模板基于 nunjucks, 所有 nunjucks 默认的语法和 filter 都支持
