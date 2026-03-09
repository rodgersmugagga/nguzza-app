// API Endpoints
const String baseUrl = String.fromEnvironment(
  'API_BASE_URL',
  defaultValue: 'http://localhost:5000/api',
);

const String authSignup = '/auth/signup';
const String authLogin = '/auth/login';
const String authLogout = '/auth/logout';
const String authMe = '/auth/me';
const String authRefreshToken = '/auth/refresh-token';

const String productsEndpoint = '/products';
const String productSuggestions = '/products/suggestions';
const String productDetails = '/products/{id}';

const String cartEndpoint = '/cart';
const String cartItems = '/cart/items';

const String ordersEndpoint = '/orders';
const String orderDetails = '/orders/{id}';

const String adminUsers = '/admin/users';
const String adminProducts = '/admin/products';

// App Routes
const String routeHome = '/';
const String routeLogin = '/login';
const String routeSignup = '/signup';
const String routeProducts = '/products';
const String routeProductDetails = '/products/:id';
const String routeCart = '/cart';
const String routeCheckout = '/checkout';
const String routeOrders = '/orders';
const String routeOrderDetails = '/orders/:id';
const String routeProfile = '/profile';
const String routeAdmin = '/admin';
const String routeAdminDashboard = '/admin/dashboard';
