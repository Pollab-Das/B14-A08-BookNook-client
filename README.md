# BookNook - A Small Online Library

**Live Site URL:** [https://b14-a08-book-nook-client.vercel.app/](https://b14-a08-book-nook-client.vercel.app/)

BookNook is a modern, full-stack online library application where users can explore, add, and borrow books. Built with Next.js (App Router), Express.js, BetterAuth, and MongoDB.

## 🔥 Key Features
- **Authentication:** Secure login and registration using Email/Password and Google OAuth (BetterAuth + JWT).
- **Book Management:** Users can add new books (with ImgBB image upload), edit their books, and delete them using a custom confirmation modal.
- **Borrow System:** Logged-in users can borrow books for 7 days. A user cannot borrow the same book twice at the same time. Available copies dynamically update using MongoDB `$inc`.
- **Dynamic Homepage:** Features a Swiper.js hero slider, dynamic "New Arrivals" section with category filters, and an Author Spotlight section.
- **Responsive UI:** A beautifully balanced color palette (Forest Green, Cream, and Terracotta) with full Dark/Light mode support.

## 🛠️ Tech Stack
- **Frontend:** Next.js 16 (App Router), TypeScript, Tailwind CSS, Shadcn UI, Swiper.js.
- **Backend:** Node.js, Express.js, MongoDB.
- **Authentication:** BetterAuth (MongoDB Adapter), JWT.
- **Image Hosting:** ImgBB API.

## 🚀 How to Run Locally
1. Clone the repositories:
   ```bash
   git clone <client-repo-link>
   git clone <server-repo-link>
