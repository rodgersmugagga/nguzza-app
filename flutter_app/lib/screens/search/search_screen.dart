import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../constants/app_colors.dart';
import '../../providers/product_provider.dart';
import '../../models/product.model.dart';
import '../../widgets/product_card.dart';
import '../product/product_details_screen.dart';

class SearchScreen extends ConsumerStatefulWidget {
  const SearchScreen({Key? key}) : super(key: key);

  @override
  ConsumerState<SearchScreen> createState() => _SearchScreenState();
}

class _SearchScreenState extends ConsumerState<SearchScreen> {
  final _searchController = TextEditingController();
  final _focusNode = FocusNode();
  String _query = '';
  bool _hasSearched = false;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _focusNode.requestFocus();
    });
  }

  @override
  void dispose() {
    _searchController.dispose();
    _focusNode.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: AppColors.primaryGreen,
        titleSpacing: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () => Navigator.pop(context),
        ),
        title: Hero(
          tag: 'search_bar',
          child: Material(
            color: Colors.transparent,
            child: Container(
              height: 42,
              margin: const EdgeInsets.only(right: 12),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(25),
              ),
              child: Row(
                children: [
                  const SizedBox(width: 14),
                  Expanded(
                    child: TextField(
                      controller: _searchController,
                      focusNode: _focusNode,
                      onChanged: (v) => setState(() => _query = v),
                      onSubmitted: (v) => setState(() => _hasSearched = true),
                      style: const TextStyle(
                          color: AppColors.textDark, fontSize: 14),
                      decoration: const InputDecoration(
                        hintText: 'Search products...',
                        hintStyle:
                            TextStyle(color: AppColors.textLight, fontSize: 14),
                        border: InputBorder.none,
                        enabledBorder: InputBorder.none,
                        focusedBorder: InputBorder.none,
                        contentPadding: EdgeInsets.zero,
                        isDense: true,
                        filled: false,
                      ),
                    ),
                  ),
                  if (_query.isNotEmpty)
                    GestureDetector(
                      onTap: () {
                        _searchController.clear();
                        setState(() {
                          _query = '';
                          _hasSearched = false;
                        });
                      },
                      child: const Padding(
                        padding: EdgeInsets.symmetric(horizontal: 8),
                        child: Icon(Icons.close,
                            color: AppColors.textMedium, size: 18),
                      ),
                    ),
                  GestureDetector(
                    onTap: () => setState(() => _hasSearched = true),
                    child: Container(
                      height: 42,
                      padding: const EdgeInsets.symmetric(horizontal: 14),
                      decoration: const BoxDecoration(
                        color: AppColors.amber,
                        borderRadius: BorderRadius.only(
                          topRight: Radius.circular(25),
                          bottomRight: Radius.circular(25),
                        ),
                      ),
                      child: const Icon(Icons.search,
                          color: Colors.white, size: 20),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
      body: Column(
        children: [
          // Suggestions
          if (_query.length >= 2 && !_hasSearched)
            _buildSuggestions(),
          // Results
          if (_hasSearched) Expanded(child: _buildSearchResults()),
          // Empty state
          if (!_hasSearched && _query.isEmpty)
            const Expanded(
              child: Center(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(Icons.search, size: 64, color: AppColors.textLight),
                    SizedBox(height: 12),
                    Text(
                      'Search for agricultural products',
                      style: TextStyle(color: AppColors.textMedium),
                    ),
                  ],
                ),
              ),
            ),
        ],
      ),
    );
  }

  Widget _buildSuggestions() {
    final suggestionsAsync = ref.watch(searchSuggestionsProvider(_query));
    return suggestionsAsync.when(
      loading: () => const SizedBox.shrink(),
      error: (_, __) => const SizedBox.shrink(),
      data: (suggestions) {
        if (suggestions.isEmpty) return const SizedBox.shrink();
        return Material(
          elevation: 4,
          child: ListView.builder(
            shrinkWrap: true,
            itemCount: suggestions.length > 8 ? 8 : suggestions.length,
            itemBuilder: (context, i) {
              final s = suggestions[i];
              String name;
              if (s is Map) {
                name = s['name']?.toString() ?? s.toString();
              } else {
                name = s.toString();
              }
              return ListTile(
                leading: const Icon(Icons.search,
                    color: AppColors.textLight, size: 18),
                title: Text(name,
                    style: const TextStyle(fontSize: 14)),
                onTap: () {
                  _searchController.text = name;
                  setState(() {
                    _query = name;
                    _hasSearched = true;
                  });
                  _focusNode.unfocus();
                },
              );
            },
          ),
        );
      },
    );
  }

  Widget _buildSearchResults() {
    final filter = ProductFilter(search: _query, limit: 40);
    final productsAsync = ref.watch(productsProvider(filter));

    return productsAsync.when(
      loading: () => const Center(child: CircularProgressIndicator()),
      error: (_, __) => const Center(child: Text('Search failed')),
      data: (data) {
        final List raw = data['products'] as List? ?? data['data'] as List? ?? [];
        final products = raw
            .map((e) => Product.fromJson(e as Map<String, dynamic>))
            .toList();
        final total = data['total'] as int? ?? products.length;

        if (products.isEmpty) {
          return Center(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Icon(Icons.search_off,
                    size: 64, color: AppColors.textLight),
                const SizedBox(height: 12),
                Text(
                  'No results for "$_query"',
                  style: const TextStyle(color: AppColors.textMedium),
                ),
              ],
            ),
          );
        }

        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 12, 16, 4),
              child: Text(
                '$total result${total == 1 ? '' : 's'} for "$_query"',
                style: const TextStyle(
                  color: AppColors.textMedium,
                  fontSize: 13,
                ),
              ),
            ),
            Expanded(
              child: GridView.builder(
                padding: const EdgeInsets.all(12),
                gridDelegate:
                    const SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 2,
                  crossAxisSpacing: 10,
                  mainAxisSpacing: 10,
                  childAspectRatio: 0.72,
                ),
                itemCount: products.length,
                itemBuilder: (context, i) {
                  return ProductCard(
                    product: products[i],
                    onTap: () => Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (_) => ProductDetailsScreen(
                          productId: products[i].id,
                        ),
                      ),
                    ),
                  );
                },
              ),
            ),
          ],
        );
      },
    );
  }
}
