<template>
    <div>
        <wrapper>
            <legend>Recipe Display</legend>
            <display v-for="(obj, index) in recipeArr" :recipeObj="obj"/>
        </wrapper>
    </div>
</template>

<script>
    import wrapper from './components/formWrapper.vue';
    import formElement from './components/formElement.vue';
    import display from './components/recipeDisplay.vue';

    import apiService from './services/api';

    export default {
        components: {
            formElement,
            wrapper,
            display
        },
        data: function () {
            return {
                recipeArr: []
            };
        },
        watch: {
            'recipeArr': function () {
                JSON.stringify(this.recipeArr);
            }
        },
        mounted: function () {
            var self = this;
            //  This is really ugly... maybe too ugly.
            this.$nextTick(
                    function () {
                        apiService.getRecipes().then(function (arr) {
                            self.recipeArr = arr;
                        });
                    }
            );

        },
        methods: {
            addId: function (arr, id) {
                if (id != null && id.length > 0) {
                    arr.push(
                            {
                                id: id
                            }
                    );
                }
            }
        }
    };
</script>
