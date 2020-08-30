<template>
  <div class="cart">
    <div class="container">
      <table class="table mt-4">
        <thead>
          <tr>
            <th></th>
            <th>品名</th>
            <th>數量</th>
            <th>單價</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item) in cartData.carts" :key='item.id'>
            <td>
              <button type="button" class="btn btn-outline-danger btn-sm ml-auto" @click='removeCartItem(item.id)'>
                <i class="fas fa-trash-alt"></i>
              </button>
            </td>
            <td>
              {{ item.product.title }}
              <div class='text-success' v-if='item.coupon'>
                已套用優惠卷
              </div>
            </td>
            <td>{{ item.qty }}</td>
            <td>
              {{ item.total }}
            </td>
          </tr>
          <tr>
            <td colspan="3" class='text-right'>總計</td>
            <td>{{ cartData.total }}</td>
          </tr>
          <tr v-if="cartData.total !== cartData.final_total" class='text-success'>
            <td colspan="3" class='text-right'>優惠價</td>
            <td>{{ cartData.final_total }}</td>
          </tr>
        </tbody>
      </table>
      <div class="input-group input-group-sm mb-3">
        <input type="text" class='form-control' placeholder="請輸入優惠碼" v-model='couponCode'>
        <div class="input-group-append">
          <button class='btn btn-outline-secondary' type='button' @click.prevent='useCoupon'>套用</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['cartData'],
  data () {
    return {
      couponCode: ''
    }
  },
  methods: {
    removeCartItem (id) {
      const api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/cart/${id}`
      const vm = this
      vm.isLoading = true
      this.$http.delete(api).then(response => {
        console.log(response)
        vm.reloadCart()
        vm.isLoading = false
      })
    },
    useCoupon () {
      const api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/coupon`
      const vm = this
      vm.isLoading = true
      this.$http.post(api, { data: { code: vm.couponCode } }).then(response => {
        console.log(response)
        vm.reloadCart()
        vm.isLoading = false
      })
    },
    reloadCart () {
      this.$emit('getCart')
    }
  }
}
</script>

<style scope>
  .container {
    margin: 0 auto;
    max-width: 600px;
  }
</style>
