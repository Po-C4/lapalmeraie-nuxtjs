<template>
  <div class="bg-dark text-white">
    <AppHeader
      background="bg-tutorial"
      title="Le Tutoriel !"
      subtitle="Toutes les informations dont vous avez besoin pour jouer sur le serveur."
    />
    <b-container class="bg-dark">
      <nuxt-content :document="doc" />
    </b-container>
  </div>
</template>

<script>
export default {
  name: 'PageTutorialIndex',
  async asyncData({ $content }) {
    return {
      doc: await $content('index').fetch(),
    };
  },
};
</script>

<style>
.nuxt-content h2 {
  margin-top: 5vh;
  margin-bottom: 4vh;
}
.nuxt-content h2::after {
  content: '';
  display: block;
  position: relative;
  height: 4px;
  width: 10rem;
  bottom: -0.5rem;
  background-color: var(--primary);
}

.nuxt-content h3 {
  margin-top: 3vh;
  margin-bottom: 4vh;
}
.nuxt-content h3::after {
  content: '';
  display: block;
  position: relative;
  height: 2px;
  width: 4.5rem;
  bottom: -0.5rem;
  background-color: var(--primary);
}

.nuxt-content code {
  color: var(--primary);
}

.nuxt-content blockquote {
  background: #2f353a;
  border-left: 5px solid #272b30;
  margin: 1.5em 10px;
  padding: 0.5em 10px;
}
.nuxt-content blockquote p {
  display: inline;
}

.nuxt-content table {
  margin-top: 0;
  margin-bottom: 1rem;
  width: 100%;
}
.nuxt-content table thead th {
  border-bottom: 2px solid #454d55;
}
.nuxt-content table th,
.nuxt-content table td {
  padding: 0.5rem;
  border-top: 1px solid #454d55;
}
</style>
