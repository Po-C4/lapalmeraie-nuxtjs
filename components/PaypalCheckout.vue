<template>
  <div ref="paypal"></div>
</template>

<script>
export default {
  name: 'PaypalCheckout',
  props: {
    clientId: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    amount: {
      type: String,
      required: true,
    },
    disabledFundings: {
      type: String,
      default: null,
    },
  },
  data() {
    return {};
  },
  mounted() {
    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${this.clientId}&currency=EUR`;
    if (this.disabledFundings !== null) {
      script.src += `&disable-funding=${this.disabledFundings}`;
    }
    script.addEventListener('load', this.onLoad);
    document.body.appendChild(script);
  },
  methods: {
    onLoad() {
      window.paypal
        .Buttons({
          locale: 'fr_FR',
          style: {
            color: 'blue',
            shape: 'pill',
            label: 'pay',
          },
          createOrder: (data, actions) => {
            return this.$axios
              .post('/api/create-order', {
                username: this.username,
                amount: this.amount,
              })
              .then((response) => {
                return response.data.id;
              });
          },
          onApprove: (data, actions) => {
            return this.$axios
              .post(`/api/capture-order/${data.orderID}`)
              .then((res) => {
                if (res.data.status !== 'success') {
                  alert('Something went wrong');
                }
              });
          },
        })
        .render(this.$refs.paypal);
    },
  },
};
</script>
