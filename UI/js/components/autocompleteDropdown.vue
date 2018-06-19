<template>
    <div :class="dropdownClass">
        <div class="input-group" style="width:calc(100% - 41px);">
            <input ref="searchInput" type="text" class="form-control" :placeholder="placeholder"
                   @blur="testBlur" @focus="openDropdown" @keydown.stop="keyDownMonitor" @keyup="keyUpMonitor"
                   v-model=searchText>
            <span @mousedown="clearSearch" v-show="(!isIE || !isActive) && searchText.length > 0"
                  class="glyphicon glyphicon-remove"
                  style="position: absolute;right: 12px; top: 0;bottom: 0; height: 14px;margin: auto;font-size: 14px; cursor: pointer;color: #ccc;z-index: 2;"></span>
            <a class="btn dropdown-toggle btn-default" aria-expanded="false"
               @mousedown.prevent="toggle" @keyup.space.enter="toggle" ref="caret" tabindex="0">
                <span class="caret"></span>
            </a>
        </div>
        <ul class="dropdown-menu" style="width: 100%;min-width: 250px;">
            <li @mousedown="select(true, index)" v-for="(option, index) in filteredOptionsArr" :key="index"
                @mouseover="mouseOverCheck(index)" :class="[{ active: selected == index && option.value !== null }]">
                <a>{{option.text}}</a>
            </li>
        </ul>
    </div>
</template>

<script>
    import utils from "../services/utils.js";
    import Vue from "vue";

    export default {
        props: ['value', 'optionsObjArr', 'placeholder', 'noResMess', 'helpInfo', 'autoDef'],
        data: function () {
            return {
                isActive: false,
                isFiltered: false,
                isEmpty: false,
                selected: -1,
                optionObj: {},
                storedText: "",
                searchText: "",
                isIE: false,
                isOutside: false,
                filteredOptionsArr: [],
                lastEmit: null,
                debouncer: utils.getDebouncer()("default"),
                justClearedSearch: false
            };
        },
        computed: {
            dropdownClass: function () {
                if (this.isActive) {
                    return ["input-group-btn", "open"];
                } else {
                    return ["input-group-btn"];
                }
            }
        },
        watch: {
            value: function () {
                if (
                        this.optionsObjArr != null &&
                        this.optionsObjArr.length == 1 &&
                        this.value == this.optionsObjArr[0].value
                ) {
                    this.emit(this.value);
                } else if (this.value != this.lastEmit) {
                    this.searchText = "";
                    this.storedText = "";
                    this.emit("");
                }
            },
            storedText: function () {
                var self = this;
                var storedValue = "";
                this.filteredOptionsArr.forEach(function (optionObj) {
                    if (optionObj.text == self.storedText && optionObj.value !== null) {
                        storedValue = optionObj.value;
                    }
                });

                this.emit(storedValue);
            },
            optionsObjArr: function () {
                if (this.autoDef && this.optionsObjArr.length == 1) {
                    this.filterOptions();
                    this.select(false, 0);
                } else {
                    this.storedText = "";
                    this.searchText = "";
                }
            },
            searchText: function () {
                this.isFiltered = this.searchText.length > 0;
                this.debouncer(this.filterOptions);
            }
        },
        mounted: function () {
            var self = this;
            this.$nextTick(function () {
                self.isIE =
                        navigator.appName == "Microsoft Internet Explorer" || !!(
                                navigator.userAgent.match(/Trident/) ||
                                navigator.userAgent.match(/rv:11/)
                        );
            });
        },
        methods: {
            keyDownMonitor: function (event) {
                //  We were doing too many key events on this search input. This is to better control the flow instead of relying on auto-binding
                if (event.key === "ArrowDown" || event.key === "Down") {
                    this.selectChange(1);
                } else if (event.key === "ArrowUp" || event.key === "Up") {
                    this.selectChange(-1);
                } else if (event.key === "PageDown") {
                    this.selected = this.selected === -1 ? 0 : this.selected;
                    this.selectChange(10);
                } else if (event.key === "PageUp") {
                    this.selectChange(-10);
                } else if (this.selected !== -1) {
                    if (event.key === "Home") {
                        this.selectChange(-this.selected);
                    } else if (event.key === "End") {
                        this.selectChange(this.filteredOptionsArr.length);
                    }
                }
            },
            keyUpMonitor: function (event) {
                //  We were doing too many key events on this search input. This is to better control the flow instead of relying on auto-binding
                if (event.key === "Enter") {
                    this.select(true);
                } else if (this.selected !== -1) {
                    if (event.key === "Spacebar" || event.key === " ") {
                        this.select(true);
                    }
                }
            },
            mouseOverCheck: function (index) {
                this.selected = index;
            },
            clearSearch: function () {
                this.searchText = "";
                this.storedText = "";

                this.justClearedSearch = true;

                this.$refs.searchInput.focus();
            },
            emit: function (val) {
                this.lastEmit = val;
                this.$emit("input", val);
            },
            selectChange: function (delta) {
                var selectHolder = this.selected + delta;

                if (0 > selectHolder) {
                    selectHolder = 0;
                } else if (this.filteredOptionsArr.length - 1 < selectHolder) {
                    selectHolder = this.filteredOptionsArr.length - 1;
                }

                this.selected = selectHolder;
            },
            select: function (doFocus, ind) {
                this.selected = ind !== undefined ? ind : this.selected;

                if (this.isEmpty || this.selected === -1) {
                    this.searchText = this.storedText;
                } else {
                    this.storedText = this.filteredOptionsArr[this.selected].text;

                    var self = this;

                    Vue.nextTick(function () {
                        // DOM updated
                        self.searchText = self.storedText;
                    });
                }

                this.isActive = false;

                if (doFocus) {
                    this.$refs.caret.focus();
                }
            },
            openDropdown: function () {
                this.$refs.searchInput.setSelectionRange(0, this.searchText.length);
                this.isFiltered = false;
                if (!this.isActive) {
                    this.filterOptions();
                }

                this.isActive = true;

                if (this.$refs.searchInput !== document.activeElement) {
                    this.$refs.searchInput.focus();
                }
            },
            closeDropdown: function () {
                this.isActive = false;
                this.searchText = this.storedText;
            },
            testBlur: function () {
                var self = this;
                if (this.justClearedSearch) {
                    this.$refs.searchInput.focus();
                    this.justClearedSearch = false;
                } else {
                    self.select(false);
                    self.closeDropdown();
                }
            },
            toggle: function () {
                if (!this.isActive) {
                    this.openDropdown();
                } else {
                    this.closeDropdown();
                }
            },
            filterOptions: function () {
                this.selected = -1;
                var tempArr = [];

                if (this.optionsObjArr != null && this.optionsObjArr.length > 0) {
                    var self = this;
                    this.optionsObjArr.forEach(function (optionObj) {
                        if (
                                self.isFiltered === false ||
                                optionObj.text
                                        .toUpperCase()
                                        .indexOf(self.searchText.toUpperCase()) >= 0
                        ) {
                            //  If this isn't filtered or if the objectObj.text contains the searchText

                            tempArr.push(optionObj);
                        }
                    });

                    if (tempArr.length == 0) {
                        var text = "No results found";
                        if (this.noResMess != null) {
                            text = this.noResMess;
                        }
                        tempArr.push({
                            text: text,
                            value: null
                        });

                        this.isEmpty = true;
                    } else {
                        this.isEmpty = false;
                    }
                }

                this.filteredOptionsArr = tempArr;
            }
        }
    };
</script>