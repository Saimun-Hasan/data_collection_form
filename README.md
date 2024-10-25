# Audio Response Collection Form

A robust TypeScript-based form application for collecting audio responses, complete with user authentication, audio file storage in Google Drive, and an in-progress form builder.

## 🚀 Features

- **Audio Response Collection**: Supports audio file uploads for `.mp3` and `.wav` formats, with file storage in Google Drive via Google Drive API.
- **Registration & Login**: Basic authentication flow with registration and login using Redux Toolkit.
- **Responsive UI**: Built with [shadcn/ui](https://ui.shadcn.dev/) for a modern, responsive interface.
- **Scalable Architecture**: Utilizes Redux Toolkit (RTK) and RTK Query for streamlined state and API management.
- **TypeScript + SWC**: Ensures type safety and high performance with TypeScript and SWC for fast, efficient builds.

## 🛠️ Technologies

### Frontend
- **Languages & Frameworks**: TypeScript, SWC, Vite, React-Router-DOM
- **UI Library**: ShadCN UI
- **State Management**: Redux, RTK Query

### Backend
- **Server**: Express
- **Database**: PostgreSQL
- **File Storage**: Google Drive API for saving audio files to Google Drive

### File Uploads
- **Supported Formats**: `.mp3`, `.wav`
- **Upload Restrictions**: File size limit of 5MB with `multer` on the server

## 🔧 Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/audio-response-form.git
   cd audio-response-form
Install dependencies:
npm install
Run the development server:

npm run dev
Backend Setup:

Configure PostgreSQL and Google Drive API.
Run migrations and start the Express server.
📅 In Progress
Form Builder: Building a customizable form builder to enhance the flexibility of response collection.
