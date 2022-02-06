export default function ({ store, redirect }) {
  // If the user is not authenticated, redirect back to login page
  if (!store.state.auth.data) {
    return redirect('/internal/login')
  }
}
