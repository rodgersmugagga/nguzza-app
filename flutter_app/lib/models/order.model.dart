import 'package:json_annotation/json_annotation.dart';

part 'order.model.g.dart';

@JsonSerializable()
class Order {
  @JsonKey(name: '_id')
  final String id;
  final String userId;
  final List<OrderItem> items;
  final double totalAmount;
  final String status; // 'pending', 'processing', 'shipped', 'delivered', 'cancelled'
  final String paymentStatus; // 'pending', 'completed', 'failed'
  final String? paymentId;
  final String shippingAddress;
  final String? notes;
  final DateTime createdAt;
  final DateTime updatedAt;

  Order({
    required this.id,
    required this.userId,
    required this.items,
    required this.totalAmount,
    required this.status,
    required this.paymentStatus,
    this.paymentId,
    required this.shippingAddress,
    this.notes,
    required this.createdAt,
    required this.updatedAt,
  });

  factory Order.fromJson(Map<String, dynamic> json) => _$OrderFromJson(json);
  Map<String, dynamic> toJson() => _$OrderToJson(this);

  bool get isDelivered => status == 'delivered';
  bool get isPending => status == 'pending';
  bool get isProcessing => status == 'processing';
  bool get isShipped => status == 'shipped';
  bool get isCancelled => status == 'cancelled';
  bool get isPaid => paymentStatus == 'completed';
}

@JsonSerializable()
class OrderItem {
  final String productId;
  final String productName;
  final int quantity;
  final double price;
  final String sellerName;

  OrderItem({
    required this.productId,
    required this.productName,
    required this.quantity,
    required this.price,
    required this.sellerName,
  });

  factory OrderItem.fromJson(Map<String, dynamic> json) =>
      _$OrderItemFromJson(json);
  Map<String, dynamic> toJson() => _$OrderItemToJson(this);

  double get subtotal => price * quantity;
}
