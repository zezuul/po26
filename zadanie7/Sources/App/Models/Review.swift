import Fluent
import Vapor

final class Review: Model, Content {
    static let schema = "reviews"

    @ID(key: .id)
    var id: UUID?

    @Field(key: "author")
    var author: String

    @Field(key: "rating")
    var rating: Int

    @Field(key: "comment")
    var comment: String

    @Parent(key: "product_id")
    var product: Product

    init() {}

    init(
        id: UUID? = nil,
        author: String,
        rating: Int,
        comment: String,
        productID: UUID
    ) {
        self.id = id
        self.author = author
        self.rating = rating
        self.comment = comment
        self.$product.id = productID
    }
}

struct ReviewFormContext: Encodable {
    let review: ReviewFormData?
    let products: [ProductOption]
    let title: String
    let action: String
}

struct ReviewFormData: Encodable {
    let id: UUID?
    let author: String
    let rating: String
    let comment: String
    let productID: String
}

struct ProductOption: Encodable {
    let id: UUID
    let name: String
}

struct ReviewListContext: Encodable {
    let reviews: [ReviewListItem]
    let fromCache: Bool
}

struct ReviewListItem: Encodable {
    let id: UUID
    let author: String
    let rating: Int
    let comment: String
    let productName: String
}
