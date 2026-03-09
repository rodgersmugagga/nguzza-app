import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:carousel_slider/carousel_slider.dart';
import 'package:flutter_rating_bar/flutter_rating_bar.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../constants/app_colors.dart';
import '../../providers/product_provider.dart';
import '../../providers/cart_provider.dart';
import '../../models/product.model.dart';
import '../../utils/formatters.dart';

class ProductDetailsScreen extends ConsumerStatefulWidget {
  final String productId;

  const ProductDetailsScreen({Key? key, required this.productId})
      : super(key: key);

  @override
  ConsumerState<ProductDetailsScreen> createState() =>
      _ProductDetailsScreenState();
}

class _ProductDetailsScreenState extends ConsumerState<ProductDetailsScreen> {
  int _currentImageIndex = 0;
  int _quantity = 1;

  @override
  Widget build(BuildContext context) {
    final productAsync =
        ref.watch(productDetailsProvider(widget.productId));

    return Scaffold(
      backgroundColor: AppColors.background,
      body: productAsync.when(
        loading: () => const Scaffold(
          backgroundColor: AppColors.background,
          body: Center(child: CircularProgressIndicator()),
        ),
        error: (err, _) => Scaffold(
          appBar: AppBar(
            backgroundColor: AppColors.primaryGreen,
            title: const Text('Product Details'),
          ),
          body: Center(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Icon(Icons.error_outline,
                    size: 48, color: AppColors.textLight),
                const SizedBox(height: 12),
                const Text('Failed to load product'),
                const SizedBox(height: 12),
                ElevatedButton(
                  onPressed: () => ref.invalidate(
                      productDetailsProvider(widget.productId)),
                  child: const Text('Retry'),
                ),
              ],
            ),
          ),
        ),
        data: (product) => _buildProductPage(context, product),
      ),
    );
  }

  Widget _buildProductPage(BuildContext context, Product product) {
    return Scaffold(
      backgroundColor: AppColors.background,
      bottomSheet: _buildBottomActions(context, product),
      body: CustomScrollView(
      slivers: [
        // App bar with image carousel
        SliverAppBar(
          expandedHeight: 300,
          pinned: true,
          backgroundColor: AppColors.primaryGreen,
          leading: IconButton(
            icon: const Icon(Icons.arrow_back, color: Colors.white),
            onPressed: () => Navigator.pop(context),
          ),
          actions: [
            IconButton(
              icon: const Icon(Icons.favorite_border, color: Colors.white),
              onPressed: () {},
            ),
            IconButton(
              icon: const Icon(Icons.share_outlined, color: Colors.white),
              onPressed: () {},
            ),
          ],
          flexibleSpace: FlexibleSpaceBar(
            background: Stack(
              children: [
                // Image carousel
                if (product.images.isNotEmpty)
                  CarouselSlider.builder(
                    itemCount: product.images.length,
                    options: CarouselOptions(
                      height: 360,
                      viewportFraction: 1.0,
                      onPageChanged: (i, _) =>
                          setState(() => _currentImageIndex = i),
                    ),
                    itemBuilder: (context, i, _) => CachedNetworkImage(
                      imageUrl: product.images[i],
                      fit: BoxFit.cover,
                      width: double.infinity,
                      placeholder: (ctx, url) => Container(
                        color: AppColors.surfaceGray,
                        child: const Center(
                          child: CircularProgressIndicator(),
                        ),
                      ),
                      errorWidget: (ctx, url, err) => Container(
                        color: AppColors.surfaceGray,
                        child: const Icon(Icons.broken_image,
                            size: 60, color: AppColors.textLight),
                      ),
                    ),
                  )
                else
                  Container(
                    color: AppColors.surfaceGray,
                    child: const Center(
                      child: Icon(Icons.agriculture,
                          size: 80, color: AppColors.textLight),
                    ),
                  ),
                // Image dots
                if (product.images.length > 1)
                  Positioned(
                    bottom: 12,
                    left: 0,
                    right: 0,
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: List.generate(
                        product.images.length,
                        (i) => Container(
                          width: i == _currentImageIndex ? 20 : 8,
                          height: 8,
                          margin: const EdgeInsets.symmetric(horizontal: 2),
                          decoration: BoxDecoration(
                            color: i == _currentImageIndex
                                ? Colors.white
                                : Colors.white54,
                            borderRadius: BorderRadius.circular(4),
                          ),
                        ),
                      ),
                    ),
                  ),
              ],
            ),
          ),
        ),
        // Product details
        SliverToBoxAdapter(
          child: Container(
            decoration: const BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.only(
                topLeft: Radius.circular(20),
                topRight: Radius.circular(20),
              ),
            ),
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Category + name
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: AppColors.primaryGreen.withAlpha(20),
                    borderRadius: BorderRadius.circular(4),
                  ),
                  child: Text(
                    product.subCategory ?? product.category,
                    style: const TextStyle(
                      color: AppColors.primaryGreen,
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
                const SizedBox(height: 10),
                Text(
                  product.name,
                  style: const TextStyle(
                    fontSize: 22,
                    fontWeight: FontWeight.w800,
                    color: AppColors.textDark,
                  ),
                ),
                const SizedBox(height: 8),
                Row(
                  children: [
                    RatingBarIndicator(
                      rating: product.rating,
                      itemBuilder: (_, __) =>
                          const Icon(Icons.star, color: AppColors.amber),
                      itemCount: 5,
                      itemSize: 18,
                      unratedColor: AppColors.divider,
                    ),
                    const SizedBox(width: 8),
                    Text(
                      '${product.rating.toStringAsFixed(1)} (${product.reviews} reviews)',
                      style: const TextStyle(
                        color: AppColors.textMedium,
                        fontSize: 13,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                // Price
                Row(
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    Text(
                      'UGX ${Formatters.formatPrice(product.displayPrice)}',
                      style: const TextStyle(
                        fontSize: 26,
                        fontWeight: FontWeight.w800,
                        color: AppColors.primaryGreen,
                      ),
                    ),
                    if (product.hasDiscount) ...[
                      const SizedBox(width: 8),
                      Text(
                        'UGX ${Formatters.formatPrice(product.price)}',
                        style: const TextStyle(
                          fontSize: 16,
                          color: AppColors.textLight,
                          decoration: TextDecoration.lineThrough,
                        ),
                      ),
                    ],
                  ],
                ),
                if (product.district != null)
                  Padding(
                    padding: const EdgeInsets.only(top: 8),
                    child: Row(
                      children: [
                        const Icon(Icons.location_on_outlined,
                            size: 16, color: AppColors.primaryGreenLight),
                        const SizedBox(width: 4),
                        Text(
                          product.district!,
                          style: const TextStyle(
                            color: AppColors.textMedium,
                            fontSize: 13,
                          ),
                        ),
                      ],
                    ),
                  ),
                const Divider(height: 32),
                // Seller info
                Row(
                  children: [
                    Container(
                      width: 48,
                      height: 48,
                      decoration: BoxDecoration(
                        color: AppColors.primaryGreen.withAlpha(20),
                        shape: BoxShape.circle,
                      ),
                      child: const Center(
                        child: Icon(Icons.person,
                            color: AppColors.primaryGreen, size: 28),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            product.sellerName,
                            style: const TextStyle(
                              fontWeight: FontWeight.w700,
                              fontSize: 15,
                            ),
                          ),
                          Row(
                            children: [
                              const Icon(Icons.verified,
                                  size: 14,
                                  color: AppColors.primaryGreenLight),
                              const SizedBox(width: 4),
                              const Text(
                                'Verified Producer',
                                style: TextStyle(
                                  color: AppColors.primaryGreenLight,
                                  fontSize: 12,
                                  fontWeight: FontWeight.w500,
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
                const Divider(height: 32),
                // Description
                const Text(
                  'Description',
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w700,
                    color: AppColors.textDark,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  product.description,
                  style: const TextStyle(
                    color: AppColors.textMedium,
                    height: 1.6,
                    fontSize: 14,
                  ),
                ),
                const Divider(height: 32),
                // Buyer protection
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: AppColors.primaryGreen.withAlpha(10),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(
                        color: AppColors.primaryGreen.withAlpha(40)),
                  ),
                  child: const Row(
                    children: [
                      Icon(Icons.shield_outlined,
                          color: AppColors.primaryGreen),
                      SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Buyer Protection',
                              style: TextStyle(
                                fontWeight: FontWeight.w700,
                                color: AppColors.primaryGreen,
                              ),
                            ),
                            SizedBox(height: 2),
                            Text(
                              'Verify product quality before completing payment',
                              style: TextStyle(
                                fontSize: 12,
                                color: AppColors.textMedium,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 20),
                // Quantity selector
                Row(
                  children: [
                    const Text('Quantity:',
                        style: TextStyle(fontWeight: FontWeight.w600)),
                    const SizedBox(width: 16),
                    Container(
                      decoration: BoxDecoration(
                        border: Border.all(color: AppColors.divider),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          IconButton(
                            icon: const Icon(Icons.remove, size: 18),
                            onPressed: _quantity > 1
                                ? () => setState(() => _quantity--)
                                : null,
                          ),
                          SizedBox(
                            width: 40,
                            child: Text(
                              '$_quantity',
                              textAlign: TextAlign.center,
                              style: const TextStyle(
                                fontWeight: FontWeight.w700,
                                fontSize: 16,
                              ),
                            ),
                          ),
                          IconButton(
                            icon: const Icon(Icons.add, size: 18),
                            onPressed: () => setState(() => _quantity++),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 100), // Bottom padding for the FAB
              ],
            ),
          ),
        ),
      ],
    ), // CustomScrollView
    ); // Scaffold
  } // _buildProductPage

  Widget _buildBottomActions(BuildContext context, Product product) {
    return Container(
      padding: const EdgeInsets.fromLTRB(16, 12, 16, 24),
      decoration: BoxDecoration(
        color: Colors.white,
        boxShadow: [
          BoxShadow(
            color: Colors.black.withAlpha(15),
            blurRadius: 12,
            offset: const Offset(0, -4),
          ),
        ],
      ),
      child: Row(
        children: [
          // Chat
          Expanded(
            child: OutlinedButton.icon(
              onPressed: () {
                final whatsapp =
                    'https://wa.me/256${product.sellerName}?text=Hi, I am interested in ${product.name}';
                launchUrl(Uri.parse(whatsapp));
              },
              icon: const Icon(Icons.chat_bubble_outline, size: 18),
              label: const Text('Chat'),
              style: OutlinedButton.styleFrom(
                foregroundColor: AppColors.primaryGreen,
                side: const BorderSide(color: AppColors.primaryGreen),
                padding: const EdgeInsets.symmetric(vertical: 12),
              ),
            ),
          ),
          const SizedBox(width: 8),
          // Add to cart
          Expanded(
            flex: 2,
            child: ElevatedButton.icon(
              onPressed: product.isInStock
                  ? () => _addToCart(context, product)
                  : null,
              icon: const Icon(Icons.shopping_cart_outlined, size: 18),
              label: Text(
                  product.isInStock ? 'Add to Cart' : 'Out of Stock'),
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primaryGreen,
                padding: const EdgeInsets.symmetric(vertical: 12),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Future<void> _addToCart(BuildContext context, Product product) async {
    await ref.read(cartProvider.notifier).addToCart(product.id, _quantity);
    if (context.mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Added to cart!'),
          backgroundColor: AppColors.primaryGreen,
          duration: Duration(seconds: 2),
        ),
      );
    }
  }
}
