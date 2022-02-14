export default function ({ store, redirect, route }) {
  // Redirect to the customer page
  if (route.path === '/internal') {
    return redirect('/internal/customers')
  }
}
