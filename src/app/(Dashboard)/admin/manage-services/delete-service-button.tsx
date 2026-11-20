"use client";

import { LoaderCircle, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { type MouseEvent, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type DeleteServiceButtonProps = {
  serviceId: string;
  serviceName: string;
  onDeleted?: (serviceId: string) => void;
};

export default function DeleteServiceButton({
  serviceId,
  serviceName,
  onDeleted,
}: DeleteServiceButtonProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleDelete(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    if (deleting) return;

    setDeleting(true);
    setErrorMessage(null);

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!baseUrl) {
        throw new Error("Missing NEXT_PUBLIC_API_URL");
      }

      const response = await fetch(`${baseUrl}/services/${serviceId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete service");
      }

      onDeleted?.(serviceId);
      setOpen(false);
      router.refresh();
    } catch (error) {
      console.error("Failed to delete service:", error);
      setErrorMessage("Could not delete service. Please try again.");
    } finally {
      setDeleting(false);
    }
  }

  function handleOpenChange(nextOpen: boolean) {
    if (deleting) return;
    setOpen(nextOpen);
    if (!nextOpen) {
      setErrorMessage(null);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogTrigger
        aria-label={`Delete ${serviceName}`}
        disabled={deleting}
        className="flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-danger-soft hover:text-danger-foreground disabled:cursor-not-allowed disabled:opacity-60"
      >
        {deleting ? (
          <LoaderCircle className="size-3.5 animate-spin" aria-hidden="true" />
        ) : (
          <Trash2 className="size-3.5" aria-hidden="true" />
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete service?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            service &ldquo;{serviceName}&rdquo;.
          </AlertDialogDescription>
        </AlertDialogHeader>
        {errorMessage ? (
          <p role="alert" className="text-sm text-danger">
            {errorMessage}
          </p>
        ) : null}
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={deleting}>
            {deleting ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
