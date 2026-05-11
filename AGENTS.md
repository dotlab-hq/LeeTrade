# Important Guidelines for Code Quality
- Always write code in Typescript.
- Use Bun as the runtime environment.
- Ensure that your code is well-documented and follows best practices for readability and maintainability.
- Implement error handling to manage potential issues gracefully.
- a file must not exceed 200 line of code for core logic, exception only for html content as that is permitted


## Practie to follow specifically in frontend code
- Use React for building user interfaces.
- for making API calls, use the Fetch API 
- Ensure that your components are reusable and modular.
- use Zustand for state management to keep your application organized and efficient.
- Sharing state/functions via props is not allowed, instead use Zustand for state management to keep your application organized and efficient.
- api calls should be made in a separate file, and not directly in the component, to keep the component clean and focused on rendering the UI.
and use the following structure for api calls:
```
import { createClientOnlyFn } from '@tanstack/react-start'

const foo = createClientOnlyFn(async () => {...})
```
and this should be wrapped in tanstack query/mutation
- List data fetching must have pagination implemented to optimize performance and user experience.

## Practie to follow specifically in backend code
- Use Hono for building the backend server.
- Ensure that your API endpoints are well-structured and follow RESTful principles.
- For database interactions, use drizzle as the ORM to manage your database schema and queries efficiently.
- database we awill use is sqlite for simplicity and ease of use in development.