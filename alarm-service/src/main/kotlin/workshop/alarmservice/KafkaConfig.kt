package workshop.alarmservice

import org.apache.kafka.clients.admin.NewTopic
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.kafka.config.TopicBuilder

@Configuration
class KafkaConfig {
    @Bean
    fun alarmsTopic(): NewTopic = TopicBuilder.name("alarms").partitions(1).replicas(1).build()

    @Bean
    fun kafkaTemplate(
            factory: org.springframework.kafka.core.ProducerFactory<String, String>
    ): org.springframework.kafka.core.KafkaTemplate<String, String> {
        return org.springframework.kafka.core.KafkaTemplate(factory)
    }
}
