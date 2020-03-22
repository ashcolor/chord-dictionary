<template>
  <div id="chord-dictionary-wrapper">
    <!-- Sidebar -->
    <nav v-show="settings.isShow" id="chord-dictionary-sidebar">
      <b-card no-body header="表示設定">
        <b-card-body>
          <b-form-checkbox switch v-model="settings.isShowRoman" class="mb-2">ローマ数字表記</b-form-checkbox>
          <b-input-group prepend="キー">
            <b-form-select v-model="settings.key" :options="KEYS"></b-form-select>
            <b-form-select v-model="settings.offset" :options="OFFSETS"></b-form-select>
          </b-input-group>
          <b-input-group prepend="移調">
            <b-form-select v-model="settings.transposeKey" :options="KEYS"></b-form-select>
            <b-form-select v-model="settings.transposeOffset" :options="OFFSETS"></b-form-select>
          </b-input-group>
          <p class="small text-muted mb-0">（移調はローマ数字機能への影響なし）</p>
        </b-card-body>
      </b-card>
      <b-card no-body header="再生設定">
        <b-card-body>
          <b-input-group prepend="音量" class="mb-2">
            <b-form-input v-model="settings.volume" type="range" min="0" max="100"></b-form-input>
          </b-input-group>
          <b-input-group prepend="楽器" class="mb-2">
            <b-form-select v-model="settings.inst" :options="instOptions"></b-form-select>
          </b-input-group>
          <b-form-checkbox switch v-model="settings.isActiveClick">クリック</b-form-checkbox>
          <b-form-checkbox switch v-model="settings.isActiveKey">キー操作</b-form-checkbox>
          <p class="small text-muted mb-0">(Win) Ctrl + Space</p>
          <p class="small text-muted mb-0">(Mac) Cmd + Shift + Space</p>
          <b-form-checkbox v-model="settings.isActiveHover" switch>ホバー</b-form-checkbox>
        </b-card-body>
      </b-card>
    </nav>
    <b-button
      id="chord-dictionary-toggle-button"
      size="sm"
      class="mb-2"
      v-on:click="$emit('toggleShow')"
    >
      <b-icon icon="gear-fill"></b-icon>
    </b-button>
  </div>
</template>

<script>
import { INSTS, KEYS, OFFSETS } from "../config/const";

export default {
  name: "Config",
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
      return INSTS.map(v => ({ value: v.key, text: v.name }));
    },
    KEYS() {
      return KEYS;
    },
    OFFSETS() {
      return OFFSETS;
    }
  },
  watch: {
    settings: {
      handler: function(newValue, oldValue) {
        chrome.storage.local.set({ settings: newValue });
      },
      deep: true
    }
  },
  methods: {
    toggleConfig() {
      this.isShow = !this.isShow;
    }
  },
  mounted() {}
};
</script>

<style lang="scss">
#chord-dictionary-wrapper {
  @import "node_modules/bootstrap/scss/bootstrap";
  @import "node_modules/bootstrap-vue/src/index.scss";
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
