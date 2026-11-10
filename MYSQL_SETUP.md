# MySQL Setup (Spring Boot backend)

## 1. One-time setup
1. Install **MySQL Server 8** (and MySQL Workbench) and remember your `root` password.
2. Open `src/main/resources/application.properties` and change this line to your real password:
   `spring.datasource.password=${DB_PASSWORD:your_mysql_password}`
   (or set environment variables `DB_USERNAME` and `DB_PASSWORD` instead of editing the file).
3. Needs **JDK 17+** and **Maven**.

## 2. Run the backend
```
mvn spring-boot:run
```
- The database `dentalclinicdb` and all tables are created automatically (Hibernate `ddl-auto=update`).
- Demo data is seeded on the first run.
- Swagger UI: http://localhost:8080/swagger-ui.html

## 3. Check that MySQL is really connected
In MySQL Workbench:
```sql
USE dentalclinicdb;
SHOW TABLES;
SELECT id, name, email, role FROM users;
```

## 4. Test the separate logins in Swagger (`/api/auth`)
| Endpoint | Doctor account | Patient account |
|---|---|---|
| `POST /api/auth/login/doctor` | success | rejected |
| `POST /api/auth/login/patient` | rejected | success |

Seeded backend accounts: doctor `dr.smita@dentalclinic.com` / `doctor123`, patient `sanskrutiab88@gmail.com` / `patient123`.

## Without MySQL (old in-memory database)
`mvn spring-boot:run -Dspring-boot.run.profiles=h2`

## Common errors
- `Access denied for user 'root'` -> wrong password in step 1.
- `Communications link failure` -> MySQL service is not running / not on port 3306.

## React frontend (separate)
```
npm install
npm run dev
```
Pages: `/` (choose), `/patient/login`, `/doctor/login`.
Demo logins (same for the React app and the API): doctor `dr.smita@dentalclinic.com` / `doctor123`, patient `sanskrutiab88@gmail.com` / `patient123`.
