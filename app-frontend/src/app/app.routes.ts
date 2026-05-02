import { Routes } from '@angular/router';


export const routes: Routes = [

  {
    path: '',
    loadComponent: () =>
      import('./features/routes/search/search.component')
        .then(m => m.Search)
  },

  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component')
        .then(m => m.LoginComponent)
  },

  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/register/register.component')
        .then(m => m.RegisterComponent)
  },

  {
    path: 'profile',
    loadComponent: () => 
      import('./features/profile/profile.component')
        .then(m => m.ProfileComponent),
    runGuardsAndResolvers: 'always'
  },

  {
    path: 'welcome',
    loadComponent: () => import('./features/welcome/welcome.component')
      .then(m => m.WelcomeComponent)
  },

  {
    path: 'results',
    loadComponent: () => import('./features/routes/results/results.component')
      .then(m => m.ResultsComponent)
  },

  {
    path: 'route-detail/:id',
    loadComponent: () =>
      import('./features/routes/route-detail/route-detail.component')
        .then(m => m.RouteDetailComponent)
  },

  {
    path: 'payment',
    loadComponent: () =>
      import('./features/payment/payment.component')
        .then(m => m.PaymentComponent)
  },

  {
    path: 'payment-method',
    loadComponent: () =>
      import('./features/payment-method/payment-method.component')
        .then(m => m.PaymentMethodComponent)
  },

  {
    path: 'payment-result',
    loadComponent: () =>
      import('./features/payment-result/payment-result.component')
        .then(m => m.PaymentResultComponent)
  },

  {
    path: 'payment-result',
    loadComponent: () =>
      import('./features/payment-result/payment-result.component')
        .then(m => m.PaymentResultComponent)
  },

  {
    path: 'my-reservations',
    loadComponent: () =>
      import('./features/my-reservations/my-reservations.component')
        .then(m => m.MyReservationsComponent)
  },

  {
    path: 'rate-route/:id',
    loadComponent: () =>
      import('./features/rate-route/rate-route.component')
        .then(m => m.RateRouteComponent)
  },

  {
    path: 'listbans',
    loadComponent: () =>
      import('./features/admin-bans/admin-bans.component')
        .then(m => m.AdminBansComponent)
  },

  {
    path: 'listbans/create',
    loadComponent: () =>
      import('./features/admin-bans/create-ban/create-ban.component')
        .then(m => m.CreateBanComponent)
  }

];