FROM maven:3.9-eclipse-temurin-21

# Install curl for health checks and inotify tools for file watching
RUN apt-get update && apt-get install -y curl inotify-tools && rm -rf /var/lib/apt/lists/*

WORKDIR /workspace

# Copy pom.xml first for better Docker layer caching
COPY pom.xml .

# Download dependencies (this layer will be cached unless pom.xml changes)
RUN mvn dependency:go-offline -B

# Copy source code
COPY src ./src

# Expose port and remote debugging port
EXPOSE 8080 5005

# Create a startup script that watches for file changes and recompiles
RUN echo '#!/bin/bash\n\
    # Start the Spring Boot app in background\n\
    mvn spring-boot:run -Dspring-boot.run.jvmArguments="-agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=*:5005" &\n\
    APP_PID=$!\n\
    \n\
    # Watch for file changes and restart the app\n\
    while inotifywait -r -e modify,create,delete /workspace/src; do\n\
    echo "Files changed, restarting application..."\n\
    kill $APP_PID 2>/dev/null || true\n\
    sleep 2\n\
    mvn spring-boot:run -Dspring-boot.run.jvmArguments="-agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=*:5005" &\n\
    APP_PID=$!\n\
    done' > /usr/local/bin/watch-and-run.sh && chmod +x /usr/local/bin/watch-and-run.sh

CMD ["/usr/local/bin/watch-and-run.sh"]