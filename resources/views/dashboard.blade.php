@extends('layouts.app')
@section('content')
    @if (auth()->user()->role === 'admin')
        <div id="admin-main">
        </div>
    @elseif(auth()->user()->role === 'staff')
        <div id="staff-main">
        </div>
    @elseif(auth()->user()->role === 'user')
        <div id="main">
        </div>
    @else
        <div class="container">
            <h1>You are not authorized to access this page</h1>
        </div>
    @endif
@endsection
