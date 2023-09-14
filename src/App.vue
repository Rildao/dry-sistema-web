<template>
    <Toast position="top-right" style="top: 30px" :baseZIndex="1000" />
    <ConfirmDialog />
    <loading v-if="$store.getters.isLoading" />
    <router-view />
</template>
