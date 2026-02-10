# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.

```
src/
├── app/                            # expo-router ONLY
│   ├── _layout.tsx
│   ├── index.tsx
│   ├── auth/
│   │   ├── login.tsx
│   │   └── otp.tsx
│   ├── address/
│   │   └── select.tsx
│   ├── product/
│   │   ├── create.tsx
│   │   └── images.tsx
│   ├── orders/
│   │   ├── index.tsx
│   │   └── [orderId].tsx
│   ├── delivery/
│   │   └── confirm.tsx
│   ├── profile/
│   │   └── edit.tsx
│   └── bank/
│       └── manage.tsx
│
├── features/
│
│   ├── auth/
│   │   ├── components/
│   │   │   └── AuthForm.tsx
│   │   │   └── auth.styles.ts
│   │   ├── hooks/
│   │   │   ├── useLogin.ts
│   │   │   └── useVerifyOtp.ts
│   │   ├── auth.service.ts
│   │   ├── auth.store.ts
│   │   ├── auth.schema.ts
│   │   ├── auth.types.ts
│   │   └── index.ts
│
│   ├── address/
│   │   ├── components/
│   │   │   ├── AddressMap.tsx
│   │   │   └── address.styles.ts
│   │   ├── hooks/
│   │   │   └── useAddress.ts
│   │   ├── address.service.ts
│   │   ├── address.schema.ts
│   │   ├── address.types.ts
│   │   └── index.ts
│
│   ├── product/
│   │   ├── components/
│   │   │   ├── ProductForm.tsx
│   │   │   ├── ProductImagePicker.tsx
│   │   │   └── product.styles.ts
│   │   ├── hooks/
│   │   │   ├── useCreateProduct.ts
│   │   │   ├── useUpdateProduct.ts
│   │   │   └── useUploadProductImage.ts
│   │   ├── product.service.ts
│   │   ├── product.schema.ts
│   │   ├── product.types.ts
│   │   └── index.ts
│
│   ├── orders/
│   │   ├── components/
│   │   │   ├── OrderCard.tsx
│   │   │   └── orders.styles.ts
│   │   ├── hooks/
│   │   │   ├── useOrders.ts
│   │   │   └── useUpdateOrderStatus.ts
│   │   ├── orders.service.ts
│   │   ├── orders.types.ts
│   │   └── index.ts
│
│   ├── delivery/
│   │   ├── components/
│   │   │   └── DeliveryProofCamera.tsx
│   │   ├── hooks/
│   │   │   └── useConfirmDelivery.ts
│   │   ├── delivery.service.ts
│   │   ├── delivery.types.ts
│   │   └── index.ts
│
│   ├── profile/
│   │   ├── components/
│   │   │   └── ProfileForm.tsx
│   │   ├── hooks/
│   │   │   └── useUpdateProfile.ts
│   │   ├── profile.service.ts
│   │   ├── profile.types.ts
│   │   └── index.ts
│
│   └── bank/
│       ├── components/
│       │   └── BankForm.tsx
│       ├── hooks/
│       │   ├── useAddBank.ts
│       │   ├── useUpdateBank.ts
│       │   └── useDeleteBank.ts
│       ├── bank.service.ts
│       ├── bank.schema.ts
│       ├── bank.types.ts
│       └── index.ts
│
├── shared/  # cross-feature only
│   ├── api/
│   │   └── client.ts
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   └── Loader.tsx
│   ├── hooks/
│   │   └── usePushNotifications.ts
│   ├── styles/
│   │   ├── theme.ts
│   │   └── spacing.ts
│   ├── utils/
│   │   ├── permissions.ts
│   │   └── errors.ts
│   └── constants.ts
│
├── providers/
│   ├── AuthProvider.tsx
│   └── QueryProvider.tsx
│
├── tests/
├── assets/
├── app.config.ts
└── main.tsx
```

The index.ts Pattern (Very Important)

Every feature exposes a public API.

Now imports look like:

import { ProductForm, useCreateProduct } from '@/features/product';

Before creating a file, ask:

Is this feature-specific?
→ keep inside feature

Is this pure UI?
→ components/

Is this one business action?
→ one hook

Is this backend/native interaction?
→ service

Used by 2+ features?
→ shared/

If unsure → keep it inside the feature

Add ESLint boundary rules
