// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  vue: {
    compilerOptions: {
        isCustomElement: (tag) => tag === 'iconify-icon',
    }
  }
})
