<template>
    <div>
        <input type="text" id="username-input">
        <button @click="login">Login</button>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { ref } from "vue";

const username = ref<string>("null username");

const router = useRouter();

const login = async () => {
    try {
        let usernameInput = document.getElementById("username-input") as HTMLInputElement;
        username.value = usernameInput.value;
        if (username) {
            const response = await fetch("http://localhost:5000/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: username.value
                })
            });

            if (!response.ok) throw new Error("Bad response");

            router.push("chat");

        } else {
            console.log("username not set");
        }
    } catch (error) {
        console.error("Failed to login: ", error);
    }
    
};
</script>