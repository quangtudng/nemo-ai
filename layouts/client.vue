<template>
  <div v-if="maintenanceMode">
    <div class="maintenance-container">
      <img
        src="~/assets/img/maintenance.jpg"
        alt="maintenance-image"
        style="width: 350px;"
      />
      <h1 class="mb-5" style="font-size: 50px;">
        We'll be back soon!
      </h1>
      <div>
        <p class="mb-5">
          <span>
            Sorry for the inconvenience but we're performing some maintenance at
            the moment. If you need to you can always
          </span>
          <a class="contact-url" href="mailto:quangtupct@gmail.com">
            contact us
          </a>
          <span>, otherwise we'll be back online shortly!</span>
        </p>
        <p>— NemoAI Development Team</p>
      </div>
    </div>
  </div>
  <div v-else>
    <nuxt class="relative" />
  </div>
</template>
<script>
export default {
  name: 'Home',
  layout: 'client',
  data() {
    return {
      maintenanceMode: true,
    }
  },
}
</script>
<style scoped>
.maintenance-container {
  display: block;
  text-align: left;
  max-width: 900px;
  margin: 0 auto;
  font: 20px Helvetica, sans-serif;
  color: #333;
  padding: 50px 100px;
}
.contact-url {
  color: #dc8100;
  text-decoration: none;
}
.contact-url:hover {
  color: #333;
  text-decoration: none;
}
</style>
