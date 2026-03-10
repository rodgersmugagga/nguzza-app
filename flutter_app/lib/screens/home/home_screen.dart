import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:smooth_page_indicator/smooth_page_indicator.dart';
import '../../constants/app_colors.dart';
import '../../providers/product_provider.dart';
import '../../widgets/product_card.dart';
import '../../widgets/countdown_timer.dart';
import '../../screens/product/product_list_screen.dart';
import '../../screens/product/product_details_screen.dart';
import '../../screens/search/search_screen.dart';
import '../../models/product.model.dart';

class HomeScreen extends ConsumerStatefulWidget {
  const HomeScreen({Key? key}) : super(key: key);

  @override
  ConsumerState<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends ConsumerState<HomeScreen> {
  int _currentBannerIndex = 0;
  int _currentNavIndex = 0;

  final List<Map<String, dynamic>> _heroBanners = [
    {
      'title': 'Premium Livestock',
      'subtitle': 'Cattle, goats & poultry',
      'color': const Color(0xFFB45309),
      'icon': Icons.pets,
      'category': 'Livestock',
    },
    {
      'title': 'Harvest Season Deals',
      'subtitle': 'Fresh produce at farm prices',
      'color': AppColors.primaryGreen,
      'icon': Icons.grass,
      'category': 'Fresh Harvest',
    },
    {
      'title': 'Farm Machinery',
      'subtitle': 'Tractors & equipment',
      'color': const Color(0xFF1e40af),
      'icon': Icons.agriculture,
      'category': 'Machinery',
    },
  ];

  final List<String> _categories = [
    'H Harvest',
    'Services',
    'Crops',
    'Livestock',
    'Farm Inputs',
    'Machinery',
    'Fresh Harvest',
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      drawer: _buildDrawer(context),
      body: CustomScrollView(
        slivers: [
          _buildAppBar(context),
          _buildCategoryBar(context),
          SliverToBoxAdapter(child: _buildHeroBanner()),
          SliverToBoxAdapter(child: _buildFlashSalesSection()),
          SliverToBoxAdapter(child: _buildTrendingSection()),
          const SliverToBoxAdapter(child: SizedBox(height: 80)),
        ],
      ),
      bottomNavigationBar: _buildBottomNav(),
    );
  }

  Widget _buildAppBar(BuildContext context) {
    return SliverAppBar(
      pinned: true,
      floating: true,
      backgroundColor: AppColors.primaryGreen,
      expandedHeight: 60,
      leading: Builder(
        builder: (ctx) => IconButton(
          icon: const Icon(Icons.menu, color: Colors.white),
          onPressed: () => Scaffold.of(ctx).openDrawer(),
        ),
      ),
      title: GestureDetector(
        onTap: () => Navigator.push(
          context,
          MaterialPageRoute(builder: (_) => const SearchScreen()),
        ),
        child: Hero(
          tag: 'search_bar',
          child: Material(
            color: Colors.transparent,
            child: Container(
              height: 42,
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(25),
              ),
              child: Row(
                children: [
                  const SizedBox(width: 14),
                  const Expanded(
                    child: Text(
                      'Search...',
                      style:
                          TextStyle(color: AppColors.textLight, fontSize: 14),
                    ),
                  ),
                  Container(
                    height: 42,
                    padding: const EdgeInsets.symmetric(horizontal: 14),
                    decoration: const BoxDecoration(
                      color: AppColors.amber,
                      borderRadius: BorderRadius.only(
                        topRight: Radius.circular(25),
                        bottomRight: Radius.circular(25),
                      ),
                    ),
                    child:
                        const Icon(Icons.search, color: Colors.white, size: 20),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
      actions: [
        IconButton(
          icon: const Icon(Icons.shopping_cart_outlined, color: Colors.white),
          onPressed: () => Navigator.pushNamed(context, '/cart'),
        ),
      ],
    );
  }

  Widget _buildCategoryBar(BuildContext context) {
    return SliverPersistentHeader(
      pinned: true,
      delegate: _CategoryBarDelegate(
        child: Container(
          color: AppColors.primaryGreenDark,
          child: Row(
            children: [
              Expanded(
                child: SingleChildScrollView(
                  scrollDirection: Axis.horizontal,
                  padding:
                      const EdgeInsets.symmetric(horizontal: 8, vertical: 8),
                  child: Row(
                    children: _categories.map((cat) {
                      return Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 4),
                        child: TextButton(
                          onPressed: () => Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (_) => ProductListScreen(category: cat),
                            ),
                          ),
                          style: TextButton.styleFrom(
                            foregroundColor: Colors.white70,
                            padding: const EdgeInsets.symmetric(
                                horizontal: 10, vertical: 4),
                            minimumSize: Size.zero,
                            tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                          ),
                          child: Text(
                            cat.toUpperCase(),
                            style: const TextStyle(
                                fontSize: 12,
                                fontWeight: FontWeight.w600,
                                letterSpacing: 0.5),
                          ),
                        ),
                      );
                    }).toList(),
                  ),
                ),
              ),
              GestureDetector(
                onTap: () => Navigator.pushNamed(context, '/sell'),
                child: Container(
                  margin:
                      const EdgeInsets.symmetric(horizontal: 8, vertical: 6),
                  padding:
                      const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                  decoration: BoxDecoration(
                    color: AppColors.amber,
                    borderRadius: BorderRadius.circular(6),
                  ),
                  child: const Text(
                    'START SELLING',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 11,
                      fontWeight: FontWeight.w800,
                      letterSpacing: 0.5,
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildHeroBanner() {
    return Padding(
      padding: const EdgeInsets.fromLTRB(12, 12, 12, 0),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Main carousel
          Expanded(
            flex: 3,
            child: Column(
              children: [
                SizedBox(
                  height: 200,
                  child: PageView.builder(
                    onPageChanged: (i) =>
                        setState(() => _currentBannerIndex = i),
                    itemCount: _heroBanners.length,
                    itemBuilder: (context, i) {
                      final banner = _heroBanners[i];
                      return GestureDetector(
                        onTap: () => Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (_) => ProductListScreen(
                                category: banner['category'] as String),
                          ),
                        ),
                        child: Container(
                          decoration: BoxDecoration(
                            color: banner['color'] as Color,
                            borderRadius: BorderRadius.circular(12),
                          ),
                          padding: const EdgeInsets.all(24),
                          child: Stack(
                            children: [
                              Positioned(
                                right: -20,
                                bottom: -20,
                                child: Icon(
                                  banner['icon'] as IconData,
                                  size: 140,
                                  color: Colors.white.withAlpha(30),
                                ),
                              ),
                              Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  Text(
                                    banner['title'] as String,
                                    style: const TextStyle(
                                      color: Colors.white,
                                      fontSize: 22,
                                      fontWeight: FontWeight.w800,
                                    ),
                                  ),
                                  const SizedBox(height: 6),
                                  Text(
                                    banner['subtitle'] as String,
                                    style: const TextStyle(
                                      color: Colors.white70,
                                      fontSize: 14,
                                    ),
                                  ),
                                  const SizedBox(height: 16),
                                  Container(
                                    padding: const EdgeInsets.symmetric(
                                        horizontal: 16, vertical: 8),
                                    decoration: BoxDecoration(
                                      color: Colors.white,
                                      borderRadius: BorderRadius.circular(20),
                                    ),
                                    child: Text(
                                      'Explore',
                                      style: TextStyle(
                                        color: banner['color'] as Color,
                                        fontWeight: FontWeight.w700,
                                        fontSize: 13,
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                            ],
                          ),
                        ),
                      );
                    },
                  ),
                ),
                const SizedBox(height: 8),
                AnimatedSmoothIndicator(
                  activeIndex: _currentBannerIndex,
                  count: _heroBanners.length,
                  effect: const WormEffect(
                    dotWidth: 8,
                    dotHeight: 8,
                    activeDotColor: AppColors.primaryGreen,
                    dotColor: AppColors.divider,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(width: 10),
          // Sell CTA card
          Expanded(
            flex: 1,
            child: GestureDetector(
              onTap: () => Navigator.pushNamed(context, '/sell'),
              child: Container(
                height: 200,
                decoration: BoxDecoration(
                  color: AppColors.amber,
                  borderRadius: BorderRadius.circular(12),
                ),
                padding: const EdgeInsets.all(12),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Icon(Icons.inventory_2_outlined,
                        size: 40, color: Colors.white),
                    const SizedBox(height: 8),
                    const Text(
                      'Have items to sell?',
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.w700,
                        fontSize: 12,
                      ),
                    ),
                    const SizedBox(height: 4),
                    const Text(
                      'List your products now',
                      textAlign: TextAlign.center,
                      style: TextStyle(color: Colors.white70, fontSize: 11),
                    ),
                    const SizedBox(height: 10),
                    Container(
                      width: double.infinity,
                      padding: const EdgeInsets.symmetric(vertical: 8),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: const Text(
                        '+ Post Item',
                        textAlign: TextAlign.center,
                        style: TextStyle(
                          color: AppColors.amber,
                          fontWeight: FontWeight.w800,
                          fontSize: 12,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFlashSalesSection() {
    final flashSalesAsync = ref.watch(
      productsProvider(ProductFilter(limit: 10)),
    );

    final sampleEndTime =
        DateTime.now().add(const Duration(hours: 23, minutes: 59));

    return Padding(
      padding: const EdgeInsets.fromLTRB(12, 16, 12, 0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: const BorderRadius.only(
                topLeft: Radius.circular(12),
                topRight: Radius.circular(12),
              ),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withAlpha(8),
                  blurRadius: 6,
                  offset: const Offset(0, 2),
                ),
              ],
            ),
            child: Row(
              children: [
                const Icon(Icons.flash_on, color: Colors.red, size: 22),
                const SizedBox(width: 8),
                const Text(
                  'Flash Sales',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.w700,
                    color: AppColors.textDark,
                  ),
                ),
                const Spacer(),
                CountdownTimer(endTime: sampleEndTime),
              ],
            ),
          ),
          // Products
          Container(
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: const BorderRadius.only(
                bottomLeft: Radius.circular(12),
                bottomRight: Radius.circular(12),
              ),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withAlpha(8),
                  blurRadius: 6,
                  offset: const Offset(0, 2),
                ),
              ],
            ),
            child: flashSalesAsync.when(
              loading: () => const SizedBox(
                height: 200,
                child: Center(child: CircularProgressIndicator()),
              ),
              error: (_, __) => const SizedBox(
                height: 100,
                child: Center(child: Text('Flash sales unavailable')),
              ),
              data: (data) {
                final products = _parseProducts(data);
                if (products.isEmpty) {
                  return const SizedBox(
                    height: 100,
                    child: Center(
                      child: Text('No flash sales right now'),
                    ),
                  );
                }
                return SizedBox(
                  height: 210,
                  child: ListView.builder(
                    scrollDirection: Axis.horizontal,
                    padding: const EdgeInsets.all(12),
                    itemCount: products.length,
                    itemBuilder: (context, i) {
                      return SizedBox(
                        width: 150,
                        child: Padding(
                          padding: const EdgeInsets.only(right: 10),
                          child: ProductCard(
                            product: products[i],
                            onTap: () => Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (_) => ProductDetailsScreen(
                                  productId: products[i].id,
                                ),
                              ),
                            ),
                          ),
                        ),
                      );
                    },
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTrendingSection() {
    final productsAsync = ref.watch(
      productsProvider(ProductFilter(limit: 20)),
    );

    return Padding(
      padding: const EdgeInsets.fromLTRB(12, 16, 12, 0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Text('🔥 ', style: TextStyle(fontSize: 18)),
              const Text(
                'Trending Products',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.w700,
                  color: AppColors.textDark,
                ),
              ),
              const Spacer(),
              GestureDetector(
                onTap: () => Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (_) => const ProductListScreen(),
                  ),
                ),
                child: const Text(
                  'More ›',
                  style: TextStyle(
                    color: AppColors.primaryGreen,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          productsAsync.when(
            loading: () => const Center(child: CircularProgressIndicator()),
            error: (_, __) => const Center(child: Text('Products unavailable')),
            data: (data) {
              final products = _parseProducts(data);
              if (products.isEmpty) {
                return const Center(child: Text('No products found'));
              }
              return GridView.builder(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
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
        ],
      ),
    );
  }

  Widget _buildBottomNav() {
    return BottomNavigationBar(
      currentIndex: _currentNavIndex,
      onTap: (i) {
        setState(() => _currentNavIndex = i);
        switch (i) {
          case 0:
            break;
          case 1:
            Navigator.push(
              context,
              MaterialPageRoute(builder: (_) => const ProductListScreen()),
            );
            break;
          case 2:
            Navigator.pushNamed(context, '/sell');
            break;
          case 3:
            Navigator.pushNamed(context, '/orders');
            break;
          case 4:
            Navigator.pushNamed(context, '/profile');
            break;
        }
      },
      selectedItemColor: AppColors.primaryGreen,
      unselectedItemColor: AppColors.textLight,
      type: BottomNavigationBarType.fixed,
      items: const [
        BottomNavigationBarItem(
            icon: Icon(Icons.home_outlined),
            activeIcon: Icon(Icons.home),
            label: 'Home'),
        BottomNavigationBarItem(
            icon: Icon(Icons.grid_view_outlined),
            activeIcon: Icon(Icons.grid_view),
            label: 'Categories'),
        BottomNavigationBarItem(
            icon: Icon(Icons.add_circle_outline),
            activeIcon: Icon(Icons.add_circle),
            label: 'Sell'),
        BottomNavigationBarItem(
            icon: Icon(Icons.receipt_long_outlined),
            activeIcon: Icon(Icons.receipt_long),
            label: 'Orders'),
        BottomNavigationBarItem(
            icon: Icon(Icons.person_outline),
            activeIcon: Icon(Icons.person),
            label: 'Profile'),
      ],
    );
  }

  Widget _buildDrawer(BuildContext context) {
    return Drawer(
      child: SafeArea(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Padding(
              padding: const EdgeInsets.all(20),
              child: Row(
                children: [
                  const Text('🌱 ', style: TextStyle(fontSize: 20)),
                  const Text(
                    'Menu',
                    style: TextStyle(
                      fontSize: 22,
                      fontWeight: FontWeight.w700,
                      color: AppColors.primaryGreen,
                    ),
                  ),
                  const Spacer(),
                  IconButton(
                    icon: const Icon(Icons.close),
                    onPressed: () => Navigator.pop(context),
                  ),
                ],
              ),
            ),
            const Divider(height: 1),
            _drawerItem(Icons.home_outlined, 'Home', () {
              Navigator.pop(context);
            }),
            _drawerItem(Icons.grid_view_outlined, 'Categories', () {
              Navigator.pop(context);
              Navigator.push(context,
                  MaterialPageRoute(builder: (_) => const ProductListScreen()));
            }),
            _drawerItem(Icons.person_outline, 'Profile', () {
              Navigator.pop(context);
              Navigator.pushNamed(context, '/profile');
            }),
            _drawerItem(Icons.store_outlined, 'Sell', () {
              Navigator.pop(context);
              Navigator.pushNamed(context, '/sell');
            }),
            _drawerItem(Icons.receipt_long_outlined, 'Track Order', () {
              Navigator.pop(context);
              Navigator.pushNamed(context, '/orders');
            }),
            const Spacer(),
            Padding(
              padding: const EdgeInsets.all(20),
              child: SizedBox(
                width: double.infinity,
                child: ElevatedButton.icon(
                  onPressed: () {
                    Navigator.pop(context);
                    Navigator.pushNamed(context, '/login');
                  },
                  icon: const Icon(Icons.person),
                  label: const Text('Sign In'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.primaryGreen,
                    padding: const EdgeInsets.symmetric(vertical: 14),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _drawerItem(IconData icon, String label, VoidCallback onTap) {
    return ListTile(
      leading: Icon(icon, color: AppColors.primaryGreen),
      title: Text(
        label,
        style: const TextStyle(fontWeight: FontWeight.w500, fontSize: 15),
      ),
      onTap: onTap,
    );
  }

  List<Product> _parseProducts(Map<String, dynamic> data) {
    try {
      final List raw = data['products'] as List? ?? data['data'] as List? ?? [];
      return raw
          .map((e) => Product.fromJson(e as Map<String, dynamic>))
          .toList();
    } catch (_) {
      return [];
    }
  }
}

class _CategoryBarDelegate extends SliverPersistentHeaderDelegate {
  final Widget child;
  _CategoryBarDelegate({required this.child});

  @override
  Widget build(
      BuildContext context, double shrinkOffset, bool overlapsContent) {
    return child;
  }

  @override
  double get maxExtent => 46;
  @override
  double get minExtent => 46;
  @override
  bool shouldRebuild(covariant SliverPersistentHeaderDelegate oldDelegate) =>
      true;
}
