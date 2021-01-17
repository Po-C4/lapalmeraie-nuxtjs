<template>
  <div class="bg-dark text-white">
    <AppHeader
      background="bg-boutique"
      title="Nous soutenir"
      subtitle="Toutes contributions supérieures à 10€ vous donneront accès au grade donateur !"
    />

    <b-container class="mt-5">
      <b-form ref="form">
        <b-row align-h="center">
          <b-col lg="6">
            <label for="username">
              Pseudo Minecraft <span class="is-required">*</span>
            </label>
            <b-input
              ref="username"
              v-model="username"
              type="text"
              :state="usernameState"
              :debounce="300"
              @update="testUsername"
            />
            <b-form-text>
              Assurez vous de bien entrer votre pseudo ! Ou laissez vide pour
              nous soutenir anonymement
            </b-form-text>
          </b-col>
        </b-row>
        <b-row align-h="center" class="mt-4">
          <b-col lg="6">
            <label for="amount" class="w-100">
              Montant <span class="is-required">*</span>
            </label>
            <InputSpinner
              v-model="amount"
              :max="500"
              :min="1"
              :default-value="1"
            />
          </b-col>
        </b-row>
        <b-row align-h="center" class="mt-5">
          <b-col lg="7">
            <PaypalCheckout
              :client-id="$config.paypalKey"
              :username="username"
              :amount="amount.toString()"
            />
          </b-col>
        </b-row>
      </b-form>
    </b-container>

    <b-modal
      v-model="anonymousModal"
      title="Soutiens Anonyme"
      header-bg-variant="danger"
      header-text-variant="light"
      centered
    >
      Êtes-vous sûr de vouloir nous soutenir anonymement ? Vous ne receverez pas
      le grade donateur dans le cas d'une donation supérieure à 10€.
    </b-modal>
  </div>
</template>

<script>
export default {
  name: 'Boutique',
  data() {
    return {
      anonymousModal: false,
      username: '',
      usernameRegex: /^[a-zA-Z0-9_]{1,16}$/,
      usernameState: null,
      amount: 1,
    };
  },
  methods: {
    testUsername() {
      this.usernameState =
        this.username === '' ? null : this.usernameRegex.test(this.username);
      return this.usernameState;
    },
  },
};
</script>

<style scoped>
.form-control {
  background-color: var(--dark) !important;
  color: var(--primary) !important;
  border: 1px solid var(--primary);
}

.is-valid {
  border: 1px solid var(--success);
  color: var(--success) !important;
}

.is-invalid {
  border: 1px solid var(--danger);
  color: var(--danger) !important;
}

.is-required {
  font-weight: bold;
  color: var(--danger);
}
</style>
