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
  <title>Privacy Policy - {settingsState.siteName}</title>
  <meta
    name="description"
    content="Privacy Policy for {settingsState.siteName}. Learn how we collect, use, and protect your personal information."
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
    <h1 class="text-4xl font-bold tracking-tight mb-4">Privacy Policy</h1>
    <p class="text-lg text-muted-foreground">
      Last updated: {new Date().toLocaleDateString()}
    </p>
  </div>

  <!-- Content -->
  <div class="prose prose-slate dark:prose-invert max-w-none markdown-content">
    <section class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">1. Introduction</h2>
      <p class="mb-4">
        AI Models Platform ("we," "our," or "us") is committed to protecting
        your privacy. This Privacy Policy explains how we collect, use,
        disclose, and safeguard your information when you use our AI-powered
        services.
      </p>
    </section>

    <section class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">2. Information We Collect</h2>

      <h3 class="text-xl font-semibold mb-3">Personal Information</h3>
      <p class="mb-4">When you create an account, we collect:</p>
      <ul>
        <li>Email address and password</li>
        <li>Profile information you choose to provide</li>
        <li>Billing information for paid subscriptions</li>
        <li>Communication preferences</li>
      </ul>

      <h3 class="text-xl font-semibold mb-3">Usage Information</h3>
      <p class="mb-4">We automatically collect:</p>
      <ul>
        <li>Chat messages and AI interactions</li>
        <li>Generated content (images, videos, text)</li>
        <li>Usage statistics and analytics</li>
        <li>Device and browser information</li>
        <li>IP address and location data</li>
      </ul>
    </section>

    <section class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">
        3. How We Use Your Information
      </h2>
      <p class="mb-4">We use your information to:</p>
      <ul>
        <li>Provide and maintain the AI Models Platform service</li>
        <li>Process your transactions and manage subscriptions</li>
        <li>Improve our AI models and service quality</li>
        <li>Communicate with you about service updates and support</li>
        <li>Ensure compliance with our Terms of Service</li>
        <li>Prevent fraud and abuse</li>
      </ul>
    </section>

    <section class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">
        4. Information Sharing and Disclosure
      </h2>

      <h3 class="text-xl font-semibold mb-3">Third-Party Service Providers</h3>
      <p class="mb-4">
        We share information with trusted partners who help us operate our
        service:
      </p>
      <ul>
        <li>AI model providers (OpenAI, Google, Anthropic, etc.)</li>
        <li>Payment processors (Stripe)</li>
        <li>Cloud storage providers (Cloudflare)</li>
        <li>Analytics and monitoring services</li>
      </ul>

      <h3 class="text-xl font-semibold mb-3">Legal Requirements</h3>
      <p class="mb-4">
        We may disclose your information if required by law or to protect our
        rights, your safety, or the safety of others.
      </p>
    </section>

    <section class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">5. Data Security</h2>
      <p class="mb-4">
        We implement appropriate security measures to protect your information:
      </p>
      <ul>
        <li>Encryption of sensitive data in transit and at rest</li>
        <li>Regular security audits and monitoring</li>
        <li>Access controls and authentication</li>
        <li>Secure data centers and infrastructure</li>
      </ul>
    </section>

    <section class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">6. Data Retention</h2>
      <p class="mb-4">
        We retain your personal information only for as long as necessary to
        provide our services and fulfill the purposes outlined in this policy.
        Chat history and generated content are stored until you delete them or
        close your account.
      </p>
    </section>

    <section class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">7. Your Rights and Choices</h2>
      <p class="mb-4">You have the right to:</p>
      <ul>
        <li>Access and update your personal information</li>
        <li>Delete your account and associated data</li>
        <li>Opt out of marketing communications</li>
        <li>Export your data</li>
        <li>Request correction of inaccurate information</li>
      </ul>
    </section>

    <section class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">8. Cookies and Tracking</h2>
      <p class="mb-4">
        We use cookies and similar technologies to enhance your experience,
        analyze usage, and provide personalized content. You can control cookie
        settings through your browser preferences.
      </p>
    </section>

    <section class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">
        9. International Data Transfers
      </h2>
      <p class="mb-4">
        Your information may be transferred to and processed in countries other
        than your country of residence. We ensure appropriate safeguards are in
        place to protect your data during international transfers.
      </p>
    </section>

    <section class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">10. Children's Privacy</h2>
      <p class="mb-4">
        Our service is not intended for children under 13 years of age. We do
        not knowingly collect personal information from children under 13. If
        you believe we have collected information from a child, please contact
        us immediately.
      </p>
    </section>

    <section class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">
        11. Changes to This Privacy Policy
      </h2>
      <p class="mb-4">
        We may update this Privacy Policy from time to time. We will notify you
        of any material changes by posting the new policy on this page and
        updating the "Last updated" date.
      </p>
    </section>

    <section class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">12. Contact Us</h2>
      <p class="mb-4">
        If you have any questions about this Privacy Policy or our data
        practices, please contact us at:
      </p>
      <p class="mb-4">
        Email: support@zably.chat
      </p>
    </section>

    <section class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">13. Regional Privacy Rights</h2>

      <h3 class="text-xl font-semibold mb-3">European Union (GDPR)</h3>
      <p class="mb-4">
        If you are located in the EU, you have additional rights under the
        General Data Protection Regulation, including the right to data
        portability, the right to be forgotten, and the right to object to
        processing.
      </p>

      <h3 class="text-xl font-semibold mb-3">California (CCPA)</h3>
      <p class="mb-4">
        California residents have specific rights regarding their personal
        information, including the right to know what personal information is
        collected and the right to request deletion of personal information.
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
