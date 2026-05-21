package pl.po26.singleton

/**
 * Singleton Eager — jedyna instancja tworzona przy ładowaniu klasy (Kotlin object).
 */
object EagerAuthSingleton {

    private val users: Map<String, String> = mapOf(
        "admin" to "admin123",
        "user" to "password",
    )

    fun authorize(username: String, password: String): Boolean =
        users[username] == password

    fun instanceId(): String = "eager-${System.identityHashCode(this)}"
}
