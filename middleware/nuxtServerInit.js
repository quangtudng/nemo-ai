export default async function ({ store }) {
  if (!store.state.serverReady) {
    await store.dispatch('nuxtServerInit')
  }
}
