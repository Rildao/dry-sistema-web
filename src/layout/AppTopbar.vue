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
                    this.$toast.add({ severity: 'warn', summary: 'Notificações', detail: `${this.quantidadeNotificacoes} não lidas!` });
                }
            });
        },
        redirectNotificacoes() {
            this.$router.push('/notificacoes');
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
</template>
