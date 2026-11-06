window.QUIZ = [
  {
    id: "kafka/1/q1",
    stem: "Topic payments has 6 partitions. Every event for account A-17 uses the key A-17. What can you rely on?",
    options: ["All events keep order; every account stays separated","A-17 events lose order; other accounts keep ordering","A-17 events keep order; other accounts may interleave","All events lose order; only offsets stay monotonic"],
    answer: 2,
    why: "One key means one partition, and a partition is ordered. Other keys can share that partition, so their events may sit in between. <a href=\"https://kafka.apache.org/44/getting-started/introduction/\">Source</a>"
  },
  {
    id: "kafka/1/q2",
    stem: "In a 3-partition topic, keys alice and bob both land on partition 0. What does this mean?",
    options: ["Fine; different keys may share one partition","Wrong; different keys need their own partition","Wrong; the hash function has clearly failed","Fine; Kafka will soon move bob elsewhere"],
    answer: 0,
    why: "Hash modulo partition count sends many keys to few partitions, so collisions are normal. Same key implies same partition, but not the reverse."
  },
  {
    id: "kafka/1/q3",
    stem: "A keyed topic grows from 3 to 6 partitions. What happens to events for existing customers?",
    options: ["All events remap onto the new partition set","New events stay put; old events get moved","No events remap until the consumers all restart","New events may remap; old events stay put"],
    answer: 3,
    why: "The modulo changes, so new events may route elsewhere. Kafka doesn't redistribute existing data, which is why per-key order can break. <a href=\"https://kafka.apache.org/44/operations/basic-kafka-operations/\">Source</a>"
  },
  {
    id: "kafka/1/q4",
    stem: "An operator runs kafka-topics --alter --partitions 6 on a topic with 12 partitions. What is the result?",
    options: ["Accepted; the extra partitions are deleted immediately","Rejected; the partition count can only increase","Accepted; the extra partitions drain then disappear","Rejected; the topic must be empty beforehand"],
    answer: 1,
    why: "Kafka does not support reducing a topic's partitions, even an empty one. The usual route is a new topic. <a href=\"https://kafka.apache.org/44/operations/basic-kafka-operations/\">Source</a>"
  },
  {
    id: "kafka/1/q5",
    stem: "A producer with default settings sends many records with a null key. What does a current client do?",
    options: ["Sends each single record to the next partition","Hashes the null key to one fixed partition","Fills a batch on one partition, then moves","Rejects the record because a key is required"],
    answer: 2,
    why: "That's the sticky behaviour. Per-record cycling needs the explicit RoundRobinPartitioner. <a href=\"https://kafka.apache.org/44/configuration/producer-configs/\">Source</a>"
  },
  {
    id: "kafka/1/q6",
    stem: "A requirement says all events in a topic must be consumed in exact write order. What is the only way to get this?",
    options: ["Use many partitions and set identical timestamps","Use one partition and accept less parallelism","Use many partitions and add more consumers","Use one consumer and keep many partitions"],
    answer: 1,
    why: "Only a single partition gives a total order. One consumer reading many partitions still has no order across them. <a href=\"https://kafka.apache.org/44/getting-started/introduction/\">Source</a>"
  }
];
