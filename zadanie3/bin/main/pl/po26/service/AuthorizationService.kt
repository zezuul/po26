package pl.po26.service

interface AuthorizationService {
    fun authorize(username: String, password: String): Boolean
    fun singletonMode(): String
    fun singletonInstanceId(): String
}
