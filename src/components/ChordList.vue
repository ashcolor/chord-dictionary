<template>
  <div id="list" class="card-text">{{chordList | chordListToString}}</div>
</template>

<script>
export default {
  name: "ChordList",
  props: {
    chordList: Array
  },
  filters: {
    chordListToString: value => {
      if (typeof value !== "object") return "";
      if (value.length === 0) return "";
      return value.join(",");
    }
  }
};
</script>

<style scoped>
#list {
  height: 20.8px;
}
</style>
