import * as React from "react";

export interface ToastProps {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    variant?: "default" | "destructive";
    title?: React.ReactNode;
    description?: React.ReactNode;
}

export type ToastActionElement = React.ReactElement;

export interface Toast extends Omit<ToastProps, "id"> {
    id?: string;
}