<template>
  <header class="bg bg-dark text-white" :style="cssVars">
    <b-container fluid class="bg-overlay">
      <b-row class="align-items-center" :class="{ fullscreen: fullscreen }">
        <b-col class="text-center">
          <h1 class="title font-weight-light display-3">
            {{ title }}
          </h1>
          <p class="lead" :class="subtitle !== null ? 'mb-0' : ''">
            {{ subtitle }}
          </p>
          <p v-if="subtitle !== null" class="lead">
            {{ subtitle2 }}
          </p>
          <ScrollArrow v-if="fullscreen" class="cta-arrow" />
        </b-col>
      </b-row>
    </b-container>
  </header>
</template>

<script>
export default {
  name: 'AppHeader',
  props: {
    title: {
      type: String,
      default: 'La Palmeraie — Serveur Minecraft',
    },
    subtitle: {
      type: String,
      default:
        'Semi-RP, ambiance conviviale, staff réactif, économie naissante...',
    },
    subtitle2: {
      type: String,
      default: null,
    },
    background: {
      type: String,
      default: 'bg-header-index',
    },
    fullscreen: {
      type: Boolean,
      default: false,
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
  width: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}

.row {
  height: 60vh;
}

.row.fullscreen {
  height: 100vh;
}

.cta-arrow {
  position: absolute;
  left: calc(50% - 30px);
  bottom: -10rem;
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

@media (max-width: 359.98px) {
  .cta-arrow {
    bottom: -4rem;
  }
}
</style>
