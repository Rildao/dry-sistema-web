<script>
import { NotificacaoService } from '@/service';
import { EventBus } from '@/service/EventBus';

export default {
    data() {
        return {
            novasSelecionada: true,
            vistasSelecionada: false,
            notificacoes: [],
            notificacoesVistas: [],
            notificacaoSelecionada: null,
            quantidadeNaoVistas: 0,
            quantidadeVistas: 0
        };
    },
    mounted() {
        Promise.all([this.buscarNotificacoesNovas, this.buscarNotificacoesVistas]);
    },
    methods: {
        marcarComoVisto(notificacao) {
            NotificacaoService.marcarComoLida(notificacao.id).then(() => {
                this.buscarNotificacoesNovas();
                this.buscarNotificacoesVistas();
                EventBus.emit('notificacao');
            });
        },

        novas() {
            this.novasSelecionada = true;
            this.vistasSelecionada = false;
            this.buscarNotificacoesNovas();
        },

        vistas() {
            this.vistasSelecionada = true;
            this.novasSelecionada = false;
            this.buscarNotificacoesVistas();
        },

        buscarNotificacoesVistas() {
            this.$store.dispatch('addRequest');
            NotificacaoService.listarNotificacao('', 10, 0, true)
                .then(({ data }) => {
                    this.notificacoesVistas = data.notificacoes;
                    this.quantidadeVistas = data.totalElements;
                })
                .finally(() => {
                    this.$store.dispatch('removeRequest');
                });
        },

        buscarNotificacoesNovas() {
            this.$store.dispatch('addRequest');

            NotificacaoService.listarNotificacao()
                .then(({ data }) => {
                    this.notificacoes = data.notificacoes;
                    this.quantidadeNaoVistas = data.totalElements;
                })
                .finally(() => {
                    this.$store.dispatch('removeRequest');
                });
        }
    }
};
</script>

<template>
    <div class="card">
        <Fieldset>
            <template #legend>
                <div class="flex align-items-center text-primary">
                    <span class="pi pi-bell mr-2"></span>
                    <span class="font-bold text-lg">Notificações</span>
                </div>
            </template>
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
                    ><span class="ml-auto text-sm font-semibold bg-primary-50 text-primary-900 px-2 py-1 hidden md:inline text-center" style="border-radius: 2rem; width: 23px; height: 23px">{{ quantidadeNaoVistas }}</span>
                    </li>
                    <li
                        :class="`cursor-pointer select-none p-3 transition-duration-150 border-round flex align-items-center justify-content-center md:justify-content-start md:flex-1 flex-auto ${
                                    vistasSelecionada ? 'bg-primary' : 'hover:surface-hover'
                                }`"
                        @click="vistas()"
                    >
                      <i :class="`md:mr-3 text-600 transition-duration-150 text-lg pi pi-bookmark ${vistasSelecionada ? ' text-primary-50' : ''}`"></i
                      ><span :class="`text-900 font-medium hidden md:inline ${vistasSelecionada ? ' text-primary-50' : ''}`">Vistas</span
                    ><span class="ml-auto text-sm font-semibold bg-primary-50 text-primary-900 px-2 py-1 hidden md:inline text-center" style="border-radius: 2rem; width: 23px; height: 23px">{{ quantidadeVistas }}</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div class="w-full md:w-9 xl:w-10 xl:p-3">
                <DataTable v-model:selection="notificacaoSelecionada" paginator :rows="5" :rowsPerPageOptions="[5, 10, 15]" :value="novasSelecionada ? notificacoes : notificacoesVistas" dataKey="id" tableStyle="min-width: 50%">
                  <Column headerStyle="width: 5rem; text-align: center" bodyStyle="text-align: center; overflow: visible">
                    <template #body="{ data }">
                      <Button v-if="novasSelecionada" type="button" text rounded icon="pi pi-bookmark" @click="marcarComoVisto(data)" v-tooltip.bottom="'Marcar como visto'" />
                    </template>
                  </Column>
                  <Column field="mensagem" :class="`${novasSelecionada ? 'font-bold' : ''}`"></Column>
                </DataTable>
              </div>
            </div>
        </Fieldset>
    </div>
</template>
