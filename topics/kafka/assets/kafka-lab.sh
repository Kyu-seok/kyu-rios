# Local single-broker Kafka lab. Load it with: source assets/kafka-lab.sh
# Works in zsh and bash. Needs Docker running. Publishes no host port, so it cannot
# clash with another broker on 9092; CLI tools run inside the container via k.
KAFKA_LAB_NAME=kafka-lab
KAFKA_LAB_IMAGE=apache/kafka:4.4.0

# Start the broker and wait until it answers.
kafka_lab_up() {
  docker run -d --name "$KAFKA_LAB_NAME" "$KAFKA_LAB_IMAGE" >/dev/null || return 1
  printf 'Waiting for broker'
  for _ in $(seq 1 30); do
    if k kafka-topics.sh --list >/dev/null 2>&1; then echo ' ready.'; return 0; fi
    printf '.'; sleep 2
  done
  echo ' timed out. Check: docker logs kafka-lab'; return 1
}

# Delete the broker and all of its data.
kafka_lab_down() { docker rm -f "$KAFKA_LAB_NAME" >/dev/null && echo 'Lab removed.'; }

# Run a Kafka CLI tool inside the container: k kafka-topics.sh --list
k() {
  tool=$1; shift
  docker exec -i "$KAFKA_LAB_NAME" /opt/kafka/bin/"$tool" --bootstrap-server localhost:9092 "$@"
}

# Print every event in each partition: k_peek orders 3
# Hides stderr because the console consumer logs a harmless error when its timeout ends.
k_peek() {
  for p in $(seq 0 $(($2 - 1))); do
    echo "--- partition $p"
    k kafka-console-consumer.sh --topic "$1" --partition "$p" --offset earliest --timeout-ms 4000 \
      --formatter-property print.key=true --formatter-property print.offset=true 2>/dev/null
  done
}

# Start a background consumer inside the container: k_consumer_start c1 billing orders
# The third argument is a topic regex, so 'orders|refunds' subscribes to both.
k_consumer_start() {
  docker exec -d "$KAFKA_LAB_NAME" sh -c "echo \$\$ > /tmp/$1.pid; exec /opt/kafka/bin/kafka-console-consumer.sh --bootstrap-server localhost:9092 --include '$3' --group $2 --command-property client.id=$1 > /tmp/$1.log 2>&1"
}

# Stop a background consumer cleanly, so it leaves the group: k_consumer_stop c1
k_consumer_stop() { docker exec "$KAFKA_LAB_NAME" sh -c "kill \$(cat /tmp/$1.pid)"; }

# Show who owns what in a group: k_members billing
k_members() {
  k kafka-consumer-groups.sh --describe --group "$1" --members --verbose 2>/dev/null \
    | awk 'NF { printf "%-10s %-11s %s\n", $4, $5, $7 }'
}
