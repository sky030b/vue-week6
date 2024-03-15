<template>
    <div class="container-fluid bg-opacity-25 fixed-top" style="background-color: rgba(192, 192, 192, 0.750);
">
        <header class="container d-flex justify-content-between">
            <nav class="d-flex gap-5">
                <RouterLink to="/">Home</RouterLink>
                <RouterLink to="/about">About</RouterLink>
                <RouterLink to="/products">Products</RouterLink>
            </nav>
            <nav class="d-flex">
                <RouterLink to="/carts">Carts</RouterLink>
            </nav>
        </header>
    </div>
</template>

<style scoped>
nav a {
    color: rgb(42, 167, 167);
    text-decoration: none;
    line-height: 3;
}

nav a.active {
    text-decoration: underline;
}
</style>