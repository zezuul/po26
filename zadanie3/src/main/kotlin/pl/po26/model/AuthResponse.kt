package pl.po26.model

data class AuthResponse(
    val success: Boolean,
    val message: String,
    val singletonMode: String,
    val singletonInstanceId: String,
)
