# Setting up PHP 8.4 for ICTCore

This guide provides instructions for setting up a PHP 8.4 environment for the ICTCore project.

## 1. Installing PHP 8.4

The method for installing PHP 8.4 varies depending on your operating system.

### Ubuntu (using ondrej/php PPA)

The `ondrej/php` PPA is a popular way to get the latest PHP versions on Ubuntu.

```bash
sudo add-apt-repository ppa:ondrej/php
sudo apt-get update
sudo apt-get install php8.4
```

### macOS (using Homebrew)

Homebrew is a common package manager for macOS.

```bash
brew tap shivammathur/php
brew install shivammathur/php/php@8.4
```

### Windows

Download the official PHP installer or binaries from the [PHP for Windows website](https://windows.php.net/download/). Follow the installation instructions provided.

### Compiling from Source

For advanced users, or if pre-compiled binaries are not available for your system, you can compile PHP from source. Download the source code from the [PHP downloads page](https://www.php.net/downloads.php) and follow the compilation guide in the PHP manual.

### Essential PHP Extensions

Ensure the following PHP extensions are installed and enabled. These are commonly required for web applications, including projects like ICTCore.

*   `mbstring` (Multi-byte string handling)
*   `xml` (XML manipulation)
*   `pdo` (PHP Data Objects for database access)
*   `pdo_mysql` (or other PDO drivers like `pdo_pgsql` depending on your database)
*   `curl` (Client URL library)
*   `openssl` (Secure Sockets Layer and cryptography)
*   `json` (JSON support)
*   `gd` (Image processing)
*   `intl` (Internationalization)
*   `zip` (ZIP archive handling)
*   `bcmath` (Arbitrary precision mathematics)
*   `soap` (SOAP client/server)
*   `xsl` (XSL transformations)

**ICTCore Specific Extensions:** Check ICTCore's documentation for any additional or specific PHP extensions it might require.

You can typically install extensions on Ubuntu using `apt-get`:
```bash
sudo apt-get install php8.4-mbstring php8.4-xml php8.4-pdo php8.4-curl php8.4-openssl php8.4-json php8.4-gd php8.4-intl php8.4-zip php8.4-bcmath php8.4-soap php8.4-xsl
```
For other systems, the installation method will vary. For example, on Windows, you might enable them in your `php.ini` file.

## 2. Composer Installation/Update

Composer is a dependency manager for PHP.

### Install Composer

If you don't have Composer installed, you can download and install it globally by following the official instructions on [getcomposer.org](https://getcomposer.org/download/).

A common method for Linux/macOS:
```bash
php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
php -r "if (hash_file('sha384', 'composer-setup.php') === 'dac665fdc30fdd8ec78b38b9800061b4150413ff2e3b6f88543c636f7cd84f6db9189d43a81e5503cda447da73c7e5b6') { echo 'Installer verified'; } else { echo 'Installer corrupt'; unlink('composer-setup.php'); } echo PHP_EOL;"
php composer-setup.php
php -r "unlink('composer-setup.php');"
sudo mv composer.phar /usr/local/bin/composer
```

### Update Composer

If you already have Composer installed, you can update it to the latest version:

```bash
composer self-update
```

## 3. Verification

After installation, verify that PHP 8.4 and the required extensions are correctly installed.

### Verify PHP Version

Open your terminal or command prompt and run:

```bash
php -v
```

You should see output similar to:
```
PHP 8.4.x (cli) (built: ...) (...)
Copyright (c) The PHP Group
Zend Engine v4.x.x, Copyright (c) Zend Technologies
    with Zend OPcache v8.4.x, Copyright (c), by Zend Technologies
```

### Verify Installed Extensions

To list all installed and enabled PHP modules, run:

```bash
php -m
```

This will output a list of modules. Check if the essential extensions mentioned earlier are present. You can also use `grep` to search for specific modules:

```bash
php -m | grep pdo
# Expected output might include:
# pdo
# pdo_mysql
```

You can also create a PHP file with `<?php phpinfo(); ?>` and access it through your web server to see a detailed list of PHP settings and loaded extensions.

## 4. Development Tooling

Ensure your development tools are compatible with PHP 8.4.

### IDEs and Editors

*   **PhpStorm:** Check for updates. PhpStorm usually adds support for new PHP versions quickly. You may need to configure the project's PHP interpreter in the IDE settings.
*   **VS Code:** If you use VS Code, update your PHP extensions (e.g., PHP Intelephense, PHP Debug). Ensure these extensions support PHP 8.4.

### Debuggers

*   **Xdebug:** If you use Xdebug, ensure you have a version compatible with PHP 8.4. You might need to update Xdebug. Installation methods vary (e.g., PECL, package managers).
    ```bash
    # Example using PECL (if PECL is configured for php8.4)
    # sudo pecl install xdebug
    ```
    Then, configure Xdebug in your `php.ini` file. Refer to the Xdebug documentation for the correct settings for version 3+.

### Managing Multiple PHP Versions

If you need to work with multiple PHP versions on your system, consider these tools:

*   **phpbrew:** A command-line tool to build and manage multiple PHP versions on Linux/macOS.
    *   Installation and usage: [phpbrew.github.io/phpbrew](https://phpbrew.github.io/phpbrew/)
*   **Docker:** Use Docker to create isolated environments with specific PHP versions. You can find official PHP images on Docker Hub and customize them with the required extensions for ICTCore. This is a highly recommended approach for ensuring consistent development and production environments.

---

Remember to consult the official ICTCore documentation for any specific PHP configuration or extension requirements unique to the project.
```
