# Pts

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.2.0.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

## Navigation To work
Add RouterModule in your component.ts file
use dynamic format: [routerLink]="['admin/categories']"

### Dockerize the angular app
## To use Docker for an Angular app, you need to:

    Create a production build of your Angular app.

    Use a Dockerfile to define how your app should be built and run.

    Build a Docker image from that Dockerfile.

    Run the container from the image.
### #####################################################################
## 1. Create Angular Production Build First, generate a production build:
ng build --configuration production
This will output files into the dist/<your-app-name> folder.

### 2. Create a Dockerfile : In the root of your Angular project, create a file named Dockerfile with the following content:

# Stage 1: Build Angular App
FROM node:18 AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build --configuration production

# Stage 2: Serve Angular App with Nginx
FROM nginx:alpine

# Copy custom nginx config (optional, for Angular routing support)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built Angular app to Nginx
COPY --from=builder /app/dist/<your-app-name> /usr/share/nginx/html

# Expose port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

Replace <your-app-name> with your actual app name as shown in angular.json.

### 3. Optional: nginx.conf : Create an nginx.conf file in the root directory (optional but recommended for Angular routing):

server {
  listen 80;

  server_name localhost;

  root /usr/share/nginx/html;
  index index.html;

  location / {
    try_files $uri $uri/ /index.html;
  }
}

### 4. Check your existing docker images
docker images

### 5. Build Docker Image
docker build -t ptsui .

### 5. Run Docker Container
docker run -d -p 8080:80 ptsui

### Now you can visit your Angular app at:
👉 http://localhost:8080


### ######################## for rapid build and deply ####################################

ng build --configuration production
docker build -t ptsui .
docker run -d -p 5203:5203 -p 5204:5204 ptsui

### toaster packages
npm install ngx-toastr --save
npm install @angular/animations --save

## Database Rollback
update-database -migration 0 -context ApplicationDbContext
update-database -migration 0 -context AuthDbContext
remove-migration -context AuthDbContext
remove-migration -context ApplicationDbContext

## Database Initialization
add-migration initial -context ApplicationDbContext
add-migration initial -context AuthDbContext
update-database -context ApplicationDbContext
update-database -context AuthDbContext

### Generate Self Signed Certificate
mkdir -p nginx/cert
openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout nginx/cert/server.key -out nginx/cert/server.crt -subj "/CN=localhost"


### Tasks yet to be implemented
1. UI forms/model validation
2. Apply toastr in every place (done)
3. logout if unauthorized (done)
4. Generic error handling
5. Auth guard implementaiton (done)
6. Product view options
7. filter/pagination/sorting options (done)
8. Beautiful Dashboard
9. User tracking in Data Insert (done)
10. User Registration with reader access by default (done)
11. Forgot password (done)
12. Reset Password (done)
13. Permission Control (done)
14. Restrict Domain in Registration. (done)
15. Upload Progress Bar in Add product Version (done)
16. Show Product Modal while delete -> bug -> no alternate found


### PHASE-3 : Requirements
Add Product Version
	-- version code must be unique (done)
	-- version code Add product also must be unique
	-- product code (space less) (done)
	-- barcode (if exists show warning: already enlisted) (done)
	-- all input fields must be capitalized. (done)
	-- suggest already existing field. (done)
Dashboard
	- Product Page first landing (after login) (done)
	- 
Admin (panel)
	- Not for managers only admin (done)
 
product Page
	- managers 
		- can't delete product version (done)
		- can edit product 
 
Report
	- excel
	- Filter Menu
		- drop down wise view


### UAT-04
-- allow all domain of akij venture (done)
-- login - > only Registration (done)
-- initial page should be login page (done)
-- Origin and SKU got same value after save in edit page.
-- no space in: Barcode (13 digit must) (done)

### UAT-05
view -- > on the same page
search box ->> not working properly (done)
Clean button ->> to reset all filters (done)
After edit --> Version code not showing/ need to discuss
cascading dropdowns -> beverage (category) >> Clearup (brand)
dropdown items -->> exceeding width (need to show full text)
dropdown items ->> multi selection
description box ->> remove (.)
previous versions list ->> not ordered
 
add version  ->> add columns printing company + cylinder company
session ->> 15 min
if session out ->> logout from every page

filter page size defaut -> 1000 (done)
page size -> (need to choose a name) e.g. return rows (done)
barcode -> must only be digits (done)
 
---------------------------------------
product wise barcode can be multiple.
product code --> duplicate warning
---------------------------------------
show (product code & barcode) wise full product details while (add/edit product)
 
------------------- admin page ---------------------
capitalize all fields except remarks/description fields
 
------------------- filter/table --------------------
maintain alphabetical sequence
 
-----------------------------------------------------
[Add Product] -> show it in new tab
 
------------------- product list page ---------------
remove project date, show version date instead (done)

### UAT-06

version list ordering in product list (done)
view product version close after save. (done)
product version (pr/po) not showing in view product (done)
product list -> on enter key -> search (done)
resolution wise heigh (if possible)
tool tip option for drop downs.
product code needs -> warning
producte code -> wants to view details
barcode code -> wants to view details
version code -> wants to view details
multiple barcode option
Report-> include pr + po
report -> remove time.
Manager can not delete -> master product data on edit (done)
Reader can not edit/save PR/PO (done)
Edit master on full scale 
Add product in modal popup style (done)
 