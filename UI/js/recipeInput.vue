<template>
    <div>
        <wrapper>
            <legend>Recipe Input</legend>
            <formElement>
                <span slot="label">Storage:</span>
                <autoDropdown v-model="inputID" :optionsObjArr="itemIDList"
                              placeholder="Search item from data stores"></autoDropdown>
                <button slot="button" type="button" class="btn btn-primary"
                        @click="addId(inputArr, inputID);inputID=null;">Add
                </button>
            </formElement>
            <formElement>
                <span slot="label">Custom:</span>
                <input type="text" class="form-control" v-model="inputCustom" placeholder="Enter custom item string"/>
                <button slot="button" type="button" class="btn btn-primary"
                        @click="addCustom(inputArr, inputCustom);inputCustom='';">Add
                </button>
            </formElement>

            <legend>Recipe Output</legend>
            <formElement>
                <span slot="label">Storage:</span>
                <autoDropdown v-model="outputID" :optionsObjArr="itemIDList"
                              placeholder="Search item from data stores"></autoDropdown>
                <button slot="button" type="button" class="btn btn-primary"
                        @click="addId(outputArr, outputID);outputID=null;">Add
                </button>
            </formElement>
            <formElement>
                <span slot="label">Custom:</span>
                <input type="text" class="form-control" v-model="outputCustom" placeholder="Enter custom item string"/>
                <button slot="button" type="button" class="btn btn-primary"
                        @click="addCustom(outputArr, outputCustom);outputCustom='';">Add
                </button>
            </formElement>
        </wrapper>
    </div>
</template>

<script>
    import wrapper from './components/formWrapper.vue';
    import formElement from './components/formElement.vue';
    import autoDropdown from './components/autocompleteDropdown.vue';

    import apiService from './services/api';

    export default {
        components: {
            wrapper,
            formElement,
            autoDropdown
        },
        watch: {
            'inputArr': function () {
                console.log("inputArr", JSON.stringify(this.inputArr));
            },
            'outputArr': function () {
                console.log("outputArr", JSON.stringify(this.outputArr));
            }
        },
        data: function () {
            return {
                itemIDList: [],
                inputID: null,
                inputCustom: "",
                inputArr: [],
                outputID: null,
                outputCustom: "",
                outputArr: []
            };
        },
        mounted: function () {
            var self = this;
            this.$nextTick(function () {
                apiService.getList(function (list) {
                    var holder = [];

                    list.forEach(function (element) {
                        holder.push({
                            text: element.name,
                            value: element.id
                        });
                    });

                    self.itemIDList = holder;
                });
            })
        },
        methods: {
            addId: function (arr, id) {
                arr.push(
                        {
                            id: id
                        }
                );
            },
            addCustom: function (arr, custom) {
                arr.push(
                        {
                            name: custom
                        }
                );
            }
        }
    };
</script>
