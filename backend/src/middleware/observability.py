"""
Middleware for request logging and metrics collection
Provides observability for API requests
"""

import logging
import time
import uuid
from typing import Callable

from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware

from ..utils.logging_config import CorrelationIdFilter, get_logger

logger = get_logger(__name__)


class RequestLoggingMiddleware(BaseHTTPMiddleware):
    """
    Middleware for logging all HTTP requests with timing and correlation IDs
    """

    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        # Generate correlation ID
        correlation_id = str(uuid.uuid4())

        # Add correlation ID to request headers
        request.state.correlation_id = correlation_id

        # Add correlation ID filter to logger
        correlation_filter = CorrelationIdFilter(correlation_id)
        logger.addFilter(correlation_filter)

        # Log request
        client_host = request.client.host if request.client else "unknown"
        logger.info(
            f"Request started: {request.method} {request.url.path}",
            extra={
                "method": request.method,
                "path": request.url.path,
                "query_params": str(request.query_params),
                "client_host": client_host,
                "correlation_id": correlation_id,
            },
        )

        # Process request and measure time
        start_time = time.time()
        try:
            response = await call_next(request)
            process_time = time.time() - start_time

            # Log response
            logger.info(
                f"Request completed: {request.method} {request.url.path} - {response.status_code}",
                extra={
                    "method": request.method,
                    "path": request.url.path,
                    "status_code": response.status_code,
                    "process_time_ms": round(process_time * 1000, 2),
                    "correlation_id": correlation_id,
                },
            )

            # Add timing header to response
            response.headers["X-Process-Time"] = str(round(process_time * 1000, 2))
            response.headers["X-Correlation-ID"] = correlation_id

            return response
        except Exception as e:
            process_time = time.time() - start_time
            logger.exception(
                f"Request failed: {request.method} {request.url.path}",
                extra={
                    "method": request.method,
                    "path": request.url.path,
                    "process_time_ms": round(process_time * 1000, 2),
                    "correlation_id": correlation_id,
                    "error": str(e),
                },
            )
            raise
        finally:
            # Remove correlation filter
            logger.removeFilter(correlation_filter)


class MetricsMiddleware(BaseHTTPMiddleware):
    """
    Middleware for collecting API metrics
    Tracks request counts, response times, and error rates
    """

    def __init__(self, app):
        super().__init__(app)
        # In-memory metrics storage (use Redis/Prometheus in production)
        self.metrics = {
            "requests_total": 0,
            "requests_by_method": {},
            "requests_by_status": {},
            "response_times": [],
            "errors_total": 0,
        }

    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        start_time = time.time()

        try:
            response = await call_next(request)

            # Update metrics
            self.metrics["requests_total"] += 1

            # Track by method
            method = request.method
            self.metrics["requests_by_method"][method] = (
                self.metrics["requests_by_method"].get(method, 0) + 1
            )

            # Track by status code
            status_code = response.status_code
            self.metrics["requests_by_status"][str(status_code)] = (
                self.metrics["requests_by_status"].get(str(status_code), 0) + 1
            )

            # Track response time
            process_time = time.time() - start_time
            self.metrics["response_times"].append(process_time * 1000)

            # Keep only last 1000 response times
            if len(self.metrics["response_times"]) > 1000:
                self.metrics["response_times"] = self.metrics["response_times"][-1000:]

            # Track errors
            if status_code >= 400:
                self.metrics["errors_total"] += 1

            return response
        except Exception as e:
            self.metrics["errors_total"] += 1
            raise

    def get_metrics(self) -> dict:
        """Get current metrics snapshot"""
        response_times = self.metrics["response_times"]

        # Calculate percentiles
        if response_times:
            sorted_times = sorted(response_times)
            p50 = sorted_times[len(sorted_times) // 2]
            p95 = sorted_times[int(len(sorted_times) * 0.95)]
            p99 = sorted_times[int(len(sorted_times) * 0.99)]
            avg = sum(response_times) / len(response_times)
        else:
            p50 = p95 = p99 = avg = 0

        return {
            "requests": {
                "total": self.metrics["requests_total"],
                "by_method": self.metrics["requests_by_method"],
                "by_status": self.metrics["requests_by_status"],
            },
            "response_times": {
                "avg_ms": round(avg, 2),
                "p50_ms": round(p50, 2),
                "p95_ms": round(p95, 2),
                "p99_ms": round(p99, 2),
                "samples": len(response_times),
            },
            "errors": {
                "total": self.metrics["errors_total"],
                "rate": round(
                    (
                        self.metrics["errors_total"]
                        / max(self.metrics["requests_total"], 1)
                    )
                    * 100,
                    2,
                ),
            },
        }
