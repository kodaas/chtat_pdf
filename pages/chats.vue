<script setup lang="ts">
const client = useSupabaseClient();

async function Logout() {
    await client.auth.signOut();
    navigateTo("/");

}
</script>

<template>
    <main>
        <h1>Chats</h1>
        <Button @click="Logout()">Logout</Button>
    </main>
</template>