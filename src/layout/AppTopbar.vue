<script>
import { axiosJwt } from '@/service/axiosJwt';
import { useLayout } from '@/layout/composables/layout';
const { onMenuToggle } = useLayout();
import { apiUrl, NotificacaoService } from '@/service';
import { EventBus } from '@/service/EventBus';

export default {
    data() {
        return {
            outsideClickListener: { value: null },
            topbarMenuActive: { value: false },
            quantidadeNotificacoes: 0,
            openModal: false,
            items: [
                // {
                //     label: 'Opções',
                //     items: [
                //         {
                //             label: 'Configurações',
                //             icon: 'pi pi-cog'
                //         },
                //         { separator: true }
                //     ]
                // }
            ]
        };
    },
    mounted() {
        this.bindOutsideClickListener();
        this.buscarQuantidadeNotificacoesNaoLidas();
    },
    created() {
        EventBus.on('notificacao', () => {
            this.atualizarQuantidadeNotificacoes().then(({ data }) => {
                this.quantidadeNotificacoes = data;
            });
        });
    },
    beforeMount() {
        this.unbindOutsideClickListener();
    },
    computed: {
        topbarMenuClasses() {
            return { 'layout-topbar-menu-mobile-active': this.topbarMenuActive.value };
        }
    },
    methods: {
        logout() {
            this.$store.dispatch('addRequest');
            axiosJwt.post(apiUrl + '/api/usuario/logout').then(() => {
                this.$router.push('/login');
                localStorage.removeItem('token');
            });
            this.$store.dispatch('removeRequest');
        },

        onTopBarMenuButton() {
            this.topbarMenuActive.value = !this.topbarMenuActive.value;
        },
        onMenuToggle() {
            onMenuToggle();
        },
        bindOutsideClickListener() {
            if (!this.outsideClickListener.value) {
                this.outsideClickListener.value = (event) => {
                    if (this.isOutsideClicked(event)) {
                        this.topbarMenuActive.value = false;
                    }
                };
                document.addEventListener('click', this.outsideClickListener.value);
            }
        },
        unbindOutsideClickListener() {
            if (this.outsideClickListener.value) {
                document.removeEventListener('click', this.outsideClickListener);
                this.outsideClickListener.value = null;
            }
        },
        isOutsideClicked(event) {
            if (!this.topbarMenuActive.value) return;

            const sidebarEl = document.querySelector('.layout-topbar-menu');
            const topbarEl = document.querySelector('.layout-topbar-menu-button');

            return !(sidebarEl.isSameNode(event.target) || sidebarEl.contains(event.target) || topbarEl.isSameNode(event.target) || topbarEl.contains(event.target));
        },
        toggle(event) {
            this.$refs.menu.toggle(event);
        },

        atualizarQuantidadeNotificacoes() {
            return NotificacaoService.buscarQuantidadeNotificacoesNaoLidas();
        },

        buscarQuantidadeNotificacoesNaoLidas() {
            this.atualizarQuantidadeNotificacoes().then(({ data }) => {
                this.quantidadeNotificacoes = data;
                if (this.quantidadeNotificacoes > 0) {
                    this.openModal = true;
                }
            });
        },
        redirectNotificacoes() {
            this.openModal = false;
            this.$router.push('/notificacoes');
        },
        fecharModal() {
            this.openModal = false;
        },
        textoAlerta() {
            return this.quantidadeNotificacoes > 1 ? 'novas notificações não lidas' : 'nova notificação não lida';
        }
    }
};
</script>

<template>
    <div class="layout-topbar">
        <button class="p-link layout-menu-button layout-topbar-button" @click="onMenuToggle()">
            <i class="pi pi-bars"></i>
        </button>

        <button class="p-link layout-topbar-menu-button layout-topbar-button" @click="onTopBarMenuButton()">
            <i class="pi pi-ellipsis-v"></i>
        </button>

        <div class="layout-topbar-menu" :class="topbarMenuClasses">
            <Button @click="redirectNotificacoes()" class="p-link layout-topbar-button" v-tooltip.bottom="'Notificação'">
                <i v-badge="quantidadeNotificacoes" class="pi pi-bell p-overlay-badge" />
                <span class="span">Notificação</span>
            </Button>

            <Button @click="logout()" class="p-link layout-topbar-button" v-tooltip.bottom="'Sair'">
                <i class="pi pi-sign-out" />
                <span class="span">Sair</span>
            </Button>
        </div>
    </div>
    <Dialog v-model:visible="openModal" modal :header="Notificacao"  :style="{ width: '50%' }" :closable="false"  >
          <div class="text-center">
            <i class="pi pi-exclamation-triangle text-orange-400 text-7xl"></i>
            <div class="font-bold text-xl my-3">
            Você possui '<b class="font-bold text-primary">{{ quantidadeNotificacoes }}</b
            >' {{ textoAlerta() }}. Deseja ir para a tela de notificações?
            </div>
          </div>
      <template #footer>
        <div class="flex justify-content-between xl:justify-content-end">
          <Button label="Não" @click="fecharModal()" text/>
          <Button label="Sim" @click="redirectNotificacoes()" autofoucus  />
        </div>
      </template>

    </Dialog>
</template>
