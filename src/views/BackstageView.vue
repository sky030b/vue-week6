<template>
    <loadingVue :active="isLoading" />

    <div class="container">
        <div class="row">
            <div class="col-md-12">
                <div class="d-flex justify-content-between mt-4">
                    <h2>產品列表</h2>
                    <button class="btn btn-primary addBtn" @click="initProductTemp" autofocus>
                        建立新的產品
                    </button>
                </div>

                <table class="table table-hover mt-4">
                    <thead>
                        <tr>
                            <th width="160">產品名稱</th>
                            <th width="160">分類</th>
                            <th width="80">
                                原價
                            </th>
                            <th width="80">
                                售價
                            </th>
                            <th width="100">
                                是否啟用
                            </th>
                            <th width="120">
                                編輯
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="product in pageProducts" :key="product.title">
                            <td width="160">{{ product.title }}</td>
                            <td width="160">{{ product.category }}</td>
                            <td width="80">
                                {{ product.origin_price }}
                            </td>
                            <td width="80">
                                {{ product.price }}
                            </td>
                            <td width="100">
                                <span v-if="product.is_enabled" class="text-success">啟用</span>
                                <span v-else>未啟用</span>
                            </td>
                            <td>
                                <div class="btn-group">
                                    <button type="button" class="btn btn-outline-primary btn-sm"
                                            @click="editProductTemp(product)">
                                        編輯
                                    </button>
                                    <button type="button" class="btn btn-outline-danger btn-sm"
                                            @click="initDeleteTemp(product)">
                                        刪除
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <ProductsPagination :pagination="pagination" :get-page-products="getPageProducts"></ProductsPagination>
                <p>目前有 <span>{{ Object.keys(allProducts).length }}</span> 項產品</p>

            </div>
        </div>
        <!-- Modal -->
        <ProductModal :product-temp="productTemp" :handle-modal-dismiss="handleModalDismiss" @update-data="updateData">
        </ProductModal>
        <DeleteModal :delete-temp="deleteTemp" :handle-modal-dismiss="handleModalDismiss"
                     :delete-product="deleteProduct"></DeleteModal>
        <!-- Modal -->
    </div>
</template>

<script>
import DeleteModal from '@/components/DeleteModal.vue'
import ProductModal from '@/components/ProductModal.vue'
import ProductsPagination from '@/components/ProductsPagination.vue'
import modal from 'bootstrap/js/dist/modal'
import { mapActions } from 'pinia'
import memberStore from '@/stores/memberData'

let productModal = null;
let delProductModal = null;

export default {
    components: { DeleteModal, ProductModal, ProductsPagination },
    data() {
        return {
            api: {
                url: "https://ec-course-api.hexschool.io/v2",
                path: "sky030b"
            },
            allProducts: {},
            pageProducts: {},
            productTemp: {},
            ert: {},
            deleteTemp: {},
            pagination: {},
            isLoading: false,
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
    methods: {
        // api functions
        async checkLogin() {
            this.isLoading = true;

            try {
                this.getToken();
                await this.axios.post(`${this.api.url}/api/user/check`);
                await this.getAllProducts();
                await this.getPageProducts(this.pagination.current_page);
            } catch (err) {
                alert(`${err.response.data.message}。\n將返回登入頁。`);
                delete this.axios.defaults.headers.common["Authorization"];
                this.$router.push("/login");
            }

            this.isLoading = false;
        },
        async getAllProducts() {
            try {
                const res = await this.axios.get(`${this.api.url}/api/${this.api.path}/admin/products/all`);
                this.allProducts = res.data.products;
            } catch (error) {
                alert(`${error.response.data.message}\n將返回登入頁。`);
                delete this.axios.defaults.headers.common["Authorization"];
                this.$router.push("/login");
            }
        },
        async getPageProducts(page = 1) {
            try {
                const res = await this.axios.get(`${this.api.url}/api/${this.api.path}/admin/products?page=${page}`);
                this.pageProducts = res.data.products;
                this.pagination = res.data.pagination;
            } catch (error) {
                alert(`${error.response.data.message}\n將返回登入頁。`);
                delete this.axios.defaults.headers.common["Authorization"];
                this.$router.push("/login");
            }
        },
        async deleteProduct() {
            this.isLoading = true;

            try {
                await this.axios.delete(`${this.api.url}/api/${this.api.path}/admin/product/${this.deleteTemp.id}`); alert("刪除成功。");
                await this.getAllProducts();
                await this.getPageProducts(this.pagination.current_page);
                this.handleModalDismiss();
            } catch (error) {
                alert(error.response.data.message);
            }

            this.isLoading = false;
        },
        async updateData() {
            this.isLoading = true;

            try {
                this.handleModalDismiss();
                await this.getAllProducts();
                await this.getPageProducts(this.pagination.current_page);
            } catch (error) {
                alert(`${error}。\n將返回登入頁。`);
                delete this.axios.defaults.headers.common["Authorization"];
                this.$router.push("/login");
            }

            this.isLoading = false;
        },

        // 關閉 modal 後重置兩種 temp object
        handleModalDismiss() {
            // 若 指定 modal 存在，則將之關閉
            productModal ? productModal.hide() : null;
            delProductModal ? delProductModal.hide() : null;

            // 這裡在處理 modal 被隱藏時的邏輯
            this.productTemp = {};
            this.deleteTemp = {};
        },
        // 開啟新增或編輯 modal 前，都先重置 productTemp(two ways)
        initProductTemp() {
            this.productTemp = {};
            productModal.show();
        },
        editProductTemp(product) {
            this.productTemp = JSON.parse(JSON.stringify(product));
            productModal.show();
        },
        // 開啟刪除 modal 前，都先重置 deleteTemp
        initDeleteTemp(product) {
            this.deleteTemp = product;
            delProductModal.show();
            const delConfirmBtn = document.querySelector(".del-btn");
            setTimeout(() => {
                delConfirmBtn.focus();
            }, 500)
        },

        init() {
            this.checkLogin();
        },
        ...mapActions(memberStore, ['getToken'])
    },
    mounted() {
        this.init();

        productModal = new modal(document.querySelector("#productModal"));
        delProductModal = new modal(document.querySelector("#delProductModal"));
    }
}
</script>