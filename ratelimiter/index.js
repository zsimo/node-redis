const hitSlidingWindow = async (name, opts) => {
    const client = redis.getClient();

    // START Challenge #7
    const key = keyGenerator.getKey(`limiter:${opts.interval}:${name}:${opts.maxHits}`);
    const now = timeUtils.getCurrentTimestampMillis();

    const transaction = client.multi();

    const member = `${now}-${Math.random()}`;

    transaction.zadd(key, now, member);
    transaction.zremrangebyscore(key, 0, now - opts.interval);
    transaction.zcard(key);

    const response = await transaction.execAsync();

    const hits = parseInt(response[2], 10);

    let hitsRemaining;

    if (hits > opts.maxHits) {
        // Too many hits.
        hitsRemaining = -1;
    } else {
        // Return number of hits remaining.
        hitsRemaining = opts.maxHits - hits;
    }

    return hitsRemaining;

    // END Challenge #7
};