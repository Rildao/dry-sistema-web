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
        <div class="card flex justify-content-center">
          <form @submit="onSubmit" class="flex flex-column gap-2">
            <span class="p-float-label">
              <InputText id="nome" v-model="nome" type="text" :class="{ 'p-invalid': errorMessage }"
                aria-describedby="text-error" />
              <label for="nome">Nome</label>
            </span>
            <small class="p-error" id="text-error">{{ errorMessage || '&nbsp;' }}</small>
            <span class="p-float-label">
              <InputText id="cpf" v-model="cpf" type="text" :class="{ 'p-invalid': errorMessage }"
                aria-describedby="text-error" />
              <label for="cpf">CPF</label>
            </span>
            <small class="p-error" id="text-error">{{ errorMessage || '&nbsp;' }}</small>
            <span class="p-float-label">
              <InputText id="telefone" v-model="telefone" type="text" :class="{ 'p-invalid': errorMessage }"
                aria-describedby="text-error" />
              <label for="telefone">Telefone</label>
            </span>
            <small class="p-error" id="text-error">{{ errorMessage || '&nbsp;' }}</small>
            <span class="p-float-label">
              <InputText id="endereco" v-model="endereco" type="text" :class="{ 'p-invalid': errorMessage }"
                aria-describedby="text-error" />
              <label for="endereco">Endereço</label>
            </span>
            <small class="p-error" id="text-error">{{ errorMessage || '&nbsp;' }}</small>
          </form>
          <Toast />
        </div>
      </Fieldset>
    </template>
  </Card>
</template>
<script>
export default {
  data() {
    return {
      nome: null,
      telefone: null,
      endereco: null,
      cpf: null,
    }
  }
}
</script>