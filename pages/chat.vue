<style>
@import url('https://fonts.googleapis.com/css2?family=Archivo+Narrow:ital,wght@0,400..700;1,400..700&display=swap');


html,
body {
    height: 100%;
}

body {
    margin: 0 auto;
    background-color: #3b3b3b;
    font-family: "Archivo Narrow", sans-serif;
    height: 100%;
    width: 98%;
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 5vh;
    overflow: hidden;
    /* Prevent scrollbar on body */
}

.placeholder-message {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ccc;
    font-size: 1.2em;
    text-align: center;
}

#chat-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    word-wrap: break-word;
    word-break: keep-all;
    max-height: calc(100vh - 10vh);
    /* Allow room for #message-form */
    scroll-behavior: smooth;
}

#message-form {
    display: flex;
    flex-direction: row;
    margin: 0 auto;
    border-radius: .5vw;
    background-color: #525252;
    position: relative;
    width: 100%;
    height: auto;
    align-items: center;
}

#message-input {
    flex: 1;
    border: none;
    background-color: transparent;
    font-size: 1.75vw;
    padding: 1.5vh .5vw;
    /* Adjust these to control vertical centering */
    color: rgb(212, 212, 212);
    resize: none;
    overflow: hidden;
    font-family: "Archivo Narrow", sans-serif;
    box-sizing: border-box;
    /* Include padding in height calculation */
    height: auto;
}


#message-input:focus {
    border: none;
    outline: none;
}

#send-container {
    width: 5vh;
    height: 5vh;
    display: flex;
    margin-right: .5vw;
    padding-left: .5vw;
}

#send-button {
    margin: auto;
    color: #ff5778;
    font-size: 4vh;
}

#send-button:hover {
    animation: sendHover .7s forwards;
    cursor: pointer;
}

@keyframes sendHover {
    to {
        color: #ff2e58;
    }
}
</style>

<script lang="ts">
import { ref, onMounted } from 'vue';
import Message from '../components/Message.vue';
import { useRouter } from 'vue-router';

export default {
  middleware: 'auth',
  setup() {
    const router = useRouter();
    const messages = ref<Array<{ id: number; username: string; time: string; msg: string }>>([]);
    const newMessage = ref<string>('');
    const username = ref<string>("$null_username");

    function srv(endpoint: string): string {
      return `http://localhost:5000/${endpoint}`;
    }

    let adjustHeights: (isScrolledToBottom: boolean) => void;
    let scrollDown: () => void;

    const getMessages = async () => {
      try {
        const response = await fetch(srv('getMessages'));
        if (!response.ok) throw new Error('Bad network response.');
        messages.value = await response.json();
        adjustHeights(true);
      } catch (error) {
        console.error('Error: ', error);
      }
    };

    const uploadMessage = async () => {
      try {
        const response = await fetch(srv('uploadMessage'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username: username.value, msg: newMessage.value }),
        });
        if (!response.ok) throw new Error('Bad network response.');
        const newMessageData = await response.json();
        messages.value.push(newMessageData);
        newMessage.value = '';
        scrollDown();
      } catch (error) {
        console.error('Error sending message: ', error);
      }
    };

    onMounted(() => {
      const textArea = document.getElementById('message-input') as HTMLTextAreaElement;
      const chatContainer = document.getElementById('chat-container') as HTMLDivElement;

      adjustHeights = (isScrolledToBottom: boolean) => {
        if (!isScrolledToBottom) {
          isScrolledToBottom = chatContainer.scrollHeight - chatContainer.scrollTop <= chatContainer.clientHeight;
        }
        textArea.style.height = 'auto';
        textArea.style.height = `${textArea.scrollHeight}px`;
        const chatHeight = `calc(100vh - ${textArea.scrollHeight}px - 2vh)`;
        chatContainer.style.maxHeight = chatHeight;
        if (isScrolledToBottom) {
          chatContainer.scrollTop = chatContainer.scrollHeight;
        }
      };

      const uploadMessageFunction = () => {
        let msg = textArea.value;
        if (msg) {
          newMessage.value = msg;
          uploadMessage();
          textArea.value = "";
        }
      };

      document.getElementById("send-button")?.addEventListener("click", uploadMessageFunction);

      scrollDown = async () => {
        await getMessages();
        adjustHeights(true);
      };

      textArea.addEventListener('keydown', (event) => {
        if (event.key == "Enter") {
          event.preventDefault();
          uploadMessageFunction();
        } else {
          adjustHeights(false);
        }
      });

      window.addEventListener('resize', () => adjustHeights(false));
      scrollDown();
    });

    return {
      messages,
      newMessage,
      username,
      getMessages,
      uploadMessage,
    };
  },
};
</script>


<template>
    <div>
        <div> {{ username }}</div>
        <div id="chat-container">
            <Message v-for="message in messages" :key="message.id" :message="message" />
        </div>
        <form id="message-form" @submit.prevent="uploadMessage">
            <textarea v-model="newMessage" type="text" placeholder="Message your network" id="message-input" rows="1" />
            <div id="send-container">
                <send-icon id="send-button" />
            </div>
        </form>
    </div>
</template>