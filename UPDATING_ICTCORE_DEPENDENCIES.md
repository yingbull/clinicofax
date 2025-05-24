# Updating ICTCore Dependencies for PHP 8.4

This guide provides instructions for updating ICTCore's project dependencies to ensure compatibility with PHP 8.4. This process primarily involves managing dependencies using Composer.

## 1. Locating `composer.json`

The `composer.json` file is the heart of your project's dependency management with Composer.

*   **Location:** This file is typically located in the **root directory** of the ICTCore project.

## 2. Checking and Updating PHP Version Constraint

Before updating dependencies, you need to tell Composer that your project now supports PHP 8.4.

*   **Open `composer.json`:** Use a text editor to open the `composer.json` file.
*   **Find the `require` section:** Look for a key named `"require"`. Inside this section, you'll find a `php` entry.
*   **Update PHP version:** Modify the PHP version constraint. It's recommended to allow for patch versions while specifying PHP 8.4 as the minimum.
    *   Change from (example): `"php": "^7.4 || ^8.0"` or `"php": ">=7.4"`
    *   Change to: `"php": "^8.4"` or `"php": ">=8.4"`

    **Example `composer.json` snippet:**
    ```json
    {
        "name": "ictcore/ictcore",
        "description": "ICTCore Project",
        "type": "project",
        "require": {
            "php": "^8.4",  // Updated PHP version
            "monolog/monolog": "^2.0",
            // ... other dependencies
        },
        // ... other sections
    }
    ```

## 3. Identifying Outdated Dependencies

Once you've updated the PHP version constraint, you can check which of your project's dependencies have newer versions available that are compatible with your updated constraints.

*   **Navigate to your project root:** Open your terminal or command prompt and go to the ICTCore project's root directory (where `composer.json` is located).
*   **Check for outdated packages:** Run the following Composer command:
    ```bash
    composer outdated
    ```
    This command will list all packages that have newer versions available. It will show the current version, the new version, and a description.

*   **Alternative - List all packages and their latest versions:** To see a comprehensive list of your current dependencies and the latest available versions (even if they are not directly "outdated" based on your current constraints but might be relevant for PHP 8.4):
    ```bash
    composer show -l
    # or for a more compact view of only direct dependencies
    composer show -D -l
    ```

## 4. Updating Dependencies

After identifying outdated packages, you can proceed to update them.

*   **General Update (Recommended First Step):**
    To update all dependencies to their latest versions allowed by the version constraints in `composer.json` (including the new PHP 8.4 constraint), run:
    ```bash
    composer update
    ```
    Composer will attempt to resolve all dependencies and download the updated packages. This will also update your `composer.lock` file.

*   **Updating Specific Packages:**
    If you only want to update one or a few specific packages, you can do so by naming them:
    ```bash
    composer update vendor/package another-vendor/another-package
    ```
    Replace `vendor/package` with the actual name of the package you want to update (e.g., `monolog/monolog`).

*   **Importance of Changelogs:**
    **Crucial Step:** When a dependency has a major version update (e.g., from `1.x.x` to `2.x.x`), it's highly likely to include **breaking changes**.
    *   Before updating major versions, **always check the dependency's changelog or release notes**. These are usually found in the package's repository (e.g., on GitHub) or its documentation.
    *   Understanding breaking changes will help you adapt your ICTCore codebase to work with the new version of the dependency.

## 5. Resolving Conflicts

Sometimes, Composer might not be able to update dependencies due to version conflicts. This happens when different packages require incompatible versions of another package.

*   **Conflict Messages:** Composer will output an error message explaining the conflict.
*   **Understanding Conflicts:** To understand why a specific package cannot be updated to a certain version, use the `why-not` command:
    ```bash
    composer why-not vendor/package problematic-version
    ```
    For example: `composer why-not monolog/monolog 3.0.0`

*   **Manual Adjustments:** Resolving conflicts might require:
    *   Manually adjusting version constraints in `composer.json` for specific packages to find a compatible set.
    *   Looking for alternative packages if a critical dependency is no longer maintained or incompatible with PHP 8.4.
    *   Waiting for maintainers of conflicting packages to release updates.

## 6. Testing After Update

This is a critical step to ensure the updates haven't introduced issues.

*   **Run Test Suite:** If ICTCore has an automated test suite (e.g., PHPUnit tests), run it thoroughly:
    ```bash
    # Example command (actual command might vary)
    # ./vendor/bin/phpunit
    # or
    # composer test
    ```
*   **Perform Functional Checks:**
    *   Manually test key functionalities of ICTCore.
    *   Check different user roles and common workflows.
    *   Look for any errors, warnings, or unexpected behavior in logs and the application interface.
*   **Check PHP Error Logs:** Monitor your PHP error logs for any new issues that might have surfaced after the updates.

## 7. Committing Changes

Once you've updated your dependencies and confirmed that the application is working correctly, commit the changes to your version control system (e.g., Git).

*   **Add `composer.json` and `composer.lock`:**
    ```bash
    git add composer.json composer.lock
    ```
*   **Commit the changes:**
    ```bash
    git commit -m "Update dependencies for PHP 8.4 compatibility"
    ```
    The `composer.lock` file is crucial because it locks the specific versions of dependencies that were installed. This ensures that other developers and your deployment process will use the exact same versions, leading to a consistent environment.

---

By following these steps, you can systematically update ICTCore's dependencies for PHP 8.4, minimizing potential issues and ensuring a smoother transition. Always prioritize careful testing after any dependency update.
```
