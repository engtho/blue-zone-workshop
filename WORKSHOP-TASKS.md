# Workshop Tasks

## Before We Start

**Goal**: Get familiar with the codebase and tools.

### Explore the Code (10 minutes):

1. Start the system: `docker compose up --build` or `docker compose up --build -d` (starts the containers in the background)
2. Open the [frontend](http://localhost:3000)
3. Look at the folder structure - notice how each service follows the same pattern
4. Browse through one service and take a closer look at the files present in:
   - `controller` - REST endpoints
   - `service` - Business logic
   - `repository` - Data storage
   - `dao` - Data access objects (database mapping)
   - `dto` - Data classes
   - `producer` - Kafka producer
   - `consumer` - Kafka consumer
---

## Task 1: Get Familiar with Repository and Explore Kafka UI and Frontend

**Goal**: Understand the system and see how Kafka events flow through the architecture.

### Your Mission:

Explore the system, create an alarm, and watch it appear in Kafka.

### Instructions:

1. **Explore the Frontend**:

   - Open the [frontend](http://localhost:3000)
   - Create an alarm using the form (select at least one customer to enable the button)

2. **Monitor Kafka Events**:
   - Open [Kafka UI](http://localhost:8081)
   - Go to Topics and find: `alarms`, `tickets`, `notifications`
   - Watch the messages in the `alarms` topic to see the event appear from creating an alarm

## Task 2: Create Kafka Consumer in Ticket Service

**Goal**: Make the ticket service automatically create tickets when alarm events are received.

### Your Mission:

Add the missing pieces in the Kafka consumer to connect alarms to ticket creation.

### Instructions:

1. **Navigate to the file**: `ticket-service/src/main/kotlin/workshop/ticketservice/consumer/AlarmEventConsumerImpl.kt`

2. **Examine the code below**
   * The `@KafkaListener` annotation from Spring helps abstract the connection to Kafka. It takes multiple arguments, but for our use case we only need `topics` and `groupId`. `topics` defines where the Kafka listener should look for incoming events, and the `groupId` is an identifier that is used to keep track of how far along the listener is in the stream of events. With these properties in place the application will be able to pick up where it left of in the event that it needs to be restarted.
   * As the event is in JSON format, we deserialize it to make it easier to work with.
   * After deserialization, we look at what type of event we've received and then only process it further if it is a new alarm.
   * We then pick the fields that are relevant for creating a Ticket and pass these down to the underlying ticketService which contains business logic for further processing

3. **Replace the empty implementation of `consumeAlarmEvent(alarmEventJson: String)` with the code below and ensure that the required imports are imported (provided as comments above the class definition)**

```kotlin
@KafkaListener(topics = [ALARM_TOPIC], groupId = TICKET_SERVICE_GROUP_ID) // Read from the kafka topic "alarms"
override fun consumeAlarmEvent(alarmEventJson: String) {
    try {
        // Deserialize JSON event from Kafka
        val alarm: AlarmEvent = objectMapper.readValue(alarmEventJson)
        log.info("Consumed alarm event: {}", alarm)
        if (alarm.eventType == ALARM_CREATED) {
            // Extract and pass down relevant fields to ticketService for Ticket creation
            when (alarm.impact) {
                "OUTAGE", "DEGRADED", "SLOW" -> {
                    log.info(
                        "Creating tickets for alarm {} with impact {}",
                        alarm.alarmId,
                        alarm.impact
                    )
                    alarm.affectedCustomers.forEach { customerId ->
                        ticketService.createTicketForAlarm(
                            alarm.alarmId,
                            customerId,
                            alarm.service,
                            alarm.impact
                        )
                    }
                    if (alarm.affectedCustomers.isEmpty()) {
                        ticketService.createTicketForAlarm(
                            alarm.alarmId,
                            "general",
                            alarm.service,
                            alarm.impact
                        )
                    }
                }

                else -> {
                    log.info("Ignoring alarm with impact: {}", alarm.impact)
                }
            }
        } else {
            log.info("Ignoring alarm event {}, event type {} not yet supported", alarm.alarmId, alarm.eventType)
        }
    } catch (e: Exception) {
        log.error("Error processing alarm event: {}", alarmEventJson, e)
    }
}
```

4. **Test that it works**:
   - Restart the ticket service: `docker compose restart ticket-service`
   - Create an alarm in the [frontend](http://localhost:3000)
   - Check that tickets appear to the right

---

## Task 3: Produce Ticket Created Events

**Goal**: Make the ticket service publish events when tickets are created.

### Your Mission:

Add the missing pieces in the Ticket service to publish ticket events.

### Instructions:

1. **Take a look at the TicketEvent data class in** `ticket-service/src/main/kotlin/workshop/ticketservice/dto/TicketEvent.kt` **and notice the similarities to the TicketEntity class**:
2. **Make a mental note of the extension method `TicketEntity.toEventDto(eventType: String)` in** `ticket-service/src/main/kotlin/workshop/ticketservice/dao/TicketEntity.kt`:
3. **Navigate to the event producer** `ticket-service/src/main/kotlin/workshop/ticketservice/producer/TicketEventProducerImpl.kt`:
4. **Examine the code below**
    * As we're now doing the opposite operation, producing instead of consuming, we have to transform the data class to JSON format before producing the event. This is handled by the `objectMapper`, which serializes the object using `writeValueAsString`.
    * The injected `KafkaTemplate` bean<sup>1</sup> from Spring once again helps abstract the connection to Kafka. It wraps our serialized event with a key and other metadata, and handles the connection and publication to the specified topic.
5. **Replace the empty implementation of `produce(ticketEvent: TicketEvent)` with the code below and ensure that the required import is imported (provided as a comment above the class definition)**

```kotlin
override fun produce(ticketEvent: TicketEvent) {
    try {
        val json = objectMapper.writeValueAsString(ticketEvent)
        log.info("Producing ticket event to topic 'tickets': {}", json)
        kafkaTemplate.send(TICKET_TOPIC, ticketEvent.ticketId, json)
        log.info("Successfully produced ticket event for ticket: {}", ticketEvent.ticketId)
    } catch (e: Exception) {
        log.error("Error producing ticket event: {}", ticketEvent, e)
    }
}
```
6. **Test that it works**:
   - Restart the ticket service: `docker compose restart ticket-service`
   - Create an alarm in the [frontend](http://localhost:3000)
   - Using [Kafka UI](http://localhost:8081) - Verify that a `ticketCreated` event has been published to the `tickets` topic

<sup>1</sup> Beans are a Spring boot construct, that simplifies the usage of objects. All beans are created, kept ready, and injected where needed by Spring as an alternative to initializing these with `new ObjectInstance()` every time you need the functionality.

---

## Task 4: Create Customer Data Endpoint

**Goal**: Build a REST API endpoint to retrieve customer information.

### Your Mission:

Add the missing endpoint code in the customer service that the frontend will use.

### Instructions:

1. **Navigate to** `customer-service/src/main/kotlin/workshop/customerservice/controller/CustomerApiController.kt`
2. **Examine the code below**
   * Using the underlying service, a database lookup is used to retrieve a customer with the provided id
   * If the customer exists, it is mapped to the expected API DTO and is served to the caller along with a 200 OK
   * If the customer does not exist, then a 404 Not found result is returned to the caller
3. **Replace the empty implementation of `getCustomerById(id: String)` with the code below and ensure that the required import is imported (provided as a comment above the class definition)**

```kotlin
override fun getCustomerById(@PathVariable id: String): ResponseEntity<Customer> {     
    logger.info("Request to get customer: {}", id)
    
    return try {
        val customer = customerService.getCustomer(id)
        customer?.toApiDto()?.let { ResponseEntity.ok(it) } ?: ResponseEntity.notFound().build()
    } catch (e: Exception) {
        logger.error("Error getting customer: {}", id, e)
        ResponseEntity.internalServerError().build()
    }
}
```

4. **Test that it works**:
    - Restart the customer service: `docker compose restart customer-service`
    - Open the [Swagger UI connected to the application](http://localhost:8084) and try the endpoint with an ID that exists in the database, e.g. c-42 which should return:
```json
{
  "id": "c-42",
  "name": "Ada Lovelace",
  "email": "ada@example.com",
  "phone": "+47 123 45 678",
  "services": [
    "TV",
    "BROADBAND"
  ],
  "priority": 2,
  "region": "Oslo"
}
```
---

## Task 5: Frontend Integration for Customer Data

**Goal**: Integrate the customer endpoint with the React frontend.

### Your Mission:

Add the missing code for retrieving customer information

### Instructions:

1. **Navigate to** `frontend/src/hooks/useCustomers.ts` and add this method body to `getCustomer`:

```typescript
const response = await fetch(`/api/customers/${id}`);
if (!response.ok) throw new Error("Failed to fetch customer");
return response.json();
```

2. **Test that it works**:
   - Restart the frontend: `docker compose restart frontend`
   - Verify that tickets display customer information instead of customer IDs

---

## Task 6: Implement Notification Service

**Goal**: Build a notification service that consumes ticket events and sends notifications.

### Your Mission:

Create a service that listens to ticket events from Kafka and processes them into notifications. You can use what you have learned in the previous tasks.

### What You Need to Figure Out:

1. **Event Consumption**: How do you listen to Kafka events in Spring Boot?
   - Use `@KafkaListener` annotation
   - What topic should you listen to?
   - How do you handle the event data structure?

2. **Notification Logic**: What should happen when a ticket event is consumed?
   - Store a notification record in the database
   - Use the provided utils functions to create and send messages
   - Send `notificationCreated` events to kafka using the `notifications` topic
   - Ensure that both ticketCreated and ticketUpdated events are handled


### Requirements to complete this task:

- Listen to the `tickets` Kafka topic
- Create notification records for each ticket created
- Store notifications in the notification service database
- Create simulated notifications (email/SMS)
- Produce `notificationCreated` events to the `notifications` Kafka topic for successfully sent notifications

3. **Test that it works**:
   - Restart the notification service: `docker compose restart notification-service`
   - Create an alarm in the [frontend](http://localhost:3000)
   - Resolve the ticket
   - Using [Kafka UI](http://localhost:8081) - Verify that `notificationCreated` events (with the expected payload) have been published to the `notifications` topic 

---

## Congratulations! 🎉

You've built a complete event-driven microservices system! You now have a better understanding of:

- **Event-driven architecture** with Kafka
- **Microservice communication** patterns
- **REST API design** and integration
- **Frontend-backend integration**
- **Asynchronous processing**
- **State management** across services
- **Problem-solving** in distributed systems

## Bonus tasks 🚀

- Add functionality for retrieving all notifications by ticket and/or customer
  - Use the newly created endpoint to enrich the ticket view with number of sent notifications
- Implement logic that auto resolves tickets when an alarm is resolved
- Implement Idempotency
    - Ensure that reprocessing the same Kafka event does not create duplicate tickets or notifications.
- Implement Retry & Backoff Strategy
    - Add retry logic with exponential backoff for Kafka consumers in case of transient errors (e.g. temporary database unavailability)
- Implement authentication, both between services and for the UI

📖 **Useful Documentation**:

- [Spring Boot Reference](https://docs.spring.io/spring-boot/docs/current/reference/html/)
- [Kotlin Documentation](https://kotlinlang.org/docs/home.html)
- [Apache Kafka](https://kafka.apache.org/documentation/)
- [Docker Documentation](https://docs.docker.com/)
- [React Documentation](https://react.dev/)
- [Microservices Patterns](https://microservices.io/patterns/)