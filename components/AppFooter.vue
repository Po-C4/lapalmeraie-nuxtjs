<template>
  <div class="bg-dark text-white">
    <footer>
      <b-container class="footer-container pt-5">
        <b-row class="mt-3" align-h="center">
          <b-col lg="3" class="mb-4">
            <h6 class="text-uppercase font-weight-bold h6 title">
              La Palmeraie
            </h6>
            <p>
              La Palmeraie est un serveur Minecraft proposé par Agrannok, PoC4,
              Ororia, Sakura19fr & Néozaelks.
            </p>
            <p>
              Site développé par
              <a
                href="https://twitter.com/NeoZaelks"
                target="_blank"
                class="inline-link"
                rel="noopener noreferrer"
              >
                Néozaelks
              </a>
              &
              <a
                href="https://github.com/Po-C4"
                target="_blank"
                class="inline-link"
                rel="noopener noreferrer"
              >
                PoC4
              </a>
            </p>
          </b-col>

          <b-col lg="2" sm="6">
            <p class="text-uppercase font-weight-bold h6 title">
              Sites de Vote
            </p>
            <p class="mb-2">
              <a
                href="https://serveur-prive.net/minecraft/la-palmeraie-serveur-semi-rp-1-16-4-6639/vote"
                class="inline-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                serveur-prive.net
              </a>
            </p>
            <p class="mb-2">
              <a
                href="https://top-serveurs.net/minecraft/vote/la-palmeraie"
                class="inline-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                top-serveurs.net
              </a>
            </p>
            <p class="mb-2">
              <a
                href="https://serveurs-mc.net/serveur/71/voter"
                class="inline-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                serveurs-mc.net
              </a>
            </p>
            <p class="mb-2">
              <a
                href="https://www.liste-serveur.fr/serveurs/minecraft/la-palmeraie-serveur-semi-rp-1-16-3-6163/voter"
                class="inline-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                liste-serveur.fr
              </a>
            </p>
          </b-col>

          <b-col lg="2" sm="6" class="mb-4 mt-sm-4 pt-sm-3">
            <p class="mb-2">
              <a
                href="https://liste-serv-minecraft.fr/serveur?id=396"
                class="inline-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                liste-serv-minecraft.fr
              </a>
            </p>
            <p class="mb-2">
              <a
                href="https://serveur-minecraft.com/2085"
                class="inline-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                serveur-minecraft.com
              </a>
            </p>
            <p class="mb-2">
              <a
                href="https://www.serveursminecraft.org/serveur/5182/"
                class="inline-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                serveursminecraft.org
              </a>
            </p>
            <p class="mb-2">
              <a
                href="https://serveur-minecraft.fr/server-la-palmeraie.401/vote"
                class="inline-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                serveur-minecraft.fr
              </a>
            </p>
          </b-col>

          <b-col lg="3" class="mb-4">
            <b-row>
              <b-col lg="12" sm="6">
                <p class="text-uppercase font-weight-bold h6 title">
                  Contactez Nous
                </p>
                <p class="mb-2">
                  <a
                    href="https://lapalmeraiemc.fr/discord"
                    class="inline-link"
                  >
                    Notre Discord
                  </a>
                </p>
                <p class="mb-2">
                  <a href="mailto:hello@lapalmeraiemc.fr" class="inline-link">
                    hello@lapalmeraiemc.fr
                  </a>
                </p>
              </b-col>
              <b-col lg="12" sm="6">
                <p
                  class="text-uppercase font-weight-bold h6 title mt-4 mt-sm-1"
                >
                  Liens Utiles
                </p>
                <p class="mb-2">
                  <nuxt-link to="/tutoriel" class="inline-link">
                    Tutoriel
                  </nuxt-link>
                </p>
                <p class="mb-2">
                  <nuxt-link to="#" class="inline-link">
                    Mentions Légales
                  </nuxt-link>
                </p>
              </b-col>
            </b-row>
          </b-col>
        </b-row>
      </b-container>
    </footer>

    <div class="text-center py-3">
      <p>
        © 2021
        <nuxt-link to="/" class="inline-link">lapalmeraiemc.fr</nuxt-link> Tous
        droits réservés.
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AppFooter',
};
</script>

<style scoped>
.inline-link {
  color: var(--primary);
}

.title::after {
  margin-bottom: 2vh;
  content: '';
  display: block;
  position: relative;
  height: 2px;
  width: 4.5rem;
  bottom: -0.5rem;
  background-color: var(--primary);
}
</style>
