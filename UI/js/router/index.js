/**
 * Created by rxudsk on 6/18/2018.
 */
import Vue from 'vue';

import RecipeInput from '../recipeInput.vue';
import RecipeDisplay from '../recipeDisplay.vue';
import Home from '../home.vue';

import Router from 'vue-router';

const routerMapping = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/RecipeInput',
    name: 'Recipe Input',
    component: RecipeInput,
    desc: "Input interesting recipes."
  },
  {
    path: '/RecipeDisplay',
    name: 'Recipe Display',
    component: RecipeDisplay,
    desc: "Display interesting recipes."
  }
];

Vue.use(Router);

export default new Router({
  routes: routerMapping
});