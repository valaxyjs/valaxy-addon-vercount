import { onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { isClient } from '@vueuse/core'
import type { Page, Site } from '../types'
import { Oneline } from '../helpers/oneline'
import { useAddonVercountConfig } from './options'

export function useAddonVercount() {
  const vercountOptions = useAddonVercountConfig()
  const { placeholder, api, baseUrl } = vercountOptions.value

  const page = ref<Page>({ pv: placeholder, uv: placeholder, online: placeholder })
  const site = ref<Site>({ pv: placeholder, uv: placeholder, online: placeholder })

  let pageOnelineInstance: Oneline
  let siteOnelineInstance: Oneline

  if (!isClient)
    return { page, site }

  const router = useRouter()

  const defaultUrl = 'https://vercount.one/log?jsonpCallback=VisitorCountCallback'
  const cnUrl = 'https://cn.vercount.one/log?jsonpCallback=VisitorCountCallback'

  const url = api === 'cn' ? cnUrl : api || defaultUrl

  const fetchVisitorCount = (href: string) => {
    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
      }).catch ((error) => {
        console.error('Error fetching visitor count:', error)
      })
  }

  const setupOnelineListener = (href: string) => {
    pageOnelineInstance = new Oneline(href)
    pageOnelineInstance.on('OnelineUpdate', (e) => {
      page.value.online = e.detail.count
    })

    siteOnelineInstance = new Oneline(baseUrl!)
    siteOnelineInstance.on('OnelineUpdate', (e) => {
      site.value.online = e.detail.count
    })
  }

  const removeOnelineListener = () => {
    pageOnelineInstance?.destroy()
    siteOnelineInstance?.destroy()
  }

  const handleVisitorCountAndListener = (href: string) => {
    fetchVisitorCount(href)
    setupOnelineListener(href)
  }

  router.beforeEach((to) => {
    const completeUrl = baseUrl + to.fullPath
    removeOnelineListener()
    handleVisitorCountAndListener(completeUrl)
  })

  onMounted(() => {
    const currentUrl = window.location.href
    handleVisitorCountAndListener(currentUrl)
  })

  onUnmounted(() => {
    removeOnelineListener()
  })

  return { page, site }
}
