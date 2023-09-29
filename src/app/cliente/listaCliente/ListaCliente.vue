<script>
import { ClienteService } from '@/service';
import { FilterMatchMode } from 'primevue/api';
import { maskCPF, maskTelefone } from '../../../utils';

export default {
    components: {},
    data() {
        return {
            listaDeCliente: [],
            clienteSelecionado: null,
            filters: {
                global: { value: null, matchMode: FilterMatchMode.CONTAINS }
            },
            first: null,
            totalDePagina: null,
            pagina: 0,
            linha:0,
            totalDeElementos: null
        };
    },
    methods: {
        maskCPF,
        maskTelefone,
        pesquisa(event) {
            const dados = {
                filtro: event.filters.global.value !== null ? event.filters.global.value : '',
                linhas: this.linha,
                pagina: this.pagina
            };
            ClienteService.listarCliente(dados.filtro, dados.linhas, dados.pagina).then((res) => {
                this.listaDeCliente = res.data.clientes;
                this.totalDePagina = res.data.totalPage;
            });
        }
    },
    mounted() {
        ClienteService.listarCliente().then((res) => {
            this.listaDeCliente = res.data.clientes;
            this.totalDePagina = res.data.totalPage;
        });
    },
    watch: {
        clienteSelecionado() {
            this.$router.push(`/clientes/editar-cliente/${this.clienteSelecionado.id}`);
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
                        <span class="pi pi-users mr-2"></span>
                        <span class="font-bold text-lg">Clientes</span>
                    </div>
                </template>
                <DataTable
                    v-model:selection="clienteSelecionado"
                    v-model:filters="filters"
                    :globalFilterFields="['nome', 'cpf']"
                    @page="pesquisa"
                    paginator
                    :rows="5"
                    :pageCount="totalDePagina"
                    :totalRecords="totalDeElementos"
                    :rowsPerPageOptions="[5, 10, 15]"
                    :value="listaDeCliente"
                    paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                    currentPageReportTemplate="Mostrando {first} até {last} de {totalRecords}"
                    selectionMode="single"
                    dataKey="id"
                    :metaKeySelection="true"
                    >
                    <template #header>
                        <div class="w-12">
                            <span class="w-5 p-input-icon-left">
                                <i class="pi pi-search" />
                                <InputText class="w-12" v-model="filters['global'].value" placeholder="Pesquise pelo nome ou CPF" />
                            </span>
                        </div>
                    </template>
                    <Column bodyClass="pointer" field="nome" header="Nome" sortable></Column>
                    <Column field="cpf" bodyClass="pointer" header="CPF">
                        <template #body="{ data }">
                            {{ maskCPF(data.cpf) }}
                        </template>
                    </Column>
                    <Column field="telefone" bodyClass="pointer" header="Telefone">
                        <template #body="{ data }">
                            {{ maskTelefone(data.telefone) }}
                        </template>
                    </Column>
                </DataTable>
            </Fieldset>
        </template>
    </Card>
</template>
<style></style>
