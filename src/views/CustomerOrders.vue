<template>
  <div>
    <loading :active.sync="isLoading"></loading>
    <div class="row mt-4">
      <div class="col-md-4 mb-4" v-for="item in products" :key="item.id">
        <div class="card border-0 shadow-sm">
          <div
            style="height: 150px; background-size: cover; background-position: center"
            :style="{backgroundImage: `url(${item.image})`}"
          ></div>
          <div class="card-body">
            <span class="badge badge-secondary float-right ml-2">{{ item.category }}</span>
            <h5 class="card-title">
              <a href="#" class="text-dark">{{ item.title }}</a>
            </h5>
            <p class="card-text">{{ item.content }}</p>
            <div class="d-flex justify-content-between align-items-baseline">
              <div class="h5" v-if="!item.price">{{ item.origin_price }}</div>
              <del class="h6" v-if="item.price">{{ item.origin_price }}</del>
              <div class="h5" v-if="item.price">{{ item.price }}</div>
            </div>
          </div>
          <div class="card-footer d-flex">
            <button
              type="button"
              class="btn btn-outline-secondary btn-sm"
              @click.prevent="getProduct(item.id)"
            >
              <i class="fas fa-spinner fa-spin" v-if="status.loadingItem === item.id "></i>
              查看更多
            </button>
            <button
              type="button"
              class="btn btn-outline-danger btn-sm ml-auto"
              @click="addToCart(item.id)"
            >
              <i class="fas fa-spinner fa-spin" v-if="status.loadingItem === item.id"></i>
              加到購物車
            </button>
          </div>
        </div>
      </div>
    </div>

    <div
      class="modal fade"
      id="productModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content border-0">
          <div class="modal-header bg-dark text-white">
            <h5 class="modal-title" id="exampleModalLabel">{{ product.title }}</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <img :src="product.image" class="img-fluid" alt />
            <blockquote class="blockquote mt-3">
              <p class="mb-0">{{ product.content }}</p>
              <footer class="blockquote-footer text-right">{{ product.description }}</footer>
            </blockquote>
            <div class="d-flex justify-content-between align-items-baseline">
              <div class="h5" v-if="!product.price">{{ product.origin_price }}</div>
              <del class="h6" v-if="product.price">原價 {{ product.origin_price }}</del>
              <div class="h5" v-if="product.price">現在只要 {{ product.price }}</div>
            </div>
            <select name class="form-control mt-3" v-model="product.num">
              <option :value="num" v-for="num in 10" :key="num">選購 {{num}} {{product.unit}}</option>
            </select>
          </div>
          <div class="modal-footer">
            <div class="text-muted text-nowrap mr-3">
              小計
              <strong>{{ product.num * product.price }}</strong>元
            </div>
            <button
              type="button"
              class="btn btn-primary"
              @click="addToCart(product.id, product.num)"
            >
              <i class="fas fa-spinner fa-spin" v-if="product.id === status.loadingItem"></i>
              加到購物車
            </button>
          </div>
        </div>
      </div>
    </div>
    <Cart :cart-data="cartData" @getCart="getCart"></Cart>

    <div class="my-5 row justify-content-center">
      <ValidationObserver v-slot="{ handleSubmit }" slim>
        <form class="col-md-6">
          <div class="form-group">
            <label for="useremail">Email</label>
            <ValidationProvider rules="required|email" v-slot="{ errors }">
              <input
                type="email"
                class="form-control"
                name="email"
                id="useremail"
                v-model="form.user.email"
                placeholder="請輸入 Email"
                :class="{'is-invalid': errors[0] !== undefined}"
              />
              <span class="text-danger">{{ errors[0] }}</span>
            </ValidationProvider>
          </div>

          <div class="form-group">
            <label for="username">收件人姓名</label>
            <ValidationProvider rules="required" v-slot="{ errors }">
              <input
                type="text"
                class="form-control"
                name="name"
                id="username"
                v-model="form.user.name"
                placeholder="輸入姓名"
                :class="{'is-invalid': errors[0] !== undefined}"
              />
              <span class="text-danger">{{ errors[0] }}</span>
            </ValidationProvider>
          </div>

          <div class="form-group">
            <label for="usertel">收件人電話</label>
            <input
              type="tel"
              class="form-control"
              id="usertel"
              v-model="form.user.tel"
              placeholder="請輸入電話"
            />
          </div>

          <div class="form-group">
            <label for="useraddress">收件人地址</label>
            <ValidationProvider rules="required" v-slot="{ errors }">
              <input
                type="text"
                class="form-control"
                name="address"
                id="useraddress"
                v-model="form.user.address"
                placeholder="請輸入地址"
                :class="{'is-invalid': errors[0] !== undefined}"
              />
              <span class="text-danger">{{ errors[0] }}</span>
            </ValidationProvider>
          </div>

          <div class="form-group">
            <label for="comment">留言</label>
            <textarea
              name
              id="comment"
              class="form-control"
              cols="30"
              rows="10"
              v-model="form.message"
            ></textarea>
          </div>
          <div class="text-right">
            <button class="btn btn-danger" @click.prevent="handleSubmit(createOrder)">送出訂單</button>
          </div>
        </form>
      </ValidationObserver>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'
import Cart from '../components/Cart.vue'

export default {
  data () {
    return {
      products: [],
      product: {},
      cartData: {},
      form: {
        user: {
          name: '',
          email: '',
          tel: '',
          address: ''
        },
        message: ''
      },
      status: {
        loadingItem: ''
      },
      isLoading: false,
      value: ''
    }
  },
  methods: {
    getProducts (page = 1) {
      const api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/products?page=${page}`
      const vm = this
      vm.isLoading = true
      this.$http.get(api).then(response => {
        vm.products = response.data.products
        vm.pagination = response.data.pagination
        vm.isLoading = false
      })
    },
    getProduct (id) {
      const api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/product/${id}`
      const vm = this
      vm.status.loadingItem = id
      this.$http.get(api).then(response => {
        console.log(response)
        vm.product = response.data.product
        $('#productModal').modal('show')
        vm.status.loadingItem = ''
      })
    },
    getCart () {
      const api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/cart`
      const vm = this
      vm.isLoading = true
      this.$http.get(api).then(response => {
        console.log(response)
        vm.cartData = response.data.data
        vm.isLoading = false
      })
    },
    addToCart (id, qty = 1) {
      const api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/cart`
      const vm = this
      const cart = {
        product_id: id,
        qty
      }
      vm.status.loadingItem = id
      this.$http.post(api, { data: cart }).then(response => {
        console.log(response)
        $('#productModal').modal('hide')
        vm.status.loadingItem = ''
      })
      vm.getCart()
    },
    createOrder () {
      const api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/order`
      const vm = this
      vm.isLoading = true
      this.$http.post(api, { data: vm.form }).then(response => {
        if (response.data.success) {
          vm.$router.push(`/customer_checkout/${response.data.orderId}`)
        }
        console.log(response)
        vm.isLoading = false
      })
      vm.getCart()
    }
  },
  created () {
    this.getProducts()
    this.getCart()
  },
  components: {
    Cart
  }
}
</script>
