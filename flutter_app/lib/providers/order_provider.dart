import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/order.model.dart';
import '../services/api/api_client.dart';

final ordersProvider = FutureProvider.family<Map<String, dynamic>, int>((ref, page) async {
  final apiClient = ref.watch(apiClientProvider);
  return apiClient.getOrders(page: page);
});

final orderDetailsProvider = FutureProvider.family<Order, String>((ref, orderId) async {
  final apiClient = ref.watch(apiClientProvider);
  return apiClient.getOrderById(orderId);
});

class OrderNotifier extends StateNotifier<AsyncValue<Order>> {
  final ApiClient _apiClient;

  OrderNotifier(this._apiClient) : super(const AsyncValue.loading());

  Future<void> createOrder(Map<String, dynamic> orderData) async {
    state = const AsyncValue.loading();
    try {
      final order = await _apiClient.createOrder(orderData);
      state = AsyncValue.data(order);
    } catch (e, stack) {
      state = AsyncValue.error(e, stack);
    }
  }
}

final orderActionProvider = StateNotifierProvider<OrderNotifier, AsyncValue<Order>>((ref) {
  final apiClient = ref.watch(apiClientProvider);
  return OrderNotifier(apiClient);
});
