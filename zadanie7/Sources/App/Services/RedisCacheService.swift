import Redis
import Vapor

/// Cache w Redis — listy encji (Fluent + SQLite = źródło prawdy).
struct RedisCacheService {
    let req: Request

    func get<T: Decodable>(_ key: String, as type: T.Type) async throws -> T? {
        do {
            return try await req.redis.get(RedisKey(key), asJSON: type).get()
        } catch {
            req.logger.warning("Redis GET \(key): \(error.localizedDescription)")
            return nil
        }
    }

    func set<T: Encodable>(_ key: String, value: T, expiresIn seconds: Int = 300) async throws {
        do {
            let redisKey = RedisKey(key)
            try await req.redis.set(redisKey, toJSON: value).get()
            try await req.redis.expire(redisKey, after: .seconds(Int64(seconds))).get()
        } catch {
            req.logger.warning("Redis SET \(key): \(error.localizedDescription)")
        }
    }

    func invalidate(_ keys: String...) async {
        for key in keys {
            do {
                _ = try await req.redis.delete(RedisKey(key)).get()
            } catch {
                req.logger.warning("Redis DEL \(key): \(error.localizedDescription)")
            }
        }
    }
}

extension Request {
    var cache: RedisCacheService {
        RedisCacheService(req: self)
    }
}

enum CacheKey {
    static let categories = "cache:categories:all"
    static let products = "cache:products:all"
    static let reviews = "cache:reviews:all"

    static func product(_ id: UUID) -> String { "cache:product:\(id.uuidString)" }
    static func category(_ id: UUID) -> String { "cache:category:\(id.uuidString)" }
}
