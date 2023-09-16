<script setup lang="ts">
const client = useSupabaseClient();

const url = "https://hlzhuospindjbgypbuta.supabase.co/storage/v1/object/public/chat_pdf/60438561-2271-4106-a668-84892b0410d8/1694856773091-Byte_pair_encoding_-_Wikipedia.pdf"

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