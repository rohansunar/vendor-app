# Products Feature Documentation

## Overview

The Products feature enables vendors to manage their catalog, including product details, pricing, deposits, and multi-image management with reordering capabilities.

## Architecture

### Components

- **ProductCard**: Premium list item displaying primary image, name, price, deposit, and status.
- **ProductForm**: Unified form for creation and editing with field validation and premium UI.
- **ProductImageManager**: Handles up to 5 images with drag-and-drop reordering, upload progress, and deletion.

### Data Model (`Product`)

- `id`: Unique identifier (UUID).
- `name`: String (Required).
- `description`: String (Optional).
- `price`: Number (Required).
- `deposit`: Number (Optional) - Refundable amount for jars/containers.
- `is_active`: Boolean - Controls visibility to customers.
- `is_schedulable`: Boolean - Enables subscription/reoccurring orders.
- `categoryId`: String (Required).
- `images`: string[] - Array of image URLs.

### Services & Hooks

- `productService`: Axios-based CRUD operations.
- `productImageService`: Image-specific operations (upload, reorder, delete).
- `useProducts`: Fetches the list of all products.
- `useProduct(id)`: Fetches a single product by ID.
- `useCreateProduct`: Mutation for adding new products.
- `useUpdateProduct`: Mutation for updating existing products.
- `useDeleteProduct` / `useRestoreProduct`: Mutations for toggling active status.

## Error Handling

- **Form Validation**: Client-side checks for required fields and valid numeric inputs.
- **API Resilience**: Try-catch blocks in all asynchronous operations with user-friendly alerts.
- **Image Safety**: Strict enforcement of the 5-image limit and file type validation.
- **Confirmations**: Destructive actions (like deleting an image) require explicit user confirmation.

## Extension Guidelines

- **Adding Fields**: Update the `Product` type in `types.ts`, then the form in `ProductForm.tsx`, and finally the service methods in `productService.ts`.
- **Custom Styling**: All components use a consistent design system based on the premium blue theme. Use `shared/ui` components where possible.
