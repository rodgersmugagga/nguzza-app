import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../models/user.model.dart';
import '../../models/product.model.dart';
import '../../models/cart.model.dart';
import '../../models/order.model.dart';
import '../auth_service.dart';

const String _baseUrl = String.fromEnvironment(
  'API_BASE_URL',
  defaultValue: 'http://10.0.2.2:5000/api',
);

class ApiClient {
  final Dio _dio;

  ApiClient(this._dio) {
    _dio.options.baseUrl = _baseUrl;
    _dio.options.connectTimeout = const Duration(seconds: 15);
    _dio.options.receiveTimeout = const Duration(seconds: 15);
  }

  void setAuthToken(String? token) {
    if (token != null) {
      _dio.options.headers['Authorization'] = 'Bearer $token';
    } else {
      _dio.options.headers.remove('Authorization');
    }
  }

  // Auth endpoints
  Future<Map<String, dynamic>> signup(Map<String, dynamic> body) async {
    final response = await _dio.post('/auth/signup', data: body);
    return response.data;
  }

  Future<Map<String, dynamic>> login(Map<String, dynamic> body) async {
    final response = await _dio.post('/auth/login', data: body);
    return response.data;
  }

  Future<User> getCurrentUser() async {
    final response = await _dio.get('/auth/me');
    return User.fromJson(response.data['user'] ?? response.data);
  }

  Future<void> logout() async {
    await _dio.post('/auth/logout');
  }

  // Product endpoints
  Future<Map<String, dynamic>> getProducts({
    int page = 1,
    int limit = 20,
    String? search,
    String? category,
    String? subCategory,
    double? minPrice,
    double? maxPrice,
    String? location,
    String? sort,
  }) async {
    final response = await _dio.get(
      '/products',
      queryParameters: {
        'page': page,
        'limit': limit,
        if (search != null && search.isNotEmpty) 'search': search,
        if (category != null) 'category': category,
        if (subCategory != null) 'subCategory': subCategory,
        if (minPrice != null) 'minPrice': minPrice,
        if (maxPrice != null) 'maxPrice': maxPrice,
        if (location != null && location.isNotEmpty) 'district': location,
        if (sort != null) 'sort': sort,
      },
    );
    return response.data;
  }

  Future<List<Map<String, dynamic>>> getSearchSuggestions(String query) async {
    final response = await _dio.get(
      '/products/suggestions',
      queryParameters: {'query': query},
    );
    if (response.data is List) {
      return List<Map<String, dynamic>>.from(
        (response.data as List).map((e) => e is Map<String, dynamic> ? e : {'name': e.toString()}),
      );
    }
    return [];
  }

  Future<Product> getProductById(String id) async {
    final response = await _dio.get('/products/$id');
    final data = response.data;
    if (data is Map<String, dynamic> && data.containsKey('product')) {
      return Product.fromJson(data['product']);
    }
    return Product.fromJson(data);
  }

  Future<Map<String, dynamic>> getFlashSaleProducts() async {
    final response = await _dio.get(
      '/products',
      queryParameters: {'isFlashSale': true, 'limit': 10, 'page': 1},
    );
    return response.data;
  }

  Future<Map<String, dynamic>> getTrendingProducts() async {
    final response = await _dio.get(
      '/products',
      queryParameters: {'sort': 'views', 'limit': 10, 'page': 1},
    );
    return response.data;
  }

  // Cart endpoints
  Future<Cart> getCart() async {
    final response = await _dio.get('/cart');
    return Cart.fromJson(response.data);
  }

  Future<void> addToCart(Map<String, dynamic> body) async {
    await _dio.post('/cart/items', data: body);
  }

  Future<CartItem> updateCartItem(String itemId, Map<String, dynamic> body) async {
    final response = await _dio.put('/cart/items/$itemId', data: body);
    return CartItem.fromJson(response.data);
  }

  Future<void> removeFromCart(String itemId) async {
    await _dio.delete('/cart/items/$itemId');
  }

  Future<void> clearCart() async {
    await _dio.delete('/cart');
  }

  // Order endpoints
  Future<Map<String, dynamic>> getOrders({int page = 1, int limit = 20}) async {
    final response = await _dio.get(
      '/orders',
      queryParameters: {'page': page, 'limit': limit},
    );
    return response.data;
  }

  Future<Order> getOrderById(String id) async {
    final response = await _dio.get('/orders/$id');
    return Order.fromJson(response.data);
  }

  Future<Order> createOrder(Map<String, dynamic> body) async {
    final response = await _dio.post('/orders', data: body);
    return Order.fromJson(response.data);
  }

  Future<Order> cancelOrder(String id) async {
    final response = await _dio.post('/orders/$id/cancel');
    return Order.fromJson(response.data);
  }

  // User endpoints
  Future<User> getUserById(String id) async {
    final response = await _dio.get('/users/$id');
    return User.fromJson(response.data);
  }

  Future<User> updateUser(String id, Map<String, dynamic> body) async {
    final response = await _dio.put('/users/$id', data: body);
    return User.fromJson(response.data);
  }

  // Admin endpoints
  Future<Map<String, dynamic>> getAdminUsers({int page = 1, int limit = 20}) async {
    final response = await _dio.get(
      '/admin/users',
      queryParameters: {'page': page, 'limit': limit},
    );
    return response.data;
  }

  Future<Map<String, dynamic>> getProductsForModeration({
    int page = 1,
    int limit = 20,
    String? status,
  }) async {
    final response = await _dio.get(
      '/admin/products',
      queryParameters: {
        'page': page,
        'limit': limit,
        if (status != null) 'status': status,
      },
    );
    return response.data;
  }
}

// Provider for AuthService
final authServiceProvider = Provider<AuthService>((ref) {
  return AuthService();
});

// Provider for Dio with auth interceptor
final dioProvider = Provider<Dio>((ref) {
  final dio = Dio();
  final authService = ref.read(authServiceProvider);

  dio.interceptors.add(
    InterceptorsWrapper(
      onRequest: (options, handler) async {
        final token = await authService.getToken();
        if (token != null) {
          options.headers['Authorization'] = 'Bearer $token';
        }
        return handler.next(options);
      },
      onError: (error, handler) {
        return handler.next(error);
      },
    ),
  );

  return dio;
});

// Provider for API Client
final apiClientProvider = Provider<ApiClient>((ref) {
  final dio = ref.watch(dioProvider);
  return ApiClient(dio);
});
