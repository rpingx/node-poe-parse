<template>
    <nav class="navbar navbar-default">
        <div class="container-fluid">
            <div class="navbar-header">
                <button type="button" class="navbar-toggle collapsed"
                        @click="toggleBurger();" ref="burger">
                    <span class="sr-only">Toggle navigation</span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </button>
                <a class="navbar-brand" href=".">
                    POE Recipes
                </a>
            </div>
            <div class="collapse navbar-collapse">
                <ul class="hidden-xs nav navbar-nav">
                    <li v-for="(app, index) in activeApps" :key="index">
                        <router-link :style="styles.navbarItems" :to="{name: app.name}">{{app.name}}</router-link>
                    </li>
                </ul>
            </div>
            <div class="visible-xs" v-if="toggle">
                <ul class="nav navbar-nav">
                    <li v-for="(app, index) in activeApps" :key="index">
                        <router-link :style="styles.navbarItems" :to="{name: app.name}">{{app.name}}</router-link>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
</template>

<script>
    export default {
        data: function () {
            return {
                toggle: false,
                styles: {
                    navbarItems: {
                        "line-height": "30px"
                    },
                    navHeader: {
                        height: "30px"
                    },
                    navbarToggle: {
                        "padding-right": "10px",
                        "margin-top": "9px",
                        "margin-bottom": "9px"
                    }
                }
            };
        },
        computed: {
            activeApps: function () {
                var holderArr = [];
                this.$router.options.routes.forEach(function (appObj) {
                    if (appObj.desc) {
                        holderArr.push(appObj);
                    }
                });

                return holderArr;
            }
        },
        methods: {
            toggleBurger: function () {
                if (this.toggle) {
                    this.$refs.burger.blur();
                }

                this.toggle = !this.toggle;
            }
        }
    };
</script>