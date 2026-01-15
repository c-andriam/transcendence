# Backend API Documentation

This document lists all available HTTP endpoints in the backend, categorized by their respective tags.

## **Authentication** (`/auth`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/auth/register` | Register a new user |
| `POST` | `/auth/login` | Login user |
| `POST` | `/auth/refresh` | Refresh access token |
| `POST` | `/auth/logout` | Logout user |
| `POST` | `/auth/forgot-password` | Request password reset email |
| `POST` | `/auth/reset-password` | Reset password using token |
| `POST` | `/auth/verify-email` | Verify email address |
| `POST` | `/auth/resend-verification` | Resend verification email |

## **Users** (`/users`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/users/me` | Get current user's profile |
| `GET` | `/users` | Get all users |
| `GET` | `/users/search` | Search for users |
| `GET` | `/users/:id` | Get specific user profile |
| `POST` | `/users` | Create user (Admin?) |
| `PUT` | `/users/:id` | Update user profile |
| `DELETE` | `/users/:id` | Delete user |
| `POST` | `/users/change-password` | Change current user's password |
| `POST` | `/users/api-key/generate` | Generate a new API Key |
| `POST` | `/users/me/avatar` | Upload user avatar |

### Social (Follows & Friends)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/users/:id/follow` | Follow a user |
| `DELETE` | `/users/:id/follow` | Unfollow a user |
| `GET` | `/users/me/followers` | Get my followers |
| `GET` | `/users/me/following` | Get who I am following |
| `GET` | `/users/:id/followers` | Get user's followers |
| `GET` | `/users/:id/following` | Get who user is following |
| `GET` | `/users/:id/is-following` | Check if following a user |
| `POST` | `/users/friend-requests` | Send friend request |
| `PUT` | `/users/friend-requests/:id/accept` | Accept friend request |
| `PUT` | `/users/friend-requests/:id/reject` | Reject friend request |
| `DELETE` | `/users/friends/:friendId` | Remove friend |
| `GET` | `/users/me/friends` | Get my friends |
| `GET` | `/users/me/friend-requests` | Get my friend requests |
| `POST` | `/users/:id/block` | Block a user |
| `DELETE` | `/users/:id/block` | Unblock a user |
| `GET` | `/users/me/blocked` | Get blocked users |

## **Recipes** (`/recipes`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/recipes` | Get all recipes |
| `POST` | `/recipes` | Create a new recipe |
| `GET` | `/recipes/search` | Advanced search for recipes |
| `GET` | `/recipes/me` | Get current user's recipes |
| `GET` | `/recipes/:id` | Get recipe by ID |
| `PUT` | `/recipes/:id` | Update recipe |
| `DELETE` | `/recipes/:id` | Delete recipe |
| `GET` | `/recipes/by-slug/:slug` | Get recipe by Slug |
| `GET` | `/recipes/category/:categoryId` | Get recipes by category |
| `GET` | `/recipes/author/:authorId` | Get recipes by author |
| `GET` | `/recipes/difficulty/:difficulty` | Get recipes by difficulty |

### Ratings
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/recipes/:id/ratings` | Get ratings for a recipe |
| `POST` | `/recipes/:id/ratings` | Rate a recipe |
| `PUT` | `/recipes/:id/ratings` | Update rating |
| `DELETE` | `/recipes/:id/ratings` | Remove rating |

### Favorites
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/me/favorites` | Get my favorite recipes |
| `POST` | `/recipes/:id/favorite` | Add recipe to favorites |
| `DELETE` | `/recipes/:id/favorite` | Remove recipe from favorites |

### Images
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/recipes/:recipeId/images` | Get recipe images |
| `POST` | `/recipes/:recipeId/images/upload` | Upload single image |
| `POST` | `/recipes/:recipeId/images/uploads` | Upload multiple images |
| `POST` | `/recipes/:recipeId/images/url` | Add image by URL |
| `POST` | `/recipes/:recipeId/images/urls` | Add multiple images by URL |
| `PUT` | `/recipes/:recipeId/images/:imageId` | Update image (alt text) |
| `DELETE` | `/recipes/:recipeId/images/:imageId` | Delete image |
| `DELETE` | `/recipes/:recipeId/images/bulk` | Bulk delete images |
| `POST` | `/recipes/:recipeId/images/:imageId/primary` | Set primary image |
| `PUT` | `/recipes/:recipeId/images/reorder` | Reorder images |

## **Comments** (`/recipes/:id/comments`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/recipes/:id/comments` | Get comments for a recipe |
| `POST` | `/recipes/:id/comments` | Add a comment |
| `PUT` | `/recipes/:id/comments/:commentId` | Update a comment |
| `DELETE` | `/recipes/:id/comments/:commentId` | Delete a comment |
| `POST` | `/recipes/:id/comments/:commentId/replies` | Reply to a comment |

## **Categories** (`/categories`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/categories` | Get all categories |
| `POST` | `/categories` | Create category |
| `GET` | `/categories/:id` | Get category by ID |
| `GET` | `/categories/by-slug/:slug` | Get category by Slug |
| `PUT` | `/categories/:id` | Update category |
| `DELETE` | `/categories/:id` | Delete category |

## **Dietary Tags** (`/dietary-tags`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/dietary-tags` | Get all dietary tags |
| `POST` | `/dietary-tags` | Create dietary tag |
| `GET` | `/dietary-tags/:id` | Get dietary tag by ID |
| `PUT` | `/dietary-tags/:id` | Update dietary tag |
| `DELETE` | `/dietary-tags/:id` | Delete dietary tag |

## **Collections** (`/collections`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/collections` | Get all collections |
| `POST` | `/collections` | Create collection |
| `GET` | `/collections/:id` | Get collection details |
| `PUT` | `/collections/:id` | Update collection |
| `DELETE` | `/collections/:id` | Delete collection |
| `POST` | `/collections/:id/recipes` | Add recipe to collection |
| `DELETE` | `/collections/:id/recipes/:recipeId` | Remove recipe from collection |

## **Shopping List** (`/shopping-list`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/shopping-list` | Get shopping list |
| `POST` | `/shopping-list/items` | Add item manually |
| `POST` | `/recipes/:id/shopping-list` | Add ingredients from recipe |
| `PUT` | `/shopping-list/items/:id` | Update item (check/uncheck) |
| `DELETE` | `/shopping-list/items/:id` | Remove item |
| `DELETE` | `/shopping-list/checked` | Remove all checked items |
| `DELETE` | `/shopping-list` | Clear shopping list |

## **Meal Plans** (`/meal-plans`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/meal-plans` | Get all meal plans |
| `POST` | `/meal-plans` | Create meal plan |
| `GET` | `/meal-plans/:date` | Get meal plan for date |
| `PUT` | `/meal-plans/:id` | Update meal plan |
| `DELETE` | `/meal-plans/:id` | Delete meal plan |

## **Notifications** (`/notifications`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/notifications` | Get all notifications |
| `PUT` | `/notifications/read-all` | Mark all as read |
| `GET` | `/notifications/:id` | Get specific notification |
| `PUT` | `/notifications/:id/read` | Mark as read |
| `DELETE` | `/notifications/:id` | Delete notification |

## **Reports** (`/admin/reports`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/admin/reports` | Get all reports |
| `GET` | `/admin/reports/stats` | Get report statistics |
| `GET` | `/admin/reports/:id` | Get report details |
| `PUT` | `/admin/reports/:id` | Update report status |
| `POST` | `/recipes/:id/report` | Report a recipe |
| `POST` | `/comments/:id/report` | Report a comment |
