import Fluent

struct CreateProduct: AsyncMigration {
    func prepare(on database: Database) async throws {
        try await database.schema(Product.schema)
            .id()
            .field("name", .string, .required)
            .field("price", .double, .required)
            .field("description", .string)
            .field("category_id", .uuid, .required, .references(Category.schema, "id", onDelete: .cascade))
            .create()
    }

    func revert(on database: Database) async throws {
        try await database.schema(Product.schema).delete()
    }
}
