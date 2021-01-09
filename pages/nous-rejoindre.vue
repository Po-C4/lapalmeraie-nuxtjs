<template>
  <div class="bg-dark text-white">
    <AppHeader
      background="bg-cta"
      title="Rejoindre la Palmeraie"
      subtitle="Avant de pouvoir rejoindre La Palmeraie, nous avons besoin de quelques informations sur vous !"
      subtitle2="Ce formulaire nous permettra d'évaluer votre candidature, et de sécuriser le serveur."
    />

    <b-container class="mt-5">
      <b-form ref="form" @submit.prevent="onSubmit">
        <b-row>
          <b-col lg="6">
            <label for="minecraft">Pseudo Minecraft</label>
            <b-input
              id="minecraft"
              ref="minecraft"
              v-model="minecraft"
              type="text"
              :debounce="debounce"
              :state="minecraftState"
              @update="testMinecraft"
            />
            <b-form-text>
              Votre pseudo en jeu. Ne le changez pas jusqu'à la validation de
              votre candidature.
            </b-form-text>
          </b-col>

          <b-col lg="6" class="mt-4 mt-lg-0">
            <label for="discord">Pseudo Discord#1234</label>
            <b-input
              id="discord"
              ref="discord"
              v-model="discord"
              type="text"
              :debounce="debounce"
              :state="discordState"
              @update="testDiscord"
            />
            <b-form-text>
              Votre pseudo Discord et votre tag. Ne le changez pas jusqu'à la
              validation de votre candidature.
            </b-form-text>
          </b-col>
        </b-row>

        <b-row class="mt-4 mt-lg-3">
          <b-col lg="4">
            <label for="age">Âge</label>
            <b-input
              id="age"
              ref="age"
              v-model="age"
              type="text"
              :debounce="debounce"
              :state="ageState"
              @update="testAge"
            />
            <b-form-text>
              Votre âge. Cette information n'est utile que pour la candidature
              et n'est pas sauvegardée.
            </b-form-text>
          </b-col>

          <b-col lg="4" class="mt-4 mt-lg-0">
            <label for="godfathers">Pseudo du ou des parrains</label>
            <b-input
              id="godfathers"
              ref="godfathers"
              v-model="godfathers"
              type="text"
              :debounce="debounce"
              :state="godfathersState"
              @update="testGodfathers"
            />
            <b-form-text>
              Si vous comptez jouer avec des personnes déjà présentes sur le
              serveur, notez-les ici.
            </b-form-text>
          </b-col>

          <b-col lg="4" class="mt-4 mt-lg-0">
            <label for="discovery">
              Comment avez-vous découvert la Palmeraie ?
            </label>
            <b-form-textarea
              id="discovery"
              ref="discovery"
              v-model="discovery"
              rows="1"
              max-rows="4"
              :maxlength="discoveryMaxLength"
              :debounce="debounce"
              :state="discoveryState"
              @update="testDiscovery"
              @input="updateDiscoveryTooltip"
              @focus="showDiscoveryTooltip"
              @blur="hideDiscoveryTooltip"
            />
            <b-form-text
              v-if="discoveryTooltip"
              :text-variant="discoveryTooltipVariant"
              class="length-tooltip"
            >
              {{ discoveryLength }} / {{ discoveryMaxLength }}
            </b-form-text>
          </b-col>
        </b-row>

        <b-row class="mt-4 mt-lg-3">
          <b-col>
            <label for="resume">Votre Candidature</label>
            <b-form-textarea
              id="resume"
              ref="resume"
              v-model="resume"
              rows="4"
              max-rows="10"
              :maxlength="resumeMaxLength"
              :debounce="debounce"
              :state="resumeState"
              @update="testResume"
              @input="updateResumeTooltip"
              @focus="showResumeTooltip"
              @blur="hideResumeTooltip"
            />
            <b-form-text
              v-if="resumeTooltip"
              :text-variant="resumeTooltipVariant"
              class="length-tooltip"
            >
              {{ resumeLength }} / {{ resumeMaxLength }}
            </b-form-text>
            <b-form-text class="description">
              Qui êtes-vous ? Que comptez-vous faire sur le serveur ? Quels sont
              vos objectifs, vos ambitions ? Qu'est-ce qui vous attire sur le
              serveur ?
            </b-form-text>
          </b-col>
        </b-row>

        <b-row class="mt-5">
          <b-col class="d-flex justify-content-center">
            <div style="width: min-content">
              <VueRecaptcha
                ref="captcha"
                :sitekey="$config.siteKey"
                type="v2"
                language="fr"
                load-recaptcha-script
                @verify="onVerify"
                @expired="onExpired"
                @error="onError"
              />
              <b-form-text
                v-if="missingCaptcha"
                text-variant="danger"
                class="text-center"
              >
                Tu dois compléter le captcha ci-dessus avant de valider ta
                candidature
              </b-form-text>
            </div>
          </b-col>
        </b-row>

        <b-row align-h="center" class="mt-3">
          <b-col md="8" lg="6">
            <b-button
              block
              type="submit"
              variant="primary"
              size="lg"
              @click="delayedBlur"
            >
              Valider ma candidature !
            </b-button>
          </b-col>
        </b-row>
      </b-form>
    </b-container>
  </div>
</template>

<script>
import VueRecaptcha from 'vue-recaptcha';

export default {
  components: {
    VueRecaptcha,
  },
  data() {
    return {
      debounce: 300,
      minecraft: '',
      minecraftState: null,
      minecraftRegex: /^[a-zA-Z0-9_]{1,16}$/,
      discord: '',
      discordState: null,
      discordRegex: /^.{2,32}#[0-9]{4}$/,
      age: '',
      ageState: null,
      ageRegex: /^[0-9]{1,2}$/,
      godfathers: '',
      godfathersState: null,
      godfathersRegex: /^[a-zA-Z0-9_]{1,16}( [a-zA-Z0-9_]{1,16}){0,2}$/,
      discovery: '',
      discoveryState: null,
      discoveryLength: 0,
      discoveryMaxLength: 256,
      discoveryTooltipVariant: 'warning',
      discoveryTooltip: false,
      resume: '',
      resumeState: null,
      resumeLength: 0,
      resumeMaxLength: 2048,
      resumeTooltipVariant: 'warning',
      resumeTooltip: false,
      captchaToken: null,
      missingCaptcha: false,
    };
  },
  methods: {
    testMinecraft() {
      this.minecraftState = this.minecraftRegex.test(this.minecraft);
      return this.minecraftState;
    },
    testDiscord() {
      this.discordState = this.discordRegex.test(this.discord);
      return this.discordState;
    },
    testAge() {
      this.ageState = this.ageRegex.test(this.age);
      return this.ageState;
    },
    testGodfathers() {
      this.godfathersState =
        this.godfathers.length === 0
          ? null
          : this.godfathersRegex.test(this.godfathers);
      return this.godfathersState === null || this.godfathersState;
    },
    testDiscovery() {
      this.discoveryState =
        this.discovery.length === 0
          ? null
          : this.discovery.length > 0 &&
            this.discovery.length <= this.discoveryMaxLength;
      return this.discoveryState === null || this.discoveryState;
    },
    testResume() {
      this.resumeState =
        this.resume.length > 0 && this.resume.length <= this.resumeMaxLength;
      return this.resumeState;
    },
    testCaptcha() {
      this.missingCaptcha = this.captchaToken === null;
      return !this.missingCaptcha;
    },
    updateInputsStates() {
      return {
        minecraft: this.testMinecraft(),
        discord: this.testDiscord(),
        age: this.testAge(),
        godfathers: this.testGodfathers(),
        discovery: this.testDiscovery(),
        resume: this.testResume(),
        captcha: this.testCaptcha(),
      };
    },
    onSubmit() {
      for (const [key, value] of Object.entries(this.updateInputsStates())) {
        if (!value) {
          this.$refs[key].$el.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
          });
          return;
        }
      }
      console.log('valid'); // TODO submit the form
    },
    onVerify(token) {
      this.captchaToken = token;
    },
    onExpired() {
      this.captchaToken = null;
    },
    onError() {
      this.captchaToken = null;
    },
    delayedBlur(e) {
      setTimeout(() => e.target.blur(), 200);
    },
    updateDiscoveryTooltip({ length }) {
      this.discoveryLength = length;
      this.discoveryTooltip = length >= 200;
      this.discoveryTooltipVariant = length >= 246 ? 'danger' : 'warning';
    },
    hideDiscoveryTooltip() {
      this.discoveryTooltip = false;
    },
    showDiscoveryTooltip() {
      this.discoveryTooltip = this.discoveryLength >= 200;
    },
    updateResumeTooltip({ length }) {
      this.resumeLength = length;
      this.resumeTooltip = length >= 2000;
      this.resumeTooltipVariant = length >= 2038 ? 'danger' : 'warning';
    },
    hideResumeTooltip() {
      this.resumeTooltip = false;
    },
    showResumeTooltip() {
      this.resumeTooltip = this.resumeLength >= 2000;
    },
  },
};
</script>

<style scoped>
.form-control {
  background-color: var(--dark) !important;
  color: var(--primary) !important;
  border: 1px solid var(--primary);
}

textarea.form-control::-webkit-scrollbar {
  display: none;
}

textarea.form-control {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.is-valid {
  border: 1px solid var(--success);
  color: var(--success) !important;
}

.is-invalid {
  border: 1px solid var(--danger);
  color: var(--danger) !important;
}

.length-tooltip {
  position: absolute;
  right: 15px;
}

.length-tooltip.text-danger {
  font-weight: bold;
}

.length-tooltip + .description {
  padding-right: 70px;
}
</style>
