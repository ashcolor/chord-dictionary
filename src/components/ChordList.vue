<template>
  <p id="list" class="card-text">{{chordList | chordListToString}}</p>
</template>

<script>
export default {
  name: "ChordList",
  props: {
    chordList: Array
  },
  filters: {
    chordListToString: function(value) {
      if (typeof value !== "object") {
        return false;
      }
      return value.join(",");
    }
  }
};
</script>

<style scoped>
</style>
