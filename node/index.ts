import { defineValaxyAddon } from 'valaxy'
import pkg from '../package.json'
import type { VercountOptions } from '../types'

export const addonVercount = defineValaxyAddon<VercountOptions>(options => ({
  name: pkg.name,
  enable: true,
  options,
}))
