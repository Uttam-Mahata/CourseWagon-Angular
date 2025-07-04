
# Course Wagon - Angular Application

CourseWagon is a web application designed to streamline course management and subject generation using Generative AI. This Angular application interacts with a Flask backend to manage courses, subjects, modules, chapters, topics, subtopics, and their respective content.

## Table of Contents
- [Project Overview](#project-overview)
- [Features](#features)
- [Installation](#installation)
  - [Prerequisites](#prerequisites)
  - [Setup Steps](#setup-steps)
- [Usage](#usage)
  - [General Workflow](#general-workflow)
  - [Service Methods](#service-methods)
  - [Example Usage](#example-usage)
- [Real-Life Applications](#real-life-applications)
- [Screenshots](#screenshots)
- [Tech Stack](#tech-stack)
  - [Frontend](#frontend)
  - [Backend (Separate Repository)](#backend-separate-repository)
- [File Structure](#file-structure)
- [API Interaction](#api-interaction)
- [Deployment](#deployment)
  - [To Deploy to Firebase](#to-deploy-to-firebase)
- [Contributing](#contributing)
- [License](#license)

## Project Overview

Welcome to Course Wagon! This innovative web application empowers educators and content creators by streamlining course management and leveraging the power of Generative AI for dynamic subject and content generation.

Course Wagon utilizes a robust architecture with an **Angular frontend** providing a responsive and interactive user experience, and a **Flask backend** handling the core logic, data management, and AI integration. This separation of concerns ensures a scalable and maintainable platform.

The application allows users to seamlessly perform CRUD (Create, Read, Update, Delete) operations on various educational entities including courses, subjects, modules, chapters, topics, and subtopics. This makes it an indispensable tool for efficiently managing and expanding educational offerings.

## Features

Course Wagon offers a rich set of features for both educators and administrators:

- **Comprehensive Course Management:**
    - Create, Read, Update, and Delete (CRUD) courses.
    - Organize courses into subjects, modules, chapters, and topics.
- **AI-Powered Content Generation:**
    - Automatically generate subjects, modules, chapters, topics, and subtopics using Generative AI.
    - Generate textual content for subtopics.
- **User Management & Authentication:**
    - Secure user registration and login.
    - User profile management.
    - Role-based access control (implicitly, via admin features).
- **Administrator Dashboard:**
    - Manage users and their roles/permissions.
    - Oversee and manage testimonials.
- **Interactive Content Viewing:**
    - Support for Markdown rendering for rich text formatting.
    - KaTeX integration for displaying mathematical formulas.
    - PrismJS for syntax highlighting in code blocks.
    - Mermaid JS integration for rendering diagrams and flowcharts from text.
- **Testimonials & Reviews:**
    - Users can submit reviews and testimonials.
    - Admins can manage and display testimonials.
- **Responsive User Interface:**
    - Built with Angular and styled with Tailwind CSS for a modern and responsive design.
    - Utilizes FontAwesome for icons.
- **Detailed Data Retrieval:** Fetch granular details about all educational entities and their content.

## Installation

Follow these steps to set up and run the Course Wagon Angular application locally.

**Prerequisites:**

*   **Node.js:** Ensure you have Node.js installed. We recommend using the latest LTS (Long Term Support) version. You can download it from [nodejs.org](https://nodejs.org/).
*   **Angular CLI:** Install the Angular CLI globally if you haven't already. The project uses version `~19.2.10`.
    ```bash
    npm install -g @angular/cli@^19.2.10
    ```
*   **Flask Backend:** This frontend application requires the Course Wagon Flask backend to be running. Please refer to the backend repository's `README.md` for setup instructions.

**Setup Steps:**

1.  **Clone the Repository (if you haven't already):**
    If you're viewing this on GitHub, you can clone the repository using the URL provided on the GitHub page.
    ```bash
    # Example: git clone https://github.com/actual-org/CourseWagon-Angular.git
    cd CourseWagon-Angular
    ```

2.  **Install Dependencies:**
    Navigate to the project root and install the necessary Node.js packages:
    ```bash
    npm install
    ```

3.  **Configure API URL:**
    The application connects to the Flask backend API. The API base URL is configured in the environment files:
    *   For development: `src/environments/environment.ts`
    *   For production: `src/environments/environment.prod.ts`

    Update the `courseApiUrl` (and potentially `apiBaseUrl` if your backend serves images from a different root) property in these files to point to your running Flask backend. Example for `src/environments/environment.ts`:
    ```typescript
    export const environment = {
      production: false,
      apiBaseUrl: 'http://127.0.0.1:5000', // Adjust if your backend is elsewhere
      courseApiUrl: 'http://127.0.0.1:5000/courses', // Adjust if your backend is elsewhere
      // ... other environment variables
    };
    ```

4.  **Run the Flask Backend:**
    Start your Flask backend application as per its documentation. It typically runs on `http://127.0.0.1:5000`.

5.  **Run the Angular Application:**
    Once the backend is running and the API URL is configured, start the Angular development server:
    ```bash
    ng serve
    ```
    This command will compile the application and serve it locally.

6.  **Access the Application:**
    Open your web browser and navigate to `http://localhost:4200`. If `ng serve` uses a different port, it will be indicated in the terminal output.

## Usage

Once the application is installed and running, users can interact with Course Wagon through their web browser.

**General Workflow:**

1.  **Authentication:** Users typically start by registering for an account or logging in if they already have one.
2.  **Dashboard/Homepage:** After logging in, users might be directed to a dashboard where they can see their existing courses or options to create new ones.
3.  **Course Creation & Management:**
    *   Users can create new courses, providing names and descriptions.
    *   For existing courses, they can manage content by adding or generating subjects, modules, chapters, and topics.
    *   The AI generation features can be invoked at various levels (e.g., generate all subjects for a course, or all topics for a chapter).
4.  **Content Interaction:** Users can view course content, which may include rich text, mathematical formulas, code snippets, and diagrams.
5.  **Admin Functions (for administrators):**
    *   Admins have access to a separate dashboard to manage users, site-wide settings, and testimonials.
6.  **Profile Management:** Users can manage their own profile information.
7.  **Submitting Reviews:** Users can write and submit reviews or testimonials for courses or the platform.

### Service Methods

For developers looking to understand the frontend's interaction with the backend, the Angular services (primarily `CourseService`, `SubjectService`, `ChapterService`, etc., found in `src/app/services/`) are key. The `CourseService` (and similar services for other entities) provides methods to interact with the Flask backend API. Here are some illustrative examples from `CourseService`:

- **addCourse(name: string):** Adds a new course.
- **getCourses():** Retrieves the list of all courses.
- **getCourseDetails(courseId: number):** Retrieves detailed information about a specific course.
- **getModuleDetails(courseId: number, subjectId: number, moduleId: number):** Retrieves details of a specific module.
- **getTopicDetails(courseId: number, subjectId: number, moduleId: number, chapterId: number, topicId: number):** Retrieves details of a specific topic.
- **generateSubjects(courseId: number):** Generates subjects for a specified course.
- **getSubjects(courseId: number):** Retrieves subjects for a specified course.
- **generateModules(courseId: number, subjectId: number):** Generates modules for a specified subject.
- **getModules(courseId: number, subjectId: number):** Retrieves modules for a specified subject.
- **generateChapters(courseId: number, subjectId: number, moduleId: number):** Generates chapters for a specified module.
- **getChapters(courseId: number, subjectId: number, moduleId: number):** Retrieves chapters for a specified module.
- **generateTopics(courseId: number, subjectId: number, moduleId: number, chapterId: number):** Generates topics for a specified chapter.
- **getTopics(courseId: number, subjectId: number, moduleId: number, chapterId: number):** Retrieves topics for a specified chapter.
- **generateSubtopics(courseId: number, subjectId: number, moduleId: number, chapterId: number, topicId: number):** Generates subtopics for a specified topic.
- **getSubtopics(courseId: number, subjectId: number, moduleId: number, chapterId: number, topicId: number):** Retrieves subtopics for a specified topic.
- **generateContent(courseId: number, subjectId: number, moduleId: number, chapterId: number, topicId: number, subtopicId: number):** Generates content for a specified subtopic.
- **getContent(courseId: number, subjectId: number, moduleId: number, chapterId: number, topicId: number, subtopicId: number):** Retrieves content for a specified subtopic.

### Example Usage
Here's how to use the `CourseService` in your Angular components:

```typescript
import { Component, OnInit } from '@angular/core';
import { CourseService } from './course.service';

@Component({
  selector: 'app-course-list',
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.css']
})
export class CourseListComponent implements OnInit {
  courses: any[] = [];

  constructor(private courseService: CourseService) {}

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses(): void {
    this.courseService.getCourses().subscribe(data => {
      this.courses = data;
    });
  }

  addCourse(courseName: string): void {
    this.courseService.addCourse(courseName).subscribe(() => {
      this.loadCourses(); // Reload courses after adding
    });
  }
}
```

## Real-Life Applications
- **Educational Institutions:** Helps streamline curriculum creation and management.
- **Online Learning Platforms:** Expands course offerings based on market demands.
- **Content Creators:** Facilitates the quick addition of relevant subjects and topics.

## Screenshots

*(Placeholder for screenshots of the application - e.g., dashboard, course creation, content view)*

*   *Screenshot 1: Description*
*   *Screenshot 2: Description*
*   *Screenshot 3: Description*

## Tech Stack

**Frontend:**

*   **Angular (v19+):** Core framework for building the single-page application.
*   **TypeScript:** Primary language for Angular development.
*   **Tailwind CSS (v4+):** Utility-first CSS framework for styling.
*   **RxJS:** For reactive programming and managing asynchronous operations.
*   **ngx-markdown:** For rendering Markdown content.
*   **Katex:** For rendering mathematical formulas.
*   **PrismJS:** For syntax highlighting of code blocks.
*   **Mermaid:** For rendering diagrams and flowcharts from text.
*   **FontAwesome:** For icons.
*   **Node.js & npm:** For development environment and package management.

**Backend (Separate Repository):**

*   **Flask:** Python web framework for the backend API.
*   **Python:** Primary language for backend development.
*   **(Assumed) Database:** (e.g., PostgreSQL, MySQL, SQLite) for data persistence.
*   **(Assumed) Generative AI Service:** (e.g., OpenAI GPT API, Google Gemini API) for content generation.

## File Structure

A brief overview of the key directories:

```
CourseWagon-Angular/
├── src/
│   ├── app/                        # Core application components, modules, services
│   │   ├── admin/                  # Admin dashboard components
│   │   ├── auth/                   # Authentication components and services
│   │   ├── courses/                # Components related to course listing, creation
│   │   ├── course/                 # Components related to a single course view
│   │   ├── course-content/         # Components for displaying course content sections
│   │   ├── profile/                # User profile components
│   │   ├── services/               # Angular services (HTTP clients for backend)
│   │   ├── shared/                 # Shared modules, components, pipes, directives
│   │   └── ...                     # Other feature modules/components
│   ├── assets/                     # Static assets like images, fonts
│   ├── environments/               # Environment-specific configurations (dev, prod)
│   ├── index.html                  # Main HTML page
│   ├── main.ts                     # Main entry point of the application
│   └── styles.css                  # Global styles
├── .firebaserc                     # Firebase project configuration
├── firebase.json                   # Firebase hosting and functions configuration
├── angular.json                    # Angular CLI workspace configuration
├── package.json                    # Project dependencies and scripts
└── README.md                       # This file
```

## API Interaction

The Angular frontend communicates with the Flask backend via a RESTful API.

*   **Requests:** HTTP requests (GET, POST, PUT, DELETE) are made from Angular services (e.g., `CourseService`, `AuthService`) to specific backend endpoints.
*   **Data Format:** Data is typically exchanged in JSON format.
*   **Authentication:** API requests requiring authentication include a JWT (JSON Web Token) in the Authorization header, managed by `AuthInterceptor` and `AuthService`.
*   **Error Handling:** Services include logic to handle API errors and provide feedback to the user.

## Deployment

This application is configured for deployment using **Firebase Hosting**.

*   The `firebase.json` file contains the configuration for Firebase, including the public directory (`dist/course-wagon-angular/browser` as per a typical Angular build output for Firebase).
*   The `.firebaserc` file specifies the Firebase project.

**To Deploy to Firebase:**

1.  **Build for Production:**
    ```bash
    ng build --configuration production
    # or ng build (if production is default)
    ```
    This will create a `dist/course-wagon-angular/browser` directory with the production-ready static files. Check your `angular.json` for the exact `outputPath`.

2.  **Firebase Login (if not already logged in):**
    ```bash
    firebase login
    ```

3.  **Deploy:**
    ```bash
    firebase deploy --only hosting
    ```
    Ensure your Firebase project is correctly set up and selected.

## Contributing

We welcome contributions to Course Wagon! If you'd like to contribute, please follow these guidelines:

1.  **Fork the repository** on GitHub.
2.  **Clone your fork** locally: `git clone https://github.com/YOUR_USERNAME/CourseWagon-Angular.git`
3.  **Create a new branch** for your feature or bug fix: `git checkout -b feature/your-feature-name` or `bugfix/your-bug-fix-name`.
4.  **Make your changes** and commit them with clear, descriptive messages.
5.  **Push your changes** to your fork: `git push origin feature/your-feature-name`.
6.  **Open a Pull Request (PR)** against the `main` (or `develop`) branch of the original repository.
    *   Provide a clear title and description for your PR.
    *   Reference any related issues.
7.  Ensure your code adheres to the project's coding standards (details to be added, e.g., run linters).

## License

This project is licensed under the terms of the **MIT License**. See the [LICENSE](LICENSE) file for details.
