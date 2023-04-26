<template>
                <keep-alive>
                    <component :is="selectedComponent">
                    </component>
                </keep-alive>
</template>

<script>
    import LoginPage from './LoginPage.vue';
    import StudentDash from './operations/stu/studentHome.vue';
    import LectureDash from './operations/lec/lectureHome.vue';
    import AdminDash from './operations/adm/adminHome.vue';
    export default {
        data: function() {
            return {
                selectedComponent: 'appDefault',
                Role: this.$store.state.Role
            }
        },
        components: {
            appStudent:StudentDash,
            appLecture:LectureDash,
            appAdmin:AdminDash,
            appDefault:LoginPage
        },
        methods:{
            getRenderPage(){
                if(this.Role=='student'){
                    this.selectedComponent='appStudent';
                }else if(this.Role=='Admin'){
                    this.selectedComponent='appAdmin';
                }else{
                    this.selectedComponent='appLecture';
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