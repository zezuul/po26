import Fluent
import Vapor

final class Category: Model, Content {
    static let schema = "categories"

    @ID(key: .id)
    var id: UUID?

    @Field(key: "name")
    var name: String

    @OptionalField(key: "description")
    var description: String?

    @Children(for: \.$category)
    var products: [Product]

    init() {}

    init(id: UUID? = nil, name: String, description: String? = nil) {
        self.id = id
        self.name = name
        self.description = description
    }
}

struct CategoryFormContext: Encodable {
    let category: CategoryFormData?
    let title: String
    let action: String
}

struct CategoryFormData: Encodable {
    let id: UUID?
    let name: String
    let description: String
}

struct CategoryListContext: Encodable {
    let categories: [CategoryListItem]
    let fromCache: Bool
}

struct CategoryListItem: Encodable {
    let id: UUID
    let name: String
    let description: String
    let productCount: Int
}

struct CategoryDetailContext: Encodable {
    let category: CategoryListItem
    let products: [ProductListItem]
}
