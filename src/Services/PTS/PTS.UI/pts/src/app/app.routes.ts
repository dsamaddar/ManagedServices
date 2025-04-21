import { Routes } from '@angular/router';
import { CategoryListComponent } from './features/category/category-list/category-list.component';
import { AddCategoryComponent } from './features/category/add-category/add-category.component';
import { EditCategoryComponent } from './features/category/edit-category/edit-category.component';
import { CylindercompanyListComponent } from './features/cylinderCompany/cylindercompany-list/cylindercompany-list.component';
import { PrintingcompanyListComponent } from './features/printingCompany/printingcompany-list/printingcompany-list.component';
import { AddCylindercompanyComponent } from './features/cylinderCompany/add-cylindercompany/add-cylindercompany.component';
import { EditCylindercompanyComponent } from './features/cylinderCompany/edit-cylindercompany/edit-cylindercompany.component';
import { ProjectListComponent } from './features/project/project-list/project-list.component';
import { EditProjectComponent } from './features/project/edit-project/edit-project.component';
import { AddProjectComponent } from './features/project/add-project/add-project.component';
import { AddPrintingcompanyComponent } from './features/printingCompany/add-printingcompany/add-printingcompany.component';
import { EditPrintingcompanyComponent } from './features/printingCompany/edit-printingcompany/edit-printingcompany.component';
import { ProductListComponent } from './features/product/product-list/product-list.component';
import { AddProductComponent } from './features/product/add-product/add-product.component';
import { LoginComponent } from './features/auth/login/login.component';
import { EditProductComponent } from './features/product/edit-product/edit-product.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { ForgotPasswordComponent } from './features/auth/forgot-password/forgot-password.component';

export const routes: Routes = [
    {
        path: 'admin/categories',
        component: CategoryListComponent
    },
    {
        path: 'admin/categories/add',
        component: AddCategoryComponent
    },
    {
        path: 'admin/categories/:id',
        component: EditCategoryComponent
    },
    {
        path: 'admin/cylindercompany',
        component: CylindercompanyListComponent
    },
    {
        path: 'admin/cylindercompany/add',
        component: AddCylindercompanyComponent
    },
    {
        path: 'admin/cylindercompany/:id',
        component: EditCylindercompanyComponent
    },
    {
        path: 'admin/printingcompany',
        component: PrintingcompanyListComponent
    },
    {
        path: 'admin/printingcompany/add',
        component: AddPrintingcompanyComponent
    },
    {
        path: 'admin/printingcompany/:id',
        component: EditPrintingcompanyComponent
    },
    {
        path: 'admin/projects',
        component: ProjectListComponent
    },
    {
        path: 'admin/projects/add',
        component: AddProjectComponent
    },
    {
        path: 'admin/projects/:id',
        component: EditProjectComponent
    },
    {
        path: 'admin/products',
        component: ProductListComponent
    },
    {
        path: 'admin/products/add',
        component: AddProductComponent
    },
    {
        path: 'admin/products/:id',
        component: EditProductComponent
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'register',
        component: RegisterComponent
    },
    {
        path: 'forgotpassword',
        component: ForgotPasswordComponent
    }

];
