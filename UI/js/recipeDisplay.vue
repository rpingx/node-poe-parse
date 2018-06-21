<template>
    <div>
        <wrapper>
            <legend>Recipe Display</legend>
            <display v-for="(obj, index) in recipeArr" :recipeObj="obj"
                     @updateProfit="updateProfit(obj, ...arguments)"/>
        </wrapper>
    </div>
</template>

<script>
    import wrapper from './components/formWrapper.vue';
    import formElement from './components/formElement.vue';
    import display from './components/recipeDisplay.vue';

    import utils from './services/utils';
    import apiService from './services/api';

    export default {
        components: {
            formElement,
            wrapper,
            display
        },
        data: function () {
            return {
                recipeArr: [],
                debouncer: utils.getDebouncer(500)("default")
            };
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
            },
            updateProfit: function (obj, profit) {
                obj.profit = profit;
                this.debouncer(this.resortByProfit);
            },
            resortByProfit: function () {
                var orig = JSON.stringify(this.recipeArr);
                var self = this;
                this.recipeArr.sort(function (objA, objB) {
                    var diff = objB.profit - objA.profit;
                    if (diff == 0) {
                        return objB.id - objA.id;
                    }
                    return diff;
                });

                if (JSON.stringify(this.recipeArr).localeCompare(orig) != 0) {
                    var holder = JSON.parse(JSON.stringify(this.recipeArr));
                    this.recipeArr = [];
                    this.$nextTick(
                            function () {
                                self.recipeArr = holder;
                            }
                    );
                }
            }
        }
    };
</script>
