import { Routes } from '@angular/router';
import { CategoryListComponent } from './features/category/category-list/category-list.component';
import { AddCategoryComponent } from './features/category/add-category/add-category.component';
import { EditCategoryComponent } from './features/category/edit-category/edit-category.component';
import { CylindercompanyListComponent } from './features/cylinderCompany/cylindercompany-list/cylindercompany-list.component';
import { PrintingcompanyListComponent } from './features/printingCompany/printingcompany-list/printingcompany-list.component';
import { AddCylindercompanyComponent } from './features/cylinderCompany/add-cylindercompany/add-cylindercompany.component';
import { EditCylindercompanyComponent } from './features/cylinderCompany/edit-cylindercompany/edit-cylindercompany.component';
import { ProductCodeListComponent } from './features/productCode/productcode-list/productcode-list.component';
import { EditProductCodeComponent } from './features/productCode/edit-productcode/edit-productcode.component';
import { AddProductCodeComponent } from './features/productCode/add-productcode/add-productcode.component';
import { AddPrintingcompanyComponent } from './features/printingCompany/add-printingcompany/add-printingcompany.component';
import { EditPrintingcompanyComponent } from './features/printingCompany/edit-printingcompany/edit-printingcompany.component';
import { ProductListComponent } from './features/product/product-list/product-list.component';
import { AddProductComponent } from './features/product/add-product/add-product.component';
import { LoginComponent } from './features/auth/login/login.component';
import { EditProductComponent } from './features/product/edit-product/edit-product.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { ForgotPasswordComponent } from './features/auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './features/auth/reset-password/reset-password.component';
import { PermissionControlComponent } from './features/auth/permission-control/permission-control.component';
import { authGuard } from './features/auth/guards/auth.guard';
import { PacktypeListComponent } from './features/packtype/packtype-list/packtype-list.component';
import { AddPacktypeComponent } from './features/packtype/add-packtype/add-packtype.component';
import { EditPacktypeComponent } from './features/packtype/edit-packtype/edit-packtype.component';

export const routes: Routes = [
    {
        path: 'admin/categories',
        component: CategoryListComponent,
        canActivate: [authGuard]
    },
    {
        path: 'admin/categories/add',
        component: AddCategoryComponent,
        canActivate: [authGuard]
    },
    {
        path: 'admin/categories/:id',
        component: EditCategoryComponent,
        canActivate: [authGuard]
    },
    {
        path: 'admin/cylindercompany',
        component: CylindercompanyListComponent,
        canActivate: [authGuard]
    },
    {
        path: 'admin/cylindercompany/add',
        component: AddCylindercompanyComponent,
        canActivate: [authGuard]
    },
    {
        path: 'admin/cylindercompany/:id',
        component: EditCylindercompanyComponent,
        canActivate: [authGuard]
    },
    {
        path: 'admin/printingcompany',
        component: PrintingcompanyListComponent,
        canActivate: [authGuard]
    },
    {
        path: 'admin/printingcompany/add',
        component: AddPrintingcompanyComponent,
        canActivate: [authGuard]
    },
    {
        path: 'admin/printingcompany/:id',
        component: EditPrintingcompanyComponent,
        canActivate: [authGuard]
    },
    {
        path: 'admin/packtype',
        component: PacktypeListComponent,
        canActivate: [authGuard]
    },
    {
        path: 'admin/packtype/add',
        component: AddPacktypeComponent,
        canActivate: [authGuard]
    },
    {
        path: 'admin/packtype/:id',
        component: EditPacktypeComponent,
        canActivate: [authGuard]
    },
    {
        path: 'admin/products',
        component: ProductListComponent,
        canActivate: [authGuard]
    },
    {
        path: 'admin/products/add',
        component: AddProductComponent,
        canActivate: [authGuard]
    },
    {
        path: 'admin/products/:id',
        component: EditProductComponent,
        canActivate: [authGuard]
    },
    { path: 'admin/permission-control', component: PermissionControlComponent },
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
    },
    { path: 'reset-password', component: ResetPasswordComponent },


];
