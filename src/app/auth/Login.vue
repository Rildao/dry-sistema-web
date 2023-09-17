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
    <div class="body">
        <div class="container" id="container">
            <div class="form-container sign-in-container">
                <div class="form">
                    <h1 class="h1 mb-2">Bem-vindo(a) ao Dry Land's Sistema</h1>

                    <input class="input" v-model="email" @input="v$.email.$touch()" type="email" placeholder="E-mail" />
                    <small class="p-error mb-3" v-if="v$.email.$error">E-mail é obrigatório</small>

                    <input class="input" v-model="senha" @input="v$.senha.$touch()" type="password" placeholder="Senha" />
                    <small class="p-error mb-3" v-if="v$.senha.$error">Senha é obrigatória</small>

                    <button class="button mt-3" type="submit" @click="send()">Entrar</button>
                </div>
            </div>

            <div class="overlay-container">
                <div class="overlay">
                    <!-- ⚠️ adicionar imagem -->
                    <div class="overlay-panel overlay-right">
                        <img src="/demo/images/login/login.png" alt="login" class="img-login" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style>
.body {
    background: #f6f5f7;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    font-family: 'Montserrat', sans-serif;
    height: 100vh;
    margin: -20px 0 50px;
}

.h1 {
    font-weight: bold;
    margin: 0;
}

.button {
    border-radius: 20px;
    border: 1px solid #ff4b2b;
    background-color: #ff4b2b;
    color: #ffffff;
    font-size: 12px;
    font-weight: bold;
    padding: 12px 45px;
    letter-spacing: 1px;
    text-transform: uppercase;
    transition: transform 80ms ease-in;
    cursor: pointer;
}

.img-login {
    width: 85%;
    border-radius: 130px;
}

.button:active {
    transform: scale(0.95);
}

.button:focus {
    outline: none;
}

.form {
    background-color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    padding: 0 50px;
    height: 100%;
    text-align: center;
}

.input {
    background-color: #eee;
    border: none;
    border-radius: 8px;
    padding: 12px 15px;
    margin: 8px 0;
    width: 100%;
    box-shadow: 0 0 0 0;
    outline: 0;
}

.container {
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
    position: relative;
    overflow: hidden;
    width: 768px;
    max-width: 100%;
    min-height: 480px;
}

.form-container {
    position: absolute;
    top: 0;
    height: 100%;
    transition: all 0.6s ease-in-out;
}

.sign-in-container {
    left: 50%;
    width: 50%;
    z-index: 2;
}

.container.right-panel-active .sign-in-container {
    transform: translateX(100%);
}

@keyframes show {
    0%,
    49.99% {
        opacity: 0;
        z-index: 1;
    }

    50%,
    100% {
        opacity: 1;
        z-index: 5;
    }
}

.overlay-container {
    position: absolute;
    top: 0;
    width: 50%;
    height: 100%;
    overflow: hidden;
    transition: transform 0.6s ease-in-out;
    z-index: 100;
}

.container.right-panel-active .overlay-container {
    transform: translateX(-100%);
}

.overlay {
    background-repeat: no-repeat;
    background-size: cover;
    background-position: 0 0;
    color: #ffffff;
    position: relative;
    left: -100%;
    height: 100%;
    width: 200%;
    transform: translateX(0);
    transition: transform 0.6s ease-in-out;
}

.container.right-panel-active .overlay {
    transform: translateX(50%);
}

.overlay-panel {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    padding: 0 40px;
    text-align: center;
    top: 0;
    height: 100%;
    width: 50%;
    transform: translateX(0);
    transition: transform 0.6s ease-in-out;
}

.overlay-right {
    right: 0;
    transform: translateX(0);
}

.container.right-panel-active .overlay-right {
    transform: translateX(20%);
}

@media screen and (max-width: 426px) {
    .body {
        background: #ffffff;
    }
    .container {
        box-shadow: none;
    }
    .img-login {
        display: none;
    }
    .sign-in-container {
        left: 0;
        width: 100%;
        z-index: 2;
    }
}
@media screen and (max-width: 1023px) {
    .container {
        box-shadow: none;
    }
    .body {
        background: #ffffff;
    }
    .img-login {
        display: none;
    }
    .sign-in-container {
        left: 0;
        width: 100%;
        z-index: 2;
    }
    .form {
        padding: 0 80px;
    }
}
</style>
