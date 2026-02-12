# Enhanced Vendor Order Management Features Documentation

This document describes the newly implemented features for the Orders module in the Vendor application.

## Feature Overview

1.  **Enhanced Order List View**:
    *   **Distance Indicator**: Shows the delivery distance from the vendor to the customer.
    *   **Order Rejection**: Vendors can reject orders with specific reasons.
2.  **Rider Assignment System**:
    *   **Single Assignment**: Assign a rider to an individual order.
    *   **Bulk Assignment**: Select multiple orders and assign a rider in one go using the multi-select mode.
3.  **Self-Delivery Workflow**:
    *   **Out For Delivery**: Option to mark orders as "Out For Delivery" when self-delivering.
    *   **Delivery Confirmation**: Confirm delivery using either a customer-provided 4-digit OTP or by capturing a photo proof.
4.  **COD Order Indication**:
    *   Prominent visual highlighting for Cash On Delivery orders to remind vendors of payment collection.

## Implementation Details

### Relevant Files
*   `features/orders/orders.types.ts`: Updated `Order` type with new fields.
*   `features/orders/services/order.service.ts`: Added API methods for rejection, assignment, and confirmation.
*   `features/orders/hooks/useRiderAssignment.ts`: Consolidated React Query hook for fetching riders and performing assignments (single and bulk).
*   `features/orders/orders.utils.ts`: Utility functions for the feature.
*   `features/orders/components/OrderCard.tsx`: Main component housing the new UI and logic.
*   `features/orders/components/RejectionReasonModal.tsx`: Modal for selecting rejection reasons.
*   `features/orders/components/RiderSelectionModal.tsx`: Modal for rider assignment.
*   `features/orders/components/DeliveryConfirmationModal.tsx`: Modal for OTP/Photo confirmation.
*   `app/(protected)/(tabs)/orders.tsx`: Screen updated for multi-select and bulk actions.

### Integration Points
*   **Distance Calculation**: Uses the Haversine formula to compute distance if coordinates are available.
*   **Multi-Select**: Leverages the existing `OrdersSelectionContext` for state management.
*   **State Management**: Uses `@tanstack/react-query` for optimistic updates and cache invalidation.

## Testing and Debugging Guide

### Testing Steps
1.  **Distance**: Verify the distance badge appears on the order card.
2.  **Rejection**: Click "Reject", select a reason, and confirm. Verify the card updates or disappears (depending on filter).
3.  **Assignment**: Click "Assign Rider", select a rider, and verify the rider's name appears on the card.
4.  **Bulk Assignment**: Toggle "Select Multiple", select several orders, and click the bulk assignment button at the bottom.
5.  **Self-Delivery**: Mark an order as "Self Delivery", then verify the "Confirm Delivery" button appears.
6.  **Confirmation**: Click "Confirm Delivery", enter the 4-digit OTP (or mock photo), and verify the status changes to DELIVERED.

### Debugging
*   **API Failures**: Check the network tab or console for Axios errors. Ensure the mock endpoints match the backend implementation.
*   **Selection Mode**: If selection isn't working, verify the `OrdersSelectionProvider` is correctly wrapping the `OrdersScreenContent`.

## Extensibility Guide

*   **Adding Rejection Reasons**: Modify the `REJECTION_REASONS` constant in `RejectionReasonModal.tsx`.
*   **Modifying COD Indication**: Adjust the styles `codCard` and `codBadge` in `OrderCard.tsx`.
*   **New Confirmation Methods**: Update the `DeliveryConfirmationModal.tsx` and the `Order` type's `confirmation_method` field.
*   **External Rider System**: Replace the mock riders in `RiderSelectionModal.tsx` with a call to a `useRiders` hook.
