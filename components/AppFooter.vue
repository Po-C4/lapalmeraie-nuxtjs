<template>
  <div class="bg-dark text-white">
    <footer>
      <b-container class="footer-container pt-5">
        <b-row class="mt-3">
          <b-col md="3" lg="4" xl="3" class="mx-auto mb-4">
            <h6 class="text-uppercase font-weight-bold">La Palmeraie</h6>
            <hr class="divider mb-4 mt-0 d-inline-block mx-auto" />
            <p>
              La Palmeraie est un serveur Minecraft proposé par Agrannok, PoC4,
              Ororia, Sakura19fr & Néozaelks.
            </p>
            <p>Site développé par Néozaelks & PoC4</p>
          </b-col>

          <b-col md="2" lg="2" xl="2" class="mx-auto mb-4">
            <h6 class="text-uppercase font-weight-bold">Liens Utiles</h6>
            <hr class="divider mb-4 mt-0 d-inline-block mx-auto" />
            <p>
              <nuxt-link to="/tutoriel" class="inline-link">
                Tutoriel
              </nuxt-link>
            </p>
            <p>
              <nuxt-link to="#" class="inline-link">Le Serveur</nuxt-link>
            </p>
            <p>
              <a href="https://lapalmeraiemc.fr/discord" class="inline-link">
                Serveur Discord
              </a>
            </p>
            <p>
              <nuxt-link to="#" class="inline-link">
                Mentions Légales
              </nuxt-link>
            </p>
          </b-col>

          <b-col md="3" lg="2" xl="2" class="mx-auto mb-4">
            <h6 class="text-uppercase font-weight-bold">Sites de Vote</h6>
            <hr class="divider mb-4 mt-0 d-inline-block mx-auto" />
            <p>
              <a
                href="https://serveur-prive.net/minecraft/la-palmeraie-serveur-semi-rp-1-16-3-6639/vote"
                class="inline-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                serveur-prive.net
              </a>
            </p>
            <p>
              <a
                href="https://www.liste-serveur.fr/serveurs/minecraft/la-palmeraie-serveur-semi-rp-1-16-3-6163/voter"
                class="inline-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                liste-serveur.fr
              </a>
            </p>
            <p>
              <a
                href="https://liste-serv-minecraft.fr/serveur?id=396"
                class="inline-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                liste-serv-minecraft.fr
              </a>
            </p>
            <p>
              <a
                href="https://top-serveurs.net/minecraft/la-palmeraie-serveur-semi-rp-1163"
                class="inline-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                top-serveurs.net
              </a>
            </p>
          </b-col>

          <b-col md="3" lg="2" xl="2" class="mx-auto mb-4">
            <h6 class="text-uppercase font-weight-bold">Contactez Nous</h6>
            <hr class="divider mb-4 mt-0 d-inline-block mx-auto" />
            <p>
              <a href="mailto:hello@lapalmeraiemc.fr" class="inline-link">
                hello@lapalmeraiemc.fr
              </a>
            </p>
            <p>
              <a href="https://lapalmeraiemc.fr/discord" class="inline-link">
                lapalmeraiemc.fr/discord
              </a>
            </p>
          </b-col>
        </b-row>
      </b-container>
    </footer>

    <div class="text-center py-3">
      <p>
        © 2020
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
.divider {
  width: 10vw;
  border: 2px solid var(--primary);
}
.inline-link {
  color: var(--primary);
}
</style>
