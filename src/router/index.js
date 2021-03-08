import Vue from 'vue'
import Router from 'vue-router'
import Button from '../components/Button'
import Cards from "../components/Cards";

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/button',
      component:Button,
    },
    {
      path: '/cards',
      component:Cards,
    }
  ]
})
