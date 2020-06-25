
    First, we get the Redis client.
    The string key is then set to the key name to be used for the sliding window rate limiter. Remember to use windowSizeMS, name and maxHits in the key to ensure uniqueness.
    keyGenerator.getKey() is used to add the course's key namespace prefix.
    We then get the current time in milliseconds, storing it in now.
    Inside a transaction, we perform the following Redis commands:
        Add a new member to the sorted set at key with ZADD. We set the score to the current time in milliseconds, and the value to <current time in millisecnds>-<random number> to ensure uniqueness of values.
        Remove members from the sorted set at key with ZREMRANGEBYSCORE. Members whose scores are less than the current time in milliseconds minus the length of the sliding window in milliseconds are removed. This ensures that the only members left in the sorted set are hits in the current sliding time window.
        Get the cardinality of the sorted set at key with ZCARD.
        If the cardinality of the sorted set is greater than the number of hits allowed in the sliding window, return -1 indicating that the rate limit has been reached. Otherwise, return the number of hits remaining in the sliding window.
