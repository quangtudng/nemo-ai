export default function ({ route, redirect }) {
  if (route.path === '/internal') {
    redirect('/internal/users')
  }
}
