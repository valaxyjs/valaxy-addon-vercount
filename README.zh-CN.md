<h1 align="center">valaxy-addon-vercount</h1>
<pre align="center">
基于 <a href="https://vercount.one/">Vercount</a> API 实现的 <a href="https://github.com/YunYouJun/valaxy">Valaxy</a> 计数插件, 用于不蒜子计数替代方案
</pre>

<p align="center">
<a href="https://www.npmjs.com/package/valaxy-addon-vercount" rel="nofollow"><img src="https://img.shields.io/npm/v/valaxy-addon-vercount?color=0078E7" alt="NPM version"></a>
</p>

- [English](./README.md) | 简体中文

## 特性

- ⚡ 高速响应，服务器响应时间小于 10ms
- 🌎 API 可选择中国加速版或默认 Vercel 全球 CDN
- 📊 通过 POST 请求进行统计，支持移动端及各种浏览器，准确性高
- 🔒 使用 JSON 回调，避免 CSRF 攻击
- 🔄 自动同步所有不蒜子数据

## 安装插件

```bash
pnpm add valaxy-addon-vercount
```

```ts
import { defineValaxyConfig } from 'valaxy'
import { addonVercount } from 'valaxy-addon-vercount'

export default defineValaxyConfig({
  addons: [
    addonVercount({
      api: 'cn'
    }),
  ],
})
```

## 使用插件

```vue
<script lang="ts" setup>
import { useAddonVercount } from 'valaxy-addon-vercount'

const { page, site } = useAddonVercount()
</script>

<template>
  <span>本文总阅读量 {{ page.pv }} 次</span>
  <span>本文总访客量 {{ page.uv }} 人</span>
  <span>本站总访问量 {{ site.pv }} 次</span>
  <span>本站总访客数 {{ site.uv }} 人</span>
</template>
```

## 配置 / Options

| 属性名 | 类型 | 默认值 | 说明 |
| ---- | ---- | ---- | ---- |
| api | `string` | --- | 填入 'cn' 为中国访问优化版本，填入其他为自定义 API |
| baseUrl | `string` | --- | 获取当前网页的源，默认自动获取 `window.location.origin` |
| placeholder | `string` \| `number` \| `null` | `'-'` | 获取访问量时的占位符 |

### 致谢

- [Vercount](https://github.com/EvanNotFound/vercount)
- [不蒜子](https://busuanzi.ibruce.info/)
