<template>
    <div>
        <wrapper>
            <legend>Home</legend>

            <p v-for="app in activeApps">
                <router-link :to="app.path">{{app.name}}</router-link>
                : {{app.desc}}
            </p>
        </wrapper>
    </div>
</template>

<script>
    import wrapper from './components/formWrapper.vue';

    export default {
        props: [],
        components: {
            wrapper
        },
        computed: {
            activeApps: function () {
                var holderArr = [];
                this.$router.options.routes.forEach(function (appObj) {
                    if (appObj.desc) {
                        holderArr.push(appObj);
                    }
                });

                return holderArr;
            }
        }
    };
</script>
