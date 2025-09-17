package workshop.ticketservice.config

import org.apache.kafka.clients.admin.NewTopic
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.kafka.config.TopicBuilder
import workshop.ticketservice.utils.TICKET_TOPIC

@Configuration
class KafkaConfig {

    @Bean
    fun ticketsTopic(): NewTopic =
        TopicBuilder.name(TICKET_TOPIC).partitions(1).replicas(1).build()
}