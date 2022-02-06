export default async function ({ store }) {
  // Always call this method when server finishes loading
  if (!store.state.serverReady) {
    await store.dispatch('nuxtServerInit')
  }
}
