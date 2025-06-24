import type { ComputedRef, MaybeRef } from 'vue'
export type LayoutKey = "default" | "editor"
declare module "../../node_modules/_nuxt@3.14.1592@nuxt/dist/pages/runtime/composables" {
  interface PageMeta {
    layout?: MaybeRef<LayoutKey | false> | ComputedRef<LayoutKey | false>
  }
}