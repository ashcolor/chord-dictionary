<template>
  <div id="config">
    <p>{{isActive | message}}</p>
    <!-- <toggle-button v-model="is_valid" :labels="{checked: 'ON', unchecked: 'OFF'}" /> -->
  </div>
</template>

<script>
import { ToggleButton } from "vue-js-toggle-button";

export default {
  components: {
    ToggleButton
  },
  data() {
    return {
      isActive: null
    };
  },
  filters: {
    message: value => {
      return value ? "active " : "disactive ";
    }
  },
  mounted() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      this.isActive = chrome.tabs.sendMessage(tabs[0].id, {});
    });
    window.close();
  }
};
</script>

<style lang="scss" scoped>
#config {
  // width: 306px;
  // height: 100px;
  overflow: hidden;
}
p {
  font-size: 20px;
}
</style>
