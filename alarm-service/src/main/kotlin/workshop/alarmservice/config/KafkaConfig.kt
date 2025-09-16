package workshop.alarmservice.config

import org.apache.kafka.clients.admin.NewTopic
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.kafka.config.TopicBuilder
import org.springframework.kafka.core.KafkaTemplate
import org.springframework.kafka.core.ProducerFactory

@Configuration
class KafkaConfig {
    @Bean
    fun alarmsTopic(): NewTopic = TopicBuilder.name("alarms").partitions(1).replicas(1).build()

    @Bean
    fun kafkaTemplate(
            factory: ProducerFactory<String, String>
    ): KafkaTemplate<String, String> {
        return KafkaTemplate(factory)
    }
}