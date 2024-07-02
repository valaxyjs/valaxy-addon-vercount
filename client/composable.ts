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
