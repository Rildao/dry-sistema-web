<script>
import useVuelidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";

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
      nome: { required },
      cpf: { required },
      telefone: { required },
      endereco: { required }
    };
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
            <InputText id="nome" class="w-full" v-model="nome" type="text" />
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
            <InputText id="endereco" class="w-full" v-model="cpf" type="text" :class="{ 'p-invalid': errorMessage }"
                       aria-describedby="text-error" />
          </div>
          <div class="field col-12 lg:col-offset-10 md:col-offset-10 mt-4">
            <Button label="Primary" class="w-full lg:w-14rem md:w-14rem justify-content-center" type="submit"
                    @click="salvarCliente()">Cadastrar
            </Button>
          </div>
        </div>
        <Toast />
      </Fieldset>
    </template>
  </Card>
</template>
