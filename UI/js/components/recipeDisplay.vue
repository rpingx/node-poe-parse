<template>
    <div>
        <div class="row">
            <gridElement>
                <b slot="label">Recipe:</b>
                <div class="input-group input-group-xs">
                    <input type="text" class="form-control" v-model="recipeObj.id" disabled>
                </div>
            </gridElement>
            <gridElement>
                <b slot="label">Profit:</b>
                <div class="input-group input-group-xs">
                    <input type="text" class="form-control" v-model="profit" disabled>
                </div>
            </gridElement>
            <div class="col-md-6">
                <list display="Inputs" :objArr="recipeObj.input"
                      @updateObj="updateInput"
                      @updateChaos="updateCost"/>
            </div>
            <div class="col-md-6">
                <list display="Outputs" :objArr="recipeObj.output"
                      @updateObj="updateOutput"
                      @updateChaos="updatePrice"/>
            </div>
        </div>
    </div>
</template>

<script>
    import Vue from "vue";
    import list from './recipeList.vue';
    import gridElement from './gridElement.vue';

    import utils from '../services/utils';

    import apiService from '../services/api';

    export default {
        data: function () {
            return {
                debouncer: utils.getDebouncer(1000)("default"),
                cost: 0,
                price: 0
            }
        },
        props: ["recipeObj"],
        components: {
            list,
            gridElement
        },
        computed: {
            'profit': function () {
                var self = this;
                var profit = parseFloat(this.price) - parseFloat(this.cost);

                if (!isNaN(profit)) {
                    this.recipeObj.profit = profit;

                    var holder = JSON.parse(JSON.stringify(this.recipeObj));
                    this.debouncer(function () {
                                self.saveRecipe(holder);
                            }
                    );

                    this.$emit('updateProfit', profit);
                }

                return profit;
            }
        },
        mounted: function () {
            var self = this;
            //  This is really ugly... maybe too ugly.
            this.$nextTick(
                    self.recalcProfit
            );
        },
        methods: {
            updateInput: function (val) {
                var self = this;
                var orig = JSON.stringify(this.recipeObj.input);
                var newVal = JSON.stringify(val);

                if (newVal.localeCompare(orig) != 0) {
                    this.recipeObj.input = val;
                    var holder = JSON.parse(JSON.stringify(this.recipeObj));
                    this.debouncer(function () {
                                self.saveRecipe(holder);
                            }
                    );
                }
            },
            updateOutput: function (val) {
                var self = this;
                var orig = JSON.stringify(this.recipeObj.output);
                var newVal = JSON.stringify(val);

                if (newVal.localeCompare(orig) != 0) {
                    this.recipeObj.output = val;
                    var holder = JSON.parse(JSON.stringify(this.recipeObj));
                    this.debouncer(function () {
                                self.saveRecipe(holder);
                            }
                    );
                }
            },
            updateCost: function (val) {
                this.cost = val;
            },
            updatePrice: function (val) {
                this.price = val;
            },
            saveRecipe: function (obj) {
                apiService.saveRecipe(obj);
            }
        }
    };
</script>