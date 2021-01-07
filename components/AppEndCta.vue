<template>
  <b-container fluid class="bg px-0 bg-dark text-white" :style="cssVars">
    <b-row class="bg-overlay w-100 mx-0">
      <b-col class="text-center d-flex flex-wrap justify-content-center align-content-center">
        <h2 class="title display-3 w-100">
          {{ text }}
        </h2>
        <b-button variant="primary" size="lg" class="mt-4" :to="btnPage">
          {{ btnText }}
        </b-button>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {
  name: 'AppEndCta',
  props: {
    text: {
      type: String,
      default: 'Alors, convaincu.e ?',
    },
    btnText: {
      type: String,
      default: 'Nous rejoindre !',
    },
    btnPage: {
      type: String,
      default: '/nous-rejoindre',
    },
    background: {
      type: String,
      default: 'bg-cta',
    },
  },
  computed: {
    cssVars() {
      return {
        '--bg-image': `url('${this.getImgUrl(this.background)}')`,
      };
    },
  },
  methods: {
    getImgUrl(img) {
      const assets = require.context('@/assets/', false, /\.png$/);
      return assets(`./${img}.png`);
    },
  },
};
</script>

<style scoped>
.bg {
  background-image: var(--bg-image);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.bg-overlay {
  height: 45vh;
  background-color: rgba(0, 0, 0, 0.5);
}

@media (max-width: 599.98px) {
  .title {
    font-size: 4rem;
  }
}

@media (max-width: 550px) {
  .title {
    font-size: 3.5rem;
  }
}
</style>
