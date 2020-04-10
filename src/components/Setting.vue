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
            class="small text-muted mb-0 chord-dictionary-no-event"
          >(Win) Ctrl + Space</p>
          <p
            v-show="settings.isActiveKey"
            class="small text-muted mb-0 chord-dictionary-no-event"
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
import VueI18n from "vue-i18n";

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
        this._i18n.locale = this.settings.language;
      },
      deep: true
    }
  },
  methods: {
    toggleSetting() {
      this.isShow = !this.isShow;
    }
  },
  mounted() {}
};
</script>

<style lang="scss">
#chord-dictionary-setting {
  @import "node_modules/bootstrap/scss/bootstrap";
  @import "node_modules/bootstrap-vue/src/index.scss";
  text-align: left;
  display: flex;
  align-items: stretch;
}
#chord-dictionary-toggle-button {
  position: fixed;
  bottom: 10px;
  right: 10px;
  z-index: 11;
}
#chord-dictionary-sidebar {
  position: fixed;
  bottom: 60px;
  right: 12px;
  z-index: 10;
  width: 280px;
}
select {
  -webkit-appearance: none;
  appearance: none;
}
.custom-range {
  -webkit-appearance: none !important;
  appearance: none !important;
}
</style>
