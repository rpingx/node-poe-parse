<template>
    <div>
        <div class="row">
            <gridElement>
                <b slot="label">Recipe:</b>
                <div class="input-group input-group-xs">
                    <input type="text" class="form-control" :value="recipeObj.id" disabled>
                </div>
            </gridElement>
            <gridElement>
                <b slot="label">Profit:</b>
                <div class="input-group input-group-xs">
                    <input type="text" class="form-control" :value="recipeObj.value" disabled>
                </div>
            </gridElement>
        </div>
        <list display="Inputs" :objArr="recipeObj.input"/>
        <list display="Outputs" :objArr="recipeObj.output"/>
    </div>
</template>

<script>
    import Vue from "vue";
    import list from './recipeList.vue';
    import gridElement from './gridElement.vue';

    export default {
        props: ["recipeObj"],
        components: {
            list,
            gridElement
        },
        data: function () {
            return {};
        },
        computed: {},
        methods: {}
    };
</script>