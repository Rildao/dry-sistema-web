<script>
import useVuelidate from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import { ClienteService } from '@/app/cliente/service';

export default {
    data() {
        return {
            nome: '',
            telefone: '',
            endereco: '',
            cpf: ''
        };
    },
    setup() {
        return { v$: useVuelidate() };
    },
    validations() {
        return {
            nome: { required }
        };
    },
    methods: {
        cadastrar() {
            this.v$.$touch();
            if (this.v$.$invalid) return;
            this.$store.dispatch('addRequest');
            this.criarCliente();
        },
        criarCliente() {
            const cliente = {
                nome: this.nome,
                telefone: this.telefone,
                endereco: this.endereco,
                cpf: this.cpf
            };
            ClienteService.criarCliente(cliente)
                .then((res) => {
                    this.$store.dispatch('removeRequest');
                    this.$toast.add({
                        severity: 'success',
                        summary: 'Successo',
                        detail: `Criado com sucesso!`,
                        life: 3000
                    });
                })
                .catch((e) => {
                    console.log(e);
                    this.$toast.add({ severity: 'error', summary: 'Error', detail: `${e.errors.descricao}`, life: 3000 });
                })
                .finally(() => {
                    (this.cpf = null), (this.nome = null), (this.endereco = null), (this.telefone = null);
                });
        }
    }
};
</script>
<template>
    <Card>
        <template #content>
            <Fieldset>
                <template #legend>
                    <div class="flex align-items-center text-primary">
                        <span class="pi pi-user mr-2"></span>
                        <span class="font-bold text-lg">Cadastrar cliente</span>
                    </div>
                </template>
                <div class="formgrid grid">
                    <div class="field col-12 lg:col-9 md:col-9">
                        <label for="nome">Nome*</label>
                        <InputText id="nome" @input="v$.nome.$touch()" class="w-full" v-model="nome" type="text" />
                        <small class="p-error mb-3" v-if="v$.nome.$error">Nome é obrigatório</small>
                    </div>
                    <div class="field col-12 lg:col-3 md:col-3">
                        <label for="cpf">CPF</label>
                        <InputMask id="cpf" class="w-full" v-model="cpf" type="text" mask="999.999.999-99" placeholder="999.999.999-99" />
                    </div>
                    <div class="field col-12 lg:col-3 md:col-3">
                        <label for="telefone">Telefone</label>
                        <InputMask id="telefone" class="w-full" v-model="telefone" type="text" mask="(99) 99999-9999" placeholder="(99) 99999-9999" />
                    </div>
                    <div class="field col-12 lg:col-9 md:col-9">
                        <label for="endereco">Endereço</label>
                        <InputText id="endereco" class="w-full" v-model="endereco" type="text" />
                    </div>
                    <div class="field col-12 lg:col-offset-10 md:col-offset-8 mt-4">
                        <Button label="Primary" class="w-full lg:w-14rem md:w-14rem justify-content-center" @click.stop="cadastrar()">Cadastrar </Button>
                    </div>
                </div>
                <Toast />
            </Fieldset>
        </template>
    </Card>
</template>
