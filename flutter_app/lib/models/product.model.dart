import 'package:json_annotation/json_annotation.dart';

part 'product.model.g.dart';

@JsonSerializable()
class Product {
  @JsonKey(name: '_id')
  final String id;
  final String name;
  final String description;
  final String category;
  final String? subCategory;
  final double price;
  final double? salePrice;
  final int stock;
  final List<String> images;
  final double rating;
  final int reviews;
  final String sellerId;
  final String sellerName;
  final String? district;
  final bool isFlashSale;
  final DateTime? flashSaleEndsAt;
  final int views;
  final DateTime createdAt;
  final DateTime updatedAt;

  Product({
    required this.id,
    required this.name,
    required this.description,
    required this.category,
    this.subCategory,
    required this.price,
    this.salePrice,
    required this.stock,
    required this.images,
    required this.rating,
    required this.reviews,
    required this.sellerId,
    required this.sellerName,
    this.district,
    required this.isFlashSale,
    this.flashSaleEndsAt,
    required this.views,
    required this.createdAt,
    required this.updatedAt,
  });

  factory Product.fromJson(Map<String, dynamic> json) =>
      _$ProductFromJson(json);
  Map<String, dynamic> toJson() => _$ProductToJson(this);

  double get displayPrice => salePrice ?? price;
  double get discount =>
      salePrice != null ? ((price - salePrice!) / price * 100) : 0;
  bool get hasDiscount => salePrice != null && salePrice! < price;
  bool get isInStock => stock > 0;
}
