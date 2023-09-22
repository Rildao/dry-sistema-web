<script>
import { ClienteService } from '@/service';
import { FilterMatchMode } from 'primevue/api';

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
            totalDeElementos: null
        };
    },
    mounted() {
        ClienteService.listarCliente().then((res) => {
            this.listaDeCliente = res.data.clientes;
            this.totalDePagina = res.data.totalPage;
        });
    },
    methods: {
        maskTelefone(telefone) {
            telefone = telefone.replace(/[^\d]/g, '');
            return telefone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
        },
        maskCPF(cpf) {
            cpf = cpf.replace(/[^\d]/g, '');
            return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
        },
        pesquisa(event) {
            const dados = {
                filtro: event.filters.global.value !== null ? event.filters.global.value : '',
                linhas: event.rows ? event.rows : 5,
                pagina: event.page ? event.page : 0
            };
            ClienteService.listarCliente(dados.filtro, dados.linhas, dados.pagina).then((res) => {
                this.listaDeCliente = res.data.clientes;
                this.totalDePagina = res.data.totalPage;
            });
        },
        logs(event) {
            console.log(event);
        }
    },
    watch: {
        clienteSelecionado() {
            let route = this.$router.resolve(`/clientes/editar-cliente/${this.clienteSelecionado.id}`);
            window.open(route.href, '_blank');
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
                        <span class="font-bold text-lg">Listagem de Clientes</span>
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
                    selectionMode="single"
                    dataKey="id"
                    :metaKeySelection="true"
                >
                    <template #header>
                        <div class="table-header flex flex-column md:flex-row justify-content-between">
                            <span class="p-input-icon-left">
                                <i class="pi pi-search" />
                                <InputText v-model="filters['global'].value" placeholder="Pesquisar..." />
                            </span>
                        </div>
                    </template>
                    <Column bodyClass="pointer" field="nome" header="Nome" sortable> </Column>
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
                    <template #paginatorend>

                    </template>
                </DataTable>
            </Fieldset>
        </template>
    </Card>
</template>
