import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import VueAxios from 'vue-axios'
import { token } from "../common/helper";
Vue.use(Vuex)
Vue.use(VueAxios, axios)

const storeData = {
   state: {
      managers: []
   },
   actions: {
      loadManagers({ commit }) {
         axios
            .get("http://localhost:4040/manager")
            .then(res => res.data)
            .then(managers => { commit('SET_MANAGERS', managers) });
      },
      delManagers({ commit }, id) {
         axios
            .delete(`http://localhost:4040/manager/${id}`, token)
            .then(() => { commit('DELETE_MANAGERS', id) });
      },
      addManagers({ commit }, data) {
         axios
            .post(`http://localhost:4040/manager`, data, token)
            .then(res => { commit('ADD_MANAGERS', res) });
      },
      updateManagers({ commit }, data) {
         const id = data.id
         axios
            .put(`http://localhost:4040/manager/${id}`, data.data)
            .then(res => { commit('UPDATE_MANAGERS', res) });
      },
   },
   mutations: {
      SET_MANAGERS(state, managers) {
         state.managers = managers
      },
      DELETE_MANAGERS(state, id) {
         state.managers = state.managers.filter(item => item._id != id)
      },
      ADD_MANAGERS(state, data) {
         if (data.status === 200) {
            state.managers.push(data.data)
         }
      },
      UPDATE_MANAGERS(state, data) {
         const id = data.config.url.split('').splice(30, 24).join('')
         const obj = JSON.parse(data.config.data)
         state.managers.forEach((element, index) => {
            if (element._id === id) {
               let object = {
                  user_name: element.user_name,
                  full_name: obj.full_name === '' ? element.full_name : obj.full_name,
                  is_login: obj.is_login === false ? false : true,
                  _id: element._id,
                  password: element.password
               }
               state.managers.splice(index, 1, object)
            }
         });

      }
   }
}
const store = new Vuex.Store(storeData)

export default store