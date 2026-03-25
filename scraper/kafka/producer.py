import json
import logging
from typing import Any, Dict

from config.settings import KAFKA_BROKER

logger = logging.getLogger(__name__)


class KafkaProducer:
    """Thread-safe Kafka producer that serialises messages as JSON.
    If no broker is configured, operates in no-op mode."""

    def __init__(self) -> None:
        self._producer = None

        if not KAFKA_BROKER:
            logger.warning("KAFKA_BROKER not set — Kafka producer disabled.")
            return

        try:
            from kafka import KafkaProducer as _KafkaProducer
            self._producer = _KafkaProducer(
                bootstrap_servers=KAFKA_BROKER,
                value_serializer=lambda v: json.dumps(v).encode("utf-8"),
                key_serializer=lambda k: k.encode("utf-8") if k else None,
                retries=5,
                acks="all",
            )
            logger.info("KafkaProducer connected to %s", KAFKA_BROKER)
        except Exception as exc:
            logger.warning("Kafka unavailable, producer disabled: %s", exc)
            self._producer = None

    def send_message(self, topic: str, data: Dict[str, Any], key: str = None) -> None:
        """Publish *data* to *topic*. No-op if Kafka is unavailable."""
        if self._producer is None:
            logger.debug("Kafka disabled — skipping send to topic=%s", topic)
            return
        try:
            from kafka.errors import KafkaError
            future = self._producer.send(topic, key=key, value=data)
            future.get(timeout=10)
            logger.debug("Sent message to topic=%s key=%s", topic, key)
        except Exception as exc:
            logger.error("Failed to send to topic=%s: %s", topic, exc)

    def flush(self) -> None:
        if self._producer:
            self._producer.flush()

    def close(self) -> None:
        if self._producer:
            self._producer.close()
            logger.info("KafkaProducer closed.")