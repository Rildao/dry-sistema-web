<script>
import { LoginService } from '@/service';
import useVuelidate from '@vuelidate/core';
import { required } from '@vuelidate/validators';

export default {
    data() {
        return {
            email: '',
            senha: ''
        };
    },
    setup() {
        return { v$: useVuelidate() };
    },
    validations() {
        return {
            email: { required },
            senha: { required }
        };
    },
    methods: {
        send() {
            this.v$.$touch();
            if (this.v$.$invalid) return;
            this.$store.dispatch('addRequest');
            this.login();
        },
        login() {
            const credenciais = {
                email: this.email,
                senha: this.senha
            };
            LoginService.login(credenciais)
                .then((res) => {
                    if (res.data.accessToken != null) {
                        localStorage.setItem('token', res.data.accessToken);
                        this.$router.push('/');
                    }
                    this.$store.dispatch('removeRequest');
                })
                .catch((erro) => {
                    this.$toast.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: `${erro.response.data.descricao}`,
                        life: 3000
                    });
                    this.$store.dispatch('removeRequest');
                });
        }
    }
};
</script>

<template>
    <div class="h-screen flex w-full surface-ground">
        <div class="flex flex-1 flex-column surface-ground align-items-center justify-content-center">
            <div class="w-11 sm:w-30rem">
                <div class="flex flex-column">
                    <div style="height: 56px; width: 56px" class="bg-primary-50 border-circle flex align-items-center justify-content-center"><i class="pi pi-sign-in text-primary text-4xl"></i></div>
                    <div class="mt-4">
                        <h1 class="m-0 text-secondary font-semibold text-4xl">Bem vindo de volta!</h1>
                        <span class="block text-600 font-medium mt-2">Por favor insira seus dados</span>
                    </div>
                </div>
                <form @submit.prevent="send" class="flex flex-column gap-3 mt-5">
                    <Message severity="error" v-if="(senha !== null && v$.senha.$error) || (email !== null && v$.email.$error)"> E-mail e Senha são obrigatórios </Message>
                    <span class="p-input-icon-left w-full mb-4">
                        <i class="pi pi-envelope"></i>
                        <input :class="'p-inputtext p-component w-full md:w-31rem' + (email !== null && v$.email.$error ? ' p-invalid' : '')" @input="v$.email.$touch()" v-model="email" id="email1" type="text" placeholder="Email" />
                    </span>
                    <span class="p-input-icon-left p-input-icon-riht w-full mb-4">
                        <i class="pi pi-lock"></i>
                        <input :class="'p-inputtext p-component w-full md:w-31rem' + (senha !== null && v$.senha.$error ? ' p-invalid' : '')" @input="v$.senha.$touch()" v-model="senha" id="password1" type="password" placeholder="Senha" />
                    </span>
                    <div>
                        <button type="submit" class="p-button p-component w-full" aria-label="Log In">
                            <span class="p-button-label" data-pc-section="label">Entrar</span><span role="presentation" aria-hidden="true" data-p-ink="true" data-p-ink-active="false" class="p-ink" data-pc-name="ripple" data-pc-section="root"></span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
        <div class="hidden lg:flex flex-1 align-items-center justify-content-center bg-cover" style="background-image: url('/demo/images/banner.png')"><img src="/demo/images/login/login.png" alt="" style="width: 20rem" /></div>
    </div>
</template>
