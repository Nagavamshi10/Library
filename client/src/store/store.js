import Vue from 'vue';
import Vuex from 'Vuex';
import createPersistedState from 'vuex-persistedstate'
Vue.use(Vuex);

export const store= new Vuex.Store({
    state:{
        Username:'',
        token:'',
        id:'',
        Role:''
    },
    getters:{
        Username:state=>{
            return state.Username;
        }

    },
    mutations: {
        setUsername(state, newUsername) {
            console.log("Username stored");
            Vue.set(state,"Username",newUsername);
          //state.Username = newUsername
        },
        settoken(state, newtoken) {   
            Vue.set(state,"token",newtoken); 
            //state.token = newtoken
          },
          setid(state, newid) {
            Vue.set(state,"id",newid);
            //state.id = newid
          },
          setRole(state, newRole) {
            Vue.set(state,"Role",newRole);
            //state.id = newid
          }
      },
      plugins: [createPersistedState()]
});