Stack list to use:

Frontend:
- React Router v7 (Formerly Remix)
- TailwindCSS
- ShaCDN (If can, updated: yes)

Backend:
- Express JS
- JWT
- Prisma ORM (If can, updated: yes)
- MySQL

Repository Setup:
- Monorepo setup using Turborepo (First time, learn first)
- Microservices concept (First time, learn first)

Microservices split:
- Express Microservices Split: Auth, Employee, Attendance
- Store photo locally on the backend
- Each microservices will have its own db
- Need API Gateway (Use Express JS for simplicity, alternative trafeik, nginx, KONG, etc..)
- API Gateway used to communicate between each microservices and process data for frontend
- Security will be on the api gateway side
- Production: Microservices will not be exposed

Database Setup:
- AuthDB, to store authentication information, email, hash using bcrypt, use jwt for SSO opportunity+microservices
- EmployeeDB to store employee related data
- AttendanceDB to store attendance data of an employee

Database Notes:
- Employee attendance target start and end time can be varying (need to be configurable?)
- In the future if need absence request can be easily implemented
- Store employee history and attendance target itme when changes

Loggin Notes:
- Logging using pino (if extra time available?)

API Gateway endpoints:
- HTTP Proxy are used to redirect some endpoints (such as /uploads) token verification will need to be in-placed
- / for hello world (can be used to check server health)
- to /users
- to /attendance
- to /employee
- to /attendance
- Handling security and jwt token verification
- Process data from each microservices and send it to frontend

Auth endpoints:
- /validate
- /login
- /refresh
- /logout

User endpoints:
- /me
- /list
- /:id

Employee endpoints:
- /list
- /:id
- /create
- /update/:id
- /remove/:id

Attendance endpoints:
- /list
- /list/:id
- /target
- /current
- /check/in
- /check/out

Additional Notes End (After):
- Shared-types package used to share types that are shared between microservices, such as responses, data format, etc...
- At the moment, express backend size haven't been refactor enough, there aren't any error checking placed, all assumming a best case scenario
- Frontend side is okay, there still something that can be refactor, some error handler are available