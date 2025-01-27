'use client';

// state management
import { Provider } from 'jotai';

// analytics
import posthog from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'

if (typeof window !== 'undefined') {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    person_profiles: 'always', // or 'always' to create profiles for anonymous users as well
  })
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PostHogProvider client={posthog}>
      <Provider>
        {children}
      </Provider>
    </PostHogProvider>
  );
}