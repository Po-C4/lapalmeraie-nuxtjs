<template>
  <div class="bg-dark text-white">
    <AppHeader
      background="bg-support"
      title="Nous Soutenir"
      subtitle="Toutes contributions supérieures à 10€ vous donneront accès au grade donateur !"
    />

    <b-container class="mt-5">
      <b-row align-h="center">
        <b-col lg="7">
          <p>
            Pour obtenir le grade donateur une contribution supérieure à 10€
            doit être faite. Tous vos dons permettront à La Palmeraie de se
            développer, en finançant l'hébergement, les plugins, et toute
            l'administration de l'association.
          </p>
          <p>
            Pour plus d'informations sur les bénéfices que donne le grade
            donateur, nous vous invitons à vous renseigner
            <nuxt-link to="/tutoriel#5--le-grade-donateur">ici</nuxt-link>.
          </p>
        </b-col>
      </b-row>

      <b-form ref="form" class="mt-4">
        <b-row align-h="center">
          <b-col lg="6">
            <label for="username">
              Pseudo Minecraft
              <span v-if="!anonymous" class="is-required">*</span>
            </label>
            <b-input
              id="username"
              ref="username"
              v-model="username"
              type="text"
              :state="usernameState && !usernameUnknown"
              :debounce="300"
              :disabled="anonymous"
              @update="testUsername"
            />
            <b-form-text v-if="usernameUnknown" text-variant="danger">
              Le joueur que vous avez entré n'est pas whitelisté sur le serveur
            </b-form-text>
            <b-form-text
              v-else-if="usernameState !== null && !usernameState"
              text-variant="danger"
            >
              Un pseudo minecraft peut contenir jusqu'à 16 caractères
              alphanumériques et '_'.
            </b-form-text>
            <b-form-text v-else>
              Assurez vous de bien entrer votre pseudo !
            </b-form-text>
            <b-form-checkbox
              v-model="anonymous"
              class="mt-1"
              @input="updateAnonymous"
            >
              Faire une contribution anonyme
            </b-form-checkbox>
          </b-col>
        </b-row>
        <b-row align-h="center" class="mt-3">
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
              :anonymous="anonymous"
              :amount="amount.toString()"
              @click="validation"
              @error="error"
              @success="success"
            />
          </b-col>
        </b-row>
      </b-form>
    </b-container>

    <b-modal
      ref="anonymousModal"
      title="Contribution Anonyme"
      header-bg-variant="danger"
      header-text-variant="light"
      centered
      no-close-on-esc
      no-close-on-backdrop
      hide-header-close
      @cancel="anonymousCancel"
      @ok="anonymousContinue"
    >
      <template #default>
        Attention vous allez faire une contribution anonyme et vous ne receverez
        pas le grade donateur dans le cas d'une contribution supérieure à
        10€.<br />
        Êtes vous sûr de vouloir continuer ?
      </template>

      <template #modal-footer="{ cancel, ok }">
        <div>
          <b-button variant="outline-danger" @click="cancel()">
            Annuler
          </b-button>
          <b-button variant="success" @click="ok()">Continuer</b-button>
        </div>
      </template>
    </b-modal>

    <b-modal
      ref="errorModal"
      title="Une erreur s'est produite"
      header-bg-variant="danger"
      header-text-variant="light"
      hide-footer
      centered
    >
      <template #default>
        Une erreur s'est produite lors de la confirmation de votre paiement.
        Veuillez vous assurer de la validité de vos informations de paiement
        avant de réessayer.
      </template>
    </b-modal>

    <b-modal
      ref="successModal"
      title="Succès"
      header-bg-variant="success"
      header-text-variant="light"
      hide-footer
      centered
    >
      <template v-if="anonymous" #default>
        Votre paiement a été effectué avec succès.
      </template>
      <template v-else #default>
        Votre paiement a été effectué avec succès. Si votre donation était
        supérieure à 10€, votre grade donateur vous sera donné sous peu.
      </template>
    </b-modal>
  </div>
</template>

<script>
export default {
  name: 'PageSupport',
  data() {
    return {
      anonymous: false,
      anonymousConfirm: false,
      username: '',
      usernameRegex: /^[a-zA-Z0-9_]{1,16}$/,
      usernameState: null,
      usernameUnknown: false,
      amount: 1,
    };
  },
  methods: {
    testUsername() {
      this.usernameUnknown = false;
      this.usernameState =
        this.username === '' ? null : this.usernameRegex.test(this.username);
      return this.usernameState;
    },
    updateAnonymous(value) {
      if (this.anonymousConfirm === false && value === true) {
        this.$refs.anonymousModal.show();
      }
    },
    anonymousCancel() {
      this.anonymous = false;
    },
    anonymousContinue() {
      this.anonymous = true;
      this.anonymousConfirm = true;
    },
    async validation(resolve, reject) {
      if (this.username === '' && !this.anonymous) {
        reject();
        this.$refs.anonymousModal.show();
      } else if (!this.anonymous && !this.testUsername()) {
        reject();
      } else if (
        !this.anonymous &&
        (await this.$axios.$get(`/api/player/${this.username}`)).result !== true
      ) {
        reject();
        this.usernameUnknown = true;
      } else {
        resolve();
      }
    },
    error() {
      this.$refs.errorModal.show();
    },
    success() {
      this.$refs.successModal.show();
    },
  },
};
</script>

<style>
.custom-control-label::before {
  background-color: #272b30 !important;
  border: 0;
}
.custom-checkbox .custom-control-input:checked ~ .custom-control-label::after {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8' viewBox='0 0 8 8'%3e%3cpath fill='%23fa6c2c' d='M6.564.75l-3.59 3.612-1.538-1.55L0 4.26l2.974 2.99L8 2.193z'/%3e%3c/svg%3e");
}
</style>

<style scoped>
.form-control {
  background-color: #272b30 !important;
  color: var(--primary) !important;
  border: 0;
}

.form-control:disabled {
  background-color: #2f353a !important;
}

.is-valid {
  border: 0;
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
