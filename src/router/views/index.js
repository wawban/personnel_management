import attendance from "@/views/the_human_resources/attendance";//考勤组
import shift from "@/views/the_human_resources/shift";//班次
import typesetting from "@/views/the_human_resources/typesetting";//排班管理
import scheduling from "@/views/the_human_resources/scheduling";//排班详情主键
import classView from "@/views/the_human_resources/scheduling/classView";//排班视图
import peopleView from "@/views/the_human_resources/scheduling/peopleView";//人力视图
import statistics from "@/views/the_human_resources/scheduling/statistics";//排班统计
import exchange from "@/views/the_human_resources/scheduling/exchange";//班次调换




export default [
  // {
  //   path: "/demo",
  //   name: "案例",
  //   : () =>
  //     import(/* webpackChunkName: "page" */ "@/views/demo/index"),
  //   meta: {
  //     keepAlive: true,
  //     isTab: false,
  //     isAuth: false
  //   }
  // }

  {
    path: "/attendance",
    component: attendance
  },
  {
    path: "/shift",
    component: shift
  },
  {
    path: "/typesetting",
    component: typesetting
  },
  {
    path: "/scheduling",
    component: scheduling,
    children: [{
      path: '/scheduling/classView',
      component: classView,
    }, {
      path: '/scheduling/peopleView',
      component: peopleView,
    }, {
      path: '/scheduling/statistics',
      component: statistics,
    }, {
      path: '/scheduling/exchange',
      component: exchange,
    }]
  },
];
