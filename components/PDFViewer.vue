<script setup lang="ts">
const props = defineProps<{
    url: string
}>()
</script>

<template>
    <iframe :src="props.url" class="w-full h-screen" frameborder="0"></iframe>
</template>