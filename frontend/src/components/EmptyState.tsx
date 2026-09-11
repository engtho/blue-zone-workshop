import React from 'react';

interface EmptyStateProps {
    icon: React.ElementType;
    title: string;
    description?: string;
    action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
    icon: Icon,
    title,
    description,
    action
}) => (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed px-6 py-12 text-center">
        <div className="mb-3 rounded-full bg-muted p-3">
            <Icon className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
        </div>
        <p className="font-medium">{title}</p>
        {description && (
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>
        )}
        {action && <div className="mt-4">{action}</div>}
    </div>
);

export default EmptyState;
