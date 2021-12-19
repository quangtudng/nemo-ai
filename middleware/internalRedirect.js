export default function ({ store, redirect, route }) {
  if (route.path === '/internal') {
    return redirect('/internal/customers')
  }
}
