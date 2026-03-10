import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../constants/app_colors.dart';
import '../../providers/cart_provider.dart';
import '../../providers/order_provider.dart';
import '../../utils/formatters.dart';

class CheckoutScreen extends ConsumerStatefulWidget {
  const CheckoutScreen({Key? key}) : super(key: key);

  @override
  ConsumerState<CheckoutScreen> createState() => _CheckoutScreenState();
}

class _CheckoutScreenState extends ConsumerState<CheckoutScreen> {
  final _addressController = TextEditingController();
  final _notesController = TextEditingController();
  String _paymentMethod = 'Mobile Money';

  @override
  void dispose() {
    _addressController.dispose();
    _notesController.dispose();
    super.dispose();
  }

  Future<void> _placeOrder() async {
    if (_addressController.text.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please enter delivery address')),
      );
      return;
    }

    final cartState = ref.read(cartProvider);
    if (cartState.cart == null) return;

    final orderData = {
      'shippingAddress': _addressController.text,
      'notes': _notesController.text,
      'paymentMethod': _paymentMethod,
    };

    await ref.read(orderActionProvider.notifier).createOrder(orderData);
    
    final orderResult = ref.read(orderActionProvider);
    if (orderResult.hasValue) {
      await ref.read(cartProvider.notifier).clearCart();
      if (mounted) {
        _showSuccessDialog();
      }
    } else if (orderResult.hasError) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to place order: ${orderResult.error}')),
        );
      }
    }
  }

  void _showSuccessDialog() {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (ctx) => AlertDialog(
        title: const Text('Order Placed!'),
        content: const Text('Your order has been successfully placed and is being processed.'),
        actions: [
          TextButton(
            onPressed: () {
              Navigator.pop(ctx);
              Navigator.pushNamedAndRemoveUntil(context, '/home', (route) => false);
            },
            child: const Text('OK'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final cartState = ref.watch(cartProvider);
    final orderAction = ref.watch(orderActionProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Checkout'),
        backgroundColor: AppColors.primaryGreen,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Delivery Address', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
            TextField(
              controller: _addressController,
              decoration: const InputDecoration(
                hintText: 'Enter your delivery address',
                border: OutlineInputBorder(),
              ),
              maxLines: 3,
            ),
            const SizedBox(height: 24),
            const Text('Payment Method', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
            ListTile(
              title: const Text('Mobile Money (MTN/Airtel)'),
              leading: Radio<String>(
                value: 'Mobile Money',
                groupValue: _paymentMethod,
                onChanged: (v) => setState(() => _paymentMethod = v!),
              ),
            ),
            ListTile(
              title: const Text('Cash on Delivery'),
              leading: Radio<String>(
                value: 'Cash on Delivery',
                groupValue: _paymentMethod,
                onChanged: (v) => setState(() => _paymentMethod = v!),
              ),
            ),
            const SizedBox(height: 24),
            const Text('Order Notes (Optional)', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
            TextField(
              controller: _notesController,
              decoration: const InputDecoration(
                hintText: 'Any special instructions?',
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 32),
            const Divider(),
            const SizedBox(height: 16),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text('Total Amount:', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                Text(
                  'UGX ${Formatters.formatPrice(cartState.total)}',
                  style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: AppColors.primaryGreen),
                ),
              ],
            ),
            const SizedBox(height: 32),
            SizedBox(
              width: double.infinity,
              height: 52,
              child: ElevatedButton(
                onPressed: orderAction.isLoading ? null : _placeOrder,
                child: orderAction.isLoading
                    ? const CircularProgressIndicator(color: Colors.white)
                    : const Text('Place Order'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
