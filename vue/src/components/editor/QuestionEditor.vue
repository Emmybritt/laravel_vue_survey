<template>
  <div>
		<div class="flex items-center justify-between">
		<h3 class="text-lg font-bold">
			{{ index + 1 }}. {{ model.question }}
		</h3>

		<div class="flex items-center">
			<!-- Add new question -->
				<button type="button" @click="addQuestion()" class="
				flex items-center text-xs py-1 px-3 mr-2 rounded-sm text-white bg-gray-600 hover:bg-gray-700">
					Add
					 <svg
						class="w-6 h-6"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg">
						<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 6v6m0 0v6m0-6h6m-6 0H6"
						></path>
				</svg>
				</button>
			<!-- / Add new question -->

			<!-- Delete question -->
			<button type="button" @click="deleteQuestion" class="
			flex items-center text-xs py-1 px-3 mr-2 rounded-sm text-white bg-red-600 hover:bg-red-700">Delete</button>
			<!-- / Delete question -->

		</div>
	</div>
	<!-- / Question index -->
	<div class="grid gap-3 grid-cols-12">
		<!-- Question -->
		<div class="mt-3 col-span-9">
			<label :for="'question_text_'+ model.data"
			class="block text-sm font-medium text-gray-700">Question text</label>
			<input type="text" :name="'question_text_'+model.data" v-model="model.question"
			 @change="dataChange" :id="'question_text_' + model.data"
			 class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
		</div>
		<!-- / Question -->

		<!-- Question Type -->
		<div class="mt-3 col-span-3">
			<label for="question_type" class="block text-sm font-medium text-gray-700">Select Question Type</label>
			<select name="question_type" id="question_type" v-model="model.type" @change="typeChange" class="
			mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 sm:text-sm">
				<option v-for="type in question_Types" :value="type" :key="type">
					{{ upperCaseFirst(type) }}
				</option>
			</select>
		</div>
		<!-- / Question Type -->
		
	</div>

	<!-- Question Description -->
		<div class="mt-3 col-span-9">
			<label :for="'question_description_' + model.id" class="block text-sm font-medium text-gray-700">Description</label>
			<textarea 
			:name="'question_description_' + model.id" 
			id="'question_description_' + model.id"
			v-model="model.description" @change="dataChange"
			class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md "></textarea>
		</div>
	<!-- / Question Description -->

	<!-- Data -->
	<div>
		<div v-if="shouldHaveOptions()" class="mt-2">
			<h4 class="text-sm font-semibold mb-1 flex justify-between items-center">
				Options
				<!-- Add new option -->
				<button type="button" @click="addOption()" class="
				flex items-center text-xs py-1 px-2 rounded-sm text-white bg-gray-600 hover:bg-gray-700">
				Add Option
				<svg
						class="w-6 h-6"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg">
						<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 6v6m0 0v6m0-6h6m-6 0H6"
						></path>
				</svg>
				</button>
				<!--/ Add new option -->
			</h4>
			<div v-if="!model.data.options.length"
			class="text-xs text-gray-600 text-center py-3">
				You don't have any options defined
			</div>
			<!-- Option List -->
			<div v-for="(option, index) in model.data.options" :key="option.uuid" 
			class="flex items-center mb-1">
				<span class="w-6 text-sm">{{ index + 1}}</span>
				<input type="text" v-model="option.text" @change="dataChange" 
				class="w-full rounded-sm py-1 px-2 text-sm border border-gray-300 focus:border-indigo-500">
				<!-- Delete Option -->
				<button @click="removeOption(option)" type="button" class="
				h-6 w-6 rounded-full flex items-center justify-center border border-transparent transition-colors hover:border-red-100">del</button>
				<!-- /Delete Option -->
			</div>
			<!--/ Option List -->
		</div>
	</div>
	<!--/ Data -->
	<hr class="my-4">
	</div>
</template>

<script setup>
import { ref, computed } from 'vue';
import store from '../../store';
import { v4 as uuidv4 } from "uuid"


const props = defineProps({
  question: Object,
	index: Number
});

const emit = defineEmits(['change', 'addQuestion', 'deleteQuestion']);

const model = ref(JSON.parse(JSON.stringify(props.question)));

const question_Types = computed(() => store.state.questionTypes);

function upperCaseFirst(str){
	return str.charAt(0).toUpperCase() + str.slice(1)
}

function shouldHaveOptions(){
	return ["select", "radio", "checkbox"].includes(model.value.type);
}

function getOptions() {
	return model.value.data.options;
}

function setOptions(options) {
	model.value.data.options = options;
}

function addOption() {
	setOptions([
		...getOptions(),
		{ uuid: uuidv4(), text: "" },
	]);
	dataChange();
}

function removeOption(op) {
	setOptions(getOptions().filter((opt) => opt !== op));
	dataChange();
}

function typeChange(){
	if (shouldHaveOptions()) {
		setOptions(getOptions() || []);
	}
	dataChange()
}

function dataChange() {
	const data = JSON.parse(JSON.stringify(model.value));
	if (!shouldHaveOptions()) {
		delete data.data.options;
	}
	emit("change", data);
}

function addQuestion(){
		emit("addQuestion", props.index + 1)
	}

	function deleteQuestion(){
		emit("deleteQuestion", props.question)
	}
</script>

<style>

</style>