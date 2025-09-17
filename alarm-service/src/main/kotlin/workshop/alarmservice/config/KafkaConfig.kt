package workshop.alarmservice.config

import org.apache.kafka.clients.admin.NewTopic
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.kafka.config.TopicBuilder
import workshop.alarmservice.utils.ALARM_TOPIC

@Configuration
class KafkaConfig {
    @Bean
    fun alarmsTopic(): NewTopic = TopicBuilder.name(ALARM_TOPIC).partitions(1).replicas(1).build()

}