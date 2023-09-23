<script>
import { VendaService } from '@/service';
import { formatarEnumVenda, formatarValorReal, formatarData, formatarEnumStatus } from '@/utils';
import { FilterMatchMode } from 'primevue/api';

export default {
    methods: {
        formatarEnumStatus,
        formatarValorReal,
        formatarData,
        formatarEnumVenda,
        severityStatus(status) {
            switch (status) {
                case 'ATRASADO':
                    return 'danger';
                case 'PAGO':
                    return 'success';
                case 'ANDAMENTO':
                    return 'warning';
            }
        },
        pesquisa(event) {
            console.log(event);
            const dados = {
                filtro: event.filters.global.value !== null ? event.filters.global.value : '',
                linhas:this.linha,
                pagina: this.pagina
            };
            VendaService.listarVenda(dados.linhas, dados.pagina).then((res) => {
                this.listaDeVenda = res.data.vendas;
                this.totalDePagina = res.data.totalPage;
                this.totalDeElementos = res.data.totalElements;
            });
        }
    },
    components: {},
    data() {
        return {
            listaDeVenda: [],
            totalDePaginal: null,
            totalDeElementos: 0,
            totalDePagina: 0,
            filters: {
                global: { value: null, matchMode: FilterMatchMode.CONTAINS }
            },
            pagina: 0,
            linha: 0
        };
    },
    mounted() {
        VendaService.listarVenda().then((res) => {
            this.listaDeVenda = res.data.vendas;
            this.totalDeElementos = res.data.totalElements;
            this.totalDePagina = res.data.totalPage;
        });
    }
};
</script>
<template>
    <Card>
        <template #content>
            <Fieldset>
                <template #legend>
                    <div class="flex align-items-center text-primary">
                        <span class="pi pi-shopping-cart mr-2"></span>
                        <span class="font-bold text-lg">Vendas</span>
                    </div>
                </template>
                <DataTable
                    v-model:filters="filters"
                    @page="pesquisa"
                    paginator
                    :rows="5"
                    :pageCount="totalDePagina"
                    :totalRecords="totalDeElementos"
                    :rowsPerPageOptions="[5, 10, 15]"
                    :value="listaDeVenda"
                    paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                    currentPageReportTemplate="Mostrando {first} até {last} de {totalRecords}"
                    selectionMode="single"
                    dataKey="id"
                    :metaKeySelection="true"
                >
                    <Column field="dataVenda" header="Data da venda" :sortable="true">
                        <template #body="{ data }">
                            {{ formatarData(data.dataVenda, 'DD/MM/YYYY') }}
                        </template>
                    </Column>
                    <Column field="cliente.nome" header="Cliente" :sortable="true">
                        <template #body="{ data }">
                            {{ data.cliente.nome }}
                        </template>
                    </Column>
                    <Column field="tipoVenda" header="Méodo de pagamento" :sortable="true">
                        <template #body="{ data }">
                            {{ formatarEnumVenda(data.tipoVenda) }}
                        </template>
                    </Column>
                    <Column field="quantidadeParcelas" header="Qntd. Parcelas" :sortable="true">
                        <template #body="{ data }">
                            {{ data.quantidadeParcelas }}
                        </template>
                    </Column>
                    <Column field="diaVencimentoLancamento" header="Dia Venc." :sortable="true">
                        <template #body="{ data }">
                            {{ data.diaVencimentoLancamento }}
                        </template>
                    </Column>
                    <Column field="valorVenda" header="Valor" :sortable="true">
                        <template #body="{ data }">
                            {{ formatarValorReal(data.valorVenda) }}
                        </template>
                    </Column>
                    <Column field="statusVenda" header="Status da Venda" :sortable="true">
                        <template #body="{ data }">
                            <Tag :severity="severityStatus(data.statusVenda)">{{ formatarEnumStatus(data.statusVenda) }}</Tag>
                        </template>
                    </Column>
                </DataTable>
            </Fieldset>
        </template>
    </Card>
</template>
<style></style>
