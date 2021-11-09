# Node-Angular-Blog-App

This is blog application with the back-end written in Node and the front-end written in Angular.
To run this application, need to download both folders separately. Both projects are excluding the node_modules folder due to the high volume of files, you can run the command "npm install" to download the required packages for the app. In the node project you must have the node library installed and run the "nodemon" command to run the app. If you do not have nodemon installed, first run the "npm install -g nodemon" command. In the angular project you must have the angular library installed and run the "ng serve" command to compile the project. You then can access the application locally on http://localhost:4200/, with the back-end running on on port 3000.

# The Angular Project

# The Node Project
The app provides basic CRUD functionality for the Users and Posts classes. The models and routes have been written in TypeScript and can be found in the src folder. These files are compiled into JavaScript which can be found in the dist folder.

The Users class supports the following methods and endpoints: [GET]/Users, [GET]/Users/, [POST]/Users, [PATCH]/Users/, [DELETE]/Users/, [GET]/Users//, [GET]/Users/Posts/. Similarly, the Posts class supports the following methods and endpoints: [GET]/Posts, [GET]/Posts/, [POST]/Posts, [PATCH]/Posts/, [DELETE]/Posts/.

Authentication and Authorization are used in this application so that a user must be authenticated in in order to add a post and must be authorized as the correct user in order to update or delete an existing post. Users must also be authenticated and authorized in order to update or delete the user (account).

I create this project during my undergrad at UNF in my Web Frameworks course.
