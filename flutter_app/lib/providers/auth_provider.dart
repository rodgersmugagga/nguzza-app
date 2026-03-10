import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/user.model.dart';
import '../services/api/api_client.dart';
import '../services/auth_service.dart';

class AuthNotifier extends StateNotifier<AuthState> {
  final ApiClient _apiClient;
  final AuthService _authService;

  AuthNotifier(this._apiClient, this._authService) : super(const AuthState()) {
    _init();
  }

  Future<void> _init() async {
    final token = await _authService.getToken();
    if (token != null) {
      state = state.copyWith(token: token, isLoading: true);
      try {
        final user = await _apiClient.getCurrentUser();
        state = state.copyWith(
          user: user,
          isLoading: false,
          isAuthenticated: true,
        );
      } catch (e) {
        await _authService.clearToken();
        state = state.copyWith(isLoading: false, isAuthenticated: false);
      }
    }
  }

  Future<void> login(String email, String password) async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      final response = await _apiClient.login({
        'email': email,
        'password': password,
      });

      final user = User.fromJson(response['user']);
      final token = response['token'];

      await _authService.saveToken(token);
      await _authService.saveUserId(user.id);

      state = state.copyWith(
        user: user,
        token: token,
        isLoading: false,
        isAuthenticated: true,
      );
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        error: e.toString(),
      );
    }
  }

  Future<void> signup(String name, String email, String password, {String? phone}) async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      final response = await _apiClient.signup({
        'name': name,
        'email': email,
        'password': password,
        if (phone != null && phone.isNotEmpty) 'phone': phone,
      });

      final user = User.fromJson(response['user']);
      final token = response['token'];

      await _authService.saveToken(token);
      await _authService.saveUserId(user.id);

      state = state.copyWith(
        user: user,
        token: token,
        isLoading: false,
        isAuthenticated: true,
      );
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        error: e.toString(),
      );
    }
  }

  Future<void> logout() async {
    state = state.copyWith(isLoading: true);
    try {
      await _apiClient.logout();
    } catch (_) {}
    await _authService.clearToken();
    state = const AuthState();
  }

  Future<void> getCurrentUser() async {
    state = state.copyWith(isLoading: true);
    try {
      final user = await _apiClient.getCurrentUser();
      state = state.copyWith(
        user: user,
        isLoading: false,
        isAuthenticated: true,
      );
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        error: e.toString(),
        isAuthenticated: false,
      );
    }
  }
}

class AuthState {
  final User? user;
  final String? token;
  final bool isAuthenticated;
  final bool isLoading;
  final String? error;

  const AuthState({
    this.user,
    this.token,
    this.isAuthenticated = false,
    this.isLoading = false,
    this.error,
  });

  AuthState copyWith({
    User? user,
    String? token,
    bool? isAuthenticated,
    bool? isLoading,
    String? error,
  }) {
    return AuthState(
      user: user ?? this.user,
      token: token ?? this.token,
      isAuthenticated: isAuthenticated ?? this.isAuthenticated,
      isLoading: isLoading ?? this.isLoading,
      error: error,
    );
  }

  bool get isAdmin => user?.isAdmin ?? false;
  bool get isSeller => user?.isSeller ?? false;
}

final authProvider = StateNotifierProvider<AuthNotifier, AuthState>((ref) {
  final apiClient = ref.watch(apiClientProvider);
  final authService = ref.watch(authServiceProvider);
  return AuthNotifier(apiClient, authService);
});
