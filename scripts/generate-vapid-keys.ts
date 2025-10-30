/**
 * Generate VAPID keys for Web Push notifications
 * Run: tsx scripts/generate-vapid-keys.ts
 */

import webpush from 'web-push';

console.log('Generating VAPID keys...\n');

const vapidKeys = webpush.generateVAPIDKeys();

console.log('VAPID Keys Generated:\n');
console.log('VAPID_PUBLIC_KEY=' + vapidKeys.publicKey);
console.log('VAPID_PRIVATE_KEY=' + vapidKeys.privateKey);
console.log('\nAdd these to your .env file');
console.log('\nVAPID_SUBJECT should be a mailto: URL (e.g., mailto:admin@campus.edu)');

