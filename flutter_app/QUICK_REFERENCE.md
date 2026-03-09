# Flutter Quick Reference

## Essential Commands

```bash
# Setup
flutter pub get                              # Install dependencies
flutter pub run build_runner build           # Generate code
flutter pub run build_runner watch           # Watch mode

# Running
flutter run                                  # Run app
flutter run --release                        # Release mode
flutter run -d <device_id>                  # Specific device
flutter run --verbose                        # Debug output

# Building
flutter build apk --release                  # Android APK
flutter build appbundle --release            # Android AAB
flutter build ios --release                  # iOS

# Testing & Analysis
flutter test                                 # Run tests
flutter analyze                              # Code analysis
flutter format lib/                          # Format code

# Maintenance
flutter clean                                # Clean build
flutter pub upgrade                          # Update packages
flutter doctor                               # Check setup
```

---

## Project Structure

```
flutter_app/
├── lib/
│   ├── main.dart                  # ← App entry
│   ├── models/                    # Data classes
│   ├── services/api/api_client.dart  # API calls
│   ├── providers/                 # State (Riverpod)
│   ├── screens/                   # Full pages
│   ├── widgets/                   # Components
│   ├── utils/                     # Helpers
│   └── constants/                 # Strings, colors, endpoints
├── assets/                        # Images, fonts
├── test/                          # Unit tests
├── pubspec.yaml                   # Config
└── README.md                      # Docs
```

---

## Riverpod State Management

```dart
// Read state
final value = ref.watch(myProvider);

// Watch selected value
final selected = ref.watch(
  myProvider.select((state) => state.value)
);

// Update state
ref.read(myProvider.notifier).update();

// One-time read
final value = ref.read(myProvider);
```

---

## API Integration

```dart
// Call API
final products = await ref
  .watch(apiClientProvider)
  .getProducts(page: 1);

// With error handling
try {
  final data = await apiClient.getEndpoint();
} on DioException catch (e) {
  // Handle error
}
```

---

## Widget Patterns

### StatelessWidget

```dart
class MyWidget extends StatelessWidget {
  final String title;

  const MyWidget({required this.title, Key? key})
    : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Text(title);
  }
}
```

### ConsumerWidget (Riverpod)

```dart
class MyWidget extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final data = ref.watch(myProvider);
    return Text(data);
  }
}
```

### Navigation

```dart
// Push named
Navigator.pushNamed(context, '/products');

// Pop
Navigator.pop(context);

// Replace
Navigator.pushReplacementNamed(context, '/home');
```

---

## Common Widgets

| Widget                      | Purpose                  |
| --------------------------- | ------------------------ |
| `Scaffold`                  | Basic app structure      |
| `AppBar`                    | Header                   |
| `FloatingActionButton`      | Floating button          |
| `ListView`                  | Scrollable list          |
| `GridView`                  | Grid layout              |
| `Card`                      | Container with elevation |
| `Form`                      | Form input               |
| `TextFormField`             | Text input               |
| `ElevatedButton`            | Primary button           |
| `OutlinedButton`            | Secondary button         |
| `CircularProgressIndicator` | Loading spinner          |
| `Image.network`             | Network image            |
| `Icon`                      | Material icon            |

---

## Form & Validation

```dart
final formKey = GlobalKey<FormState>();

TextFormField(
  validator: (value) {
    if (value?.isEmpty ?? true) {
      return 'Required field';
    }
    return null;
  },
)

// Validate
if (formKey.currentState!.validate()) {
  // Submit
}
```

---

## Async & Futures

```dart
// Wait for data
final data = await apiClient.fetchData();

// FutureBuilder
FutureBuilder<Data>(
  future: apiClient.fetchData(),
  builder: (context, snapshot) {
    if (snapshot.connectionState == ConnectionState.waiting) {
      return const CircularProgressIndicator();
    }
    if (snapshot.hasError) {
      return Text('Error: ${snapshot.error}');
    }
    return Text(snapshot.data.toString());
  },
)
```

---

## Error Handling

```dart
try {
  await apiClient.doSomething();
} on DioException catch (e) {
  // Network errors
  print('Network: ${e.message}');
} on FormatException catch (e) {
  // Format errors
  print('Format: $e');
} catch (e) {
  // Other errors
  print('Error: $e');
}
```

---

## Debugging

```bash
# Debug console
flutter run --debug

# Verbose output
flutter run --verbose

# DevTools
flutter pub global run devtools

# Breakpoints in VS Code
# Add breakpoints and run in debug mode
```

### Debug Statements

```dart
import 'package:logger/logger.dart';

final logger = Logger();
logger.d('Debug message');
logger.i('Info');
logger.w('Warning');
logger.e('Error');
```

---

## Performance Tips

1. **Avoid Rebuilds:**

   ```dart
   // Bad: rebuilds entire widget
   ref.watch(provider);

   // Good: only rebuilds if value changes
   ref.watch(provider.select((state) => state.value));
   ```

2. **Image Caching:**

   ```dart
   CachedNetworkImage(
     imageUrl: url,
     memCacheHeight: 720,
   )
   ```

3. **Pagination:**
   ```dart
   ListView.builder(
     itemCount: items.length,
     itemBuilder: (context, index) {
       if (index == items.length - 1) loadMore();
       return Item(items[index]);
     },
   )
   ```

---

## Storage

```dart
// SharedPreferences (simple key-value)
final prefs = await SharedPreferences.getInstance();
prefs.setString('key', 'value');
String? value = prefs.getString('key');

// Hive (local database - optional)
var box = await Hive.openBox('myBox');
await box.put('key', value);
var value = box.get('key');
```

---

## Authentication Flow

```dart
// Login
await ref.read(authProvider.notifier)
  .login(email, password);

// Check if authenticated
final isAuth = ref.watch(
  authProvider.select((state) => state.isAuthenticated)
);

// Get current user
final user = ref.watch(
  authProvider.select((state) => state.user)
);

// Logout
await ref.read(authProvider.notifier).logout();
```

---

## Key Providers

```dart
// API
apiClientProvider              // Dio HTTP client

// Auth
authProvider                   // Authentication state
authServiceProvider            // Auth service

// Products
productsProvider(filter)       // Product list
productDetailsProvider(id)     // Single product
searchSuggestionsProvider(q)   # Search suggestions

// Cart
cartProvider                   // Shopping cart state

// UI
productFilterProvider          # Current filters
```

---

## File Templates

### New Screen

```dart
import 'package:flutter/material.dart';

class MyScreen extends StatelessWidget {
  const MyScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Title')),
      body: const Center(child: Text('Content')),
    );
  }
}
```

### New Provider

```dart
import 'package:flutter_riverpod/flutter_riverpod.dart';

final myProvider = Provider<String>((ref) {
  return 'Value';
});
```

### New Model

```dart
import 'package:json_annotation/json_annotation.dart';

part 'my_model.g.dart';

@JsonSerializable()
class MyModel {
  final String id;
  final String name;

  MyModel({required this.id, required this.name});

  factory MyModel.fromJson(Map<String, dynamic> json)
    => _$MyModelFromJson(json);
  Map<String, dynamic> toJson() => _$MyModelToJson(this);
}
```

---

## Color Constants

```dart
import 'package:flutter/material.dart';
import '../constants/app_colors.dart';

// Usage
Container(
  color: primaryColor,
  child: Text(
    'Text',
    style: TextStyle(color: surfaceColor),
  ),
)
```

---

## String Constants

```dart
import '../constants/app_strings.dart';

// Usage
ElevatedButton(
  onPressed: () {},
  child: Text(AppStrings.addToCart),
)
```

---

## First Run Checklist

- [ ] `flutter pub get` ✓
- [ ] `flutter pub run build_runner build` ✓
- [ ] Backend running on `localhost:5000` ✓
- [ ] `flutter run` works ✓
- [ ] App shows splash screen ✓
- [ ] No console errors ✓

---

## Helpful VS Code Shortcuts

| Shortcut       | Action          |
| -------------- | --------------- |
| `Ctrl+Shift+B` | Build           |
| `F5`           | Debug           |
| `Ctrl+Shift+D` | Debug console   |
| `Cmd+Shift+P`  | Command palette |
| `Ctrl+K`       | Quick fix       |
| `Ctrl+/`       | Toggle comment  |

---

## Further Reading

- 📚 [Flutter Docs](https://flutter.dev/docs)
- 📚 [Dart Guide](https://dart.dev/guides)
- 📚 [Riverpod](https://riverpod.dev)
- 📚 [Material Design](https://m3.material.io)

---

**Last Updated:** March 2026
**Flutter Version:** 3.0+
**Dart Version:** 3.0+
