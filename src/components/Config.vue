<template>
  <div id="wrapper">
    <!-- Sidebar -->
    <nav v-show="settings.isShow" id="sidebar">
      <b-card no-body header="表示設定">
        <b-card-body>
          <!-- <b-input-group prepend="transpose:" class="mb-2"> -->
          <!-- <b-form-spinbutton inline v-model="settings.transpose" min="-12" max="12"></b-form-spinbutton> -->
          <!-- </b-input-group> -->
          <b-form-checkbox
            switch
            v-model="settings.isShowRoman"
            v-on:click="$emit('toggleShowRoman')"
            onclick="blur()"
            class="mb-2"
          >ローマ数字表記</b-form-checkbox>
          <b-input-group prepend="キー">
            <b-form-select v-model="settings.key" :options="KEYS"></b-form-select>
          </b-input-group>
        </b-card-body>
      </b-card>
      <b-card no-body header="再生設定">
        <b-card-body>
          <b-input-group prepend="音量" class="mb-2">
            <b-form-input v-model="settings.gain" type="range" min="-20" max="0"></b-form-input>
          </b-input-group>
          <b-input-group prepend="楽器" class="mb-2">
            <b-form-select v-model="settings.inst" :options="instOptions"></b-form-select>
          </b-input-group>
          <b-form-checkbox
            switch
            v-model="settings.isActiveClick"
            v-on:click="$emit('toggleClick')"
            onclick="blur()"
          >クリック</b-form-checkbox>
          <b-form-checkbox
            switch
            v-model="settings.isActiveKey"
            v-on:click="$emit('toggleKey')"
            onclick="blur()"
          >キー操作</b-form-checkbox>
          <p class="small text-muted mb-0">(Win) Ctrl + Space</p>
          <p class="small text-muted mb-0">(Mac) Cmd + Shift + Space</p>
          <b-form-checkbox
            switch
            v-model="settings.isActiveHover"
            v-on:click="$emit('toggleHover')"
            onclick="blur()"
          >ホバー</b-form-checkbox>
        </b-card-body>
      </b-card>
    </nav>
    <b-button id="toggle-button" size="sm" class="mb-2" v-on:click="$emit('toggleShow')">
      <b-icon icon="gear-fill"></b-icon>
    </b-button>
  </div>
</template>

<script>
import { INSTS, KEYS } from "../config/const";

export default {
  name: "Config",
  props: {
    settings: Object
  },
  filters: {},
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
#wrapper {
  @import "node_modules/bootstrap/scss/bootstrap";
  @import "node_modules/bootstrap-vue/src/index.scss";
  display: flex;
  align-items: stretch;
}
#toggle-button {
  position: fixed;
  bottom: 10px;
  right: 10px;
  z-index: 11;
}
#sidebar {
  position: fixed;
  bottom: 60px;
  right: 12px;
  z-index: 10;
  width: 280px;
}
select {
  -webkit-appearance: none;
}
.custom-range {
  -webkit-appearance: none !important;
}
</style>