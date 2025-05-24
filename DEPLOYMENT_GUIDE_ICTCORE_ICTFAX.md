# Deployment Guide: Migrated ICTCore (PHP 8.4) and ICTFax (Angular GUI)

This guide outlines best practices and key considerations for deploying the ICTCore application (migrated to PHP 8.4) and the potentially updated ICTFax Angular GUI to a production environment.

## 1. Pre-Deployment Checklist

Thorough preparation is crucial for a smooth deployment.

*   **Final Testing Confirmation:**
    *   **Action:** Verify that all automated tests (unit, integration, E2E) and comprehensive manual test plans have been successfully executed and passed in a staging or pre-production environment.
    *   **Key:** This environment must mirror the production environment as closely as possible in terms of infrastructure, PHP version (8.4 with extensions), database version, and configurations.

*   **Complete System Backup:**
    *   **Action:** Before initiating any deployment steps, take complete and verified backups of:
        *   **ICTCore Database:** Full backup of the production database.
        *   **ICTCore Application Files:** All PHP code, configuration files, and any other related assets.
        *   **ICTFax GUI Application:** The current production build of the Angular application.
        *   **Web Server Configurations:** (Apache/Nginx) configurations for both backend and frontend.
    *   **Verification:** Ensure these backups are restorable.

*   **Detailed Deployment Plan:**
    *   **Action:** Prepare a step-by-step deployment plan.
    *   **Content:**
        *   Sequence of deployment tasks for both backend and frontend.
        *   Specific commands to be executed.
        *   Assigned personnel responsible for each step.
        *   Estimated time for each step and the total deployment window.
        *   Clearly defined success criteria for each step.

*   **Well-Tested Rollback Plan:**
    *   **Action:** Have a documented and **tested** rollback plan. This is not optional.
    *   **Content:**
        *   Steps to revert the ICTCore application (code and database if migrations were applied) to its previous stable version.
        *   Steps to revert the ICTFax GUI to its previous stable version.
        *   Estimated time required for rollback.
        *   Criteria for triggering a rollback.
    *   **Testing:** Practice the rollback procedure in the staging environment to ensure it works as expected and to identify any potential issues.

*   **Communication Plan:**
    *   **Action:** If the deployment requires downtime or might impact users, notify all stakeholders.
    *   **Stakeholders:** End-users, internal support teams, management.
    *   **Content:** Scheduled maintenance window (date, time, duration), potential impact, and contact information for support.

## 2. Deployment Strategies (General Considerations)

Choose a strategy that best fits your risk tolerance and infrastructure capabilities.

*   **Phased Rollout (Canary/Blue-Green):**
    *   **Canary Release:** Deploy the new version to a small subset of users/servers. Monitor closely. If stable, gradually roll it out to the rest of the infrastructure.
    *   **Blue-Green Deployment:** Set up a new identical production environment ("green") with the updated application. Once tested, switch traffic from the old environment ("blue") to the new one. The old environment is kept on standby for quick rollback.
    *   **Consideration:** These strategies reduce risk but are more complex to set up and manage. They often require load balancers and sophisticated deployment tools.

*   **Maintenance Window:**
    *   **Action:** Schedule the deployment during off-peak hours (e.g., late night, weekend) to minimize disruption to users, especially if a direct cutover deployment is planned.
    *   **Communication:** Ensure the selected window is clearly communicated.

## 3. Deploying ICTCore (PHP Backend)

Steps for deploying the updated PHP application.

*   **Environment Configuration Verification:**
    *   **Action:** Double-check that the production server(s) has PHP 8.4 installed.
    *   **Action:** Verify all required PHP extensions (e.g., `pdo_mysql`, `mbstring`, `xml`, `curl`, etc., as per ICTCore's requirements) are installed and enabled in `php.ini`. This must match the tested staging environment.

*   **Dependency Installation:**
    *   **Action:** If deploying from a version control system, pull the latest code.
    *   **Action:** Run Composer to install dependencies.
        ```bash
        composer install --no-dev --optimize-autoloader
        ```
        *   `--no-dev`: Excludes development dependencies.
        *   `--optimize-autoloader`: Builds a more performant autoloader for production.
    *   **Alternative:** If using a build artifact (e.g., a ZIP file or Docker image), ensure dependencies were installed correctly during the build process.

*   **Configuration Files:**
    *   **Action:** Ensure all ICTCore configuration files (`.env` files, XML/YAML configs, etc.) are in place and contain the correct production values.
    *   **Critical Settings:** Database connection strings, API keys, mail server settings, paths, and any other environment-specific parameters.
    *   **Security:** Ensure sensitive configuration files have appropriate permissions and are not web-accessible.

*   **Clear Caches:**
    *   **Action:** After deploying the new code, clear any relevant caches:
        *   **PHP Opcache:** This cache stores precompiled script bytecode. It needs to be cleared or reset to pick up new code. The method depends on your server setup (e.g., `opcache_reset()` function, restarting PHP-FPM).
        *   **Application Caches:** If ICTCore uses any data caching mechanisms (e.g., Redis, Memcached, file-based cache), clear relevant cache keys.

*   **Database Migrations (if applicable):**
    *   **Action:** If the PHP 8.4 update or subsequent development included database schema changes, apply these migrations carefully.
    *   **Tools:** Use ICTCore's migration tool (if it has one) or a standard database migration tool (e.g., Phinx, Doctrine Migrations).
    *   **Backup:** Ensure the database backup (from the pre-deployment checklist) is complete before running migrations.
    *   **Order:** Apply migrations *before* switching traffic to the new application code if the code depends on the new schema. Sometimes, a multi-step deployment is needed for non-backward-compatible schema changes.

*   **Web Server Configuration:**
    *   **Action:** Verify the web server (Apache, Nginx) configuration is correct for PHP 8.4.
    *   **Nginx Example (PHP-FPM):**
        ```nginx
        location ~ \.php$ {
            include snippets/fastcgi-php.conf;
            # Ensure this points to the PHP 8.4 FPM socket/address
            fastcgi_pass unix:/var/run/php/php8.4-fpm.sock;
            # ... other configurations
        }
        ```
    *   **Apache Example (mod_php or PHP-FPM):**
        *   Ensure Apache is loading the PHP 8.4 module or configured to use the PHP 8.4 FPM.
    *   **Action:** Restart or reload the web server after configuration changes.

## 4. Deploying ICTFax (Angular GUI)

Steps for deploying the updated frontend application.

*   **Build Production Artifacts:**
    *   **Action:** Build the Angular application for production. This creates optimized static files.
        ```bash
        ng build --configuration production
        # or if you use a specific configuration name for production
        # ng build --prod
        ```
    *   **Output:** This command typically generates files in a `dist/your-project-name/` directory.

*   **Deploy Static Files:**
    *   **Action:** Copy the generated static files (HTML, CSS, JavaScript bundles, assets) from the `dist/` folder to the appropriate directory on your web server or upload them to your CDN (Content Delivery Network).
    *   **Example (web server):** `/var/www/html/ictfax/` or a similar path.

*   **Environment Configuration:**
    *   **Action:** Verify that the Angular application's production environment configuration (`src/environments/environment.prod.ts` or equivalent) is correctly pointing to the **production ICTCore API endpoints**.
        ```typescript
        // src/environments/environment.prod.ts
        // export const environment = {
        //   production: true,
        //   apiUrl: 'https://api.yourdomain.com/ictcore' // Ensure this is the production API URL
        // };
        ```
    *   **Note:** This configuration is compiled into the build artifacts, so it must be correct *before* the `ng build` command.

*   **Web Server Configuration for SPA:**
    *   Ensure your web server is configured to correctly serve the Angular Single Page Application (SPA). This usually involves a rewrite rule to direct all deep-link requests to `index.html`.
    *   **Nginx Example:**
        ```nginx
        server {
            listen 80;
            server_name ictfax.yourdomain.com;
            root /var/www/html/ictfax; # Path to Angular build output

            location / {
                try_files $uri $uri/ /index.html;
            }
            # ... other configurations
        }
        ```
    *   **Apache Example (using `.htaccess` in the Angular root directory):**
        ```apache
        <IfModule mod_rewrite.c>
          RewriteEngine On
          RewriteBase /
          RewriteRule ^index\.html$ - [L]
          RewriteCond %{REQUEST_FILENAME} !-f
          RewriteCond %{REQUEST_FILENAME} !-d
          RewriteRule . /index.html [L]
        </IfModule>
        ```

## 5. Post-Deployment Monitoring

Immediately after deployment, actively monitor the system.

*   **Smoke Tests:**
    *   **Action:** Perform a predefined set of quick tests covering the most critical functionalities of both ICTCore (e.g., API responsiveness, core logic) and ICTFax (e.g., login, key data display, core actions).
    *   **Goal:** Quickly identify any major breakages.

*   **Log Monitoring:**
    *   **Action:** Continuously monitor various logs:
        *   **PHP Error Logs:** (e.g., `/var/log/php8.4-fpm.log` or configured error log).
        *   **Web Server Logs:** (Apache/Nginx access and error logs).
        *   **ICTCore Application Logs:** (Specific logs generated by ICTCore).
        *   **Browser Console Logs:** Check for JavaScript errors in the ICTFax GUI by opening browser developer tools.
    *   **Tools:** Use log aggregation tools (e.g., ELK Stack, Splunk, Grafana Loki) if available.

*   **Performance Monitoring:**
    *   **Action:** Monitor key server and application performance metrics:
        *   CPU and memory usage.
        *   API response times.
        *   Database query performance.
        *   Page load times for ICTFax.
    *   **Tools:** Use server monitoring tools (e.g., Nagios, Zabbix, Prometheus) and Application Performance Monitoring (APM) tools if available.

*   **User Feedback Channel:**
    *   **Action:** Ensure there is a clear and accessible channel for users to report any issues they encounter.
    *   **Action:** Have support staff ready to address user-reported problems promptly.

## 6. Rollback Execution (if needed)

Be prepared to execute the rollback plan if significant issues arise.

*   **Trigger Conditions:** Define what constitutes a "significant issue" that would trigger a rollback (e.g., critical functionality failure, widespread errors, unacceptable performance degradation).
*   **Execute Plan:**
    *   Follow the pre-defined and tested rollback steps to revert ICTCore (code and database if necessary) to its previous stable version.
    *   Revert the ICTFax GUI to its previous stable version.
    *   Verify the rollback by performing smoke tests on the restored system.
*   **Post-Rollback Analysis:**
    *   **Action:** After a successful rollback, thoroughly investigate the cause of the deployment failure.
    *   **Action:** Do not attempt to re-deploy until the root cause has been identified and fixed. Update the deployment and rollback plans based on lessons learned.

---

A successful deployment relies on careful planning, thorough testing, and diligent monitoring. By following these best practices, you can minimize risks and ensure a smoother transition to PHP 8.4 for ICTCore and the updated ICTFax GUI.
```
