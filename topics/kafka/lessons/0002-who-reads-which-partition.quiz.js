window.QUIZ = [
  {
    id: "kafka/2/q1",
    stem: "A topic has 4 partitions and a group has 6 running consumers. What happens?",
    options: ["Six consumers share partitions; each reads some events","Four consumers get one partition; two sit idle","Four consumers get partitions; two read the replicas","Six consumers start; the broker rejects the extras"],
    answer: 1,
    why: "A partition has exactly one consumer in a group, so 4 partitions can occupy at most 4 consumers. The other 2 stay in the group, idle, ready to take over."
  },
  {
    id: "kafka/2/q2",
    stem: "A topic has 6 partitions and its group has 6 consumers, but lag keeps growing. You need more parallel reading. What must you do?",
    options: ["Add consumers first, then keep the partitions","Add replicas first, then add more consumers","Add groups first, then split the consumers","Add partitions first, then add more consumers"],
    answer: 3,
    why: "Partition count is the cap, and every consumer is already busy. More consumers alone would sit idle. Replicas don't help because consumers in a group still own one copy per partition."
  },
  {
    id: "kafka/2/q3",
    stem: "The fraud service and the billing service each need to see every order event. How should they consume?",
    options: ["Give each service its own consumer group","Give both services the same consumer group","Give each service its own topic partition","Give both services the same client identifier"],
    answer: 0,
    why: "Different groups each read everything. In a single group they would split the partitions, so each service would miss events. <a href=\"https://kafka.apache.org/44/javadoc/org/apache/kafka/clients/consumer/KafkaConsumer.html\">Source</a>"
  },
  {
    id: "kafka/2/q4",
    stem: "Which of these does NOT trigger a rebalance in a group subscribed to the topic?",
    options: ["A consumer leaves the group for good","A partition gets added to the topic","A producer starts writing to the topic","A subscribed topic gets deleted from Kafka"],
    answer: 2,
    why: "Rebalances follow group membership and subscribed topic metadata. Producers aren't group members. <a href=\"https://kafka.apache.org/44/javadoc/org/apache/kafka/clients/consumer/KafkaConsumer.html\">Source</a>"
  },
  {
    id: "kafka/2/q5",
    stem: "Consumers C0 and C1 use the Range assignor and subscribe to topics t0 and t1, with 3 partitions each. What is the result?",
    options: ["C0 gets three partitions and C1 gets three","C0 gets two partitions and C1 gets four","C0 gets five partitions and C1 gets one","C0 gets four partitions and C1 gets two"],
    answer: 3,
    why: "Range works per topic and gives each topic's extra partition to the first consumer in sorted order, so C0 gets the extra twice. <a href=\"https://kafka.apache.org/44/javadoc/org/apache/kafka/clients/consumer/RangeAssignor.html\">Source</a>"
  },
  {
    id: "kafka/2/q6",
    stem: "From Lesson 1: a group reads a keyed topic with 3 partitions, and an operator grows it to 6. What are the effects?",
    options: ["Group keeps assignment; keys stay on old partitions","Group rebalances; keys may route to new partitions","Group rebalances; keys stay on their old partitions","Group keeps assignment; keys route to new partitions"],
    answer: 1,
    why: "A partition count change triggers a rebalance, and the new modulo can send a key elsewhere. Both lessons apply here. <a href=\"https://kafka.apache.org/44/operations/basic-kafka-operations/\">Source</a>"
  },
  {
    id: "kafka/2/q7",
    stem: "From Lesson 1: a producer sends key K's events in order to a topic whose partition count stays fixed. A group of 3 consumers reads them, with no rebalance. Are K's events read in order?",
    options: ["No: consumers take turns reading from each partition","Yes: every consumer sorts events by their timestamp","Yes: one partition, and one consumer reads it","No: the group splits one partition across consumers"],
    answer: 2,
    why: "Lesson 1 puts K in one partition, and rule 1 gives that partition one consumer. Together they give per-key order."
  }
];
