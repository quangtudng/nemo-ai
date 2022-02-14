<template>
  <div></div>
</template>
<script>
export default {
  layout: 'client',
  name: 'Home',
  middleware({ redirect }) {
    return redirect('/chatbot')
  },
}
</script>
