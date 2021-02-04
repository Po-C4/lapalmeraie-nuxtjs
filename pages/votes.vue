<template>
  <div class="bg-dark text-white">
    <AppHeader
      background="bg-vote"
      title="Votez !"
      subtitle="Pour montrer votre appréciation du serveur n'hésitez pas à voter pour nous."
    />
    <b-container class="mt-4">
      <b-row align-h="center">
        <b-col lg="5" xl="4" class="mt-3">
          <VoteSite
            name="serveur-prive.net"
            address="https://serveur-prive.net/minecraft/la-palmeraie-serveur-semi-rp-1-16-4-6639/vote"
            interval="1h30"
            :index="1"
            reversed
          />
          <VoteSite
            name="top-serveurs.net"
            address="https://top-serveurs.net/minecraft/vote/la-palmeraie"
            interval="2h"
            :index="2"
            reversed
          />
          <VoteSite
            name="serveurs-mc.net"
            address="https://serveurs-mc.net/serveur/71/voter"
            interval="2h"
            :index="3"
            reversed
          />
          <VoteSite
            name="liste-serveur.fr"
            address="https://www.liste-serveur.fr/serveurs/minecraft/la-palmeraie-serveur-semi-rp-1-16-3-6163/voter"
            interval="3h"
            :index="4"
            reversed
          />

          <VoteSite
            name="liste-serv-minecraft.fr"
            address="https://liste-serv-minecraft.fr/serveur?id=396"
            interval="3h"
            :index="5"
          />
          <VoteSite
            name="serveur-minecraft.com"
            address="https://serveur-minecraft.com/2085"
            interval="3h"
            :index="6"
          />
          <VoteSite
            name="serveursminecraft.org"
            address="https://www.serveursminecraft.org/serveur/5182/"
            interval="24h"
            :index="7"
          />
          <VoteSite
            name="serveur-minecraft.fr"
            address="https://serveur-minecraft.fr/server-la-palmeraie.401/vote"
            interval="24h"
            :index="8"
          />
        </b-col>
        <b-col lg="6"><TopVoter /></b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
export default {
  name: 'PageVotes',
};
</script>
