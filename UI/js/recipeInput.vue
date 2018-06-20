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
            <itemList display="Inputs" :objArr="inputArr"/>
            <itemList display="Outputs" :objArr="outputArr"/>

            <formElement>
                <button slot="button" type="button" class="btn btn-success"
                        @click="save">
                    Save
                </button>
            </formElement>
        </wrapper>
    </div>
</template>

<script>
    import wrapper from './components/formWrapper.vue';
    import formElement from './components/formElement.vue';
    import autoDropdown from './components/autocompleteDropdown.vue';
    import itemList from './components/itemList.vue';

    import apiService from './services/api';

    export default {
        components: {
            autoDropdown,
            formElement,
            itemList,
            wrapper
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
            //  This is really ugly... maybe too ugly.
            this.$nextTick(
                    function () {
                        apiService.reload().then(
                                function () {
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
                                }
                        );
                    });
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
            addCustom: function (arr, custom) {
                if (custom.length > 0) {
                    arr.push(
                            {
                                name: custom
                            }
                    );
                }
            },
            save: function () {
                if (this.inputArr.length == 0 && this.outputArr.length == 0) {
                    console.log("no data; no saving");
                } else {
                    apiService.addRecipe({
                        input: this.inputArr,
                        output: this.outputArr
                    });
                    console.log("saving");
                    this.inputID = null;
                    this.inputCustom = "";
                    this.inputArr = [];
                    this.outputID = null;
                    this.outputCustom = "";
                    this.outputArr = [];
                }
            }
        }
    };
</script>
