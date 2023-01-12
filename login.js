const app = {
  data() {
    return {
      user: {
        username: '',
        password: '',
      },
    }
  },
  methods: {
    login() {
      // 登入api
      const url = 'https://vue3-course-api.hexschool.io/v2/admin/signin';
      axios.post(url, this.user)
        .then(res => {
          const { token, expired } = res.data;
          // 將 token 及 expired 存入 cookie ，供其他頁面可以使用這個 token
          // expired 是 unix timestamp，需要使用 new Date 將 expired 做轉型
          // hexToken 名字可自取，但需跟 products.js mounted 的 document.cookie.replace 內的 token 取名相同
          document.cookie = `hexToken=${token}; expires=${new Date(expired)};`;
          // 轉址到 products.html
          window.location = 'products.html'
        })
        .catch(err => {
          alert(err.data.message);
        })
    }
  },
}

Vue.createApp(app).mount('#app');