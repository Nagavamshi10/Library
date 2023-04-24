import Vue from "vue";
import VueRouter from 'vue-router';
import LoginPage from '../components/LoginPage.vue';
import MainDash from '../components/MainDash.vue';
import StudentHome from '../components/operations/stu/StuBooks.vue';
import LectureHome from '../components/operations/lec/LecBook.vue';
import AdminHome from '../components/operations/adm/AdmBooks.vue';
import logout from '../components/operations/LogOut.vue';
import Notify from '../components/operations/adm/NoteRequest.vue';
import Register from '../components/operations/adm/RegisterUser.vue';
import deletes from '../components/operations/adm/DeleteUser.vue';
import adds from '../components/operations/adm/AddBook.vue';
import forget from '../components/forgetpassword.vue';
import reset from '../components/reset.vue';
import { store } from '../store/store';
Vue.use(VueRouter);



// function userIsAuthenticated(currentUser) {
//   return currentUser !== null;
// }

// function userHasRole(currentUser,role) {
//   return currentUser.role === role;
// }

const routes = [
    {
        path: '/',
        name: 'Login',
        component: LoginPage,
        meta: {
            requiresAuth: false,
            requiredRole: null
          }
    },
    {
        path: '/MainDash',
        name: 'MainDash',
        component: MainDash,
        meta: {
            requiresAuth: true,
            requiredRole: null
          }
    },
    {
        path: '/StudentHome',
        name: 'StudentHome',
        component: StudentHome,
        meta: {
            requiresAuth: true,
            requiredRole: 'student'
          }
    },
    {
        path: '/AdminHome',
        name: 'AdminHome',
        component: AdminHome,
        meta: {
            requiresAuth: true,
            requiredRole: 'Admin'
          }
    },
    {
        path: '/LectureHome',
        name: 'LectureHome',
        component: LectureHome,
        meta: {
            requiresAuth: true,
            requiredRole: 'Lecture'
          }
    },
    {
        path: '/Notification',
        name: 'Notification',
        component: Notify,
        meta: {
            requiresAuth: true,
            requiredRole: 'Admin'
          }
    },
    {
        path: '/Register',
        name: 'Register',
        component: Register,
        meta: {
            requiresAuth: true,
            requiredRole: 'Admin'
          }
    },
    {
        path: '/Users',
        name: 'Users',
        component: deletes,
        meta: {
            requiresAuth: true,
            requiredRole: 'Admin'
          }
    },
    {
        path: '/AddBooks',
        name: 'AddBooks',
        component: adds,
        meta: {
            requiresAuth: true,
            requiredRole: 'Admin'
          }
    },
    {
        path: '/logout',
        name: 'logout',
        component: logout,
        meta: {
            requiresAuth: false,
            requiredRole: null
          }
    },
    {
        path: '/forget',
        name: 'forget',
        component: forget,
        meta: {
            requiresAuth: false,
            requiredRole: null
          }
    },
    {
        path: '/reset',
        name: 'reset',
        component: reset,
        meta: {
            requiresAuth: false,
            requiredRole: null
          }
    }
]
const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
  })
  router.beforeEach((to, from, next) => {
    const currentUser = { username:store.state.Username, role: store.state.Role };
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
    const requiredRole = to.meta.requiredRole;
    console.log(requiresAuth);
    let isRole=true;
    if(requiredRole===null){
        isRole=false;
    }else{
        isRole=true;
    }
    console.log(isRole);
    console.log(currentUser);
    if (requiresAuth && !(currentUser.username !=='')) {
        router.push('/');
    } else if (isRole && !(currentUser.role === requiredRole)) {
        if(requiredRole!==null){
            router.push('/MainDash');
        }else{
            router.push('/');
        }
         // or redirect to any unauthorized page
    } else {
      next();
    }
  });
  
export default router
