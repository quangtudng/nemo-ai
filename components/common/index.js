// NOTE! IMPORTANT!
// You can't import common components into a common component using index.js in '~/components/common'
// For example: cannot import FormWrapper in LoginForm, using import {...} from '~/components/common'
// Auth
export { default as LoginForm } from './Auth/Login/LoginForm.vue'
// export { default as Signup } from './Auth/Signup.vue'
// Layout
export { default as Navbar } from './Layout/Navbar.vue'
export { default as Sidebar } from './Layout/Sidebar/Main.vue'
export { default as Footer } from './Layout/Footer.vue'
// Templates
// Breadcrumb
export { default as Breadcrumb } from './Templates/Breadcrumb/MainBreadcrumb.vue'
// Form
export { default as FormWrapper } from './Templates/Form/FormWrapper.vue'
export { default as InputWrapper } from './Templates/Form/InputWrapper.vue'
// Input
export { default as FileUploader } from './Templates/Input/FileUploader.vue'
// Table
export { default as StaticTable } from './Templates/Table/StaticTable.vue'
export { default as DataTable } from './Templates/Table/DataTable.vue'
