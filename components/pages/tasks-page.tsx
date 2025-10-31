'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { TaskStatus, TaskType } from '@prisma/client';
import { CheckCircle2, Circle, User, Clock } from 'lucide-react';
import { MainNav } from '@/components/navigation/main-nav';

export function TasksPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: tasksData } = useQuery('tasks', async () => {
    const res = await fetch('/api/tasks');
    if (!res.ok) throw new Error('Failed to fetch tasks');
    return res.json();
  });

  const { data: buildings } = useQuery('buildings', async () => {
    const res = await fetch('/api/buildings');
    if (!res.ok) throw new Error('Failed to fetch buildings');
    return res.json();
  });

  const claimMutation = useMutation(
    async (taskId: string) => {
      const res = await fetch(`/api/tasks/${taskId}/claim`, { method: 'PATCH' });
      if (!res.ok) throw new Error('Failed to claim task');
      return res.json();
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('tasks');
        toast({ title: 'Task claimed', description: 'You have claimed this task.' });
      },
    }
  );

  const completeMutation = useMutation(
    async (taskId: string) => {
      const res = await fetch(`/api/tasks/${taskId}/done`, { method: 'PATCH' });
      if (!res.ok) throw new Error('Failed to complete task');
      return res.json();
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('tasks');
        toast({ title: 'Task completed', description: 'Task marked as done.' });
      },
    }
  );

  const tasks = tasksData?.tasks || [];

  const open = tasks.filter((t: any) => t.status === TaskStatus.Open);
  const claimed = tasks.filter((t: any) => t.status === TaskStatus.Claimed);
  const done = tasks.filter((t: any) => t.status === TaskStatus.Done);

  return (
    <>
      <MainNav />
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto max-w-6xl p-4">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Tasks</h1>
        <Button asChild>
          <a href="/tasks/new">+ New Task</a>
        </Button>
      </div>

      {/* Task Board - Kanban Style */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Open Tasks */}
        <div>
          <h2 className="mb-4 text-lg font-semibold">
            Open ({open.length})
          </h2>
          <div className="space-y-3">
            {open.map((task: any) => (
              <TaskCard
                key={task.id}
                task={task}
                onClaim={() => claimMutation.mutate(task.id)}
                canClaim={true}
              />
            ))}
            {open.length === 0 && (
              <Card>
                <CardContent className="py-4 text-center text-sm text-muted-foreground">
                  No open tasks
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Claimed Tasks */}
        <div>
          <h2 className="mb-4 text-lg font-semibold">
            In Progress ({claimed.length})
          </h2>
          <div className="space-y-3">
            {claimed.map((task: any) => (
              <TaskCard
                key={task.id}
                task={task}
                onComplete={() => completeMutation.mutate(task.id)}
                canComplete={true}
              />
            ))}
            {claimed.length === 0 && (
              <Card>
                <CardContent className="py-4 text-center text-sm text-muted-foreground">
                  No tasks in progress
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Done Tasks */}
        <div>
          <h2 className="mb-4 text-lg font-semibold">
            Done ({done.length})
          </h2>
          <div className="space-y-3">
            {done.map((task: any) => (
              <TaskCard key={task.id} task={task} />
            ))}
            {done.length === 0 && (
              <Card>
                <CardContent className="py-4 text-center text-sm text-muted-foreground">
                  No completed tasks
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
      </div>
    </>
  );
}

function TaskCard({
  task,
  onClaim,
  onComplete,
  canClaim,
  canComplete,
}: {
  task: any;
  onClaim?: () => void;
  onComplete?: () => void;
  canClaim?: boolean;
  canComplete?: boolean;
}) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-base">{task.title}</CardTitle>
          <TaskTypeBadge type={task.type} />
        </div>
        <CardDescription>{task.building?.name}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {task.details && <p className="text-sm">{task.details}</p>}

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          {new Date(task.createdAt).toLocaleDateString()}
        </div>

        {task.claimer && (
          <div className="flex items-center gap-2 text-xs">
            <User className="h-3 w-3" />
            Claimed by: {task.claimer?.displayName || 'Unknown'}
          </div>
        )}

        <div className="flex gap-2">
          {canClaim && onClaim && (
            <Button size="sm" onClick={onClaim} className="flex-1">
              Claim Task
            </Button>
          )}
          {canComplete && onComplete && (
            <Button size="sm" onClick={onComplete} variant="default" className="flex-1">
              Mark Done
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function TaskTypeBadge({ type }: { type: TaskType }) {
  const colors: Record<TaskType, string> = {
    Supply: 'bg-blue-500',
    Escort: 'bg-purple-500',
    Info: 'bg-green-500',
    FirstAid: 'bg-red-500',
    Other: 'bg-gray-500',
  };

  return (
    <span
      className={`rounded-full px-2 py-1 text-xs font-medium text-white ${colors[type] || colors.Other}`}
    >
      {type}
    </span>
  );
}

