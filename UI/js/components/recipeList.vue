<template>
    <span>
        <div class="list-group">
            <a class="list-group-item active">
                {{display}} <span class="glyphicon glyphicon-pencil pull-right" aria-hidden="true"
                                  @click="shrunk=!shrunk"></span>
            </a>
            <a class="list-group-item" v-for="(obj, index) in processedArr" :title="obj.desc">
                <div class="row">
                    <div class="col-md-7">
                        {{obj.name}} <img style="height: 20px;width: auto;" :src="obj.icon" v-if="obj.icon != null"/>
                    </div>
                    <div class="col-md-5">
                        <div class="input-group">
                            <input type="text" style="width: 100px;" class="form-control" :value="obj.chaosValue"
                                   @change="updateChaos(obj, $event)">
                            <span class="input-group-addon" style="width: 70px;">c</span>
                            <span class="input-group-addon"><a style="cursor: pointer;"
                                                               @click="openUrl(obj)">@</a></span>
                            <input type="text" style="width: 50px;" class="form-control" :value="obj.url"
                                   @click="selectAll" @change="updateUrl(obj, $event)">
                        </div>
                    </div>
                </div>
            </a>
        </div>
        <shrink :isShrunk="shrunk">
            <itemList :display="display + ' editting'" :objArr="objArr"/>
            <div class="row">
                <formElement>
                    <span slot="label">Storage:</span>
                    <autoDropdown v-model="editId" :optionsObjArr="itemIDList"
                                  placeholder="Search item from data stores"></autoDropdown>
                    <button slot="button" type="button" class="btn btn-primary"
                            @click="addId(objArr, editId);editId=null;">Add
                    </button>
                </formElement>
                <formElement>
                    <span slot="label">Custom:</span>
                    <input type="text" class="form-control" v-model="editCustom"
                           placeholder="Enter custom item string"/>
                    <button slot="button" type="button" class="btn btn-primary"
                            @click="addCustom(objArr, editCustom);editCustom='';">Add
                    </button>
                </formElement>
            </div>
        </shrink>
    </span>
</template>

<script>
    import Vue from 'vue';
    import apiService from '../services/api';

    import itemList from './itemList.vue';
    import shrink from './shrinkSlot.vue';
    import formElement from './formElement.vue';
    import autoDropdown from './autocompleteDropdown.vue';

    export default {
        props: ['display', 'objArr'],
        data: function () {
            return {
                processedArr: [],
                shrunk: true,
                itemIDList: [],
                editId: null,
                editCustom: '',
                lastSent: null
            };
        },
        components: {
            shrink,
            itemList,
            formElement,
            autoDropdown
        },
        watch: {
            'itemIDList': function () {
                if (this.itemIDList.length < 1000) {
                    setTimeout(this.getList, 1000);
                }
            },
            'processedArr': 'updateTotal',
            'objArr': function () {
                var self = this;

                this.$emit('updateObj', this.objArr);
                this.process();
            }
        },
        mounted: function () {
            var self = this;
            //  This is really ugly... maybe too ugly.
            this.$nextTick(
                    function () {
                        self.process();
                        apiService.reload().then(
                                self.getList
                        );
                    }
            );
        },
        methods: {
            getList: function () {
                var self = this;
                apiService.getList().then(function (list) {
                    var holder = [];

                    list.forEach(function (element) {
                        holder.push({
                            text: element.name,
                            value: element.id
                        });
                    });

                    self.itemIDList = holder;
                })
            },
            updateTotal: function () {
                var val = 0;
                this.processedArr.forEach(
                        function (entry) {
                            if (entry.chaosValue != undefined) {
                                val += parseFloat(entry.chaosValue);
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
                                                        chaosValue: data.chaosValue == undefined
                                                                ? item.chaosValue
                                                                : data.chaosValue,
                                                        ref: function () {
                                                            return item;
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
                                            chaosValue: item.chaosValue,
                                            ref: function () {
                                                return item;
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
                obj.ref().url = url;

                this.$emit('updateObj', this.objArr);
            },
            updateChaos: function (obj, e) {
                var chaosValue = e.target.value;
                obj.chaosValue = chaosValue;
                obj.ref().chaosValue = chaosValue;
                this.updateTotal();

                this.$emit('updateObj', this.objArr);
            },
            openUrl: function (obj) {
                window.open(obj.url);
            },
            addId: function (arr, id) {
                this.shrunk = true;
                if (id != null && id.length > 0) {
                    arr.push(
                            {
                                id: id
                            }
                    );
                }
            },
            addCustom: function (arr, custom) {
                this.shrunk = true;
                if (custom.length > 0) {
                    arr.push(
                            {
                                name: custom
                            }
                    );
                }
            }
        }
    };
</script>