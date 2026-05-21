import Fluent
import FluentSQLiteDriver
import Leaf
import Redis
import Vapor

public func configure(_ app: Application) async throws {
    app.middleware.use(FileMiddleware(publicDirectory: app.directory.publicDirectory))

    app.databases.use(.sqlite(.file("db.sqlite")), as: .sqlite)

    configureRedis(app)

    app.views.use(.leaf)

    app.migrations.add(CreateCategory())
    app.migrations.add(CreateProduct())
    app.migrations.add(CreateReview())
    app.migrations.add(SeedData())

    try await app.autoMigrate()

    try routes(app)
}

private func configureRedis(_ app: Application) {
    let hostname = Environment.get("REDIS_HOST") ?? "localhost"
    let port = Int(Environment.get("REDIS_PORT") ?? "6379") ?? 6379

    if let url = Environment.get("REDIS_URL"), let config = try? RedisConfiguration(url: url) {
        app.redis.configuration = config
    } else {
        app.redis.configuration = RedisConfiguration(hostname: hostname, port: port)
    }
}
