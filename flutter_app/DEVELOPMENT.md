# Flutter App Development Guide

## Quick Start Commands

### Initial Setup

```bash
# Navigate to flutter app
cd flutter_app

# Get dependencies
flutter pub get

# Generate code
flutter pub run build_runner build --delete-conflicting-outputs

# Run the app
flutter run
```

### During Development

```bash
# Hot reload
flutter run
# Press 'r' in terminal

# Hot restart
# Press 'R' in terminal

# Run with specific device
flutter run -d <device_id>

# View connected devices
flutter devices
```

### Testing

```bash
# Run all tests
flutter test

# Run specific test file
flutter test test/screens/auth/login_screen_test.dart

# Run with coverage
flutter test --coverage
```

### Building

```bash
# Debug APK (Android)
flutter build apk --debug

# Release APK (Android)
flutter build apk --release

# App Bundle (Android Play Store)
flutter build appbundle --release

# iOS App
flutter build ios --release

# Web
flutter build web --release
```

### Code Generation

```bash
# Run build_runner once
flutter pub run build_runner build

# Watch for changes and rebuild
flutter pub run build_runner watch

# Clean and rebuild
flutter pub run build_runner build --delete-conflicting-outputs
```

## Project Conventions

### File Naming

- **Classes & Models:** `UpperCamelCase` → `ProductModel.dart`
- **Files:** `snake_case` → `product_model.dart`
- **Enums:** `UpperCamelCase` → `OrderStatus`
- **Constants:** `lowerCamelCase` → `appName`

### Folder Structure

```
lib/
├── models/          # Data models
├── services/        # Business logic
├── providers/       # State management (Riverpod)
├── screens/         # Full-page UI
├── widgets/         # Reusable components
├── utils/           # Helper functions
├── constants/       # App constants
└── main.dart        # Entry point
```

### Imports Organization

```dart
// 1. Dart imports
import 'dart:async';
import 'dart:convert';

// 2. Flutter imports
import 'package:flutter/material.dart';

// 3. Package imports
import 'package:flutter_riverpod/flutter_riverpod.dart';

// 4. Relative imports
import '../models/product.model.dart';
```

## Code Style Guide

### Class Definition

```dart
class MyWidget extends StatelessWidget {
  final String title;
  final VoidCallback onPressed;

  const MyWidget({
    Key? key,
    required this.title,
    required this.onPressed,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container();
  }
}
```

### State Management (Riverpod)

```dart
// Provider definition
final myProvider = Provider<String>((ref) {
  return 'Hello';
});

// In Widget
final value = ref.watch(myProvider);
```

### Error Handling

```dart
try {
  final data = await apiClient.fetchData();
} on DioException catch (e) {
  // Handle network errors
  ScaffoldMessenger.of(context).showSnackBar(
    SnackBar(content: Text('Error: ${e.message}')),
  );
} catch (e) {
  // Handle other errors
  rethrow;
}
```

## Common Tasks

### Add a New Screen

1. **Create screen file:**

   ```dart
   // lib/screens/home/new_screen.dart
   class NewScreen extends ConsumerWidget {
     @override
     Widget build(BuildContext context, WidgetRef ref) {
       return Scaffold(
         appBar: AppBar(title: const Text('New Screen')),
         body: const Center(child: Text('Content')),
       );
     }
   }
   ```

2. **Add route:**

   ```dart
   // In main.dart routes
   '/new_screen': (context) => const NewScreen(),
   ```

3. **Navigate:**
   ```dart
   Navigator.pushNamed(context, '/new_screen');
   ```

### Add a New API Endpoint

1. **Add to API client:**

   ```dart
   // lib/services/api/api_client.dart
   @GET('/endpoint')
   Future<ResponseType> getEndpoint();
   ```

2. **Regenerate code:**

   ```bash
   flutter pub run build_runner build
   ```

3. **Use in service/provider:**
   ```dart
   final apiClient = ref.watch(apiClientProvider);
   final data = await apiClient.getEndpoint();
   ```

### Add a New State Provider

1. **Create provider:**

   ```dart
   // lib/providers/my_provider.dart
   final myStateProvider = StateNotifierProvider<MyNotifier, MyState>((ref) {
     return MyNotifier();
   });
   ```

2. **Use in widget:**
   ```dart
   final state = ref.watch(myStateProvider);
   ref.read(myStateProvider.notifier).updateState();
   ```

### Handle Form Validation

```dart
final formKey = GlobalKey<FormState>();

Form(
  key: formKey,
  child: Column(
    children: [
      TextFormField(
        validator: (value) {
          if (value?.isEmpty ?? true) {
            return 'Field is required';
          }
          return null;
        },
      ),
      ElevatedButton(
        onPressed: () {
          if (formKey.currentState!.validate()) {
            // Submit form
          }
        },
        child: const Text('Submit'),
      ),
    ],
  ),
)
```

## Performance Tips

1. **Image Optimization:**

   ```dart
   CachedNetworkImage(
     imageUrl: url,
     memCacheHeight: 720,
     memCacheWidth: 1280,
   )
   ```

2. **Pagination:**

   ```dart
   ListView.builder(
     itemCount: items.length,
     itemBuilder: (context, index) {
       if (index == items.length - 1) {
         // Load more
       }
       return ItemWidget(items[index]);
     },
   )
   ```

3. **Lazy Loading:**

   ```dart
   final items = ref.watch(itemsProvider(page));
   ```

4. **Avoid Rebuilds:**

   ```dart
   // Bad
   final allState = ref.watch(myProvider);

   // Good
   final value = ref.watch(myProvider.select((state) => state.value));
   ```

## Debugging

### Debug Mode

```bash
flutter run -d chrome  # Web debugging
flutter run --device-id emulator-5554  # Android
```

### Logging

```dart
import 'package:logger/logger.dart';

final logger = Logger();
logger.d('Debug message');
logger.i('Info message');
logger.w('Warning message');
logger.e('Error message');
```

### DevTools

```bash
flutter pub global activate devtools
flutter pub global run devtools
```

### Hot Reload Issues

```bash
# If hot reload fails
flutter run --no-fast-start

# Full restart
# Press 'R' in terminal
```

## Useful VS Code Extensions

- **Dart Code** - Dart & Flutter support
- **Flutter** - Flutter snippets
- **Pubspec Assist** - Package management
- **Error Lens** - Better error display

## Environment Variables

```bash
# Run with environment variable
flutter run --dart-define=API_BASE_URL=https://api.example.com

# Access in code
const String apiUrl = String.fromEnvironment('API_BASE_URL');
```

## Pre-commit Checklist

- [ ] Code compiles without errors
- [ ] All tests pass
- [ ] No console warnings
- [ ] Code formatted with `flutter format`
- [ ] Code analyzed with `flutter analyze`
- [ ] Commits are atomic and well-described

## Useful Commands

```bash
# Format code
flutter format lib/

# Analyze code
flutter analyze

# Get package info
flutter pub show-outdated

# Update packages
flutter pub upgrade

# Check Flutter installation
flutter doctor

# Get more details
flutter doctor -v
```

## Deployment Checklist

- [ ] Version bumped in `pubspec.yaml`
- [ ] All unit tests pass
- [ ] All widget tests pass
- [ ] No build warnings
- [ ] Signed certificates created
- [ ] Release APK/AAB built and tested
- [ ] Privacy policy updated
- [ ] Release notes prepared
- [ ] Screenshots prepared for stores
- [ ] App store metadata finalized

## Resources

- [Flutter Docs](https://flutter.dev/docs)
- [Riverpod Docs](https://riverpod.dev)
- [Material Design](https://m3.material.io)
- [Dart Language Tour](https://dart.dev/guides/language/language-tour)
- [Effective Dart](https://dart.dev/guides/language/effective-dart)

---

**Last Updated:** March 2026
