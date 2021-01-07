<template>
  <b-container fluid class="bg px-0 text-white">
    <b-row class="bg-overlay">
      <b-col>
        <h1 class="display-3 w-100">
          Erreur {{ error.statusCode }}
        </h1>
        <p v-if="error.statusCode === 403" class="lead mt-3 w-100">
          L'accès à cette page n'est pas autorisé !
        </p>
        <p v-if="error.statusCode === 404" class="lead mt-3 w-100">
          La page demandée est introuvable
        </p>
        <p v-else class="lead mt-3 w-100">
          {{ error.message }}
        </p>
        <b-button variant="outline-light" to="/">
          Retourner à l'accueil
        </b-button>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {
  props: {
    error: {
      type: Object,
      default: null,
    },
  },
};
</script>

<style scoped>
.bg {
  height: 100vh;
  width: 100%;
  background-image: url('~assets/bg-error.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  padding: 0;
}
.bg-overlay {
  display: flex;
  height: 100vh;
  width: 100%;
  margin: 0;
  text-align: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
}
</style>
