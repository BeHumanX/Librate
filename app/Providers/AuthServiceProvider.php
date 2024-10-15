<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;
use App\Models\User;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        //
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        $this->registerPolicies();

        Gate::define('isAdmin', function (User $user) {
            return $user->role == 'admin'; // Adjust this condition based on how you store admin status
        });
        Gate::define('isStaff', function (User $user) {
            return $user->role == 'staff';
        });
        Gate::define('isUser', function (User $user) {
            return $user->role == 'user';
        });
    }
}
