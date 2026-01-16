# Frontend Implementation Requirements

This document outlines the complete list of Frontend Pages and Components required to consume 100% of the Backend API functionalities.

> [!NOTE]
> All endpoints are prefixed with `/api/v1`.
> All protected routes require the `Authorization: Bearer <token>` header.
> All protected routes also require the `x-gateway-api-key: <key>` header.

---

## 1. Authentication Module

### 1.1 Sign Up Page
**Goal**: Create a new user account.
**Endpoints**: `POST /auth/register`
**Content-Type**: `multipart/form-data` (if avatar uploaded) or `application/json`.

| Field | Type | Required | Placeholder / Label | Validation Rules |
| :--- | :--- | :--- | :--- | :--- |
| **Email** | `email` | ✅ Yes | `john.doe@example.com` | Valid email format. |
| **Username** | `text` | ✅ Yes | `cooking_master` | Min 3, Max 30 chars. Unique. |
| **Password** | `password` | ✅ Yes | `********` | Min 8 chars. |
| **First Name** | `text` | ❌ No | `John` | Max 50 chars. |
| **Last Name** | `text` | ❌ No | `Doe` | Max 50 chars. |
| **Avatar** | `file` | ❌ No | `Upload Profile Picture` | Image types only. |
| **Bio** | `textarea` | ❌ No | `Tell us about yourself...` | Max 500 chars. |

### 1.2 Login Page
**Goal**: Authenticate and retrieve JWT tokens.
**Endpoints**: `POST /auth/login`

| Field | Type | Required | Placeholder / Label | Validation Rules |
| :--- | :--- | :--- | :--- | :--- |
| **Identifier** | `text` | ✅ Yes | `Email or Username` | Min 3 chars. |
| **Password** | `password` | ✅ Yes | `********` | |

### 1.3 Forgot Password Page
**Goal**: Request a password reset link.
**Endpoints**: `POST /auth/forgot-password`

| Field | Type | Required | Placeholder / Label | Validation Rules |
| :--- | :--- | :--- | :--- | :--- |
| **Email** | `email` | ✅ Yes | `Enter your registration email` | Valid email format. |

### 1.4 Reset Password Page
**Goal**: Set a new password using a token from email.
**Endpoints**: `POST /auth/reset-password`

| Field | Type | Required | Placeholder / Label | Validation Rules |
| :--- | :--- | :--- | :--- | :--- |
| **New Password** | `password` | ✅ Yes | `Enter new password` | Min 8 chars. |
| **Confirm Password** | `password` | ✅ Yes | `Confirm new password` | Must match. |
| *(Hidden)* | `token` | ✅ Yes | *(Extracted from URL)* | |

---

## 2. User Module

### 2.1 Public Profile Page
**Goal**: View another user's details.
**Endpoints**:
- `GET /users/:id` (Profile Info)
- `GET /users/:id/is-following` (Check status)
- `POST /users/:id/follow` (Action)
- `DELETE /users/:id/follow` (Action)
- `GET /recipes/author/:id` (User's recipes)

**UI Elements**:
- **Header**: Avatar, Username, Bio.
- **Stats**: Followers Count, Following Count.
- **Action Button**:
    - If `isFollowing == true` -> Show "Unfollow" (Secondary/Outline Button).
    - If `isFollowing == false` -> Show "Follow" (Primary Button).
    - *Menu*: "Block User" (`POST /users/:id/block`).
- **Tab 'Recipes'**: Grid of recipes created by this user.

### 2.2 Dashboard / Edit Profile (My Profile)
**Goal**: Manage personal account.
**Endpoints**: `GET /users/me`, `PUT /users/:id`

| Field | Type | Required | Placeholder / Label | Validation Rules |
| :--- | :--- | :--- | :--- | :--- |
| **Avatar** | `file` | ❌ No | `Change Avatar` | `POST /users/me/avatar` |
| **First Name** | `text` | ❌ No | `John` | |
| **Last Name** | `text` | ❌ No | `Doe` | |
| **Bio** | `textarea` | ❌ No | `Update your bio...` | |
| **Change Password** | `button` | - | `Change Password` | Opens Modal. |

### 2.3 Social Hub (Friends & Follows)
**Goal**: Manage relationships.
**Endpoints**:
- `GET /users/me/friends`
- `GET /users/me/friend-requests`
- `GET /users/me/followers`
- `GET /users/me/following`

**UI Structure**:
- **Tab 1: Friends**: List of cards (Avatar + Name + "Unfriend" button).
- **Tab 2: Requests**: List of pending requests.
    - Button: "Accept" (`PUT /users/friend-requests/:id/accept`).
    - Button: "Reject" (`PUT /users/friend-requests/:id/reject`).
- **Tab 3: Following**: List of users I follow.
- **Tab 4: Followers**: List of users following me.

---

## 3. Recipe Module

### 3.1 Recipe Feed (Home)
**Goal**: Discover recipes.
**Endpoints**: `GET /recipes` (supports pagination) or `GET /recipes/search`

**UI Elements**:
- **Recipe Card Component**:
    - Image (`url`).
    - Title (`title`).
    - Author (`Avatar + Username`).
    - Stats: Rating (`averageScore`), Time (`prepTime` + `cookTime`), Difficulty (`difficulty`).
    - Indication if "Favorited".

### 3.2 Recipe Detail Page
**Goal**: View full recipe info.
**Endpoints**:
- `GET /recipes/:id` (or `/recipes/by-slug/:slug`)
- `GET /recipes/:id/comments`
- `POST /recipes/:id/ratings`
- `POST /recipes/:id/comments`

**UI Elements**:
- **Hero Section**: Huge Image, Title, Description, Author.
- **Toolbar**:
    - **Favorite**: Heart Icon (`POST /recipes/:id/favorite` - *To be implemented if missing* or use `addToFavorites` if exists).
    - **Rate**: 5 Stars Interactive (`POST /recipes/:id/ratings`).
- **Info Grid**: Prep Time, Cook Time, Servings, Difficulty.
- **Ingredients List**: Checkbox list (for UX).
- **Instructions**: Step-by-step list.
- **Comments Section**:
    - Input: "Write a comment..." (Supports Markdown).
    - List: Comments + Replies.
    - *Real-time*: "User X is typing..." (Listen to `comment_typing_start`).

### 3.3 Create/Edit Recipe Page
**Goal**: Publish a recipe.
**Endpoints**: `POST /recipes` or `PUT /recipes/:id`

| Field | Type | Required | Placeholder / Label | Inputs |
| :--- | :--- | :--- | :--- | :--- |
| **Title** | `text` | ✅ Yes | `Ex: Chocolate Cake` | |
| **Description** | `textarea` | ✅ Yes | `Describe your recipe...` | |
| **Category** | `select` | ✅ Yes | `Select Category` | Fetch from `GET /categories`. |
| **Prep Time** | `number` | ✅ Yes | `Minutes` | |
| **Cook Time** | `number` | ✅ Yes | `Minutes` | |
| **Servings** | `number` | ✅ Yes | `Number of people` | |
| **Difficulty** | `select` | ✅ Yes | `Medium` | Options: EASY, MEDIUM, HARD. |
| **Ingredients** | `dynamic list` | ✅ Yes | - | Name, Quantity text, Optional checkbox. |
| **Instructions** | `dynamic list` | ✅ Yes | - | Step Number (auto), Description. |
| **Images** | `file` | ❌ No | `Upload Images` | (If supported via bulk upload endpoint). |

### 3.4 Search Page
**Goal**: Find specific recipes.
**Endpoints**: `GET /recipes/search`

**Filters (Sidebar)**:
- **Search Term**: `q` (Input Text).
- **Category**: `categoryId` (Dropdown).
- **Difficulty**: `difficulty` (Radio).
- **Time**: `maxPrepTime` (Slider).
- **Sort By**: Dropdown (`createdAt`, `viewCount`, `averageScore`).

---

## 4. Chat Module

### 4.1 Messenger Interface
**Goal**: Real-time communication.
**Endpoints**:
- `GET /users/me/friends` (To pick who to chat with).
- `GET /messages/:friendId` (Load history).
- `POST /messages` (Send message).

**UI Structure**:
- **Sidebar (Conversations)**:
    - List of Friends.
    - Online/Offline Indicator (Green dot).
    - *Real-time*: Listen to `user_status` event.
- **Chat Window**:
    - **Header**: Friend Name + Status.
    - **Message Area**: Scrollable list.
        - My messages: Right aligned, Blue.
        - Their messages: Left aligned, Gray.
    - **Input Area**: Text input + Send Button.
    - *Real-time*: Listen to `typing_start`, `typing_stop`, `new_message`.
    - *Error Handling*: "You cannot message this user" (if Blocked).

---

## 5. Notification Module

### 5.1 Notification Center
**Goal**: View alerts.
**Endpoints**: *Internal Logic via Websocket*
**Events**: `notification`

**UI Elements**:
- **Navbar Icon**: Bell.
- **Badge**: Red counter (increment on `new_notification`).
- **Dropdown List**:
    - "User X followed you" -> Link to User Profile.
    - "User Y liked your recipe" -> Link to Recipe.
    - "User Z commented..." -> Link to Recipe.

---

## 6. Admin Module (Optional)

### 6.1 Category Management
**Goal**: Manage system categories.
**Endpoints**: `POST /categories`, `DELETE /categories/:id`, `PUT /categories/:id`.
**Access**: Users with `role: "ADMIN"`.

| Field | Type | Required | Placeholder |
| :--- | :--- | :--- | :--- |
| **Name** | `text` | ✅ Yes | `Dessert` |
| **Color** | `color` | ❌ No | `#FF5733` |

---

## 7. Organization Module (Shopping & Planning)

### 7.1 Shopping List
**Goal**: Manage ingredients to buy.
**Endpoints**:
- `GET /shopping-list`
- `POST /shopping-list/items` (Add custom Item)
- `PUT /shopping-list/items/:id` (Check/Update)
- `DELETE /shopping-list/items/:id` (Remove)
- `DELETE /shopping-list/checked` (Clear Done)
- `POST /recipes/:id/shopping-list` (Add Recipe Ingredients)

**UI Elements**:
- **List View**: Items with Checkboxes.
    - *Action*: Click to toggle `isChecked`.
    - *Action*: Swipe to delete (Mobile) or Trash Icon.
- **Header Actions**:
    - "Add Item" (Modal).
    - "Clear Checked".
    - "Clear All".

### 7.2 Meal Planner
**Goal**: Calendar view of meals.
**Endpoints**:
- `GET /meal-plans` (Range `startDate`, `endDate`)
- `POST /meal-plans` (Schedule Recipe)
- `PUT /meal-plans/:id` (Reschedule)
- `DELETE /meal-plans/:id` (Remove)

**UI Elements**:
- **Calendar View**: Weekly/Monthly grid.
- **Draggable Cards**: Recipes placed on slots (Breakfast, Lunch, Dinner).
- **Add Modal**: Pick Recipe + Date + Type.

### 7.3 Collections
**Goal**: Group recipes (Cookbooks).
**Endpoints**:
- `GET /collections`
- `POST /collections`
- `GET /collections/:id`
- `POST /collections/:id/recipes`

**UI Elements**:
- **Grid View**: Folders with covers (4 preview images).
- **Create Modal**: Name + Description + Public/Private.
- **Collection Detail**: Grid of recipes inside.

---

## 8. Moderation Module (Reports)

### 8.1 Reporting Content
**Goal**: Report inappropriate content.
**Endpoints**:
- `POST /recipes/:id/report`
- `POST /comments/:id/report`

**UI Elements**:
- **Report Modal**:
    - Select Reason (Spam, Abusive, etc.).
    - Textarea Description.

### 8.2 Admin Dashboard (Reports)
**Goal**: Review reports.
**Endpoints**: `GET /admin/reports`, `PUT /admin/reports/:id`.
**UI**: Table of reports with status actions (Dismiss/Resolve).
