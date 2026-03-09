import 'package:flutter_test/flutter_test.dart';
import 'package:nguzza_marketplace/main.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

void main() {
  testWidgets('App smoke test', (WidgetTester tester) async {
    await tester.pumpWidget(
      const ProviderScope(child: NguzzaApp()),
    );
    await tester.pump(const Duration(seconds: 1));
    // Just verify app renders without crashing
    expect(find.byType(NguzzaApp), findsOneWidget);
  });
}
