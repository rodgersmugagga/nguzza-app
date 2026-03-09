import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/cart.model.dart';
import '../services/api/api_client.dart';

class CartNotifier extends StateNotifier<CartState> {
  final ApiClient _apiClient;

  CartNotifier(this._apiClient) : super(const CartState());

  Future<void> loadCart() async {
    state = state.copyWith(isLoading: true);
    try {
      final cart = await _apiClient.getCart();
      state = state.copyWith(
        cart: cart,
        isLoading: false,
        error: null,
      );
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        error: e.toString(),
      );
    }
  }

  Future<void> addToCart(String productId, int quantity) async {
    try {
      await _apiClient.addToCart({
        'productId': productId,
        'quantity': quantity,
      });
      await loadCart();
    } catch (e) {
      state = state.copyWith(error: e.toString());
    }
  }

  Future<void> updateCartItem(String itemId, int quantity) async {
    try {
      await _apiClient.updateCartItem(itemId, {'quantity': quantity});
      await loadCart();
    } catch (e) {
      state = state.copyWith(error: e.toString());
    }
  }

  Future<void> removeFromCart(String itemId) async {
    try {
      await _apiClient.removeFromCart(itemId);
      await loadCart();
    } catch (e) {
      state = state.copyWith(error: e.toString());
    }
  }

  Future<void> clearCart() async {
    try {
      await _apiClient.clearCart();
      state = const CartState();
    } catch (e) {
      state = state.copyWith(error: e.toString());
    }
  }
}

class CartState {
  final Cart? cart;
  final bool isLoading;
  final String? error;

  const CartState({
    this.cart,
    this.isLoading = false,
    this.error,
  });

  CartState copyWith({
    Cart? cart,
    bool? isLoading,
    String? error,
  }) {
    return CartState(
      cart: cart ?? this.cart,
      isLoading: isLoading ?? this.isLoading,
      error: error,
    );
  }

  int get itemCount => cart?.itemCount ?? 0;
  double get total => cart?.total ?? 0;
  bool get isEmpty => cart?.items.isEmpty ?? true;
}

final cartProvider = StateNotifierProvider<CartNotifier, CartState>((ref) {
  final apiClient = ref.watch(apiClientProvider);
  return CartNotifier(apiClient);
});
