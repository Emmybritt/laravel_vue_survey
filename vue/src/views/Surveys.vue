<!-- This example requires Tailwind CSS v2.0+ -->
<template>  
    <PageComponent>
        <template v-slot:header>
            <div class="flex justify-between ">
                <h1 class="text-3xl font-bold text-gray-900">Surveys</h1>
                <router-link 
                :to="{name: 'SurveyCreate'}"
                class="py-2 px-3 text-white bg-emerald-500 rounded-md hover:bg-emerald-600 transition-colors">Add new Survey</router-link>
            </div>
        </template>
        <div v-if="surveys.loading" class="flex justify-center">
            Loading...
        </div>
    <div v-else>
        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
            <SurveyListItem  
            v-for="(survey, ind) in surveys.data"
            class="opacity-0 animate-fade-in-down"
            :style="{animationDelay: `${ind * 0.3}s`}"
            :key="survey.id" 
            @delete="deleteSurvey"
            :survey="survey"/>
        </div>
        <!-- <pre>{{ survey.links }}</pre> -->
        <div class="flex justify-center mt-5">
            <nav class="relative z-0 inline-flex justify-center rounded-md shadow-sm whitespace-nowrap" aria-label="Pagination">
                <a v-for="(link, i) of surveys.links"
                 :key="i" :disabled="!link.url"
                  v-html="link.label" href="#"
                   @click="getForPage($event, link)"
                    aria-current="page"
                    :class="[link.active ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600' : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50', 
                    i === 0 ? 'rounded-l-md' : '', i === surveys.links.length - 1 ? 'rounded-r-md' : '']"
                    class="relative inline-flex items-center px-4 py-2 border text-sm"></a>
            </nav>
        </div>
    </div>
        
    </PageComponent> 
    
</template>

<script setup>
import PageComponent from '../components/PageComponent.vue'
import store from '../store'
import { computed } from 'vue'
import SurveyListItem from '../components/SurveyListItem.vue'

const surveys = computed(() => store.state.surveys);

store.dispatch('getSurveys')

function deleteSurvey(survey){
    if (confirm("are you sure you want to delete this survey? Operation can't be undone")) {
        store.dispatch('deleteSurvey', survey.id).then(() => {
            store.dispatch('getSurveys');
        })
    }
}

function getForPage(ev, link) {
    ev.preventDefault();
    if (!link.url || link.active) {
        return;
    }
    store.dispatch("getSurveys", {url: link.url});
}
</script>