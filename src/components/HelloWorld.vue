<template>
  <div class="hello">
    <a href="#" @click="signout">登出</a>
  </div>
</template>

<script>
export default {
  data () {
    return {}
  },
  methods: {
    signout () {
      const api = `${process.env.VUE_APP_APIPATH}/logout`
      const vm = this
      this.$http.post(api).then((response) => {
        console.log(response.data)
        if (response.data.success) {
          vm.$router.push('/login')
        }
      })
    }
  }
}
</script>
