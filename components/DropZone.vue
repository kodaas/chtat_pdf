<script setup lang="ts">
const client = useSupabaseClient()

const user = useSupabaseUser()

const dropZoneRef = ref<HTMLElement>()

const SelectedFile = ref<File | null>(null)

const BUCKET_NAME = 'chat_pdf'

const { isOverDropZone } = useDropZone(dropZoneRef, onDrop)

const emit = defineEmits(['uploaded'])

const isUploading = ref(false)


// Method

function onDrop(_files: File[] | null) {
    if (Array.isArray(_files)) {

        if (_files[0].type === 'application/pdf') {
            SelectedFile.value = _files[0]
        }
    }
}

function onChange(event: Event) {
    const target = event.target as HTMLInputElement
    const _files = target.files

    if (_files) {

        if (_files[0].type === 'application/pdf') {

            SelectedFile.value = _files[0]
        }
    }
}

async function uploadFile(file: File) {

    const file_key = `${user.value?.id}/${Date.now().toString()}-${file.name.replaceAll(' ', '_')}`

    await client.storage.from(BUCKET_NAME).upload(file_key, file, {
        contentType: file.type
    })

    return {
        file_key, file_name: file.name
    }
}

watchEffect(async () => {
    if (SelectedFile.value) {

        if (SelectedFile.value.size > (10 * 1024 * 1024)) {
            useToast().error('File size is too large')
            SelectedFile.value = null
            return
        }

        try {
            isUploading.value = true

            const { file_key, file_name } = await uploadFile(SelectedFile.value!)
            useToast().success("File uploaded successfully")
            emit('uploaded', { file_key, file_name })
        }
        catch (error) {
            useToast().error("Something went wrong")
        }
        finally {
            SelectedFile.value = null
            isUploading.value = false
        }
    }

})

</script>

<template>
    <section v-if="!SelectedFile" class="p-1.5 h-auto bg-white rounded-xl text-dark">

        <label
            class="relative flex flex-col w-96 gap-y-2 justify-center items-center border-2 border-dashed rounded-xl border-gray-400 text-slate-500 bg-gray-100 py-8 cursor-pointer"
            :class="{ 'backdrop-blur-sm': isOverDropZone }" ref="dropZoneRef" for="file">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
                <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="1.5">
                    <path stroke-linejoin="round" d="M12 2v8m0 0l3-3m-3 3L9 7" opacity=".5" />
                    <path
                        d="M2 13h3.16c.905 0 1.358 0 1.756.183c.398.183.692.527 1.281 1.214l.606.706c.589.687.883 1.031 1.281 1.214c.398.183.85.183 1.756.183h.32c.905 0 1.358 0 1.756-.183c.398-.183.692-.527 1.281-1.214l.606-.706c.589-.687.883-1.031 1.281-1.214c.398-.183.85-.183 1.756-.183H22"
                        opacity=".5" />
                    <path
                        d="M17 2.127c1.625.16 2.72.521 3.535 1.338C22 4.929 22 7.286 22 12s0 7.071-1.465 8.536C19.072 22 16.714 22 12 22s-7.071 0-8.536-1.464C2 19.07 2 16.714 2 12c0-4.714 0-7.07 1.464-8.535c.817-.817 1.91-1.178 3.536-1.338" />
                </g>
            </svg>

            Drop Pdf Here

            <span v-show="isOverDropZone" class="absolute inset-0 bg-dark/10 backdrop-blur-sm rounded-xl"></span>
        </label>

        <input accept="application/pdf" @change="onChange" :disabled="SelectedFile !== null" type="file" name="file"
            id="file" class="appearance-none hidden">
    </section>

    <section v-if="SelectedFile && isUploading" class="p-1.5 h-auto bg-white rounded-xl text-dark">
        <div class="flex flex-col w-96 gap-y-2 justify-center items-center border-2 border-dashed rounded-xl border-gray-400 text-slate-500 bg-gray-100 py-8 cursor-wait"
            for="file">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
                <path fill="currentColor"
                    d="M10.72,19.9a8,8,0,0,1-6.5-9.79A7.77,7.77,0,0,1,10.4,4.16a8,8,0,0,1,9.49,6.52A1.54,1.54,0,0,0,21.38,12h.13a1.37,1.37,0,0,0,1.38-1.54,11,11,0,1,0-12.7,12.39A1.54,1.54,0,0,0,12,21.34h0A1.47,1.47,0,0,0,10.72,19.9Z">
                    <animateTransform attributeName="transform" dur="0.75s" repeatCount="indefinite" type="rotate"
                        values="0 12 12;360 12 12" />
                </path>
            </svg>

            Uploading {{ SelectedFile?.name }}...
        </div>
    </section>
</template>