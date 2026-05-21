import Vapor

func routes(_ app: Application) throws {
    app.get { req async throws -> View in
        try await req.view.render("index", IndexContext(
            title: "Vapor Shop",
            message: "Fluent + Leaf + Redis"
        ))
    }

    try app.register(collection: CategoryController())
    try app.register(collection: ProductController())
    try app.register(collection: ReviewController())
}

struct IndexContext: Encodable {
    let title: String
    let message: String
}
