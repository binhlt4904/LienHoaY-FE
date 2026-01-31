import HomePage from './components/client/HomePage';
import BuddhistPage from './components/client/BuddhistPage';
import BottomPage from './components/client/BottomPage';
import AccessoryPage from './components/client/AccessoryPage';
import CheckoutPage from './components/client/CheckoutPage';
import OrderPage from './components/client/OrderPage';
import DepositPage from './components/client/DepositPage';
import OrderSuccessPage from './components/client/OrderSuccessPage';
import ChatBox from './components/client/ChatBox';
import AboutPage from './components/client/AboutPage';
import TopSellerPage from './components/client/TopSellerPage';
import NewArrivalPage from './components/client/NewArrivalPage';
import ProductDetail from './components/client/ProductDetail';
import ProfilePage from './components/client/ProfilePage';
import FitCheckPage from './components/client/FitCheckPage';
import RobePage from './components/client/RobePage';
import ContactPage from './components/ContactPage';
import AllProductsPage from './components/client/AllProductsPage';

import AdminDashboard from './components/admin/AdminDashboard';
import ProductPage from './components/admin/ProductPage';
import BuddhistPageAdmin from './components/admin/BuddhistPage';
import BottomPageAdmin from './components/admin/BottomPage';
import RobePageAdmin from './components/admin/RobePage';
import AccessoryPageAdmin from './components/admin/AccessoryPage';
import ProductDetailAdmin from './components/admin/ProductDetail';
import AddBuddhistPage from './components/admin/AddBuddhistPage';
import AddBottomPage from './components/admin/AddBottomPage';
import AddRobePage from './components/admin/AddRobePage';
import AddAccessoryPage from './components/admin/AddAccessoryPage';
import AdminOrderPage from './components/admin/AdminOrderPage';
import OrderDetailPage from './components/admin/OrderDetailPage';
import AdminChatPage from './components/admin/AdminChatPage';
import AdminChatBox from './components/admin/AdminChatBox';
import RevenuePage from './components/admin/RevenuePage';


export const userRoutes = [
  { path: "/", component: HomePage },
  { path: "/product/buddhist", component: BuddhistPage },
  { path: "/product/bottom", component: BottomPage },
  { path: "/product/robe", component: RobePage },
  { path: "/product", component: AllProductsPage },
  { path: "/product/accessory", component: AccessoryPage },
  { path: "/product/top-seller", component: TopSellerPage },
  { path: "/product/new-arrival", component: NewArrivalPage },
  { path: "/product/:category/:id", component: ProductDetail },
  { path: "/checkout", component: CheckoutPage },
  { path: "/my-orders", component: OrderPage },
  { path: "/deposit", component: DepositPage },
  { path: "/success-order", component: OrderSuccessPage },
  { path: "/chat", component: ChatBox },
  { path: "/about", component: AboutPage },
  { path: "/user/profile", component: ProfilePage },
  { path: "/fitcheck", component: FitCheckPage },
  { path: "/contact", component: ContactPage },
];

export const adminRoutes = [
  { path: "/admin", component: AdminDashboard },
  { path: "/admin/product", component: ProductPage },
  { path: "/admin/product/buddhist", component: BuddhistPageAdmin },
  { path: "/admin/product/robe", component: RobePageAdmin },
  { path: "/admin/product/accessory", component: AccessoryPageAdmin },
  { path: "/admin/product/:id", component: ProductDetailAdmin },
  { path: "/admin/product/buddhist/add", component: AddBuddhistPage },
  { path: "/admin/product/bottom/add", component: AddBottomPage },
  { path: "/admin/product/robe/add", component: AddRobePage },
  { path: "/admin/product/accessory/add", component: AddAccessoryPage },
  { path: "/admin/order", component: AdminOrderPage },
  { path: "/admin/order/detail/:id", component: OrderDetailPage },
  { path: "/admin/chat", component: AdminChatBox },
  { path: "/chatAdmin", component: AdminChatPage },
  { path: "/admin/revenue", component: RevenuePage },
];
