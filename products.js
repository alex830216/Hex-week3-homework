let productModal = '';
let delProductModal = '';

const app = {
  data() {
    return {
      url: 'https://vue3-course-api.hexschool.io/v2/',
      path: 'alex-test',
      products: [],
      tempProduct: {},
    }
  },
  methods: {
    checkUser() {
      axios.post(`${this.url}api/user/check`)
        .then(() => {
          // 登入後可以取得產品資料
          this.getData();
        })
        .catch(err => {
          // 若沒登入成功會跳出錯誤訊息並轉址到登入頁面
          alert(err.data.message);
          window.location = 'login.html';
        })
    },
    getData() {
      axios.get(`${this.url}api/${this.path}/admin/products`)
        .then(res => {
          // 將資料回傳到本地的 products 陣列
          this.products = res.data.products;
        })
        .catch(err => {
          alert(err.data.message);
        })
    },
    viewProduct(product) {
      // 將點擊到的產品存到暫存產品區
      this.tempProduct = product;
    },
    addOrUpdateProduct() {
      if (!this.tempProduct.id) {
        // 新增產品
        axios.post(`${this.url}api/${this.path}/admin/product`, { data: this.tempProduct} )
        .then((res) => {
          alert(res.data.message);
          this.getData();
          productModal.hide();
        })
        .catch(err => {
          alert(err.data.message);
        })
      } else {
        // 編輯產品
        axios.put(`${this.url}api/${this.path}/admin/product/${this.tempProduct.id}`, { data: this.tempProduct} )
        .then((res) => {
          alert(res.data.message);
          this.getData();
          productModal.hide();
        })
        .catch(err => {
          alert(err.data.message);
        })
      }
    },
    delProduct() {
      // 刪除產品
      axios.delete(`${this.url}api/${this.path}/admin/product/${this.tempProduct.id}`, { data: this.tempProduct} )
        .then((res) => {
          alert(res.data.message);
          this.getData();
          delProductModal.hide();
        })
        .catch(err => {
          alert(err.data.message);
        })
    },
    openModal(product) {
      if (!product.id) {
        productModal.show();
      } else {
        this.tempProduct = { ...product };
        productModal.show();
      }
    },
    openDelModal(product) {
      this.tempProduct = { ...product };
      delProductModal.show();
    },
  },
  // 一開始進入頁面就做
  mounted() {
    // 從 cookie 取回 token
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
    // 往後發送 axios 時，預設將 token 放入 axios 的 headers，打 api 時就不用一直輸入 token
    axios.defaults.headers.common['Authorization'] = token;
    // 確認是否登入
    this.checkUser();
    // 建立 bootstrap JS Modal 實體
    productModal = new bootstrap.Modal(document.querySelector('#productModal'));
    delProductModal = new bootstrap.Modal(document.querySelector('#delProductModal'));
  }
}

Vue.createApp(app).mount('#app');