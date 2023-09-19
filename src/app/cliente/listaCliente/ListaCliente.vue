<script>
import { ClienteService } from '@/service';

export default {
    components: {},
    data() {
        return {
            listaDeCliente: [],
            clienteSelecionado: null,
            linha: 5
        };
    },
    mounted() {
        ClienteService.listarCliente().then((res) => {
            console.log(res);
            this.tamanhoTotal = res.dat
            this.listaDeCliente = res.data.clientes;
        });
    },
    methods: {
        maskTelefone(telefone) {
            telefone = telefone.replace(/[^\d]/g, '');
            return telefone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
        },
        maskCPF(cpf) {
            cpf = cpf.replace(/[^\d]/g, '');
            return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
        }
    },
    watch: {
        clienteSelecionado() {
            let route = this.$router.resolve(`/clientes/editar-cliente/${this.clienteSelecionado.id}`);
            window.open(route.href, '_blank');
        },
        pesquisa(){
          ClienteService.listarCliente(this.pesquisa).then((res) => {
            this.listaDeCliente = res.data.clientes
          })
        }
    }
};
</script>
<template>
    <Card>
        <template #content>
            <Fieldset>
                <template #legend>
                    <div class="flex align-items-center text-primary">
                        <span class="pi pi-users mr-2"></span>
                        <span class="font-bold text-lg">Listagem de Clientes</span>
                    </div>
                </template>
                <DataTable v-model:selection="clienteSelecionado"  paginator :rows="5" :rowsPerPageOptions="[5,10,15]" :value="listaDeCliente" selectionMode="single" dataKey="id" :metaKeySelection="true">
                    <template #header >
                        <div class="table-header flex flex-column md:flex-row justify-content-between">
                            <span class="p-input-icon-left">
                                <i class="pi pi-search" />
                                <InputText v-model="pesquisa" placeholder="Pesquisar..." />
                            </span>
                        </div>
                    </template>
                    <Column bodyClass="pointer" field="nome" header="Nome" sortable> </Column>
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
        </template>
    </Card>
</template>
<style>
.acao-butoes {
    padding: 15px;
}
.pointer {
    cursor: pointer;
}
</style>
