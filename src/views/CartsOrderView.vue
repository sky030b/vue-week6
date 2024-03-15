<template>
    <div class="container">
        <!-- 購物車列表 -->
        <div class="text-end" v-if="cart.carts.length">
            <button class="btn btn-outline-danger" type="button" data-bs-toggle="modal"
                    data-bs-target="#clearCarts">清空購物車</button>
        </div>
        <div class="text-end" v-else>
            <button class="btn btn-outline-secondary" type="button" disabled>購物車內暫無商品</button>
        </div>

        <!-- 確認清空購物車Modal -->
        <div class="modal fade" tabindex="-1" id="clearCarts" aria-labelledby="clearCartsLabel">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">請問是否確定要<span class="text-danger fw-bold">清空購物車</span>？</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <p>此操作將不可回復。</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消操作</button>
                        <button type="button" class="btn btn-danger" data-bs-dismiss="modal"
                                @click="deleteAllCarts">確認清除</button>
                    </div>
                </div>
            </div>
        </div>
        <!-- 確認清空購物車Modal -->

        <table class="table align-middle">
            <thead>
                <tr>
                    <th></th>
                    <th>品名</th>
                    <th style="width: 150px">數量/單位</th>
                    <th class="text-end">單價</th>
                    <th class="text-end">小計</th>
                </tr>
            </thead>
            <tbody>
                <template v-if="cart.carts">
                    <tr v-for="item in cart.carts" :key="item.product.title">
                        <td>
                            <button type="button" class="btn btn-outline-danger btn-sm"
                                    @click="removeCartItem(item.id)">
                                <i class="fas fa-spinner fa-pulse" v-if="loadingStatus.deleteId === item.id"></i>
                                x
                            </button>
                        </td>
                        <td>
                            {{ item.product.title }}
                            <div class="text-success" v-if="coupon">
                                已套用優惠券
                            </div>
                        </td>
                        <td>
                            <div class="input-group input-group-sm align-items-center">
                                <div class="input-group mb-3 align-items-center">
                                    <input min="1" type="number" class="form-control" v-model="item.qty"
                                           :disabled="loadingStatus.id === item.id" @blur="updateCart(item)">
                                    <span class="input-group-text" id="basic-addon2">{{ item.product.unit
                                        }}</span>
                                </div>
                            </div>
                        </td>
                        <td class="text-end">
                            <small class="text-success" v-if="coupon">折扣價：</small>
                            {{ item.product.price }}
                        </td>
                        <td class="text-end">
                            <small class="text-success" v-if="coupon">折扣價：</small>
                            {{ item.final_total }}
                        </td>
                    </tr>
                </template>
            </tbody>
            <tfoot>
                <tr>
                    <td colspan="4" class="text-end">總計</td>
                    <td class="text-end">{{ cart.total }}</td>
                </tr>
                <tr v-if="cart.final_total !== cart.total">
                    <td colspan="3" class="text-end text-success">折扣價</td>
                    <td class="text-end text-success">{{ cart.final_total }}</td>
                </tr>
            </tfoot>
        </table>
        <div class="mt-5 row justify-content-center">
            <v-form ref="form" class="col-md-6" v-slot="{ errors }" @submit="createOrder">

                <div class="mb-3">
                    <label for="name" class="form-label">收件人姓名</label>
                    <v-field id="name" name="姓名" type="text" class="form-control" v-model="form.user.name"
                             :class="{ 'is-invalid': errors['姓名'] }" placeholder="請輸入姓名" rules="required"></v-field>
                    <error-message name="姓名" class="invalid-feedback"></error-message>
                </div>

                <div class="mb-3">
                    <label for="email" class="form-label">Email</label>
                    <v-field id="email" name="email" type="email" class="form-control" v-model="form.user.email"
                             :class="{ 'is-invalid': errors['email'] }" placeholder="請輸入 Email"
                             rules="email|required"></v-field>
                    <error-message name="email" class="invalid-feedback"></error-message>
                </div>

                <div class="mb-3">
                    <label for="tel" class="form-label">收件人手機號碼</label>
                    <v-field id="tel" name="手機號碼" type="tel" class="form-control" v-model="form.user.tel"
                             :class="{ 'is-invalid': errors['手機號碼'] }" placeholder="請輸入手機號碼" :rules="isPhone"></v-field>
                    <error-message name="手機號碼" class="invalid-feedback"></error-message>
                </div>

                <div class="mb-3">
                    <label for="address" class="form-label">收件人地址</label>
                    <v-field id="address" name="地址" type="text" class="form-control" v-model="form.user.address"
                             :class="{ 'is-invalid': errors['地址'] }" placeholder="請輸入地址" rules="required"></v-field>
                    <error-message name="地址" class="invalid-feedback"></error-message>
                </div>

                <div class="mb-3">
                    <label for="message" class="form-label">留言</label>
                    <!-- <textarea id="message" class="form-control" cols="30" rows="10"
                                  v-model="form.message"></textarea> -->
                    <!-- 上面這種寫法不會隨著resetForm一起重置 -->
                    <!-- <v-field as="textarea" cols="30" rows="10" id="message" name="留言" type="text"
                                 class="form-control" v-model="form.message" :class="{ 'is-invalid': errors['留言'] }"
                                 placeholder="請輸入留言" rules="required"></v-field>
                        <error-message name="留言" class="invalid-feedback"></error-message> -->
                    <v-field as="textarea" cols="30" rows="10" id="message" name="留言" type="text" class="form-control"
                             v-model="form.message" placeholder="請輸入留言"></v-field>
                </div>

                <div class="text-end">
                    <button type="submit" class="btn btn-danger">送出訂單</button>
                </div>

            </v-form>
        </div>
    </div>
</template>

<script>
export default {
    props: [],
    data() {
        return {
            api: {
                url: "https://ec-course-api.hexschool.io/v2",
                path: "sky030b"
            },
            loadingStatus: {
                id: "",
                deleteId: ""
            },
            cart: {
                carts: []
            },
            coupon: false,
            form: {
                user: {
                    name: '',
                    email: '',
                    tel: '',
                    address: '',
                },
                message: '',
            },
            isLoading: false,
        }
    },
    methods: {
        // api functions
        getCart() {
            this.isLoading = true;
            this.axios.get(`${this.api.url}/api/${this.api.path}/cart`)
                .then((res) => {
                    this.cart = res.data.data;
                    setTimeout(() => {
                        this.isLoading = false;
                    }, 600)
                })
                .catch((err) => {
                    alert(err.response.data.message);
                });
        },
        updateCart(item) {
            this.loadingStatus.id = item.id;
            const data = {
                "product_id": item.product_id,
                "qty": item.qty
            }
            this.axios.put(`${this.api.url}/api/${this.api.path}/cart/${item.id}`, { data })
                .then((res) => {
                    alert(res.data.message);
                    this.loadingStatus.id = '';
                    this.getCart();
                }).catch((err) => {
                    alert(err.response.data.message);
                    this.loadingStatus.id = '';
                });
        },
        removeCartItem(id) {
            this.loadingStatus.deleteId = id;
            this.axios.delete(`${this.api.url}/api/${this.api.path}/cart/${id}`)
                .then((res) => {
                    alert(res.data.message);
                    this.loadingStatus.deleteId = "";
                    this.getCart();
                })
                .catch((err) => {
                    alert(err.response.data.message)
                    this.loadingStatus.deleteId;
                })
        },
        deleteAllCarts() {
            this.axios.delete(`${this.api.url}/api/${this.api.path}/carts`)
                .then((res) => {
                    alert(res.data.message);
                    this.getCart();
                })
                .catch((err) => {
                    alert(err.response.data.message)
                })
        },
        createOrder() {
            if (this.cart.carts.length === 0) {
                alert("目前購物車為空，請先新增商品至購物車。")
                return
            }
            console.log(234234)
            const order = this.form;
            this.axios.post(`${this.api.url}/api/${this.api.path}/order`, { data: order })
                .then((res) => {
                    alert(res.data.message);
                    this.$refs.form.resetForm();
                    this.getCart();
                })
                .catch((err) => {
                    alert(err.response.data.message);
                });
        },

        isPhone(value) {
            const phoneNumber = /^(09)[0-9]{8}$/;
            return phoneNumber.test(value) ? true : '需要正確的手機號碼。例如：0948723030'
        }
    },
    watch: {
        isLoading(newVal) {
            if (newVal) {
                // 禁止滾動
                document.body.style.overflow = 'hidden';
            } else {
                // 恢復滾動許可
                document.body.style.overflow = '';
            }
        }
    },
    mounted() {
        this.getCart();
    }
}
</script>