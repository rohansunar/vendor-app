# Rider Management Feature

This feature allows vendors to add and manage rider information (Name and Phone) directly within the app.

## Implemented Features
1.  **Add Rider Section**:
    -   Integrated into `RiderSelectionModal` for quick addition during order assignment.
    -   Added to the `Profile` screen for general management.
2.  **Validation**:
    -   Zod-based validation for Name (min 2 chars) and Phone (exactly 10 digits).
3.  **Real-time Updates**:
    -   Successful rider addition triggers a refetch of the riders list across the app using React Query.
4.  **Error Handling**:
    -   Comprehensive try-catch blocks in service and hooks.
    -   User-friendly toast messages for success and error scenarios.
5.  **UI/UX**:
    -   Minimalist design following the app's premium aesthetic.
    -   Responsive layout for iPhone/Android.
    -   Support for light and dark modes (using theme-consistent colors).

## Technical Implementation
-   **Service**: `features/riders/rider.service.ts`
-   **Hooks**: `features/riders/hooks/useRiders.ts`
-   **Validation**: `features/riders/rider.schema.ts`
-   **Components**: `features/riders/components/AddRiderForm.tsx`

## How to Debug
-   Check network requests for `POST /riders`.
-   Verify React Query state for the `['riders']` query key.
-   Check `react-native-toast-message` for feedback.

## API Documentation Update
### POST /riders
**Request Body**:
```json
{
  "name": "Jane Doe",
  "phone": "9876543210"
}
```

**Response Data (Sample)**:
```json
{
  "id": "rider_123",
  "name": "Jane Doe",
  "phone": "9876543210"
}
```
