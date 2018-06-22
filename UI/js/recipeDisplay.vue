<template>
    <div>
        <wrapper>
            <legend>Recipe Display</legend>

            <nav aria-label="Page navigation">
                <ul class="pagination">
                    <li>
                        <a style="cursor: pointer;" @click="deltaPage(-1)">
                            <span aria-hidden="true">&laquo;</span>
                        </a>
                    </li>
                    <li v-for="index in pageMax" :key="index"
                        :class="[index == pageCount ? 'active' : '']">
                        <a style="cursor: pointer;" @click="selectPage(index)">{{index}}</a>
                    </li>
                    <li>
                        <a style="cursor: pointer;" @click="deltaPage(1)">
                            <span aria-hidden="true">&raquo;</span>
                        </a>
                    </li>
                </ul>
            </nav>

            <display v-for="(obj, index) in recipeArr" :recipeObj="obj"
                     v-show="isValid(index)"
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
                debouncer: utils.getDebouncer(500)("default"),
                pageCount: 1,
                pageMax: 1
            };
        },
        watch: {
            'recipeArr': function () {
                this.pageMax = Math.ceil(this.recipeArr.length / 10);
            },
            'pageMax': function () {
                if (this.pageCount < 1 || this.pageCount > this.pageMax) {
                    this.pageCount = 1;
                }
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
            deltaPage: function (delta) {
                this.pageCount += delta;

                if (this.pageCount < 1) {
                    this.pageCount = 1;
                } else if (this.pageCount > this.pageMax) {
                    this.pageCount = this.pageMax;
                }
            },
            selectPage: function (page) {
                this.pageCount = page;
            },
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
                this.recipeArr.sort(function (objA, objB) {
                    var diff = objB.profit - objA.profit;
                    if (diff == 0) {
                        return objB.id - objA.id;
                    }
                    return diff;
                });
            },
            isValid: function (index) {
                return (index < this.pageCount * 10 && index >= (this.pageCount - 1) * 10);
            }
        }
    };
</script>
