<template>
  <div id="message">
    <div>{{ message.username }} ▪ {{ message.time }}</div>
    <div>{{ message.msg }}</div>
  </div>
</template>

<script lang="ts" setup>
interface Message {
  id: number;
  username: string;
  time: string;
  msg: string;
}

const props = defineProps<{ message: Message }>();
</script>


<style>

#message {
    margin: 1vh 0;
    color: rgb(212, 212, 212);
}

</style>