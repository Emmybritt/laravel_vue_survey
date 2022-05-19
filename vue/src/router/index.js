import { createRouter, createWebHistory } from "vue-router";
import Dashboard from '../views/Dashboard.vue';
import Surveys from '../views/Surveys.vue';
import SurveyView from '../views/SurveyView.vue';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import DefaultLayout from '../components/DefaultLayout.vue';
import store from '../store'
import AuthLayout from '../components/AuthLayout.vue';
import SurveyPublicView from '../views/SurveyPublicView.vue';


const routes = [
	{
		path: '/view/survey/:slug',
		name: 'SurveyPublicView',
		component: SurveyPublicView,
	},
	{
		path: '/',
		redirect: '/dashboard',
		component: DefaultLayout,
		meta: {requireAuth: true},
		children: [
			{path: '/dashboard', name: 'Dashboard', component: Dashboard},
			{path: '/surveys', name: 'Surveys', component: Surveys},
			{path: '/surveys/create', name: 'SurveyCreate', component: SurveyView},
			{path: '/survey/:id', name: 'SurveyView', component: SurveyView}
		]
	},
	{
		path: '/auth',
		redirect: '/login',
		name: 'Auth',
		component: AuthLayout,
		meta: {isGuest: true},
		children: [
			{ path: '/login', name: 'Login', component: Login },
			{ path: '/register', name: 'Register', component: Register }
		]
	}
	
];

const router = createRouter({
  history: createWebHistory(),
	routes
});

router.beforeEach((to, from, next) => {
	if (to.meta.requireAuth && !store.state.user.token) {
		next({name: 'Login'})
	}else if(store.state.user.token && (to.meta.isGuest)){
		next({name: 'Dashboard'})
	}else{
		next()
	}
})

export default router;