import Fluent
import Vapor

struct CategoryController: RouteCollection {
    func boot(routes: RoutesBuilder) throws {
        let categories = routes.grouped("categories")
        categories.get(use: index)
        categories.get("create", use: createForm)
        categories.post(use: create)
        categories.get(":categoryID", use: show)
        categories.get(":categoryID", "edit", use: editForm)
        categories.post(":categoryID", "update", use: update)
        categories.post(":categoryID", "delete", use: delete)
    }

    func index(req: Request) async throws -> View {
        var fromCache = false
        let items: [CategoryListItem]

        if let cached: [CategoryListItem] = try await req.cache.get(CacheKey.categories, as: [CategoryListItem].self) {
            items = cached
            fromCache = true
        } else {
            let categories = try await Category.query(on: req.db)
                .with(\.$products)
                .sort(\.$name)
                .all()
            items = categories.map { cat in
                CategoryListItem(
                    id: cat.id!,
                    name: cat.name,
                    description: cat.description ?? "",
                    productCount: cat.products.count
                )
            }
            try await req.cache.set(CacheKey.categories, value: items)
        }

        return try await req.view.render("categories/index", CategoryListContext(categories: items, fromCache: fromCache))
    }

    func createForm(req: Request) async throws -> View {
        try await req.view.render("categories/form", CategoryFormContext(category: nil, title: "Nowa kategoria", action: "/categories"))
    }

    func create(req: Request) async throws -> Response {
        let input = try req.content.decode(CategoryInput.self)
        let category = Category(name: input.name, description: input.description)
        try await category.save(on: req.db)
        await req.cache.invalidate(CacheKey.categories, CacheKey.products)
        return req.redirect(to: "/categories")
    }

    func show(req: Request) async throws -> View {
        let category = try await Category.find(req.parameters.get("categoryID"), on: req.db)
        guard let category else { throw Abort(.notFound) }

        try await category.$products.load(on: req.db)

        let item = CategoryListItem(
            id: category.id!,
            name: category.name,
            description: category.description ?? "",
            productCount: category.products.count
        )
        let products = category.products.map { p in
            ProductListItem(
                id: p.id!,
                name: p.name,
                price: p.price,
                description: p.description ?? "",
                categoryName: category.name,
                reviewCount: 0
            )
        }

        return try await req.view.render("categories/show", CategoryDetailContext(category: item, products: products))
    }

    func editForm(req: Request) async throws -> View {
        let category = try await Category.find(req.parameters.get("categoryID"), on: req.db)
        guard let category else { throw Abort(.notFound) }

        let data = CategoryFormData(
            id: category.id,
            name: category.name,
            description: category.description ?? ""
        )
        return try await req.view.render(
            "categories/form",
            CategoryFormContext(category: data, title: "Edycja kategorii", action: "/categories/\(category.id!.uuidString)/update")
        )
    }

    func update(req: Request) async throws -> Response {
        let category = try await Category.find(req.parameters.get("categoryID"), on: req.db)
        guard let category else { throw Abort(.notFound) }

        let input = try req.content.decode(CategoryInput.self)
        category.name = input.name
        category.description = input.description
        try await category.save(on: req.db)
        await req.cache.invalidate(CacheKey.categories, CacheKey.products)
        return req.redirect(to: "/categories/\(category.id!.uuidString)")
    }

    func delete(req: Request) async throws -> Response {
        let category = try await Category.find(req.parameters.get("categoryID"), on: req.db)
        guard let category else { throw Abort(.notFound) }

        try await category.delete(on: req.db)
        await req.cache.invalidate(CacheKey.categories, CacheKey.products, CacheKey.reviews)
        return req.redirect(to: "/categories")
    }
}

struct CategoryInput: Content {
    let name: String
    let description: String?
}
