<script>
import { VendaService } from '@/service';
import { formatarEnumVenda, formatarValorReal, formatarData} from "@/utils";


export default {
    methods: {
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
        }
    },
    components: {},
    data() {
        return {
            listaDeVenda: []
        };
    },
    mounted() {
        VendaService.listarVenda().then((res) => {
            this.tamanhoTotal = res.data;
            this.listaDeVenda = res.data.vendas;
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
                        <span class="font-bold text-lg">Listagem de Vendas</span>
                    </div>
                </template>
                <Tabela :data="listaDeVenda">
                    <template #conteudo>
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
                    </template>
                </Tabela>
            </Fieldset>
        </template>
    </Card>
</template>
<style></style>
