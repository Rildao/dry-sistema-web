<script>
// import Construcao from '@/views/Construcao.vue';
export default {
    data() {
        return {
            novasSelecionada: true,
            vistasSelecionada: false,
            notificacoes: [
                {
                    id: 1,
                    cpf: '123.456.789-00',
                    nome: 'João da Silva',
                    email: ''
                }
            ],
            notificacaoSelecionada: null
        };
    },
    components: {
        // Construcao
    },
    methods: {
        novas() {
            this.novasSelecionada = true;
            this.vistasSelecionada = false;
            this.notificacoes = [
                {
                    id: 1,
                    cpf: '123.456.789-00',
                    nome: 'João da Silva',
                    email: ''
                }
            ];
        },
        vistas() {
            this.vistasSelecionada = true;
            this.novasSelecionada = false;
            this.notificacoes = [];
        }
    }
};
</script>

<template>
    <div class="card">
        <div class="flex flex-column md:flex-row gap-4">
            <div class="w-full md:w-3 xl:w-2 xl:p-3">
                <div class="overflow-auto">
                    <ul class="flex flex-row md:flex-column gap-1 md:gap-2 list-none m-0 p-0 overflow-auto">
                        <li
                            :class="`cursor-pointer select-none p-3 transition-duration-150 border-round flex align-items-center justify-content-center md:justify-content-start md:flex-1 flex-auto ${
                                novasSelecionada ? 'bg-primary' : 'hover:surface-hover'
                            }`"
                            @click="novas()"
                        >
                            <i :class="`md:mr-3 text-600 transition-duration-150 text-lg pi pi-inbox ${novasSelecionada ? ' text-primary-50' : ''}`"></i
                            ><span :class="`text-900 font-medium hidden md:inline ${novasSelecionada ? ' text-primary-50' : ''}`">Novas</span
                            ><span class="ml-auto text-sm font-semibold bg-primary-50 text-primary-900 px-2 py-1 hidden md:inline text-center" style="border-radius: 2rem; width: 23px; height: 23px">1</span>
                        </li>
                        <li
                            :class="`cursor-pointer select-none p-3 transition-duration-150 border-round flex align-items-center justify-content-center md:justify-content-start md:flex-1 flex-auto ${
                                vistasSelecionada ? 'bg-primary' : 'hover:surface-hover'
                            }`"
                            @click="vistas()"
                        >
                            <i :class="`md:mr-3 text-600 transition-duration-150 text-lg pi pi-eye ${vistasSelecionada ? ' text-primary-50' : ''}`"></i
                            ><span :class="`text-900 font-medium hidden md:inline ${vistasSelecionada ? ' text-primary-50' : ''}`">Vistas</span
                            ><span class="ml-auto text-sm font-semibold bg-primary-50 text-primary-900 px-2 py-1 hidden md:inline text-center" style="border-radius: 2rem; width: 23px; height: 23px">0</span>
                        </li>
                    </ul>
                </div>
            </div>

            <div class="md:w-9 xl:w-10 xl:p-3">
                <DataTable v-model:selection="notificacaoSelecionada" paginator :rows="5" :rowsPerPageOptions="[5, 10, 15]" :value="notificacoes" dataKey="id" tableStyle="min-width: 50rem">
                    <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
                    <Column field="cpf" class="font-bold"></Column>
                    <Column field="nome" class="font-bold"></Column>
                    <Column field="email" class="font-bold"></Column>
                </DataTable>
            </div>
        </div>
    </div>
</template>

<style></style>
