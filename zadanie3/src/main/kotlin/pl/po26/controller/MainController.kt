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
            message = if (success) "Autoryzacja poprawna" else "Nieprawidłowa nazwa użytkownika lub hasło",
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
