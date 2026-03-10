import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:smooth_page_indicator/smooth_page_indicator.dart';
import '../../constants/app_colors.dart';
import '../../providers/product_provider.dart';
import '../../widgets/product_card.dart';
import '../product/product_list_screen.dart';
import '../product/product_details_screen.dart';

/// Mobile-first responsive home screen for Nguzza Marketplace
class HomeScreen extends ConsumerStatefulWidget {
  const HomeScreen({Key? key}) : super(key: key);

  @override
  ConsumerState<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends ConsumerState<HomeScreen> {
  late PageController _bannerController;
  int _currentBannerIndex = 0;
  int _selectedNavIndex = 0;

  final List<Map<String, dynamic>> _heroBanners = [
    {
      'title': 'Fresh Produce',
      'subtitle': 'Farm to Table',
      'icon': Icons.eco,
      'color': Colors.green[700],
      'category': 'vegetables',
    },
    {
      'title': 'Livestock',
      'subtitle': 'Quality Breeds',
      'icon': Icons.pets,
      'color': Colors.brown[700],
      'category': 'livestock',
    },
    {
      'title': 'Grains & Cereals',
      'subtitle': 'Best Harvest',
      'icon': Icons.grain,
      'color': Colors.amber[700],
      'category': 'grains',
    },
  ];

  @override
  void initState() {
    super.initState();
    _bannerController = PageController(viewportFraction: 1.0);
  }

  @override
  void dispose() {
    _bannerController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final isMobile = MediaQuery.of(context).size.width < 600;
    
    return Scaffold(
      body: SafeArea(
        child: CustomScrollView(
          slivers: [
            // App Bar
            SliverAppBar(
              pinned: true,
              floating: false,
              elevation: 0,
              backgroundColor: AppColors.primaryGreen,
              title: const Text(
                'Nguzza',
                style: TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.w800,
                  color: Colors.white,
                ),
              ),
              actions: [
                IconButton(
                  icon: const Icon(Icons.search, color: Colors.white),
                  onPressed: () {
                    // Navigate to search screen when available
                    Navigator.pushNamed(context, '/search');
                  },
                ),
                IconButton(
                  icon: const Icon(Icons.notifications, color: Colors.white),
                  onPressed: () {},
                ),
              ],
            ),
            // Content
            SliverToBoxAdapter(
              child: SingleChildScrollView(
                physics: const NeverScrollableScrollPhysics(),
                child: Padding(
                  padding: const EdgeInsets.all(12.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Hero Banner with Pagination
                      _buildHeroBanner(isMobile),
                      const SizedBox(height: 20),
                      
                      // Category Grid
                      _buildCategoryGrid(isMobile),
                      const SizedBox(height: 24),

                      // Flash Sales Section
                      _buildSectionHeader('Flash Sales', onSeeAll: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (_) => const ProductListScreen(
                              category: 'flash-sale',
                            ),
                          ),
                        );
                      }),
                      const SizedBox(height: 12),
                      _buildProductCarousel(),
                      const SizedBox(height: 24),

                      // Featured Products Section
                      _buildSectionHeader('Featured Products', onSeeAll: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (_) => const ProductListScreen(),
                          ),
                        );
                      }),
                      const SizedBox(height: 12),
                      _buildFeaturedProducts(isMobile),
                      const SizedBox(height: 30),
                    ],
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
      bottomNavigationBar: _buildBottomNavBar(),
    );
  }

  /// Builds hero banner with page view and indicator
  Widget _buildHeroBanner(bool isMobile) {
    return Column(
      children: [
        SizedBox(
          height: isMobile ? 200 : 250,
          child: PageView.builder(
            controller: _bannerController,
            onPageChanged: (index) {
              setState(() => _currentBannerIndex = index);
            },
            itemCount: _heroBanners.length,
            itemBuilder: (context, index) {
              final banner = _heroBanners[index];
              return _buildBannerCard(banner);
            },
          ),
        ),
        const SizedBox(height: 12),
        // Page Indicator
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
    );
  }

  /// Individual banner card
  Widget _buildBannerCard(Map<String, dynamic> banner) {
    return GestureDetector(
      onTap: () => Navigator.push(
        context,
        MaterialPageRoute(
          builder: (_) =>
              ProductListScreen(category: banner['category'] as String),
        ),
      ),
      child: Container(
        margin: const EdgeInsets.symmetric(horizontal: 4),
        decoration: BoxDecoration(
          color: banner['color'] as Color,
          borderRadius: BorderRadius.circular(16),
          boxShadow: [
            BoxShadow(
              color: (banner['color'] as Color).withOpacity(0.3),
              blurRadius: 8,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        padding: const EdgeInsets.all(24),
        child: Stack(
          children: [
            // Background icon
            Positioned(
              right: -30,
              bottom: -30,
              child: Icon(
                banner['icon'] as IconData,
                size: 150,
                color: Colors.white.withOpacity(0.15),
              ),
            ),
            // Content
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        banner['title'] as String,
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 28,
                          fontWeight: FontWeight.w800,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        banner['subtitle'] as String,
                        style: const TextStyle(
                          color: Colors.white70,
                          fontSize: 14,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ],
                  ),
                ),
                Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Text(
                    'Explore',
                    style: TextStyle(
                      color: banner['color'] as Color,
                      fontWeight: FontWeight.w700,
                      fontSize: 14,
                    ),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  /// Category grid section
  Widget _buildCategoryGrid(bool isMobile) {
    final categories = [
      {'title': 'Vegetables', 'icon': Icons.eco, 'color': Colors.green},
      {'title': 'Fruits', 'icon': Icons.local_florist, 'color': Colors.orange},
      {'title': 'Livestock', 'icon': Icons.pets, 'color': Colors.brown},
      {'title': 'Grains', 'icon': Icons.grain, 'color': Colors.amber},
    ];

    return GridView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: isMobile ? 2 : 4,
        mainAxisSpacing: 12,
        crossAxisSpacing: 12,
        childAspectRatio: 1.0,
      ),
      itemCount: categories.length,
      itemBuilder: (context, index) {
        final category = categories[index];
        return _buildCategoryCard(category);
      },
    );
  }

  /// Individual category card
  Widget _buildCategoryCard(Map<String, dynamic> category) {
    return GestureDetector(
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (_) => ProductListScreen(
              category: category['title'].toString().toLowerCase(),
            ),
          ),
        );
      },
      child: Container(
        decoration: BoxDecoration(
          color: AppColors.cardBackground,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: AppColors.divider, width: 1),
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              category['icon'] as IconData,
              size: 40,
              color: category['color'] as Color,
            ),
            const SizedBox(height: 8),
            Text(
              category['title'] as String,
              textAlign: TextAlign.center,
              style: const TextStyle(
                fontSize: 13,
                fontWeight: FontWeight.w600,
                color: AppColors.textDark,
              ),
            ),
          ],
        ),
      ),
    );
  }

  /// Section header with "See All" link
  Widget _buildSectionHeader(String title, {VoidCallback? onSeeAll}) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          title,
          style: const TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.w700,
            color: AppColors.textDark,
          ),
        ),
        if (onSeeAll != null)
          GestureDetector(
            onTap: onSeeAll,
            child: const Text(
              'See All',
              style: TextStyle(
                fontSize: 13,
                fontWeight: FontWeight.w600,
                color: AppColors.primaryGreen,
              ),
            ),
          ),
      ],
    );
  }

  /// Product carousel for flash sales
  Widget _buildProductCarousel() {
    return Consumer(
      builder: (context, ref, child) {
        final filter = ProductFilter(page: 1, limit: 5);
        final productsAsync = ref.watch(productsProvider(filter));
        
        return productsAsync.when(
          data: (response) {
            final products = response['products'] as List? ?? [];
            if (products.isEmpty) {
              return const SizedBox(
                height: 200,
                child: Center(child: Text('No products available')),
              );
            }
            
            return SizedBox(
              height: 220,
              child: ListView.builder(
                scrollDirection: Axis.horizontal,
                itemCount: products.take(5).length,
                itemBuilder: (context, index) {
                  return Padding(
                    padding: const EdgeInsets.only(right: 12),
                    child: SizedBox(
                      width: 160,
                      child: ProductCard(
                        product: products[index] as dynamic,
                        onTap: () => Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (_) => ProductDetailsScreen(
                              productId: (products[index] as dynamic).id,
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
          loading: () => const SizedBox(
            height: 220,
            child: Center(child: CircularProgressIndicator()),
          ),
          error: (err, stack) => SizedBox(
            height: 220,
            child: Center(child: Text('Error: $err')),
          ),
        );
      },
    );
  }

  /// Featured products grid
  Widget _buildFeaturedProducts(bool isMobile) {
    return Consumer(
      builder: (context, ref, child) {
        final filter = ProductFilter(page: 1, limit: 8);
        final productsAsync = ref.watch(productsProvider(filter));
        
        return productsAsync.when(
          data: (response) {
            final products = response['products'] as List? ?? [];
            if (products.isEmpty) {
              return const SizedBox(
                height: 300,
                child: Center(child: Text('No products available')),
              );
            }
            
            return GridView.builder(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: isMobile ? 2 : 4,
                mainAxisSpacing: 12,
                crossAxisSpacing: 12,
                childAspectRatio: 0.75,
              ),
              itemCount: products.take(8).length,
              itemBuilder: (context, index) {
                return ProductCard(
                  product: products[index] as dynamic,
                  onTap: () => Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (_) => ProductDetailsScreen(
                        productId: (products[index] as dynamic).id,
                      ),
                    ),
                  ),
                );
              },
            );
          },
          loading: () => const SizedBox(
            height: 400,
            child: Center(child: CircularProgressIndicator()),
          ),
          error: (err, stack) => SizedBox(
            height: 300,
            child: Center(child: Text('Error: $err')),
          ),
        );
      },
    );
  }

  /// Bottom navigation bar
  Widget _buildBottomNavBar() {
    return BottomNavigationBar(
      currentIndex: _selectedNavIndex,
      onTap: (index) {
        setState(() => _selectedNavIndex = index);
        switch (index) {
          case 0:
            break; // Already on home
          case 1:
            Navigator.pushNamed(context, '/categories');
            break;
          case 2:
            Navigator.pushNamed(context, '/cart');
            break;
          case 3:
            Navigator.pushNamed(context, '/profile');
            break;
        }
      },
      type: BottomNavigationBarType.fixed,
      backgroundColor: Colors.white,
      selectedItemColor: AppColors.primaryGreen,
      unselectedItemColor: AppColors.textLight,
      items: const [
        BottomNavigationBarItem(
          icon: Icon(Icons.home_outlined),
          activeIcon: Icon(Icons.home),
          label: 'Home',
        ),
        BottomNavigationBarItem(
          icon: Icon(Icons.category_outlined),
          activeIcon: Icon(Icons.category),
          label: 'Categories',
        ),
        BottomNavigationBarItem(
          icon: Icon(Icons.shopping_cart_outlined),
          activeIcon: Icon(Icons.shopping_cart),
          label: 'Cart',
        ),
        BottomNavigationBarItem(
          icon: Icon(Icons.person_outline),
          activeIcon: Icon(Icons.person),
          label: 'Profile',
        ),
      ],
    );
  }
}
