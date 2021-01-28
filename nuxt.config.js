require('dotenv').config();

export default {
  // Server configurations such as the host to listen or the port to use
  // https://nuxtjs.org/docs/2.x/configuration-glossary/configuration-server
  server: {
    host: '0.0.0.0',
    port: 8080,
    // Uncomment the next line to use a socket (useful with Nginx or other reverse proxies)
    // socket: '/tmp/nuxt.socket',
  },

  // Environment variables
  publicRuntimeConfig: {
    recaptchaKey: process.env.RECAPTCHA_KEY,
    paypalKey: process.env.PAYPAL_KEY,
  },

  serverMiddleware: [{ path: '/api', handler: '~/server/rest.js' }],

  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    title: 'lapalmeraie',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: 'Site du serveur Minecraft La Palmeraie',
      },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: [],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    // https://go.nuxtjs.dev/bootstrap
    'bootstrap-vue/nuxt',
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://go.nuxtjs.dev/content
    '@nuxt/content',
    // https://github.com/nuxt-community/proxy-module
    '@nuxtjs/proxy',
  ],

  // Axios module configuration (https://go.nuxtjs.dev/config-axios)
  axios: {
    proxy: true,
  },

  proxy: {
    '/api/': { target: 'http://localhost:8080', changeOrigin: true },
  },

  // Content module configuration (https://go.nuxtjs.dev/config-content)
  content: {},

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {},

  bootstrapVue: {
    icons: true,
  },
};
