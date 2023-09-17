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
            lineOptions: null,
            lineData: {
                labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                datasets: [
                    {
                        label: 'First Dataset',
                        data: [65, 59, 80, 81, 56, 55, 40],
                        fill: false,
                        backgroundColor: '#2f4860',
                        borderColor: '#2f4860',
                        tension: 0.4
                    },

                    {
                        label: 'Second Dataset',
                        data: [28, 48, 40, 19, 86, 27, 90],
                        fill: false,
                        backgroundColor: '#3b82f6',
                        borderColor: '#3b82f6',
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
            DashboardService.buscarPainelAdministrativo().then((res) => {
                this.painelAdministrativo = res.data;
            });
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
        <div class="col-12 lg:col-8 xl:col-4">
            <div class="card mb-0 div-clicavel" @mouseover="mouseOver" @mouseleave="mouseLeave" :class="{ 'dark-overlay': isHovered }" @click="redirectVendas">
                <div class="flex justify-content-between mb-3">
                    <div>
                        <span class="block text-500 font-medium mb-3">Vendas</span>
                        <div class="text-900 font-medium text-xl" v-if="painelAdministrativo.totalVendas">
                            {{ painelAdministrativo.totalVendas }}
                        </div>
                        <Skeleton width="5rem" class="mb-2" v-else></Skeleton>
                    </div>
                    <div class="flex align-items-center justify-content-center bg-blue-100 border-round" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-shopping-cart text-blue-500 text-xl"></i>
                    </div>
                </div>
                <span class="text-500">Total de vendas no mês</span>
            </div>
        </div>
        <div class="col-12 lg:col-8 xl:col-4">
            <div class="card mb-0 div-clicavel" @mouseover="mouseOver1" @mouseleave="mouseLeave1" :class="{ 'dark-overlay': isHovered1 }" @click="redirectClientes">
                <div class="flex justify-content-between mb-3">
                    <div>
                        <span class="block text-500 font-medium mb-3">Clientes</span>
                        <div class="text-900 font-medium text-xl" v-if="painelAdministrativo.totalClientes">
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
        <div class="col-12 lg:col-8 xl:col-4">
            <div class="card mb-0">
                <div class="flex justify-content-between mb-3">
                    <div>
                        <span class="block text-500 font-medium mb-3">Valor Crediario</span>
                        <div class="text-900 font-medium text-xl" v-if="painelAdministrativo.totalValorCrediario == '0' ? true : '' || painelAdministrativo.totalValorCrediario">
                            {{ $formatarValorReal(painelAdministrativo.totalValorCrediario) }}
                        </div>
                        <Skeleton width="5rem" class="mb-2" v-else></Skeleton>
                    </div>
                    <div class="flex align-items-center justify-content-center bg-green-100 border-round" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-dollar text-green-500 text-xl"></i>
                    </div>
                </div>
                <span class="text-500">Valor total de vendas no crediario</span>
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
