// 以下文件格式为描述路由的协议格式
// 你可以调整 routerConfig 里的内容
// 变量名 routerConfig 为 iceworks 检测关键字，请不要修改名称

import BlankLayout from './layouts/BlankLayout';
import Home from './pages/Home';
import Page2 from './pages/Page2';
import HeaderAsideFooterLayout from './layouts/HeaderAsideFooterLayout';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NotFound from './pages/NotFound';

const routerConfig = [
  {
    path: '/home',
    layout: HeaderAsideFooterLayout,
    component: Home,
  },
  {
    path: '/page2',
    layout: HeaderAsideFooterLayout,
    component: Page2,
  },
  {
    path: '/loginPage',
    layout: BlankLayout,
    component: LoginPage,
  },
  {
    path: '/registerPage',
    layout: BlankLayout,
    component: RegisterPage,
  },
  {
    path: '*',
    layout: BlankLayout,
    component: NotFound,
  },
];

export default routerConfig;
