import Fluent
import Vapor

struct ReviewController: RouteCollection {
    func boot(routes: RoutesBuilder) throws {
        let reviews = routes.grouped("reviews")
        reviews.get(use: index)
        reviews.get("create", use: createForm)
        reviews.post(use: create)
        reviews.get(":reviewID", "edit", use: editForm)
        reviews.post(":reviewID", "update", use: update)
        reviews.post(":reviewID", "delete", use: delete)
    }

    func index(req: Request) async throws -> View {
        var fromCache = false
        let items: [ReviewListItem]

        if let cached: [ReviewListItem] = try await req.cache.get(CacheKey.reviews, as: [ReviewListItem].self) {
            items = cached
            fromCache = true
        } else {
            let reviews = try await Review.query(on: req.db)
                .with(\.$product)
                .sort(\.$author)
                .all()
            items = reviews.map { r in
                ReviewListItem(
                    id: r.id!,
                    author: r.author,
                    rating: r.rating,
                    comment: r.comment,
                    productName: r.product.name
                )
            }
            try await req.cache.set(CacheKey.reviews, value: items)
        }

        return try await req.view.render("reviews/index", ReviewListContext(reviews: items, fromCache: fromCache))
    }

    func createForm(req: Request) async throws -> View {
        let products = try await loadProductOptions(req: req)
        return try await req.view.render(
            "reviews/form",
            ReviewFormContext(review: nil, products: products, title: "Nowa opinia", action: "/reviews")
        )
    }

    func create(req: Request) async throws -> Response {
        let input = try req.content.decode(ReviewInput.self)
        guard let productID = UUID(uuidString: input.productID) else {
            throw Abort(.badRequest, reason: "Nieprawidłowy produkt")
        }

        let review = Review(
            author: input.author,
            rating: input.rating,
            comment: input.comment,
            productID: productID
        )
        try await review.save(on: req.db)
        await req.cache.invalidate(CacheKey.reviews, CacheKey.products)
        return req.redirect(to: "/reviews")
    }

    func editForm(req: Request) async throws -> View {
        let review = try await Review.find(req.parameters.get("reviewID"), on: req.db)
        guard let review else { throw Abort(.notFound) }

        let products = try await loadProductOptions(req: req)
        let data = ReviewFormData(
            id: review.id,
            author: review.author,
            rating: String(review.rating),
            comment: review.comment,
            productID: review.$product.id.uuidString
        )
        return try await req.view.render(
            "reviews/form",
            ReviewFormContext(
                review: data,
                products: products,
                title: "Edycja opinii",
                action: "/reviews/\(review.id!.uuidString)/update"
            )
        )
    }

    func update(req: Request) async throws -> Response {
        let review = try await Review.find(req.parameters.get("reviewID"), on: req.db)
        guard let review else { throw Abort(.notFound) }

        let input = try req.content.decode(ReviewInput.self)
        guard let productID = UUID(uuidString: input.productID) else {
            throw Abort(.badRequest, reason: "Nieprawidłowy produkt")
        }

        review.author = input.author
        review.rating = input.rating
        review.comment = input.comment
        review.$product.id = productID
        try await review.save(on: req.db)
        await req.cache.invalidate(CacheKey.reviews, CacheKey.products)
        return req.redirect(to: "/reviews")
    }

    func delete(req: Request) async throws -> Response {
        let review = try await Review.find(req.parameters.get("reviewID"), on: req.db)
        guard let review else { throw Abort(.notFound) }

        try await review.delete(on: req.db)
        await req.cache.invalidate(CacheKey.reviews, CacheKey.products)
        return req.redirect(to: "/reviews")
    }

    private func loadProductOptions(req: Request) async throws -> [ProductOption] {
        let products = try await Product.query(on: req.db).sort(\.$name).all()
        return products.compactMap { p in
            guard let id = p.id else { return nil }
            return ProductOption(id: id, name: p.name)
        }
    }
}

struct ReviewInput: Content {
    let author: String
    let rating: Int
    let comment: String
    let productID: String
}
