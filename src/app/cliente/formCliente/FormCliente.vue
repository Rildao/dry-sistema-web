<script>
import useVuelidate from '@vuelidate/core';
import { minValue, maxValue, required, requiredIf, and } from '@vuelidate/validators';
import { ClienteService, LancamentoService, VendaService } from '@/service';
import { FilterMatchMode } from 'primevue/api';
import { formatarData, formatarValorReal } from '@/utils';

export default {
    data() {
        return {
            id: null,
            nome: '',
            telefone: '',
            endereco: '',
            cpf: '',
            modal: false,
            vendas: [],
            lancamentos: [],
            venda: {
                id: '',
                tipoVenda: '',
                quantidadeParcelas: '',
                valorVenda: '',
                dataVenda: '',
                statusVenda: '',
                diaVencimentoLancamento: '',
                descricao: '',
                cliente: {
                    id: ''
                }
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
            rotaClienteEditar: false,
            vendaSelecionada: null,
            filters: {
                global: { value: '', matchMode: FilterMatchMode.CONTAINS }
            },
            exibirLancamento: false,
            atualizaVenda: false,
            editingRows: [],
            rotaAtual: this.$route.name
        };
    },
    setup() {
        return { v$: useVuelidate() };
    },
    validations() {
        return {
            nome: { required },
            cpf: { required },
            venda: {
                tipoVenda: { required },
                dataVenda: { required },
                valorVenda: { required },
                quantidadeParcelas: requiredIf(minValue(1)),
                diaVencimentoLancamento: requiredIf(and(minValue(1), maxValue(31)))
            }
        };
    },
    mounted() {
        if (this.$route.params.id && this.$route.name === 'Cliente Editar') {
            this.rotaClienteEditar = true;
            this.id = this.$route.params.id;
            this.buscarClientePorId(this.id);

            if (this.$route.query.vendaId) {
                this.vendaSelecionada = { id: this.$route.query.vendaId };
                this.buscarVendaPorId();
            }
        }
        if (this.$route.name === 'Cliente Novo') {
            this.limparCamposCliente();
            this.rotaClienteNovo = true;
            this.rotaClienteEditar = false;
        }
    },
    methods: {
        formatarData,
        onRowEditSave: function (event) {
            let { newData, index } = event;
            this.$store.dispatch('addRequest');
            LancamentoService.atualizarLancamento(newData)
                .then((res) => {
                    this.$store.dispatch('removeRequest');
                    if (res.success === true) {
                        this.lancamentos[index] = res.data;
                    } else {
                        this.$toast.add({ severity: 'error', summary: 'Error', detail: `${res.errors.descricao}`, life: 3000 });
                    }
                })
                .finally(() => {
                    this.$store.dispatch('removeRequest');
                });
        },
        formatarValorReal,
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
        buscarClientePorId(id) {
            this.$store.dispatch('addRequest');
            ClienteService.buscarClientePorId(id)
                .then((res) => {
                    this.$store.dispatch('removeRequest');
                    if (res.success === true) {
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
                        this.$router.push('/clientes/editar-cliente/' + res.data.id);
                        this.rotaClienteEditar = true;
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
        abrirModal(editar = false) {
            if (editar) {
                this.atualizaVenda = true;
                this.buscarVendaPorId();
            }
            this.modal = true;
        },
        fecharModal() {
            this.v$.$reset();
            this.limparCamposVenda();
            this.vendaSelecionada = null;
            this.exibirLancamento = false;
            this.atualizaVenda = false;
            this.modal = false;
        },
        buscarVendaPorId() {
            this.$store.dispatch('addRequest');
            VendaService.buscarVendaPorId(this.vendaSelecionada.id)
                .then((res) => {
                    if (res.success === true) {
                        this.venda = res.data;
                        this.venda.dataVenda = this.$formatarData(this.venda.dataVenda, 'DD/MM/YYYY');
                        if (this.venda.tipoVenda === 'CREDIARIO') {
                            this.exibirLancamento = true;
                            this.buscarLancamentosDavenda(this.venda.id);
                        }
                        this.vendaSelecionada = null;
                    } else {
                        this.$toast.add({ severity: 'error', summary: 'Error', detail: `${res.errors.descricao}`, life: 3000 });
                    }
                })
                .finally(() => {
                    this.$store.dispatch('removeRequest');
                });
        },
        buscarLancamentosDavenda(vendaId) {
            LancamentoService.listarLancamento(vendaId).then((res) => {
                if (res.success) {
                    this.lancamentos = res.data;
                }
            });
        },
        adicionarOuAtualizaVenda() {
            this.venda.cliente.id = this.$route.params.id;
            this.v$.$touch();
            if (this.v$.$invalid) return;
            if (this.venda.id) {
                this.atualizarVenda(this.venda);
            } else {
                this.criarVenda();
            }
        },
        criarVenda() {
            this.venda.dataVenda = this.$formatarData(this.venda.dataVenda, 'YYYY-MM-DD');
            this.$store.dispatch('addRequest');
            VendaService.criarVenda(this.venda)
                .then((res) => {
                    if (res.success === true) {
                        this.$toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Venda adicionada!', life: 3000 });
                    } else {
                        this.$toast.add({ severity: 'error', summary: 'Error', detail: `${res.errors.descricao}`, life: 3000 });
                    }
                })
                .finally(() => {
                    this.modal = false;
                    this.limparCamposVenda();
                    this.buscarVendas();
                    this.$store.dispatch('removeRequest');
                });
        },
        atualizarVenda(venda) {
            venda.dataVenda = this.$formatarDataBrasileiraParaIso(venda.dataVenda);
            this.$store.dispatch('addRequest');
            VendaService.atualizarVenda(venda)
                .then((res) => {
                    if (res.success === true) {
                        this.$toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Venda atualizada!', life: 3000 });
                    } else {
                        this.$toast.add({ severity: 'error', summary: 'Error', detail: `${res.errors.descricao}`, life: 3000 });
                    }
                })
                .finally(() => {
                    this.modal = false;
                    this.limparCamposVenda();
                    this.buscarVendas();
                    this.$store.dispatch('removeRequest');
                });
        },
        buscarVendas() {
            this.$store.dispatch('addRequest');
            VendaService.listarVenda(10, 0, this.id)
                .then((res) => {
                    if (res.success === true) {
                        this.vendas = res.data.vendas;
                    } else {
                        this.$toast.add({ severity: 'error', summary: 'Error', detail: `${res.errors.descricao}`, life: 3000 });
                    }
                })
                .finally(() => {
                    this.$store.dispatch('removeRequest');
                });
        },
        limparCamposVenda() {
            this.venda = {
                id: '',
                tipoVenda: '',
                quantidadeParcelas: '',
                valorVenda: '',
                dataVenda: '',
                diaVencimentoLancamento: '',
                statusVenda: '',
                descricao: '',
                cliente: {
                    id: ''
                }
            };
        },
        limparCamposCliente() {
            this.id = null;
            this.nome = '';
            this.telefone = '';
            this.endereco = '';
            this.cpf = '';
            this.vendas = [];
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
                if (!this.venda.diaVencimentoLancamento) {
                    this.venda.diaVencimentoLancamento = this.venda.dataVenda.getDate();
                }
            }
        },

        '$route.name': function (newVal) {
            if (newVal === 'Cliente Novo') {
                this.limparCamposCliente();
                this.rotaClienteNovo = true;
                this.rotaClienteEditar = false;
            }
        },
        vendaSelecionada() {
            if (this.vendaSelecionada) {
                this.venda = this.vendaSelecionada;
                this.abrirModal(true);
            }
        }
    }
};
</script>
<template>
    <div class="card">
        <Fieldset>
            <template #legend>
                <div class="flex align-items-center text-primary">
                    <span class="pi pi-user mr-2"></span>
                    <span class="font-bold text-lg">Dados do Cliente</span>
                </div>
            </template>
            <div class="grid">
                <div class="field col-12 lg:col-9 md:col-9">
                    <label for="nome">Nome*</label>
                    <InputText id="nome" @input="v$.nome.$touch()" :class="{ 'p-invalid': nome !== null && v$.nome.$error }" class="w-full" v-model="nome" type="text" placeholder="Nome" />
                    <small class="p-error mb-3" v-if="nome !== null && v$.nome.$error">Nome é obrigatório</small>
                </div>
                <div class="field col-12 lg:col-3 md:col-3">
                    <label for="cpf">CPF*</label>
                    <InputMask id="cpf" @input="v$.cpf.$touch()" :class="{ 'p-invalid': cpf !== null && v$.cpf.$error }" class="w-full" v-model="cpf" type="text" mask="999.999.999-99" placeholder="999.999.999-99" />
                    <small class="p-error mb-3" v-if="cpf !== null && v$.cpf.$error">CPF é obrigatório</small>
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

        <Fieldset class="mt-5" v-if="rotaClienteEditar">
            <template #legend>
                <div class="flex align-items-center text-primary">
                    <span class="pi pi-shopping-cart mr-2"></span>
                    <span class="font-bold text-lg">Vendas</span>
                </div>
            </template>
            <DataTable
                v-model:filters="filters"
                v-model:selection="vendaSelecionada"
                paginator
                :rows="5"
                :rowsPerPageOptions="[5, 10, 15]"
                :value="vendas"
                selectionMode="single"
                dataKey="id"
                :metaKeySelection="true"
                paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                currentPageReportTemplate="Mostrando {first} até {last} de {totalRecords}"
            >
                <template #header>
                    <div class="flex flex-column md:flex-row justify-content-between gap-2">
                        <div class="w-12">
                            <span class="w-full p-input-icon-left">
                                <i class="pi pi-search" />
                                <InputText class="w-full" v-model="filters['global'].value" placeholder="Pesquisar..." />
                            </span>
                        </div>
                        <div class="w-12"></div>
                        <div class="w-5">
                            <Button icon="pi pi-plus" label="Adiconar Venda" @click.stop="abrirModal()" severity="primary" outlined />
                        </div>
                    </div>
                </template>
                <template #empty> Não exitem registros de vendas para exibição. </template>

                <Column field="dataVenda" header="Data da Venda" :sortable="true">
                    <template #body="slotProps">
                        {{ $formatarData(slotProps.data.dataVenda, 'DD/MM/YYYY') }}
                    </template>
                </Column>
                <Column field="statusVenda" header="Status" :sortable="true">
                    <template #body="slotProps">
                        <Tag :severity="severityStatus(slotProps.data.statusVenda)">
                            {{ formatarEnumStatus(slotProps.data.statusVenda) }}
                        </Tag>
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
            </DataTable>
        </Fieldset>

        <Dialog v-model:visible="modal" modal :closable="false" :style="{ width: '85%' }">
            <Fieldset>
                <template #legend>
                    <div class="flex align-items-center text-primary">
                        <span class="pi pi-shopping-cart mr-2"></span>
                        <span class="font-bold text-lg">Dados da Venda</span>
                    </div>
                </template>
                <div class="formgrid grid">
                    <div class="field col-12 lg:col-4 md:col-4">
                        <label for="tipoVenda">Tipo*</label>
                        <Dropdown
                            id="tipoVenda"
                            @input="v$.venda.tipoVenda.$touch()"
                            :class="{ 'p-invalid': venda.tipoVenda === null || v$.venda.tipoVenda.$error }"
                            v-model="venda.tipoVenda"
                            :options="tipoVendaEnum"
                            optionLabel="nome"
                            optionValue="codigo"
                            showClear
                            placeholder="Selecione o Tipo"
                            class="w-full"
                            :disabled="atualizaVenda"
                        />
                        <small class="p-error mb-3" v-if="venda.tipoVenda === null || v$.venda.tipoVenda.$error">Insira o tipo de venda</small>
                    </div>

                    <div class="field col-12 lg:col-4 md:col-4">
                        <label for="valorVenda">Valor*</label>
                        <InputNumber
                            id="valorVenda"
                            @input="v$.venda.valorVenda.$touch()"
                            :class="{ 'p-invalid': venda.valorVenda === null || v$.venda.valorVenda.$error }"
                            v-model="venda.valorVenda"
                            optionLabel="nome"
                            optionValue="codigo"
                            showClear
                            placeholder="R$ 0,00"
                            class="w-full"
                            mode="currency"
                            currency="BRL"
                            :disabled="atualizaVenda"
                        />
                        <small class="p-error mb-3" v-if="venda.valorVenda === null || v$.venda.valorVenda.$error">Valor da venda é obrigatório</small>
                    </div>

                    <div v-if="venda.tipoVenda === 'CREDIARIO'" class="field col-12 lg:col-4 md:col-4">
                        <label for="quantidadeParcelas">Quant. de Parcelas* <i class="pi pi-info-circle" v-tooltip="`Quant. de Parcelas aplicasse apenas no tipo 'Crediário'.`" style="color: slateblue"></i></label>
                        <InputNumber
                            id="quantidadeParcelas"
                            @input="v$.venda.quantidadeParcelas.$touch()"
                            :class="{ 'p-invalid': venda.tipoVenda === 'CREDIARIO' && (venda.quantidadeParcelas === null || v$.venda.quantidadeParcelas.$error) }"
                            class="w-full"
                            v-model="venda.quantidadeParcelas"
                            inputId="minmax-buttons"
                            mode="decimal"
                            showButtons
                            :min="1"
                            :disabled="atualizaVenda"
                        />
                        <small class="p-error mb-3" v-if="venda.tipoVenda === 'CREDIARIO' && (venda.quantidadeParcelas === null || v$.venda.quantidadeParcelas.$error)">Insira um valor maior que 0</small>
                    </div>

                    <div class="field col-12 lg:col-4 md:col-4">
                        <label for="dataVenda">Data da Venda*</label>
                        <Calendar
                            id="dataVenda"
                            @input="v$.venda.dataVenda.$touch()"
                            :class="{ 'p-invalid': venda.dataVenda === null || v$.venda.dataVenda.$error }"
                            class="w-full"
                            v-model="venda.dataVenda"
                            showIcon
                            placeholder="dd/mm/aaaa"
                            dateFormat="dd/mm/yy"
                            :disabled="atualizaVenda"
                        />
                        <small class="p-error mb-3" v-if="venda.dataVenda === null || v$.venda.dataVenda.$error">Data da venda é obrigatório</small>
                    </div>

                    <div v-if="venda.tipoVenda === 'CREDIARIO'" class="field col-12 lg:col-4 md:col-4">
                        <label for="dataVencimentoLancamento">
                            Dia de Venc. do Pagamento*
                            <i class="pi pi-info-circle" v-tooltip="`Dia de Venc. do Pagamento aplicasse apenas no tipo 'Crediário'.`" style="color: slateblue"></i>
                        </label>
                        <InputNumber
                            id="dataVencimentoLancamento"
                            @input="v$.venda.dataVenda.$touch()"
                            :class="{ 'p-invalid': venda.diaVencimentoLancamento === null || v$.venda.diaVencimentoLancamento.$error }"
                            class="w-full"
                            v-model="venda.diaVencimentoLancamento"
                            :min="1"
                            :max="31"
                            :disabled="atualizaVenda"
                        />
                        <small class="p-error mb-3" v-if="venda.diaVencimentoLancamento === null || v$.venda.diaVencimentoLancamento.$error">Insira o dia de vencimento é obrigatório</small>
                        <small class="p-error mb-3" v-if="(venda.diaVencimentoLancamento < 1 || venda.diaVencimentoLancamento > 31) && v$.venda.diaVencimentoLancamento.$error">Insira um dia entre 1 a 31</small>
                    </div>

                    <div class="field col-12 lg:col-12 md:col-12">
                        <label for="abservacao">Observação</label>
                        <Editor v-model="venda.descricao" id="abservacao" editorStyle="height: 180px" aria-describedby="editor-error" in>
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
            <br />
            <Fieldset v-if="exibirLancamento">
                <template #legend>
                    <div class="flex align-items-center text-primary">
                        <span class="pi pi-shopping-cart mr-2"></span>
                        <span class="font-bold text-lg">Lancamentos</span>
                    </div>
                </template>
                <DataTable v-model:editingRows="editingRows" :value="lancamentos" editMode="row" dataKey="id" @row-edit-save="onRowEditSave" tableClass="editable-cells-table" tableStyle="min-width: 50rem">
                    <Column field="dataPagamento" header="Data do Pagamento" style="width: 20%">
                        <template #body="slotProps">
                            {{ $formatarData(slotProps.data.dataPagamento, 'DD/MM/YYYY') }}
                        </template>
                    </Column>
                    <Column field="valorParcela" header="Valor da Parcela" style="width: 20%">
                        <template #body="{ data, field }"> {{ formatarValorReal(data[field]) }} </template>S
                    </Column>
                    <Column field="statusVenda" header="Status" style="width: 20%">
                        <template #editor="{ data, field }">
                            <Dropdown v-model="data[field]" :options="statusVendaEnum" optionLabel="nome" optionValue="codigo" placeholder="Selecione o status">
                                <template #option="slotProps">
                                    <Tag :value="slotProps.option.codigo" :severity="severityStatus(slotProps.option.codigo)" />
                                </template>
                            </Dropdown>
                        </template>
                        <template #body="slotProps">
                            <Tag :value="slotProps.data.statusVenda" :severity="severityStatus(slotProps.data.statusVenda)" />
                        </template>
                    </Column>
                    <Column :rowEditor="true" style="width: 10%; min-width: 8rem" bodyStyle="text-align:center"></Column>
                </DataTable>
            </Fieldset>
            <br />
            <div class="flex justify-content-end">
                <Button label="Voltar" @click="fecharModal()" text />
                <Button :label="venda.id ? 'Atualizar' : 'Cadastrar'" @click="adicionarOuAtualizaVenda()" autofocus></Button>
            </div>
        </Dialog>

        <div class="flex align-items-center text-primary mt-4 justify-content-end">
            <Button label="Primary" class="w-full lg:w-2 justify-content-center" @click.stop="cadastrar()">{{ id ? 'Atualizar' : 'Cadastrar' }}</Button>
        </div>
    </div>
</template>
