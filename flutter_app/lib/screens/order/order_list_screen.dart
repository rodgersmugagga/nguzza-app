import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../constants/app_colors.dart';
import '../../providers/order_provider.dart';
import '../../utils/formatters.dart';
import 'package:intl/intl.dart';

class OrderListScreen extends ConsumerWidget {
  const OrderListScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final ordersAsync = ref.watch(ordersProvider(1));

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('My Orders'),
        backgroundColor: AppColors.primaryGreen,
      ),
      body: ordersAsync.when(
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (err, stack) => Center(child: Text('Error: $err')),
        data: (data) {
          final List ordersRaw = data['orders'] ?? data['data'] ?? [];
          if (ordersRaw.isEmpty) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(Icons.receipt_long_outlined, size: 64, color: AppColors.textLight),
                  const SizedBox(height: 16),
                  const Text('No orders found', style: TextStyle(color: AppColors.textMedium, fontSize: 18)),
                  const SizedBox(height: 24),
                  ElevatedButton(
                    onPressed: () => Navigator.pushReplacementNamed(context, '/home'),
                    child: const Text('Start Shopping'),
                  ),
                ],
              ),
            );
          }

          return ListView.builder(
            padding: const EdgeInsets.all(16),
            itemCount: ordersRaw.length,
            itemBuilder: (context, index) {
              final order = ordersRaw[index];
              final status = order['status'] ?? 'pending';
              final total = order['totalAmount'] ?? 0.0;
              final date = DateTime.parse(order['createdAt']);

              return Card(
                margin: const EdgeInsets.only(bottom: 12),
                child: ListTile(
                  contentPadding: const EdgeInsets.all(16),
                  title: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text('Order #${order['_id'].toString().substring(order['_id'].toString().length - 8).toUpperCase()}',
                          style: const TextStyle(fontWeight: FontWeight.bold)),
                      _buildStatusBadge(status),
                    ],
                  ),
                  subtitle: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const SizedBox(height: 8),
                      Text('Placed on ${DateFormat('MMM dd, yyyy').format(date)}'),
                      const SizedBox(height: 4),
                      Text('Total: UGX ${Formatters.formatPrice(total.toDouble())}',
                          style: const TextStyle(color: AppColors.primaryGreen, fontWeight: FontWeight.bold)),
                    ],
                  ),
                  onTap: () {
                    // Navigate to order details if implemented
                  },
                ),
              );
            },
          );
        },
      ),
    );
  }

  Widget _buildStatusBadge(String status) {
    Color color;
    switch (status.toLowerCase()) {
      case 'delivered':
        color = Colors.green;
        break;
      case 'processing':
        color = Colors.blue;
        break;
      case 'shipped':
        color = Colors.orange;
        break;
      case 'cancelled':
        color = Colors.red;
        break;
      default:
        color = AppColors.amber;
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(4),
        border: Border.all(color: color),
      ),
      child: Text(
        status.toUpperCase(),
        style: TextStyle(color: color, fontSize: 10, fontWeight: FontWeight.bold),
      ),
    );
  }
}
