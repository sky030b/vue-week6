<template>
    <div id="productModal" ref="productModal" class="modal fade" tabindex="-1" data-bs-backdrop="static"
         aria-labelledby="productModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-scrollable modal-xl">
            <div class="modal-content border-0">
                <div class="modal-header bg-dark text-white">
                    <h5 id="productModalLabel" class="modal-title">
                        <span>{{ product.id ? "編輯產品" : "新增產品" }}</span>
                    </h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"
                            aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="col-sm-4">
                            <div class="main-pic">
                                <div class="mb-2">
                                    <div class="mb-3">
                                        <label for="imageUrl" class="form-label">輸入主要大圖網址</label>
                                        <form id="upload-image-form-big" class="mb-2" action="/api/sky030b/admin/upload"
                                              enctype="multipart/form-data" method="post">
                                            <div class="d-flex">
                                                <input type="file" id="file-input-big" name="file-to-upload">
                                                <input type="submit" value="送出" @click.prevent="uploadBigImage">
                                            </div>
                                        </form>
                                        <input type="text" class="form-control" placeholder="請輸入圖片連結"
                                               v-model.trim="product.imageTempUrl" @keyup.enter="changeBigImage">
                                    </div>
                                    <img v-if="product.imageUrl" class="img-fluid d-flex justify-content-center mx-auto"
                                         style="max-width: 200px; max-height: 150px;" :src="product.imageUrl" alt="縮圖">
                                </div>
                                <div class="btns d-flex">
                                    <div :class="{ 'col-6': product.imageUrl, 'col-12': !product.imageUrl }">
                                        <button class="btn btn-outline-primary btn-sm d-block w-100"
                                                @click="changeBigImage">
                                            {{ product.imageUrl ? "修改圖片" : "新增圖片" }}
                                        </button>
                                    </div>
                                    <div v-if="product.imageUrl" class="col-6">
                                        <button class="btn btn-outline-danger btn-sm d-block w-100"
                                                @click="removeBigImage">
                                            刪除圖片
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <hr>
                            <div class="other-pic">
                                <div class="mb-2">
                                    <div class="mb-3 gap-3">
                                        <label for="imageUrl" class="form-label">輸入小圖網址（點擊圖片即可刪除該張圖片）</label>
                                        <form id="upload-image-form-small" class="mb-2"
                                              action="/api/sky030b/admin/upload" enctype="multipart/form-data"
                                              method="post">
                                            <div class="d-flex">
                                                <input type="file" id="file-input-small" name="file-to-upload">
                                                <input type="submit" value="送出" @click.prevent="uploadSmallImage">
                                            </div>
                                        </form>
                                        <input type="text" class="form-control" placeholder="請輸入圖片連結"
                                               v-model.trim="product.smallImageTempUrl" @keyup.enter="addSmallImage">
                                    </div>
                                    <img v-for="imgUrl, index in product.imagesUrl" :key="imgUrl" class="img-fluid"
                                         :src="imgUrl" alt="縮圖"
                                         style="max-width: 100px; max-height: 150px; cursor: pointer;"
                                         @click="removeOneSmallImage(index)">
                                </div>
                                <div class="btns d-flex justify-content-center">
                                    <div :class="{ 'col-6': product.imagesUrl, 'col-12': !product.imagesUrl?.length }">
                                        <button class="btn btn-outline-primary btn-sm d-block w-100"
                                                @click="addSmallImage">
                                            新增圖片
                                        </button>
                                    </div>
                                    <div v-if="product.imagesUrl?.length" class="col-6">
                                        <button class="btn btn-outline-danger btn-sm d-block w-100"
                                                @click="removeAllSmallImage">
                                            清空圖片
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-8">
                            <div class="mb-3">
                                <label for="title" class="form-label">標題</label>
                                <input id="title" type="text" class="form-control" placeholder="請輸入標題"
                                       v-model.trim="product.title" autofocus>
                            </div>

                            <div class="row">
                                <div class="mb-3 col-md-6">
                                    <label for="category" class="form-label">分類</label>
                                    <input id="category" type="text" class="form-control" placeholder="請輸入分類"
                                           v-model.trim="product.category">
                                </div>
                                <div class="mb-3 col-md-6">
                                    <label for="price" class="form-label">單位</label>
                                    <input id="unit" type="text" class="form-control" placeholder="請輸入單位"
                                           v-model.trim="product.unit">
                                </div>
                            </div>

                            <div class="row">
                                <div class="mb-3 col-md-6">
                                    <label for="origin_price" class="form-label">原價</label>
                                    <input id="origin_price" type="number" min="0" class="form-control"
                                           placeholder="請輸入原價" v-model.number="product.origin_price">
                                </div>
                                <div class="mb-3 col-md-6">
                                    <label for="price" class="form-label">售價</label>
                                    <input id="price" type="number" min="0" class="form-control" placeholder="請輸入售價"
                                           v-model.number="product.price">
                                </div>
                            </div>
                            <hr>

                            <div class="mb-3">
                                <label for="description" class="form-label">產品描述</label>
                                <textarea id="description" type="text" class="form-control" placeholder="請輸入產品描述"
                                          v-model.trim="product.description">
        </textarea>
                            </div>
                            <div class="mb-3">
                                <label for="content" class="form-label">說明內容</label>
                                <textarea id="description" type="text" class="form-control" placeholder="請輸入說明內容"
                                          v-model.trim="product.content">
        </textarea>
                            </div>
                            <div class="mb-3">
                                <label for="point" class="form-label">評價</label>
                                <input id="point" type="number" min="0" max="5" class="form-control" placeholder="請輸入評價"
                                       v-model.number="product.point">
                            </div>
                            <div class="mb-3">
                                <div class="form-check">
                                    <input id="is_enabled" class="form-check-input" type="checkbox" :true-value="1"
                                           :false-value="0" v-model="product.is_enabled"
                                           :checked="product.is_enabled >= 1">
                                    <label class=" form-check-label" for="is_enabled">是否啟用</label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal"
                            @click="handleModalDismiss">
                        取消
                    </button>
                    <button type="button" class="btn btn-primary" @click="submitAddOrEditProduct">
                        確認
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { toast } from 'vue3-toastify'
const successDelay = 1500;
const errorOrWarnDelay = 2000;

export default {
    props: ["handleModalDismiss", "productTemp"],
    data() {
        return {
            api: {
                url: "https://ec-course-api.hexschool.io/v2",
                path: "sky030b"
            },
            product: { ...this.productTemp }
        }
    },
    watch: {
        productTemp() {
            this.product = { ...this.productTemp }
        }
    },
    methods: {
        // 新增或編輯 modal 中所使用的 function
        changeBigImage() {
            this.product.imageTempUrl ? this.product.imageUrl = this.product.imageTempUrl : null;
            this.product.imageTempUrl = "";
        },
        removeBigImage() {
            this.product.imageUrl = "";
        },
        addSmallImage() {
            if (this.product.smallImageTempUrl) {
                if (Object.prototype.hasOwnProperty.call(this.product, "imagesUrl")) {
                    this.product.imagesUrl.push(this.product.smallImageTempUrl);
                } else {
                    this.product.imagesUrl = [this.product.smallImageTempUrl];
                }
                this.product.smallImageTempUrl = "";
            }
        },
        removeOneSmallImage(index) {
            this.product.imagesUrl.splice(index, 1)
        },
        removeAllSmallImage() {
            this.product.imagesUrl = [];
        },

        // 上傳圖片api
        async uploadBigImage() {
            const form = document.querySelector('#upload-image-form-big');
            const imageInput = document.querySelector("#file-input-big");
            const formData = new FormData(form);
            if (imageInput.value) {
                try {
                    const res = await this.axios.post(`${this.api.url}/api/${this.api.path}/admin/upload`, formData);
                    this.product.imageUrl = res.data.imageUrl;
                    imageInput.value = '';
                } catch (error) {
                    toast.error(error.response.data.message, {
                        autoClose: errorOrWarnDelay,
                    });

                }
            } else {
                toast.error("請先選擇欲上傳之圖片。", {
                    autoClose: errorOrWarnDelay,
                });
            }
        },
        async uploadSmallImage() {
            const form = document.querySelector('#upload-image-form-small');
            const imageInput = document.querySelector("#file-input-small");
            const formData = new FormData(form);
            if (imageInput.value) {
                try {
                    const res = await this.axios.post(`${this.api.url}/api/${this.api.path}/admin/upload`, formData);
                    if (Object.prototype.hasOwnProperty.call(this.product, "imagesUrl")) {
                        this.product.imagesUrl.push(res.data.imageUrl);
                    } else {
                        this.product.imagesUrl = [res.data.imageUrl];
                    }
                    imageInput.value = '';
                } catch (error) {
                    toast.error(error.response.data.message, {
                        autoClose: errorOrWarnDelay,
                    });

                }
            } else {
                toast.error("請先選擇欲上傳之圖片。", {
                    autoClose: errorOrWarnDelay,
                });
            }
        },

        async addProduct() {
            const data = {
                data: this.product
            }
            try {
                await this.axios.post(`${this.api.url}/api/${this.api.path}/admin/product/`, data);
                toast.success("新增成功。", {
                    autoClose: successDelay,
                });
            } catch (error) {
                toast.error(error.response.data.message, {
                    autoClose: errorOrWarnDelay,
                });
            }
        },
        async editProduct() {
            const data = {
                data: this.product
            }
            try {
                await this.axios.put(`${this.api.url}/api/${this.api.path}/admin/product/${this.productTemp.id}`, data);
                toast.success("修改成功。", {
                    autoClose: successDelay,
                });
            } catch (error) {
                toast.error(error.response.data.message, {
                    autoClose: errorOrWarnDelay,
                });
            }
        },
        // 送出 新增 或 編輯 的產品資料
        async submitAddOrEditProduct() {
            if (Object.prototype.hasOwnProperty.call(this.productTemp, "id")) {
                await this.editProduct();
            } else {
                await this.addProduct();
            }
            this.updateData();
        },

        updateData() {
            this.$emit("update-data");
        },
    }
}
</script>