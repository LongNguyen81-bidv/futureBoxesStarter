# FutureBoxes - Viên Nang Thời Gian

Ứng dụng mobile cho phép bạn gửi tin nhắn, ảnh và câu hỏi cho chính mình trong tương lai.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Platform](https://img.shields.io/badge/platform-iOS%20%7C%20Android-lightgrey.svg)
![Expo](https://img.shields.io/badge/Expo-SDK%2054-000020.svg)

## 📱 Tính năng

### ✅ Đã hoàn thành (100%)

- **F1: Local Data Storage** - Lưu trữ dữ liệu bằng SQLite
- **F2: Type Selection** - 4 loại viên nang (Cảm xúc, Mục tiêu, Kỷ niệm, Quyết định)
- **F3: Capsule Creation** - Tạo viên nang với text, ảnh, câu hỏi
- **F4: Date Selection** - Chọn ngày mở khóa (presets + custom)
- **F5: Lock Capsule** - Khóa viên nang, không thể chỉnh sửa
- **F6: Capsule Timer** - Tự động mở khóa khi đến ngày
- **F7: Push Notifications** - Thông báo khi viên nang sẵn sàng
- **F8: Open Capsule** - Xem lại nội dung đã khóa
- **F9: Reflection** - Trả lời câu hỏi và đánh giá
- **F10: Celebration** - Animation khi hoàn thành reflection
- **F11: Archive** - Lưu trữ viên nang đã mở
- **F12: Haptic Feedback** - Rung phản hồi cho các tương tác
- **F13: Smooth Animations** - Reanimated cho UI mượt mà
- **F14: Design Polish** - Giao diện đẹp, UX tốt

### 🌐 Ngôn ngữ

- Toàn bộ app đã được dịch sang **Tiếng Việt**

## 🛠️ Tech Stack

- **Framework**: React Native (Expo SDK 54)
- **Language**: TypeScript
- **Database**: SQLite (expo-sqlite)
- **State Management**: React Hooks
- **Navigation**: File-based routing
- **Animations**: React Native Reanimated
- **Notifications**: expo-notifications
- **Background Tasks**: expo-background-fetch
- **Storage**: expo-file-system
- **Testing**: Jest + React Native Testing Library

## 📦 Cài đặt

### Yêu cầu

- Node.js 18+
- npm hoặc yarn
- Expo Go app (cho development)
- EAS CLI (cho production build)

### Bước 1: Clone repository

```bash
git clone https://github.com/LongNguyen81-bidv/futureBoxesStarter.git
cd futureBoxesStarter
```

### Bước 2: Cài đặt dependencies

```bash
npm install --legacy-peer-deps
```

### Bước 3: Chạy app

```bash
npx expo start
```

Sau đó:
- Quét QR code bằng **Expo Go** (iOS/Android)
- Hoặc nhấn `a` cho Android emulator
- Hoặc nhấn `i` cho iOS simulator

## 🚀 Build Production

### Build với EAS (Recommended)

#### Android APK

```bash
# Login vào Expo account
eas login

# Build preview APK
eas build --platform android --profile preview

# Build production
eas build --platform android --profile production
```

#### iOS

```bash
# Build cho simulator
eas build --platform ios --profile preview

# Build cho device (cần Apple Developer account)
eas build --platform ios --profile production
```

### Build Local (Alternative)

```bash
# Generate native projects
npx expo prebuild

# Build Android
npx expo run:android

# Build iOS (cần Mac)
npx expo run:ios
```

## 📂 Cấu trúc Project

```
futureBoxesStarter/
├── src/
│   ├── components/          # Reusable components
│   │   ├── CapsuleCard.tsx
│   │   ├── TypeCard.tsx
│   │   ├── DateSelector.tsx
│   │   └── ...
│   ├── screens/             # App screens
│   │   ├── OnboardingScreen.tsx
│   │   ├── HomeScreen.tsx
│   │   ├── CreateCapsuleScreen.tsx
│   │   └── ...
│   ├── services/            # Business logic
│   │   ├── databaseService.ts
│   │   ├── fileService.ts
│   │   ├── notificationService.ts
│   │   └── backgroundTaskService.ts
│   ├── database/            # SQLite schema
│   │   └── database.ts
│   ├── hooks/               # Custom hooks
│   │   └── useDatabase.ts
│   ├── constants/           # Theme, colors
│   │   ├── colors.ts
│   │   └── theme.ts
│   └── __tests__/           # Unit & integration tests
├── assets/                  # Images, fonts
├── app.json                 # Expo configuration
├── eas.json                 # EAS Build configuration
├── package.json
└── tsconfig.json
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test file
npm test -- CapsuleCard.test.tsx
```

## 🔧 Troubleshooting

### "Mismatch between javascript and native"

```bash
# Clear cache và restart
npx expo start -c
```

### "Unable to resolve module"

```bash
# Reinstall dependencies
rm -rf node_modules
npm install --legacy-peer-deps
```

### "Failed to register task" (Expo Go)

- Background tasks không hoạt động trên Expo Go
- Build development build hoặc production app để test

### Missing assets

- Assets (icon, splash) đã được remove tạm thời để build được
- Add lại sau khi có assets thật

## 📱 Tính năng theo Platform

| Tính năng | iOS | Android | Expo Go |
|-----------|-----|---------|---------|
| SQLite Database | ✅ | ✅ | ✅ |
| Push Notifications | ✅ | ✅ | ✅ |
| Background Tasks | ✅ | ✅ | ❌ |
| File System | ✅ | ✅ | ✅ |
| Haptic Feedback | ✅ | ✅ | ✅ |

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**LongNguyen81-bidv**
- GitHub: [@LongNguyen81-bidv](https://github.com/LongNguyen81-bidv)
- Email: longnh2bidv@gmail.com

## 🙏 Acknowledgments

- Expo team for the amazing framework
- React Native community
- Claude Code for development assistance

---

**Phát triển với ❤️ bằng React Native & Expo**
