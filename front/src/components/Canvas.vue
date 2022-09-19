<template>
  
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { MainScene } from '../babylon/MainScene';

export default defineComponent({
  name: "Canvas",
  props: {
    username: {
      type: String,
    },
  },
  mounted() {
    const canvas = document.querySelector("canvas") as HTMLCanvasElement;
  }
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

