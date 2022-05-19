import { createStore } from "vuex";
import axiosClient from "../axios";

const tmpSurveys = [
  {
    id: 100,
    title: "The emmy britt Youtube channel content",
    slug: "The emmy britt Youtube channel content",
    status: "draft",
    image: "",
    description:
      "my name is emmybritt and i am a developer with 3+ years of experience",
    created_at: "2021-12-20",
    updated_at: "2021-12-20",
    expire_date: "2021-12-31",
    questions: [
      {
        id: 1,
        type: "select",
        question: "From which country are you",
        description: null,
        data: {
          options: [
            { uuid: "qbdjwbiwug928ey02eidhwid", text: "USA" },
            { uuid: "demlpoijepw0eoi-ewqepke", text: "Goergia" },
            { uuid: "y8henwkjeboewoieipweee", text: "Germany" },
            { uuid: "gu9eneswnelkwnlkenjwene", text: "Indian" },
          ],
        },
      },
      {
        id: 2,
        type: "checkbox",
        question: "which language video do you want to see in my channel",
        description: "lorem ipsum dorlar sitame consectetuar",
        data: {
          options: [
            { uuid: "74hoe-hgrywg-lqhwgie-ikehr-ihdi", text: "Javascript" },
            { uuid: "uerh9-39r20u-3rbaljpe-oqie-oej0", text: "PHP" },
            { uuid: "thwie-powieh-ph920u-0e9hwk-0wud", text: "HTML + CSS" },
            { uuid: "djwot-9879t8-ey929gd-7820h-sadlr", text: "Laravel" },
          ],
        },
      },
      {
        id: 3,
        type: "checkbox",
        question: "which language video do you want to see in my channel",
        description: "lorem ipsum dorlar sitame consectetuar",
        data: {
          options: [
            { uuid: "74hoe-hgrywg-lqhwgie-ikehr-ihdi", text: "Javascript" },
            { uuid: "uerh9-39r20u-3rbaljpe-oqie-oej0", text: "PHP" },
            { uuid: "thwie-powieh-ph920u-0e9hwk-0wud", text: "HTML + CSS" },
            { uuid: "djwot-9879t8-ey929gd-7820h-sadlr", text: "Laravel" },
          ],
        },
      },
      {
        id: 4,
        type: "radio",
        question: "which laravel framework do you love the most",
        description: "lorem ipsum dorlar sitame consectetuar",
        data: {
          options: [
            { uuid: "74hoe-hgrywg-lqhwgie-ikehr-ihdi", text: "Laravel 5" },
            { uuid: "uerh9-39r20u-3rbaljpe-oqie-oej0", text: "Laravel 6" },
            { uuid: "thwie-powieh-ph920u-0e9hwk-0wud", text: "Laravel 7" },
            { uuid: "djwot-9879t8-ey929gd-7820h-sadlr", text: "Laravel 8" },
          ],
        },
      },
      {
        id: 5,
        type: "text",
        question: "Whats is your favourite chaneel",
        description: null,
        data: {},
      },
      {
        id: 6,
        type: "textarea",
        question: "Whats do you think about emmy britt",
        description: "Write your honest opinion everything is anonymous",
        data: {},
      },
    ],
  },
  {
    id: 300,
    title: "Laravel 8",
    slug: "Laravel 8",
    status: "active",
    image: "",
    description: "Laravel is a web application",
    created_at: "2021-12-20",
    updated_at: "2021-12-20",
    expire_date: "2021-12-31",
    questions: [],
  },
  {
    id: 400,
    title: "Vue 3",
    slug: "Vue 3",
    status: "active",
    image: "",
    description: "vue 3 is a web application",
    created_at: "2021-12-20",
    updated_at: "2021-12-20",
    expire_date: "2021-12-31",
    questions: [],
  },
  {
    id: 500,
    title: "Tailwindcss 3",
    slug: "Tailwindcss 3",
    status: "active",
    image: "",
    description: "Tailwindcss 3 is a web application",
    created_at: "2021-12-20",
    updated_at: "2021-12-20",
    expire_date: "2021-12-31",
    questions: [],
  },
];

const store = createStore({
  state: {
    user: {
      data: {},
      token: sessionStorage.getItem("TOKEN"),
    },
    currentSurvey: {
      loading: false,
      data: {},
    },
    surveys: {
      loading: false,
      links: [],
      data: [],
    },
    questionTypes: ["text", "select", "radio", "checkbox", "textarea"],
    notification: {
      show: false,
      message: null,
      type: null,
    },
  },
  getters: {},
  actions: {
    getSurveyBySlug({ commit }, slug) {
      commit("setCurrentSurveyLoading", true);
      return axiosClient
        .get(`/survey-by-slug/${slug}`)
        .then((res) => {
          commit("setCurrentSurvey", res.data);
          commit("setCurrentSurveyLoading", false);
          return res;
        })
        .catch((err) => {
          commit("setCurrentSurveyLoading", false);
          throw err;
        });
    },
    getSurveys({ commit }, { url = null } = {}) {
      url = url || "/survey";
      commit("setSurveysLoading", true);
      return axiosClient.get(url).then((res) => {
        commit("setSurveysLoading", false);
        commit("setSurveys", res.data);
        return res;
      });
    },
    getSurvey({ commit }, id) {
      commit("setCurrentSurveyLoading", true);
      return axiosClient
        .get(`/survey/${id}`)
        .then((res) => {
          commit("setCurrentSurvey", res.data);
          commit("setCurrentSurveyLoading", false);
          return res;
        })
        .catch((err) => {
          commit("setCurrentSurveyLoading", false);
          throw err;
        });
    },
    saveSurvey({ commit }, survey) {
      delete survey.image_url;
      let response;
      if (survey.id) {
        response = axiosClient
          .put(`/survey/${survey.id}`, survey)
          .then((res) => {
            commit("setCurrentSurvey", res.data);
            return res;
          });
      } else {
        response = axiosClient.post("/survey", survey).then((res) => {
          commit("setCurrentSurvey", res.data);
          return res;
        });
      }
      return response;
    },
    logout({ commit }) {
      return axiosClient.post("/logout").then((response) => {
        commit("logout");
        return response;
      });
    },
    register({ commit }, user) {
      return axiosClient.post("register", user).then(({ data }) => {
        commit("setUser", data);
        return data;
      });
    },
    login({ commit }, user) {
      return axiosClient.post("/login", user).then(({ data }) => {
        commit("setUser", data);
        return data;
      });
    },
    deleteSurvey({}, id) {
      return axiosClient.delete(`survey/${id}`);
    },
  },
  mutations: {
    setCurrentSurveyLoading: (state, loading) => {
      state.currentSurvey.loading = loading;
    },
    setCurrentSurvey: (state, survey) => {
      state.currentSurvey.data = survey.data;
    },
    setSurveysLoading: (state, loading) => {
      state.surveys.loading = loading;
    },
    setSurveys: (state, surveys) => {
      state.surveys.data = surveys.data;
      state.surveys.links = surveys.meta.links;
    },
    // saveSurvey: (state, survey) => {
    // 	state.surveys = [...state.surveys, survey.data];
    // },
    // updateSurvey: (state, survey) => {
    // 	state.surveys = state.surveys.map((s) => {
    // 		if (s.id == survey.data.id) {
    // 			return survey.data;
    // 		}
    // 		return s;
    // 	});
    // },
    logout: (state) => {
      (state.user.data = {}), (state.user.token = null);
    },
    setUser: (state, userData) => {
      state.user.token = userData.token;
      state.user.data = userData.user;
      sessionStorage.setItem("TOKEN", userData.token);
    },

    notify: (state, { message, type }) => {
      state.notification.show = true;
      state.notification.type = type;
      state.notification.message = message;
      setTimeout(() => {
        state.notification.show = false;
      }, 3000);
    },
  },
  modules: {},
});

export default store;
