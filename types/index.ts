export interface VercountOptions {
  api?: string
  baseUrl?: string
  placeholder?: string | number
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
  /**
   * @en Online visitors on the page
   * @zh 当前页面的在线人数
   */
  online?: number | string
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
  /**
   * @en Online visitors on the site
   * @zh 当前站点的在线人数
   */
  online?: number | string
}
