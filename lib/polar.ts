import { Polar } from '@polar-sh/sdk';

// This is the central, shared Polar API client.
// It is configured to use the Polar sandbox environment for testing.
export const polar = new Polar({
  accessToken: process.env.POLAR_ACCESS_TOKEN,
  server: "sandbox",
});
