class CacheService {
    constructor() {
        this.cache = [];
    }

    get() {
        return this.cache;
    }

    set(data) {
        this.cache = data;
    }

    clear() {
        this.cache.length = 0;
    }
}

module.exports = new CacheService();