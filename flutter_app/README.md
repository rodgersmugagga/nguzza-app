# Nguzza Flutter App

A modern Flutter mobile application for the Nguzza agriculture marketplace. This is the mobile-first rewrite of the existing Node.js + React application.

## Features

### User Features

- 🔐 **User Authentication**
  - Email/password login and registration
  - Google OAuth integration
  - JWT-based session management

- 🛍️ **Product Discovery**
  - Advanced search with suggestions
  - Category filtering
  - Price range filtering
  - Location-based search
  - Product sorting

- 📦 **Product Details**
  - Image carousel
  - Detailed specifications
  - Customer reviews and ratings
  - Seller information
  - Wishlist functionality

- 🛒 **Shopping Cart**
  - Add/remove items
  - Quantity management
  - Real-time price calculation
  - Persistent storage

- 💳 **Checkout & Payments**
  - Address management
  - Payment method selection
  - Stripe integration
  - Order confirmation

- 📋 **Order Management**
  - Order history with pagination
  - Order status tracking
  - Order details view
  - Reorder functionality

- 👤 **User Profile**
  - Profile information management
  - Address management
  - Wishlist management
  - Order history

### Seller Features

- 📝 **Product Listing**
  - Create new products
  - Edit product information
  - Manage inventory
  - Upload product images

- 📊 **Seller Dashboard**
  - Sales analytics
  - Order management
  - Customer reviews
  - Performance metrics

### Admin Features

- 👥 **User Management**
  - View all users
  - Manage user roles
  - Ban/unban users
  - View user details

- 🏷️ **Product Moderation**
  - Approve pending products
  - Reject products with feedback
  - Manage categories
  - Monitor flash sales

- 🎉 **Flash Sales**
  - Create flash sales
  - Configure sale parameters
  - Reset flash sales
  - View sale analytics

- 📈 **Analytics & Reports**
  - Sales reports
  - User activity
  - Product performance
  - Revenue metrics

## Project Structure

```
lib/
├── main.dart                     # Entry point
├── models/                       # Data models
├── services/                     # Business logic
│   ├── api/
│   │   └── api_client.dart
│   ├── auth_service.dart
│   └── storage_service.dart
├── providers/                    # Riverpod state
├── screens/                      # UI screens
│   ├── auth/
│   ├── home/
│   ├── product/
│   ├── cart/
│   ├── order/
│   ├── admin/
│   └── common/
├── widgets/                      # Reusable components
├── utils/                        # Utilities
└── constants/                    # Constants
```

## Setup & Installation

### Prerequisites

- Flutter 3.0+ ([Install Flutter](https://flutter.dev/docs/get-started/install))
- Dart 3.0+ (included with Flutter)
- Android Studio / Xcode
- Nguzza Node.js backend running

### Steps

1. **Clone or navigate to the Flutter app directory**

   ```bash
   cd flutter_app
   ```

2. **Install dependencies**

   ```bash
   flutter pub get
   ```

3. **Generate code**

   ```bash
   flutter pub run build_runner build --delete-conflicting-outputs
   ```

4. **Configure API base URL**

   Edit `lib/services/api/api_client.dart`:

   ```dart
   @RestApi(baseUrl: 'http://YOUR_BACKEND_URL/api')
   ```

5. **Run the app**

   **Android:**

   ```bash
   flutter run
   ```

   **iOS:**

   ```bash
   cd ios
   pod install
   cd ..
   flutter run
   ```

6. **Run in release mode**
   ```bash
   flutter run --release
   ```

## Development

### Hot Reload

```bash
flutter run
# Press 'r' for hot reload
# Press 'R' for hot restart
```

### Run Tests

```bash
flutter test
```

### Build APK (Android)

```bash
flutter build apk --release
```

### Build AAB (Android Play Store)

```bash
flutter build appbundle --release
```

### Build IPA (iOS)

```bash
flutter build ios --release
```

## API Integration

The app uses Retrofit + Dio for API communication. API endpoints are automatically generated from the backend Express routes.

### Key Endpoints

**Auth:**

- `POST /auth/signup`
- `POST /auth/login`
- `GET /auth/me`
- `POST /auth/logout`

**Products:**

- `GET /products` - List products with filters
- `GET /products/suggestions` - Search suggestions
- `GET /products/{id}` - Product details

**Cart:**

- `GET /cart`
- `POST /cart/items`
- `PUT /cart/items/{id}`
- `DELETE /cart/items/{id}`

**Orders:**

- `GET /orders`
- `POST /orders`
- `GET /orders/{id}`

**Admin:**

- `GET /admin/users`
- `GET /admin/products`
- `POST /admin/products/{id}/approve`

See [API Documentation](../api/README.md) for complete endpoint details.

## State Management

The app uses **Riverpod** for state management.

### Example: Auth Provider

```dart
// Watch auth state
final authState = ref.watch(authProvider);

// Call methods
ref.read(authProvider.notifier).login(email, password);
```

### Example: Product Provider

```dart
// Watch products
final products = ref.watch(productsProvider(filter));

// Update filter
ref.read(productFilterProvider.notifier).state = newFilter;
```

## Styling & Theme

The app uses Material Design 3 with a custom green color scheme.

### Colors

- **Primary:** #2E7D32 (Green)
- **Secondary:** #FFC107 (Amber)
- **Error:** #B71C1C (Red)

### Fonts

- **Primary:** Poppins
- **Secondary:** Inter

## Database & Storage

- **Local Preferences:** SharedPreferences (tokens, user preferences)
- **Local Database:** Hive (optional, for offline support)
- **Cloud Storage:** Firebase Storage (product images)

## Firebase Integration

The app integrates with Firebase for:

- **Authentication:** Firebase Auth
- **Storage:** Firebase Cloud Storage
- **Messaging:** Firebase Cloud Messaging (push notifications)
- **Analytics:** Firebase Analytics

### Setup Firebase

1. Create a Firebase project
2. Add Android & iOS apps
3. Download `google-services.json` (Android) and `GoogleService-Info.plist` (iOS)
4. Place in appropriate directories

## Performance Optimization

- **Image Caching:** CachedNetworkImage for efficient loading
- **Pagination:** Implemented for product lists
- **Lazy Loading:** ListView.builder for large lists
- **Code Splitting:** Separate providers for different features
- **Build Optimization:** Release builds are optimized

## Security

- **JWT Tokens:** Stored securely in SharedPreferences
- **HTTPS:** All API calls use HTTPS
- **Input Validation:** All user inputs validated
- **Dependency Scanning:** Regular security audits

## Testing

### Unit Tests

```bash
flutter test
```

### Widget Tests

```bash
flutter test --verbose
```

### Integration Tests

```bash
flutter drive --target=test_driver/app.dart
```

## Troubleshooting

### Build Issues

**Clean build:**

```bash
flutter clean
flutter pub get
flutter pub run build_runner build --delete-conflicting-outputs
flutter run
```

**Android issues:**

```bash
cd android
./gradlew clean
cd ..
flutter run
```

**iOS issues:**

```bash
cd ios
rm -rf Pods
rm Podfile.lock
pod install
cd ..
flutter run
```

### Common Issues

| Issue                 | Solution                                                       |
| --------------------- | -------------------------------------------------------------- |
| Packages not found    | Run `flutter pub get` and `flutter pub run build_runner build` |
| API connection errors | Check backend is running and API base URL is correct           |
| Auth issues           | Clear SharedPreferences and login again                        |
| Image loading errors  | Check internet connection and image URLs                       |

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Commit with clear messages
5. Submit a pull request

## Git Workflow

```bash
# Create feature branch
git checkout -b feature/your-feature

# Make changes and commit
git add .
git commit -m "feat: add your feature"

# Push to remote
git push origin feature/your-feature

# Create pull request
```

## Deployment

### Android

1. Build release APK:

   ```bash
   flutter build apk --release
   ```

2. Sign with keystore:

   ```bash
   jarsigner -verbose -sigalg SHA256withRSA -digestalg SHA-256 \
     -keystore upload-keystore.jks build/app/outputs/apk/release/app-release-unsigned.apk
   ```

3. Upload to Google Play Store

### iOS

1. Build IPA:

   ```bash
   flutter build ipa --release
   ```

2. Archive in Xcode

3. Upload to App Store

## Documentation

- [Flutter Migration Guide](../FLUTTER_MIGRATION_GUIDE.md)
- [Backend API Documentation](../api/README.md)
- [Architecture Documentation](../ARCHITECTURE.md)
- [Flash Sales Guide](../docs/FLASH_SALES.md)
- [Admin Dashboard Guide](../docs/ADMIN_DASHBOARD.md)

## Dependencies

Key dependencies and their versions are in `pubspec.yaml`.

- **flutter_riverpod:** ^2.4.1 - State management
- **retrofit:** ^4.1.0 - HTTP client generation
- **dio:** ^5.3.1 - HTTP library
- **firebase_core:** ^2.24.2 - Firebase
- **cached_network_image:** ^3.3.0 - Image caching
- **stripe_flutter:** ^10.0.0 - Payment processing

See `pubspec.yaml` for complete list.

## Support

- 📖 [Flutter Documentation](https://flutter.dev/docs)
- 📖 [Riverpod Documentation](https://riverpod.dev)
- 📖 [Material Design](https://m3.material.io)
- 💬 [Flutter Community](https://flutter.dev/community)

## License

This project is part of the Nguzza platform. See main LICENSE for details.

## Roadmap

- [ ] Complete all screens
- [ ] Polish UI/UX with animations
- [ ] Implement offline support with Hive
- [ ] Add push notifications
- [ ] Implement video player for product demos
- [ ] Add AR product preview
- [ ] Implement social features (product sharing)
- [ ] Add multiple language support
- [ ] Performance improvements
- [ ] Beta testing
- [ ] App store release

---

**Status:** In Development
**Version:** 1.0.0
**Last Updated:** March 2026
