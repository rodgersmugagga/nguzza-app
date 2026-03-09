// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'product.model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

Product _$ProductFromJson(Map<String, dynamic> json) => Product(
      id: json['_id'] as String,
      name: json['name'] as String,
      description: json['description'] as String,
      category: json['category'] as String,
      subCategory: json['subCategory'] as String?,
      price: (json['price'] as num).toDouble(),
      salePrice: (json['salePrice'] as num?)?.toDouble(),
      stock: (json['stock'] as num).toInt(),
      images:
          (json['images'] as List<dynamic>).map((e) => e as String).toList(),
      rating: (json['rating'] as num).toDouble(),
      reviews: (json['reviews'] as num).toInt(),
      sellerId: json['sellerId'] as String,
      sellerName: json['sellerName'] as String,
      district: json['district'] as String?,
      isFlashSale: json['isFlashSale'] as bool,
      flashSaleEndsAt: json['flashSaleEndsAt'] == null
          ? null
          : DateTime.parse(json['flashSaleEndsAt'] as String),
      views: (json['views'] as num).toInt(),
      createdAt: DateTime.parse(json['createdAt'] as String),
      updatedAt: DateTime.parse(json['updatedAt'] as String),
    );

Map<String, dynamic> _$ProductToJson(Product instance) => <String, dynamic>{
      '_id': instance.id,
      'name': instance.name,
      'description': instance.description,
      'category': instance.category,
      'subCategory': instance.subCategory,
      'price': instance.price,
      'salePrice': instance.salePrice,
      'stock': instance.stock,
      'images': instance.images,
      'rating': instance.rating,
      'reviews': instance.reviews,
      'sellerId': instance.sellerId,
      'sellerName': instance.sellerName,
      'district': instance.district,
      'isFlashSale': instance.isFlashSale,
      'flashSaleEndsAt': instance.flashSaleEndsAt?.toIso8601String(),
      'views': instance.views,
      'createdAt': instance.createdAt.toIso8601String(),
      'updatedAt': instance.updatedAt.toIso8601String(),
    };
