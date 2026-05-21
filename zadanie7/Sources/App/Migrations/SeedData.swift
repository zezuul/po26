import Fluent

struct SeedData: AsyncMigration {
    func prepare(on database: Database) async throws {
        let count = try await Category.query(on: database).count()
        guard count == 0 else { return }

        let electronics = Category(name: "Elektronika", description: "Sprzęt elektroniczny")
        let furniture = Category(name: "Meble", description: "Wyposażenie biura")
        try await electronics.save(on: database)
        try await furniture.save(on: database)

        guard let eid = electronics.id, let fid = furniture.id else { return }

        let laptop = Product(name: "Laptop", price: 3499.99, description: "15 cali", categoryID: eid)
        let desk = Product(name: "Biurko", price: 899.0, description: "Regulowane", categoryID: fid)
        try await laptop.save(on: database)
        try await desk.save(on: database)

        if let pid = laptop.id {
            try await Review(author: "Anna", rating: 5, comment: "Świetny sprzęt", productID: pid).save(on: database)
        }
    }

    func revert(on database: Database) async throws {
        try await Review.query(on: database).delete()
        try await Product.query(on: database).delete()
        try await Category.query(on: database).delete()
    }
}
