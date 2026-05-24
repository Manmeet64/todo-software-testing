# Selenium UI Tests — Todo App (Maven)

This folder contains a Maven project that runs Selenium end-to-end tests against the Todo frontend running at `http://localhost:5174`.

Prerequisites:

- Java 17+ installed
- Maven installed
- Chrome browser installed (or update tests to use a different browser)

Run tests:

```bash
cd tests/todo-selenium
mvn test
```

Notes:

- Tests use WebDriverManager to automatically download the correct ChromeDriver.
- Ensure both `todo-backend` (port 3001) and `todo-frontend` (port 5174) are running before executing the tests.
- Jenkins/TestNG report pattern: `**/testng-results.xml`.
- If your frontend is on a different port, pass `-DbaseUrl=http://localhost:5174` to Maven.

Test cases:

| Test Method | Description |
|---|---|
| `addTodo` | Adds a new task and verifies it appears in the list |
| `deleteTodo` | Adds a task and then deletes it, verifying it disappears |
