import Fluent

struct CreateReview: AsyncMigration {
    func prepare(on database: Database) async throws {
        try await database.schema(Review.schema)
            .id()
            .field("author", .string, .required)
            .field("rating", .int, .required)
            .field("comment", .string, .required)
            .field("product_id", .uuid, .required, .references(Product.schema, "id", onDelete: .cascade))
            .create()
    }

    func revert(on database: Database) async throws {
        try await database.schema(Review.schema).delete()
    }
}
