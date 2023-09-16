<script setup lang="ts">
const client = useSupabaseClient()
const user = useSupabaseUser()


async function Login() {
    await client.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: `${window.location.href}chats` } })
}

</script>

<template>
    <main class="w-full h-screen grid place-items-center place-content-center gap-y-20 text-center">
        <section class="max-w-xl space-y-5">
            <img class="mx-auto w-20 shadow-xl shadow-gray-800 rounded-3xl mb-10" src="~/assets/img/logo.jpg" alt="Logo">
            <h1 class="font-bold text-5xl">Chat with PDF for Free</h1>
            <p>Join millions of students, researchers and professionals to instantly answer questions and understand
                research with AI</p>

            <NuxtLink v-if="user" class="inline-block" to="/chats">
                <Button class="mx-auto">Go to Chats</Button>
            </NuxtLink>

            <Button v-else class="mx-auto" @click="Login()">
                Get Started
            </Button>
        </section>


        <DropZone />

    </main>
</template>