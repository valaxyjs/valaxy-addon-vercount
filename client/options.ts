import { computed } from 'vue'
import type { ValaxyAddon } from 'valaxy'
import { useRuntimeConfig } from 'valaxy'
import type { VercountOptions } from '../types'

export function useAddonVercountConfig() {
  const runtimeConfig = useRuntimeConfig()
  return computed<VercountOptions>(() => {
    const options = (runtimeConfig.value.addons['valaxy-addon-vercount'] as ValaxyAddon<VercountOptions>).options

    return {
      placeholder: '-',
      ...options,
    }
  })
}
