<template>
    <loadingVue :active="isLoading" />

    <div class="container border border-2 rounded py-2">
        <div class="text-secondary">
            <h3 class="title">
                <span>{{ productTemp.title }}</span>
            </h3>
        </div>
        <div class="body">
            <div class="row align-items-center">
                <div class="col col-5 d-flex flex-column justify-content-center">
                    <img class="object-fit-cover" width="400" height="400" :src="productTemp.imageUrl"
                         :alt="productTemp.title + '的圖片'">
                    <div class="d-flex gap-3 w-100 flex-wrap">
                        <img v-for="(img, index) in productTemp.imagesUrl" :key="'img' + index" class="object-fit-cover"
                             width="100" height="100" :src="img" :alt="productTemp.title + '的其他小圖片'">
                    </div>
                </div>
                <div class="col col-7">
                    <span class="badge bg-primary rounded-pill mb-1">{{ productTemp.category }}</span>
                    <h5>商品描述：</h5>
                    <p>{{ productTemp.description }}</p>
                    <h5>商品內容：</h5>
                    <p class="content">{{ productTemp.content }}</p>
                    <div class="h5" v-if="!productTemp.origin_price || productTemp.origin_price === productTemp.price">
                        {{
        productTemp.price }} 元</div>
                    <del class="h6" v-if="productTemp.origin_price !== productTemp.price">原價 {{
        productTemp.origin_price }} 元</del>
                    <div class="h5" v-if="productTemp.origin_price !== productTemp.price">現在只要 {{
        productTemp.price }} 元</div>
                    <div class="mt-3">
                        <div class="input-group">
                            <input type="number" class="form-control" min="1" v-model="qty"
                                   @keyup.enter="addToCart(productTemp.id, qty)">
                            <button type="button" class="btn btn-primary" :disabled="!productTemp.is_enabled"
                                    @click="addToCart(productTemp.id, qty)">加入購物車</button>
                        </div>
                    </div>
                </div>
                <!-- col-sm-6 end -->
            </div>
        </div>
    </div>
</template>

<script>
import { toast } from 'vue3-toastify'
const successDelay = 1500;
const errorOrWarnDelay = 2000;

export default {
    data() {
        return {
            api: {
                url: "https://ec-course-api.hexschool.io/v2",
                path: "sky030b"
            },
            productTemp: {},
            qty: 1,
            loadingStatus: {
                id: "",
                deleteId: ""
            },
            isLoading: false,
        }
    },
    methods: {
        // api functions
        async getProduct() {
            this.isLoading = true;
            const id = this.$route.params.id;
            // if (this.$route.params.path)
            this.loadingStatus.id = id;
            try {
                const res = await this.axios.get(`${this.api.url}/api/${this.api.path}/product/${id}`);
                this.productTemp = res.data.product;
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
            this.getProduct();
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

<style scoped>
.content {
    white-space: pre-line;
}
</style>