<template>
  <h3>Edit your avater.</h3>
  <div class="form-wrap">
    <div>
      <input class="namefield" type="text" v-model="name" placeholder="Your name." />
    </div>
    <div class="chara-wrap">
      <label class="chara">
        <input type="radio" value="white" v-model="type" selected />
        <div class="img-wrap"><img src="../assets/avater_white.png" /></div>
        <p class="color">White</p>
      </label>
      <label class="chara">
        <input type="radio" value="red" v-model="type" />
        <div class="img-wrap"><img src="../assets/avater_red.png" /></div>
        <p class="color">Red</p>
      </label>
      <label class="chara">
        <input type="radio" value="blue" v-model="type" />
        <div class="img-wrap"><img src="../assets/avater_blue.png" /></div>
        <p class="color">Blue</p>
      </label>
    </div>
    <div>
      <button @click="submit(name, type)" class="btn-join">Join</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({ 
  name: "JoinView",
  props: {
    submit: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
      name: '',
      type: 'white'
    }
  },
});

</script>

<style scoped lang="scss">
  .wrap {
    display: flex;
    justify-content: center;
    flex-direction: column;
  }
  h3 {
    font-size: 18px;
    font-weight: 500;
    color: #333;
    text-align: center;
  }
  .form-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 40px;
  }
  .namefield {
    padding: 8px;
    border-radius: 4px;
    border: 1px solid #aaa;
    width: 240px;
    font-size: 14px;
  }
  .btn-join {
    background-color: #08d;
    color: #fff;
    border: 0;
    padding: 8px 24px;
    border-radius: 4px;
    cursor: pointer;
    &:hover {
      opacity: 0.85;
    }
  }
  .chara-wrap {
    display: flex;
    justify-content: center;
    gap: 30px;
  }
  .chara {
    display: block;
    width: 80px;
    & .img-wrap {
      padding: 0 6px;
      border: 2px solid #ccc;
    }
    & img {
      width: 100%;
    }
    & input {
      display: none;
      &:checked + .img-wrap {
        border-color: #08d;
      }
    }
    & .color {
      padding: 0;
      margin: 5px 0 0 0;
      text-align: center;
      font-size: 0.9rem;
    }
  }
  
</style>
