import Fluent
import Vapor

struct ProductController: RouteCollection {
    func boot(routes: RoutesBuilder) throws {
        let products = routes.grouped("products")
        products.get(use: index)
        products.get("create", use: createForm)
        products.post(use: create)
        products.get(":productID", use: show)
        products.get(":productID", "edit", use: editForm)
        products.post(":productID", "update", use: update)
        products.post(":productID", "delete", use: delete)
    }

    func index(req: Request) async throws -> View {
        var fromCache = false
        let items: [ProductListItem]

        if let cached: [ProductListItem] = try await req.cache.get(CacheKey.products, as: [ProductListItem].self) {
            items = cached
            fromCache = true
        } else {
            let products = try await Product.query(on: req.db)
                .with(\.$category)
                .with(\.$reviews)
                .sort(\.$name)
                .all()
            items = products.map { p in
                ProductListItem(
                    id: p.id!,
                    name: p.name,
                    price: p.price,
                    description: p.description ?? "",
                    categoryName: p.category.name,
                    reviewCount: p.reviews.count
                )
            }
            try await req.cache.set(CacheKey.products, value: items)
        }

        return try await req.view.render("products/index", ProductListContext(products: items, fromCache: fromCache))
    }

    func createForm(req: Request) async throws -> View {
        let categories = try await loadCategoryOptions(req: req)
        return try await req.view.render(
            "products/form",
            ProductFormContext(product: nil, categories: categories, title: "Nowy produkt", action: "/products")
        )
    }

    func create(req: Request) async throws -> Response {
        let input = try req.content.decode(ProductInput.self)
        guard let categoryID = UUID(uuidString: input.categoryID) else {
            throw Abort(.badRequest, reason: "Nieprawidłowa kategoria")
        }

        let product = Product(
            name: input.name,
            price: input.price,
            description: input.description,
            categoryID: categoryID
        )
        try await product.save(on: req.db)
        await req.cache.invalidate(CacheKey.products, CacheKey.categories, CacheKey.reviews)
        return req.redirect(to: "/products")
    }

    func show(req: Request) async throws -> View {
        let product = try await Product.find(req.parameters.get("productID"), on: req.db)
        guard let product else { throw Abort(.notFound) }

        try await product.$category.load(on: req.db)
        try await product.$reviews.load(on: req.db)

        let item = ProductListItem(
            id: product.id!,
            name: product.name,
            price: product.price,
            description: product.description ?? "",
            categoryName: product.category.name,
            reviewCount: product.reviews.count
        )
        let reviews = product.reviews.map { r in
            ReviewListItem(id: r.id!, author: r.author, rating: r.rating, comment: r.comment, productName: product.name)
        }

        return try await req.view.render("products/show", ProductDetailContext(product: item, reviews: reviews))
    }

    func editForm(req: Request) async throws -> View {
        let product = try await Product.find(req.parameters.get("productID"), on: req.db)
        guard let product else { throw Abort(.notFound) }

        let categories = try await loadCategoryOptions(req: req)
        let data = ProductFormData(
            id: product.id,
            name: product.name,
            price: String(product.price),
            description: product.description ?? "",
            categoryID: product.$category.id.uuidString
        )
        return try await req.view.render(
            "products/form",
            ProductFormContext(
                product: data,
                categories: categories,
                title: "Edycja produktu",
                action: "/products/\(product.id!.uuidString)/update"
            )
        )
    }

    func update(req: Request) async throws -> Response {
        let product = try await Product.find(req.parameters.get("productID"), on: req.db)
        guard let product else { throw Abort(.notFound) }

        let input = try req.content.decode(ProductInput.self)
        guard let categoryID = UUID(uuidString: input.categoryID) else {
            throw Abort(.badRequest, reason: "Nieprawidłowa kategoria")
        }

        product.name = input.name
        product.price = input.price
        product.description = input.description
        product.$category.id = categoryID
        try await product.save(on: req.db)
        await req.cache.invalidate(CacheKey.products, CacheKey.categories, CacheKey.reviews)
        return req.redirect(to: "/products/\(product.id!.uuidString)")
    }

    func delete(req: Request) async throws -> Response {
        let product = try await Product.find(req.parameters.get("productID"), on: req.db)
        guard let product else { throw Abort(.notFound) }

        try await product.delete(on: req.db)
        await req.cache.invalidate(CacheKey.products, CacheKey.categories, CacheKey.reviews)
        return req.redirect(to: "/products")
    }

    private func loadCategoryOptions(req: Request) async throws -> [CategoryOption] {
        let categories = try await Category.query(on: req.db).sort(\.$name).all()
        return categories.compactMap { c in
            guard let id = c.id else { return nil }
            return CategoryOption(id: id, name: c.name)
        }
    }
}

struct ProductInput: Content {
    let name: String
    let price: Double
    let description: String?
    let categoryID: String
}
