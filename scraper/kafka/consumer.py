import json
import logging
from typing import Callable, Dict, Any

from config.settings import KAFKA_BROKER, KAFKA_GROUP_ID

logger = logging.getLogger(__name__)


class KafkaConsumer:
    """Kafka consumer that polls a topic and dispatches messages to a handler.
    If no broker is configured, operates in no-op mode."""

    def __init__(self, topic: str, group_id: str = KAFKA_GROUP_ID) -> None:
        self.topic = topic
        self._consumer = None

        if not KAFKA_BROKER:
            logger.warning("KAFKA_BROKER not set — Kafka consumer disabled.")
            return

        try:
            from kafka import KafkaConsumer as _KafkaConsumer
            self._consumer = _KafkaConsumer(
                topic,
                bootstrap_servers=KAFKA_BROKER,
                group_id=group_id,
                auto_offset_reset="earliest",
                enable_auto_commit=True,
                value_deserializer=lambda b: json.loads(b.decode("utf-8")),
                consumer_timeout_ms=5000,
            )
            logger.info(
                "KafkaConsumer subscribed to topic=%s group=%s", topic, group_id
            )
        except Exception as exc:
            logger.warning("Kafka unavailable, consumer disabled: %s", exc)
            self._consumer = None

    def consume(
            self,
            handler: Callable[[Dict[str, Any]], None],
            max_messages: int = 0,
    ) -> None:
        """Poll messages from the topic. No-op if Kafka is unavailable."""
        if self._consumer is None:
            logger.debug("Kafka disabled — skipping consume from topic=%s", self.topic)
            return

        count = 0
        try:
            from kafka.errors import KafkaError
            for message in self._consumer:
                try:
                    handler(message.value)
                    count += 1
                    if max_messages and count >= max_messages:
                        break
                except Exception as exc:
                    logger.error(
                        "Error handling message offset=%s: %s",
                        message.offset, exc,
                    )
        except Exception as exc:
            logger.error("KafkaConsumer error on topic=%s: %s", self.topic, exc)
        finally:
            logger.info("KafkaConsumer processed %d messages from %s", count, self.topic)

    def close(self) -> None:
        if self._consumer:
            self._consumer.close()
            logger.info("KafkaConsumer closed.")