import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../constants/app_colors.dart';
import '../../providers/product_provider.dart';
import '../../widgets/product_card.dart';
import '../../widgets/category_chip.dart';
import '../../models/product.model.dart';
import 'product_details_screen.dart';

const List<String> _categories = [
  'All', 'Crops', 'Livestock', 'Farm Inputs', 'Machinery', 'Fresh Harvest', 'Services',
];

const Map<String, List<String>> _subCategories = {
  'Machinery': ['Tractors & Machinery', 'Hand Tools', 'Irrigation', 'Tillers', 'Harvesters'],
  'Livestock': ['Cattle', 'Goats', 'Poultry', 'Fish', 'Pigs', 'Sheep'],
  'Crops': ['Maize', 'Beans', 'Cassava', 'Sweet Potato', 'Sorghum', 'Millet'],
  'Farm Inputs': ['Fertilizers', 'Seeds', 'Pesticides', 'Herbicides', 'Agrochemicals'],
  'Fresh Harvest': ['Vegetables', 'Fruits', 'Herbs', 'Roots & Tubers'],
  'Services': ['Transport', 'Processing', 'Storage', 'Consultancy'],
};

class ProductListScreen extends ConsumerStatefulWidget {
  final String? category;

  const ProductListScreen({Key? key, this.category}) : super(key: key);

  @override
  ConsumerState<ProductListScreen> createState() => _ProductListScreenState();
}

class _ProductListScreenState extends ConsumerState<ProductListScreen> {
  late String _selectedCategory;
  String? _selectedSubCategory;
  String? _selectedLocation;
  double? _minPrice;
  double? _maxPrice;
  String _sort = 'newest';

  @override
  void initState() {
    super.initState();
    _selectedCategory = widget.category ?? 'All';
  }

  @override
  Widget build(BuildContext context) {
    final filter = ProductFilter(
      category: _selectedCategory == 'All' ? null : _selectedCategory,
      subCategory: _selectedSubCategory,
      location: _selectedLocation,
      minPrice: _minPrice,
      maxPrice: _maxPrice,
      sort: _sort == 'newest' ? '-createdAt' : (_sort == 'price_asc' ? 'price' : '-price'),
      limit: 40,
    );
    final productsAsync = ref.watch(productsProvider(filter));

    final subs = _subCategories[_selectedCategory] ?? [];

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: AppColors.primaryGreen,
        title: Text(_selectedCategory == 'All' ? 'All Products' : _selectedCategory),
        actions: [
          IconButton(
            icon: const Icon(Icons.tune, color: Colors.white),
            onPressed: _showFilterSheet,
          ),
        ],
      ),
      body: Column(
        children: [
          // Category tab bar
          SizedBox(
            height: 50,
            child: ListView.builder(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
              itemCount: _categories.length,
              itemBuilder: (context, i) {
                final cat = _categories[i];
                return Padding(
                  padding: const EdgeInsets.only(right: 8),
                  child: CategoryChip(
                    label: cat,
                    isSelected: _selectedCategory == cat,
                    onTap: () => setState(() {
                      _selectedCategory = cat;
                      _selectedSubCategory = null;
                    }),
                  ),
                );
              },
            ),
          ),
          // Sub-categories
          if (subs.isNotEmpty)
            SizedBox(
              height: 44,
              child: ListView.builder(
                scrollDirection: Axis.horizontal,
                padding: const EdgeInsets.symmetric(horizontal: 12),
                itemCount: subs.length,
                itemBuilder: (context, i) {
                  final sub = subs[i];
                  return Padding(
                    padding: const EdgeInsets.only(right: 8),
                    child: CategoryChip(
                      label: sub,
                      isSelected: _selectedSubCategory == sub,
                      onTap: () => setState(() {
                        _selectedSubCategory =
                            _selectedSubCategory == sub ? null : sub;
                      }),
                    ),
                  );
                },
              ),
            ),
          // Products grid
          Expanded(
            child: productsAsync.when(
              loading: () => const Center(child: CircularProgressIndicator()),
              error: (err, _) => Center(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Icon(Icons.wifi_off, size: 48, color: AppColors.textLight),
                    const SizedBox(height: 12),
                    const Text('Failed to load products'),
                    const SizedBox(height: 12),
                    ElevatedButton(
                      onPressed: () => ref.invalidate(productsProvider),
                      child: const Text('Retry'),
                    ),
                  ],
                ),
              ),
              data: (data) {
                final products = _parseProducts(data);
                if (products.isEmpty) {
                  return const Center(
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(Icons.search_off, size: 48, color: AppColors.textLight),
                        SizedBox(height: 12),
                        Text('No products found'),
                      ],
                    ),
                  );
                }
                return GridView.builder(
                  padding: const EdgeInsets.all(12),
                  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
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
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  void _showFilterSheet() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (ctx) {
        String sort = _sort;
        return StatefulBuilder(
          builder: (ctx, setModalState) => Padding(
            padding: EdgeInsets.only(
              bottom: MediaQuery.of(ctx).viewInsets.bottom,
            ),
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(24),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Text('Filters & Sort',
                      style: TextStyle(
                          fontSize: 18, fontWeight: FontWeight.w700)),
                  const SizedBox(height: 20),
                  const Text('Sort By',
                      style: TextStyle(fontWeight: FontWeight.w600)),
                  const SizedBox(height: 8),
                  Wrap(
                    spacing: 8,
                    children: [
                      _sortChip('newest', 'Newest', sort, (v) => setModalState(() => sort = v)),
                      _sortChip('price_asc', 'Price: Low to High', sort, (v) => setModalState(() => sort = v)),
                      _sortChip('price_desc', 'Price: High to Low', sort, (v) => setModalState(() => sort = v)),
                    ],
                  ),
                  const SizedBox(height: 24),
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      onPressed: () {
                        setState(() => _sort = sort);
                        Navigator.pop(ctx);
                      },
                      child: const Text('Apply'),
                    ),
                  ),
                ],
              ),
            ),
          ),
        );
      },
    );
  }

  Widget _sortChip(String value, String label, String current, Function(String) onSelect) {
    return FilterChip(
      label: Text(label),
      selected: current == value,
      onSelected: (_) => onSelect(value),
      selectedColor: AppColors.primaryGreen.withAlpha(30),
      checkmarkColor: AppColors.primaryGreen,
    );
  }

  List<Product> _parseProducts(Map<String, dynamic> data) {
    try {
      final List raw = data['products'] as List? ?? data['data'] as List? ?? [];
      return raw.map((e) => Product.fromJson(e as Map<String, dynamic>)).toList();
    } catch (_) {
      return [];
    }
  }
}
