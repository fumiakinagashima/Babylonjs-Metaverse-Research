<template>
  <div class="wrap">
    <canvas></canvas>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { MainScene } from '../babylon/MainScene';

// For Canvas
let ws: WebSocket;
let scene: MainScene;

const sendMessage = (params: Object) => { ws.send(JSON.stringify(params)) }

window.addEventListener("resize", () => {
  if (scene) scene.Resize();
})

export default defineComponent({
  name: "Canvas",
  props: ['name', 'type'],
  mounted() {
    const canvas = document.querySelector("canvas") as HTMLCanvasElement;    
    fetch('http://localhost:9000/join', {
        method: 'POST',
        headers: { 'Content-type': 'application/json;charaset=UTF-8' },
        body: JSON.stringify({
            name: this.name,
            type: this.type
        })
    })
    .then(response => response.json())
    .then(json => {
      // Web Socket 
      ws = new WebSocket("ws://localhost:9999");
      ws.onopen = () => {
        const sendData = {
          event: 'connected',
          data: json
        }
        ws.send(JSON.stringify(sendData));
        scene = new MainScene(canvas, json.position, json.rotation, sendMessage);
      }
      ws.onmessage = (msg) => {
        const data = JSON.parse(msg.data);
        const { id, name, type, position, rotation } = data.data;
        switch (data.event) {
          case 'load':
            scene.LoadCharacterAsync(id, name, type, position, rotation);
          break;
          case 'moving':
            scene.MovingCharacter(id, position, rotation);
          break;
          case 'disconnect':
            scene.RemoveCharacter(id);
          break;
        }        
      }
    })
    .catch(() => {
      scene = new MainScene(canvas, [0, 0, 12], [0, 0, 0], null);
    });
  },
  updated() {
    scene.Resize();
  }  
});

</script>

<style scoped lang="scss">
  .wrap {
    width: 100vw;
    height: 100vh;
    overflow: hidden;
  }
  canvas {
    width: 100%;
    height: 100%;
    &:focus {
      outline: none;
    }
  }
  .chat-wrap {
    width: 280px;
    padding: 16px;
    background-color: #f0f0f2;
    border-left: 1px solid #aaa;
  }
 
</style>