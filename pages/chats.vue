<script setup lang="ts">
const client = useSupabaseClient();
const route = useRoute()
const url = ref()

onBeforeMount(() => {
    url.value = route.query.url
})

async function Logout() {
    await client.auth.signOut();
    useToast().success("Logged out successfully")
    navigateTo("/");

}

</script>

<template>
    <main>
        <h1>Chats</h1>

        <PDFViewer :url="url" />

        <Button @click="Logout()">Logout</Button>
    </main>
</template>