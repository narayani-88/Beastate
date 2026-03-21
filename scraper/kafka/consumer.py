import json
import logging
from typing import Callable, Dict, Any

from kafka import KafkaConsumer as _KafkaConsumer
from kafka.errors import KafkaError

from config.settings import KAFKA_BROKER, KAFKA_GROUP_ID

logger = logging.getLogger(__name__)


class KafkaConsumer:
    """Kafka consumer that polls a topic and dispatches messages to a handler."""

    def __init__(self, topic: str, group_id: str = KAFKA_GROUP_ID) -> None:
        self.topic = topic
        self._consumer = _KafkaConsumer(
            topic,
            bootstrap_servers=KAFKA_BROKER,
            group_id=group_id,
            auto_offset_reset="earliest",
            enable_auto_commit=True,
            value_deserializer=lambda b: json.loads(b.decode("utf-8")),
            consumer_timeout_ms=5000,   # stop iteration after 5 s of silence
        )
        logger.info(
            "KafkaConsumer subscribed to topic=%s group=%s", topic, group_id
        )

    def consume(
        self,
        handler: Callable[[Dict[str, Any]], None],
        max_messages: int = 0,
    ) -> None:
        """
        Poll messages from the topic and call *handler(data)* for each one.

        Args:
            handler:      Callable that receives the deserialised message dict.
            max_messages: Stop after this many messages (0 = run indefinitely).
        """
        count = 0
        try:
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
        except KafkaError as exc:
            logger.error("KafkaConsumer error on topic=%s: %s", self.topic, exc)
            raise
        finally:
            logger.info("KafkaConsumer processed %d messages from %s", count, self.topic)

    def close(self) -> None:
        self._consumer.close()
        logger.info("KafkaConsumer closed.")