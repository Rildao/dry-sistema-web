<script>
import { ClienteService } from '@/service';
import { FilterMatchMode } from 'primevue/api';
import { maskCPF, maskTelefone } from '@/utils';

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
            linha: 0,
            totalDeElementos: null
        };
    },
    methods: {
        maskCPF,
        maskTelefone,
        pesquisa(event) {
            this.filtro = event.filters.global.value !== null ? event.filters.global.value : '';
            ClienteService.listarCliente(this.filtro, event.page, event.rows).then((res) => {
                this.listaDeCliente = res.data.clientes;
                this.totalDePagina = res.data.totalPage;
            });
        },
        exportCSV() {
            ClienteService.listarClienteCsv()
                .then((res) => {
                    this.montarArquivoCSV(res.data, 'clientes');
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
        },
        pesquisaPorNomeOuCPF() {
            const filtro = this.filters['global'].value;
            if (filtro.toString().length => 2) {
                ClienteService.listarCliente(this.filters['global'].value)
                    .then((res) => {
                        this.listaDeCliente = res.data.clientes;
                        this.totalDeElementos = res.data.totalElements;
                    })
                    .finally(() => {
                        this.$store.dispatch('removeRequest');
                    });
            }
        }
    },
    mounted() {
        this.$store.dispatch('addRequest');
        ClienteService.listarCliente()
            .then((res) => {
                this.listaDeCliente = res.data.clientes;
                this.totalDeElementos = res.data.totalElements;
            })
            .finally(() => {
                this.$store.dispatch('removeRequest');
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
    <div class="card">
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
                paginator
                lazy
                @page="pesquisa($event)"
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
                ref="dt"
            >
                <template #header>
                    <div class="flex w-12 justify-content-between">
                        <span class="w-5 p-input-icon-left">
                            <i class="pi pi-search" />
                            <InputText class="w-12" @keyup="pesquisaPorNomeOuCPF()" v-model="filters['global'].value" placeholder="Pesquise pelo nome ou CPF" />
                        </span>
                        <div class="flex flex-column md:flex-row">
                            <Button label="Baixar" icon="pi pi-file-excel" severity="success" outlined v-tooltip="`Exportar tabela para Excel.`" @click="exportCSV($event)" />
                        </div>
                    </div>
                </template>
                <template #empty> Nenhum cliente encontrado </template>
                <template #loading> Carregando... </template>
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
    </div>
</template>
