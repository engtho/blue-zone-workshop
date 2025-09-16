package workshop.ticketservice.consumer


interface AlarmEventConsumer {
    fun consumeAlarmEvent(alarmEventJson: String)
}
