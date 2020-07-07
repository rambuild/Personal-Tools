<template>
    <div id="app">
        <router-view />
    </div>
</template>

<script>
import home from "./components/home";

export default {
    name: "App",
    components: {
        home
    },
    methods: {
    }
};
</script>

<style>
@import url("./assets/css/base");
body{
    background-color: rgb(71, 81, 100);    
}
#app {
    height: 100vh;
    max-width: 1366px;
    margin:0 auto;
}
.el-message {
    min-width: 55% !important;
    width: 55% !important;
}
.el-message-box {
    width: 60% !important;
}
.toHome {
    position: absolute;
    top: 2%;
    left: 3%;
    width: 80px !important;
    padding: 10px !important;
}
</style>
