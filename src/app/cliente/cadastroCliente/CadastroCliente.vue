<script>
import useVuelidate from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import { ClienteService } from '@/service';

export default {
    data() {
        return {
            id: '',
            nome: '',
            telefone: '',
            endereco: '',
            cpf: '',
            modal: false,
            vendas: [],
            venda: {
                id: '',
                tipoVenda: '',
                quantidadeParcelas: '',
                valorVenda: '',
                dataVenda: '',
                statusVenda: '',
                diaVencimentoLancamento: ''
            },
            tipoVendaEnum: [
                { codigo: 'CREDIARIO', nome: 'Crediário' },
                { codigo: 'CARTAO_CREDITO', nome: 'Cartão de Credito' },
                { codigo: 'DINHEIRO', nome: 'Dinheiro' },
                { codigo: 'PIX', nome: 'Pix' }
            ],
            statusVendaEnum: [
                { codigo: 'ATRASADO', nome: 'Atrasado' },
                { codigo: 'PAGO', nome: 'Pago' },
                { codigo: 'ANDAMENTO', nome: 'Andamento' }
            ],
            rotaClienteNovo: false,
            rotaClienteEditar: false
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
    mounted() {
        if (this.$route.params.id && this.$route.name == 'Cliente Editar') {
            this.rotaClienteEditar = true;
            this.buscarClientePorId();
        } else if (this.$route.name == 'Cliente Novo') {
            this.rotaClienteNovo = true;
        }
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
        buscarClientePorId() {
            this.$store.dispatch('addRequest');

            ClienteService.buscarClientePorId(this.$route.params.id)
                .then((res) => {
                    this.$store.dispatch('removeRequest');
                    if (res.success === true) {
                        this.id = res.data.id;
                        this.nome = res.data.nome;
                        this.telefone = res.data.telefone;
                        this.endereco = res.data.endereco;
                        this.cpf = res.data.cpf;
                        this.vendas = res.data.vendas;
                    } else {
                        this.$toast.add({ severity: 'error', summary: 'Error', detail: `${res.errors.descricao}`, life: 3000 });
                    }
                })
                .finally(() => {
                    this.$store.dispatch('removeRequest');
                });
        },
        criarCliente() {
            const cliente = {
                id: this.id,
                nome: this.nome,
                telefone: this.formatarTelefone(this.telefone),
                endereco: this.endereco,
                cpf: this.formatarCPF(this.cpf),
                vendas: this.vendas
            };

            if (cliente.vendas.length === 0 && this.rotaClienteNovo) {
                this.cadastrarClienteSemVendas(cliente);
            } else {
                this.cadastrarClienteComVendas(cliente);
            }
        },
        cadastrarClienteSemVendas(cliente) {
            this.$store.dispatch('addRequest');
            ClienteService.criarCliente(cliente)
                .then((res) => {
                    this.$store.dispatch('removeRequest');
                    if (res.success === true) {
                        this.limparCamposCliente();
                        this.$router.push('/clientes/editar-cliente/' + res.data.id);
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
                    this.$store.dispatch('removeRequest');
                });
        },
        cadastrarClienteComVendas(cliente) {
            this.$store.dispatch('addRequest');
            ClienteService.criarClienteComVendas(cliente)
                .then((res) => {
                    this.$store.dispatch('removeRequest');
                    if (res.success === true) {
                        this.limparCamposCliente();
                        this.$router.push('/clientes/editar-cliente/' + res.data.id);
                        this.$toast.add({
                            severity: 'success',
                            summary: 'Successo',
                            detail: `${cliente.id ? 'Atualizado' : 'Criado'} com sucesso!`,
                            life: 3000
                        });
                    } else {
                        this.$toast.add({ severity: 'error', summary: 'Error', detail: `${res.errors.descricao}`, life: 3000 });
                    }
                })
                .finally(() => {
                    this.$store.dispatch('removeRequest');
                });
        },
        abrirModal() {
            this.modal = true;
        },
        fecharModal() {
            this.limparCamposVenda();
            this.modal = false;
        },
        adicionarVenda() {
            this.vendas.push(this.venda);
            this.limparCamposVenda();

            this.modal = false;
            this.$toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Venda adicionada!', life: 3000 });
        },
        limparCamposCliente() {
            this.cliente = {
                nome: '',
                telefone: '',
                endereco: '',
                cpf: '',
                vendas: []
            };
        },
        limparCamposVenda() {
            this.venda = {
                tipoVenda: '',
                quantidadeParcelas: '',
                valorVenda: '',
                dataVenda: '',
                diaVencimentoLancamento: '',
                statusVenda: ''
            };
        },
        formatarEnumStatus(status) {
            switch (status) {
                case 'ATRASADO':
                    return 'Atrasado';
                case 'PAGO':
                    return 'Pago';
                case 'ANDAMENTO':
                    return 'Andamento';
            }
        },
        formatarEnumVenda(tipoVenda) {
            switch (tipoVenda) {
                case 'CREDIARIO':
                    return 'Crediário';
                case 'CARTAO_CREDITO':
                    return 'Cartão de Credito';
                case 'DINHEIRO':
                    return 'Dinheiro';
                case 'PIX':
                    return 'Pix';
            }
        },
        severityStatus(status) {
            switch (status) {
                case 'ATRASADO':
                    return 'danger';
                case 'PAGO':
                    return 'success';
                case 'ANDAMENTO':
                    return 'warning';
            }
        }
    },
    watch: {
        'venda.dataVenda'() {
            if (this.venda.dataVenda) {
                this.venda.diaVencimentoLancamento = this.venda.dataVenda.getDate();
            }
        }
    }
};
</script>
<template>
    <Card>
        <template #content>
            <!-- Cadastro Clientes -->
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

            <!-- Listagem Vendas -->
            <Fieldset>
                <template #legend>
                    <div class="flex align-items-center text-primary">
                        <span class="pi pi-shopping-cart mr-2"></span>
                        <span class="font-bold text-lg">Vendas</span>
                    </div>
                </template>
                <Tabela :data="vendas">
                    <template #botoes>
                        <Button icon="pi pi-plus" label="Adiconar Venda" @click.stop="abrirModal()" severity="primary" outlined />
                    </template>

                    <template #conteudo>
                        <Column field="dataVenda" header="Data da Venda" :sortable="true">
                            <template #body="slotProps">
                                {{ $formatarData(slotProps.data.dataVenda, 'DD/MM/YYYY') }}
                            </template>
                        </Column>
                        <Column field="statusVenda" header="Status" :sortable="true">
                            <template #body="slotProps">
                                <Tag :severity="severityStatus(slotProps.data.statusVenda)">{{ formatarEnumStatus(slotProps.data.statusVenda) }}</Tag>
                            </template>
                        </Column>
                        <Column field="tipoVenda" header="Tipo da Venda" :sortable="true">
                            <template #body="slotProps">
                                {{ formatarEnumVenda(slotProps.data.tipoVenda) }}
                            </template>
                        </Column>
                        <Column field="valorVenda" header="Valor da Venda" :sortable="true">
                            <template #body="slotProps">
                                {{ $formatarValorReal(slotProps.data.valorVenda) }}
                            </template>
                        </Column>
                        <Column field="quantidadeParcelas" header="Quantidade de Parcelas" :sortable="true">
                            <template #body="slotProps">
                                {{ slotProps.data.quantidadeParcelas }}
                            </template>
                        </Column>
                    </template>
                </Tabela>
            </Fieldset>

            <!-- Modal Vendas -->
            <Dialog v-model:visible="modal" modal :closable="false" :style="{ width: '50vw' }">
                <Fieldset>
                    <template #legend>
                        <div class="flex align-items-center text-primary">
                            <span class="pi pi-shopping-cart mr-2"></span>
                            <span class="font-bold text-lg">Dados da Venda</span>
                        </div>
                    </template>
                    <div class="formgrid grid">
                        <div class="field col-12 lg:col-4 md:col-4">
                            <label for="tipoVenda">Tipo</label>
                            <Dropdown id="tipoVenda" v-model="venda.tipoVenda" :options="tipoVendaEnum" optionLabel="nome" optionValue="codigo" showClear placeholder="Selecione o Tipo" class="w-full" />
                        </div>

                        <div class="field col-12 lg:col-4 md:col-4">
                            <label for="valorVenda">Valor</label>
                            <InputNumber id="tipoVenda" v-model="venda.valorVenda" optionLabel="nome" optionValue="codigo" showClear placeholder="R$ 0,00" class="w-full" mode="currency" currency="BRL" />
                        </div>

                        <div class="field col-12 lg:col-4 md:col-4">
                            <label for="quantidadeParcelas">Quantidade de Parcelas</label>
                            <InputNumber v-if="venda.tipoVenda == 'CREDIARIO'" id="quantidadeParcelas" class="w-full" v-model="venda.quantidadeParcelas" inputId="minmax-buttons" mode="decimal" showButtons :min="0" />

                            <InputNumber v-else id="quantidadeParcelas" class="w-full" v-model="venda.quantidadeParcelas" inputId="minmax-buttons" mode="decimal" showButtons :min="0" disabled />
                        </div>

                        <div class="field col-12 lg:col-4 md:col-4">
                            <label for="statusVenda">Status</label>
                            <Dropdown id="statusVenda" v-model="venda.statusVenda" :options="statusVendaEnum" optionLabel="nome" optionValue="codigo" showClear placeholder="Selecione o Status" class="w-full" />
                        </div>

                        <div class="field col-12 lg:col-4 md:col-4">
                            <label for="dataVenda">Data da Venda</label>
                            <Calendar id="dataVenda" class="w-full" v-model="venda.dataVenda" showIcon placeholder="dd/mm/aaaa" />
                        </div>

                        <div class="field col-12 lg:col-4 md:col-4">
                            <label for="dataVencimentoLancamento">Dia de Vencimento do Pagamento</label>
                            <InputNumber v-if="venda.tipoVenda == 'CREDIARIO'" id="dataVencimentoLancamento" class="w-full" v-model="venda.diaVencimentoLancamento" :min="1" :max="30" />
                            <InputNumber v-else id="dataVencimentoLancamento" class="w-full" :min="1" :max="30" disabled />
                        </div>

                        <div class="field col-12 lg:col-12 md:col-12">
                            <label for="abservacao">Observação</label>
                            <Editor id="abservacao" editorStyle="height: 180px" aria-describedby="editor-error" in>
                                <template #toolbar>
                                    <span class="ql-formats">
                                        <button v-tooltip.bottom="'Bold'" class="ql-bold"></button>
                                        <button v-tooltip.bottom="'Italic'" class="ql-italic"></button>
                                        <button v-tooltip.bottom="'Underline'" class="ql-underline"></button>
                                        <button v-tooltip.bottom="'Ordered List'" class="ql-list ql-active" value="ordered"></button>
                                    </span>
                                </template>
                            </Editor>
                        </div>
                    </div>
                </Fieldset>

                <template #footer>
                    <Button label="Voltar" icon="pi pi-times" @click="fecharModal()" text />
                    <Button label="Adicionar" icon="pi pi-plus" @click="adicionarVenda()" autofocus />
                </template>
            </Dialog>

            <br />

            <div class="flex align-items-center text-primary justify-content-end">
                <Button label="Primary" class="w-full lg:w-2 justify-content-center" @click.stop="cadastrar()">Cadastrar </Button>
            </div>
        </template>
    </Card>
</template>
