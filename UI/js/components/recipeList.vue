<template>
    <div class="list-group">
        <a class="list-group-item active">
            {{display}}
        </a>
        <a class="list-group-item" v-for="(obj, index) in processedArr" :title="obj.desc">
            <div class="row">
                <div class="col-md-6">
                    {{obj.name}} <img style="height: 20px;width: auto;" :src="obj.icon" v-if="obj.icon != null"/>
                </div>
                <div class="col-md-6">
                    <div class="input-group">
                        <input type="text" style="width: 100px;" class="form-control" :value="obj.chaosValue"
                               @change="updateChaos(obj, $event)">
                        <span class="input-group-addon" style="width: 70px;">c</span>
                        <span class="input-group-addon"><a href="#" @click="openUrl(obj)">$</a></span>
                        <input type="text" style="width: 50px;" class="form-control" :value="obj.url"
                               @click="selectAll" @change="updateUrl(obj, $event)">
                    </div>
                </div>
            </div>
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
        mounted: function () {
            var self = this;
            //  This is really ugly... maybe too ugly.
            this.$nextTick(
                    self.process
            );
        },
        watch: {
            'processedArr': 'updateTotal'
        },
        methods: {
            updateTotal: function () {
                var val = 0;
                this.processedArr.forEach(
                        function (entry) {
                            if (entry.chaosValue != undefined) {
                                val += entry.chaosValue;
                            }
                        }
                );

                this.$emit('updateChaos', val);
            },
            process: function () {
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
                                                        url: item.url,
                                                        chaosValue: data.chaosValue,
                                                        update: function (url) {
                                                            item.url = url;
                                                        }
                                                    }
                                            );
                                        }
                                );
                            } else {
                                holder.push(
                                        {
                                            name: item.name,
                                            url: item.url,
                                            update: function (url) {
                                                item.url = url;
                                            }
                                        }
                                );
                            }
                        }
                );

                this.processedArr = holder;
            },
            selectAll: function (e) {
                e.target.select();
            },
            updateUrl: function (obj, e) {
                var url = e.target.value;
                obj.url = url;
                obj.update(url);

                this.$emit('updateURL', this.objArr);
            },
            updateChaos: function (obj, e) {
                obj.chaosValue = e.target.value;
                this.updateTotal();
            },
            openUrl: function (obj) {
                window.open(obj.url);
            }
        }
    };
</script>