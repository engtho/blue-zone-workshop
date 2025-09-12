import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useCreateAlarm } from '../hooks/useAlarms';
import {
    AVAILABLE_CUSTOMERS,
    CreateAlarmFormData,
    createAlarmSchema,
    IMPACT_LABELS,
    ImpactLevel,
    SERVICE_LABELS,
    ServiceType
} from '../schemas';
import { ErrorMessage } from './ErrorMessage';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

const AlarmCreator: React.FC = () => {
    const {
        createAlarm,
        isCreating,
        isSuccess,
        isError,
        error,
        reset
    } = useCreateAlarm();

    const form = useForm<CreateAlarmFormData>({
        resolver: zodResolver(createAlarmSchema),
        defaultValues: {
            service: "BROADBAND" as const,
            impact: "OUTAGE" as const,
            affectedCustomers: []
        }
    });

    const onSubmit = (data: CreateAlarmFormData) => {
        console.log("Form submitted with data:", data);
        console.log("Form validation errors:", form.formState.errors);
        createAlarm(data);
    };

    // Reset form on successful creation
    useEffect(() => {
        if (isSuccess) {
            form.reset({
                service: "BROADBAND" as const,
                impact: "OUTAGE" as const,
                affectedCustomers: []
            });
            reset();
        }
    }, [isSuccess, form, reset]);

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Create Service Alarm</CardTitle>
                <CardDescription>
                    Create a new service alarm to generate support tickets
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={(e) => {
                        console.log("Form submit event triggered");
                        form.handleSubmit(onSubmit)(e);
                    }} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="service"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Service</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a service" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {Object.values(ServiceType).map((service) => (
                                                <SelectItem key={service} value={service}>
                                                    {SERVICE_LABELS[service]}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="impact"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Impact Level</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select impact level" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {Object.values(ImpactLevel).map((impact) => (
                                                <SelectItem key={impact} value={impact}>
                                                    {IMPACT_LABELS[impact]}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="affectedCustomers"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Affected Customers</FormLabel>
                                    <FormControl>
                                        <select
                                            multiple
                                            value={field.value}
                                            onChange={(e) => {
                                                const selectedOptions = Array.from(e.target.selectedOptions);
                                                const selectedIds = selectedOptions.map(option => option.value);
                                                field.onChange(selectedIds);
                                            }}
                                            className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            {AVAILABLE_CUSTOMERS.map(customer => (
                                                <option key={customer.id} value={customer.id}>
                                                    {customer.name} ({customer.id})
                                                </option>
                                            ))}
                                        </select>
                                    </FormControl>
                                    <div className="text-sm text-muted-foreground">
                                        Hold Ctrl (Windows) or Cmd (Mac) to select multiple customers
                                    </div>
                                    {field.value.length > 0 && (
                                        <div className="text-sm text-muted-foreground">
                                            Selected: {field.value.map(id =>
                                                AVAILABLE_CUSTOMERS.find(c => c.id === id)?.name || id
                                            ).join(', ')}
                                        </div>
                                    )}
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button
                            type="submit"
                            disabled={isCreating || form.watch('affectedCustomers').length === 0}
                            className="w-full"
                            onClick={() => console.log("Button clicked, isCreating:", isCreating, "customers:", form.watch('affectedCustomers').length)}
                        >
                            {isCreating ? 'Creating Alarm...' : 'Create Alarm'}
                        </Button>
                    </form>
                </Form>

                {isSuccess && (
                    <div className="mt-4 p-3 rounded-md bg-green-50 text-green-700 border border-green-200">
                        ✅ Alarm created successfully! Tickets will be generated automatically.
                    </div>
                )}

                {isError && error && (
                    <ErrorMessage
                        error={error}
                        onRetry={() => createAlarm(form.getValues())}
                        title="Failed to create alarm"
                        description="Unable to create the alarm. Please check your connection and try again."
                        showRetry={true}
                        className="mt-4"
                    />
                )}
            </CardContent>
        </Card>
    );
};

export default AlarmCreator;
