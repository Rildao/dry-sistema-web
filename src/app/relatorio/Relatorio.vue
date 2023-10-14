<script>
export default {
    data() {
        return {
            modal: false,
            relatorios: [
                {
                    id: 1,
                    mes: 'Abril',
                    qtdVendas: 1,
                    valorTotal: 49.0
                },
                {
                    id: 2,
                    mes: 'Maio',
                    qtdVendas: 1,
                    valorTotal: 49.0
                }
            ],
            dataInicio: null,
            dataFim: null
        };
    },
    methods: {
        _titulo() {
            return `Relatorio-${this.$formatarData(new Date(), 'DD/MM/YYYY')}`;
        },
        gerarPDF() {
            const divParaPDF = document.getElementById('relatorio');
            const janelaDeImpressao = window.open('', '', 'width=800,height=600');

            janelaDeImpressao.document.open();
            janelaDeImpressao.document.write(`
                <html>
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <link id="theme-css" rel="stylesheet" type="text/css" href="/themes/lara-light-indigo/theme.css">
                    <link rel="stylesheet" type="text/css" href="/node_modules/primeflex/primeflex.css">
                    <link rel="stylesheet" type="text/css" href="/node_modules/primevue/resources/primevue.min.css'">
                    <style>
                        * {
                            box-sizing: border-box;
                        }

                        html {
                            height: 100%;
                            font-size: $scale;
                        }
                        
                        body {
                            font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI;
                            color: #495057;
                            background-color: #eff3f8;
                            margin: 0;
                            padding: 0;
                            min-height: 100%;
                            -webkit-font-smoothing: antialiased;
                            -moz-osx-font-smoothing: grayscale;
                        }
                        
                        a {
                            text-decoration: none;
                        }
                        
                        .layout-wrapper {
                            min-height: 100vh;
                        }

                    </style>
                    <title>${this._titulo()}</title>
                </head>
                <body>
                    ${divParaPDF.innerHTML}
                </body>
                </html>
            `);
            janelaDeImpressao.document.close();

            setTimeout(function () {
                janelaDeImpressao.print();
                janelaDeImpressao.close();
            }, 1000);
        },
        abrirModal() {
            this.modal = true;
        },
        fecharModal() {
            this.modal = false;
        },
        valorTotal() {
            return this.relatorios.reduce((total, relatorio) => total + relatorio.valorTotal, 0);
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
                    <span class="font-bold text-lg">Gerar Relatório</span>
                </div>
            </template>
            <div class="formgrid grid">
                <div class="field col-12 lg:col-5 md:col-5">
                    <label for="dataInicio">
                        Data Inicial
                        <i class="pi pi-info-circle" v-tooltip="'Início do mês de referência da fatura.'" style="color: slateblue"></i>
                    </label>
                    <Calendar id="dataInicio" v-model="dataInicio" class="w-full" showIcon placeholder="dd/mm/aaaa" dateFormat="dd/mm/yy" />
                </div>

                <div class="field col-12 lg:col-5 md:col-5">
                    <label for="dataFim">
                        Data Final
                        <i class="pi pi-info-circle" v-tooltip="'Fim do mês de referência da fatura.'" style="color: slateblue"></i>
                    </label>
                    <Calendar id="dataFim" v-model="dataFim" class="w-full" showIcon placeholder="dd/mm/aaaa" dateFormat="dd/mm/yy" />
                </div>

                <div class="field col-12 lg:col-2 md:col-3 mt-4">
                    <Button class="w-full" @click="abrirModal()" icon="pi pi-search" label="Buscar" />
                </div>
            </div>
        </Fieldset>
    </div>
    <Dialog v-model:visible="modal" modal :header="_titulo()" :closable="true" :style="{ width: '85%' }">
        <template #legend>
            <div class="flex align-items-center text-primary">
                <span class="pi pi-shopping-cart mr-2"></span>
                <span class="font-bold text-lg">Dados da Venda</span>
            </div>
        </template>
        <div class="layout-content" id="relatorio">
            <div class="card py-8 px-6 md:px-8 overflow-auto">
                <div class="flex flex-row align-items-start justify-content-between md:flex-row md:align-items-center md:justify-content-between border-bottom-1 surface-border pb-5 min-w-max">
                    <div class="flex flex-column">
                        <img src="/demo/images/login/login.png" alt="dry-logo" width="80" height="82" viewBox="0 0 80 82" />
                        <div class="my-3 text-4xl font-bold text-900">DRY LAND'S MODAS</div>
                        <!-- <span class="mb-2">9137 3rd Lane California City</span><span>CA 93504, U.S.A.</span> -->
                    </div>
                    <div class="flex flex-column mt-5 md:mt-0">
                        <div class="text-2xl font-semibold text-left md:text-right mb-3">FATURA</div>
                        <div class="flex flex-column">
                            <div class="flex justify-content-between align-items-center mb-2">
                                <span class="font-semibold mr-6">DATA</span><span>{{ $formatarData(new Date(), 'DD/MM/YYYY') }}</span>
                            </div>
                            <div class="flex justify-content-between align-items-center mb-2">
                                <span class="font-semibold mr-6">FATURA #</span><span>{{ 'F.' + new Date().getFullYear() + '-' + new Date().getMonth() }}</span>
                            </div>
                            <div class="flex justify-content-between align-items-center"><span class="font-semibold mr-6">CLIENTE ID</span><span>0001</span></div>
                        </div>
                    </div>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full" style="border-collapse: collapse; table-layout: auto">
                        <thead>
                            <tr>
                                <th class="text-left font-semibold py-3 border-bottom-1 surface-border white-space-nowrap">Mês</th>
                                <th class="text-right font-semibold py-3 border-bottom-1 surface-border white-space-nowrap px-3">Qtd. Vendas</th>
                                <th class="text-right font-semibold py-3 border-bottom-1 surface-border white-space-nowrap">Valor Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="relatorio in relatorios" :key="relatorio.id">
                                <td class="text-left py-3 border-bottom-1 surface-border white-space-nowrap">{{ relatorio.mes }}</td>
                                <td class="text-right py-3 border-bottom-1 surface-border px-3">{{ relatorio.qtdVendas }}</td>
                                <td class="text-right py-3 border-bottom-1 surface-border">{{ $formatarValorReal(relatorio.valorTotal) }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="flex flex-column md:flex-row md:align-items-start md:justify-content-between mt-8">
                    <div class="font-semibold mb-3 md:mb-0">NOTAS</div>
                    <div class="flex flex-column">
                        <div class="flex justify-content-between align-items-center">
                            <span class="font-semibold mr-6">TOTAL</span><span>{{ $formatarValorReal(valorTotal()) }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <br />
        <div class="flex justify-content-end">
            <Button label="Imprimir" icon="pi pi-print" @click="gerarPDF()" v-tooltip="'Imprimir Relatório'" autofocus />
        </div>
    </Dialog>
</template>

<style></style>
