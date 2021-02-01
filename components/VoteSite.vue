<template>
  <div class="w-100 text-center my-2">
    <b-button-group class="w-100">
      <b-button
        variant="primary"
        class="btn-vote"
        :href="address"
        target="_blank"
        @click="delayedBlur"
      >
        Voter ({{ interval }})
      </b-button>
      <b-button variant="outline-primary" class="btn-name" disabled>
        {{ name }}
      </b-button>
    </b-button-group>
  </div>
</template>

<script>
export default {
  name: 'VoteSite',
  props: {
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    interval: {
      type: String,
      required: true,
    },
    index: {
      type: Number,
      default: -1,
    },
    reversed: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    delayedBlur(e) {
      setTimeout(() => e.target.blur(), 200);
    },
  },
};
</script>

<style scoped>
.btn-name {
  opacity: 1 !important;
  color: #fff;
  width: 65%;
}
.btn-vote {
  width: 35%;
}
</style>
