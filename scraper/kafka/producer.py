import json
import logging
from typing import Any, Dict

from kafka import KafkaProducer as _KafkaProducer
from kafka.errors import KafkaError

from config.settings import KAFKA_BROKER

logger = logging.getLogger(__name__)


class KafkaProducer:
    """Thread-safe Kafka producer that serialises messages as JSON."""

    def __init__(self) -> None:
        self._producer = _KafkaProducer(
            bootstrap_servers=KAFKA_BROKER,
            value_serializer=lambda v: json.dumps(v).encode("utf-8"),
            key_serializer=lambda k: k.encode("utf-8") if k else None,
            retries=5,
            acks="all",
        )
        logger.info("KafkaProducer connected to %s", KAFKA_BROKER)

    def send_message(self, topic: str, data: Dict[str, Any], key: str = None) -> None:
        """Publish *data* to *topic*, blocking until acknowledged."""
        try:
            future = self._producer.send(topic, key=key, value=data)
            future.get(timeout=10)   # raises on delivery failure
            logger.debug("Sent message to topic=%s key=%s", topic, key)
        except KafkaError as exc:
            logger.error("Failed to send to topic=%s: %s", topic, exc)
            raise

    def flush(self) -> None:
        """Flush any buffered messages."""
        self._producer.flush()

    def close(self) -> None:
        self._producer.close()
        logger.info("KafkaProducer closed.")