export interface VercountOptions {
  api?: string
  baseUrl?: string
  placeholder?: string | number | null
}

export interface Page {
  /**
   * @en Page views
   * @zh 页面的浏览次数
   */
  pv?: number | string
  /**
   * @en Unique visitors
   * @zh 独立访客数量
   */
  uv?: number | string
}

export interface Site {
  /**
   * @en Site views
   * @zh 站点的浏览次数
   */
  pv?: number | string
  /**
   * @en Unique visitors
   * @zh 独立访客数量
   */
  uv?: number | string
}
