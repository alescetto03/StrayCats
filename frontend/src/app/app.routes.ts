import { Routes } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { AuthenticationPageComponent } from './authentication-page/authentication-page.component';
import { RegisterPageComponent } from './register-page/register-page.component';
import { CatDetailComponent } from './cat-detail/cat-detail.component';
import { LogoutComponent } from './logout/logout.component';
import { CatFormComponent } from './cat-form/cat-form.component';
import { authGuard } from './_guards/auth/auth.guard';

export const routes: Routes = [
    {
        path: "",
        title: "Homepage",
        component: HomepageComponent,
    },
    {
        path: "signin",
        title: "Login",
        component: AuthenticationPageComponent,
    },
    {
        path: "signup",
        title: "Register",
        component: RegisterPageComponent,
    },
    {
        path: "cats/:id",
        title: "Cat Detail",
        component: CatDetailComponent,
    },
    {
        path: "logout",
        component: LogoutComponent,
        title: "Log out"
    },
    {
        path: "cats",
        component: CatFormComponent,
        title: "Insert a cat",
        canActivate: [authGuard]
    }
];
