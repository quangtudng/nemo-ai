<template>
  <div></div>
</template>
<script>
export default {
  name: 'Home',
  layout: 'client',
  middleware({ redirect }) {
    return redirect('/chatbot')
  },
}
</script>
