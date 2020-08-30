<template>
  <div>
    <loading :active.sync="isLoading"></loading>
    <table class="table mt-4">
      <thead>
        <tr>
          <th>購買時間</th>
          <th>email</th>
          <th>購買品項</th>
          <th>應付金額</th>
          <th>是否付款</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item) in orders" :key="item.id">
          <td>{{ item.create_at }}</td>
          <td>{{ item.user.email }}</td>
          <td class="text-left" width="200">
            <div v-for="(product) in item.products" :key="product.id">
              <span>{{ product.product.title }}</span>
              <span>{{ product.qty }} {{ product.product.unit }} </span>
              <span>{{ product.product.price | currency }}</span>
            </div>
          </td>
          <td class="text-right">{{ item.total | currency }}</td>
          <td><span class='btn btn-sm' :class="[item.is_paid ? 'btn-success':'btn-danger']">{{ item.is_paid ? '是' : '否' }}</span></td>
        </tr>
      </tbody>
    </table>
    <Pagination :pagination='pagination' @triggerGetObjects='getOrders'/>
  </div>
</template>

<script>
// import $ from 'jquery'
import Pagination from '../components/Pagination'

export default {
  data () {
    return {
      orders: [],
      pagination: {},
      isLoading: false
    }
  },
  methods: {
    getOrders (page = 1) {
      const api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/admin/orders?page=${page}`
      const vm = this
      vm.isLoading = true
      this.$http.get(api).then(response => {
        console.log(response)
        vm.orders = response.data.orders
        vm.pagination = response.data.pagination
        vm.isLoading = false
      })
    }
  },
  created () {
    this.getOrders()
  },
  components: {
    Pagination
  }
}
</script>
