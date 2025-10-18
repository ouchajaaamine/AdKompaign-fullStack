FROM php:8.2-fpm-alpine

# Install system dependencies
RUN apk add --no-cache \
	bash \
	git \
	curl \
	libpng-dev \
	oniguruma-dev \
	libxml2-dev \
	zip \
	unzip \
	postgresql-dev \
	libzip-dev \
	icu-dev \
	postgresql-client

# Install PHP extensions
RUN docker-php-ext-install pdo_pgsql mbstring exif pcntl bcmath gd zip intl

# Get latest Composer
ENV COMPOSER_ALLOW_SUPERUSER=1 \
	COMPOSER_HOME=/tmp/composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html

# Copy composer files
COPY composer.json composer.lock* ./

# Install PHP dependencies (include dev deps for APP_ENV=dev; skip scripts that require bin/console)
RUN composer install --optimize-autoloader --no-interaction --no-scripts || \
	composer install --optimize-autoloader --no-interaction --no-scripts

# Copy application code
COPY . .

# Copy and make entrypoint and healthcheck scripts executable
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh
COPY docker-healthcheck.sh /usr/local/bin/docker-healthcheck.sh
RUN chmod +x /usr/local/bin/docker-healthcheck.sh
RUN sed -i 's/\r$//' /usr/local/bin/docker-entrypoint.sh /usr/local/bin/docker-healthcheck.sh || true

# Ensure correct permissions for var directory
RUN mkdir -p /var/www/html/var \
	&& chown -R www-data:www-data /var/www/html \
	&& chmod -R 755 /var/www/html \
	&& chmod -R 775 /var/www/html/var

# Expose port 8000
EXPOSE 8000

# Default entrypoint; command is handled by entrypoint script
ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
