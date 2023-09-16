<script setup lang="ts">
const client = useSupabaseClient()

const user = useSupabaseUser()

const isProcessing = ref(false)

const fileName = ref<string>('')


async function Login() {
    await client.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: `${window.location.href}chats` } })
}


async function handleUpload({ file_key, file_name }: { file_key: string, file_name: string }) {


    try {
        fileName.value = file_name
        isProcessing.value = true

        const { data } = await useFetch('/api/create-chat', { method: 'post', body: { file_key, file_name, user_id: user.value?.id } })

        if (data.value?.chat_id) {
            navigateTo(`/chats?id=${data.value?.chat_id}&url=${data.value?.pdf_url}`)
        }

    }

    catch (error) {
        useToast().error(error as string)
    }

    finally {
        isProcessing.value = false
        fileName.value = ''
    }


}


</script>

<template>
    <main class="w-full h-screen grid place-items-center place-content-center gap-y-20 text-center p-5">
        <section class="max-w-xl space-y-5">
            <img class="mx-auto w-20 shadow-xl shadow-gray-800 rounded-3xl mb-10" src="@/assets/img/logo.jpg" alt="Logo">
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


        <section v-if="isProcessing" class="p-1.5 h-auto bg-white rounded-xl text-dark">
            <div class="flex flex-col w-96 px-1 gap-y-2 justify-center items-center border-2 border-dashed rounded-xl border-gray-400 text-slate-500 bg-gray-100 py-8 cursor-wait"
                for="file">
                <BlockWaveLoader />

                Studying {{ fileName }}...
            </div>
        </section>

        <DropZone v-else @uploaded="handleUpload($event)" v-if="user" />

    </main>
</template>