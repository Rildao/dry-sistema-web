<template>
    <Toast position="top-right" style="top: 30px" />
    <ConfirmDialog />
    <loading v-if="$store.getters.isLoading" />
    <router-view />
</template>
