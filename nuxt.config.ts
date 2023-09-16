// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  css: ["~/assets/css/main.css", "vue-toast-notification/dist/theme-sugar.css"],

  typescript: {
    typeCheck: true,
  },

  modules: ["@nuxtjs/supabase", "@vueuse/nuxt"],

  supabase: {
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_KEY,
    redirectOptions: { login: "/", callback: "/chats" },
  },

  ssr: false,

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
});
