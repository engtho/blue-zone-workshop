package workshop.notificationservice.config

import org.apache.kafka.clients.admin.NewTopic
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.kafka.config.TopicBuilder
import workshop.notificationservice.utils.NOTIFICATION_TOPIC

@Configuration
class KafkaConfig {

    @Bean
    fun notificationsTopic(): NewTopic =
        TopicBuilder.name(NOTIFICATION_TOPIC).partitions(1).replicas(1).build()
}
