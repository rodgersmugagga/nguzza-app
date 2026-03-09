import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/product.model.dart';
import '../services/api/api_client.dart';

class ProductFilter {
  final int page;
  final int limit;
  final String? search;
  final String? category;
  final String? subCategory;
  final double? minPrice;
  final double? maxPrice;
  final String? location;
  final String? sort;

  ProductFilter({
    this.page = 1,
    this.limit = 20,
    this.search,
    this.category,
    this.subCategory,
    this.minPrice,
    this.maxPrice,
    this.location,
    this.sort,
  });

  ProductFilter copyWith({
    int? page,
    int? limit,
    String? search,
    String? category,
    String? subCategory,
    double? minPrice,
    double? maxPrice,
    String? location,
    String? sort,
  }) {
    return ProductFilter(
      page: page ?? this.page,
      limit: limit ?? this.limit,
      search: search ?? this.search,
      category: category ?? this.category,
      subCategory: subCategory ?? this.subCategory,
      minPrice: minPrice ?? this.minPrice,
      maxPrice: maxPrice ?? this.maxPrice,
      location: location ?? this.location,
      sort: sort ?? this.sort,
    );
  }
}

final productFilterProvider = StateProvider<ProductFilter>((ref) {
  return ProductFilter();
});

final productsProvider =
    FutureProvider.family<Map<String, dynamic>, ProductFilter>((
  ref,
  filter,
) async {
  final apiClient = ref.watch(apiClientProvider);
  return apiClient.getProducts(
    page: filter.page,
    limit: filter.limit,
    search: filter.search,
    category: filter.category,
    subCategory: filter.subCategory,
    minPrice: filter.minPrice,
    maxPrice: filter.maxPrice,
    location: filter.location,
    sort: filter.sort,
  );
});

final productDetailsProvider =
    FutureProvider.family<Product, String>((ref, productId) async {
  final apiClient = ref.watch(apiClientProvider);
  return apiClient.getProductById(productId);
});

final searchSuggestionsProvider =
    FutureProvider.family<List<dynamic>, String>((ref, query) async {
  if (query.isEmpty) return [];
  final apiClient = ref.watch(apiClientProvider);
  return apiClient.getSearchSuggestions(query);
});
