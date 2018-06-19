<template>
    <div>
        <nav-bar></nav-bar>
        <router-view></router-view>
    </div>
</template>

<script>
    import navBar from './components/navBar.vue';

    export default {
        props: [],
        components: {
            navBar
        }
    };
</script>