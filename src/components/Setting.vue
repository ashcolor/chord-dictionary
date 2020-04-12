<template>
  <div id="chord-dictionary-setting">
    <!-- Sidebar -->
    <nav v-show="settings.isShow" id="chord-dictionary-sidebar">
      <b-card no-body>
        <b-card-header>{{ $t("display_settings") }}</b-card-header>
        <b-card-body>
          <b-input-group class="mb-2">
            <template v-slot:prepend><b-input-group-text>{{ $t("language") }}</b-input-group-text></template>
            <b-form-select v-model="settings.language" :options="languages"></b-form-select>
          </b-input-group>
          <b-form-checkbox v-model="settings.isShowRoman" onclick="blur()" switch>{{ $t("roman_display") }}</b-form-checkbox>
          <b-input-group class="mb-2">
            <template v-slot:prepend><b-input-group-text>{{ $t("key") }}</b-input-group-text></template>
            <b-form-select v-model="settings.key" :options="KEYS"></b-form-select>
            <b-form-select v-model="settings.offset" :options="OFFSETS"></b-form-select>
          </b-input-group>
          <b-form-checkbox v-model="settings.isTranspose" onclick="blur()" switch>{{ $t("transpose") }}</b-form-checkbox>
          <b-input-group v-show="settings.isTranspose">
            <template v-slot:prepend><b-input-group-text>{{ $t("transpose_to") }}</b-input-group-text></template>
            <b-form-select v-model="settings.transposeKey" :options="KEYS"></b-form-select>
            <b-form-select v-model="settings.transposeOffset" :options="OFFSETS"></b-form-select>
          </b-input-group>
          <p v-show="settings.isTranspose" class="small text-muted mb-0">{{ $t("transpose_hint") }}</p>
        </b-card-body>
      </b-card>
      <b-card no-body>
        <b-card-header>{{ $t("player_settings") }}</b-card-header>
        <b-card-body>
          <b-input-group class="mb-2">
            <template v-slot:prepend><b-input-group-text>{{ $t("volume") }}</b-input-group-text></template>
            <b-form-input v-model="settings.volume" type="range" min="0" max="100"></b-form-input>
          </b-input-group>
          <b-input-group class="mb-2">
            <template v-slot:prepend><b-input-group-text>{{ $t("instrument") }}</b-input-group-text></template>
            <b-form-select v-model="settings.inst" :options="instOptions"></b-form-select>
          </b-input-group>
          <b-form-checkbox v-model="settings.isActiveClick" onclick="blur()" switch>{{ $t("click") }}</b-form-checkbox>
          <b-form-checkbox v-model="settings.isActiveKey" onclick="blur()" switch>{{ $t("shortcut") }}</b-form-checkbox>
          <p
            v-show="settings.isActiveKey"
            class="small text-muted mb-0"
          >(Win) Ctrl + Space</p>
          <p
            v-show="settings.isActiveKey"
            class="small text-muted mb-0"
          >(Mac) Cmd + Shift + Space</p>
          <b-form-checkbox v-model="settings.isActiveHover" onclick="blur()" switch>{{ $t("hover") }}</b-form-checkbox>
        </b-card-body>
      </b-card>
    </nav>
    <b-button
      :pressed.sync="settings.isShow"
      id="chord-dictionary-toggle-button"
      size="sm"
      class="mb-2"
    >
      <b-icon icon="gear-fill"></b-icon>
    </b-button>
  </div>
</template>

<script>
import { INSTS, KEYS, OFFSETS } from "../config/const";

import langs from "../config/i18n";

export default {
  name: "setting",
  props: {
    settings: Object
  },
  data() {
    return {
      isShow: true
    };
  },
  computed: {
    instOptions() {
      return INSTS.map(v => ({ value: v.key, text: this.$t(v.key) }));
    },
    KEYS() {
      return KEYS;
    },
    OFFSETS() {
      return OFFSETS;
    },
    languages() {
      return Object.keys(langs).map(v => ({ value: v, text: langs[v].name }));
    },
  },
  watch: {
    settings: {
      handler: function(newValue, oldValue) {
        chrome.storage.local.set({ settings: newValue });
        this._i18n.locale = newValue.language;
      },
      deep: true
    }
  },
  methods: {
    toggleSetting() {
      this.isShow = !this.isShow;
    }
  },
  mounted() {
    this._i18n.locale = this.settings.language;
  }
};
</script>

<style lang="scss">
#chord-dictionary-wrapper #chord-dictionary-setting {
  @import "node_modules/bootstrap/scss/bootstrap";
  @import "node_modules/bootstrap-vue/src/index.scss";
  text-align: left;
  display: flex;
  align-items: stretch;
}
#chord-dictionary-wrapper #chord-dictionary-toggle-button {
  position: fixed;
  bottom: 10px;
  right: 10px;
  z-index: 2147483646;
}
#chord-dictionary-wrapper #chord-dictionary-sidebar {
  position: fixed;
  bottom: 60px;
  right: 12px;
  z-index: 2147483645;
  width: 280px;
}
#chord-dictionary-wrapper select {
  -webkit-appearance: none;
  appearance: none;
}
</style>
<style>
#chord-dictionary-wrapper .custom-range {
  width: 100%;
  height: 1.4rem;
  padding: 0;
  background-color: transparent;
  -webkit-appearance: none;
  appearance: none;
}
#chord-dictionary-wrapper .custom-range:focus {
  outline: none;
}
#chord-dictionary-wrapper .custom-range:focus::-webkit-slider-thumb {
  box-shadow: 0 0 0 1px #fff,0 0 0 .2rem rgba(0,123,255,.25);
}
#chord-dictionary-wrapper .custom-range::-webkit-slider-thumb {
  width: 1rem;
  height: 1rem;
  margin-top: -.25rem;
  background-color: #007bff;
  border: 0;
  border-radius: 1rem;
  -webkit-transition: background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out;
  transition: background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out;
  -webkit-appearance: none;
  appearance: none;
}
@media (prefers-reduced-motion:reduce) {
  #chord-dictionary-wrapper .custom-range::-webkit-slider-thumb {
    -webkit-transition: none;
    transition: none;
  }
}
#chord-dictionary-wrapper .custom-range::-webkit-slider-thumb:active {
  background-color: #b3d7ff;
}
@media (max-height: 660px) {
  #chord-dictionary-wrapper #chord-dictionary-setting nav {
    width: 560px;
    display: flex;
  }
  #chord-dictionary-wrapper #chord-dictionary-setting .card {
    flex: auto;
  }
}
</style>