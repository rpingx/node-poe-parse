<template>
    <div class="list-group">
        <a class="list-group-item active">
            {{display}}
        </a>
        {{objArr}}
    </div>
</template>

<script>
    import Vue from "vue";

    export default {
        props: ['display', 'objArr'],
        data: function () {
            return {
                processedArr: []
            };
        }
    };
</script>