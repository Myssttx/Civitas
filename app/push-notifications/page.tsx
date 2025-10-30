'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

export default function PushNotificationsPage() {
  const [isSupported, setIsSupported] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      setIsSupported(true);
      checkSubscription();
    }
  }, []);

  async function checkSubscription() {
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      setSubscription(sub);
      setIsSubscribed(!!sub);
    } catch (error) {
      console.error('Error checking subscription:', error);
    }
  }

  async function subscribe() {
    try {
      const reg = await navigator.serviceWorker.ready;
      const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

      if (!vapidPublicKey) {
        toast({
          title: 'Configuration Error',
          description: 'VAPID public key not configured',
          variant: 'destructive',
        });
        return;
      }

      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
      });

      // Send subscription to server
      const res = await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sub),
      });

      if (!res.ok) throw new Error('Failed to save subscription');

      setSubscription(sub);
      setIsSubscribed(true);

      toast({
        title: 'Subscribed',
        description: 'You will now receive push notifications',
      });
    } catch (error) {
      console.error('Error subscribing:', error);
      toast({
        title: 'Error',
        description: 'Failed to enable notifications',
        variant: 'destructive',
      });
    }
  }

  async function unsubscribe() {
    try {
      if (!subscription) return;

      await subscription.unsubscribe();

      await fetch('/api/push/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ endpoint: subscription.endpoint }),
      });

      setSubscription(null);
      setIsSubscribed(false);

      toast({
        title: 'Unsubscribed',
        description: 'You will no longer receive push notifications',
      });
    } catch (error) {
      console.error('Error unsubscribing:', error);
      toast({
        title: 'Error',
        description: 'Failed to disable notifications',
        variant: 'destructive',
      });
    }
  }

  if (!isSupported) {
    return (
      <div className="container mx-auto max-w-2xl p-4">
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">
              Push notifications are not supported in this browser.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl p-4">
      <h1 className="mb-6 text-3xl font-bold">Push Notifications</h1>

      <Card>
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
          <CardDescription>
            Enable push notifications to receive alerts and important updates
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Push Notifications</p>
              <p className="text-sm text-muted-foreground">
                {isSubscribed
                  ? 'You will receive notifications for alerts and updates'
                  : 'Enable to receive real-time notifications'}
              </p>
            </div>
            <Button onClick={isSubscribed ? unsubscribe : subscribe}>
              {isSubscribed ? 'Disable' : 'Enable'}
            </Button>
          </div>

          {isSubscribed && (
            <div className="rounded-md bg-muted p-4">
              <p className="text-sm">
                <strong>Status:</strong> Subscribed
                <br />
                <strong>Endpoint:</strong>{' '}
                <span className="font-mono text-xs">{subscription?.endpoint.substring(0, 50)}...</span>
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

