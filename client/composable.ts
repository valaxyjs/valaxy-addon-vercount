import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { isClient } from '@vueuse/core'
import type { Page, Site } from '../types'
import { useAddonVercountConfig } from './options'

export function useAddonVercount() {
  const vercountOptions = useAddonVercountConfig()
  const placeholder = vercountOptions.value.placeholder!

  const page = ref<Page>({ pv: placeholder, uv: placeholder })
  const site = ref<Site>({ pv: placeholder, uv: placeholder })

  if (!isClient)
    return { page, site }

  const router = useRouter()

  const baseUrl = vercountOptions.value.baseUrl ?? window.location.origin

  const defaultUrl = 'https://vercount.one/log?jsonpCallback=VisitorCountCallback'
  const cnUrl = 'https://cn.vercount.one/log?jsonpCallback=VisitorCountCallback'

  const url = vercountOptions.value.api === 'cn' ? cnUrl : vercountOptions.value.api || defaultUrl

  const generateBrowserToken = () => {
    const screenInfo = `${window.screen.width}x${window.screen.height}x${window.screen.colorDepth}`;
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    const languages = navigator.languages ? navigator.languages.join(',') : navigator.language || '';
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl');
    const glInfo = gl ? gl.getParameter(gl.RENDERER) : '';
    const components = [
      screenInfo,
      timeZone,
      languages,
      navigator.userAgent,
      glInfo,
      new Date().getTimezoneOffset()
    ].join('|');
    let hash = 0;
    for (let i = 0; i < components.length; i++) {
      hash = ((hash << 5) - hash) + components.charCodeAt(i);
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(36);
  };

  const fetchVisitorCount = (href: string) => {
    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json',  'X-Browser-Token': generateBrowserToken() },
      body: JSON.stringify({ url: href }),
    })
      .then((response) => {
        if (!response.ok)
          throw new Error(`Network response was not ok.`)

        return response.json()
      })
      .then((data) => {
        page.value.pv = data.page_pv
        page.value.uv = data.page_uv

        site.value.pv = data.site_pv
        site.value.uv = data.site_uv
      }).catch((error) => {
        console.error('Error fetching visitor count:', error)
      })
  }

  router.beforeEach((to) => {
    const completeUrl = baseUrl + to.fullPath
    fetchVisitorCount(completeUrl)
  })

  onMounted(() => {
    fetchVisitorCount(window.location.href)
  })

  return {
    page,
    site,
  }
}
