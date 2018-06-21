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
                      @updateURL="updateInput"
                      @updateChaos="updateCost"/>
            </div>
            <div class="col-md-6">
                <list display="Outputs" :objArr="recipeObj.output"
                      @updateURL="updateOutput"
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
                console.log("calc profit");
                return this.price - this.cost;
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
                this.recipeObj.input = val;
                this.debouncer(this.saveRecipe);
            },
            updateOutput: function (val) {
                this.recipeObj.output = val;
                this.debouncer(this.saveRecipe);
            },
            updateCost: function (val) {
                this.cost = val;
                console.log("cost: ", this.cost);

            },
            updatePrice: function (val) {
                this.price = val;
                console.log("price: ", this.price);
            },
            saveRecipe: function () {
                apiService.saveRecipe(this.recipeObj);
            }
        }
    };
</script>