<template>
                <keep-alive>
                    <component :is="selectedComponent">
                    </component>
                </keep-alive>
</template>

<script>
    import LoginPage from './LoginPage.vue';
    import StudentDash from './operations/stu/StuBooks.vue';
    import LectureDash from './operations/lec/LecBook.vue';
    import AdminDash from './operations/adm/AdmBooks.vue';
    export default {
        data: function() {
            return {
                selectedComponent: 'appLog',
                myData: this.$store.state.Role
            }
        },
        components: {
            appStu:StudentDash,
            appLec:LectureDash,
            appAdm:AdminDash,
            appLog:LoginPage
        },
        methods:{
            getRenderPage(){
                if(this.myData=='student'){
                    this.selectedComponent='appStu';
                }else if(this.myData=='Admin'){
                    this.selectedComponent='appAdm';
                }else{
                    this.selectedComponent='appLec';
                }
            }
        },
        mounted(){
            this.getRenderPage();
        }
    }
</script>

<style scoped>

.button-bar {
  display: flex;
  justify-content: right;
  align-items: center;
  background-color: #333;
  color: #fff;
  padding: 1rem;
}
</style>