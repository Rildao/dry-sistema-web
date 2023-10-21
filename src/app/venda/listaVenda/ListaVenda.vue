<script>
import { ClienteService, VendaService } from '@/service';
import { formatarEnumVenda, formatarValorReal, formatarData, formatarEnumStatus } from '@/utils';
import { FilterMatchMode } from 'primevue/api';

export default {
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
            linha: 0,
            vendaSelecionada: null,
            clientId: null
        };
    },
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
        pesquisaNome() {
            ClienteService.listarCliente(this.filters['global'].value)
                .then((res) => {
                    this.clientId = res.data.clientes[0].id;
                    if (this.filters['global'].value !== null) {
                        this.clientId = this.filters['global'].value !== '' ? this.clientId : '';
                        VendaService.listarVenda(this.clientId, 0, 20).then((res) => {
                            this.listaDeVenda = res.data.vendas;
                            this.totalDePagina = res.data.totalPage;
                        });
                    }
                })
                .finally(() => {
                    this.$store.dispatch('removeRequest');
                });
        },
        pesquisa(event) {
            VendaService.listarVenda(this.clientId !== null ? this.clientId : '', event.page, event.rows).then((res) => {
                this.listaDeVenda = res.data.vendas;
                this.totalDePagina = res.data.totalPage;
            });
        },
        exportCSV() {
            VendaService.listarVendaCsv()
                .then((res) => {
                    this.montarArquivoCSV(res.data, 'vendas');
                })
                .finally(() => {
                    this.$store.dispatch('removeRequest');
                });
        },
        montarArquivoCSV(items, fileName) {
            items.unshift('\uFEFF');

            var jsonObject = JSON.stringify(items);
            var csv = this.converterJsonParaCSV(jsonObject);

            var exportedFilenmae = fileName + '.csv' || 'export.csv';

            var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            if (navigator.msSaveBlob) {
                navigator.msSaveBlob(blob, exportedFilenmae);
            } else {
                var link = document.createElement('a');
                if (link.download !== undefined) {
                    var url = URL.createObjectURL(blob);
                    link.setAttribute('href', url);
                    link.setAttribute('download', exportedFilenmae);
                    link.style.visibility = 'hidden';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }
            }
        },
        converterJsonParaCSV(objArray) {
            var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
            var str = '';

            for (var i = 0; i < array.length; i++) {
                var line = '';
                for (var index in array[i]) {
                    if (line !== '') line += ',';

                    line += array[i][index];
                }

                str += line + '\r\n';
            }

            return str;
        }
    },
    components: {},

    mounted() {
        this.$store.dispatch('addRequest');
        VendaService.listarVenda('', 0, 20)
            .then((res) => {
                this.listaDeVenda = res.data.vendas;
                this.totalDeElementos = res.data.totalElements;
                this.totalDePagina = res.data.totalPage;
            })
            .finally(() => {
                this.$store.dispatch('removeRequest');
            });
    },
    watch: {
        vendaSelecionada() {
            this.$router.push({
                path: `/clientes/editar-cliente/${this.vendaSelecionada.cliente.id}`,
                query: { vendaId: this.vendaSelecionada.id }
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
                        <span class="pi pi-shopping-cart mr-2"></span>
                        <span class="font-bold text-lg">Vendas</span>
                    </div>
                </template>
                <DataTable
                    v-model:filters="filters"
                    v-model:selection="vendaSelecionada"
                    paginator
                    :rows="5"
                    lazy
                    @page="pesquisa($event)"
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
                    <template #header>
                        <div class="flex w-12 justify-content-between">
                            <span class="w-5 p-input-icon-left">
                                <i class="pi pi-search" />
                                <InputText class="w-12" @keyup="pesquisaNome()" v-model="filters['global'].value" placeholder="Pesquise pelo nome do Cliente" />
                            </span>
                            <div class="flex flex-column md:flex-row">
                                <Button label="Baixar" icon="pi pi-file-excel" severity="success" outlined v-tooltip="`Exportar tabela para Excel.`" @click="exportCSV($event)" />
                            </div>
                        </div>
                    </template>
                    <template #empty> Nenhuma venda encontrado </template>
                    <template #loading> Carregando... </template>
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
