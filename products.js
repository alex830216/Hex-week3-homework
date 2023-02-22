let productModal = "";
let delProductModal = "";

const app = {
  data() {
    return {
      url: "https://vue3-course-api.hexschool.io/v2/",
      path: "alex-test",
      products: [],
      tempProduct: {
        // 一開始沒有 imagesUrl 這個欄位，避免出錯需要加上
        imagesUrl: [],
      },
      isNew: false,
    };
  },
  methods: {
    checkUser() {
      axios
        .post(`${this.url}api/user/check`)
        .then(() => {
          // 登入後可以取得產品資料
          this.getData();
        })
        .catch((err) => {
          // 若沒登入成功會跳出錯誤訊息並轉址到登入頁面
          alert(err.data.message);
          window.location = "login.html";
        });
    },
    getData() {
      axios
        .get(`${this.url}api/${this.path}/admin/products`)
        .then((res) => {
          // 將資料回傳到本地的 products 陣列
          this.products = res.data.products;
        })
        .catch((err) => {
          alert(err.data.message);
        });
    },
    viewProduct(product) {
      // 將點擊到的產品存到暫存產品區
      this.tempProduct = product;
    },
    addOrUpdateProduct() {
      let url = `${this.url}api/${this.path}/admin/product`;
      let method = "post";
      if (!this.isNew) {
        url = `${this.url}api/${this.path}/admin/product/${this.tempProduct.id}`;
        method = "put";
      }
      // 新增產品
      if (!this.tempProduct.id) {
        axios[method](url, { data: this.tempProduct })
          .then((res) => {
            alert(res.data.message);
            this.getData();
            productModal.hide();
          })
          .catch((err) => {
            alert(err.data.message);
          });
        // 編輯產品
      } else {
        axios[method](url, { data: this.tempProduct })
          .then((res) => {
            alert(res.data.message);
            this.getData();
            productModal.hide();
          })
          .catch((err) => {
            alert(err.data.message);
          });
      }
    },
    // 刪除產品
    delProduct() {
      const url = `${this.url}api/${this.path}/admin/product/${this.tempProduct.id}`;
      axios
        .delete(url, { data: this.tempProduct })
        .then((res) => {
          alert(res.data.message);
          this.getData();
          delProductModal.hide();
        })
        .catch((err) => {
          alert(err.data.message);
        });
    },
    openModal(status, product) {
      if (status === "create") {
        productModal.show();
        this.isNew = true;
        this.tempProduct = {
          imagesUrl: [],
        };
      } else if (status === "edit") {
        productModal.show();
        this.isNew = false;
        this.tempProduct = { ...product };
      } else if (status === "delete") {
        delProductModal.show();
        this.tempProduct = { ...product };
      }
    },
  },
  // 一開始進入頁面就做
  mounted() {
    // 從 cookie 取回 token
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/,
      "$1"
    );
    // 往後發送 axios 時，預設將 token 放入 axios 的 headers，打 api 時就不用一直輸入 token
    axios.defaults.headers.common["Authorization"] = token;
    // 確認是否登入
    this.checkUser();
    // 建立 bootstrap JS Modal 實體:有兩種建立方式
    // https://getbootstrap.com/docs/5.2/components/modal/#via-javascript
    // const myModal = new bootstrap.Modal(document.getElementById('myModal'), options)
    // or
    // const myModalAlternative = new bootstrap.Modal("#myModal", options);
    productModal = new bootstrap.Modal("#productModal");
    delProductModal = new bootstrap.Modal("#delProductModal");
  },
};

Vue.createApp(app).mount("#app");
