<template>
  <div>
    <nav id="sidebarMenu" class="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse">
      <div class="sidebar-sticky pt-3">
        <h6
          class="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted"
        >
          <span>Admin</span>
        </h6>
        <ul class="nav flex-column">
          <li class="nav-item">
            <router-link to='/admin/products' class="nav-link" href="#">
              <i class="fas fa-list"></i>
              Products
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to='/admin/orders' class="nav-link" href="#">
              <i class='fas fa-box'></i>
              Orders
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to='/admin/coupons' class="nav-link" href="#">
              <i class='fas fa-ticket-alt'></i>
              Coupons
            </router-link>
          </li>
        </ul>

        <h6
          class="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted"
        >
          <span>simulation feature</span>
        </h6>
        <ul class="nav flex-column mb-2">
          <li class="nav-item">
            <router-link class="nav-link" to="/customer_order">
              <i class='fas fa-file-alt'></i>
              simulate order
            </router-link>
          </li>
        </ul>
      </div>
    </nav>
  </div>
</template>
