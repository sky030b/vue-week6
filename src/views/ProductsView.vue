<template>
    <loadingVue :active="isLoading" />

    <div class="container">
        <table class="table align-middle">
            <thead>
                <tr>
                    <th style="text-align: center;">圖片</th>
                    <th style="text-align: center;">商品名稱</th>
                    <th style="text-align: center;">價格</th>
                    <th style="text-align: center;">操作</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="product in pageProducts" :key="product.name">
                    <td style="width: 25%; text-align: center;">
                        <div style="height: 100px; background-size: contain; background-position: center; background-repeat: no-repeat;"
                             :style="{ backgroundImage: `url(${product.imageUrl})` }">
                            <!-- <img :src="product.imageUrl" :alt="product.name" class="object-fit-fill"> -->
                        </div>
                    </td>
                    <td style="width: 25%;text-align: center;">
                        {{ product.title }}
                    </td>
                    <td style="width: 25%;text-align: center;">
                        <div class="h5" v-if="!product.origin_price || product.origin_price === product.price">
                            {{ product.price }} 元</div>
                        <del class="h6" v-if="product.origin_price !== product.price">原價 {{
        product.origin_price }} 元</del>
                        <div class="h5" v-if="product.origin_price !== product.price">現在只要 {{
        product.price }} 元</div>
                    </td>
                    <td style="width: 25%; text-align: center;">
                        <div class="btn-group btn-group-sm">
                            <button type="button" class="btn btn-outline-secondary" @click="seeMore(product.id)">
                                <i class="fas fa-spinner fa-pulse" v-if="loadingStatus.id === product.id"></i>
                                查看更多
                            </button>
                            <button type="button" class="btn btn-outline-danger" @click="addToCart(product.id)"
                                    :disabled="loadingStatus.id === product.id || !product.is_enabled">
                                <i class="fas fa-spinner fa-pulse" v-if="loadingStatus.id === product.id"></i>
                                加到購物車
                            </button>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
        <ProductsPagination :pagination="pagination" :get-page-products="getPageProducts"></ProductsPagination>
    </div>
</template>

<script>
import ProductsPagination from '@/components/ProductsPagination.vue';
import { toast } from 'vue3-toastify'
const successDelay = 1500;
const errorOrWarnDelay = 2000;

export default {
    components: { ProductsPagination },
    data() {
        return {
            api: {
                url: "https://ec-course-api.hexschool.io/v2",
                path: "sky030b"
            },
            allProducts: {},
            pageProducts: {},
            pagination: {},
            productTemp: {},
            loadingStatus: {
                id: "",
                deleteId: ""
            },
            isLoading: false,
        }
    },
    methods: {
        seeMore(id) {
            this.$router.push(`/product/${id}`);
        },
        // api functions
        async getAllProducts() {
            this.isLoading = true;
            try {
                const res = await this.axios.get(`${this.api.url}/api/${this.api.path}/products/all`)
                this.allProducts = res.data.products;
            } catch (error) {
                toast.error(error.response.data.message, {
                    autoClose: errorOrWarnDelay,
                });
            }
            this.isLoading = false;
        },
        async getPageProducts(page = 1) {
            this.isLoading = true;
            try {
                const res = await this.axios.get(`${this.api.url}/api/${this.api.path}/products?page=${page}`);
                this.pageProducts = res.data.products;
                this.pagination = res.data.pagination;
            } catch (error) {
                toast.error(error.response.data.message, {
                    autoClose: errorOrWarnDelay,
                });
            }
            this.isLoading = false;
        },
        async getProduct(id) {
            this.isLoading = true;
            this.loadingStatus.id = id;
            try {
                const res = await this.axios.get(`${this.api.url}/api/${this.api.path}/product/${id}`);
                this.productTemp = res.data.product;
                this.$refs.userProductModal.openModal();
            } catch (error) {
                toast.error(error.response.data.message, {
                    autoClose: errorOrWarnDelay,
                });
            }
            this.loadingStatus.id = '';
            this.isLoading = false;

        },
        async addToCart(id, qty = 1) {
            this.isLoading = true;
            this.loadingStatus.id = id;

            const cart = {
                product_id: id,
                qty,
            };

            try {
                const res = await this.axios.post(`${this.api.url}/api/${this.api.path}/cart`, { data: cart });
                toast.success(res.data.message, {
                    autoClose: successDelay,
                });
            } catch (error) {
                toast.error(error.response.data.message, {
                    autoClose: errorOrWarnDelay,
                });
            }

            this.loadingStatus.id = '';
            this.isLoading = false;
        },
        init() {
            // this.getAllProducts();
            this.getPageProducts();
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
        this.init();
    }
}
</script>