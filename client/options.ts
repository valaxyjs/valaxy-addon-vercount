import { computed } from 'vue'
import type { ValaxyAddon } from 'valaxy'
import { useRuntimeConfig } from 'valaxy'
import { useBrowserLocation } from '@vueuse/core'
import type { VercountOptions } from '../types'

export function useAddonVercountConfig() {
  const runtimeConfig = useRuntimeConfig()
  const location = useBrowserLocation()

  return computed<VercountOptions>(() => {
    const options = (runtimeConfig.value.addons['valaxy-addon-vercount'] as ValaxyAddon<VercountOptions>).options

    return {
      placeholder: '-',
      baseUrl: location.value.origin,
      ...options,
    }
  })
}
