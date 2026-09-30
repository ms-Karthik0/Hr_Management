$env:DB_URL = 'jdbc:postgresql://localhost:5433/nexushr'
$env:DB_USERNAME = 'nexushr'
$env:DB_PASSWORD = 'nexushr'
$env:SERVER_PORT = '8081'
$env:JAVA_TOOL_OPTIONS = '-Duser.timezone=UTC'
mvn -f "C:\Users\mskar\OneDrive\Desktop\nexushr-fullstack\backend\nexushr-backend\pom.xml" org.springframework.boot:spring-boot-maven-plugin:run
