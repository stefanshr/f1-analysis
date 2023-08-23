# Use Nginx image
FROM nginx:alpine

# Remove default Nginx website
RUN rm -rf /usr/share/nginx/html/*

# Copy `dist/` folder to Nginx web root
COPY dist/f1-data-hub/ /usr/share/nginx/html/

# Create a custom nginx configuration
RUN echo -e "server {\n    listen 80;\n\n    server_name _;\n    root /usr/share/nginx/html;\n\n    location / {\n        try_files \$uri \$uri/ /index.html;\n    }\n\n    error_page 500 502 503 504 /50x.html;\n    location = /50x.html {\n        root /usr/share/nginx/html;\n    }\n}" > /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Run Nginx
ENTRYPOINT []
CMD ["nginx", "-g", "daemon off;"]

