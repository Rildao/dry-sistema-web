<script>
import useVuelidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { ClienteService } from "@/app/cliente/service";

export default {
  data() {
    return {
      nome: null,
      telefone: null,
      endereco: null,
      cpf: null
    };
  },
  setup() {
    return { v$: useVuelidate() };
  },
  validations() {
    return {
      nome: { required }
    };
  },
  methods: {
    cadastrar() {
      this.v$.$touch();
      if (this.v$.$invalid) return;
      this.$store.dispatch("addRequest");
      this.criarCliente();
    },
    criarCliente() {
      const cliente = {
        nome: this.nome,
        telefone: this.telefone,
        endereco: this.endereco,
        cpf: this.cpf
      };
      ClienteService
        .criarCliente(cliente)
        .then((res) => {
          if (res.data.accessToken != null) {
            localStorage.setItem("token", res.data.accessToken);
            this.$router.push("/");
          }
          this.$store.dispatch("removeRequest");
        })
        .catch((erro) => {
          this.$toast.add({
            severity: "error",
            summary: "Error",
            detail: `${erro.response.data.descricao}`,
            life: 3000
          });
          this.$store.dispatch("removeRequest");
        });
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
            <span class="pi pi-user mr-2"></span>
            <span class="font-bold text-lg">Cadastrar cliente</span>
          </div>
        </template>
        <div class="formgrid grid">
          <div class="field col-12 lg:col-9 md:col-9  ">
            <label for="nome">Nome*</label>
            <InputText id="nome" @input="v$.nome.$touch()" class="w-full" v-model="nome" type="text" />
            <small class="p-error mb-3" v-if="v$.nome.$error">Nome é obrigatório</small>
          </div>
          <div class="field col-12 lg:col-3 md:col-3">
            <label for="cpf">CPF</label>
            <InputMask id="cpf" class="w-full" v-model="cpf" type="text" mask="999.999.999-99"
                       placeholder="999.999.999-99" :class="{ 'p-invalid': errorMessage }"
                       aria-describedby="text-error" />
          </div>
          <div class="field col-12 lg:col-3 md:col-3">
            <label for="telefone">Telefone</label>
            <InputMask id="telefone" class="w-full" v-model="telefone" type="text" mask="(99) 99999-9999"
                       placeholder="(99) 99999-9999" :class="{ 'p-invalid': errorMessage }"
                       aria-describedby="text-error" />
          </div>
          <div class="field col-12 lg:col-9  md:col-9">
            <label for="endereco">Endereço</label>
            <InputText id="endereco" class="w-full" v-model="endereco" type="text" :class="{ 'p-invalid': errorMessage }"
                       aria-describedby="text-error" />
          </div>
          <div class="field col-12 lg:col-offset-10 md:col-offset-10 mt-4">
            <Button label="Primary" class="w-full lg:w-14rem md:w-14rem justify-content-center" type="submit"
                    @click="cadastrar()">Cadastrar
            </Button>
          </div>
        </div>
        <Toast />
      </Fieldset>
    </template>
  </Card>
</template>
