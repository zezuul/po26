package pl.po26.controller

import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import pl.po26.model.AuthRequest
import pl.po26.model.AuthResponse
import pl.po26.model.Item
import pl.po26.service.AuthorizationService

@RestController
@RequestMapping("/api")
class MainController(
    private val authorizationService: AuthorizationService,
) {

    companion object {
        private const val MSG_AUTH_OK = "Autoryzacja poprawna"
        private const val MSG_AUTH_FAIL = "Nieprawidłowa nazwa użytkownika lub hasło"
    }

    private val items: List<Item> = listOf(
        Item(1, "Laptop", "Elektronika"),
        Item(2, "Biurko", "Meble"),
        Item(3, "Monitor", "Elektronika"),
        Item(4, "Krzesło", "Meble"),
        Item(5, "Klawiatura", "Elektronika"),
    )

    @GetMapping("/items")
    fun getItems(): List<Item> = items

    @PostMapping("/auth")
    fun authorize(@RequestBody request: AuthRequest): ResponseEntity<AuthResponse> {
        val success = authorizationService.authorize(request.username, request.password)
        val response = AuthResponse(
            success = success,
            message = if (success) MSG_AUTH_OK else MSG_AUTH_FAIL,
            singletonMode = authorizationService.singletonMode(),
            singletonInstanceId = authorizationService.singletonInstanceId(),
        )

        return if (success) {
            ResponseEntity.ok(response)
        } else {
            ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response)
        }
    }
}
