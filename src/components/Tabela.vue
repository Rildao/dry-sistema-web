<script>
import { FilterMatchMode } from 'primevue/api';

export default {
    props: {
        data: {
            type: Array
        },

        dataKey: {
            type: String
        },

        globalFilterFields: {
            type: Array
        },

        mostrarPesquisa: {
            type: Boolean,
            default: () => true
        },
        paginacao: {
            type: Function,
            default: () => null
        },
        filtersProp: {
            type: Object,
            default: () => null
        },

        filterCallBack: {
            type: Function,
            default: () => null
        },

        stateKey: {
            type: String,
            default: () => 'dt-padrao'
        },

        refKey: {
            type: String,
            default: () => 'dt'
        },

        mostrarExportar: {
            type: Boolean,
            default: () => false
        },

        mostrarHeader: {
            type: Boolean,
            default: () => true
        },

        mostrarPaginacao: {
            type: Boolean,
            default: () => true
        }
    },

    data() {
        return {
            filtersLocal: {
                global: { value: null, matchMode: FilterMatchMode.CONTAINS }
            },
            filters: null
        };
    },

    created() {
        if (this.filtersProp) {
            this.filters = this.filtersProp;
        } else {
            this.filters = this.filtersLocal;
        }
    },

    watch: {
        filtersProp() {
            this.filters = this.filtersProp;
        }
    },

    methods: {
        exportCSV() {
            this.$refs[this.refKey].exportCSV();
        }
    }
};
</script>

<template>
    <DataTable
        :value="data"
        :paginator="mostrarPaginacao"
        :rows="5"
        :dataKey="dataKey"
        :rowHover="true"
        :rowClass="() => classeLinha"
        v-model:filters="filters"
        @page="paginacao"
        :meta-key-selection="true"
        :autoLayout="true"
        :globalFilterFields="globalFilterFields"
        :rowsPerPageOptions="[5, 10, 20, 50]"
        @filter="filterCallBack($event)"
        filterDisplay="menu"
        paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
        currentPageReportTemplate="Mostrando {first} até {last} de {totalRecords}"
        stripedRows
        responsiveLayout="scroll"
        stateStorage="local"
        :stateKey="stateKey"
        :ref="refKey"
    >
        <template #header v-if="mostrarHeader">
            <div class="table-header flex flex-column md:flex-row justify-content-between">
                <span class="p-input-icon-left" v-if="mostrarPesquisa">
                    <i class="pi pi-search" />
                    <InputText v-model="filters['global'].value" placeholder="Pesquisar..." />
                    <slot name="checkbox"> </slot>
                </span>
                <div class="flex flex-column md:flex-row">
                    <Button icon="pi pi-file-excel" label="Exportar" @click="exportCSV($event)" v-if="mostrarExportar" />
                    <slot name="botoes"> </slot>
                </div>
            </div>
        </template>
        <template #empty> Não exitem registros para exibição. </template>
        <slot name="conteudo"></slot>
    </DataTable>
</template>

<style lang="scss" scoped>
:deep(.p-datatable-header) {
    background: #fff;
    color: #fff;
    border: 1px solid #dee2e6;
    border-width: 1px 0 1px 0;
    padding: 1rem 1rem;
    font-weight: 700;
}
</style>
