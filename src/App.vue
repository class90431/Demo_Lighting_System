<template>
    <div id="app">
        <Navbar />
        <router-view class="h-custom" />
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Navbar from './components/Navbar.vue'
@Component({
    components: { Navbar }
})
export default class App extends Vue {}
</script>

<style lang="scss">
@import './src/assets/reset.scss';
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
}
.h-custom {
    height: calc(100vh - 56px);
}
</style>
