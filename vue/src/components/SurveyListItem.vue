<template>
  <div>
      <div
        class="
        flex flex-col 
        py-4
        px-6
        shadow-md
        bg-white
        hover:bg-gray-50
        h-[470px]">
        <img :src="survey.image_url" :alt="survey.title" class="w-full h-48 object-cover">
        <h4 class="mt-4 text-lg font-bold">{{ survey.title }}</h4>
        <div v-text="survey.description" class="overflow-hidden flex-1"></div>
        <div class="flex justify-between items-center mt-3">
        <router-link
        :to="{ name: 'SurveyView', params: {id: survey.id} }"
        class="flex py-2 px-4 border border-transparent text-sm 
        rounded-md text-white bg-indigo-600 
        hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Edit</router-link>
          <div class="flex items-center ">
            <a :href="`/view/survey/${survey.slug}`" 
            class="h-8 w-8 items-center 
            justify-center rounded-full 
            border border-transparent text-sm 
            text-indigo-500 focus:ring-2
            focus:ring-offset-2 focus:ring-indigo-500" target="_blank">link</a>
            <button
            v-if="survey.id"
            type="button"
            @click="emit('delete', survey)"
            class="h-8 w-8 hover:bg-red-500  transition-colors hover:text-white flex items-center 
            justify-center rounded-full border 
            border-transparent text-sm
            text-red-500 focus:ring-2 focus:ring-offset-2 focus:ring-red-500">&times;</button>
          </div>
          </div>
        </div>
  </div>
</template>

<script setup>
const {survey} = defineProps({
    survey: Object,
})
const emit = defineEmits(['delete']);

</script>

<style>

</style>