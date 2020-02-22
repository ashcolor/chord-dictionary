<template>
  <div id="list" class="card-text">{{chordOriginal | chordListToString}}</div>
</template>

<script>
import ChordNote from "../assets/ChordNote_for_chord-dictionary.js";

export default {
  name: "ChordList",
  props: {
    chordList: Array,
    chordOriginal: Array
  },
  filters: {
    chordListToString: value => {
      value = value.map(v =>
        ChordNote.Note(v.key, v.offset).toString(true, true)
      );
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
