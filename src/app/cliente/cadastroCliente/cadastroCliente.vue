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
            cpf: '',
            modal: false
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
        formatarCPF(cpf) {
            return cpf.replaceAll('.', '').replace(`-`, ``);
        },
        formatarTelefone(telefone) {
            return telefone.replace('(', '').replace(')', '').replace('-', '').replace(' ', '');
        },
        criarCliente() {
            const cliente = {
                nome: this.nome,
                telefone: this.formatarTelefone(this.telefone),
                endereco: this.endereco,
                cpf: this.formatarCPF(this.cpf)
            };
            console.log(cliente);
            ClienteService.criarCliente(cliente)
                .then((res) => {
                    console.log(res);
                    this.$store.dispatch('removeRequest');
                    if (res.success === true) {
                        this.$toast.add({
                            severity: 'success',
                            summary: 'Successo',
                            detail: `Criado com sucesso!`,
                            life: 3000
                        });
                    } else {
                        this.$toast.add({ severity: 'error', summary: 'Error', detail: `${res.errors.descricao}`, life: 3000 });
                    }
                })
                .finally(() => {
                    (this.cpf = null), (this.nome = null), (this.endereco = null), (this.telefone = null);
                });
        },
        abrirModal() {
            this.modal = true;
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
                        <span class="font-bold text-lg">Dados do Cliente</span>
                    </div>
                </template>
                <div class="formgrid grid">
                    <div class="field col-12 lg:col-9 md:col-9">
                        <label for="nome">Nome*</label>
                        <InputText id="nome" @input="v$.nome.$touch()" :class="{ 'p-invalid': nome !== null && v$.nome.$error }" class="w-full" v-model="nome" type="text" placeholder="Nome" />
                        <small class="p-error mb-3" v-if="nome !== null && v$.nome.$error">Nome é obrigatório</small>
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
                        <InputText id="endereco" class="w-full" v-model="endereco" placeholder="Endereco" type="text" />
                    </div>
                </div>
            </Fieldset>
            <br />
            <Fieldset>
                <template #legend>
                    <div class="flex align-items-center text-primary">
                        <span class="pi pi-shopping-cart mr-2"></span>
                        <span class="font-bold text-lg">Vendas</span>
                    </div>
                </template>
                <Tabela :data="[]">
                    <template #botoes>
                        <Button icon="pi pi-plus" label="Adiconar Venda" @click.stop="abrirModal()" severity="primary" outlined />
                    </template>
                </Tabela>
            </Fieldset>
            <Dialog v-model:visible="modal" modal :closable="false" :style="{ width: '50vw' }">
                <Fieldset>
                    <template #legend>
                        <div class="flex align-items-center text-primary">
                            <span class="pi pi-shopping-cart mr-2"></span>
                            <span class="font-bold text-lg">Dados da Venda</span>
                        </div>
                    </template>
                </Fieldset>
                <template #footer>
                    <Button label="Voltar" icon="pi pi-times" @click="modal = false" text />
                    <Button label="Adicionar" icon="pi pi-plus" @click="modal = false" autofocus />
                </template>
            </Dialog>
            <br />
            <div class="flex align-items-center text-primary justify-content-end">
                <Button label="Primary" class="w-full lg:w-2 justify-content-center" @click.stop="cadastrar()">Cadastrar </Button>
            </div>
        </template>
    </Card>
</template>
