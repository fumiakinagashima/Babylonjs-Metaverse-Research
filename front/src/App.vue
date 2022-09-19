<template>
  <div v-if="isSubmit">
    <RoomView v-bind:name="name" v-bind:type="type" />
  </div>
  <div v-else>
    <JoinView :submit="submit" />
  </div>
</template>

<script lang="ts">
  import { defineComponent } from "vue";
  import JoinView from "./views/JoinView.vue"
  import RoomView from "./views/RoomView.vue"
  
  export default defineComponent({
    name: "App",
    methods: {
      submit(name: string, type: string) {
        this.name = name;
        this.type = type;
        this.isSubmit = true;
      }
    },
    data() {
      return {
        isSubmit: false,
        name: '',
        type: '',
      }
    },
    components: {
      JoinView,
      RoomView,
    },
  });
</script>

<style lang="scss">
* {
  box-sizing: border-box;
}
html, body {
  padding: 0;
  margin: 0;
}
#app {
  font-family: Helvetica, Arial, 'メイリオ', Meiryo,'ヒラギノ角ゴシック','Hiragino Sans',sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #111;
}
</style>
