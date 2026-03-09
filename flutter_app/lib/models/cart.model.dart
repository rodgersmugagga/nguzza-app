// Cart model — manual JSON parsing (no json_serializable to avoid stale g.dart)

class CartItem {
  final String id;
  final String productId;
  final String userId;
  final int quantity;
  final double price;
  final String productName;
  final String? image;
  final String? sellerName;

  CartItem({
    required this.id,
    required this.productId,
    this.userId = '',
    required this.quantity,
    required this.price,
    this.productName = '',
    this.image,
    this.sellerName,
  });

  factory CartItem.fromJson(Map<String, dynamic> json) {
    // Handle nested product object
    final productData = json['product'] as Map<String, dynamic>?;
    final images = productData?['images'] as List?;

    return CartItem(
      id: json['_id'] as String? ?? json['id'] as String? ?? '',
      productId: json['productId'] as String? ??
          (productData?['_id'] as String?) ?? '',
      userId: json['userId'] as String? ?? '',
      quantity: (json['quantity'] as num?)?.toInt() ?? 1,
      price: (json['priceAtAdd'] as num?)?.toDouble() ??
          (productData?['price'] as num?)?.toDouble() ??
          (json['price'] as num?)?.toDouble() ??
          0.0,
      productName: productData?['name'] as String? ??
          json['productName'] as String? ??
          json['name'] as String? ??
          '',
      image: images?.isNotEmpty == true
          ? images!.first as String?
          : json['image'] as String?,
      sellerName: productData?['sellerName'] as String? ??
          json['sellerName'] as String?,
    );
  }

  Map<String, dynamic> toJson() => {
        '_id': id,
        'productId': productId,
        'userId': userId,
        'quantity': quantity,
        'priceAtAdd': price,
        'productName': productName,
        if (image != null) 'image': image,
      };

  double get subtotal => price * quantity;
}

class Cart {
  final String id;
  final String userId;
  final List<CartItem> items;

  Cart({
    required this.id,
    this.userId = '',
    required this.items,
  });

  factory Cart.fromJson(Map<String, dynamic> json) {
    // Handle response wrapped in 'cart' key
    final data = json['cart'] as Map<String, dynamic>? ?? json;
    final itemsList = data['items'] as List? ?? [];
    return Cart(
      id: data['_id'] as String? ?? data['id'] as String? ?? '',
      userId: data['userId'] as String? ?? '',
      items: itemsList
          .map((e) => CartItem.fromJson(e as Map<String, dynamic>))
          .toList(),
    );
  }

  Map<String, dynamic> toJson() => {
        '_id': id,
        'userId': userId,
        'items': items.map((e) => e.toJson()).toList(),
      };

  double get total => items.fold(0, (sum, item) => sum + item.subtotal);
  int get itemCount => items.length;
  int get totalQuantity =>
      items.fold(0, (sum, item) => sum + item.quantity);
}
