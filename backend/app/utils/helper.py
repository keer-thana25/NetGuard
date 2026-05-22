import logging

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[
        logging.StreamHandler()
    ]
)

logger = logging.getLogger("NetGuard")

def log_prediction(input_data: dict, result: dict):
    """
    Logs prediction request details and corresponding model decisions.
    """
    logger.info(
        f"Traffic Analysis -> Protocol: {input_data.get('protocol')}, "
        f"Ports: {input_data.get('src_port')} -> {input_data.get('dst_port')}, "
        f"Result: {result.get('status')} ({result.get('risk')} Risk, Conf: {result.get('confidence')}%)"
    )
