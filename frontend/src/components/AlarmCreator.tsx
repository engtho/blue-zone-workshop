import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle2, Siren } from 'lucide-react';
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
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { MultiSelect, MultiSelectOption } from './ui/multi-select';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

const DEFAULT_VALUES: CreateAlarmFormData = {
    service: 'BROADBAND',
    impact: 'OUTAGE',
    affectedCustomers: []
};

const CUSTOMER_OPTIONS: MultiSelectOption[] = AVAILABLE_CUSTOMERS.map((customer) => ({
    value: customer.id,
    label: `${customer.name} (${customer.id})`
}));

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
        defaultValues: DEFAULT_VALUES
    });

    const onSubmit = (data: CreateAlarmFormData) => {
        createAlarm(data);
    };

    const selectedCustomers = form.watch('affectedCustomers');

    // Reset form on successful creation
    useEffect(() => {
        if (isSuccess) {
            form.reset(DEFAULT_VALUES);
            reset();
        }
    }, [isSuccess, form, reset]);

    return (
        <Card className="w-full">
            <CardHeader className="border-b">
                <CardTitle className="flex items-center gap-2 text-xl">
                    <Siren className="h-5 w-5 text-destructive" aria-hidden="true" />
                    Create Service Alarm
                </CardTitle>
                <CardDescription>
                    Raise a new service alarm to generate support tickets
                </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                        <FormField
                            control={form.control}
                            name="service"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Service</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
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
                                    <Select onValueChange={field.onChange} value={field.value}>
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
                                        <MultiSelect
                                            options={CUSTOMER_OPTIONS}
                                            value={field.value}
                                            onChange={field.onChange}
                                            placeholder="Select customers"
                                        />
                                    </FormControl>
                                    {selectedCustomers.length > 0 ? (
                                        <div className="flex flex-wrap gap-1.5 pt-1">
                                            {selectedCustomers.map((customerId) => (
                                                <Badge key={customerId} variant="secondary" className="font-normal">
                                                    {AVAILABLE_CUSTOMERS.find((c) => c.id === customerId)?.name ??
                                                        customerId}
                                                </Badge>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-muted-foreground">
                                            Select at least one customer to raise the alarm.
                                        </p>
                                    )}
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button
                            type="submit"
                            disabled={isCreating || selectedCustomers.length === 0}
                            className="w-full"
                        >
                            {isCreating ? 'Creating alarm…' : 'Create alarm'}
                        </Button>
                    </form>
                </Form>

                {isSuccess && (
                    <div className="mt-4 flex items-start gap-2 rounded-md border border-success/20 bg-success/10 p-3 text-sm text-success">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                        <span>Alarm created. Tickets will be generated automatically.</span>
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
