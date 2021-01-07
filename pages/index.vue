<template>
  <div class="bg-dark text-white">
    <AppHeader />

    <b-container>
      <b-row class="align-items-center mt-5">
        <b-col class="text-center">
          <h2>Infos sur le serveur</h2>
        </b-col>
      </b-row>

      <b-row class="align-items-center mt-5">
        <b-col lg="7">
          <b-img fluid src="@/assets/img-subtext01.png" alt="Le portail vers le Nether et le monde Ressources" />
        </b-col>
        <b-col lg="5" class="mt-5 mt-lg-0">
          <h3>Le serveur en quelques mots</h3>
          <hr class="divider d-inline-block mb-4 mt-0">
          <p>La Palmeraie est un serveur Minecraft sur whitelist 1.16.3 majoritairement axé sur le vanilla. Venez rejoindre une communauté familiale et sympathique, avec des ajouts de gameplay et de qualité de vie ! Rejoignez une ville ou crééz la votre ! Devenez riche en vendant vos ressources à l'aide de commerçants ! Notre carte de 50000 blocs carré vous attend !</p>
          <b-button variant="primary" to="/nous-rejoindre">
            Nous rejoindre !
          </b-button>
        </b-col>
      </b-row>

      <b-row class="align-items-center mt-5">
        <b-col lg="5" order="2" order-lg="1" class="mt-5 mt-lg-0">
          <h3>Nos ajouts</h3>
          <hr class="divider d-inline-block mb-4 mt-0">
          <p>La Palmeraie ajoute des nouveautés par rapport au jeu de base. Par exemple, vous pouvez obtenir des têtes de joueurs customisées, des PNJ personnalisables, une économie physique propre au serveur. En plus, notre serveur possède un pack de ressources pour texturer tous les objets modifiés !</p>
          <b-button variant="primary" to="/nous-rejoindre">
            Candidater
          </b-button>
        </b-col>
        <b-col lg="7" order="1" order-lg="2">
          <b-img fluid src="@/assets/img-subtext02.png" alt="Les champs du spawn, et la cave" />
        </b-col>
      </b-row>

      <b-row class="align-items-center mt-5 mb-4">
        <b-col lg="7">
          <b-img fluid src="@/assets/img-subtext03.png" alt="La ville principale du spawn" />
        </b-col>
        <b-col lg="5" class="mt-5 mt-lg-0">
          <h3>Notre Histoire</h3>
          <hr class="divider d-inline-block mb-4 mt-0">
          <p>La Palmeraie a été fondée par des amis qui ne pouvaient plus supporter le management et les règles absurdes d'autres serveurs semi-RP freebuild. Ils ont alors décidé de créer un serveur avec des règles logiques, et sans prise de tête.</p>
          <b-button variant="primary" to="/nous-rejoindre">
            Commencer l'aventure !
          </b-button>
        </b-col>
      </b-row>
    </b-container>

    <AppEndCta />
  </div>
</template>

<style scoped>
.divider {
  width: 10vw;
  border: 2px solid var(--primary);
}
</style>
