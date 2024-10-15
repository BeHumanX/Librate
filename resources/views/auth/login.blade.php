<x-guest-layout>
    <!-- Session Status -->
    <x-auth-session-status class="mb-4" :status="session('status')" />

    <form method="POST" action="{{ route('login') }}" class="space-y-6">
        @csrf

        <!-- Email Address -->
        <div>
            <h1 class="text-[32px] font-bold text-default">login</h1>
            <input id="email" class="mt-1 block w-full h-[40px] text-default focus:text-[#33374C] rounded-md border-gray-300 bg-backgroundDark pl-4" placeholder="email" type="email" name="email" value="{{ old('email') }}" required autocomplete="username">
            <x-input-error :messages="$errors->get('email')" class="mt-2 text-sm text-red-600" />
        </div>

        <!-- Password -->
        <div>
            <input id="password" class="mt-1 block w-full h-[40px] text-default focus:text-[#33374C] rounded-md border-gray-300 bg-backgroundDark pl-4" 
                   type="password"
                   name="password"
                   placeholder="password"
                   required autocomplete="current-password" />
            <x-input-error :messages="$errors->get('password')" class="mt-2 text-sm text-red-600" />
        </div>

        <!-- Remember Me and Forgot Password -->
        <div class="flex items-center justify-between">
            <label for="remember_me" class="inline-flex items-center">
                <input id="remember_me" type="checkbox" class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" name="remember">
                <span class="ml-2 text-sm text-gray-600">{{ __('Remember me') }}</span>
            </label>

            @if (Route::has('password.request'))
                <a class="text-sm text-indigo-600 hover:text-indigo-500" href="{{ route('password.request') }}">
                    {{ __('Forgot your password?') }}
                </a>
            @endif
        </div>

        <div>
            <x-primary-button class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md text-sm font-medium text-[#33374C] bg-backgroundDark hover:bg-[#33374C] hover:text-white">
                {{ __('Log in') }}
            </x-primary-button>
        </div>
    </form>
</x-guest-layout>
