# Test Application

An Angular-based online testing application with multiple-choice questions, writing tasks, and timed assessments.

## Features

- Student profile creation
- Multiple-choice question sections with pagination
- Writing task submission
- Configurable timer with persistence across page refreshes
- Answer tracking and local storage backup
- Progress tracking with stepper component
- API integration for questions and answer submissions

## Prerequisites

- Node.js (v18 or higher recommended)
- npm (Node Package Manager)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd test-app
```

2. Install dependencies:
```bash
npm install
```

## Configuration

### Environment Variables

The application uses environment-based configuration for flexibility across different deployment scenarios.

#### Timer Duration

Configure the test timer duration (in seconds) in the environment files:

- **Development**: `src/environments/environment.ts`
- **Production**: `src/environments/environment.prod.ts`

```typescript
timerDuration: 30 * 60  // 30 minutes (1800 seconds)
```

#### API Base URL

Configure the API endpoint:

- **Development**: Uses `/api` with proxy configuration (see `proxy.conf.json`)
- **Production**: Uses full URL `https://elc-onlinetest.incenplus.com/api`

### Proxy Configuration

The development proxy is configured in `proxy.conf.json`:

```json
{
  "/api": {
    "target": "https://elc-onlinetest.incenplus.com",
    "secure": false,
    "changeOrigin": true
  }
}
```

## Running the Application

### Development Server

Start the development server:

```bash
npm start
```

Or using Angular CLI:

```bash
ng serve
```

The application will be available at `http://localhost:3000`

### Production Build

Build the application for production:

```bash
npm run build
```

Or using Angular CLI:

```bash
ng build
```

The build artifacts will be stored in the `dist/` directory.

### Running Tests

Execute unit tests with Vitest:

```bash
npm test
```

Or using Angular CLI:

```bash
ng test
```

## Project Structure

```
test-app/
├── src/
│   ├── app/
│   │   ├── pages/              # Page components
│   │   │   ├── home/           # Home/landing page
│   │   │   ├── test/           # Multiple-choice test page
│   │   │   └── writing-task/   # Writing task submission page
│   │   ├── services/           # API services
│   │   │   ├── answer.service.ts
│   │   │   ├── question.service.ts
│   │   │   └── student.service.ts
│   │   ├── shared/             # Shared components
│   │   │   └── components/
│   │   │       ├── navbar/     # Navigation bar
│   │   │       ├── stepper/    # Progress stepper
│   │   │       └── time/       # Timer component
│   │   ├── app.config.ts       # Application configuration
│   │   ├── app.routes.ts       # Route definitions
│   │   └── app.html            # Root template
│   ├── environments/           # Environment configurations
│   │   ├── environment.ts      # Development config
│   │   └── environment.prod.ts # Production config
│   ├── assets/                 # Static assets
│   ├── styles.css              # Global styles
│   └── main.ts                 # Application entry point
├── proxy.conf.json             # Development proxy config
├── angular.json                # Angular CLI configuration
├── package.json                # Dependencies and scripts
└── tsconfig.json               # TypeScript configuration
```

## Application Flow

1. **Home Page**: Student enters their information (name, email, etc.)
2. **Test Section**:
   - 24 multiple-choice questions divided into 4 pages (6 questions per page)
   - Timer counts down from configured duration
   - Answers are saved to local storage automatically
3. **Writing Task**: Student completes a writing assignment
4. **Submission**: All answers are submitted to the API

## Local Storage Keys

The application uses the following local storage keys:

- `student_id`: Student's ID after profile creation
- `set_question`: Question set identifier
- `test_timer_remaining`: Remaining time on the timer
- `test_answers`: Saved answers for multiple-choice questions

## API Endpoints

### Get Questions
```
GET /api/question/list?student_id={id}&set_question={set}
```

### Create Student
```
POST /api/student/create
```

### Submit Answers
```
POST /api/studentanswer/create
```

## Customization

### Changing Timer Duration

Edit the `timerDuration` value in the environment files:

**Development** (`src/environments/environment.ts`):
```typescript
export const environment = {
  production: false,
  timerDuration: 45 * 60, // 45 minutes
  apiBaseUrl: '/api'
};
```

**Production** (`src/environments/environment.prod.ts`):
```typescript
export const environment = {
  production: true,
  timerDuration: 45 * 60, // 45 minutes
  apiBaseUrl: 'https://elc-onlinetest.incenplus.com/api'
};
```

### Changing API URL

Update the `apiBaseUrl` in the environment files and adjust `proxy.conf.json` for development.

### Questions Per Page

Edit `pageSize` in `src/app/pages/test/test.component.ts`:
```typescript
pageSize = 6; // Change to desired number
```

## Angular CLI Commands

### Code Scaffolding

Generate a new component:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

### End-to-End Testing

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Technologies Used

- **Angular** 21.x - Frontend framework
- **TypeScript** - Programming language
- **RxJS** - Reactive programming
- **Tailwind CSS** - Utility-first CSS framework
- **Vitest** - Unit testing framework

## Development

### Code Style

This project follows Angular style guide best practices.

### Building for Production

The production build includes:
- Ahead-of-Time (AOT) compilation
- Bundle optimization and minification
- File hashing for cache busting
- Environment-specific configuration via file replacements

## Troubleshooting

### Timer not persisting
Check that local storage is enabled in your browser and not cleared between sessions.

### API connection issues
Verify that:
1. The proxy configuration is correct (development)
2. The API base URL is accessible (production)
3. Network requests are not blocked by CORS policy

### Questions not loading
Ensure `student_id` and `set_question` are stored in local storage before navigating to the test page.

### Port already in use
If port 3000 is already in use, you can specify a different port:
```bash
ng serve --port 4200
```

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

## License

[Add your license information here]

## Contributing

[Add contribution guidelines here]

## Support

For issues and questions, please create an issue in the repository.
