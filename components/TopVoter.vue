<template>
  <div>
    <b-table
      :items="items"
      :fields="fields"
      :busy="$fetchState.pending"
      class="mt-3 mb-0"
      dark
      small
      striped
      fixed
    >
      <template #table-busy>
        <div class="text-center text-danger my-2">
          <b-spinner class="align-middle" />
          <strong>Chargement...</strong>
        </div>
      </template>

      <template #table-colgroup="scope">
        <col
          v-for="field in scope.fields"
          :key="field.key"
          :class="`table-${field.key}`"
        />
      </template>

      <template #cell(rank)="data">
        <p class="mb-0 text-center">{{ data.index + 1 }}#</p>
      </template>

      <template #cell(uuid)="data">
        <b-img
          :src="`https://crafatar.com/avatars/${data.value}?size=24&default=MHF_Steve&overlay`"
          style="float: right"
          width="24px"
          height="24px"
          :alt="`Tête de ${data.item.username}`"
        />
      </template>

      <template #cell()="data">
        <p class="mb-0 text-center">{{ data.value }}</p>
      </template>
    </b-table>
    <b-form-text v-if="updateTime !== null">
      Mis à jour {{ timeSince(updateTime) }}
    </b-form-text>
  </div>
</template>

<script>
export default {
  name: 'TopVoter',
  async fetch() {
    const res = await this.$axios.$get('/api/top-voters');
    this.items = res.results;
    this.updateTime = res.timestamp;
  },
  data() {
    return {
      fields: [
        { key: 'rank', label: 'Place' },
        { key: 'uuid', label: '' },
        { key: 'username', label: 'Joueurs' },
        { key: 'total', label: 'Nb de vote ce mois-ci' },
      ],
      items: [],
      updateTime: null,
      timeFormats: [
        [60, 'secondes', 1],
        [120, 'il y a une minute', 'dans une minute'],
        [3600, 'minutes', 60],
        [7200, 'il y a une heure', 'dans une heure'],
        [86400, 'heures', 3600],
        [172800, 'hier', 'demain'],
        [604800, 'jours', 86400],
        [1209600, 'il y a une semaine', 'dans une semaine'],
        [2419200, 'semaines', 604800],
        [4838400, 'il y a un mois', 'dans un mois'],
        [29030400, 'mois', 2419200],
        [58060800, 'il y a un an', 'dans un an'],
        [2903040000, 'ans', 29030400],
        [5806080000, 'il y a un siècle', 'dans un siècle'],
        [58060800000, 'siècles', 2903040000],
      ],
    };
  },
  methods: {
    timeSince(time) {
      if (time === null) return;

      switch (typeof time) {
        case 'number':
          break;
        case 'string':
          time = +new Date(time);
          break;
        case 'object':
          if (time.constructor === Date) time = time.getDate();
          break;
        default:
          time = +new Date();
      }

      let seconds = (+new Date() - time) / 1000;
      let token = 'il y a';
      let listChoice = 1;

      if (seconds > -1 && seconds < 1) {
        return "à l'instant";
      } else if (seconds < 0) {
        seconds = Math.abs(seconds);
        token = 'dans';
        listChoice = 2;
      }

      let i = 0;
      let format;
      while ((format = this.timeFormats[i++])) {
        if (seconds < format[0]) {
          if (typeof format[2] === 'string') {
            return format[listChoice];
          } else {
            return `${token} ${Math.floor(seconds / format[2])} ${format[1]}`;
          }
        }
      }
    },
  },
};
</script>

<style>
.avatar {
  float: left;
}
.table th {
  border-top: 0;
}
.table-rank {
  width: 5rem;
}
.table-uuid {
  width: 5rem;
}
.table th div {
  border-top: 0;
  text-align: center;
}

@media (max-width: 450px) {
  .table-uuid {
    width: 2rem;
  }
}
</style>
