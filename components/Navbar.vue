<template>
  <b-navbar toggleable="lg" fixed="top" type="dark" :variant="scrolled ? 'primary' : 'muted'" class="mx-auto">
    <b-navbar-brand to="/">
      La Palmeraie
    </b-navbar-brand>

    <b-navbar-toggle target="nav-collapse" />

    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav class="ml-auto">
        <b-nav-item to="/" :active="$route.path === '/'" class="my-auto">
          Accueil
        </b-nav-item>
        <b-nav-item to="/tutoriel" :active="$route.path === '/tutoriel'" class="my-auto">
          Tutoriel
        </b-nav-item>
        <b-nav-item to="/votes" :active="$route.path === '/votes'" class="my-auto">
          Votez !
        </b-nav-item>
        <b-nav-item to="/boutique" class="nav-first-btn">
          <b-button variant="outline-light" :class="routeMatch('/boutique')" @click="delayedBlur">
            La Boutique
          </b-button>
        </b-nav-item>
        <b-nav-item to="/nous-rejoindre" class="nav-btn">
          <b-button variant="outline-light" :class="routeMatch('/nous-rejoindre')" @click="delayedBlur">
            Nous Rejoindre !
          </b-button>
        </b-nav-item>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<script>
export default {
  name: 'Navbar',
  data() {
    return {
      scrolled: true, // TODO change this to false once some pages have been created
    };
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll);
  },
  destroyed() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  methods: {
    delayedBlur(e) {
      setTimeout(() => e.target.blur(), 200);
    },
    routeMatch(path) {
      return this.$route.path === path ? 'active' : '';
    },
    handleScroll() {
      this.scrolled = window.scrollY > 0;
    },
  },
};
</script>

<style scoped>
.navbar {
  padding-left: 10vw;
  padding-right: 10vw;
  transition: background-color 250ms ease-in-out;
}
.navbar-collapse.show .nav-item,
.navbar-collapse.collapsing .nav-item {
  margin-left: auto;
  margin-right: auto;
}
.navbar-collapse.show .nav-btn,
.navbar-collapse.collapsing .nav-btn {
    margin-top: .5rem;
}
.nav-item {
  height: min-content;
  margin-left: 1vw;
  width: fit-content;
}
.nav-first-btn .nav-link,
.nav-btn .nav-link {
  padding: 0;
}
</style>
