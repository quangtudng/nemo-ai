/* eslint-disable */
export default {
  /*
   ** Nuxt rendering mode
   ** See https://nuxtjs.org/api/configuration-mode
   */
  mode: 'spa',
  /*
   ** Nuxt target
   ** See https://nuxtjs.org/api/configuration-target
   */
  target: 'server',
  server: {
    port: process.env.PORT || 3010, // default: 3010
    host: process.env.HOST || 'localhost' // default: localhost
  },
  /*
   ** Headers of the page
   ** See https://nuxtjs.org/api/configuration-head
   */
  head: {
    title: 'Sanna Tour JSC',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: 'Sanna Tour JSC',
      },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: 'green' },
  /*
   ** Customize how page and layout transition looks
   */
  layoutTransition: {
    // Is "layout" by default
    name: 'fade',
    mode: 'out-in'
  },
  pageTransition: {
    // Is "page" by default
    name: 'slide-fade',
    mode: 'out-in',
  },
  /*
   ** Global CSS
   */
  css: [
    '~/assets/css/animate.css/all.min.css',
    '~/assets/scss/main.scss', // CSS class customization can cause confliction with other ui package
  ],
  /*
   ** Import scss resource in every component
   ** For global color variables, use CSS variables in :root{}
   ** For color configuration, go to ~/assets/scss/base/utitlities/_variants.scss
   */
  // styleResources: {
  //   scss: ['~/assets/scss/..........'],
  // },
  /*
   ** Plugins to load before mounting the App
   ** https://nuxtjs.org/guide/plugins
   */
  plugins: [
    // Services
    '~/services/fileUploader.js',
    '~/services/auth.js',
    '~/services/client.js',
    // Plugins
    '@/plugins/element-ui',
    '~/plugins/i18n.js',
    '~/plugins/vee-validate.js',
    // Utilities
    '~/utils/bus.js', // Event bus
    '~/utils/filters.js', // Filters for custom text formating
    '~/mixins' // Global helper functions, use this.function_name() in your component
  ],
  /*
   ** Auto import components
   ** See https://nuxtjs.org/api/configuration-components
   */
  components: true,
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    // Doc: https://github.com/nuxt-community/nuxt-tailwindcss
    '@nuxtjs/tailwindcss',
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    // Doc: https://github.com/nuxt-community/dotenv-module
    '@nuxtjs/dotenv',
    [
      'nuxt-fontawesome',
      {
        component: 'fa',
        imports: [
          {
            set: '@fortawesome/free-solid-svg-icons',
            icons: ['fas']
          },
          {
            set: '@fortawesome/free-brands-svg-icons',
            icons: ['fab']
          }
        ]
      }
    ],
    '@nuxtjs/style-resources'
  ],
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {
    baseURL: process.env.API_URL || ''
  },
  /*
   ** Build configuration
   ** See https://nuxtjs.org/api/configuration-build/
   */
  build: {
    transpile: [/^element-ui/, 'vee-validate'],
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {
      // Run ESLint on save
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/,
          options: {
            fix: true
          }
        })
      }
      // Because we're using Jimp, which use fs and it cannot find fs on its own
      // So by configuring this, we can use fs in Jimp or other packages that depend on it
      config.node = {
        fs: 'empty'
      }
    }
  },
  router: {
    // base: '.',
    middleware: ['nuxtServerInit', 'getLocale']
  },
  generate: {
    /*
     ** Declare specific routes for static generator
     */
    // routes: [
    //   '/'
    // ]
    /*
     ** Or dynamic routes
     */
    // routes () {
    //   return axios.get('https://my-api/users')
    //     .then((res) => {
    //       return res.data.map((user) => {
    //         return '/users/' + user.id
    //       })
    //     })
    // }
  }
}
