# Kafka based message Queue

## Install & Setup Kafka
1. kafka-storage.bat random-uuid
2. kafka-storage.bat format -t YOUR_CLUSTER_ID -c config\kraft\server.properties
3. kafka-server-start.bat config\kraft\server.properties

### Create Kafka Topic(s)
1. kafka-topics.bat --create --topic queue1 --bootstrap-server localhost:9092 --partitions 1 --replication-factor 1
2. kafka-topics.bat --create --topic queue2 --bootstrap-server localhost:9092 --partitions 1 --replication-factor 1

### Send Message to that Queue
1. kafka-console-producer.bat --topic queue1 --bootstrap-server localhost:9092
2. kafka-console-producer.bat --topic queue2 --bootstrap-server localhost:9092

## Run Backend
run 'node server.js' in cmd

## Run Front End
run 'ng serve'
open `http://localhost:4200` in browser

### Send More Messages and create more topics/Queues