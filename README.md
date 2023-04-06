# About Project

This project is an answer to a test project for an interview.

The requirements were:

Create a very simple Laravel web application for task management:

- Create task (info to save: task name, priority, timestamps)
- Edit task
- Delete task
- Reorder tasks with drag and drop in the browser. Priority should automatically be updated based on this. #1 priority goes at top, #2 next down and so on.
- Tasks should be saved to a mysql table.
- BONUS POINT: add project functionality to the tasks. User should be able to select a project from a dropdown and only view tasks associated with that project.

You will be graded on how well-written & readable your code is, if it works, and if you did it the Laravel way.

Include any instructions on how to set up & deploy the web application in your Readme.md file in the project directory (delete the default readme).

## Installation Instructions

- **open the project folder in your terminal**
- **run ```composer install```**
- **run ```npm install```**
- **rename the env.example file to .env**
- **set up your database credentials in the .env file**
- **in your terminal run ```php artisan key:generate``` command to set an application key. Make sure the php executable path is included in your SYSTEM PATH**
- **Next run ```php artisan:migrate``` to run the database migrations**
- **Next run ```npm run dev``` command to build application assets. Make sure you have npm installed in your machine. If you don't you can download it from [here](https://nodejs.org/en/download).**
- **After that, run ```php artisan serve```**
- **open the project in the browser at the url specified (usually localhost:8000).**

## License

The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
