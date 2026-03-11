<script>
    import { onMount } from 'svelte';
    import { onNavigate, afterNavigate } from '$app/navigation';
    import '../app.css';
    import Nav from '$lib/components/ui/Nav.svelte';
    
    let { children } = $props();

    afterNavigate(() => {
        window.scrollTo(0, 0);
    });

    onNavigate((navigation) => {
        if (!document.startViewTransition) return;

        return new Promise((resolve) => {
            document.startViewTransition(async () => {
                resolve();
                await navigation.complete;
            });
        });
    });

    onMount(() => {
        const getCookie = (name) => {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop().split(';').shift();
            return null;
        };

        if (!getCookie('accent_color')) {
            const randomColor = Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
            const color = `#${randomColor}`;
            document.cookie = `accent_color=${color}; max-age=31536000; path=/`;
            window.location.reload();
        }
    });
</script>

<svelte:head>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous">

    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet">
</svelte:head>


<div class="overlay"></div>

<div class="min-h-screen flex flex-col items-center justify-between font-['Inter'] relative w-full overflow-hidden">

    <div class="fixed top-0 inset-x-0 h-125 bg-linear-to-b from-white/2 to-transparent pointer-events-none z-0"></div>

    <div class="relative z-60 w-full max-w-6xl mx-auto px-6 lg:px-8 flex flex-col min-h-screen">
        <Nav />
        
        <main class="grow flex flex-col justify-center py-20 relative w-full">
            {@render children()}
        </main>
    </div>
</div>

<style>
    :global(h1), :global(h2), :global(h3) {
        font-family: 'Space Mono', monospace;
    }
</style>
