<script lang="ts">
  import { goto } from "$app/navigation";
  import { browser } from "$app/environment";
  import { getContext } from "svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import * as NavigationMenu from "$lib/components/ui/navigation-menu/index.js";
  import Logo from "$lib/components/Logo.svelte";
  import type { SettingsState } from "$lib/stores/settings.svelte.js";
  import type { Session } from "@auth/sveltekit";
  import {
    isInIframe,
    breakOutToPath,
  } from "$lib/utils/codecanyon-detection.js";

  // Get settings from context
  const settingsState = getContext<SettingsState>("settings");

  // Get session from context
  const getSession = getContext<() => Session | null>("session");
  const session = $derived(getSession?.() || null);

  // Icons
  import {
    ArrowRightIcon,
    MenuIcon,
    XIcon,
  } from "$lib/icons/index.js";

  // Mobile menu state
  let mobileMenuOpen = $state(false);

  // Smooth scroll to section
  function scrollToSection(sectionId: string) {
    if (!browser) return;

    mobileMenuOpen = false;
    goto(`/#${sectionId}`);
  }

  // Handle navigation clicks
  function handleNavClick(target: string) {
    if (target === "home") {
      if (isInIframe()) {
        breakOutToPath("/");
      } else {
        goto("/");
      }
    } else if (target === "signup") {
      if (isInIframe()) {
        breakOutToPath("/register");
      } else {
        goto("/register");
      }
    } else if (target === "signin") {
      if (isInIframe()) {
        breakOutToPath("/login");
      } else {
        goto("/login");
      }
    } else if (target === "newchat") {
      if (isInIframe()) {
        breakOutToPath("/newchat");
      } else {
        goto("/newchat");
      }
    } else {
      scrollToSection(target);
    }
  }
</script>

<svelte:head>
  <title>Terms of Service - {settingsState.siteName}</title>
  <meta
    name="description"
    content="Terms of Service for {settingsState.siteName}. Review our terms and conditions for using our AI-powered services."
  />
</svelte:head>

<!-- Navigation Header -->
<nav
  class="sticky top-0 z-50 w-full border-gray-800 bg-black/95 backdrop-blur supports-[backdrop-filter]:bg-black/60"
>
  <div class="container mx-auto px-4">
    <div class="flex h-16 items-center relative">
      <!-- Logo -->
      <div class="flex items-center">
        <Logo alt="App Logo" />
      </div>

      <!-- Desktop Navigation - Absolutely Centered -->
      <div class="absolute left-1/2 transform -translate-x-1/2 hidden md:block">
        <NavigationMenu.Root class="relative">
          <NavigationMenu.List class="flex items-center space-x-1">
            <NavigationMenu.Item>
              <button
                class="cursor-pointer px-4 py-2 text-md font-medium text-gray-300 transition-colors hover:text-white"
                onclick={() => handleNavClick("home")}
              >
                Home
              </button>
            </NavigationMenu.Item>
            <NavigationMenu.Item>
              <button
                class="cursor-pointer px-4 py-2 text-md font-medium text-gray-300 transition-colors hover:text-white"
                onclick={() => handleNavClick("features")}
              >
                Features
              </button>
            </NavigationMenu.Item>
            <NavigationMenu.Item>
              <button
                class="cursor-pointer px-4 py-2 text-md font-medium text-gray-300 transition-colors hover:text-white"
                onclick={() => handleNavClick("pricing")}
              >
                Pricing
              </button>
            </NavigationMenu.Item>
            <NavigationMenu.Item>
              <button
                class="cursor-pointer px-4 py-2 text-md font-medium text-gray-300 transition-colors hover:text-white"
                onclick={() => handleNavClick("faq")}
              >
                FAQ
              </button>
            </NavigationMenu.Item>
          </NavigationMenu.List>
        </NavigationMenu.Root>
      </div>

      <!-- CTA Buttons -->
      <div class="ml-auto hidden md:flex items-center gap-2">
        {#if session?.user}
          <!-- Authenticated: Show "Go to App" -->
          <Button
            onclick={() => handleNavClick("newchat")}
            class="cursor-pointer bg-white text-black text-md font-semibold hover:bg-gray-300 transition-colors rounded-full"
          >
            Go to App
            <ArrowRightIcon class="w-4 h-4" />
          </Button>
        {:else}
          <!-- Not Authenticated: Show "Sign Up" and "Sign In" -->
          <Button
            onclick={() => handleNavClick("signup")}
            class="cursor-pointer bg-white text-black text-md font-medium hover:bg-gray-300 transition-colors rounded-full"
          >
            Sign Up
          </Button>
          <Button
            variant="outline"
            onclick={() => handleNavClick("signin")}
            class="cursor-pointer text-md font-medium border-gray-300 rounded-full"
          >
            Sign In
          </Button>
        {/if}
      </div>

      <!-- Mobile Menu Button -->
      <div class="md:hidden ml-auto">
        <Button
          variant="ghost"
          size="sm"
          onclick={() => (mobileMenuOpen = !mobileMenuOpen)}
          class="p-2"
        >
          {#if mobileMenuOpen}
            <XIcon class="w-5 h-5" />
          {:else}
            <MenuIcon class="w-5 h-5" />
          {/if}
        </Button>
      </div>
    </div>

    <!-- Mobile Navigation Menu -->
    {#if mobileMenuOpen}
      <div class="md:hidden border-t border-gray-800 bg-black">
        <div class="px-2 pt-2 pb-3 space-y-1">
          <button
            class="block w-full text-left px-3 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-accent hover:text-white rounded-md"
            onclick={() => handleNavClick("home")}
          >
            Home
          </button>
          <button
            class="block w-full text-left px-3 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-accent hover:text-white rounded-md"
            onclick={() => handleNavClick("features")}
          >
            Features
          </button>
          <button
            class="block w-full text-left px-3 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-accent hover:text-white rounded-md"
            onclick={() => handleNavClick("pricing")}
          >
            Pricing
          </button>
          <button
            class="block w-full text-left px-3 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-accent hover:text-white rounded-md"
            onclick={() => handleNavClick("faq")}
          >
            FAQ
          </button>
          <div class="px-3 py-2 space-y-2">
            {#if session?.user}
              <!-- Authenticated: Show "Go to App" -->
              <Button
                onclick={() => handleNavClick("newchat")}
                class="w-full hover:bg-gray-300 text-black rounded-full"
              >
                Go to App
                <ArrowRightIcon class="w-4 h-4" />
              </Button>
            {:else}
              <!-- Not Authenticated: Show "Sign Up" and "Sign In" -->
              <Button
                onclick={() => handleNavClick("signup")}
                class="w-full hover:bg-gray-300 text-black rounded-full"
              >
                Sign Up
              </Button>
              <Button
                variant="outline"
                onclick={() => handleNavClick("signin")}
                class="w-full border-gray-300 rounded-full"
              >
                Sign In
              </Button>
            {/if}
          </div>
        </div>
      </div>
    {/if}
  </div>
</nav>

<div class="container mx-auto p-6 max-w-4xl">
  <!-- Header -->
  <div class="mb-8">
    <h1 class="text-4xl font-bold tracking-tight mb-4">Terms of Service</h1>
    <p class="text-lg text-muted-foreground">
      Last updated: {new Date().toLocaleDateString()}
    </p>
  </div>

  <!-- Content -->
  <div class="prose prose-slate dark:prose-invert max-w-none markdown-content">
    <section class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
      <p class="mb-4">
        By accessing and using AI Models Platform (the "Service"), you accept
        and agree to be bound by the terms and provision of this agreement. If
        you do not agree to abide by the above, please do not use this service.
      </p>
    </section>

    <section class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">2. Description of Service</h2>
      <p class="mb-4">
        AI Models Platform provides access to multiple artificial intelligence
        models for text generation, image creation, video generation, and other
        AI-powered services. The Service includes both free and paid
        subscription tiers with varying usage limits and features.
      </p>
    </section>

    <section class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">
        3. User Accounts and Registration
      </h2>
      <p class="mb-4">
        To access certain features of the Service, you must register for an
        account. You agree to:
      </p>
      <ul>
        <li>
          Provide accurate, current, and complete information during
          registration
        </li>
        <li>Maintain the security of your password and account</li>
        <li>Notify us immediately of any unauthorized use of your account</li>
        <li>Accept responsibility for all activities under your account</li>
      </ul>
    </section>

    <section class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">4. Acceptable Use Policy</h2>
      <p class="mb-4">You agree not to use the Service to:</p>
      <ul>
        <li>
          Generate content that is illegal, harmful, threatening, or abusive
        </li>
        <li>Create content that infringes on intellectual property rights</li>
        <li>Violate any applicable laws or regulations</li>
        <li>Attempt to reverse engineer or exploit the Service</li>
        <li>Share account credentials with others</li>
        <li>
          Use the Service for commercial purposes beyond your subscription
          limits
        </li>
      </ul>
    </section>

    <section class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">
        5. Subscription and Payment Terms
      </h2>
      <p class="mb-4">
        Paid subscriptions are billed in advance on a monthly or yearly basis.
        You agree to:
      </p>
      <ul>
        <li>Pay all applicable fees for your chosen subscription plan</li>
        <li>Provide accurate billing information</li>
        <li>Notify us of any changes to your payment information</li>
      </ul>
      <p class="mb-4">
        Subscriptions will automatically renew unless cancelled before the
        renewal date. We do not offer refunds under any circumstances.
      </p>
    </section>

    <section class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">6. Usage Limits and Fair Use</h2>
      <p class="mb-4">
        Each subscription plan includes specific usage limits for text, image,
        and video generation. Excessive usage beyond reasonable limits may
        result in temporary service restrictions or account suspension.
      </p>
    </section>

    <section class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">7. Intellectual Property</h2>
      <p class="mb-4">
        You retain ownership of content you input into the Service. AI-generated
        content created through the Service is provided to you under a
        non-exclusive license. The Service and its underlying technology remain
        the property of AI Models Platform and its licensors.
      </p>
    </section>

    <section class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">
        8. Privacy and Data Protection
      </h2>
      <p class="mb-4">
        Your privacy is important to us. Please review our Privacy Policy, which
        also governs your use of the Service, to understand our practices
        regarding your personal information.
      </p>
    </section>

    <section class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">9. Termination</h2>
      <p class="mb-4">
        We may terminate or suspend your account and access to the Service at
        our sole discretion, without prior notice, for conduct that violates
        these Terms of Service or is harmful to other users, us, or third
        parties.
      </p>
    </section>

    <section class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">10. Limitation of Liability</h2>
      <p class="mb-4">
        THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND. TO THE
        MAXIMUM EXTENT PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES AND SHALL
        NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, OR CONSEQUENTIAL
        DAMAGES.
      </p>
    </section>

    <section class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">11. Changes to Terms</h2>
      <p class="mb-4">
        We reserve the right to modify these terms at any time. We will notify
        users of significant changes via email or through the Service. Continued
        use of the Service after changes constitutes acceptance of the new
        terms.
      </p>
    </section>

    <section class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">12. Contact Information</h2>
      <p class="mb-4">
        If you have any questions about these Terms of Service, please contact
        us at:
      </p>
      <p class="mb-4">
        Email: support@zably.chat
      </p>
    </section>
  </div>
</div>

<!-- Footer -->
<footer class="border-t py-8 px-4" style="background-color: #101011">
  <div class="container mx-auto text-center">
    <div class="flex flex-col items-center gap-4">
      <!-- Footer Links -->
      <div class="flex gap-6 text-sm">
        <a
          href="/privacy"
          class="text-gray-400 hover:text-white transition-colors"
        >
          Privacy Policy
        </a>
        <a
          href="/terms"
          class="text-gray-400 hover:text-white transition-colors"
        >
          Terms of Service
        </a>
      </div>
      <!-- Copyright -->
      <p class="text-sm text-muted-foreground">
        © 2025 ZablyAI. All rights reserved.
      </p>
    </div>
  </div>
</footer>
