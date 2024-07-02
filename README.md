<h1 align="center">valaxy-addon-vercount</h1>
<pre align="center">
A <a href="https://vercount.one/">Vercount</a> API based counting plugin for <a href="https://github.com/YunYouJun/valaxy">Valaxy</a>, serving as an alternative to Busuanzi counting
</pre>

- English | [简体中文](./README.zh-CN.md)

## Features

- ⚡ High-speed response, server response time less than 10ms
- 🌎 Option to use China accelerated version or default Vercel global CDN for the API
- 📊 Statistics through POST requests, supporting mobile devices and various browsers, with high accuracy
- 🔒 Use of JSON callbacks to avoid CSRF attacks
- 🔄 Automatically synchronizes all Busuanzi data

## Installing this Plugin

```bash
pnpm add valaxy-addon-vercount
```

```ts
import { defineValaxyConfig } from 'valaxy'
import { addonVercount } from 'valaxy-addon-vercount'

export default defineValaxyConfig({
  addons: [
    addonVercount(),
  ],
})
```

## Using this Plugin

```vue
<script lang="ts" setup>
import { useAddonVercount } from 'valaxy-addon-vercount'

const { page, site } = useAddonVercount()
</script>

<template>
  <span>Article reads: {{ page.pv }}</span>
  <span>Article visitors: {{ page.uv }}</span>
  <span>Site visits: {{ site.pv }}</span>
  <span>Site visitors: {{ site.uv }}</span>
</template>
```

## Configuration / Options

| Name | Type | Default | Description |
| ---- | ---- | ---- | ---- |
| api | `string` | --- | Fill in 'cn' for the China optimized version, or other values for custom API |
| baseUrl | `string` | --- | Gets the source of the current page, default is automatically `window.location.origin` |
| placeholder | `string` \| `number` \| `null` | `'-'` | Placeholder for visit count |

## Thanks

- [Vercount](https://github.com/EvanNotFound/vercount)
- [busuanzi](https://busuanzi.ibruce.info/)
