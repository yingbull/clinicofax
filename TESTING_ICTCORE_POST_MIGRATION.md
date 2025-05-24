# Testing ICTCore After PHP 8.4 Migration

This guide provides a comprehensive strategy for thoroughly testing the ICTCore application after it has been migrated to PHP 8.4. The goal is to ensure stability, functionality, and performance, and to catch any regressions or new issues introduced by the PHP version upgrade.

## 1. Automated Testing

Automated tests are the first line of defense in identifying issues quickly and efficiently.

*   **Run All Tests:**
    Execute the complete suite of automated tests available within the ICTCore project. This is critical and should be the first step after any code changes.
    *   **Unit Tests:** Verify individual components (classes, methods) of the application in isolation.
        ```bash
        # Example: ./vendor/bin/phpunit tests/unit
        ```
    *   **Integration Tests:** Check the interaction between different components or services (e.g., database interactions, service layer integrations).
        ```bash
        # Example: ./vendor/bin/phpunit tests/integration
        ```
    *   **Functional/End-to-End (E2E) Tests:** (If applicable for ICTCore itself, separate from the Angular GUI) Test complete workflows or features from a user's perspective.
        ```bash
        # Example: ./vendor/bin/phpunit tests/functional
        # Or using a specific E2E testing framework if used.
        ```

*   **Code Coverage:**
    *   If code coverage tools (e.g., PHPUnit with Xdebug/PCOV) are configured, generate and review coverage reports.
    *   **Focus:** Pay close attention to the coverage of:
        *   Code areas modified during the PHP 8.4 compatibility fixes.
        *   Critical business logic.
        *   Areas that were previously known to be less stable or bug-prone.
    *   **Goal:** Aim to maintain or, ideally, increase code coverage. Address any significant drops in coverage, especially in critical modules.
        ```bash
        # Example: phpunit --coverage-html coverage-report
        ```

*   **CI/CD Pipeline:**
    *   Ensure that all automated tests are executed and pass within the Continuous Integration (CI) environment.
    *   The CI environment **must be configured to use PHP 8.4**.
    *   A green build in the CI pipeline is a key indicator of baseline stability.

## 2. Manual Testing

Manual testing is essential to cover scenarios that are difficult to automate, to assess usability, and to perform exploratory testing.

*   **Develop or Update a Test Plan:**
    *   If a comprehensive test plan doesn't exist, create one. If it does, update it to reflect any changes due to PHP 8.4 or new features.
    *   The test plan should systematically cover:
        *   **Core Features:** All fundamental functionalities of ICTCore (e.g., call routing, user management, billing, etc.).
        *   **Business Logic:** Complex rules and workflows specific to ICTCore's domain.
        *   **Edge Cases and Boundary Conditions:** Testing with unexpected inputs, minimum/maximum values, empty values, special characters, etc.
        *   **User Workflows:** Step-by-step testing of common tasks a user would perform.
        *   **Error Handling and Reporting:** Verify that errors are handled gracefully, appropriate messages are shown, and errors are logged correctly.

*   **User Interface (UI) Testing (ICTCore's own UI, if any):**
    *   If ICTCore has a native administrative or management UI (distinct from the Angular ICTFax GUI), test it thoroughly:
        *   All forms, inputs, and controls.
        *   Navigation and page rendering.
        *   Responsiveness (if applicable).
        *   Data display and updates.

*   **API Testing:**
    *   Test all API endpoints exposed by ICTCore. This is critical as these APIs are consumed by ICTFax and potentially other services.
    *   **Tools:** Use tools like Postman, Insomnia, or even `curl` scripts.
    *   **Verification Points:**
        *   **Request/Response Formats:** Ensure requests are correctly processed and responses adhere to the defined schema (e.g., JSON, XML).
        *   **Status Codes:** Verify correct HTTP status codes (200 OK, 201 Created, 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 500 Internal Server Error, etc.).
        *   **Error Responses:** Check that error responses are informative and structured.
        *   **Authentication and Authorization:** Test all authentication mechanisms (e.g., API keys, tokens). Verify that users can only access resources they are authorized for. Test with invalid or expired credentials.
        *   **Data Validation:** Test how the API handles invalid or missing data in requests.
        *   **CRUD Operations:** For resource-based APIs, test Create, Read, Update, and Delete operations thoroughly.

*   **Performance Testing:**
    *   **Basic Checks:** Conduct basic performance checks to ensure no significant performance regressions have been introduced by the PHP 8.4 migration or related code changes.
        *   Monitor response times for key API endpoints.
        *   Observe resource usage (CPU, memory) of the ICTCore application under load.
    *   **Identify Key Performance Indicators (KPIs):** If specific performance targets exist (e.g., API response time < 200ms, calls per second), measure against these.
    *   **Comparison:** Compare current performance metrics against benchmarks established before the migration, if available.
    *   **Tools (Optional, for deeper analysis):** Consider using tools like Apache JMeter, k6, or profiling tools (like Xdebug profiler or Blackfire.io) if significant performance issues are suspected.

*   **Security Testing:**
    *   **Review Common Vulnerabilities:** Consider the OWASP Top 10 web application security risks (e.g., Injection, Broken Authentication, Sensitive Data Exposure, XSS, Broken Access Control).
    *   **PHP 8.4 Impact:** Analyze how changes in PHP 8.4 (e.g., stricter types, changes in error handling, new functions) might inadvertently impact security. For example, stricter type handling might prevent certain types of injection if not properly handled, but unexpected type errors could also reveal information if error reporting is misconfigured.
    *   **Input Sanitization and Output Encoding:** Double-check that all user inputs are properly sanitized and data output to UIs or APIs is correctly encoded.
    *   **Authentication & Authorization:** Re-verify these mechanisms as part of API testing.
    *   **Session Management:** If applicable, check session handling security.
    *   **Security Scanning Tools (Optional):** Consider running automated security scanning tools (SAST/DAST) if available.

## 3. Integration Testing (with Angular GUI - ICTFax)

This phase focuses on the interaction between the migrated ICTCore backend (now on PHP 8.4) and its primary frontend, the Angular-based ICTFax.

*   **Comprehensive GUI Testing:**
    *   Systematically go through **all features and workflows** in the ICTFax GUI.
    *   Verify that every action in the GUI that triggers an API call to ICTCore works as expected.
    *   **Examples:**
        *   User login/logout.
        *   Viewing dashboards and reports.
        *   Managing contacts, accounts, and users.
        *   Initiating and managing calls/faxes.
        *   Configuring settings.
        *   Checking call detail records (CDRs).
        *   Any real-time features.
*   **Data Consistency:** Ensure data displayed in ICTFax is consistent with the data in the ICTCore backend.
*   **Error Handling:** Test how ICTFax handles errors returned by the ICTCore API (e.g., displaying user-friendly messages).
*   **Browser Compatibility:** Test ICTFax on all supported web browsers to catch any browser-specific issues that might arise from changes in API responses or behavior.

## 4. Regression Testing

Regression testing ensures that existing functionalities remain intact and that previously fixed bugs do not reappear.

*   **Full Functionality Check:** Re-test functionalities that were confirmed working before the PHP 8.4 migration. This can be a subset of your full manual test plan, focusing on critical and frequently used features.
*   **Bug Re-tests:** Identify bugs that were fixed in previous versions of ICTCore. Re-run the test cases that originally identified these bugs to ensure they have not been reintroduced.

## 5. Logging and Monitoring

Proactive monitoring of logs and system health is crucial, especially post-migration.

*   **PHP Error Logs:**
    *   Closely monitor PHP error logs (e.g., `error_log` specified in `php.ini`, or logs managed by your web server like Apache/Nginx).
    *   Look for any new errors, warnings, or notices that might have appeared after deploying the PHP 8.4 version. Pay special attention to `E_DEPRECATED` notices if you haven't addressed all of them yet.
*   **Application Logs:**
    *   Check ICTCore's own application logs for any unusual activity, errors, or stack traces.
*   **System Performance:**
    *   Monitor server CPU, memory, disk I/O, and network usage.
    *   Look for any abnormal spikes or sustained high resource consumption that might indicate performance issues introduced with the update.
*   **Monitoring Tools:** Utilize any existing monitoring tools (e.g., Nagios, Zabbix, Prometheus, Datadog) to track system health and application metrics.

## 6. Documentation of Test Results

Maintaining clear records of the testing process is essential for accountability, debugging, and future reference.

*   **Test Case Execution:** For each test case (both automated and manual):
    *   Record the date of execution.
    *   The environment it was tested on (e.g., staging with PHP 8.4).
    *   The result (Pass/Fail).
*   **Issue Tracking:**
    *   If any test fails or an issue is found, log it in an issue tracking system (e.g., Jira, GitLab Issues, Bugzilla).
    *   Include:
        *   A clear, descriptive title.
        *   Steps to reproduce the issue.
        *   Expected result vs. Actual result.
        *   Screenshots or log snippets, if applicable.
        *   Severity and priority.
        *   The PHP version (8.4) and any other relevant environment details.
*   **Test Summary Report:** Create a summary report at the end of the testing cycle, including:
    *   Overall testing status.
    *   Number of test cases executed, passed, and failed.
    *   List of open/critical issues.
    *   Any observations or recommendations.

---

Thorough testing is paramount for a successful PHP 8.4 migration. This multi-faceted approach, combining automated checks, meticulous manual testing, and vigilant monitoring, will help ensure that ICTCore remains robust, reliable, and performant on the new PHP version.
```
