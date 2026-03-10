import 'dart:io';
import 'package:flutter/foundation.dart';

// API Configuration
class ApiConfig {
  static const String _envBaseUrl = String.fromEnvironment('API_BASE_URL');

  static String get baseUrl {
    if (_envBaseUrl.isNotEmpty) return _envBaseUrl;
    
    // For local development
    if (kIsWeb) {
      return 'http://localhost:5000/api';
    }
    return Platform.isAndroid 
        ? 'http://10.0.2.2:5000/api' 
        : 'http://localhost:5000/api';
  }
}

// Auth Endpoints
const String authSignup = '/auth/signup';
const String authLogin = '/auth/login';
const String authLogout = '/auth/logout';
const String authMe = '/auth/me';
const String authRefreshToken = '/auth/refresh-token';

// Product Endpoints
const String productsEndpoint = '/products';
const String productSuggestions = '/products/suggestions';
const String productDetails = '/products/{id}';

// Cart Endpoints
const String cartEndpoint = '/cart';
const String cartItems = '/cart/items';

// Order Endpoints
const String ordersEndpoint = '/orders';
const String orderDetails = '/orders/{id}';

// Admin Endpoints
const String adminUsers = '/admin/users';
const String adminProducts = '/admin/products';

// App Route Names
class AppRoutes {
  static const String splash = '/';
  static const String home = '/home';
  static const String login = '/login';
  static const String signup = '/signup';
  static const String products = '/products';
  static const String productDetails = '/products/:id';
  static const String cart = '/cart';
  static const String checkout = '/checkout';
  static const String orders = '/orders';
  static const String orderDetails = '/orders/:id';
  static const String profile = '/profile';
  static const String admin = '/admin';
  static const String adminDashboard = '/admin/dashboard';
  static const String categories = '/categories';
  static const String sell = '/sell';
}
