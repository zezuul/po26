package pl.po26.singleton

/**
 * Singleton Lazy — instancja tworzona przy pierwszym wywołaniu [instance].
 */
class LazyAuthSingleton private constructor() {

    private val users: Map<String, String> = mapOf(
        "admin" to "admin123",
        "user" to "password",
    )

    fun authorize(username: String, password: String): Boolean =
        users[username] == password

    fun instanceId(): String = "lazy-${System.identityHashCode(this)}"

    companion object {
        val instance: LazyAuthSingleton by lazy(LazyThreadSafetyMode.SYNCHRONIZED) {
            LazyAuthSingleton()
        }
    }
}
