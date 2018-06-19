<template>
    <div class="list-group">
        <a class="list-group-item active">
            {{display}}
        </a>
        <a class="list-group-item" v-for="(obj, index) in processedArr" :title="obj.desc">
            {{obj.name}} <img style="height: 20px;width: auto;" :src="obj.icon" v-if="obj.icon != null"/>
            <a class="badge" @click="obj.removal">X</a>
        </a>
    </div>
</template>

<script>
    import Vue from "vue";
    import apiService from '../services/api';

    export default {
        props: ['display', 'objArr'],
        data: function () {
            return {
                processedArr: []
            };
        },
        watch: {
            'objArr': function () {
                var self = this;
                var holder = [];

                this.objArr.forEach(
                        function (item) {
                            if (item.id != null) {
                                apiService.getItem(item.id).then(
                                        function (data) {
                                            holder.push(
                                                    {
                                                        name: data.name,
                                                        icon: data.icon,
                                                        desc: data.desc,
                                                        removal: function () {
                                                            self.objArr.splice(self.objArr.indexOf(item), 1);
                                                        }
                                                    }
                                            );
                                        }
                                );
                            } else {
                                holder.push(
                                        {
                                            name: item.name,
                                            removal: function () {
                                                console.log(self.objArr.indexOf(item));
                                                self.objArr.splice(self.objArr.indexOf(item), 1);
                                            }
                                        }
                                );
                            }
                        }
                );

                this.processedArr = holder;
            }
        }
    };
</script>