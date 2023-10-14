<script>
import { DashboardService } from '@/service';

export default {
    data() {
        return {
            isHovered: false,
            isHovered1: false,
            painelAdministrativo: {
                totalClientes: '',
                totalVendas: '',
                totalValorCrediario: '',
                totalValorPix: '',
                totalValorCartao: '',
                totalValorDinheiro: ''
            },
            products: {
                value: null
            },
            lineOptionsFaturado: null,
            lineDataFaturado: {
                labels: [],
                datasets: [
                    {
                        label: 'Crediário',
                        data: [],
                        fill: false,
                        backgroundColor: 'rgba(0, 128, 0, 0.6)',
                        borderColor: 'rgba(0, 128, 0, 1)',
                        tension: 0.4
                    },
                    {
                        label: 'Cartão de Crédito',
                        data: [],
                        fill: false,
                        backgroundColor: 'rgba(0, 192, 0, 0.6)',
                        borderColor: 'rgba(0, 192, 0, 1)',
                        tension: 0.4
                    },
                    {
                        label: 'Pix',
                        data: [],
                        fill: false,
                        backgroundColor: 'rgba(0, 255, 0, 0.6)',
                        borderColor: 'rgba(0, 255, 0, 1)',
                        tension: 0.4
                    },
                    {
                        label: 'Dinheiro',
                        data: [],
                        fill: false,
                        backgroundColor: 'rgba(128, 255, 128, 0.6)',
                        borderColor: 'rgba(128, 255, 128, 1)',
                        tension: 0.4
                    }
                ]
            },
            lineOptionsVenda: null,
            lineDataVenda: {
                labels: [],
                datasets: [
                    {
                        label: 'Crediário',
                        data: [],
                        fill: false,
                        backgroundColor: 'rgba(54, 162, 235, 0.6)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        tension: 0.4
                    },
                    {
                        label: 'Cartão de Crédito',
                        data: [],
                        fill: false,
                        backgroundColor: 'rgba(0, 102, 204, 0.6)',
                        borderColor: 'rgba(0, 102, 204, 1)',
                        tension: 0.4
                    },
                    {
                        label: 'Pix',
                        data: [],
                        fill: false,
                        backgroundColor: 'rgba(0, 128, 255, 0.6)',
                        borderColor: 'rgba(0, 128, 255, 1)',
                        tension: 0.4
                    },
                    {
                        label: 'Dinheiro',
                        data: [],
                        fill: false,
                        backgroundColor: 'rgba(0, 76, 153, 0.6)',
                        borderColor: 'rgba(0, 76, 153, 1)',
                        tension: 0.4
                    }
                ]
            }
        };
    },
    mounted() {
        this.buscarPainelAdministrativo();
    },
    methods: {
        buscarPainelAdministrativo() {
            this.$store.dispatch('addRequest');
            DashboardService.buscarPainelAdministrativo()
                .then((res) => {
                    this.painelAdministrativo = res.data;
                    this.montarVendas(res.data.indicadoresVendasPorMes);
                    this.montarFaturamento(res.data.indicadoresTotalFaturadoPorMes);
                })
                .finally(() => {
                    this.$store.dispatch('removeRequest');
                });
        },
        montarVendas(vendasPorMes) {
            const labels = [];
            const dadosCrediario = [];
            const dadosCartaoCredito = [];
            const dadosPix = [];
            const dadosDinheiro = [];

            vendasPorMes.indicadorValorCrediarioPorMes.forEach((indicador) => {
                const nomeMes = this.formatarMes(indicador.mes);
                labels.push(`${nomeMes} - ${indicador.ano}`);

                dadosCrediario.push(indicador.total);
            });

            vendasPorMes.indicadorValorCartaoDeCreditoPorMes.forEach((indicador) => {
                dadosCartaoCredito.push(indicador.total);
            });

            vendasPorMes.indicadorValorPorMesPixPorMes.forEach((indicador) => {
                dadosPix.push(indicador.total);
            });

            vendasPorMes.indicadorValorDinheiroPorMes.forEach((indicador) => {
                dadosDinheiro.push(indicador.total);
            });

            this.lineDataVenda.labels = labels;
            this.lineDataVenda.datasets[0].data = dadosCrediario;
            this.lineDataVenda.datasets[1].data = dadosCartaoCredito;
            this.lineDataVenda.datasets[2].data = dadosPix;
            this.lineDataVenda.datasets[3].data = dadosDinheiro;
        },
        montarFaturamento(faturamentoPorMes) {
            const labels = [];
            const dadosCrediario = [];
            const dadosCartaoCredito = [];
            const dadosPix = [];
            const dadosDinheiro = [];

            faturamentoPorMes.indicadorValorCrediarioPorMes.forEach((indicador) => {
                const nomeMes = this.formatarMes(indicador.mes);
                labels.push(`${nomeMes} - ${indicador.ano}`);

                dadosCrediario.push(indicador.total);
            });

            faturamentoPorMes.indicadorValorCartaoDeCreditoPorMes.forEach((indicador) => {
                dadosCartaoCredito.push(indicador.total);
            });

            faturamentoPorMes.indicadorValorPorMesPixPorMes.forEach((indicador) => {
                dadosPix.push(indicador.total);
            });

            faturamentoPorMes.indicadorValorDinheiroPorMes.forEach((indicador) => {
                dadosDinheiro.push(indicador.total);
            });

            this.lineDataFaturado.labels = labels;
            this.lineDataFaturado.datasets[0].data = dadosCrediario;
            this.lineDataFaturado.datasets[1].data = dadosCartaoCredito;
            this.lineDataFaturado.datasets[2].data = dadosPix;
            this.lineDataFaturado.datasets[3].data = dadosDinheiro;
        },
        formatarMes(mes) {
            switch (mes) {
                case 1:
                    return 'JAN';
                case 2:
                    return 'FEV';
                case 3:
                    return 'MAR';
                case 4:
                    return 'ABRIL';
                case 5:
                    return 'MAIO';
                case 6:
                    return 'JUNHO';
                case 7:
                    return 'JULHO';
                case 8:
                    return 'AGOS';
                case 9:
                    return 'SET';
                case 10:
                    return 'OUT';
                case 11:
                    return 'NOV';
                case 12:
                    return 'DEZ';
                default:
                    return '';
            }
        },
        redirectVendas() {
            this.$router.push('/vendas');
        },
        redirectClientes() {
            this.$router.push('/clientes');
        },
        mouseOver() {
            this.isHovered = true;
        },
        mouseLeave() {
            this.isHovered = false;
        },
        mouseOver1() {
            this.isHovered1 = true;
        },
        mouseLeave1() {
            this.isHovered1 = false;
        }
    }
};
</script>

<template>
    <div class="grid">
        <div class="col-12 xl:col-4">
            <div class="card mb-0 div-clicavel" @mouseover="mouseOver" @mouseleave="mouseLeave" :class="{ 'dark-overlay': isHovered }" @click="redirectVendas">
                <div class="flex justify-content-between mb-3">
                    <div>
                        <span class="block text-500 font-medium mb-3">Vendas</span>
                        <div class="text-900 font-medium text-xl" v-if="painelAdministrativo.totalVendas === '0' ? true : '' || painelAdministrativo.totalVendas">
                            {{ painelAdministrativo.totalVendas }}
                        </div>
                        <Skeleton width="5rem" class="mb-2" v-else></Skeleton>
                    </div>
                    <div class="flex align-items-center justify-content-center bg-blue-100 border-round" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-shopping-cart text-blue-500 text-xl"></i>
                    </div>
                </div>
                <span class="text-500">Total de vendas</span>
            </div>
        </div>
        <div class="col-12 xl:col-4">
            <div class="card mb-0 div-clicavel" @mouseover="mouseOver1" @mouseleave="mouseLeave1" :class="{ 'dark-overlay': isHovered1 }" @click="redirectClientes">
                <div class="flex justify-content-between mb-3">
                    <div>
                        <span class="block text-500 font-medium mb-3">Clientes</span>
                        <div class="text-900 font-medium text-xl" v-if="painelAdministrativo.totalClientes === '0' ? true : '' || painelAdministrativo.totalClientes">
                            {{ painelAdministrativo.totalClientes }}
                        </div>
                        <Skeleton width="5rem" class="mb-2" v-else></Skeleton>
                    </div>
                    <div class="flex align-items-center justify-content-center bg-purple-100 border-round" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-users text-purple-500 text-xl"></i>
                    </div>
                </div>
                <span class="text-500">Total de Clientes</span>
            </div>
        </div>
        <div class="col-12 xl:col-4">
            <div class="card mb-0">
                <div class="flex justify-content-between mb-3">
                    <div>
                        <span class="block text-500 font-medium mb-3">Faturamento</span>
                        <div class="text-900 font-medium text-xl" v-if="painelAdministrativo.totalValorFaturado === '0' ? true : '' || painelAdministrativo.totalValorFaturado">
                            {{ $formatarValorReal(painelAdministrativo.totalValorFaturado) }}
                        </div>
                        <Skeleton width="5rem" class="mb-2" v-else></Skeleton>
                    </div>
                    <div class="flex align-items-center justify-content-center bg-green-100 border-round" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-dollar text-green-500 text-xl"></i>
                    </div>
                </div>
                <span class="text-500">Valor total faturado</span>
            </div>
        </div>

        <div class="col-12 xl:col-6">
            <div class="card">
                <h5>Vendas Por Mês</h5>
                <Chart type="bar" :data="lineDataVenda" :options="lineOptionsVenda" />
            </div>
        </div>

        <div class="col-12 xl:col-6">
            <div class="card">
                <h5>Faturamento Por Mês</h5>
                <Chart type="bar" :data="lineDataFaturado" :options="lineOptionsFaturado" />
            </div>
        </div>
    </div>
</template>

<style scoped>
.div-clicavel {
    cursor: pointer;
}
.dark-overlay {
    background-color: rgba(185, 215, 245, 0.01);
    cursor: pointer;
    transition: background-color 0.2s ease-in-out;
}
</style>
