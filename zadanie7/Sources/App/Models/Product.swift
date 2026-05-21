import Fluent
import Vapor

final class Product: Model, Content {
    static let schema = "products"

    @ID(key: .id)
    var id: UUID?

    @Field(key: "name")
    var name: String

    @Field(key: "price")
    var price: Double

    @OptionalField(key: "description")
    var description: String?

    @Parent(key: "category_id")
    var category: Category

    @Children(for: \.$product)
    var reviews: [Review]

    init() {}

    init(
        id: UUID? = nil,
        name: String,
        price: Double,
        description: String? = nil,
        categoryID: UUID
    ) {
        self.id = id
        self.name = name
        self.price = price
        self.description = description
        self.$category.id = categoryID
    }
}

struct ProductFormContext: Encodable {
    let product: ProductFormData?
    let categories: [CategoryOption]
    let title: String
    let action: String
}

struct ProductFormData: Encodable {
    let id: UUID?
    let name: String
    let price: String
    let description: String
    let categoryID: String
}

struct CategoryOption: Encodable {
    let id: UUID
    let name: String
}

struct ProductListContext: Encodable {
    let products: [ProductListItem]
    let fromCache: Bool
}

struct ProductListItem: Encodable {
    let id: UUID
    let name: String
    let price: Double
    let description: String
    let categoryName: String
    let reviewCount: Int
}

struct ProductDetailContext: Encodable {
    let product: ProductListItem
    let reviews: [ReviewListItem]
}
