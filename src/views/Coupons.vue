<template>
  <div>
    <loading :active.sync="isLoading"></loading>
    <div class="text-right">
      <button class="btn btn-primary mt-4" @click="openModal(true)">建立新優惠卷</button>
    </div>
    <table class="table mt-4">
      <thead>
        <tr>
          <th>到期日</th>
          <th>優惠卷名稱</th>
          <th>是否啟用</th>
          <th>折扣百分比</th>
          <th>編輯</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item) in coupons" :key="item.id">
          <td>{{ item.due_date }}</td>
          <td>{{ item.title }}</td>
          <td><span class='btn btn-sm' :class="[item.is_enabled?'btn-success':'btn-danger']">{{ item.is_enabled ? '是' : '否' }}</span></td>
          <td class="text-right" width="120">{{ item.percent }}</td>
          <td width="120">
            <button class="btn btn-outline-primary btn-sm" @click='openModal(false, item)'>編輯</button>
            <button class="btn btn-outline-danger btn-sm" @click='deleteCoupon(item)'>刪除</button>
          </td>
        </tr>
      </tbody>
    </table>
    <Pagination :pagination='pagination' @triggerGetObjects='getCoupons'/>
    <div
      class="modal fade"
      id="couponModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content border-0">
          <div class="modal-header bg-dark text-white">
            <h5 class="modal-title" id="exampleModalLabel">
              <span>新增優惠卷</span>
            </h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-sm-12">
                <div class="form-group">
                  <label for="title">名稱</label>
                  <input type="text" class="form-control" id="title" placeholder="請輸入名稱" v-model='tempCoupon.title' />
                </div>

                <div class="form-row">
                  <div class="form-group col-md-12">
                    <label for="percent">折扣百分比</label>
                    <input type="percent" class="form-control" id="percent" placeholder="請輸入折扣百分比" v-model='tempCoupon.percent' />
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group col-md-6">
                    <label for="code">折扣碼</label>
                    <input type="text" class="form-control" id="code" placeholder="請輸入折扣碼" v-model='tempCoupon.code' />
                  </div>
                  <div class="form-group col-md-6">
                    <label for="due_date">使用期限</label>
                    <input type="datetime-local" class="form-control" id="due_date" placeholder="請輸入使用期限" v-model='tempCoupon.due_date' />
                  </div>
                </div>
                <hr />
                <div class="form-group">
                  <div class="form-check">
                    <input class="form-check-input" type="checkbox" id="is_enabled" v-model='tempCoupon.is_enabled' :true-value="1" :false-value="0"/>
                    <label class="form-check-label" for="is_enabled">是否啟用</label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">取消</button>
            <button type="button" class="btn btn-primary" @click='updateCoupon'>確認</button>
          </div>
        </div>
      </div>
    </div>
    <div
      class="modal fade"
      id="delcouponModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content border-0">
          <div class="modal-header bg-danger text-white">
            <h5 class="modal-title" id="exampleModalLabel">
              <span>刪除折扣碼</span>
            </h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            是否刪除
            <strong class="text-danger">{{ tempCoupon.title }}</strong> 折扣碼(刪除後將無法恢復)。
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">取消</button>
            <button type="button" class="btn btn-danger">確認刪除</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'
import Pagination from '../components/Pagination.vue'

export default {
  data () {
    return {
      coupons: [],
      pagination: {},
      tempCoupon: {},
      isNew: false,
      isLoading: false
    }
  },
  methods: {
    getCoupons (page = 1) {
      const api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/admin/coupons?page=${page}`
      const vm = this
      vm.isLoading = true
      this.$http.get(api).then(response => {
        vm.coupons = response.data.coupons
        vm.pagination = response.data.pagination
        vm.isLoading = false
      })
    },
    openModal (isNew, item) {
      $('#couponModal').modal('show')
      if (isNew) {
        this.tempCoupon = {}
        this.isNew = true
      } else {
        this.tempCoupon = Object.assign({}, item)
        // 避免使用同一個參考, 把變數寫到空的物件裡使用
        this.isNew = false
      }
    },
    updateCoupon () {
      let api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/admin/coupon`
      const vm = this
      let httpMethod = 'post'
      if (!vm.isNew) {
        api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/admin/coupon/${vm.tempCoupon.id}`
        httpMethod = 'put'
      }
      vm.isLoading = true
      this.$http[httpMethod](api, { data: vm.tempCoupon }).then(response => {
        console.log(response.data)
        if (response.data.success) {
          $('#couponModal').modal('hide')
          vm.getCoupons()
        } else {
          vm.$bus.$emit('message:push', response.data.message, 'danger')
        }
        vm.isLoading = false
      })
    },
    deleteCoupon (item) {
      const api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/admin/coupon/${item.id}`
      const vm = this
      this.$http.delete(api).then(response => {
        console.log(response.data)
        if (response.data.success) {
          console.log(response.data)
          vm.getCoupons()
        } else {
          vm.$bus.$emit('message:push', response.data.message, 'danger')
        }
      })
    }
  },
  created () {
    this.getCoupons()
  },
  components: {
    Pagination
  }
}
</script>
